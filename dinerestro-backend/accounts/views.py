from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer
from .models import CustomUser


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }


# -------------------- USER REGISTER --------------------
@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        role = serializer.validated_data.get('role', 'customer')

        if role == 'admin':
            return Response(
                {"details": "You cannot register as admin"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer.save(role="customer")  # force role to "customer"
        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------- USER LOGIN --------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email:
        return Response({"detail": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
    if not password:
        return Response({"detail": "Password is required"}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, email=email, password=password)

    if user and user.role == "customer":
        tokens = get_tokens_for_user(user)
        return Response({
            **tokens,
            "fullname": user.fullname,
            "email": user.email,
            "role": user.role,
            "staff": user.is_staff,
            "active": user.is_active,
            "superuser": user.is_superuser,
            "joined": user.date_joined,
            "user_id": user.id
        })
    return Response({"detail": "Invalid credentials or not a customer"}, status=status.HTTP_401_UNAUTHORIZED)


# -------------------- VENDOR REGISTER --------------------
@api_view(['POST'])
def register_vendor(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(role="vendor")  # force role to vendor
        return Response(
            {"message": "Vendor registered successfully"},
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------- VENDOR LOGIN --------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def login_vendor(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"detail": "Email and password required"}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, email=email, password=password)

    if user and user.role == "vendor":
        tokens = get_tokens_for_user(user)
        return Response({
            **tokens,
            "fullname": user.fullname,
            "email": user.email,
            "role": user.role,
            "user_id": user.id
        })
    return Response({"detail": "Invalid credentials or not a vendor"}, status=status.HTTP_401_UNAUTHORIZED)


# -------------------- ADMIN REGISTER --------------------
@api_view(['POST'])
def register_admin(request):
    return Response(
        {"detail": "Direct admin registration not allowed. Use Django createsuperuser."},
        status=status.HTTP_403_FORBIDDEN
    )


# -------------------- ADMIN LOGIN --------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def login_admin(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"detail": "Email and password required"}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, email=email, password=password)

    if user and (user.role == "admin" or user.is_superuser):
        tokens = get_tokens_for_user(user)
        return Response({
            **tokens,
            "fullname": user.fullname,
            "email": user.email,
            "role": user.role,
            "user_id": user.id
        })
    return Response({"detail": "Invalid credentials or not an admin"}, status=status.HTTP_401_UNAUTHORIZED)
