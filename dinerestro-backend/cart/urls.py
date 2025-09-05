from django.urls import path
from .views import CreateCartView, CartDetailView, AddItemView, UpdateItemView, RemoveItemView

urlpatterns = [
    path('carts/', CreateCartView.as_view(), name='create-cart'),
    path('carts/<int:cart_id>/', CartDetailView.as_view(), name='cart-detail'),
    path('carts/<int:cart_id>/items/', AddItemView.as_view(), name='add-item'),
    path('carts/<int:cart_id>/items/', UpdateItemView.as_view(), name='update-item'),
    path('carts/<int:cart_id>/items/<int:item_id>/', RemoveItemView.as_view(), name='remove-item'),
]