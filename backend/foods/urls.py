from django.urls import path

from foods.views import FoodListCreateView, CategoryListCreateView

urlpatterns = [
    path('list/', FoodListCreateView.as_view(), name= 'food-list'),
    path('category/', CategoryListCreateView.as_view(), name='category'),
    
]