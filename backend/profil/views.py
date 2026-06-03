from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Parent, Medecin, Bebe, Region
from .serializers import ParentSerializer, MedecinSerializer, BebeSerializer, RegionSerializer

class RegionViewSet(viewsets.ModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    permission_classes = [IsAuthenticated]

class ParentViewSet(viewsets.ModelViewSet):
    queryset = Parent.objects.all()
    serializer_class = ParentSerializer
    permission_classes = [IsAuthenticated]

class MedecinViewSet(viewsets.ModelViewSet):
    queryset = Medecin.objects.all()
    serializer_class = MedecinSerializer
    permission_classes = [IsAuthenticated]

class BebeViewSet(viewsets.ModelViewSet):
    serializer_class = BebeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Bebe.objects.filter(parent__utilisateur=self.request.user)
