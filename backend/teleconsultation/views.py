from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Consultation, Message, Ordonnance
from .serializers import ConsultationSerializer, MessageSerializer, OrdonnanceSerializer
from profil.models import Parent
from paiement.models import Paiement

class ConsultationViewSet(viewsets.ModelViewSet):
    serializer_class = ConsultationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'parent':
            return Consultation.objects.filter(parent__utilisateur=user)
        elif user.role == 'medecin':
            return Consultation.objects.filter(medecin__utilisateur=user)
        return Consultation.objects.all()

    def create(self, request, *args, **kwargs):
        try:
            parent = Parent.objects.get(utilisateur=request.user)
        except Parent.DoesNotExist:
            return Response(
                {'detail': 'Le profil parent est introuvable.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        paiement_valide = Paiement.objects.filter(parent=parent, statut='success').exists()
        if not paiement_valide:
            return Response(
                {
                    'detail': 'Un paiement Mobile Money réussi est requis avant de réserver une consultation.'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(parent=parent)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['post'])
    def noter(self, request, pk=None):
        consultation = self.get_object()
        note = request.data.get('note')
        if note:
            consultation.note_parent = note
            consultation.save()
            medecin = consultation.medecin
            toutes_notes = Consultation.objects.filter(
                medecin=medecin,
                note_parent__isnull=False
            )
            medecin.note_moyenne = sum(
                c.note_parent for c in toutes_notes
            ) / toutes_notes.count()
            medecin.save()
            return Response({'message': 'Note enregistrée'})
        return Response({'error': 'Note manquante'},
                        status=status.HTTP_400_BAD_REQUEST)

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(
            consultation__in=ConsultationViewSet(
                request=self.request
            ).get_queryset()
        )

class OrdonnanceViewSet(viewsets.ModelViewSet):
    serializer_class = OrdonnanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ordonnance.objects.filter(
            medecin__utilisateur=self.request.user
        )
