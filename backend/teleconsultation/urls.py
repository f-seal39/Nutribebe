# from rest_framework.routers import DefaultRouter
# from .views import ConversationViewSet, MessageViewSet
# from django.urls import include, path

# router = DefaultRouter()
# router.register(r'conversations', ConversationViewSet, basename='conversation')
# router.register(r'messages', MessageViewSet, basename='message')
# urlpatterns = [
#     path('', include(router.urls)),
#     # Route manuelle pour la liste des médecins
#     path('conversations/medecins-disponibles/', ConversationViewSet.as_view({'get': 'medecins_disponibles'}), name='medecins-disponibles'),
#     path('conversations/creer-conversation/', ConversationViewSet.as_view({'post': 'creer_conversation'}), name='creer-conversation'),
# ]


from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConversationViewSet, MessageViewSet, ParentMessagerieViewSet

router = DefaultRouter()
router.register(r'conversations', ConversationViewSet, basename='conversation')
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'parent/medecins', ParentMessagerieViewSet, basename='parent-medecins')

urlpatterns = router.urls