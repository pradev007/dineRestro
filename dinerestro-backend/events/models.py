from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
# Create your models here.

def validate_event_time(value):
    hour = value.hour
    if hour <9 or hour >=23:
        raise ValidationError("Event time must be between 9:00 AM and 11:00 PM")


class EventsModel(models.Model):
    event_name = models.CharField(max_length=50, unique= True)
    descriptions = models.TextField(max_length=255)
    is_happening = models.BooleanField(default=False)
    event_date = models.DateTimeField(validators=[validate_event_time])
    image = models.ImageField(upload_to='media/events', null= True, blank=True)

    def __str__(self):
        return self.event_name
    
    def clean(self):
        if self.event_date and self.event_date < timezone.now():
            raise ValidationError("Event date and time cannot be in the past")
        super.clean()