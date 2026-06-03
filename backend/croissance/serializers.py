from rest_framework import serializers
from .models import Mesure

class MesureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mesure
        fields = ['id', 'date_mesure', 'poids', 
                  'taille', 'age_en_mois', 'bebe']