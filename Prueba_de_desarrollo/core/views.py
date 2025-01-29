from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import UserActivity
from .serializers import UserActivitySerializer
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token 

from rest_framework.permissions import IsAuthenticated, AllowAny

# Vista para que el Admin vea la lista de usuarios y sus actividades
@api_view(['GET'])
# @login_required
@permission_classes([IsAuthenticated])
def admin_dashboard(request):
    print("📢 Solicitud recibida en admin_dashboard")
    if not request.user.is_staff:
        return JsonResponse({"detail": "No autorizado"}, status=403)

    users = User.objects.exclude(is_superuser=True).values('username', 'email', 'date_joined')

    if not users:
        return JsonResponse({"detail": "No hay usuarios registrados."}, status=404)

    data = [
        {
            "nombre": user["username"],
            "email": user["email"],
            "fecha_registro": user["date_joined"].strftime("%Y-%m-%d %H:%M:%S"),
        }
        for user in users
    ]
    
    print(data)  # Agrega este print para verificar los datos
    return JsonResponse(data, safe=False)

# Vista para usuarios regulares que muestra la landing page
@api_view(['GET'])
@login_required
def regular_dashboard(request):
    if request.user.is_staff:
        return JsonResponse({"detail": "No autorizado"}, status=403)
    
    return JsonResponse({"message": "Bienvenido a la Landing Page"})

# Vista para actualizar los clics en los botones
@api_view(['POST'])
def update_button_click(request):
    user = request.user
    button_number = request.data.get('button_number')
    
    # Obtener o crear el registro de actividad
    activity, created = UserActivity.objects.get_or_create(user=user)
    
    if button_number == 1:
        activity.button1_clicks += 1
    elif button_number == 2:
        activity.button2_clicks += 1
    
    activity.save()
    return JsonResponse({"message": "Clic registrado"})

# Vista para el inicio de sesión

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    print("📢 Solicitud recibida en login_view")
    try:
        data = json.loads(request.body)
        print("Datos recibidos:", data)
        username = data.get('username')
        password = data.get('password')
        
        print(f"Intentando autenticar: {username}, {password}")
        user = authenticate(username=username, password=password)
        print("Datos user:",user)
        if user is not None:
            login(request, user)  # Inicia sesión para el usuario
            token, created =Token.objects.get_or_create(user=user)
            return JsonResponse({"message": "Inicio de sesión exitoso", "is_admin": user.is_staff, "token": token.key}, status=200)
        print("📢")
        return JsonResponse({"message": "Credenciales inválidas"}, status=401)
    except Exception as e:
        print("⚠️ Error en login_view:", str(e))
        return JsonResponse({"message": "Error en la solicitud", "error": str(e)}, status=400)
