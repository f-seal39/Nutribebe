"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API Routes
    path('api/auth/', include('authentification.urls')),
    path('api/profil/', include('profil.urls')),
    path('api/croissance/', include('croissance.urls')),
    path('api/nutrition/', include('nutrition.urls')),
    # path('api/teleconsultation/', include('teleconsultation.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/rapports/', include('rapports.urls')),
    path('api/paiement/', include('paiement.urls')),
    path('api/admin/', include('admin_dashboard.urls')),
    
    # Non-API route (si nécessaire pour votre structure)
    path('nutrition/', include('nutrition.urls')),
    path('api/chat/', include('teleconsultation.urls')),
    path('api/admin/stats/', include('admin_dashboard.urls')),
]

# Servir les fichiers médias en développement
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)