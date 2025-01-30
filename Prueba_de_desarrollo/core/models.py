from django.db import models
from django.contrib.auth.models import User

class UserActivity(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    last_login = models.DateTimeField(null=True, blank=True)  # Último inicio de sesión
    last_session_time = models.IntegerField(default=0)  # Tiempo de la última sesión
    total_session_time = models.IntegerField(default=0)  # Tiempo total de sesión en segundos
    last_heartbeat = models.DateTimeField(null=True, blank=True)  # Campo para el último heartbeat
    button1_clicks = models.IntegerField(default=0)
    button2_clicks = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username}'s Activity"