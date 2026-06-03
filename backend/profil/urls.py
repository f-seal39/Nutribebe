from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ParentViewSet, MedecinViewSet, BebeViewSet, RegionViewSet

router = DefaultRouter()
router.register(r'regions', RegionViewSet, basename='region')
router.register(r'parents', ParentViewSet, basename='parent')
router.register(r'medecins', MedecinViewSet, basename='medecin')
router.register(r'bebes', BebeViewSet, basename='bebe')

urlpatterns = [
    path('', include(router.urls)),
]