// Global state
let currentPage = "home";
let isLoggedIn = false;
let isAdmin = false;
let selectedCategory = "all";
let selectedTable = null;
let bookingDetails = { date: "", time: "", guests: 2, table: "" };
let cart = [];
const baseUrl = "http://127.0.0.1:8000/";

// Booking pricing structure
const bookingPrices = {
  1: 200,
  2: 300,
  3: 400,
  4: 500,
  5: 600,
  6: 700,
  7: 800,
  8: 800,
};

// Static data for events, discounts, and staff
const events = [
  {
    id: 1,
    type: "current",
    name: "Live Music Night",
    date: "August 12, 2025",
    description: "Enjoy live jazz with local artists tonight!",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 2,
    type: "upcoming",
    name: "Coffee Tasting Workshop",
    date: "August 20, 2025",
    description: "Learn about coffee origins and brewing techniques.",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
];

const discounts = [
  {
    occasion: "National Coffee Day",
    date: "September 29, 2025",
    offer: "50% off all coffee drinks",
  },
  {
    occasion: "Cafe Anniversary",
    date: "October 10, 2025",
    offer: "Buy one dessert, get one free",
  },
  {
    occasion: "Halloween Special",
    date: "October 31, 2025",
    offer: "20% off all spooky-themed drinks",
  },
  {
    occasion: "Thanksgiving Week",
    date: "November 24-30, 2025",
    offer: "Free dessert with any main course",
  },
  {
    occasion: "Christmas Celebration",
    date: "December 20-25, 2025",
    offer: "25% off all festive drinks and desserts",
  },
  {
    occasion: "New Year Countdown",
    date: "December 31, 2025",
    offer: "Free champagne toast with any meal",
  },
];

const staff = [
  {
    name: "Chef Anna",
    role: "Head Chef",
    bio: "Anna brings 10 years of culinary expertise to our signature dishes.",
    image:
      "https://images.unsplash.com/photo-1583394293214-28ded15f4d90?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "Barista Mike",
    role: "Lead Barista",
    bio: "Mike's latte art and coffee blends are a guest favorite.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d877c6f8f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "Pastry Chef Lisa",
    role: "Pastry Chef",
    bio: "Lisa's desserts are a sweet ending to any meal.",
    image:
      "https://images.unsplash.com/photo-1589927986089-358123789b8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
];

// Utility functions
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function showToast(message, type = "success") {
  const toastContainer = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast flex items-center p-2 y-20 rounded-lg shadow-lg bg-green-400 ${
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-blue-600"
  } text-white opacity-0 transform translate-x-8`;
  toast.innerHTML = `
    <i class="fas ${
      type === "success"
        ? "fa-check-circle"
        : type === "error"
        ? "fa-exclamation-circle"
        : "fa-info-circle"
    } mr-2"></i>
    <span>${message}</span>
  `;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("translate-x-8");
    toast.classList.add("opacity-100");
  }, 10);

  setTimeout(() => {
    toast.classList.add("translate-x-8");
    toast.classList.remove("opacity-100");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// API functions
async function makeRequest(url, method, body = null, requiresAuth = false) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (requiresAuth && localStorage.getItem("accessToken")) {
    headers["Authorization"] = `Bearer ${localStorage.getItem("accessToken")}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    showToast(error.message || "API request failed", "error");
    throw error;
  }
}

async function registerUser(email, password, fullname) {
  try {
    const data = await makeRequest(`${baseUrl}users/register/`, "POST", {
      email,
      password,
      fullname,
    });
    showToast(data.message || "Registration successful");
    return data;
  } catch (error) {
    return null;
  }
}

async function loginUser(email, password) {
  try {
    const data = await makeRequest(`${baseUrl}users/login/`, "POST", {
      email,
      password,
    });

    if (data.staff || data.superuser) {
      throw new Error("Staff or admin accounts cannot log in here");
    }

    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        email: data.email,
        fullname: data.fullname,
        staff: data.staff,
        active: data.active,
        superuser: data.superuser,
      })
    );

    isLoggedIn = true;
    isAdmin = false;

    updateNavbar();
    showToast(`Welcome back, ${data.fullname}!`);

    const redirectPage = ["signin", "signup"].includes(currentPage) ? "home" : currentPage;
    showPage(redirectPage);

    return data;
  } catch (error) {
    console.error("Login error:", error);
    showToast(error.message || "Login failed", "error");
    return null;
  }
}

function logoutUser() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userData");
  isLoggedIn = false;
  isAdmin = false;
  cart = [];
  updateNavbar();
  showToast("Logged out successfully");
  showPage("home");
}

async function loadCategories() {
  try {
    const data = await makeRequest(`${baseUrl}foods/categories/`, "GET", null, true);
    return data.filter(category => category.name && category.name.trim() !== "" && category.name !== "string");
  } catch (error) {
    console.error("Error fetching categories:", error);
    showToast("Failed to load categories", "error");
    return [];
  }
}

async function loadFoodItems() {
  try {
    const data = await makeRequest(`${baseUrl}foods/list/`, "GET", null, true);
    return data.map((item) => ({
      ...item,
      is_favorite: item.is_favorite || false,
      image: item.image && item.image.startsWith("http") ? item.image : null,
      ingredients: item.ingredients || [],
    }));
  } catch (error) {
    console.error("Error fetching food items:", error);
    showToast("Failed to load menu items", "error");
    return [];
  }
}

async function toggleFavorite(id, element = null) {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      showToast("Please log in to add favorites", "error");
      showPage("signin");
      return;
    }

    const response = await fetch(`${baseUrl}foods/favorites/${id}/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to update favorite");
    }

    const data = await response.json();

    if (element) {
      const isFavorite = data.is_favorite;
      if (isFavorite) {
        element.classList.add("text-red-500");
        element.classList.remove("text-gray-400");
      } else {
        element.classList.add("text-gray-400");
        element.classList.remove("text-red-500");
      }
    }

    showToast(data.is_favorite ? "Added to favorites" : "Removed from favorites");
    return data;
  } catch (error) {
    console.error("Error toggling favorite:", error);
    showToast(error.message || "Failed to update favorite", "error");
    return null;
  }
}

async function addCategory(name) {
  if (!isAdmin) {
    showToast("Admin access required to add categories", "error");
    return null;
  }

  try {
    const data = await makeRequest(`${baseUrl}foods/categories/`, "POST", { name }, true);
    showToast("Category added successfully");
    return data;
  } catch (error) {
    console.error("Error adding category:", error);
    showToast("Failed to add category", "error");
    return null;
  }
}

function addToCart(id) {
  if (!isLoggedIn) {
    showToast("Please log in to add items to cart", "error");
    showPage("signin");
    return;
  }

  loadFoodItems().then(foods => {
    const food = foods.find((item) => String(item.id) === String(id));
    if (!food) {
      showToast("Item not found", "error");
      return;
    }

    const existingItem = cart.find((item) => String(item.id) === String(id));
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
      showToast(`${food.name} quantity updated in cart!`, "success");
    } else {
      cart.push({ ...food, quantity: 1 });
      showToast(`${food.name} added to cart!`, "success");
    }

    saveCartToStorage();
    updateCartCount();
    updateCartDisplay();
  });
}

function removeFromCart(index) {
  const item = cart[index];
  if (item.quantity > 1) {
    item.quantity -= 1;
    showToast(`${item.name} quantity reduced in cart`, "success");
  } else {
    cart.splice(index, 1);
    showToast(`${item.name} removed from cart`, "success");
  }
  saveCartToStorage();
  updateCartCount();
  updateCartDisplay();
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  const mobileCartCount = document.getElementById("mobile-cart-count");
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  if (cartCount) {
    cartCount.textContent = totalItems;
    cartCount.classList.toggle("hidden", totalItems === 0);
  }
  if (mobileCartCount) {
    mobileCartCount.textContent = totalItems;
    mobileCartCount.classList.toggle("hidden", totalItems === 0);
  }
}

function updateCartDisplay() {
  const cartItemsDiv = document.getElementById("cart-items");
  if (cartItemsDiv) {
    if (cart.length === 0) {
      cartItemsDiv.innerHTML = `
        <div class="text-center py-12">
          <i class="fas fa-shopping-basket text-5xl text-gray-300 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-500">Your cart is empty</h3>
          <button onclick="showPage('menu')" class="text-green-600 font-medium mt-4 hover:text-green-800">
            Browse Menu
          </button>
        </div>
      `;
    } else {
      cartItemsDiv.innerHTML = cart
        .map(
          (item, index) => `
            <div class="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 last:border-0">
              <div class="flex items-center">
                ${item.image ? `<img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover mr-4" />` : `<div class="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-lg mr-4"><span class="text-gray-500 text-xs">Not Available</span></div>`}
                <div>
                  <h3 class="font-medium">${item.name}</h3>
                  <p class="text-green-600 font-bold">$${item.price.toFixed(2)} x ${item.quantity || 1}</p>
                </div>
              </div>
              <button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-700 transition-all duration-300">
                <i class="fas fa-times"></i>
              </button>
            </div>
          `
        )
        .join("");
    }
  }
}

function saveCartToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCartFromStorage() {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    cart = JSON.parse(storedCart);
    updateCartCount();
    updateCartDisplay();
  }
}

function placeOrder() {
  if (!isLoggedIn) {
    showToast("Please log in to place an order", "error");
    showPage("signin");
    return;
  }

  if (cart.length === 0) {
    showToast("Your cart is empty", "error");
    return;
  }

  const orderType = document.querySelector('input[name="order-type"]:checked')?.value;
  const deliveryAddress = document.getElementById("delivery-address")?.value;
  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
  const instructions = document.getElementById("instructions")?.value || "";

  if (!orderType) {
    showToast("Please select an order type", "error");
    return;
  }

  if (orderType === "delivery" && !deliveryAddress) {
    showToast("Please enter a delivery address", "error");
    return;
  }

  if (!paymentMethod) {
    showToast("Please select a payment method", "error");
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const deliveryFee = orderType === "delivery" ? 2.99 : 0;
  const total = (subtotal + deliveryFee).toFixed(2);

  const orderDetails = {
    items: cart,
    subtotal: subtotal.toFixed(2),
    deliveryFee: deliveryFee.toFixed(2),
    total,
    type: orderType,
    address: orderType === "delivery" ? deliveryAddress : "Pickup at Cafe",
    paymentMethod,
    instructions,
  };

  document.getElementById("booking-details").innerHTML = `
    <div class="space-y-2">
      <div class="flex justify-between">
        <span class="text-gray-600">Order Type:</span>
        <span class="font-medium">${orderDetails.type === "delivery" ? "Delivery" : "Pickup"}</span>
      </div>
      ${orderDetails.type === "delivery" ? `
        <div class="flex justify-between">
          <span class="text-gray-600">Address:</span>
          <span class="font-medium">${orderDetails.address}</span>
        </div>
      ` : ""}
      <div class="flex justify-between">
        <span class="text-gray-600">Payment Method:</span>
        <span class="font-medium">${orderDetails.paymentMethod === "cash-on-delivery" ? "Cash on Delivery" : "Credit/Debit Card"}</span>
      </div>
      ${instructions ? `
        <div class="flex flex-col">
          <span class="text-gray-600">Special Instructions:</span>
          <span class="font-medium">${instructions}</span>
        </div>
      ` : ""}
      <div class="border-t border-gray-200 my-2"></div>
      <div>
        <p class="text-gray-600 mb-1">Items:</p>
        <ul class="list-disc list-inside text-sm">
          ${orderDetails.items.map(item => `<li>${item.name} (x${item.quantity || 1}) - $${(item.price * (item.quantity || 1)).toFixed(2)}</li>`).join("")}
        </ul>
      </div>
      <div class="border-t border-gray-200 my-2"></div>
      <div class="flex justify-between">
        <span class="text-gray-600">Subtotal:</span>
        <span class="font-medium">$${orderDetails.subtotal}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-600">Delivery Fee:</span>
        <span class="font-medium">$${orderDetails.deliveryFee}</span>
      </div>
      <div class="flex justify-between text-lg font-bold">
        <span>Total:</span>
        <span class="text-green-600">$${orderDetails.total}</span>
      </div>
      <p class="text-sm text-gray-500 mt-2">Scan the QR code to complete your order payment</p>
    </div>
  `;

  document.getElementById("payment-modal").classList.remove("hidden");
}

function completePayment() {
  document.getElementById("payment-modal").classList.add("hidden");
  showToast("Payment completed successfully! Your order is confirmed.", "success");
  cart = [];
  saveCartToStorage();
  if (document.getElementById("delivery-address")) {
    document.getElementById("delivery-address").value = "";
  }
  if (document.getElementById("instructions")) {
    document.getElementById("instructions").value = "";
  }
  document.querySelector('input[name="order-type"][value="delivery"]').checked = true;
  selectOrderType("delivery");
  updateCartCount();
  updateCartDisplay();
  showPage("home");
}

function closeModal() {
  document.getElementById("payment-modal").classList.add("hidden");
}

// Page rendering functions
async function renderHomePage() {
  const foods = await loadFoodItems();
  const categories = await loadCategories();
  const popularItems = foods.sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 4);

  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = `
    <div class="space-y-16">
      <!-- Hero Section -->
      <section class="relative h-screen-80 rounded-2xl overflow-hidden hero-section animate__animated animate__fadeIn">
        <div class="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center px-4">
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 animate__animated animate__fadeInDown">Savor Exceptional Dining</h1>
          <p class="text-xl md:text-2xl text-white mb-8 max-w-3xl animate__animated animate__fadeIn animate__delay-1s">Experience culinary excellence with our carefully crafted menu and impeccable service</p>
          <div class="flex flex-col sm:flex-row gap-4 animate__animated animate__fadeInUp animate__delay-2s">
            <button onclick="showPage('menu')" class="btn-primary text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-xl transition-all duration-300">
              <i class="fas fa-utensils mr-2"></i> Explore Menu
            </button>
            <button onclick="showPage('booking')" class="bg-white text-green-600 px-8 py-4 rounded-xl text-lg font-medium border-2 border-white hover:bg-transparent hover:text-white transition-all duration-300">
              <i class="fas fa-calendar-alt mr-2"></i> Book a Table
            </button>
          </div>
        </div>
      </section>

      <!-- Featured Categories -->
      <section class="animate__animated animate__fadeIn">
        <h2 class="text-3xl font-bold text-center mb-12 gradient-text">Our Menu Categories</h2>
        ${categories.length === 0 ? `
          <div class="text-center py-12">
            <i class="fas fa-utensils text-5xl text-gray-400 mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-600">No categories found</h3>
            <p class="text-gray-500">Please try again later or contact support.</p>
          </div>
        ` : `
          <div class="grid grid-cols-2 md:grid-cols-6 gap-2">
            ${categories.map(category => `
              <div class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer" onclick="filterFoods('${category.name}')">
                <h3 class="text-xl font-semibold text-center">${category.name}</h3>
              </div>
            `).join("")}
          </div>
        `}
      </section>

      <!-- Popular Dishes -->
      <section class="animate__animated animate__fadeIn">
        <h2 class="text-3xl font-bold text-center mb-12 gradient-text">Popular Dishes</h2>
        ${popularItems.length === 0 ? `
          <div class="text-center py-12">
            <i class="fas fa-utensils text-5xl text-gray-400 mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-600">No popular dishes found</h3>
            <p class="text-gray-500">Please try again later or contact support.</p>
          </div>
        ` : `
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            ${popularItems.map(food => `
              <div class="food-card bg-white rounded-xl overflow-hidden relative">
                <div class="absolute top-4 right-4 z-10">
                  <button onclick="toggleFavorite('${food.id}', this)" class="fav-icon text-2xl ${food.is_favorite ? "text-red-500" : "text-gray-300"} hover:text-red-500">
                    <i class="fas fa-heart"></i>
                  </button>
                </div>
                ${food.image ? `<img src="${food.image}" alt="${food.name}" class="w-full h-48 object-cover" />` : `<div class="w-full h-48 bg-gray-100 flex items-center justify-center"><span class="text-gray-500">Not Available</span></div>`}
                <div class="p-5">
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-semibold">${food.name}</h3>
                    <span class="text-green-600 font-bold">$${food.price.toFixed(2)}</span>
                  </div>
                  <p class="text-gray-600 text-sm mb-4">${food.description}</p>
                  <button onclick="addToCart('${food.id}')" class="btn-primary text-white px-4 py-2 rounded-lg w-full hover:shadow-lg transition-all duration-300">
                    <i class="fas fa-plus mr-2"></i> Add to Cart
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
          <div class="mt-8 flex justify-center">
            <button onclick="showPage('menu')" class="btn-primary text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
              View All
            </button>
          </div>
        `}
      </section>

      <!-- Special Offers -->
      <section class="bg-gradient-to-r from-yellow-100 to-yellow-300 rounded-2xl p-8 text animate__animated animate__fadeIn">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4 text-yellow-800">Special Offers</h2>
          <p class="text-xl mb-6 text-yellow-700">Enjoy our exclusive deals and discounts</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${discounts.map(discount => `
              <div class="bg-yellow-50 rounded-xl p-6 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
                <h3 class="text-xl font-bold mb-2 text-yellow-900">${discount.occasion}</h3>
                <p class="mb-3 text-yellow-700">${discount.date}</p>
                <p class="text-lg font-bold text-yellow-800">${discount.offer}</p>
              </div>
            `).join("")}
          </div>
        </div>
      </section>

      <!-- Events Section -->
      <section class="animate__animated animate__fadeIn">
        <h2 class="text-3xl font-bold text-center mb-12 text-purple-600">Upcoming Events</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          ${events.map(event => `
            <div class="bg-yellow-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              ${event.image ? `<img src="${event.image}" alt="${event.name}" class="w-full h-64 object-cover" />` : `<div class="w-full h-64 bg-gray-100 flex items-center justify-center"><span class="text-gray-500">Not Available</span></div>`}
              <div class="bg-yellow-50 text-purple-600 p-6">
                <div class="flex justify-between items-center mb-3">
                  <span class="px-3 py-1 rounded-full text-sm font-medium ${event.type === "current" ? "bg-yellow-200 text-purple-600" : "bg-yellow-300 text-purple-600"}">
                    ${event.type === "current" ? "Happening Now" : "Coming Soon"}
                  </span>
                  <span class="text-purple-600">${event.date}</span>
                </div>
                <h3 class="text-xl font-bold mb-2">${event.name}</h3>
                <p class="text-purple-600 mb-4">${event.description}</p>
                <button class="text-purple-600 font-medium hover:text-purple-600 flex items-center">
                  Learn More <i class="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      </section>
    </div>
  `;

  const heroSection = document.querySelector(".hero-section");
  if (heroSection) {
    heroSection.style.backgroundImage = "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')";
  }
}

async function renderMenuPage() {
  const foods = await loadFoodItems();
  const categories = await loadCategories();
  const uniqueCategories = ["all", ...new Set(categories.map(cat => cat.name))];
  const filteredFoods = selectedCategory === "all" ? foods : foods.filter(item => item.category.name === selectedCategory);

  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = `
    <div class="space-y-8">
      <div class="text-center animate__animated animate__fadeIn">
        <h1 class="text-4xl font-bold gradient-text mb-4">Our Menu</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">Discover our carefully crafted dishes made with the finest ingredients and passion</p>
      </div>
      <div class="flex flex-wrap gap-3 justify-center animate__animated animate__fadeIn">
        ${uniqueCategories.length <= 1 ? `
          <div class="text-center py-12 col-span-full">
            <i class="fas fa-utensils text-5xl text-gray-400 mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-600">No categories found</h3>
            <p class="text-gray-500">Please try again later or contact support.</p>
          </div>
        ` : uniqueCategories.map(category => `
          <button onclick="filterFoods('${category}')"
            class="px-5 py-2.5 rounded-full transition-all duration-300 ${
              selectedCategory === category
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-red-100 shadow"
            }">
            ${category === "all" ? "All Items" : category}
          </button>
        `).join("")}
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate__animated animate__fadeIn">
        ${filteredFoods.length === 0 ? `
          <div class="col-span-full text-center py-12">
            <i class="fas fa-utensils text-5xl text-gray-400 mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-600">No items found in this category</h3>
            <button onclick="filterFoods('all')" class="text-green-600 font-medium mt-4 hover:text-green-800">
              View All Items
            </button>
          </div>
        ` : filteredFoods.map(food => `
          <div class="food-card bg-white rounded-xl overflow-hidden relative">
            <div class="absolute top-4 right-4 z-10">
              <button onclick="toggleFavorite('${food.id}', this)" class="fav-icon text-2xl ${food.is_favorite ? "text-red-500" : "text-gray-300"} hover:text-red-500">
                <i class="fas fa-heart"></i>
              </button>
            </div>
            ${food.image ? `<img src="${food.image}" alt="${food.name}" class="w-full h-56 object-cover" />` : `<div class="w-full h-56 bg-gray-100 flex items-center justify-center"><span class="text-gray-500">Not Available</span></div>`}
            <div class="p-6">
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-xl font-semibold">${food.name}</h3>
                <span class="text-green-600 font-bold">$${food.price.toFixed(2)}</span>
              </div>
              <p class="text-gray-600 text-sm mb-4">${food.description}</p>
              ${food.ingredients && food.ingredients.length > 0 ? `
                <div class="mb-4">
                  <p class="text-sm font-medium text-gray-500 mb-1">Ingredients:</p>
                  <div class="flex flex-wrap gap-2">
                    ${food.ingredients.map(ingredient => `
                      <span class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">${ingredient}</span>
                    `).join("")}
                  </div>
                </div>
              ` : ""}
              <div class="flex gap-3">
                <button onclick="addToCart('${food.id}')" class="flex-1 btn-primary text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300">
                  <i class="fas fa-plus mr-2"></i> Add to Cart
                </button>
                <button onclick="buyNow('${food.id}')" class="flex-1 bg-white border border-green-600 text-green-600 px-4 py-2.5 rounded-lg hover:bg-green-50 transition-all duration-300">
                  <i class="fas fa-bolt mr-2"></i> Buy Now
                </button>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderBookingPage() {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = `
    <div class="max-w-7xl mx-auto animate__animated animate__fadeIn">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Booking Form (Left) -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div class="bg-gradient-to-r from-red-500 to-purple-700 p-6 text-white text-center">
            <h2 class="text-3xl font-bold mb-2">Table Reservation</h2>
            <p class="opacity-90">Secure your spot for an exceptional dining experience</p>
          </div>
          <div class="p-6 md:p-8">
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <div class="relative">
                    <input type="date" id="date" value="${bookingDetails.date}" onchange="updateBookingDetails('date', this.value)"
                      class="input-field w-full p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200" />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <select id="time" onchange="updateBookingDetails('time', this.value)"
                    class="input-field w-full p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200">
                    <option value="">Select time</option>
                    ${["12:00 PM", "1:00 PM", "2:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"].map(slot => `
                      <option value="${slot}" ${bookingDetails.time === slot ? "selected" : ""}>${slot}</option>
                    `).join("")}
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                <select id="guests" onchange="updateBookingDetails('guests', this.value)"
                  class="input-field w-full p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200">
                  ${[1, 2, 3, 4, 5, 6, 7, 8].map(num => `
                    <option value="${num}" ${bookingDetails.guests === num ? "selected" : ""}>${num} ${num === 1 ? "Guest" : "Guests"}</option>
                  `).join("")}
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Select Table</label>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  ${["Table 1", "Table 2", "Table 3", "Table 4", "Table 5", "Table 6"].map(table => `
                    <div onclick="selectTable('${table}')"
                      class="table-slot cursor-pointer p-4 text-center rounded-lg border-2 transition-all duration-300 ${
                        selectedTable === table ? "border-green-500 bg-green-500 text-white" : "border-gray-200 bg-white hover:border-green-300"
                      }">
                      <i class="fas fa-chair text-2xl mb-2 ${selectedTable === table ? "text-green-600" : "text-gray-400"}"></i>
                      <p class="font-medium">${table}</p>
                    </div>
                  `).join("")}
                </div>
              </div>
              <button onclick="handleBooking()"
                class="w-full btn-primary text-white py-3.5 rounded-lg text-lg font-bold hover:shadow-lg transition-all duration-300 mt-6">
                <i class="fas fa-calendar-check mr-2"></i> Confirm Reservation
              </button>
              ${!isLoggedIn ? `
                <div class="text-center text-sm text-gray-500 mt-4">
                  You need to <a href="#" onclick="showPage('signin')" class="text-red-600 font-bold">sign in</a> to book a table
                </div>
              ` : ""}
            </div>
          </div>
        </div>

        <!-- Reservation Information (Right) -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div class="p-6 md:p-8">
            <h3 class="text-xl font-semibold mb-4 flex items-center">
              <i class="fas fa-info-circle text-green-600 mr-2"></i> Reservation Information
            </h3>
            <ul class="space-y-3 text-gray-600">
              <li class="flex items-start">
                <i class="fas fa-clock text-green-500 mt-1 mr-2"></i>
                <span>Reservations are held for 15 minutes past the booked time</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-user-group text-green-500 mt-1 mr-2"></i>
                <span>Pricing: Rs. 200-800 based on number of guests</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-utensils text-green-500 mt-1 mr-2"></i>
                <span>Special dietary requirements can be noted during checkout</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-phone text-green-500 mt-1 mr-2"></i>
                <span>Need help? Call us at (123) 456-7890</span>
              </li>
            </ul>
            <div class="mt-6">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Hotel dining tables" class="w-full h-64 object-cover rounded-lg shadow-md">
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function handleBooking() {
  if (!isLoggedIn) {
    showToast("Please log in to book a table", "error");
    showPage("signin");
    return;
  }

  if (!bookingDetails.date || !bookingDetails.time || !selectedTable) {
    showToast("Please fill all booking details", "error");
    return;
  }

  const price = bookingPrices[bookingDetails.guests] || 300;

  document.getElementById("booking-details").innerHTML = `
    <div class="space-y-2">
      <div class="flex justify-between">
        <span class="text-gray-600">Date:</span>
        <span class="font-medium">${bookingDetails.date}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-600">Time:</span>
        <span class="font-medium">${bookingDetails.time}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-600">Guests:</span>
        <span class="font-medium">${bookingDetails.guests}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-600">Table:</span>
        <span class="font-medium">${selectedTable}</span>
      </div>
      <div class="border-t border-gray-200 my-2"></div>
      <div class="flex justify-between">
        <span class="text-gray-600">Amount to Pay:</span>
        <span class="text-green-600 font-bold">Rs. ${price}</span>
      </div>
      <p class="text-sm text-gray-500 mt-2">Scan the QR code to complete your booking payment</p>
    </div>
  `;

  document.getElementById("payment-modal").classList.remove("hidden");
}

async function renderFavouritesPage() {
  const foods = await loadFoodItems();
  const favoriteItems = foods.filter(item => item.is_favorite);

  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = `
    <div class="space-y-8 animate__animated animate__fadeIn">
      <div class="bg-gradient-to-r from-red-500 to-purple-700 p-6 text-white text-center">
        <h1 class="text-4xl font-bold mb-4">Your Favorites</h1>
        <p class="text-xl max-w-2xl mx-auto">Your saved dishes for quick access</p>
      </div>
      ${favoriteItems.length === 0 ? `
        <div class="bg-white rounded-2xl shadow-md p-12 text-center">
          <i class="fas fa-heart text-5xl text-gray-300 mb-6"></i>
          <h3 class="text-xl font-semibold text-gray-600">${foods.length === 0 ? "No items found" : "No favorites yet"}</h3>
          <p class="text-gray-500 mb-6">${foods.length === 0 ? "Please try again later or contact support." : "Start exploring our menu and save your favorite dishes"}</p>
          <button onclick="showPage('menu')" class="btn-primary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300">
            <i class="fas fa-utensils mr-2"></i> Browse Menu
          </button>
        </div>
      ` : `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          ${favoriteItems.map(food => `
            <div class="food-card bg-white rounded-xl overflow-hidden relative">
              <div class="absolute top-4 right-4 z-10">
                <button onclick="toggleFavorite('${food.id}', this)" class="fav-icon text-2xl text-red-500 hover:text-red-600">
                  <i class="fas fa-heart"></i>
                </button>
              </div>
              ${food.image ? `<img src="${food.image}" alt="${food.name}" class="w-full h-56 object-cover" />` : `<div class="w-full h-56 bg-gray-100 flex items-center justify-center"><span class="text-gray-500">Not Available</span></div>`}
              <div class="p-6">
                <div class="flex justify-between items-start mb-3">
                  <h3 class="text-xl font-semibold">${food.name}</h3>
                  <span class="text-green-600 font-bold">$${food.price.toFixed(2)}</span>
                </div>
                <p class="text-gray-600 text-sm mb-4">${food.description}</p>
                <div class="flex gap-3">
                  <button onclick="addToCart('${food.id}')" class="flex-1 btn-primary text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300">
                    <i class="fas fa-plus mr-2"></i> Add to Cart
                  </button>
                  <button onclick="buyNow('${food.id}')" class="flex-1 bg-white border border-green-600 text-green-600 px-4 py-2.5 rounded-lg hover:bg-green-50 transition-all duration-300">
                    <i class="fas fa-bolt mr-2"></i> Buy Now
                  </button>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      `}
    </div>
  `;
}

async function renderOrderPage() {
  const foods = await loadFoodItems();
  const popularItems = foods.sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 2);
  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0).toFixed(2);
  const deliveryFee = 2.99;
  const total = (parseFloat(subtotal) + deliveryFee).toFixed(2);

  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = `
    <div class="space-y-8 animate__animated animate__fadeIn">
      <!-- Order Header -->
      <div class="bg-gradient-to-r from-red-500 to-purple-700 p-6 text-white text-center">
        <h1 class="text-4xl font-bold mb-4">Your Order</h1>
        <p class="text-xl max-w-2xl mx-auto">Review your items and place your order</p>
      </div>

      <!-- Order Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items (Left) -->
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6">
          <h2 class="text-2xl font-bold mb-6 flex items-center">
            <i class="fas fa-shopping-cart text-green-600 mr-2"></i> Your Cart
          </h2>
          <div id="cart-items">
            ${cart.length === 0 ? `
              <div class="text-center py-12">
                <i class="fas fa-shopping-basket text-5xl text-gray-300 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-500">Your cart is empty</h3>
                <button onclick="showPage('menu')" class="text-green-600 font-medium mt-4 hover:text-green-800">
                  Browse Menu
                </button>
              </div>
            ` : cart.map((item, index) => `
              <div class="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 last:border-0">
                <div class="flex items-center">
                  ${item.image ? `<img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover mr-4" />` : `<div class="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-lg mr-4"><span class="text-gray-500 text-xs">Not Available</span></div>`}
                  <div>
                    <h3 class="font-medium">${item.name}</h3>
                    <p class="text-green-600 font-bold">$${item.price.toFixed(2)} x ${item.quantity || 1}</p>
                  </div>
                </div>
                <button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-700 transition-all duration-300">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Order Summary (Right) -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h2 class="text-2xl font-bold mb-6 flex items-center">
            <i class="fas fa-receipt text-green-600 mr-2"></i> Order Summary
          </h2>
          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-medium">$${subtotal}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Delivery Fee</span>
              <span id="delivery-fee" class="font-medium">$2.99</span>
            </div>
            <div class="border-t border-gray-200 my-2"></div>
            <div class="flex justify-between">
              <span class="text-gray-600 font-bold">Total</span>
              <span id="order-total" class="text-green-600 font-bold">$${total}</span>
            </div>
            <div class="mt-6">
              <h3 class="text-lg font-semibold mb-2">Order Type</h3>
              <div class="flex gap-4 mb-4">
                <label class="flex items-center cursor-pointer">
                  <input type="radio" name="order-type" value="delivery" checked class="input-field mr-2" onchange="selectOrderType('delivery')">
                  <span>Delivery</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input type="radio" name="order-type" value="pickup" class="input-field mr-2" onchange="selectOrderType('pickup')">
                  <span>Pickup</span>
                </label>
              </div>
              <div id="delivery-address-container">
                <label class="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                <input type="text" id="delivery-address" placeholder="Enter your address" class="input-field w-full p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200" />
              </div>
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <div class="space-y-3">
                  <div class="flex items-center p-3 border border-gray-300 rounded-lg">
                    <input type="radio" id="cash-on-delivery" name="payment" value="cash-on-delivery" class="h-4 w-4 text-green-600 focus:ring-green-500" checked />
                    <label for="cash-on-delivery" class="ml-3 flex items-center">
                      <i class="fas fa-money-bill-wave text-gray-500 mr-2"></i>
                      <span>Cash on Delivery</span>
                    </label>
                  </div>
                  <div class="flex items-center p-3 border border-gray-300 rounded-lg">
                    <input type="radio" id="credit-card" name="payment" value="credit-card" class="h-4 w-4 text-green-600 focus:ring-green-500" />
                    <label for="credit-card" class="ml-3 flex items-center">
                      <i class="fas fa-credit-card text-gray-500 mr-2"></i>
                      <span>Credit/Debit Card</span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="mt-4">
                <label for="instructions" class="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                <textarea id="instructions" rows="3" placeholder="Any special requests or dietary restrictions" class="input-field w-full p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"></textarea>
              </div>
            </div>
            <button onclick="placeOrder()" class="w-full btn-primary text-white py-3.5 rounded-lg text-lg font-bold hover:shadow-lg transition-all duration-300 mt-6 ${cart.length === 0 ? "opacity-50 cursor-not-allowed" : ""}" ${cart.length === 0 ? "disabled" : ""}>
              <i class="fas fa-check-circle mr-2"></i> Place Order
            </button>
          </div>
        </div>
      </div>

      <!-- Popular Items -->
      <div class="bg-white rounded-2xl shadow-xl p-6">
        <h2 class="text-2xl font-bold mb-6 flex items-center">
          <i class="fas fa-star text-yellow-500 mr-2"></i> Popular Items
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          ${popularItems.map(food => `
            <div class="food-card bg-gray-50 rounded-xl overflow-hidden relative">
              <div class="absolute top-4 right-4 z-10">
                <button onclick="toggleFavorite('${food.id}', this)" class="fav-icon text-2xl ${food.is_favorite ? "text-red-500" : "text-gray-300"} hover:text-red-500">
                  <i class="fas fa-heart"></i>
                </button>
              </div>
              ${food.image ? `<img src="${food.image}" alt="${food.name}" class="w-full h-48 object-cover" />` : `<div class="w-full h-48 bg-gray-100 flex items-center justify-center"><span class="text-gray-500">Not Available</span></div>`}
              <div class="p-5">
                <div class="flex justify-between items-start mb-2">
                  <h3 class="text-xl font-semibold">${food.name}</h3>
                  <span class="text-green-600 font-bold">$${food.price.toFixed(2)}</span>
                </div>
                <p class="text-gray-600 text-sm mb-4">${food.description || "No description available"}</p>
                <button onclick="addToCart('${food.id}')" class="btn-primary text-white px-4 py-2 rounded-lg w-full hover:shadow-lg transition-all duration-300">
                  <i class="fas fa-plus mr-2"></i> Add to Cart
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderProfilePage() {
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = `
    <div class="max-w-2xl mx-auto animate__animated animate__fadeIn">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Profile Header -->
        <div class="bg-gradient-to-r from-red-500 to-purple-700 p-6 text-white text-center">
          <h2 class="text-3xl font-bold mb-2">Your Profile</h2>
          <p class="opacity-90">Manage your account details</p>
        </div>

        <!-- Profile Content -->
        <div class="p-6 md:p-8">
          <div class="space-y-6">
            <!-- Profile Info -->
            <div class="flex items-center justify-between border-b border-gray-200 pb-4">
              <div class="flex items-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <i class="fas fa-user text-2xl text-gray-400"></i>
                </div>
                <div>
                  <h3 class="text-xl font-semibold">${userData.fullname || "User"}</h3>
                  <p class="text-gray-600">${userData.email || "No email provided"}</p>
                </div>
              </div>
              <button onclick="logoutUser()" class="text-red-500 hover:text-red-700 font-medium">
                <i class="fas fa-sign-out-alt mr-1"></i> Log Out
              </button>
            </div>

            <!-- Account Details -->
            <div>
              <h3 class="text-lg font-semibold mb-3">Account Details</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Full Name:</span>
                  <span class="font-medium">${userData.fullname || "N/A"}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Email:</span>
                  <span class="font-medium">${userData.email || "N/A"}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Account Status:</span>
                  <span class="font-medium ${userData.active ? "text-green-600" : "text-red-600"}">${userData.active ? "Active" : "Inactive"}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Role:</span>
                  <span class="font-medium">${userData.superuser ? "Superuser" : userData.staff ? "Staff" : "Customer"}</span>
                </div>
              </div>
            </div>

            <!-- Edit Profile -->
            <div>
              <h3 class="text-lg font-semibold mb-3">Edit Profile</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" id="profile-fullname" value="${userData.fullname || ""}"
                    class="input-field w-full p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" id="profile-email" value="${userData.email || ""}"
                    class="input-field w-full p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200" />
                </div>
                <button onclick="updateProfile()"
                  class="w-full btn-primary text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300">
                  <i class="fas fa-save mr-2"></i> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSignInPage() {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = `
    <div class="max-w-md mx-auto animate__animated animate__fadeIn">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-3xl font-bold text-center mb-6 gradient-text">Sign In</h2>
        <div id="signin-error" class="hidden bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          <span id="signin-error-text"></span>
        </div>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="signin-email" placeholder="Enter your email"
              class="input-field w-full p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div class="relative">
              <input type="password" id="signin-password" placeholder="Enter your password"
                class="input-field w-full p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200" />
              <button onclick="togglePasswordVisibility('signin-password')"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                <i class="fas fa-eye"></i>
              </button>
            </div>
          </div>
          <button onclick="signIn()"
            class="w-full btn-primary text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300">
            <i class="fas fa-sign-in-alt mr-2"></i> Sign In
          </button>
          <div class="text-center text-sm text-gray-500">
            Don't have an account? <a href="#" onclick="showPage('signup')" class="text-green-600 font-medium">Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSignUpPage() {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = `
    <div class="max-w-md mx-auto animate__animated animate__fadeIn">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-3xl font-bold text-center mb-6 gradient-text">Sign Up</h2>
        <div id="signup-error" class="hidden bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          <span id="signup-error-text"></span>
        </div>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" id="signup-fullname" placeholder="Enter your full name"
              class="input-field w-full p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="signup-email" placeholder="Enter your email"
              class="input-field w-full p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div class="relative">
              <input type="password" id="signup-password" placeholder="Create a password"
                class="input-field w-full p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200" />
              <button onclick="togglePasswordVisibility('signup-password')"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                <i class="fas fa-eye"></i>
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div class="relative">
              <input type="password" id="signup-confirm-password" placeholder="Confirm your password"
                class="input-field w-full p-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200" />
              <button onclick="togglePasswordVisibility('signup-confirm-password')"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                <i class="fas fa-eye"></i>
              </button>
            </div>
          </div>
          <div class="flex items-center">
            <input type="checkbox" id="terms" class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
            <label for="terms" class="ml-2 text-sm text-gray-600">I agree to the <a href="#" class="text-green-600">Terms & Conditions</a></label>
          </div>
          <button onclick="signUp()"
            class="w-full btn-primary text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300">
            <i class="fas fa-user-plus mr-2"></i> Sign Up
          </button>
          <div class="text-center text-sm text-gray-500">
            Already have an account? <a href="#" onclick="showPage('signin')" class="text-green-600 font-medium">Sign In</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Helper functions
function selectOrderType(type) {
  const deliveryFeeElement = document.getElementById("delivery-fee");
  const orderTotalElement = document.getElementById("order-total");
  const deliveryAddressContainer = document.getElementById("delivery-address-container");
  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0).toFixed(2);
  const deliveryFee = type === "delivery" ? 2.99 : 0;
  const total = (parseFloat(subtotal) + deliveryFee).toFixed(2);

  deliveryFeeElement.textContent = `$${deliveryFee.toFixed(2)}`;
  orderTotalElement.textContent = `$${total}`;
  deliveryAddressContainer.classList.toggle("hidden", type === "pickup");
  document.getElementById("delivery-address").required = type === "delivery";
}

function updateBookingDetails(key, value) {
  bookingDetails[key] = value;
}

function selectTable(table) {
  selectedTable = table;
  renderBookingPage();
}

function filterFoods(category) {
  selectedCategory = category;
  showPage("menu");
}

function buyNow(id) {
  if (!isLoggedIn) {
    showToast("Please log in to place an order", "error");
    showPage("signin");
    return;
  }
  cart = [];
  addToCart(id);
  showPage("order");
}

function togglePasswordVisibility(id) {
  const input = document.getElementById(id);
  const icon = input.nextElementSibling.querySelector("i");
  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

async function signIn() {
  const email = document.getElementById("signin-email").value.trim();
  const password = document.getElementById("signin-password").value;
  const errorDiv = document.getElementById("signin-error");
  const errorText = document.getElementById("signin-error-text");

  if (!email || !password) {
    errorText.textContent = "Please enter both email and password";
    errorDiv.classList.remove("hidden");
    return;
  }

  const data = await loginUser(email, password);
  if (!data) {
    errorText.textContent = "Invalid credentials or staff/admin accounts are not allowed";
    errorDiv.classList.remove("hidden");
  } else {
    errorDiv.classList.add("hidden");
  }
}

async function signUp() {
  const fullname = document.getElementById("signup-fullname").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm-password").value;
  const terms = document.getElementById("terms").checked;
  const errorDiv = document.getElementById("signup-error");
  const errorText = document.getElementById("signup-error-text");

  if (!fullname || !email || !password || !confirmPassword) {
    errorText.textContent = "Please fill all fields";
    errorDiv.classList.remove("hidden");
    return;
  }

  if (password !== confirmPassword) {
    errorText.textContent = "Passwords do not match";
    errorDiv.classList.remove("hidden");
    return;
  }

  if (!terms) {
    errorText.textContent = "You must agree to the terms";
    errorDiv.classList.remove("hidden");
    return;
  }

  const data = await registerUser(email, password, fullname);
  if (data) {
    showPage("signin");
  } else {
    errorText.textContent = "Registration failed";
    errorDiv.classList.remove("hidden");
  }
}

async function updateProfile() {
  const fullname = document.getElementById("profile-fullname").value.trim();
  const email = document.getElementById("profile-email").value.trim();

  if (!fullname || !email) {
    showToast("Please fill all fields", "error");
    return;
  }

  try {
    const data = await makeRequest(`${baseUrl}users/profile/`, "PUT", { fullname, email }, true);
    localStorage.setItem("userData", JSON.stringify({ ...JSON.parse(localStorage.getItem("userData")), fullname, email }));
    showToast("Profile updated successfully");
    renderProfilePage();
  } catch (error) {
    showToast("Failed to update profile", "error");
  }
}

function updateNavbar() {
  const navbar = document.getElementById("navbar");
  const mobileMenu = document.getElementById("mobile-menu");
  const navItems = [
    { name: "Home", page: "home" },
    { name: "Menu", page: "menu" },
    { name: "Booking", page: "booking" },
    { name: "Order", page: "order" },
    { name: "Favourites", page: "favourites", requiresAuth: true },
    { name: isLoggedIn ? "Profile" : "Sign In", page: isLoggedIn ? "profile" : "signin" },
    { name: "Sign Up", page: "signup", hideWhenLoggedIn: true },
  ];

  const navHTML = `
    <div class="container mx-auto flex items-center justify-between py-4 px-4">
      <!-- Logo -->
      <div class="text-2xl font-bold text-green-600">Cafe</div>

      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center space-x-6">
        ${navItems
          .filter(item => !item.hideWhenLoggedIn || !isLoggedIn)
          .filter(item => !item.requiresAuth || isLoggedIn)
          .map(item => `
            <a href="#" onclick="showPage('${item.page}')" class="nav-link text-gray-600 hover:text-green-600 font-medium transition-colors duration-300 ${currentPage === item.page ? "text-green-600" : ""}">
              ${item.name}
            </a>
          `).join("")}
        ${isLoggedIn ? `
          <button onclick="logoutUser()" class="text-red-500 hover:text-red-700 font-medium">
            <i class="fas fa-sign-out-alt mr-1"></i> Log Out
          </button>
        ` : ""}
        <div class="relative">
          <a href="#" onclick="showPage('order')" class="text-gray-600 hover:text-green-600">
            <i class="fas fa-shopping-cart text-xl"></i>
            <span id="cart-count" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ${cart.length === 0 ? "hidden" : ""}">${cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}</span>
          </a>
        </div>
      </div>

      <!-- Mobile Menu Button -->
      <div class="md:hidden">
        <button onclick="toggleMobileMenu()" class="text-gray-600 hover:text-green-600">
          <i class="fas fa-bars text-2xl"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div id="mobile-menu" class="md:hidden hidden">
      <div class="bg-white shadow-lg p-4">
        ${navItems
          .filter(item => !item.hideWhenLoggedIn || !isLoggedIn)
          .filter(item => !item.requiresAuth || isLoggedIn)
          .map(item => `
            <a href="#" onclick="showPage('${item.page}'); toggleMobileMenu()" class="block py-2 px-4 text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded ${currentPage === item.page ? "text-green-600 bg-gray-100" : ""}">
              ${item.name}
            </a>
          `).join("")}
        ${isLoggedIn ? `
          <button onclick="logoutUser(); toggleMobileMenu()" class="block w-full text-left py-2 px-4 text-red-500 hover:bg-gray-100 rounded">
            <i class="fas fa-sign-out-alt mr-1"></i> Log Out
          </button>
        ` : ""}
        <a href="#" onclick="showPage('order'); toggleMobileMenu()" class="block py-2 px-4 text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded relative">
          <i class="fas fa-shopping-cart mr-2"></i> Cart
          <span id="mobile-cart-count" class="absolute right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ${cart.length === 0 ? "hidden" : ""}">${cart.length}</span>
        </a>
      </div>
    </div>
  `;
  navbar.innerHTML = navHTML;
}

function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  mobileMenu.classList.toggle("hidden");
}

function showPage(page) {
  currentPage = page;
  updateNavbar();
  const renderFunctions = {
    home: renderHomePage,
    menu: renderMenuPage,
    booking: renderBookingPage,
    favourites: renderFavouritesPage,
    order: renderOrderPage,
    profile: renderProfilePage,
    signin: renderSignInPage,
    signup: renderSignUpPage,
  };
  const renderFunction = renderFunctions[page];
  if (renderFunction) {
    renderFunction();
  } else {
    console.error(`Page ${page} not found`);
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("accessToken");
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (token && userData) {
    isLoggedIn = true;
    isAdmin = userData.staff || userData.superuser;
  }
  loadCartFromStorage();
  updateNavbar();
  showPage("home");
});
