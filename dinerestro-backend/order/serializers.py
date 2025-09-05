from rest_framework import serializers
from .models import OrderModel, OrderItemModel
from cart.models import CartModel, CartItemModel

class OrderItemSerializer(serializers.ModelSerializer):
    item_id = serializers.IntegerField(source='item.id')
    name = serializers.CharField(source='item.name', read_only=True)
    price = serializers.DecimalField(source='price_at_time', max_digits=10, decimal_places=2)
    total = serializers.SerializerMethodField()

    class Meta:
        model = OrderItemModel
        fields = ['item_id', 'name', 'quantity', 'price', 'total']

    def get_total(self, obj):
        return obj.price_at_time * obj.quantity

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    cart_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = OrderModel
        fields = ['id', 'user_id', 'cart_id', 'total', 'status', 'created_at', 'updated_at', 'items']
        read_only_fields = ['id', 'user_id', 'total', 'status', 'created_at', 'updated_at', 'items']

    def validate(self, data):
        """Validate that the cart is not empty."""
        cart_id = data.get('cart_id')
        try:
            cart = CartModel.objects.get(id=cart_id)
            if not cart.items.exists():
                raise serializers.ValidationError({'error': 'Cannot create order: Cart is empty'})
            if self.context['request'].user.is_authenticated and cart.user != self.context['request'].user:
                raise serializers.ValidationError({'error': 'Unauthorized: Cart does not belong to user'})
            if not self.context['request'].user.is_authenticated and cart.cart_key != self.context['request'].query_params.get('cart_key'):
                raise serializers.ValidationError({'error': 'Invalid cart_key'})
        except CartModel.DoesNotExist:
            raise serializers.ValidationError({'error': 'Cart not found'})
        return data

    def create(self, validated_data):
        cart = CartModel.objects.get(id=validated_data['cart_id'])
        user = self.context['request'].user if self.context['request'].user.is_authenticated else None
        total = sum(item.price_at_time * item.quantity for item in cart.items.all())
        
        order = OrderModel.objects.create(
            user=user,
            cart=cart,
            total=total,
            status='pending'
        )
        
        for cart_item in cart.items.all():
            OrderItemModel.objects.create(
                order=order,
                item=cart_item.item,
                quantity=cart_item.quantity,
                price_at_time=cart_item.price_at_time
            )
        
        # Optionally clear the cart after order creation
        cart.items.all().delete()
        
        return order