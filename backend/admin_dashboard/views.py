# from rest_framework import viewsets, status
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from django.db.models import Count, Avg, Sum, Q
# from django.utils import timezone
# from datetime import date, timedelta

# from authentification.models import Utilisateur, Administrateur
# from profil.models import Parent, Medecin, Bebe
# from nutrition.models import Repas, Aliment, RepasProgramme

# from .serializers import (
#     StatistiquesGeneralesSerializer,
#     UtilisateurListSerializer,
#     RepasListSerializer,
#     RepasDetailSerializer,
#     BebeListSerializer,
#     MedecinListSerializer
# )


# class AdminDashboardViewSet(viewsets.ViewSet):
#     """ViewSet principal pour le dashboard administrateur"""
#     permission_classes = [IsAuthenticated]

#     def get_permissions(self):
#         """Seuls les administrateurs peuvent accéder au dashboard"""
#         user = self.request.user
#         if getattr(user, 'role', None) != 'admin':
#             from rest_framework.exceptions import PermissionDenied
#             raise PermissionDenied("Accès réservé aux administrateurs.")
#         return super().get_permissions()

#     @action(detail=False, methods=['get'])
#     def statistiques(self, request):
#         """Statistiques globales de l'application"""
#         stats = {
#             'total_utilisateurs': Utilisateur.objects.count(),
#             'total_parents': Parent.objects.count(),
#             'total_medecins': Medecin.objects.count(),
#             'total_administrateurs': Administrateur.objects.count(),
#             'total_bebes': Bebe.objects.count(),
#             'total_repas': Repas.objects.count(),
#             'total_repas_programmes': RepasProgramme.objects.count(),
#         }
        
#         # Calcul du coût moyen des repas
#         avg_cost = Repas.objects.aggregate(avg_cout=Avg('cout_estime_fcfa'))
#         stats['cout_moyen_repas'] = round(avg_cost['avg_cout'] or 0, 2)
        
#         # Calcul de l'âge moyen des bébés
#         today = date.today()
#         bebes = Bebe.objects.all()
#         total_age_mois = 0
#         for bebe in bebes:
#             age_mois = (today.year - bebe.date_naissance.year) * 12 + (today.month - bebe.date_naissance.month)
#             total_age_mois += age_mois
#         stats['age_moyen_bebes_mois'] = round(total_age_mois / bebes.count() if bebes.count() > 0 else 0, 1)
        
#         serializer = StatistiquesGeneralesSerializer(stats)
#         return Response(serializer.data)

#     @action(detail=False, methods=['get'])
#     def utilisateurs(self, request):
#         """Liste de tous les utilisateurs avec leurs profils"""
#         utilisateurs = Utilisateur.objects.all().order_by('-date_joined')
#         serializer = UtilisateurListSerializer(utilisateurs, many=True)
#         return Response(serializer.data)

#     @action(detail=False, methods=['get'])
#     def repas(self, request):
#         """Liste de tous les repas"""
#         repas = Repas.objects.all().order_by('-id')
#         serializer = RepasListSerializer(repas, many=True)
#         return Response(serializer.data)

#     @action(detail=False, methods=['get'], url_path='repas/(?P<pk>[^/.]+)')
#     def repas_detail(self, request, pk=None):
#         """Détails d'un repas spécifique"""
#         try:
#             repas = Repas.objects.get(pk=pk)
#             serializer = RepasDetailSerializer(repas)
#             return Response(serializer.data)
#         except Repas.DoesNotExist:
#             return Response({'error': 'Repas non trouvé'}, status=status.HTTP_404_NOT_FOUND)

#     @action(detail=False, methods=['get'])
#     def bebes(self, request):
#         """Liste de tous les bébés"""
#         bebes = Bebe.objects.select_related('parent__utilisateur').all()
#         serializer = BebeListSerializer(bebes, many=True)
#         return Response(serializer.data)

#     @action(detail=False, methods=['get'])
#     def medecins(self, request):
#         """Liste de tous les médecins"""
#         medecins = Medecin.objects.select_related('utilisateur').all()
#         serializer = MedecinListSerializer(medecins, many=True)
#         return Response(serializer.data)

#     @action(detail=False, methods=['get'])
#     def repas_recents(self, request):
#         """Repas créés récemment (7 derniers jours)"""
#         sept_jours = timezone.now() - timedelta(days=7)
#         # Note: Repas n'a pas de champ created_at, donc on utilise l'ID comme approximation
#         repas = Repas.objects.all().order_by('-id')[:10]
#         serializer = RepasListSerializer(repas, many=True)
#         return Response(serializer.data)

#     @action(detail=False, methods=['get'])
#     def utilisateurs_actifs(self, request):
#         """Utilisateurs actifs (connectés récemment)"""
#         # Note: last_login n'est pas dans votre modèle Utilisateur actuel
#         utilisateurs = Utilisateur.objects.filter(statut='actif').order_by('-date_joined')[:20]
#         serializer = UtilisateurListSerializer(utilisateurs, many=True)
#         return Response(serializer.data)

#     @action(detail=False, methods=['get'])
#     def repas_populaires(self, request):
#         """Repas les plus programmés"""
#         repas = Repas.objects.annotate(
#             nombre_programmations=Count('programmations')
#         ).order_by('-nombre_programmations')[:10]
#         serializer = RepasListSerializer(repas, many=True)
#         return Response(serializer.data)

#     @action(detail=False, methods=['delete'], url_path='utilisateurs/(?P<pk>[^/.]+)')
#     def supprimer_utilisateur(self, request, pk=None):
#         """Supprimer un utilisateur (admin only)"""
#         try:
#             utilisateur = Utilisateur.objects.get(pk=pk)
#             utilisateur.delete()
#             return Response({'message': 'Utilisateur supprimé avec succès'}, status=status.HTTP_200_OK)
#         except Utilisateur.DoesNotExist:
#             return Response({'error': 'Utilisateur non trouvé'}, status=status.HTTP_404_NOT_FOUND)

#     @action(detail=False, methods=['delete'], url_path='repas/(?P<pk>[^/.]+)')
#     def supprimer_repas(self, request, pk=None):
#         """Supprimer un repas (admin only)"""
#         try:
#             repas = Repas.objects.get(pk=pk)
#             repas.delete()
#             return Response({'message': 'Repas supprimé avec succès'}, status=status.HTTP_200_OK)
#         except Repas.DoesNotExist:
#             return Response({'error': 'Repas non trouvé'}, status=status.HTTP_404_NOT_FOUND)


from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from authentification.models import Utilisateur
from profil.models import Parent, Medecin, Bebe
from nutrition.models import Repas, RepasProgramme

class AdminStatsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Accès interdit'}, status=403)

        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)

        stats = {
            'total_parents': Parent.objects.count(),
            'total_medecins': Medecin.objects.count(),
            'total_bebes': Bebe.objects.count(),
            'total_repas': Repas.objects.count(),
            'repas_programmes_aujourdhui': RepasProgramme.objects.filter(date=today).count(),
            'nouveaux_parents_7j': Parent.objects.filter(utilisateur__date_joined__gte=week_ago).count(),
            'nouveaux_medecins_7j': Medecin.objects.filter(utilisateur__date_joined__gte=week_ago).count(),
            'nouveaux_bebes_7j': Bebe.objects.filter(parent__utilisateur__date_joined__gte=week_ago).count(),
            'evolution_inscriptions': list(
                Utilisateur.objects.filter(date_joined__gte=month_ago)
                .extra({'date': "date(date_joined)"})
                .values('date')
                .annotate(count=Count('id'))
                .order_by('date')
            ),
            'evolution_repas': []
        }
        return Response(stats)

    @action(detail=False, methods=['get'])
    def utilisateurs(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Accès interdit'}, status=403)
        users = Utilisateur.objects.all().values('id', 'username', 'first_name', 'last_name', 'email', 'telephone', 'role', 'statut')
        return Response(users)

    @action(detail=False, methods=['get'])
    def parents(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Accès interdit'}, status=403)
        parents = Parent.objects.select_related('utilisateur').all()
        data = [{'id': p.id, 'nom': p.utilisateur.get_full_name(), 'email': p.utilisateur.email, 'telephone': p.utilisateur.telephone, 'statut': p.utilisateur.statut} for p in parents]
        return Response(data)

    @action(detail=False, methods=['get'])
    def medecins(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Accès interdit'}, status=403)
        medecins = Medecin.objects.select_related('utilisateur').all()
        data = [{'id': m.id, 'nom': m.utilisateur.get_full_name(), 'email': m.utilisateur.email, 'specialite': m.specialite, 'statut': m.utilisateur.statut} for m in medecins]
        return Response(data)

    @action(detail=False, methods=['get'])
    def repas(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Accès interdit'}, status=403)
        repas = Repas.objects.all().order_by('-id').values(
            'id', 'nom', 'age_minimum_mois', 'cout_estime_fcfa', 'description', 'image'
        )
        return Response(repas)

    @action(detail=True, methods=['post'])
    def suspendre_utilisateur(self, request, pk=None):
        if request.user.role != 'admin':
            return Response({'error': 'Accès interdit'}, status=403)
        try:
            user = Utilisateur.objects.get(pk=pk)
            user.statut = 'suspendu'
            user.save()
            return Response({'message': f'Utilisateur {user.username} suspendu'})
        except Utilisateur.DoesNotExist:
            return Response({'error': 'Utilisateur non trouvé'}, status=404)

    @action(detail=True, methods=['post'])
    def activer_utilisateur(self, request, pk=None):
        if request.user.role != 'admin':
            return Response({'error': 'Accès interdit'}, status=403)
        try:
            user = Utilisateur.objects.get(pk=pk)
            user.statut = 'actif'
            user.save()
            return Response({'message': f'Utilisateur {user.username} activé'})
        except Utilisateur.DoesNotExist:
            return Response({'error': 'Utilisateur non trouvé'}, status=404)