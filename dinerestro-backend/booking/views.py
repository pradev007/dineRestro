from django.shortcuts import render
# from rest_framework import viewsets
from .models import BookingModel,TableModel
from .serializers import BookingSerializer, TableSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser , AllowAny
from rest_framework import generics
# Create your views here.



# -------- Tables --------

class TableListView(generics.ListAPIView):
    serializer_class = TableSerializer
    permission_classes = [AllowAny]

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


class TableAdminView(generics.ListCreateAPIView):
    """Admins can create tables (and list)."""
    queryset = TableModel.objects.all()
    serializer_class = TableSerializer
    permission_classes = [IsAdminUser]




# -------- Bookings --------
class BookingListView(generics.ListAPIView):
    """Users can view their own bookings."""
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BookingModel.objects.filter(user=self.request.user)


class BookingCreateView(generics.CreateAPIView):
    """Users can book a table (create booking)."""
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BookingAdminView(generics.ListCreateAPIView):
    """Admins can see all bookings and create manually if needed."""
    queryset = BookingModel.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAdminUser]