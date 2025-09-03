from django.db import models
from accounts.models import CustomUser
# Create your models here.

class FoodCategories(models.Model):
    name = models.CharField(max_length=100, unique= True)

    def __str__(self):
        return self.name

class FoodModel(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(FoodCategories, on_delete= models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='foods/images/', null= True, blank=True)
    description = models.TextField(blank=True)
    ingredients = models.JSONField(default=list)

    def __str__(self):
        return self.name
    
class Favourite(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='favourites')
    food = models.ForeignKey(FoodModel, on_delete=models.CASCADE, related_name= 'favouritedd_by')
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ('user', 'food')
        verbose_name = 'Favlourite'
        verbose_name_plural = "Favourites"

    def __str__(self):
        return f"{self.user.fullname} - {self.food.name}"
