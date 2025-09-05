from django.urls import path
from .views import CreateOrderView

urlpatterns = [
    path('orders/create/', CreateOrderView.as_view(), name='create-order'),
]