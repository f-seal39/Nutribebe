from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('titre', 'utilisateur', 'type', 'lu', 'date_envoi')
    list_filter = ('type', 'lu', 'date_envoi')
    search_fields = ('titre', 'contenu', 'utilisateur__email')
    readonly_fields = ('date_envoi',)

    fieldsets = (
        ('Informations', {
            'fields': ('titre', 'contenu', 'utilisateur', 'type')
        }),
        ('Dates', {
            'fields': ('date_envoi',)
        }),
    )

