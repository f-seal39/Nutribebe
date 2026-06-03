from rest_framework import serializers
from .models import Rapport

class RapportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rapport
        fields = ['id', 'date_generation', 'type', 
                  'fichier_pdf', 'bebe', 'utilisateur']
