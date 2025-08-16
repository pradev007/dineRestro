from rest_framework import serializers
from .models import TableModel, BookingModel

class TableSerializer(serializers.ModelSerializer):
    is_available = serializers.SerializerMethodField()
    class Meta:
        model = TableModel
        fields = ['id', 'table_number', 'seats', 'is_available']

    def get_is_available(self,obj):
        # check if a table is booked for the given date/time
        booking_date =self.context.get('booking_date')
        booking_time = self.context.get('booking_time')

        if not booking_date or not booking_time:
            return True
        
        is_booked = BookingModel.objects.filter(
            table = obj,
            booking_date = booking_date,
            booking_time = booking_time
        ).exists()
        return not is_booked
            



class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingModel
        exclude = ['guest_number']
        read_only_fields = ['user']
    
    def validate(self, data):
        table = data.get('table')
        booking_date = data.get('booking_date')
        booking_time = data.get('booking_time')

        if BookingModel.objects.filter(
            table = table,
            booking_date = booking_date,
            booking_time = booking_time
        ).exists():
            raise serializers.ValidationError(
                {"non_field_errors": ["Sorry, this table is already booked for the selected date and time."]}
            )
        return data
    
    def create(self, validated_data):
        table = validated_data.get('table')
        validated_data['guest_number'] = table.seats
        validated_data['user'] = self.context['request'].user
        booking = super().create(validated_data)
         # Mark table as unavailable
        table.is_available = False
        table.save()

        return booking
