from rest_framework import serializers
from .models import Consultation, Message, Ordonnance

class ConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = ['id', 'date_demande', 'date_rdv', 'heure_rdv',
                  'motif', 'statut', 'note_parent', 
                  'parent', 'medecin', 'bebe']

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'contenu', 'date_envoi', 'heure_envoi',
                  'lu', 'type', 'consultation', 'expediteur']

class OrdonnanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ordonnance
        fields = ['id', 'contenu', 'date_redaction', 'medicaments',
                  'posologie', 'duree_traitement', 'consultation', 'medecin']