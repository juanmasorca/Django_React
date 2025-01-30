from django.urls import path
from .views import admin_dashboard, regular_dashboard, update_button_click, login_view, heartbeat

urlpatterns = [
    path('login/', login_view, name='login'),
    path('admin-dashboard/', admin_dashboard, name='admin_dashboard'),
    path('regular-dashboard/', regular_dashboard, name='regular_dashboard'),
    path('update-button-click/', update_button_click, name='update_button_click'),
    path('heartbeat/', heartbeat, name='heartbeat'),
]
