from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConsultationViewSet, MessageViewSet, OrdonnanceViewSet

router = DefaultRouter()
router.register(r'consultations', ConsultationViewSet, basename='consultation')
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'ordonnances', OrdonnanceViewSet, basename='ordonnance')

urlpatterns = [
    path('', include(router.urls)),
]