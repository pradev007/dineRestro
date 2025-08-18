from django.urls import path
from .views import register_user, login_user
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/',login_user,name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]