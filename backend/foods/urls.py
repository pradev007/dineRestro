from django.urls import path

from foods.views import FoodListCreateView

urlpatterns = [
    path('list/', FoodListCreateView.as_view(), name= 'food-list')
]