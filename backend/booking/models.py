from django.db import models
from accounts.models import CustomUser

# Create your models here.
class TableModel(models.Model):
    table_number = models.PositiveIntegerField(unique=True)
    seats = models.PositiveIntegerField()

    def __str__(self):
        return str(self.table_number)

class BookingModel(models.Model):
    table = models.ForeignKey(TableModel, related_name='booking', on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, related_name="booking", on_delete=models.CASCADE)
    booking_date = models.DateField()
    booking_time = models.TimeField()
    guest_number = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('table', 'booking_date', 'booking_time')

    def __str__(self):
        return f"{self.user.fullname} - {self.table} on {self.booking_date} at {self.booking_time}"
    
    def save(self, *args, **kwargs):
        # automatically set guest_number based on table
        self.guest_number = self.table.seats
        super().save(*args, **kwargs)