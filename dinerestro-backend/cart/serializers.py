from .models import CartItemModel,CartModel
from foods.models import FoodModel
from rest_framework import serializers

class CartItemSerialzier(serializers.ModelSerializer):
    item_id = serializers.IntegerField(source = 'item.id')
    name = serializers.CharField(source = 'item.name', read_only = True)
    price = serializers.DecimalField(source = 'price_at_time', max_digits=10, decimal_places=2)
    total = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItemModel
        fields = ['item_id','name','quantity','price','total']

    def get_total(self,obj):
        return obj.price_at_time * obj.quantity
    
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerialzier(many=True, read_only = True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = CartModel
        fields = ['id','user_id','cart_key', 'items', 'total']
        read_only_fields = ['id','cart_key','total']

    def get_total(self,obj):
        return sum(item.price_at_time * item.quantity for item in obj.items.all())
    

class AddItemSerializer(serializers.Serializer):
    item_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

class UpdateItemSerializer(serializers.Serializer):
    item_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=0)
