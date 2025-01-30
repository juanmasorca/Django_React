import json
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import UserActivity
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token 
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated, AllowAny

# Vista para que el Admin vea la lista de usuarios y sus actividades
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard(request):
    if not request.user.is_staff:
        return JsonResponse({"detail": "No autorizado"}, status=403)

    users_data = []
    users = User.objects.filter(is_staff=False)  # Solo usuarios regulares

    for user in users:
        activity = UserActivity.objects.filter(user=user).first()

        users_data.append({
            "nombre": user.username,
            "email": user.email if user.email else "No existe correo",
            "fecha_registro": user.date_joined.strftime("%Y-%m-%d"),
            "fecha_inicio_sesion": activity.last_login.strftime("%Y-%m-%d %H:%M:%S") if activity and activity.last_login else "No disponible",
            "tiempo_ultima_sesion": activity.last_session_time if activity else 0,  # Tiempo de la última sesión
            "tiempo_total_sesiones": activity.total_session_time if activity else 0,  # Tiempo total acumulado
            "clic_botón_1": activity.button1_clicks if activity else 0,
            "clic_botón_2": activity.button2_clicks if activity else 0,
        })

    return JsonResponse(users_data, safe=False)

# Vista para usuarios regulares que muestra la landing page
@api_view(['GET'])
@login_required
def regular_dashboard(request):
    if request.user.is_staff:
        return JsonResponse({"detail": "No autorizado"}, status=403)
    
    return JsonResponse({"message": "Bienvenido a la Landing Page"})

# Vista para actualizar los clics en los botones y registrar el tiempo de sesión
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_button_click(request):
    user = request.user
    button_number = request.data.get('button_number')

    if not button_number:
        return JsonResponse({"error": "Número de botón no proporcionado"}, status=400)

    # Obtener o crear el registro de actividad
    activity, created = UserActivity.objects.get_or_create(user=user)

    if button_number == 1:
        activity.button1_clicks += 1
    elif button_number == 2:
        activity.button2_clicks += 1
    else:
        return JsonResponse({"error": "Número de botón inválido"}, status=400)
    activity.save()
    return JsonResponse({"message": f"Clic en el botón {button_number} registrado correctamente"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def heartbeat(request):
    user = request.user
    session_time = request.data.get('session_time', 0)  # Tiempo actual en segundos

    try:
        # Obtener o crear el registro de actividad
        activity, created = UserActivity.objects.get_or_create(user=user)

        if activity.last_session_time is not None:
            time_difference = session_time - activity.last_session_time
            if time_difference >= 0:  # Asegurar que no haya valores negativos
                activity.total_session_time += time_difference
        else:
            activity.total_session_time += session_time  # Si es la primera vez, sumar directamente

        # Actualizar el último tiempo registrado con el valor recibido
        activity.last_session_time = session_time
        activity.save()

        return Response({"message": "Heartbeat recibido"}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

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
        print("Datos user:", user)
        if user is not None:
            login(request, user)  # Inicia sesión para el usuario
            token, created = Token.objects.get_or_create(user=user)

            # Actualizar el último inicio de sesión en UserActivity
            activity, created = UserActivity.objects.get_or_create(user=user)
            activity.last_login = timezone.now()  # Usar timezone para la fecha y hora actual
            activity.save()

            return JsonResponse({"message": "Inicio de sesión exitoso", "is_admin": user.is_staff, "token": token.key}, status=200)
        print("📢")
        return JsonResponse({"message": "Credenciales inválidas"}, status=401)
    except Exception as e:
        print("⚠️ Error en login_view:", str(e))
        return JsonResponse({"message": "Error en la solicitud", "error": str(e)}, status=400)
