from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MesureViewSet

router = DefaultRouter()
router.register(r'mesures', MesureViewSet, basename='mesure')

urlpatterns = [
    path('', include(router.urls)),
]