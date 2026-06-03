from django.db import models
from profil.models import Bebe

class Mesure(models.Model):
    date_mesure = models.DateField()
    date_creation = models.DateTimeField(auto_now_add=True, null=True)
    poids = models.FloatField()
    taille = models.FloatField()
    age_en_mois = models.IntegerField()
    bebe = models.ForeignKey(Bebe, on_delete=models.CASCADE, related_name='mesures')

    class Meta:
        ordering = ['-date_creation', '-date_mesure']

    def __str__(self):
        return f"Mesure {self.date_mesure} — {self.bebe.nom}"

