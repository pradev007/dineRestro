from django.shortcuts import render
# from rest_framework import viewsets
from .models import BookingModel,TableModel
from .serializers import BookingSerializer, TableSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
# Create your views here.

class TableView(generics.ListCreateAPIView):
    serializer_class = TableSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        booking_date = self.request.query_params.get("booking_date")
        booking_time = self.request.query_params.get("booking_time")

        tables = TableModel.objects.all()
        # Attach is_available info dynamically via context in serializer
        self.serializer_context = {
            'booking_date': booking_date,
            'booking_time': booking_time
        }
        return tables

    def get_serializer_context(self):
        return getattr(self, 'serializer_context', super().get_serializer_context())


class BookingView(generics.ListCreateAPIView):
    queryset = BookingModel.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    # def perform_create(self, serializer):
    #     serializer.save(user = self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request  # needed to set user in serializer
        return context