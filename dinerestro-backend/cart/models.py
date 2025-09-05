from django.db import models
from accounts.models import CustomUser
from foods.models import FoodModel
import uuid

# Create your models here.
class CartModel(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    cart_key = models.UUIDField(default=uuid.uuid4, editable=False, unique= True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart{self.id} ({self.user or 'Anonymous'})"

class CartItemModel(models.Model):
    cart = models.ForeignKey(CartModel, on_delete=models.CASCADE, related_name='items') 
    item = models.ForeignKey('foods.FoodModel', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price_at_time = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.item.name} in Cart {self.cart.id}"
    
    class Meta:
        unique_together = ('cart','item')