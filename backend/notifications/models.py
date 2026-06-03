from django.db import models
from authentification.models import Utilisateur


class Notification(models.Model):
    TYPE_CHOICES = [
        ('rappel_repas', 'Rappel repas'),
        ('rappel_rdv', 'Rappel rendez-vous'),
        ('anomalie_croissance', 'Anomalie croissance'),
        ('message', 'Nouveau message'),
        ('invitation', 'Invitation'),
    ]

    titre = models.CharField(max_length=200)
    contenu = models.TextField()
    date_envoi = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    lu = models.BooleanField(default=False)
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.titre} — {self.utilisateur.get_full_name()}"