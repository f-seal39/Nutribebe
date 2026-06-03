# from rest_framework import serializers
# from .models import Categorie, Aliment, Repas, Composer
# from .models import Repas, HoraireRepas

# class CategorieSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Categorie
#         fields = ['id', 'libelle', 'description']

# class AlimentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Aliment
#         fields = ['id', 'nom', 'description', 'age_minimum_mois',
#                   'valeur_nutritive', 'image', 'prix_unitaire_fcfa',
#                   'categorie', 'region']

# class ComposerSerializer(serializers.ModelSerializer):
#     nom_aliment = serializers.CharField(source='aliment.nom', read_only=True)
#     prix_unitaire = serializers.FloatField(source='aliment.prix_unitaire_fcfa', read_only=True)
#     cout_ingredient = serializers.SerializerMethodField()

#     class Meta:
#         model = Composer
#         fields = ['id', 'aliment', 'nom_aliment', 'quantite', 
#                   'unite', 'prix_unitaire', 'cout_ingredient']

#     def get_cout_ingredient(self, obj):
#         return round((obj.quantite / 100) * obj.aliment.prix_unitaire_fcfa, 2)

# class RepasSerializer(serializers.ModelSerializer):
#     compositions = ComposerSerializer(many=True, read_only=True, source='composer_set')
#     cout_calcule_fcfa = serializers.SerializerMethodField()

#     class Meta:
#         model = Repas
#         fields = ['id', 'nom', 'heure_repas', 'age_minimum_mois',
#                   'cout_estime_fcfa', 'cout_calcule_fcfa',
#                   'description', 'recette', 'compositions']

#     def get_cout_calcule_fcfa(self, obj):
#         total = sum(
#             (c.quantite / 100) * c.aliment.prix_unitaire_fcfa
#             for c in obj.composer_set.all()
#         )
#         return round(total, 2)

# from rest_framework import serializers
# from .models import RepasProgramme, Repas

# class RepasSimpleSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Repas
#         fields = ['id', 'nom', 'description', 'heure_repas', 'cout_estime_fcfa']


# class RepasProgrammeSerializer(serializers.ModelSerializer):
#     repas = RepasSimpleSerializer(read_only=True)
#     repas_id = serializers.PrimaryKeyRelatedField(
#         queryset=Repas.objects.all(), 
#         source='repas', 
#         write_only=True
#     )
    
# class HoraireRepasSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = HoraireRepas
#         fields = ['id', 'repas', 'heure']

#     class Meta:
#         model = RepasProgramme
#         fields = [
#             'id', 
#             'enfant', 
#             'repas', 
#             'repas_id',
#             'date', 
#             'heure',
#             'active_alarm',
#             'notification_envoyee',
#             'created_at'
#         ]
#         read_only_fields = ['notification_envoyee', 'created_at']
        

# from rest_framework import serializers
# from .models import RepasProgramme
# from .models import Repas   # si ce n'est pas déjà importé


# # Serializer simplifié pour le repas (à afficher dans le planning)
# class RepasSimpleSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Repas
#         fields = ['id', 'nom', 'description', 'heure_repas', 'cout_estime_fcfa', 'recette']


# # Serializer principal pour RepasProgramme
# class RepasProgrammeSerializer(serializers.ModelSerializer):
#     repas = RepasSimpleSerializer(read_only=True)        # Pour lire les détails du repas
#     repas_id = serializers.PrimaryKeyRelatedField(
#         queryset=Repas.objects.all(),
#         source='repas',
#         write_only=True
#     )

#     class Meta:
#         model = RepasProgramme
#         fields = [
#             'id',
#             'bebe',
#             'repas',
#             'repas_id',
#             'date',
#             'heure',
#             'active_alarm',
#             'notification_envoyee',
#             'created_at',
#             'updated_at'
#         ]
#         read_only_fields = ['notification_envoyee', 'created_at', 'updated_at']

# class RepasSerializer(serializers.ModelSerializer):
#     compositions = ComposerSerializer(many=True, read_only=True, source='composer_set')
#     cout_calcule_fcfa = serializers.SerializerMethodField()

#     class Meta:
#         model = Repas
#         fields = ['id', 'nom', 'heure_repas', 'age_minimum_mois',
#                   'cout_estime_fcfa', 'cout_calcule_fcfa',
#                   'description', 'compositions']

#     def get_cout_calcule_fcfa(self, obj):
#         total = sum(
#             (c.quantite / 100) * c.aliment.prix_unitaire_fcfa
#             for c in obj.composer_set.all()
#         )
#         return round(total, 2)

from rest_framework import serializers
from .models import Categorie, Aliment, Repas, Composer, HoraireRepas, RepasProgramme

class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = ['id', 'libelle', 'description']

class AlimentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aliment
        fields = ['id', 'nom', 'description', 'age_minimum_mois',
                  'valeur_nutritive', 'image', 'prix_unitaire_fcfa',
                  'categorie', 'region']

class ComposerSerializer(serializers.ModelSerializer):
    nom_aliment = serializers.CharField(source='aliment.nom', read_only=True)
    prix_unitaire = serializers.FloatField(source='aliment.prix_unitaire_fcfa', read_only=True)
    cout_ingredient = serializers.SerializerMethodField()

    class Meta:
        model = Composer
        fields = ['id', 'aliment', 'nom_aliment', 'quantite', 
                  'unite', 'prix_unitaire', 'cout_ingredient']

    def get_cout_ingredient(self, obj):
        return round((obj.quantite / 100) * obj.aliment.prix_unitaire_fcfa, 2)

class HoraireRepasSerializer(serializers.ModelSerializer):
    class Meta:
        model = HoraireRepas
        fields = ['id', 'repas', 'heure']

# 1. CORRECTION : RepasSerializer nettoyé de 'heure_repas'
class RepasSerializer(serializers.ModelSerializer):
    compositions = ComposerSerializer(many=True, read_only=True, source='composer_set')
    horaires = HoraireRepasSerializer(many=True, read_only=True) # Permet de voir les nouveaux horaires liés en lecture
    cout_calcule_fcfa = serializers.SerializerMethodField()

    class Meta:
        model = Repas
        # 'heure_repas' a été retiré d'ici :
        fields = ['id', 'nom', 'age_minimum_mois', 'cout_estime_fcfa', 
                  'cout_calcule_fcfa', 'description', 'recette', 'compositions', 'horaires']

    def get_cout_calcule_fcfa(self, obj):
        total = sum(
            (c.quantite / 100) * c.aliment.prix_unitaire_fcfa
            for c in obj.composer_set.all()
        )
        return round(total, 2)

# 2. CORRECTION : RepasSimpleSerializer nettoyé de 'heure_repas'
class RepasSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repas
        fields = ['id', 'nom', 'description', 'cout_estime_fcfa', 'recette']


# 3. NETTOYAGE : Serializer principal unique pour RepasProgramme
class RepasProgrammeSerializer(serializers.ModelSerializer):
    repas = RepasSimpleSerializer(read_only=True)
    repas_id = serializers.PrimaryKeyRelatedField(
        queryset=Repas.objects.all(),
        source='repas',
        write_only=True
    )

    class Meta:
        model = RepasProgramme
        fields = [
            'id', 'bebe', 'repas', 'repas_id', 'date', 'heure',
            'active_alarm', 'notification_envoyee', 'created_at', 'updated_at'
        ]
        read_only_fields = ['notification_envoyee', 'created_at', 'updated_at']