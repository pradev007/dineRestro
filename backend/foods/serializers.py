from rest_framework import serializers
from .models import FoodModel

class FoodSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = FoodModel
        fields = "__all__"
        # exclude = ['image']