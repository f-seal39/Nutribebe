# from rest_framework import serializers
# from .models import Parent, Medecin, Bebe, Region

# class RegionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Region
#         fields = ['id', 'nom', 'zone']

# class ParentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Parent
#         fields = ['id', 'utilisateur', 'profession', 'adresse']

# class MedecinSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Medecin
#         fields = ['id', 'utilisateur', 'numero_ordre', 'specialite',
#                   'hopital_cabinet', 'ville', 'disponibilite', 'note_moyenne']

# class BebeSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Bebe
#         fields = ['id', 'nom', 'date_naissance', 'sexe',
#                   'poids_naissance', 'taille_naissance', 'parent', 'region']

from rest_framework import serializers
from django.db import transaction
from authentification.models import Utilisateur
from profil.models import Parent, Medecin  # Adaptez l'import selon vos apps


# C:\Users\FSEAL\Desktop\Nutribebe\backend\profil\serializers.py
from rest_framework import serializers
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
    
    class Meta:
        model = Medecin
        fields = ['id', 'utilisateur', 'numero_ordre', 'specialite', 
                  'hopital_cabinet', 'ville', 'disponibilite', 'note_moyenne']

class BebeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bebe
        fields = '__all__'

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