from django.contrib import admin
from .models import Paiement


@admin.register(Paiement)
class PaiementAdmin(admin.ModelAdmin):
    list_display = ('reference', 'parent', 'provider', 'montant', 'statut', 'date_creation')
    list_filter = ('provider', 'statut')
    search_fields = ('reference', 'telephone', 'parent__utilisateur__username')
