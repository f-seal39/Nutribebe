from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Mesure
from .serializers import MesureSerializer

class MesureViewSet(viewsets.ModelViewSet):
    serializer_class = MesureSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Mesure.objects.filter(
            bebe__parent__utilisateur=self.request.user
        )
