from django.shortcuts import render
from .models import FoodModel
from .serializers import FoodSerializer
from rest_framework import generics
from rest_framework.permissions import IsAdminUser


# Create your views here.
class FoodListCreateView(generics.ListCreateAPIView):
    queryset = FoodModel.objects.all()
    serializer_class = FoodSerializer
    permission_classes = [IsAdminUser]