from django.db import models

# Create your models here.
class EventsModel(models.Model):
    event_name = models.CharField(max_length=50)
    descriptions = models.TextField(max_length=255)
    is_happening = models.BooleanField(default=False)
    event_date = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='media/events', null= True, blank=True)

    def __str__(self):
        return self.event_name
