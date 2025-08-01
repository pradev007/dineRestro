from django.db import models

# Create your models here.
class FoodModel(models.Model):
    name = models.CharField(max_length=255)
    price = models.IntegerField(max_length=5)
    image = models.ImageField(upload_to='foods/images/')
    description = models.TextField()
    ingredients = models.JSONField()

    def __str__(self):
        return self.name