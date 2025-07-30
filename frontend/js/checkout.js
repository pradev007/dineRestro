function displayCheckout() {
    const checkoutDiv = document.getElementById('checkout-items');
    const totalDiv = document.getElementById('checkout-total');
    checkoutDiv.innerHTML = cart.map(item => `
        <div class="cart-item">
            <p>${item.name} - ₹${item.price}</p>
        </div>
    `).join('');
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalDiv.innerText = `Total: ₹${total}`;
}