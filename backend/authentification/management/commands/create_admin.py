from django.core.management.base import BaseCommand
from authentification.models import Utilisateur, Administrateur


class Command(BaseCommand):
    help = 'Crée un compte administrateur pour NutriBébé'

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, help='Nom d utilisateur')
        parser.add_argument('--email', type=str, help='Email')
        parser.add_argument('--password', type=str, help='Mot de passe')
        parser.add_argument('--first-name', type=str, help='Prénom')
        parser.add_argument('--last-name', type=str, help='Nom')
        parser.add_argument('--niveau-acces', type=str, default='super_admin', help='Niveau d accès (défaut: super_admin)')

    def handle(self, *args, **options):
        username = options.get('username')
        email = options.get('email')
        password = options.get('password')
        first_name = options.get('first_name', '')
        last_name = options.get('last_name', '')
        niveau_acces = options.get('niveau_acces', 'super_admin')

        if not username or not email or not password:
            self.stdout.write(self.style.ERROR('Erreur: --username, --email et --password sont obligatoires'))
            return

        # Vérifier si l'utilisateur existe déjà
        if Utilisateur.objects.filter(username=username).exists():
            self.stdout.write(self.style.ERROR(f'Erreur: L utilisateur {username} existe déjà'))
            return

        if Utilisateur.objects.filter(email=email).exists():
            self.stdout.write(self.style.ERROR(f'Erreur: L email {email} est déjà utilisé'))
            return

        # Créer l'utilisateur
        utilisateur = Utilisateur.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role='admin',
            statut='actif'
        )

        # Créer le profil administrateur
        Administrateur.objects.create(
            utilisateur=utilisateur,
            niveau_acces=niveau_acces
        )

        self.stdout.write(self.style.SUCCESS(f'Succès: Compte administrateur {username} créé avec succès'))
        self.stdout.write(self.style.SUCCESS(f'Email: {email}'))
        self.stdout.write(self.style.SUCCESS(f'Niveau d accès: {niveau_acces}'))
