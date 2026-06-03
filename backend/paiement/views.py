import time

from rest_framework import viewsets, status, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from profil.models import Parent
from .models import Paiement
from .serializers import PaiementSerializer


class PaiementViewSet(viewsets.ModelViewSet):
    serializer_class = PaiementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            parent = Parent.objects.get(utilisateur=user)
        except Parent.DoesNotExist:
            return Paiement.objects.none()
        return Paiement.objects.filter(parent=parent).order_by('-date_creation')

    def create(self, request, *args, **kwargs):
        try:
            parent = Parent.objects.get(utilisateur=request.user)
        except Parent.DoesNotExist:
            return Response(
                {'detail': "Le profil parent est introuvable."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reference = f"PAY-{request.user.id}-{int(time.time())}"
        montant = serializer.validated_data.get('montant', 0)
        telephone = serializer.validated_data.get('telephone', '')

        statut = 'success' if montant > 0 and telephone else 'failed'
        serializer.save(
            parent=parent,
            reference=reference,
            statut=statut,
        )

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
