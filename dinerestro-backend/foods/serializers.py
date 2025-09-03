from rest_framework import serializers
from .models import FoodModel , FoodCategories, Favourite



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

class FavouriteSerializer(serializers.ModelSerializer):
    food = FoodSerializer(read_only = True)
    food_id = serializers.PrimaryKeyRelatedField(queryset = FoodModel.objects.all(), write_only = True)

    class Meta:
        model = Favourite
        fields = ['id', 'food', 'food_id', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        user = self.context['request'].user
        food = validated_data['food_id']
        return Favourite.objects.create(user=user, food=food)