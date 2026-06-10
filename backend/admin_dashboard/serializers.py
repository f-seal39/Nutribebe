from rest_framework import serializers
from django.db.models import Count, Avg, Sum
from authentification.models import Utilisateur, Administrateur
from profil.models import Parent, Medecin, Bebe
from nutrition.models import Repas, Aliment, RepasProgramme


class StatistiquesGeneralesSerializer(serializers.Serializer):
    """Statistiques globales de l'application"""
    total_utilisateurs = serializers.IntegerField()
    total_parents = serializers.IntegerField()
    total_medecins = serializers.IntegerField()
    total_administrateurs = serializers.IntegerField()
    total_bebes = serializers.IntegerField()
    total_repas = serializers.IntegerField()
    total_repas_programmes = serializers.IntegerField()
    cout_moyen_repas = serializers.FloatField()
    age_moyen_bebes_mois = serializers.FloatField()


class UtilisateurListSerializer(serializers.ModelSerializer):
    """Liste complète des utilisateurs avec leurs profils"""
    role = serializers.CharField(read_only=True)
    profil_type = serializers.SerializerMethodField()
    profil_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Utilisateur
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'telephone', 'role', 'statut', 'date_joined', 
                  'profil_type', 'profil_details']
    
    def get_profil_type(self, obj):
        try:
            if hasattr(obj, 'parent') and obj.parent:
                return 'parent'
            elif hasattr(obj, 'medecin') and obj.medecin:
                return 'medecin'
            elif hasattr(obj, 'administrateur') and obj.administrateur:
                return 'administrateur'
        except:
            pass
        return None
    
    def get_profil_details(self, obj):
        try:
            if hasattr(obj, 'parent') and obj.parent:
                from profil.serializers import ParentSerializer
                return ParentSerializer(obj.parent).data
            elif hasattr(obj, 'medecin') and obj.medecin:
                from profil.serializers import MedecinSerializer
                return MedecinSerializer(obj.medecin).data
            elif hasattr(obj, 'administrateur') and obj.administrateur:
                return AdministrateurSerializer(obj.administrateur).data
        except:
            pass
        return None


class RepasListSerializer(serializers.ModelSerializer):
    """Liste des repas avec statistiques"""
    nombre_ingredients = serializers.SerializerMethodField()
    nombre_programmations = serializers.SerializerMethodField()
    createur = serializers.SerializerMethodField()
    
    class Meta:
        model = Repas
        fields = ['id', 'nom', 'age_minimum_mois', 'cout_estime_fcfa', 
                  'description', 'recette', 'nombre_ingredients', 
                  'nombre_programmations', 'createur']
    
    def get_nombre_ingredients(self, obj):
        return obj.composer_set.count()
    
    def get_nombre_programmations(self, obj):
        return obj.programmations.count()
    
    def get_createur(self, obj):
        # Pour l'instant, retourne None car le modèle Repas n'a pas de champ createur
        # Vous pouvez ajouter un champ createur ForeignKey si nécessaire
        return None


class RepasDetailSerializer(serializers.ModelSerializer):
    """Détails complets d'un repas avec ingrédients et horaires"""
    compositions = serializers.SerializerMethodField()
    horaires = serializers.SerializerMethodField()
    nombre_programmations = serializers.IntegerField(source='programmations.count', read_only=True)
    
    class Meta:
        model = Repas
        fields = ['id', 'nom', 'age_minimum_mois', 'cout_estime_fcfa', 
                  'description', 'recette', 'compositions', 'horaires', 
                  'nombre_programmations']
    
    def get_compositions(self, obj):
        from nutrition.serializers import ComposerSerializer
        return ComposerSerializer(obj.composer_set.all(), many=True).data
    
    def get_horaires(self, obj):
        from nutrition.serializers import HoraireRepasSerializer
        return HoraireRepasSerializer(obj.horaires.all(), many=True).data


class BebeListSerializer(serializers.ModelSerializer):
    """Liste des bébés avec leurs parents"""
    parent_nom = serializers.CharField(source='parent.utilisateur.get_full_name', read_only=True)
    parent_email = serializers.CharField(source='parent.utilisateur.email', read_only=True)
    age_mois = serializers.SerializerMethodField()
    
    class Meta:
        model = Bebe
        fields = ['id', 'nom', 'date_naissance', 'sexe', 
                  'poids_naissance', 'taille_naissance', 
                  'parent_nom', 'parent_email', 'age_mois']
    
    def get_age_mois(self, obj):
        from datetime import date
        today = date.today()
        return (today.year - obj.date_naissance.year) * 12 + (today.month - obj.date_naissance.month)


class MedecinListSerializer(serializers.ModelSerializer):
    """Liste des médecins avec leurs statistiques"""
    utilisateur = serializers.SerializerMethodField()
    nombre_repas_crees = serializers.SerializerMethodField()
    
    class Meta:
        model = Medecin
        fields = ['id', 'numero_ordre', 'specialite', 'hopital_cabinet', 
                  'ville', 'disponibilite', 'note_moyenne', 
                  'utilisateur', 'nombre_repas_crees']
    
    def get_utilisateur(self, obj):
        return {
            'id': obj.utilisateur.id,
            'username': obj.utilisateur.username,
            'email': obj.utilisateur.email,
            'full_name': obj.utilisateur.get_full_name(),
            'telephone': obj.utilisateur.telephone
        }
    
    def get_nombre_repas_crees(self, obj):
        # Pour l'instant retourne 0 car Repas n'a pas de champ createur
        # Vous pouvez ajouter ce champ plus tard
        return 0
