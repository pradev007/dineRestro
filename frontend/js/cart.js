let cart = [];

function addToCart(itemId) {
    if (!currentUser) {
        showScreen('signin');
        return;
    }
    const item = menuItems.find(i => i.id === itemId);
    cart.push(item);
    displayCart();
}

function buyNow(itemId) {
    if (!currentUser) {
        showScreen('signin');
        return;
    }
    cart = [menuItems.find(i => i.id === itemId)];
    showScreen('cart');
}

function displayCart() {
    const cartDiv = document.getElementById('cart-items');
    const totalDiv = document.getElementById('cart-total');
    cartDiv.innerHTML = cart.map(item => `
        <div class="cart-item">
            <p>${item.name} - ₹${item.price}</p>
        </div>
    `).join('');
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalDiv.innerText = `Total: ₹${total}`;
}