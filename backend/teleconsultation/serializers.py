# from rest_framework import serializers
# from .models import Consultation, Message, Ordonnance

# class ConsultationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Consultation
#         fields = ['id', 'date_demande', 'date_rdv', 'heure_rdv',
#                   'motif', 'statut', 'note_parent', 
#                   'parent', 'medecin', 'bebe']

# class MessageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Message
#         fields = ['id', 'contenu', 'date_envoi', 'heure_envoi',
#                   'lu', 'type', 'consultation', 'expediteur']

# class OrdonnanceSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Ordonnance
#         fields = ['id', 'contenu', 'date_redaction', 'medicaments',
#                   'posologie', 'duree_traitement', 'consultation', 'medecin']


from rest_framework import serializers
from .models import Conversation, Message
from authentification.models import Utilisateur

class ConversationSerializer(serializers.ModelSerializer):
    parent_name = serializers.CharField(source='parent.utilisateur.get_full_name', read_only=True)
    medecin_name = serializers.CharField(source='medecin.utilisateur.get_full_name', read_only=True)
    last_message = serializers.SerializerMethodField()
    last_message_time = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'parent_name', 'medecin_name', 'last_message', 'last_message_time', 'created_at']

    def get_last_message(self, obj):
        last = obj.messages.order_by('-created_at').first()
        return last.content if last else None

    def get_last_message_time(self, obj):
        last = obj.messages.order_by('-created_at').first()
        return last.created_at if last else None

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    sender_role = serializers.CharField(source='sender.role', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'sender_name', 'sender_role', 'content', 'is_read', 'created_at']
        read_only_fields = ['sender', 'created_at', 'is_read']