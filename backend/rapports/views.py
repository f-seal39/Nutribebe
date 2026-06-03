from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import FileResponse
from .models import Rapport
from .serializers import RapportSerializer

class RapportViewSet(viewsets.ModelViewSet):
    serializer_class = RapportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Rapport.objects.filter(
            utilisateur=self.request.user
        ).order_by('-date_generation')

    @action(detail=True, methods=['get'])
    def telecharger(self, request, pk=None):
        rapport = self.get_object()
        if rapport.fichier_pdf:
            return FileResponse(
                rapport.fichier_pdf.open(),
                as_attachment=True,
                filename=f"rapport_{rapport.bebe.nom}_{rapport.date_generation.date()}.pdf"
            )
        return Response(
            {'error': 'Fichier PDF non disponible'},
            status=status.HTTP_404_NOT_FOUND
        )
