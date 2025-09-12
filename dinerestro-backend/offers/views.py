from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from .models import offerModel
from .serializers import offerSerializer

# Create your views here.
class offerListCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = offerModel.objects.all()
    serializer_class = offerSerializer

