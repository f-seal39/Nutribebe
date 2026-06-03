from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id',
            'titre',
            'contenu',
            'type',
            'lu',
            'date_envoi',
            'utilisateur'
        ]
        read_only_fields = ['id', 'date_envoi', 'utilisateur']
