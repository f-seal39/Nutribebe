# from django.contrib.auth.models import AbstractUser
# from django.db import models
# #from encrypted_model_fields.fields import EncryptedCharField
# from django.core.validators import EmailValidator, RegexValidator
# import re

# ROLE_CHOICES = [
#         ('parent', 'Parent'),
#         ('medecin', 'Médecin'),
#         ('admin', 'Administrateur'),
#     ]

# def validate_phone_number(value):
#     """Valide un numéro de téléphone (format international ou local)"""
#     if not re.match(r'^\+?[1-9]\d{1,14}$', value):
#         raise ValueError('Numéro de téléphone invalide')

# class Utilisateur(AbstractUser):
#     # ... vos autres champs ...
#     email = models.EmailField(unique=True, verbose_name="Adresse email", validators=[EmailValidator()])
#     telephone = EncryptedCharField(max_length=20, unique=True, verbose_name="Téléphone", validators=[validate_phone_number])
#     photo_profil = models.ImageField(upload_to='profils/', blank=True, null=True)
#     statut = models.CharField(max_length=20, default='actif')
#     role = models.CharField(max_length=20, choices=ROLE_CHOICES)

#     def __str__(self):
#         return f"{self.get_full_name()} ({self.role})"

# class Administrateur(models.Model):
#     utilisateur = models.OneToOneField(Utilisateur, on_delete=models.CASCADE)
#     niveau_acces = models.CharField(max_length=50)

#     def __str__(self):
#         return f"Admin — {self.utilisateur.get_full_name()}"

# class Invitation(models.Model):
#     STATUT_CHOICES = [
#         ('en_attente', 'En attente'),
#         ('utilisee', 'Utilisée'),
#         ('expiree', 'Expirée'),
#     ]
#     token_unique = models.CharField(max_length=255, unique=True)
#     date_creation = models.DateTimeField(auto_now_add=True)
#     date_expiration = models.DateTimeField()
#     statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente')
#     email_destinataire = models.EmailField()
#     admin = models.ForeignKey(Administrateur, on_delete=models.CASCADE)

#     def __str__(self):
#         return f"Invitation — {self.email_destinataire}"


from django.contrib.auth.models import AbstractUser
from django.db import models

class Utilisateur(AbstractUser):
    ROLE_CHOICES = [
        ('parent', 'Parent'),
        ('medecin', 'Médecin'),
        ('admin', 'Administrateur'),
    ]
    telephone = models.CharField(max_length=20, blank=True)
    photo_profil = models.ImageField(upload_to='profils/', blank=True, null=True)
    statut = models.CharField(max_length=20, default='actif')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"

class Administrateur(models.Model):
    utilisateur = models.OneToOneField(Utilisateur, on_delete=models.CASCADE)
    niveau_acces = models.CharField(max_length=50)

    def __str__(self):
        return f"Admin — {self.utilisateur.get_full_name()}"

class Invitation(models.Model):
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('utilisee', 'Utilisée'),
        ('expiree', 'Expirée'),
    ]
    token_unique = models.CharField(max_length=255, unique=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_expiration = models.DateTimeField()
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente')
    email_destinataire = models.EmailField()
    admin = models.ForeignKey(Administrateur, on_delete=models.CASCADE)

    def __str__(self):
        return f"Invitation — {self.email_destinataire}"