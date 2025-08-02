from django.db import models

# Create your models here.

class FoodCategories(models.Model):
    name = models.CharField(max_length=100, unique= True)

    def __str__(self):
        return self.name

class FoodModel(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(FoodCategories, on_delete= models.CASCADE)
    price = models.IntegerField()
    image = models.ImageField(upload_to='foods/images/')
    description = models.TextField()
    ingredients = models.JSONField()

    def __str__(self):
        return self.name
    
