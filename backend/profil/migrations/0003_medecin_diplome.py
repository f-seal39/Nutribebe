from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profil', '0002_allergie_allergibebe'),
    ]

    operations = [
        migrations.AddField(
            model_name='medecin',
            name='diplome',
            field=models.FileField(blank=True, null=True, upload_to='medecins/diplomes/'),
        ),
    ]
