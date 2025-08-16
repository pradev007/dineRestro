"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from backend import settings
from foods.views import FoodListCreateView
from django.conf.urls.static import static

# from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
urlpatterns = [
    path('admin/', admin.site.urls),

    # path('schema/', SpectacularAPIView.as_view(), name='schema'),
    # path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('users/', include('accounts.urls')), 
    path('foods/', include('foods.urls')),
    path('table-booking/', include('booking.urls')),
    path('events/', include('events.urls')),
]

# Serve media files during development
if settings.DEBUG:

    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)