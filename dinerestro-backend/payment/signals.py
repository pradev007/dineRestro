# payments/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from order.models import OrderModel
from .models import Payment

@receiver(post_save, sender=OrderModel)
def create_payment_for_order(sender, instance, created, **kwargs):
    if created:
        Payment.objects.create(
            order=instance,
            user=instance.user,
            amount=instance.total,
            status="pending",
        )
