from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Conversation, Message
from profil.models import Medecin
class ConversationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Conversation.objects.all()

    def list(self, request):
        user = request.user
        if user.role == 'parent':
            convs = Conversation.objects.filter(parent=user.parent)
        else:
            convs = Conversation.objects.filter(medecin=user.medecin)
        data = []
        for c in convs:
            other = c.medecin if user.role == 'parent' else c.parent
            data.append({
                'id': c.id,
                'other_name': other.utilisateur.get_full_name()
            })
        return Response(data)

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        try:
            conv = self.get_object()
        except Conversation.DoesNotExist:
            return Response({'error': 'Conversation introuvable'}, status=404)
        content = request.data.get('content')
        if not content:
            return Response({'error': 'Message vide'}, status=400)
        msg = Message.objects.create(conversation=conv, sender=request.user, content=content)
        return Response({'id': msg.id, 'content': msg.content, 'created_at': msg.created_at})

class MessageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Message.objects.all()

    def list(self, request):
        conv_id = request.query_params.get('conversation')
        if not conv_id:
            return Response([])
        msgs = Message.objects.filter(conversation_id=conv_id)
        data = [{'id': m.id, 'sender': m.sender.id, 'content': m.content, 'created_at': m.created_at} for m in msgs]
        return Response(data)
    from profil.models import Medecin, Parent   # à ajouter en haut du fichier

@action(detail=False, methods=['get'], url_path='medecins-disponibles')
def medecins_disponibles(self, request):
    if request.user.role != 'parent':
        return Response({'error': 'Accès réservé aux parents'}, status=403)
    medecins = Medecin.objects.filter(disponibilite=True).select_related('utilisateur')
    data = [{
        'id': m.id,
        'nom': m.utilisateur.get_full_name(),
        'specialite': m.specialite,
        'ville': m.ville,
        'utilisateur_id': m.utilisateur.id
    } for m in medecins]
    return Response(data)

@action(detail=False, methods=['post'], url_path='creer-conversation')
def creer_conversation(self, request):
    user = request.user
    medecin_id = request.data.get('medecin_id')
    if not medecin_id:
        return Response({'error': 'medecin_id requis'}, status=400)
    try:
        medecin = Medecin.objects.get(pk=medecin_id)
    except Medecin.DoesNotExist:
        return Response({'error': 'Médecin non trouvé'}, status=404)
    try:
        parent = user.parent
    except:
        return Response({'error': 'Profil parent manquant'}, status=400)
    conversation, created = Conversation.objects.get_or_create(parent=parent, medecin=medecin)
    return Response({
        'id': conversation.id,
        'other_name': medecin.utilisateur.get_full_name(),
        'created': created
    })
    
    from profil.models import Medecin, Parent   # ajoutez cette ligne

@action(detail=False, methods=['get'], url_path='medecins-disponibles')
def medecins_disponibles(self, request):
    if request.user.role != 'parent':
        return Response({'error': 'Accès réservé aux parents'}, status=403)
    medecins = Medecin.objects.filter(disponibilite=True).select_related('utilisateur')
    data = [{
        'id': m.id,
        'nom': m.utilisateur.get_full_name(),
        'specialite': m.specialite,
        'ville': m.ville,
        'utilisateur_id': m.utilisateur.id
    } for m in medecins]
    return Response(data)

@action(detail=False, methods=['post'], url_path='creer-conversation')
def creer_conversation(self, request):
    user = request.user
    medecin_id = request.data.get('medecin_id')
    if not medecin_id:
        return Response({'error': 'medecin_id requis'}, status=400)
    try:
        medecin = Medecin.objects.get(pk=medecin_id)
    except Medecin.DoesNotExist:
        return Response({'error': 'Médecin non trouvé'}, status=404)
    try:
        parent = user.parent
    except:
        return Response({'error': 'Profil parent manquant'}, status=400)
    conversation, created = Conversation.objects.get_or_create(parent=parent, medecin=medecin)
    return Response({
        'id': conversation.id,
        'other_name': medecin.utilisateur.get_full_name(),
        'created': created
    })
    
    from profil.models import Medecin, Parent   # à mettre en haut du fichier

class ParentMessagerieViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """Liste des médecins disponibles (GET /parent/medecins/)"""
        if request.user.role != 'parent':
            return Response({'error': 'Accès réservé aux parents'}, status=403)
        medecins = Medecin.objects.filter(disponibilite=True).select_related('utilisateur')
        data = [{
            'id': m.id,
            'nom': m.utilisateur.get_full_name(),
            'specialite': m.specialite,
            'ville': m.ville,
            'utilisateur_id': m.utilisateur.id
        } for m in medecins]
        return Response(data)

    def create(self, request):
        """Crée une conversation avec un médecin (POST /parent/medecins/)"""
        if request.user.role != 'parent':
            return Response({'error': 'Accès réservé aux parents'}, status=403)
        medecin_id = request.data.get('medecin_id')
        if not medecin_id:
            return Response({'error': 'medecin_id requis'}, status=400)
        try:
            medecin = Medecin.objects.get(pk=medecin_id)
        except Medecin.DoesNotExist:
            return Response({'error': 'Médecin non trouvé'}, status=404)
        try:
            parent = request.user.parent
        except:
            return Response({'error': 'Profil parent manquant'}, status=400)
        conversation, created = Conversation.objects.get_or_create(parent=parent, medecin=medecin)
        return Response({
            'id': conversation.id,
            'other_name': medecin.utilisateur.get_full_name(),
            'created': created
        }, status=201)