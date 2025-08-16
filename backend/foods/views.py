from rest_framework import generics
from rest_framework.permissions import IsAdminUser, AllowAny
from .models import FoodModel, FoodCategories
from .serializers import FoodSerializer, FoodCategoriesSerializer


# -------- Food Categories --------
# Admin: full CRUD
class CategoryAdminView(generics.ListCreateAPIView):
    queryset = FoodCategories.objects.all()
    serializer_class = FoodCategoriesSerializer
    permission_classes = [IsAdminUser]


class CategoryAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FoodCategories.objects.all()
    serializer_class = FoodCategoriesSerializer
    lookup_field = 'pk'
    permission_classes = [IsAdminUser]

    def get_object(self):
        try:
            return super().get_object()
        except FoodCategories.DoesNotExist:
            raise generics.Http404("Category with this ID does not exist")


# User: read-only
class CategoryListView(generics.ListAPIView):
    queryset = FoodCategories.objects.all()
    serializer_class = FoodCategoriesSerializer
    permission_classes = [AllowAny]


class CategoryDetailView(generics.RetrieveAPIView):
    queryset = FoodCategories.objects.all()
    serializer_class = FoodCategoriesSerializer
    lookup_field = 'pk'
    permission_classes = [AllowAny]


# -------- Food Items --------
# Admin: full CRUD
class FoodAdminView(generics.ListCreateAPIView):
    queryset = FoodModel.objects.all()
    serializer_class = FoodSerializer
    permission_classes = [IsAdminUser]


class FoodAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FoodModel.objects.all()
    serializer_class = FoodSerializer
    lookup_field = 'pk'
    permission_classes = [IsAdminUser]


# User: read-only
class FoodListView(generics.ListAPIView):
    queryset = FoodModel.objects.all()
    serializer_class = FoodSerializer
    permission_classes = [AllowAny]


class FoodDetailView(generics.RetrieveAPIView):
    queryset = FoodModel.objects.all()
    serializer_class = FoodSerializer
    lookup_field = 'pk'
    permission_classes = [AllowAny]
