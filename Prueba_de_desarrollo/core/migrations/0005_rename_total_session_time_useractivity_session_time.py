# Generated by Django 5.1.5 on 2025-01-29 19:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_useractivity_last_login'),
    ]

    operations = [
        migrations.RenameField(
            model_name='useractivity',
            old_name='total_session_time',
            new_name='session_time',
        ),
    ]
