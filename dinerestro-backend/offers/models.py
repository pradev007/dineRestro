from django.db import models

# Create your models here.
class offerModel(models.Model):
    name = models.CharField(max_length=255, unique=True)
    date = models.DateTimeField()
    discount = models.IntegerField(null=True,blank=True)

    def __str__(self):
        return self.name

