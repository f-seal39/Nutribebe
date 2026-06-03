from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import AuthViewSet, InvitationViewSet

router = DefaultRouter()
router.register(r'invitations', InvitationViewSet, basename='invitation')

urlpatterns = [
    path('', include(router.urls)),
    path('inscription/', AuthViewSet.as_view({'post': 'inscription'})),
    path('connexion/', AuthViewSet.as_view({'post': 'connexion'})),
    path('profil/', AuthViewSet.as_view({'get': 'profil'})),
    path('token/refresh/', TokenRefreshView.as_view()),
]