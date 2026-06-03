from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Utilisateur, Invitation
from .serializers import UtilisateurSerializer, InscriptionSerializer, InvitationSerializer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

parser_classes = [MultiPartParser, FormParser, JSONParser]

class AuthViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def inscription(self, request):
        serializer = InscriptionSerializer(data=request.data)
        if serializer.is_valid():
            utilisateur = serializer.save()
            refresh = RefreshToken.for_user(utilisateur)
            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'utilisateur': UtilisateurSerializer(utilisateur).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def connexion(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        utilisateur = authenticate(request, username=username, password=password)
        if utilisateur:
            refresh = RefreshToken.for_user(utilisateur)
            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'utilisateur': UtilisateurSerializer(utilisateur).data
            })
        return Response({'error': 'Email ou mot de passe incorrect'},
                        status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def profil(self, request):
        serializer = UtilisateurSerializer(request.user)
        return Response(serializer.data)

class InvitationViewSet(viewsets.ModelViewSet):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer
    permission_classes = [IsAuthenticated]