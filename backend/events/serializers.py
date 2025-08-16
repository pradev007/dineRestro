from rest_framework import serializers
from .models import EventsModel

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventsModel
        fields = '__all__'