
import os
# CORRECTION : On importe get_asgi_application et non get_django_asgi_app
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Initialisation de l'application ASGI Django
django_asgi_app = get_asgi_application()

# Pour l'instant, Daphne utilisera cette application de base
application = django_asgi_app

# import os
# from django.core.asgi import get_django_asgi_app
# from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.auth import AuthMiddlewareStack
# import django

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
# django.setup()

# from notifications.routing import websocket_urlpatterns

# application = ProtocolTypeRouter({
#     "http": get_django_asgi_app(),
#     "websocket": AuthMiddlewareStack(
#         URLRouter(
#             websocket_urlpatterns
#         )
#     ),
# })

