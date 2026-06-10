from django.db import models
from django.conf import settings
from profil.models import Parent, Medecin

class Conversation(models.Model):
    parent = models.ForeignKey(Parent, on_delete=models.CASCADE, related_name='conversations')
    medecin = models.ForeignKey(Medecin, on_delete=models.CASCADE, related_name='conversations')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('parent', 'medecin')

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)