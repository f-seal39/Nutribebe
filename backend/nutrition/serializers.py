from rest_framework import serializers
from django.db import transaction
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

# Serializer pour créer/éditer les compositions (ingrédients) imbriquées
# class ComposerNestedSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Composer
#         fields = ['aliment', 'quantite', 'unite']

class ComposerNestedSerializer(serializers.ModelSerializer):
    quantite = serializers.FloatField()
    unite = serializers.CharField(max_length=50)

    class Meta:
        model = Composer
        fields = ['aliment', 'quantite', 'unite']

# Serializer pour créer/éditer les horaires imbriqués
# class HoraireRepasNestedSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = HoraireRepas
#         fields = ['heure']

# class HoraireRepasNestedSerializer(serializers.ModelSerializer):
#     heure = serializers.TimeField(
#         input_formats=['%H:%M', '%H:%M:%S', '%-H:%M'],  # accepte "8:00" et "08:00"
#         format='%H:%M'
#     )

#     class Meta:
#         model = HoraireRepas
#         fields = ['heure']
        
class HoraireRepasNestedSerializer(serializers.ModelSerializer):
    heure = serializers.TimeField(input_formats=['%H:%M', '%H:%M:%S', '%-H:%M'])

    class Meta:
        model = HoraireRepas
        fields = ['heure']

# class ComposerNestedSerializer(serializers.ModelSerializer):
#     quantite = serializers.FloatField(min_value=0.1)

#     class Meta:
#         model = Composer
#         fields = ['aliment', 'quantite', 'unite']

class ComposerNestedSerializer(serializers.Serializer):
    aliment = serializers.PrimaryKeyRelatedField(queryset=Aliment.objects.all())
    quantite = serializers.FloatField(min_value=0.1)
    unite = serializers.CharField(max_length=50)

# Serializer complet pour Repas - permet aux professionnels de créer des repas avec horaires et compositions
class RepasSerializer(serializers.ModelSerializer):
    compositions = ComposerSerializer(many=True, read_only=True, source='composer_set')
    horaires = HoraireRepasSerializer(many=True, read_only=True)
    cout_calcule_fcfa = serializers.SerializerMethodField()
    
    # Champs pour la création/édition imbriquée
    compositions_data = serializers.JSONField(write_only=True, required=False)
    horaires_data = serializers.JSONField(write_only=True, required=False)

    class Meta:
        model = Repas
        fields = ['id', 'nom', 'age_minimum_mois', 'cout_estime_fcfa', 
                  'cout_calcule_fcfa', 'description', 'recette','image',
                  'compositions', 'horaires', 'compositions_data', 'horaires_data']

    def get_cout_calcule_fcfa(self, obj):
        total = sum(
            (c.quantite / 100) * c.aliment.prix_unitaire_fcfa
            for c in obj.composer_set.all()
        )
        return round(total, 2)

    @transaction.atomic
    @transaction.atomic
    def create(self, validated_data):
        compositions_data = validated_data.pop('compositions_data', [])
        horaires_data = validated_data.pop('horaires_data', [])
        
        repas = Repas.objects.create(**validated_data)
        
        # Créer les compositions (ingrédients) en convertissant l'ID aliment en instance
        for comp_data in compositions_data:
            aliment_id = comp_data.pop('aliment')
            aliment = Aliment.objects.get(pk=aliment_id)
            Composer.objects.create(repas=repas, aliment=aliment, **comp_data)
        
        # Créer les horaires
        for horaire_data in horaires_data:
            HoraireRepas.objects.create(repas=repas, **horaire_data)
        
        return repas

    @transaction.atomic
    # def update(self, instance, validated_data):
    #     compositions_data = validated_data.pop('compositions_data', None)
    #     horaires_data = validated_data.pop('horaires_data', None)
        
    #     # Mettre à jour les champs de base
    #     for attr, value in validated_data.items():
    #         setattr(instance, attr, value)
    #     instance.save()
        
    #     # Mettre à jour les compositions si fournies
    #     if compositions_data is not None:
    #         instance.composer_set.all().delete()
    #         for comp_data in compositions_data:
    #             Composer.objects.create(repas=instance, **comp_data)
        
    #     # Mettre à jour les horaires si fournis
    #     if horaires_data is not None:
    #         instance.horaires.all().delete()
    #         for horaire_data in horaires_data:
    #             HoraireRepas.objects.create(repas=instance, **horaire_data)
        
    #     return instance
    
    @transaction.atomic
    def update(self, instance, validated_data):
        compositions_data = validated_data.pop('compositions_data', None)
        horaires_data = validated_data.pop('horaires_data', None)
        
        # Mettre à jour les champs de base
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Mettre à jour les compositions si fournies
        if compositions_data is not None:
            instance.composer_set.all().delete()
            for comp_data in compositions_data:
                aliment_id = comp_data.pop('aliment')
                aliment = Aliment.objects.get(pk=aliment_id)
                Composer.objects.create(repas=instance, aliment=aliment, **comp_data)
        
        # Mettre à jour les horaires si fournis
        if horaires_data is not None:
            instance.horaires.all().delete()
            for horaire_data in horaires_data:
                HoraireRepas.objects.create(repas=instance, **horaire_data)
        
        return instance
        
        # def validate(self, data):
        #     horaires = data.get('horaires_data', [])
        # for h in horaires:
        #     if 'heure' not in h:
        #         raise serializers.ValidationError("Chaque horaire doit avoir une heure.")
        # compositions = data.get('compositions_data', [])
        # for comp in compositions:
        #     if comp.get('quantite', 0) <= 0:
        #         raise serializers.ValidationError("La quantité doit être positive.")
        # return data
        
    # def validate(self, data):
    #         horaires = data.get('horaires_data', [])
    #         if not horaires:
    #             raise serializers.ValidationError({"horaires_data": "Au moins un horaire est requis."})
    #         for h in horaires:
    #             if 'heure' not in h:
    #                 raise serializers.ValidationError("Chaque horaire doit avoir une heure.")
    #         compositions = data.get('compositions_data', [])
    #         if not compositions:
    #             raise serializers.ValidationError({"compositions_data": "Au moins un ingrédient est requis."})
    #         for comp in compositions:
    #             if comp.get('quantite', 0) <= 0:
    #                 raise serializers.ValidationError("Les quantités doivent être positives.")
    #         return data
    
    def validate(self, data):
    # Si horaires_data est une chaîne JSON, on la convertit en liste
        horaires_data = data.get('horaires_data')
        if isinstance(horaires_data, str):
            import json
            try:
                data['horaires_data'] = json.loads(horaires_data)
            except json.JSONDecodeError:
                raise serializers.ValidationError({"horaires_data": "Format JSON invalide."})
    
        compositions_data = data.get('compositions_data')
        if isinstance(compositions_data, str):
            import json
            try:
                data['compositions_data'] = json.loads(compositions_data)
            except json.JSONDecodeError:
                raise serializers.ValidationError({"compositions_data": "Format JSON invalide."})
    
    # Ensuite validation des données (au moins un horaire, etc.)
        horaires = data.get('horaires_data', [])
        if not horaires:
            raise serializers.ValidationError({"horaires_data": "Au moins un horaire est requis."})
        for h in horaires:
            if 'heure' not in h:
                raise serializers.ValidationError("Chaque horaire doit avoir une heure.")
        compositions = data.get('compositions_data', [])
        if not compositions:
            raise serializers.ValidationError({"compositions_data": "Au moins un ingrédient est requis."})
        for comp in compositions:
            if comp.get('quantite', 0) <= 0:
                raise serializers.ValidationError("Les quantités doivent être positives.")
        return data

# 2. CORRECTION : RepasSimpleSerializer nettoyé de 'heure_repas'
class RepasSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repas
        fields = ['id', 'nom', 'description', 'cout_estime_fcfa', 'recette', 'image']


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
        read_only_fields = ['bebe','notification_envoyee', 'created_at', 'updated_at']