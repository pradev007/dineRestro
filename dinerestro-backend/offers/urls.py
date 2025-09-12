from django.urls import path
from .views import offerListCreateView

urlpatterns = [
    path('offers/',offerListCreateView.as_view(),name='offer'),
]