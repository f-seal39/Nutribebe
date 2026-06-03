# from rest_framework import serializers
# from .models import Utilisateur, Administrateur, Invitation
# from profil.models import Medecin, Parent


# class UtilisateurSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Utilisateur
#         fields = ['id', 'username', 'first_name', 'last_name', 
#                   'email', 'telephone', 'photo_profil', 
#                   'statut', 'role']

# class InscriptionSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True)
#     numero_ordre = serializers.CharField(write_only=True, required=False)
#     specialite = serializers.CharField(write_only=True, required=False)
#     hopital_cabinet = serializers.CharField(write_only=True, required=False, allow_blank=True)
#     ville = serializers.CharField(write_only=True, required=False)
#     diplome = serializers.FileField(write_only=True, required=False)

#     class Meta:
#         model = Utilisateur
#         fields = ['username', 'first_name', 'last_name', 
#                   'email', 'telephone', 'password', 'role','numero_ordre', 'specialite', 'hopital_cabinet', 
#             'ville', 'diplome']
        
        
#         def validate(self, attrs):
#         email = attrs.get('email')
#         telephone = attrs.get('telephone')
#         username = attrs.get('username')

#         # 1. Vérifier si l'email existe déjà
#         if Utilisateur.objects.filter(email=email).exists():
#             raise serializers.ValidationError({
#                 "email": "Un utilisateur avec cette adresse email existe déjà."
#             })

        
#         if Utilisateur.objects.filter(telephone=telephone).exists():
#             raise serializers.ValidationError({
#                 "telephone": "Ce numéro de téléphone est déjà associé à un compte."
#             })
            
        
#         if Utilisateur.objects.filter(username=username).exists():
#             raise serializers.ValidationError({
#                 "username": "Cet identifiant est déjà pris."
#             })

#         return attrs

#     def create(self, validated_data):
#         numero_ordre = validated_data.pop('numero_ordre', None)
#         specialite = validated_data.pop('specialite', None)
#         hopital_cabinet = validated_data.pop('hopital_cabinet', None)
#         ville = validated_data.pop('ville', None)
#         diplome = validated_data.pop('diplome', None)
        
        
#         password = validated_data.pop('password')
#         utilisateur = Utilisateur(**validated_data)
#         utilisateur.set_password(password)
#         utilisateur.save()
        
#         if validated_data.get('role') == 'medecin':
#             Medecin.objects.create(
#                 utilisateur=utilisateur,
#                 numero_ordre=numero_ordre,
#                 specialite=specialite,
#                 hopital_cabinet=hopital_cabinet,
#                 ville=ville,
#                 diplome=diplome, # Sauvegarde du fichier dans le FileField ou ImageField du modèle
#                 disponibilite=True
#             )
#         return utilisateur
    
# def create(self, validated_data):
#         numero_ordre = validated_data.pop('numero_ordre', None)
#         specialite = validated_data.pop('specialite', None)
#         hopital_cabinet = validated_data.pop('hopital_cabinet', None)
#         ville = validated_data.pop('ville', None)
#         diplome = validated_data.pop('diplome', None)
        
#         password = validated_data.pop('password')
#         role = validated_data.get('role', 'parent') # Récupère le rôle
        
#         utilisateur = Utilisateur(**validated_data)
#         utilisateur.set_password(password)
#         utilisateur.save()
        
#         if role == 'medecin':
#             Medecin.objects.create(
#                 utilisateur=utilisateur,
#                 numero_ordre=numero_ordre,
#                 specialite=specialite,
#                 hopital_cabinet=hopital_cabinet,
#                 ville=ville,
#                 diplome=diplome,
#                 disponibilite=True
#             )
#         elif role == 'parent':
#             # Crée automatiquement le profil Parent lié à l'utilisateur
#             Parent.objects.create(
#                 utilisateur=utilisateur,
#                 # Ajoutez ici des champs spécifiques au modèle Parent si vous en avez (ex: ville=ville)
#             )
            
#         return utilisateur

# class InvitationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Invitation
#         fields = ['id', 'token_unique', 'date_creation', 
#                   'date_expiration', 'statut', 'email_destinataire']



from rest_framework import serializers
from .models import Utilisateur, Administrateur, Invitation
from profil.models import Medecin, Parent


class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ['id', 'username', 'first_name', 'last_name', 
                  'email', 'telephone', 'photo_profil', 
                  'statut', 'role']


class InscriptionSerializer(serializers.ModelSerializer):
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

        return attrs

    # --- MÉTHODE CREATE UNIQUE ET PROPRE ---
    def create(self, validated_data):
        numero_ordre = validated_data.pop('numero_ordre', None)
        specialite = validated_data.pop('specialite', None)
        hopital_cabinet = validated_data.pop('hopital_cabinet', None)
        ville = validated_data.pop('ville', None)
        diplome = validated_data.pop('diplome', None)
        
        password = validated_data.pop('password')
        role = validated_data.get('role', 'parent') 
        
        # Création de l'utilisateur de base
        utilisateur = Utilisateur(**validated_data)
        utilisateur.set_password(password)
        utilisateur.save()
        
        # Extension de profil selon le rôle
        if role == 'medecin':
            Medecin.objects.create(
                utilisateur=utilisateur,
                numero_ordre=numero_ordre,
                specialite=specialite,
                hopital_cabinet=hopital_cabinet,
                ville=ville,
                diplome=diplome,
                disponibilite=True
            )
        elif role == 'parent':
            # Crée automatiquement le profil Parent lié à l'utilisateur NutriBébéCam
            Parent.objects.create(
                utilisateur=utilisateur
            )
            
        return utilisateur


class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = ['id', 'token_unique', 'date_creation', 
                  'date_expiration', 'statut', 'email_destinataire']