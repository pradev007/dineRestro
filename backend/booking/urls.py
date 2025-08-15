from .views import BookingView , TableView
from django.urls import path, include

urlpatterns = [
    path('booking/', BookingView.as_view(), name='booking'),
    path('table/', TableView.as_view(), name='table'),
]