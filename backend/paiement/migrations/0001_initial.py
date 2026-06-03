from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('profil', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Paiement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('provider', models.CharField(choices=[('mtn', 'MTN Mobile Money'), ('orange', 'Orange Money')], max_length=20)),
                ('montant', models.DecimalField(decimal_places=2, max_digits=10)),
                ('telephone', models.CharField(max_length=20)),
                ('statut', models.CharField(choices=[('pending', 'En attente'), ('success', 'Payé'), ('failed', 'Échoué')], default='pending', max_length=20)),
                ('reference', models.CharField(max_length=100, unique=True)),
                ('description', models.CharField(blank=True, max_length=255)),
                ('date_creation', models.DateTimeField(auto_now_add=True)),
                ('date_mise_a_jour', models.DateTimeField(auto_now=True)),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='paiements', to='profil.parent')),
            ],
        ),
    ]
