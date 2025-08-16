from rest_framework.generics import (
    ListAPIView, RetrieveAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
)
from .models import EventsModel
from .serializers import EventSerializer
from rest_framework.permissions import IsAdminUser, AllowAny


# -------- Admin Views (CRUD) --------
class EventCreateView(CreateAPIView):
    queryset = EventsModel.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAdminUser]


class EventUpdateView(UpdateAPIView):
    queryset = EventsModel.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAdminUser]


class EventDeleteView(DestroyAPIView):
    queryset = EventsModel.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAdminUser]


# -------- User Views (Read-only) --------
class EventListView(ListAPIView):
    queryset = EventsModel.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]


class EventDetailView(RetrieveAPIView):
    queryset = EventsModel.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]
