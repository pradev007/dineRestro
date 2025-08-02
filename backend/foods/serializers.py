from rest_framework import serializers
from .models import FoodModel , FoodCategories


class FoodCategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodCategories
        fields = "__all__"


class FoodSerializer(serializers.ModelSerializer):
    category = FoodCategoriesSerializer(read_only = True)

    category_id = serializers.PrimaryKeyRelatedField(
        queryset = FoodCategories.objects.all(),
        write_only = True,
        source = 'category'
    )
    class Meta:
        model = FoodModel
        fields = ['id', 'name', 'price', 'image', 'description', 'ingredients', 'category', 'category_id']

        # exclude = ['image']