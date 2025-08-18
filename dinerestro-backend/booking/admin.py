from django.contrib import admin
from .models import BookingModel, TableModel

class BookingTableAdmin(admin.ModelAdmin):
    list_display = ('table', 'user', 'booking_date', 'booking_time', 'number_of_seats', 'guest_number')
    readonly_fields = ('guest_number',)  # user cannot edit

    def number_of_seats(self, obj):
        return obj.table.seats
    number_of_seats.short_description = 'Seats'

    # Automatically set guest_number based on table's seats
    def save_model(self, request, obj, form, change):
        obj.guest_number = obj.table.seats
        super().save_model(request, obj, form, change)
  


class TableAdmin(admin.ModelAdmin):
    list_display = ('table_number', 'seats')  # corrected field names

admin.site.register(BookingModel, BookingTableAdmin)
admin.site.register(TableModel, TableAdmin)
