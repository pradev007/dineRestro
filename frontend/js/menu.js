const menuItems = [
    { id: 1, category: 'Starters', name: 'Spring Rolls', price: 150, description: 'Crispy rolls with veggies', ingredients: 'Cabbage, Carrots, Noodles', prepTime: '10 mins', rating: 4.5, image: 'assets/images/foods/spring_rolls.jpg' },
    { id: 2, category: 'Main Course', name: 'Butter Chicken', price: 350, description: 'Creamy chicken curry', ingredients: 'Chicken, Butter, Cream', prepTime: '20 mins', rating: 4.8, image: 'assets/images/foods/butter_chicken.jpg' },
    { id: 3, category: 'Desserts', name: 'Gulab Jamun', price: 100, description: 'Sweet syrupy balls', ingredients: 'Milk Solids, Sugar', prepTime: '15 mins', rating: 4.7, image: 'assets/images/foods/gulab_jamun.jpg' }
];

function displayHome() {
    const menuDiv = document.getElementById('home-menu-items');
    const categories = [...new Set(menuItems.map(item => item.category))];
    menuDiv.innerHTML = categories.map(category => `
        <h3>${category}</h3>
        ${menuItems.filter(item => item.category === category).map(item => `
            <div class="menu-item">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h4>${item.name} - ₹${item.price}</h4>
                    <p>${item.description}</p>
                    <p><strong>Ingredients:</strong> ${item.ingredients}</p>
                    <p><strong>Prep Time:</strong> ${item.prepTime}</p>
                    <p><strong>Rating:</strong> ${item.rating}/5</p>
                    <button onclick="addToCart(${item.id})">Add to Cart</button>
                    <button onclick="buyNow(${item.id})">Order Now</button>
                </div>
            </div>
        `).join('')}
    `).join('');
}

function displayMenu() {
    const menuDiv = document.getElementById('menu-items');
    const categories = [...new Set(menuItems.map(item => item.category))];
    menuDiv.innerHTML = categories.map(category => `
        <h3>${category}</h3>
        ${menuItems.filter(item => item.category === category).map(item => `
            <div class="menu-item">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h4>${item.name} - ₹${item.price}</h4>
                    <p>${item.description}</p>
                    <p><strong>Ingredients:</strong> ${item.ingredients}</p>
                    <p><strong>Prep Time:</strong> ${item.prepTime}</p>
                    <p><strong>Rating:</strong> ${item.rating}/5</p>
                    <button onclick="addToCart(${item.id})">Add to Cart</button>
                    <button onclick="buyNow(${item.id})">Order Now</button>
                </div>
            </div>
        `).join('')}
    `).join('');
}