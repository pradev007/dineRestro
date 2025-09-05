from django.contrib import admin
from .models import CartModel, CartItemModel
from decimal import Decimal

class CartItemInline(admin.TabularInline):
    model = CartItemModel
    extra = 1
    fields = ('item', 'quantity', 'price_at_time', 'item_total')
    readonly_fields = ('price_at_time', 'item_total')

    def item_total(self, obj):
        return obj.price_at_time * obj.quantity
    item_total.short_description = 'Item Total'

@admin.register(CartModel)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_display', 'cart_key', 'created_at', 'updated_at', 'cart_total')
    list_filter = ('user', 'created_at', 'updated_at')
    search_fields = ('id', 'user__fullname', 'cart_key')
    inlines = [CartItemInline]
    readonly_fields = ('cart_key', 'created_at', 'updated_at', 'cart_total')
    fields = ('user', 'cart_key', 'created_at', 'updated_at', 'cart_total')

    def user_display(self, obj):
        return obj.user.fullname if obj.user else 'Anonymous'
    user_display.short_description = 'User'

    def cart_total(self, obj):
        return sum(item.price_at_time * item.quantity for item in obj.items.all())
    cart_total.short_description = 'Total'

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user').prefetch_related('items__item')