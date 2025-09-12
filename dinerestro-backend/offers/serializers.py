from .models import offerModel
from rest_framework import serializers

class offerSerializer(serializers.ModelSerializer):
    class Meta:
        model = offerModel
        fields = "__all__"
