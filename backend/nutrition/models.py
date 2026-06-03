from django.db import models
from profil.models import Region

class Categorie(models.Model):
    libelle = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.libelle

class Aliment(models.Model):
    nom = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    age_minimum_mois = models.IntegerField()
    valeur_nutritive = models.TextField(blank=True)
    image = models.ImageField(upload_to='aliments/', blank=True, null=True)
    prix_unitaire_fcfa = models.FloatField(default=0.0)
    allergenes = models.CharField(max_length=200, blank=True)
    categorie = models.ForeignKey(Categorie, on_delete=models.SET_NULL, null=True)
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.nom

class Repas(models.Model):
    nom = models.CharField(max_length=100)
    #heure_repas = models.TimeField()
    age_minimum_mois = models.IntegerField()
    cout_estime_fcfa = models.FloatField()
    description = models.TextField(blank=True)
    recette = models.TextField(blank=True)


class HoraireRepas(models.Model):
    repas = models.ForeignKey(Repas, on_delete=models.CASCADE, related_name='horaires')
    heure = models.TimeField()
    def __str__(self):
        return f"{self.repas.nom} à {self.heure}"
    # def __str__(self):
    #     return self.nom
    


class Composer(models.Model):
    repas = models.ForeignKey(Repas, on_delete=models.CASCADE)
    aliment = models.ForeignKey(Aliment, on_delete=models.CASCADE)
    quantite = models.FloatField()
    unite = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.aliment.nom} dans {self.repas.nom}"
    
from django.db import models
from django.utils import timezone
from profil.models import Bebe   # ← Important : Bebe et non Enfant


class RepasProgramme(models.Model):
    """
    Associe un repas à un bébé à une date et heure précise avec alarme.
    """
    bebe = models.ForeignKey(
        Bebe,                          # ← Correction ici
        on_delete=models.CASCADE, 
        related_name='repas_programmes'
    )
    
    repas = models.ForeignKey(
        'Repas', 
        on_delete=models.CASCADE, 
        related_name='programmations'
    )
    
    date = models.DateField(default=timezone.now)
    heure = models.TimeField()
    
    active_alarm = models.BooleanField(default=True)
    notification_envoyee = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['date', 'heure']
        unique_together = ('bebe', 'repas', 'date', 'heure')
        verbose_name = "Repas programmé"
        verbose_name_plural = "Repas programmés"

    def __str__(self):
        return f"{self.repas.nom} - {self.date} à {self.heure}"

# from django.db import models
# from profil.models import Bebe  # ou Utilisateur selon ta structure

# class RepasProgramme(models.Model):
#     Bebe = models.ForeignKey(Bebe, on_delete=models.CASCADE, related_name='repas_programmes')
#     repas = models.ForeignKey('Repas', on_delete=models.CASCADE)
#     date = models.DateField()
#     heure = models.TimeField()          # Peut overrider heure_repas du Repas
#     active_alarm = models.BooleanField(default=True)
#     notification_envoyee = models.BooleanField(default=False)
#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         ordering = ['date', 'heure']
#         unique_together = ('enfant', 'repas', 'date', 'heure')

#     def __str__(self):
#         return f"{self.repas.nom} - {self.date} {self.heure}"


# from django.db import models
# from django.utils import timezone
# from profil.models import Bebe  # Ajuste selon le nom réel de ton modèle Enfant


# class RepasProgramme(models.Model):
#     """
#     Associe un repas à un enfant à une date et heure précise
#     avec gestion d'alarme.
#     """
#     Bebe = models.ForeignKey(
#         Bebe, 
#         on_delete=models.CASCADE, 
#         related_name='repas_programmes'
#     )
    
#     repas = models.ForeignKey(
#         'Repas', 
#         on_delete=models.CASCADE, 
#         related_name='programmations'
#     )
    
#     date = models.DateField(default=timezone.now)
#     heure = models.TimeField()                    # Peut être différent de repas.heure_repas
    
#     active_alarm = models.BooleanField(default=True)
#     notification_envoyee = models.BooleanField(default=False)
    
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         ordering = ['date', 'heure']
#         unique_together = ('Bebe', 'repas', 'date', 'heure')
#         verbose_name = "Repas programmé"
#         verbose_name_plural = "Repas programmés"

#     def __str__(self):
#         return f"{self.repas.nom} - {self.date} à {self.heure} ({self.Bebe})"

#     def est_passe(self):
#         """Vérifie si le repas est déjà passé"""
#         now = timezone.now()
#         repas_datetime = timezone.make_aware(
#             timezone.datetime.combine(self.date, self.heure)
#         )
#         return repas_datetime < now

# class Aliment(models.Model):
#     nom = models.CharField(max_length=100)
#     description = models.TextField(blank=True)
#     age_minimum_mois = models.IntegerField()
#     valeur_nutritive = models.TextField(blank=True)
#     image = models.ImageField(upload_to='aliments/', blank=True, null=True)
#     prix_unitaire_fcfa = models.FloatField(default=0.0)
#     allergenes = models.CharField(max_length=200, blank=True)  # ← nouveau
#     categorie = models.ForeignKey(Categorie, on_delete=models.SET_NULL, null=True)
#     region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True)

#     def __str__(self):
#         return self.nom