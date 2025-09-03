from django.contrib import admin
from .models import FoodModel, FoodCategories, Favourite

# Register your models here.

class FoodAdmin(admin.ModelAdmin):
    list_display = ('name', 'price')

admin.site.register(FoodModel,FoodAdmin)
admin.site.register(FoodCategories)
admin.site.register(Favourite)