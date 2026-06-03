from django.db import models
from profil.models import Parent, Medecin, Bebe
from authentification.models import Utilisateur

class Consultation(models.Model):
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('confirmee', 'Confirmée'),
        ('refusee', 'Refusée'),
        ('terminee', 'Terminée'),
    ]
    date_demande = models.DateTimeField(auto_now_add=True)
    date_rdv = models.DateField(null=True, blank=True)
    heure_rdv = models.TimeField(null=True, blank=True)
    motif = models.TextField()
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente')
    note_parent = models.FloatField(null=True, blank=True)
    parent = models.ForeignKey(Parent, on_delete=models.CASCADE)
    medecin = models.ForeignKey(Medecin, on_delete=models.CASCADE)
    bebe = models.ForeignKey(Bebe, on_delete=models.CASCADE)

    def __str__(self):
        return f"Consultation {self.date_rdv} — {self.parent} / {self.medecin}"

class Message(models.Model):
    TYPE_CHOICES = [('text', 'Texte'), ('fichier', 'Fichier')]
    contenu = models.TextField()
    date_envoi = models.DateField(auto_now_add=True)
    heure_envoi = models.TimeField(auto_now_add=True)
    lu = models.BooleanField(default=False)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='text')
    consultation = models.ForeignKey(Consultation, on_delete=models.CASCADE)
    expediteur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)

    def __str__(self):
        return f"Message {self.date_envoi} — {self.expediteur.get_full_name()}"

class Ordonnance(models.Model):
    contenu = models.TextField()
    date_redaction = models.DateField(auto_now_add=True)
    medicaments = models.TextField()
    posologie = models.TextField()
    duree_traitement = models.CharField(max_length=100)
    # consultation = models.OneToOneField(Consultation, on_delete=models.CASCADE)
    consultation = models.ForeignKey(Consultation, on_delete=models.CASCADE, null=True, blank=True)
    medecin = models.ForeignKey(Medecin, on_delete=models.CASCADE)

    def __str__(self):
        return f"Ordonnance {self.date_redaction} — {self.medecin}"
