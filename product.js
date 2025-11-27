// Cart storage - SAME AS INDEX.JS
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// to load page
document.addEventListener('DOMContentLoaded', function() {
    console.log("Product page loaded!");
    updateCartCount(); // Update cart count on load
    loadProductDetails();
});

// Function to load product details from URL parameter
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        fetchProductDetails(productId);
    } else {
        document.getElementById('product-detail-page').innerHTML = '<div class="loading">Product not found</div>';
    }
}

// Function to fetch product details
async function fetchProductDetails(productId) {
    try {
        document.getElementById('product-detail-page').innerHTML = '<div class="loading">Loading product details...</div>';
        
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        const product = await response.json();

        displayProductPage(product);
    }
    catch (error) {
        console.error("Error loading product:", error);
        document.getElementById('product-detail-page').innerHTML = '<div class="loading">Error loading product details</div>';
    }
}

// Function to display product on the page
function displayProductPage(product) {
    const productDetailPage = document.getElementById('product-detail-page');
    
    productDetailPage.innerHTML = `
    <div class="product-detail">
        <div class="product-detail-image">
            <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="product-detail-info">
            <h1 class="product-detail-title">${product.title}</h1>
            <div class="product-detail-price">$${product.price}</div>
            <div class="product-detail-rating">
                ${renderStars(product.rating.rate)}
                <span>${product.rating.rate} (${product.rating.count} reviews)</span>
            </div>
            <div class="product-detail-category">
                ${product.category}
            </div>
            <p class="product-detail-description">${product.description}</p>
            <div class="product-detail-actions">
                <button class="add-to-cart-detail" onclick="addToCartFromProductPage(${product.id}, '${product.title.replace(/'/g, "\\'")}', ${product.price}, '${product.image}')">
                    Add to Cart
                </button>
                <button class="back-to-products" onclick="goBackToProducts()">
                    Back
                </button>
            </div>
        </div>
    </div>
    `;
}

// Function to render stars
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    return starsHTML;
}

// Function to add to cart from product page
function addToCartFromProductPage(id, title, price, image) {
    console.log("Adding to cart:", title);
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
        showToast(`"${title}" quantity increased to ${existingItem.quantity}!`);
    }
    else {
    cart.push({
        id: id,
        title: title,
        price:price,
        image:image,
        quantity: 1
    });
    //to show that the product has been added
    showToast(`"${title}" added to cart!`);
}
    //to update cart count in the header
    updateCartCount();
    saveCartToStorage();
    debugCart();
}

//to update the cart number in header
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItem = cart.reduce((total, item) => total + (item.quantity || 1), 0)
    cartCount.textContent = cart.length;
    console.log("Cart now has", cart.length, "items");
}

// Save to localStorage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Cart modal functions
function viewCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'block';
    displayCartItems();
}

function closeCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'none';
}
//here is the function to display cart items
function displayCartItems() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    console.log("Displaying cart items:", cart);
    //if cart is empty using if statement
    if (cart.length === 0) {
        cartItems.innerHTML = `
        <div class="empty-cart">Your cart is empty, please add!</div>
        <p class="empty-cart">Check out our products and discover our best deals</p>
        `;
        cartTotal.textContent = '0.00';
        return;
    }
//to calculate total and create innerHTML for each item
let total = 0;
let cartHTML ='';
cart.forEach(item => {
    const quantity = item.quantity || 1;
    const itemTotal = item.price * quantity;
    total += itemTotal;

    cartHTML += `<div class="cart-item">
    <img src="${item.image}" alt="${item.title}">
    <div class="cart-item-info">
    <h4>${item.title}</h4>
    <p>$${item.price}</p>
    </div>
    <div class="quantity-controls">
    <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">-</button>
    <span class="quantity-display">${quantity}</span>
     <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
     </div>
    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
    </div>`;
});
cartItems.innerHTML = cartHTML;
cartTotal.textContent = total.toFixed(2);
}
//adding increasing function
function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = (item.quantity || 1) + 1;
        displayCartItems();
        updateCartCount();
    }
}
function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item && (item.quantity || 1) > 1) {
        item.quantity = (item.quantity || 1) - 1;
        displayCartItems();
        updateCartCount();
    }
}

function removeFromCart(id) {
    const itemToRemove = cart.find(item => item.id === id);
    cart = cart.filter(item => item.id !== id);
    updateCartCount();
    saveCartToStorage();
    displayCartItems();
    showToast(`"${itemToRemove.title}" removed from the cart!`);
}

function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!, please add', 'error');
        return;
    }
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    showToast(`Order placed successfully!\nTotal: $${total.toFixed(2)}\n\nThank you for shopping with Rookie Store!`);
    cart = [];
    updateCartCount();
    saveCartToStorage();
    closeCart();
}

// Improved back function that forces cart refresh
function goBackToProducts() {
    // Force the products page to reload the cart
    window.location.href = 'index.html?refresh=' + Date.now();
}

// Toast function
function showToast(message, type = "success") {
    console.log("Toast call function");
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.classList.add("toast", type);
    toast.innerHTML = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = "fadeOut 0.5s forwards";
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target === modal) {
        closeCart();
    }
}