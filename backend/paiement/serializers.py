from rest_framework import serializers
from .models import Paiement


class PaiementSerializer(serializers.ModelSerializer):
    provider_display = serializers.CharField(source='get_provider_display', read_only=True)

    class Meta:
        model = Paiement
        fields = [
            'id',
            'parent',
            'provider',
            'provider_display',
            'montant',
            'telephone',
            'statut',
            'reference',
            'description',
            'date_creation',
            'date_mise_a_jour',
        ]
        read_only_fields = [
            'id',
            'parent',
            'statut',
            'reference',
            'date_creation',
            'date_mise_a_jour',
        ]
