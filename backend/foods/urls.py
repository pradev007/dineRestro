from django.urls import path

from foods.views import FoodListCreateView, CategoryListCreateView , CategoryRetrieveView

urlpatterns = [
    path('list/', FoodListCreateView.as_view(), name= 'food-list'),
    path('categories/', CategoryListCreateView.as_view(), name='categories'),
    path('category/<int:pk>/', CategoryRetrieveView.as_view(), name='category-detail')
    
]