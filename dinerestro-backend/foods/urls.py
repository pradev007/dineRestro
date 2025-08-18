from django.urls import path
from .views import (
    CategoryAdminView, CategoryAdminDetailView,
    CategoryListView, CategoryDetailView,
    FoodAdminView, FoodAdminDetailView,
    FoodListView, FoodDetailView
)

urlpatterns = [
    # Categories - admin
    path("categories/admin/", CategoryAdminView.as_view(), name="category-admin"),
    path("categories/admin/<int:pk>/", CategoryAdminDetailView.as_view(), name="category-admin-detail"),

    # Categories - user
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("categories/<int:pk>/", CategoryDetailView.as_view(), name="category-detail"),

    # Food items - admin
    path("foods/admin/", FoodAdminView.as_view(), name="food-admin"),
    path("foods/admin/<int:pk>/", FoodAdminDetailView.as_view(), name="food-admin-detail"),

    # Food items - user
    path("foods/", FoodListView.as_view(), name="food-list"),
    path("foods/<int:pk>/", FoodDetailView.as_view(), name="food-detail"),
]
