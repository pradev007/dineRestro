from django.contrib import admin
from django.db import models
from .models import EventsModel
from django.contrib.admin.widgets import AdminSplitDateTime

@admin.register(EventsModel)
class EventsModelAdmin(admin.ModelAdmin):
    list_display = ('event_name', 'event_date', 'is_happening', 'descriptions')
    list_filter = ('is_happening', 'event_date')
    search_fields = ('event_name', 'descriptions')
    date_hierarchy = 'event_date'
    fields = ('event_name', 'descriptions', 'is_happening', 'event_date', 'image')

    # Enable split datetime picker with calendar and time input
    formfield_overrides = {
        models.DateTimeField: {
            'widget': AdminSplitDateTime(
                attrs={
                    'date_attrs': {'class': 'datepicker'},  # Optional: Add class for styling
                    'time_attrs': {'class': 'timepicker'}   # Optional: Add class for styling
                }
            )
        },
    }