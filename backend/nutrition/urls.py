from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategorieViewSet,
    AlimentViewSet,
    HoraireRepasViewSet,
    RepasViewSet,
    ComposerViewSet,
    RepasProgrammeViewSet,
)

router = DefaultRouter()
router.register(r'categories', CategorieViewSet, basename='categorie')
router.register(r'aliments', AlimentViewSet, basename='aliment')
router.register(r'repas', RepasViewSet, basename='repas')
router.register(r'compositions', ComposerViewSet, basename='composer')
router.register(r'repas-programmes', RepasProgrammeViewSet, basename='repas-programme')
router.register(r'horaires-repas', HoraireRepasViewSet, basename='horaires-repas')

urlpatterns = [
    path('', include(router.urls)),
]