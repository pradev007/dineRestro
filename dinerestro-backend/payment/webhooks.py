# payments/webhooks.py
import stripe
from django.http import HttpResponse
from django.conf import settings
from .models import Payment

stripe.api_key = settings.STRIPE_SECRET_KEY

def stripe_webhook(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except (ValueError, stripe.error.SignatureVerificationError):
        return HttpResponse(status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        order_id = session['metadata']['order_id']
        try:
            payment = Payment.objects.get(order_id=order_id)
            payment.status = "completed"
            payment.save()
        except Payment.DoesNotExist:
            pass

    return HttpResponse(status=200)
