from django.urls import path
from .views import (
    register_user, login_user,
    register_vendor, login_vendor,
    register_admin, login_admin
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # ----- USER -----
    path('user/register/', register_user, name='user_register'),
    path('user/login/', login_user, name='user_login'),

    # ----- VENDOR -----
    path('vendor/register/', register_vendor, name='vendor_register'),
    path('vendor/login/', login_vendor, name='vendor_login'),

    # ----- ADMIN (custom super-admin login) -----
    path('admin/register/', register_admin, name='admin_register'),
    path('admin/login/', login_admin, name='admin_login'),

    # JWT Token refresh
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
