from rest_framework import generics
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from .models import FoodModel, FoodCategories, Favourite
from .serializers import FoodSerializer, FoodCategoriesSerializer,FavouriteSerializer
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status


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


# favourite
class FavouriteListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        favourites = Favourite.objects.filter(user=request.user)
        serializer = FavouriteSerializer(favourites, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FavouriteSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            # Check if the favorite already exists
            food_id = request.data.get('food_id')
            if Favourite.objects.filter(user=request.user, food_id=food_id).exists():
                return Response(
                    {'error': 'This food is already in your favorites'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FavouriteDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, food_id):
        favourite = get_object_or_404(Favourite, user=request.user, food_id=food_id)
        favourite.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)