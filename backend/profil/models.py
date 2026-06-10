from django.db import models
from django.core.validators import RegexValidator
from authentification.models import Utilisateur


telephone_validator = RegexValidator(
    regex=r'^\+?[0-9]{8,15}$',
    message="Entrez un numéro de téléphone valide."
)

class Region(models.Model):
    nom = models.CharField(max_length=100)
    zone = models.CharField(max_length=100)

    def __str__(self):
        return self.nom

class Parent(models.Model):
    utilisateur = models.OneToOneField(Utilisateur, on_delete=models.CASCADE)
    profession = models.CharField(max_length=100, blank=True)
    adresse = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Parent — {self.utilisateur.get_full_name()}"

class Medecin(models.Model):
    utilisateur = models.OneToOneField(Utilisateur, on_delete=models.CASCADE)
    numero_ordre = models.CharField(max_length=100)
    specialite = models.CharField(max_length=100)
    hopital_cabinet = models.CharField(max_length=200, blank=True)
    ville = models.CharField(max_length=100)
    diplome = models.FileField(upload_to='medecins/diplomes/', blank=True, null=True)
    disponibilite = models.BooleanField(default=True)
    note_moyenne = models.FloatField(default=0.0)

    def __str__(self):
        return f"Dr. {self.utilisateur.get_full_name()}"

class Bebe(models.Model):
    SEXE_CHOICES = [('M', 'Masculin'), ('F', 'Féminin')]
    nom = models.CharField(max_length=100)
    date_naissance = models.DateField()
    sexe = models.CharField(max_length=1, choices=SEXE_CHOICES)
    poids_naissance = models.FloatField()
    taille_naissance = models.FloatField()
    parent = models.ForeignKey(Parent, on_delete=models.CASCADE)
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.nom} — {self.parent.utilisateur.get_full_name()}"

class Allergie(models.Model):
    SUBSTANCES = [
        ('gluten', 'Gluten'),
        ('lactose', 'Lactose'),
        ('arachides', 'Arachides'),
        ('soja', 'Soja'),
        ('oeufs', 'Œufs'),
        ('poisson', 'Poisson'),
        ('fruits_mer', 'Fruits de mer'),
        ('noix', 'Noix'),
        ('autre', 'Autre'),
    ]
    nom = models.CharField(max_length=100, choices=SUBSTANCES)
    autre_precision = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.nom

class AllergiBebe(models.Model):
    bebe = models.ForeignKey(Bebe, on_delete=models.CASCADE, related_name='allergies')
    allergie = models.ForeignKey(Allergie, on_delete=models.CASCADE)
    date_detection = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.bebe.nom} — {self.allergie.nom}"