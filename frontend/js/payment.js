function processPayment() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    if (document.getElementById('card-number').value && document.getElementById('card-expiry').value && document.getElementById('card-cvc').value) {
        displayInvoice(total, 'Order');
        cart = [];
    } else {
        document.getElementById('payment-error').style.display = 'block';
    }
}