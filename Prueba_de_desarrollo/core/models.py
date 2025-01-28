from django.db import models
from django.contrib.auth.models import User

class UserActivity(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    login_time = models.DateTimeField(null=True, blank=True)
    button1_clicks = models.IntegerField(default=0)
    button2_clicks = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username
