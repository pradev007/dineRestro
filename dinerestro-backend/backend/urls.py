from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from backend.views import index
from django.conf.urls.static import static

urlpatterns = [
    # path("", index, name="home"),   # root -> index.html
    path("admin/", admin.site.urls),  # Django default admin

    # Accounts (User/Vendor/Admin APIs)
    path("accounts/", include("accounts.urls")),

    # Other apps
    path("foods/", include("foods.urls")),
    path("table-booking/", include("booking.urls")),
    path("events/", include("events.urls")),
    path("cart/", include("cart.urls")),
    path("orders/", include("order.urls")),
    path("offers/", include("offers.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
