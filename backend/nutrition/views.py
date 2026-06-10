from datetime import date, time
# from nutrition.views import _age_bebe_mois
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import *

from profil.models import Bebe
from .models import Categorie, Aliment, Repas, Composer, HoraireRepas, RepasProgramme
from .serializers import (
    CategorieSerializer,
    AlimentSerializer,
    RepasSerializer,
    ComposerSerializer,
    HoraireRepasSerializer,
    RepasProgrammeSerializer,
)


def _age_bebe_mois(bebe):
    naissance = bebe.date_naissance
    today = date.today()
    return (today.year - naissance.year) * 12 + (today.month - naissance.month)


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
        age = self.request.query_params.get("age")
        if age:
            return Aliment.objects.filter(age_minimum_mois__lte=age)
        return Aliment.objects.all()


class RepasViewSet(viewsets.ModelViewSet):
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    serializer_class = RepasSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Repas.objects.prefetch_related("horaires", "composer_set__aliment")
        age = self.request.query_params.get("age")
        if age:
            return qs.filter(age_minimum_mois__lte=int(age))
        return qs.order_by("-id")
    
    def get_permissions(self):
        return super().get_permissions()

    def perform_create(self, serializer):
        """Associer le repas au professionnel qui le crée"""
        serializer.save()

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {"detail": str(e), "trace": traceback.format_exc()},
                status=status.HTTP_400_BAD_REQUEST
            )
    @action(detail=True, methods=["get"])
    def composition(self, request, pk=None):
        repas = self.get_object()
        compositions = repas.composer_set.select_related('aliment').all()
        data = [{
            'aliment': c.aliment.nom,
            'quantite': c.quantite,
            'unite': c.unite,
            'valeur_nutritive': c.aliment.valeur_nutritive,
            'prix': c.aliment.prix_unitaire_fcfa
        } for c in compositions]
        return Response(data)
    @action(detail=False, methods=["post"], url_path="repair-programs")
    def repair_programs(self, request):
        from django.utils import timezone
        from profil.models import Bebe
        from .models import Repas, RepasProgramme
        today = timezone.now().date()
        created_count = 0
        for repas in Repas.objects.all():
            heures = list(repas.horaires.values_list('heure', flat=True))
            if not heures:
                continue
            for bebe in Bebe.objects.all():
                if _age_bebe_mois(bebe) < repas.age_minimum_mois:
                    continue
                for heure in heures:
                    _, created = RepasProgramme.objects.get_or_create(
                        bebe=bebe, repas=repas, date=today, heure=heure,
                        defaults={'active_alarm': True}
                    )
                    if created:
                        created_count += 1
        return Response({"repaired": created_count})

    @action(detail=True, methods=["post"])
    def publier_aux_familles(self, request, pk=None):
        repas = self.get_object()
        today = timezone.now().date()
        heures = list(repas.horaires.values_list('heure', flat=True))
        if not heures:
            heures = [time(12, 0)]
        programmes_crees = 0
        for bebe in Bebe.objects.select_related("parent__utilisateur"):
            if _age_bebe_mois(bebe) < repas.age_minimum_mois:
                continue
            for heure in heures:
                obj, created = RepasProgramme.objects.get_or_create(
                    bebe=bebe,
                    repas=repas,
                    date=today,
                    heure=heure,
                    defaults={"active_alarm": True}
                )
                if created:
                    programmes_crees += 1
        return Response({"status": "ok", "programmes_crees": programmes_crees})
    @action(detail=True, methods=["post"])
    def unpublish(self, request, pk=None):
        """Supprime les programmations du repas pour aujourd'hui."""
        from django.utils import timezone
        from .models import RepasProgramme
        repas = self.get_object()
        today = timezone.now().date()
        deleted, _ = RepasProgramme.objects.filter(repas=repas, date=today).delete()
        return Response({"status": "ok", "deleted": deleted})
class ComposerViewSet(viewsets.ModelViewSet):
    queryset = Composer.objects.all()
    serializer_class = ComposerSerializer
    permission_classes = [IsAuthenticated]


class RepasProgrammeViewSet(viewsets.ModelViewSet):
    serializer_class = RepasProgrammeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return RepasProgramme.objects.filter(
            bebe__parent__utilisateur=user
        ).select_related("repas", "bebe").order_by("date", "heure")

    def perform_create(self, serializer):
        bebe = serializer.validated_data.get("bebe")
        if bebe.parent.utilisateur_id != self.request.user.id:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Ce bébé n'appartient pas à votre compte.")
        serializer.save()

    @action(detail=True, methods=["post"])
    def toggle_alarm(self, request, pk=None):
        repas_prog = self.get_object()
        repas_prog.active_alarm = not repas_prog.active_alarm
        repas_prog.save()
        return Response(
            {
                "status": "success",
                "active_alarm": repas_prog.active_alarm,
                "message": "Alarme mise à jour",
            }
        )

    @action(detail=False, methods=["get"])
    def aujourd_hui(self, request):
        today = timezone.now().date()
        repas = self.get_queryset().filter(date=today)
        serializer = self.get_serializer(repas, many=True)
        return Response(serializer.data)
