from django.contrib import admin
from .models import OrderModel, OrderItemModel
from decimal import Decimal

class OrderItemInline(admin.TabularInline):
    model = OrderItemModel
    extra = 0
    fields = ('item', 'quantity', 'price_at_time', 'item_total')
    readonly_fields = ('price_at_time', 'item_total')

    def item_total(self, obj):
        return obj.price_at_time * obj.quantity
    item_total.short_description = 'Item Total'

@admin.register(OrderModel)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_display', 'cart_id', 'total', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at', 'updated_at')
    search_fields = ('id', 'user__fullname', 'cart__id')
    inlines = [OrderItemInline]
    readonly_fields = ('cart', 'total', 'created_at', 'updated_at')
    fields = ('user', 'cart', 'total', 'status', 'created_at', 'updated_at')

    def user_display(self, obj):
        return obj.user.fullname if obj.user else 'Anonymous'
    user_display.short_description = 'User'

    def cart_id(self, obj):
        return obj.cart.id if obj.cart else 'N/A'
    cart_id.short_description = 'Cart ID'

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'cart').prefetch_related('items__item')