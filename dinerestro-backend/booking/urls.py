from django.urls import path
from .views import (
    TableListView, TableAdminView,
    BookingListView, BookingCreateView, BookingAdminView
)

urlpatterns = [
    # Tables
    path("tables/", TableListView.as_view(), name="table-list"),  # user read-only
    path("tables/admin/", TableAdminView.as_view(), name="table-admin"),  # admin CRUD

    # Bookings
    path("bookings/", BookingListView.as_view(), name="booking-list"),  # user sees own
    path("bookings/create/", BookingCreateView.as_view(), name="booking-create"),  # user creates
    path("bookings/admin/", BookingAdminView.as_view(), name="booking-admin"),  # admin CRUD
]
