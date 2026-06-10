"""Réponses auth enrichies avec le profil du module profil (Parent / Médecin)."""
from profil.models import Medecin, Parent
from profil.serializers import MedecinSerializer, ParentSerializer
from .serializers import UtilisateurSerializer


def serialize_session_payload(utilisateur):
    """Utilisateur + enregistrement lié dans profil (Parent ou Medecin)."""
    payload = {
        "utilisateur": UtilisateurSerializer(utilisateur).data,
        "profil": None,
        "profil_type": None,
    }

    if utilisateur.role == "medecin":
        medecin = Medecin.objects.filter(utilisateur=utilisateur).first()
        if medecin:
            payload["profil"] = MedecinSerializer(medecin).data
            payload["profil_type"] = "medecin"
    elif utilisateur.role == "parent":
        parent = Parent.objects.filter(utilisateur=utilisateur).first()
        if parent:
            payload["profil"] = ParentSerializer(parent).data
            payload["profil_type"] = "parent"

    return payload
