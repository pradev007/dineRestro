from django.shortcuts import render
from .serializers import RegisterSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import CustomUser
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message":"User register successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email :
        return Response({"detail":"Email is required"}, status=status.HTTP_400_BAD_REQUEST)
    if not password:
        return Response({"detail":"password is required"},status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(request, email=email,password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh':str(refresh),
            'fullname': user.fullname,
            'email' : user.email,
            'staff': user.is_staff,
            'active': user.is_active,
            'superuser': user.is_superuser,
            'joined': user.date_joined,
            'user_id': user.id
        })
    else:
        return Response({"detail":"Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)


