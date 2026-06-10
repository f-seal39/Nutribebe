from rest_framework import serializers
from django.db import transaction
from .models import Utilisateur, Administrateur, Invitation
from profil.models import Medecin, Parent
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role   # Ajoute le rôle dans le token
        return token
    
    
def _normaliser_role(role):
    if isinstance(role, (list, tuple)):
        role = role[0] if role else "parent"
    return str(role or "parent").strip().lower()


class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ['id', 'username', 'first_name', 'last_name', 
                  'email', 'telephone', 'photo_profil', 
                  'statut', 'role']


class InscriptionSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(
        choices=[("parent", "Parent"), ("medecin", "Médecin")],
        default="parent",
    )
    password = serializers.CharField(write_only=True)
    numero_ordre = serializers.CharField(write_only=True, required=False)
    specialite = serializers.CharField(write_only=True, required=False)
    hopital_cabinet = serializers.CharField(write_only=True, required=False, allow_blank=True)
    ville = serializers.CharField(write_only=True, required=False)
    diplome = serializers.FileField(write_only=True, required=False)

    class Meta:
        model = Utilisateur
        fields = ['username', 'first_name', 'last_name', 
                  'email', 'telephone', 'password', 'role', 'numero_ordre', 
                  'specialite', 'hopital_cabinet', 'ville', 'diplome']
        
    # --- MÉTHODE VALIDATE PLACÉE AU BON NIVEAU ET SÉCURISÉE ---
    def validate(self, attrs):
        email = attrs.get('email')
        telephone = attrs.get('telephone')
        username = attrs.get('username')

        # 1. Vérifier si l'email existe déjà
        if email and Utilisateur.objects.filter(email=email).exists():
            raise serializers.ValidationError({
                "email": "Un utilisateur avec cette adresse email existe déjà."
            })

        # 2. Vérifier si le numéro de téléphone existe déjà
        if telephone and Utilisateur.objects.filter(telephone=telephone).exists():
            raise serializers.ValidationError({
                "telephone": "Ce numéro de téléphone est déjà associé à un compte."
            })
            
        # 3. Vérifier si le username existe déjà
        if username and Utilisateur.objects.filter(username=username).exists():
            raise serializers.ValidationError({
                "username": "Cet identifiant est déjà pris."
            })

        role = _normaliser_role(attrs.get("role", "parent"))
        attrs["role"] = role
        if role == "medecin":
            champs_obligatoires = {
                'numero_ordre': "Le numéro d'ordre est obligatoire pour un professionnel de santé.",
                'specialite': "La spécialité est obligatoire.",
                'ville': "La ville d'exercice est obligatoire.",
            }
            erreurs = {}
            for champ, message in champs_obligatoires.items():
                if not attrs.get(champ):
                    erreurs[champ] = message
            if erreurs:
                raise serializers.ValidationError(erreurs)

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        numero_ordre = validated_data.pop("numero_ordre", None)
        specialite = validated_data.pop("specialite", None)
        hopital_cabinet = validated_data.pop("hopital_cabinet", None)
        ville = validated_data.pop("ville", None)
        diplome = validated_data.pop("diplome", None)

        password = validated_data.pop("password")
        role = _normaliser_role(validated_data.pop("role", "parent"))

        utilisateur = Utilisateur(**validated_data)
        utilisateur.role = role
        utilisateur.set_password(password)
        utilisateur.save()

        if role == "medecin":
            medecin_kwargs = {
                "utilisateur": utilisateur,
                "numero_ordre": numero_ordre,
                "specialite": specialite,
                "hopital_cabinet": hopital_cabinet or "",
                "ville": ville,
                "disponibilite": True,
            }
            if diplome is not None:
                medecin_kwargs["diplome"] = diplome
            Medecin.objects.create(**medecin_kwargs)
            if not Medecin.objects.filter(utilisateur=utilisateur).exists():
                raise serializers.ValidationError(
                    {"profil": "Le profil médecin n'a pas pu être enregistré."}
                )
        elif role == "parent":
            Parent.objects.create(utilisateur=utilisateur)
            if not Parent.objects.filter(utilisateur=utilisateur).exists():
                raise serializers.ValidationError(
                    {"profil": "Le profil parent n'a pas pu être enregistré."}
                )

        return utilisateur


class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = ['id', 'token_unique', 'date_creation', 
                  'date_expiration', 'statut', 'email_destinataire']


class AdministrateurSerializer(serializers.ModelSerializer):
    utilisateur = UtilisateurSerializer(read_only=True)
    
    class Meta:
        model = Administrateur
        fields = ['id', 'utilisateur', 'niveau_acces']