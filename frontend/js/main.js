function showScreen(screenId) {
    fetch(`templates/${screenId}.html`)
        .then(response => response.text())
        .then(html => {
            document.getElementById('main-content').innerHTML = html;
            document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
            document.getElementById(screenId).classList.add('active');
            if (screenId === 'onboarding') displayHome();
            // if (screenId === 'menu') displayMenu();
            if (screenId === 'cart') displayCart();
            if (screenId === 'checkout') displayCheckout();
        });
}