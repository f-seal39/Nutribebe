from django.db import models
from profil.models import Parent


class Paiement(models.Model):
    PROVIDER_CHOICES = [
        ('mtn', 'MTN Mobile Money'),
        ('orange', 'Orange Money'),
    ]

    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('success', 'Payé'),
        ('failed', 'Échoué'),
    ]

    parent = models.ForeignKey(Parent, on_delete=models.CASCADE, related_name='paiements')
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES)
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    telephone = models.CharField(max_length=20)
    statut = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reference = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=255, blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_mise_a_jour = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.get_provider_display()} {self.montant} FCFA — {self.reference}"
