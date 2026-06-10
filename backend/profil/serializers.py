from rest_framework import serializers
from django.db import transaction
from django.core.validators import FileExtensionValidator
from authentification.models import Utilisateur
from .models import Parent, Medecin, Bebe, Region

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'

class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class ParentSerializer(serializers.ModelSerializer):
    utilisateur = UtilisateurSerializer(read_only=True)
    
    class Meta:
        model = Parent
        fields = ['id', 'utilisateur', 'profession', 'adresse']

class MedecinSerializer(serializers.ModelSerializer):
    utilisateur = UtilisateurSerializer(read_only=True)
    diplome = serializers.FileField(
        required=False,
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'jpg', 'jpeg', 'png'])]
    )
    
    class Meta:
        model = Medecin
        fields = [
            'id', 'utilisateur', 'numero_ordre', 'specialite',
            'hopital_cabinet', 'ville', 'diplome', 'disponibilite', 'note_moyenne',
        ]
        read_only_fields = ['id', 'utilisateur', 'note_moyenne']

class BebeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bebe
        fields = '__all__'
        read_only_fields = ['parent']
    
    def validate_date_naissance(self, value):
        from datetime import date
        if value > date.today():
            raise serializers.ValidationError("La date de naissance ne peut pas être dans le futur.")
        return value
    
    def validate_poids_naissance(self, value):
        if value <= 0 or value > 10:  # Realistic range: 0.5kg to 10kg
            raise serializers.ValidationError("Le poids de naissance doit être entre 0.5 et 10 kg.")
        return value
    
    def validate_taille_naissance(self, value):
        if value <= 0 or value > 100:  # Realistic range: 30cm to 100cm
            raise serializers.ValidationError("La taille de naissance doit être entre 30 et 100 cm.")
        return value
    

class RegisterSerializer(serializers.ModelSerializer):
    # Champs virtuels capturés lors de l'inscription
    role = serializers.ChoiceField(choices=[('parent', 'Parent'), ('medecin', 'Médecin')], write_only=True)
    
    # Champs spécifiques au médecin
    numero_ordre = serializers.CharField(max_length=100, required=False, write_only=True, allow_blank=True)
    specialite = serializers.CharField(max_length=100, required=False, write_only=True, allow_blank=True)
    ville = serializers.CharField(max_length=100, required=False, write_only=True, allow_blank=True)
    hopital_cabinet = serializers.CharField(max_length=200, required=False, write_only=True, allow_blank=True)

    class Meta:
        model = Utilisateur
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 
                  'role', 'numero_ordre', 'specialite', 'ville', 'hopital_cabinet']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        # Validation conditionnelle : si c'est un médecin, ces champs deviennent obligatoires
        if attrs.get('role') == 'medecin':
            if not attrs.get('numero_ordre'):
                raise serializers.ValidationError({"numero_ordre": "Le numéro d'ordre est obligatoire pour un médecin."})
            if not attrs.get('specialite'):
                raise serializers.ValidationError({"specialite": "La spécialité est obligatoire."})
            if not attrs.get('ville'):
                raise serializers.ValidationError({"ville": "La ville d'exercice est obligatoire."})
        return attrs

    def create(self, validated_data):
        role = validated_data.pop('role')
        
        # Extraction des données médecin
        numero_ordre = validated_data.pop('numero_ordre', '')
        specialite = validated_data.pop('specialite', '')
        ville = validated_data.pop('ville', '')
        hopital_cabinet = validated_data.pop('hopital_cabinet', '')

        # Utilisation d'une transaction atomique pour éviter les profils orphelins en cas de bug
        with transaction.atomic():
            # 1. Création de l'utilisateur de base
            user = Utilisateur.objects.create_user(**validated_data)
            user.role = role   # ← AJOUTER CETTE LIGNE
            user.save()        # ← AJOUTER CETTE LIGNE
            
            # 2. Création du profil lié selon le choix du rôle
            if role == 'medecin':
                Medecin.objects.create(
                    utilisateur=user,
                    numero_ordre=numero_ordre,
                    specialite=specialite,
                    ville=ville,
                    hopital_cabinet=hopital_cabinet
                )
            else:
                Parent.objects.create(utilisateur=user)
                
            return user
        
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Détermination dynamique du rôle pour le Token JWT
        if hasattr(user, 'medecin'):
            token['role'] = 'medecin'
        elif hasattr(user, 'parent'):
            token['role'] = 'parent'
        else:
            token['role'] = 'admin'
            
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Ajout du rôle directement dans la réponse JSON brute (plus facile d'accès pour React)
        if hasattr(self.user, 'medecin'):
            data['role'] = 'medecin'
        elif hasattr(self.user, 'parent'):
            data['role'] = 'parent'
        else:
            data['role'] = 'admin'
        return data
    def create(self, validated_data):
        role = validated_data.pop('role')
        # ... extraction des autres champs ...
        user = Utilisateur.objects.create_user(**validated_data)
        user.role = role   # ← AJOUTER CETTE LIGNE
        user.save()        # ← AJOUTER CETTE LIGNE
        # ... création du profil Parent ou Medecin ...
        return user