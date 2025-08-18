from django.urls import path
from .views import (
    EventCreateView, EventUpdateView, EventDeleteView,
    EventListView, EventDetailView
)

urlpatterns = [
    # Admin CRUD
    path("create/", EventCreateView.as_view(), name="event-create"),
    path("update/<int:pk>/", EventUpdateView.as_view(), name="event-update"),
    path("delete/<int:pk>/", EventDeleteView.as_view(), name="event-delete"),

    # User read-only
    path("list/", EventListView.as_view(), name="event-list"),
    path("details/<int:pk>/", EventDetailView.as_view(), name="event-detail"),
]
