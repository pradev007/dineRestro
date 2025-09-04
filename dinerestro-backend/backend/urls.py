from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from backend.views import index
from django.conf.urls.static import static

urlpatterns = [
    path("", index, name="home"),   # root -> index.html
    path("admin/", admin.site.urls),
    path("users/", include("accounts.urls")),
    path("foods/", include("foods.urls")),
    path("table-booking/", include("booking.urls")),
    path("events/", include("events.urls")),
    # path("api/", include("payment.urls")),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

