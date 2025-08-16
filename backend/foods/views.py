from django.shortcuts import render
from .models import FoodModel , FoodCategories
from .serializers import FoodSerializer ,FoodCategoriesSerializer
from rest_framework import generics
from rest_framework.permissions import IsAdminUser


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = FoodCategories.objects.all()
    serializer_class = FoodCategoriesSerializer
   
    permission_classes = [IsAdminUser]


# Create your views here.
class FoodListCreateView(generics.ListCreateAPIView):
    queryset = FoodModel.objects.all()
    serializer_class = FoodSerializer
    permission_classes = [IsAdminUser]

class CategoryRetrieveView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FoodCategories.objects.all()
    serializer_class = FoodCategoriesSerializer
    lookup_field = 'pk'
    permission_classes = [IsAdminUser]

    def get_object(self):
        try:
            return super().get_object()
        except FoodCategories.DoesNotExist:
            raise generics.Http404("Category with this ID doesnot exist")
            
