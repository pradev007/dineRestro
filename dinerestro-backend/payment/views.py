# payments/views.py
import stripe
from django.conf import settings
from django.shortcuts import get_object_or_404
from order.models import OrderModel

stripe.api_key = settings.STRIPE_SECRET_KEY

def create_checkout_session(request, order_id):
    order = get_object_or_404(OrderModel, id=order_id, user=request.user)

    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[
            {
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': f"Order {order.id}",
                    },
                    'unit_amount': int(order.total * 100),  # cents
                },
                'quantity': 1,
            },
        ],
        mode='payment',
        success_url='http://localhost:8000/success/',
        cancel_url='http://localhost:8000/cancel/',
        metadata={
            "order_id": str(order.id)
        }
    )

    # Save session/payment intent to our Payment model
    payment = order.payment
    payment.stripe_payment_intent = session.payment_intent
    payment.save()

    return JsonResponse({'id': session.id})
