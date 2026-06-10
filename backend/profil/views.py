from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
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
    serializer_class = MedecinSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, "role", None) == "medecin":
            return Medecin.objects.filter(utilisateur=user)
        return Medecin.objects.select_related("utilisateur").all()

    @action(detail=False, methods=["get"])
    def me(self, request):
        """Profil médecin du compte connecté (table profil_medecin)."""
        from django.shortcuts import get_object_or_404
        medecin = get_object_or_404(Medecin, utilisateur=request.user)
        return Response(MedecinSerializer(medecin).data)
    @action(detail=False, methods=['get'])
    def disponibles(self, request):
        medecins = Medecin.objects.filter(disponibilite=True)
        serializer = MedecinSerializer(medecins, many=True)
        return Response(serializer.data)

class BebeViewSet(viewsets.ModelViewSet):
    serializer_class = BebeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Bebe.objects.filter(parent__utilisateur=self.request.user)

    # def perform_create(self, serializer):
    #     parent = Parent.objects.get(utilisateur=self.request.user)
    #     serializer.save(parent=parent)
    
    def perform_create(self, serializer):
        # Assigner automatiquement le parent connecté
        user = self.request.user
        if hasattr(user, 'parent'):
            serializer.save(parent=user.parent)
        else:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Vous n'avez pas de profil parent.")
