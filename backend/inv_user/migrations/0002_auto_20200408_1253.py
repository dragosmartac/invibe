# Generated by Django 3.0 on 2020-04-08 12:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inv_user', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='user',
            name='admin',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='email',
            field=models.EmailField(default='email', max_length=255, unique=True, verbose_name='email address'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='user',
            name='staff',
            field=models.BooleanField(default=False),
        ),
    ]
