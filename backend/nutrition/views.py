from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Categorie, Aliment, Repas, Composer
from .serializers import CategorieSerializer, AlimentSerializer, RepasSerializer, ComposerSerializer
from .models import HoraireRepas
from .serializers import HoraireRepasSerializer

class CategorieViewSet(viewsets.ModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    permission_classes = [IsAuthenticated]
    
class HoraireRepasViewSet(viewsets.ModelViewSet):
    queryset = HoraireRepas.objects.all()
    serializer_class = HoraireRepasSerializer
    permission_classes = [IsAuthenticated]

class AlimentViewSet(viewsets.ModelViewSet):
    serializer_class = AlimentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        age = self.request.query_params.get('age')
        if age:
            return Aliment.objects.filter(age_minimum_mois__lte=age)
        return Aliment.objects.all()

class RepasViewSet(viewsets.ModelViewSet):
    serializer_class = RepasSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        age = self.request.query_params.get('age')
        if age:
            return Repas.objects.filter(age_minimum_mois__lte=age)
        return Repas.objects.all()

class ComposerViewSet(viewsets.ModelViewSet):
    queryset = Composer.objects.all()
    serializer_class = ComposerSerializer
    permission_classes = [IsAuthenticated]
    
    
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import RepasProgramme
from .serializers import RepasProgrammeSerializer


class RepasProgrammeViewSet(viewsets.ModelViewSet):
    serializer_class = RepasProgrammeSerializer
    queryset = RepasProgramme.objects.all()

    def get_queryset(self):
        """Filtre par enfant de l'utilisateur connecté"""
        user = self.request.user
        # Ajuste selon ta logique d'authentification
        return RepasProgramme.objects.filter(enfant__parent=user).select_related('repas')

    @action(detail=True, methods=['post'])
    def toggle_alarm(self, request, pk=None):
        """Active / Désactive l'alarme d'un repas programmé"""
        repas_prog = self.get_object()
        repas_prog.active_alarm = not repas_prog.active_alarm
        repas_prog.save()
        
        return Response({
            'status': 'success',
            'active_alarm': repas_prog.active_alarm
        })

    @action(detail=False, methods=['get'])
    def aujourd_hui(self, request):
        """Récupère les repas programmés pour aujourd'hui"""
        today = timezone.now().date()
        repas = self.get_queryset().filter(date=today)
        serializer = self.get_serializer(repas, many=True)
        return Response(serializer.data)
    
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import RepasProgramme
from .serializers import RepasProgrammeSerializer


class RepasProgrammeViewSet(viewsets.ModelViewSet):
    serializer_class = RepasProgrammeSerializer

    def get_queryset(self):
        """Retourne uniquement les repas du bébé de l'utilisateur connecté"""
        user = self.request.user
        # Adaptez selon votre logique d'authentification
        return RepasProgramme.objects.filter(
            bebe__parent=user
        ).select_related('repas').order_by('date', 'heure')

    @action(detail=True, methods=['post'])
    def toggle_alarm(self, request, pk=None):
        """Activer / Désactiver l'alarme d'un repas"""
        repas_prog = self.get_object()
        repas_prog.active_alarm = not repas_prog.active_alarm
        repas_prog.save()
        
        return Response({
            'status': 'success',
            'active_alarm': repas_prog.active_alarm,
            'message': 'Alarme mise à jour'
        })

    @action(detail=False, methods=['get'])
    def aujourd_hui(self, request):
        """Récupère les repas programmés pour aujourd'hui"""
        today = timezone.now().date()
        repas = self.get_queryset().filter(date=today)
        serializer = self.get_serializer(repas, many=True)
        return Response(serializer.data)
