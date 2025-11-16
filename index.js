//using array to store our shopping
let cart =[];
//what will happen when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("Page loaded! Get products...");
    fetchProducts();
});
//fetch products from the FakeStore API
async function fetchProducts() {
    try {
    console.log("Fetching products from Store.......");
    //asking the API for the products
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();
    console.log("Got products:", products);
    //display product on the page 
    displayProducts(products);
    }
    catch (error) {
        console.error("Error getting products:", error);
        document.getElementById('loading').textContent = 'Error loading products';
    }

}
//to display products on the page 
function displayProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    const loading = document.getElementById('loading');
    //to hide loading message 
    loading.classList.add('hidden');
    //creating HTML for each product
    let productsHTML = '';
    products.forEach(product => {
        productsHTML += `
        <div class="product-card" onclick="viewProduct(${product.id})">
        <img src="${product.image}" alt"${product.title}" class="product-image">
        <h3 class="product-title">${product.title}</h3>
        <p class="product-price">$${product.price}</p>
        <button class="view-product-btn" onclick="viewProduct(${product.id})">
        View Product
        </button>
        <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id}, '${product.title.replace(/'/g, "\\'")}', ${product.price}, '${product.image}')">
        Add to Cart
        </button>
        </div>
        `;
    });
    //display the products on the page
    productsGrid.innerHTML = productsHTML;
}
//add product to cart
function addToCart(id, title, price, image) {
    console.log("Adding to cart:", title);

    //let add item to the cart array
    cart.push({
        id: id,
        title: title,
        price:price,
        image:image
    });
    //to update cart count in the header
    updateCartCount();
    //to show that the product has been added
    alert(`"${title}" added to cart!`);
}
//to update the cart number in header
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.length;
    console.log("Cart now has", cart.length, "items");
}
//here is the function to open the cart modal
function viewCart() {
    console.log("Opening cart....");
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'block';
    displayCartItems();
}
//to close the cart modal
function closeCart() {
    console.log("Closing cart....");
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
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty, please add</div>';
        cartTotal.textContent = '0.00';
        return;
    }
//to calculate total and create innerHTML for each item
let total = 0;
let cartHTML ='';
cart.forEach(item => {
    const itemTotal = item.price;
    total += itemTotal;

    cartHTML += `<div class="cart-item">
    <img src="${item.image}" alt="${item.title}">
    <div class="cart-item-info">
    <h4>${item.title}</h4>
    <p>$${item.price}</p>
    </div>
    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
    </div>`;
})
cartItems.innerHTML = cartHTML;
cartTotal.textContent = total.toFixed(2);
}
//to remove item from cart
function removeFromCart(id) {
    console.log("Removing item:", id);
//find the item to get it name for the alert
const itemToRemove = cart.find(item => item.id === id);
//remove the item from the cart array
cart = cart.filter(item => item.id !== id);
// now to update everything all together
updateCartCount();
displayCartItems();

alert(`"${itemToRemove.title}" remove from the cart!`);
}
//for fake checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!, please add');
        return;
    }
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    alert(`Order placed successfully!\nTotal: $${total.toFixed(2)}\n\nThank you for shopping with Rookie Store, we will be glad to have you back!`);

    //to clear the cart
    cart = [];
    updateCartCount();
    closeCart(); 
}
//to close modal when clicking
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target === modal) {
        closeCart();
    }
} 
//to view each product detail
async function viewProduct(productId) {
    console.log("Viewing product:", productId);
    console.log("this should open product modal");

    try {
    document.getElementById('product-detail').innerHTML = '<div class="loading">Loading the product details....</div>';
    
    //to open modal
    const modal = document.getElementById('product-modal');
    modal.style.display = 'block';
    document.getElementById('cart-modal').style.display = 'none'
    //to fetch the specific product details
    const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
    const product = await response.json();

    console.log("Product details", product);

    //display product details
    displayProductDetail(product);
    }
    catch (error) {
        console.error("Error loading details:", error);
        document.getElementById('product-detail').innerHTML = '<div class="loading">Error loading product details</div>';

    }
}
//to render stars to each product
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    let starsHTML = '';
    //for full stars
    for (let i = 0; i < fullStars; i++) {
     starsHTML += '<i class="fas fa-star"></i>';
    }
    //for half star
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>'
    }
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    return starsHTML
}
//function to display product details in the modal
function displayProductDetail(product) {
    const productDetail = document.getElementById('product-detail');
    productDetail.innerHTML = `
    <div class="product-detail">
    <div class="product-detail-image">
    <img src="${product.image}" alt="${product.title}">
    </div>
    <div class="product-detail-info">
    <h1 class="product-detail-title">${product.title}</h1>
    <div class="product-detail-price">$${product.price}</div>
    <div class="product-detail-rating">
    ${renderStars (product.rating.rate)}
    <span>${product.rating.rate} (${product.rating.count} reviews)</span>
    </div>
    <div class="product-detail-category">
    ${product.category}
    </div>
    <p class="product-detail-description">${product.description}</p>
    <div class="product-detail-actions">
    <button class="add-to-cart-detail" onclick="addToCartFromDetail(${product.id}, '${product.title.replace(/'/g, "\\'")}', ${product.price}, '${product.image}')">
    Add to Cart
    </button>
    <button class="back-to-products" onclick="closeProduct()">
    Back
    </button>
    </div>
    </div>
    </div>
    `;
}
// Function to add to cart from product detail page
function addToCartFromDetail(id, title, price, image) {
    console.log("Adding to cart from detail:", title);
    
    // Add item to cart
    cart.push({
        id: id,
        title: title,
        price: price,
        image: image
    });
    
    // Update cart count
    updateCartCount();
    
    // Show success message
    alert(`"${title}" added to cart!`);
    
    // Close product modal and open cart
    closeProduct();
    viewCart();
}

// Function to close product modal
function closeProduct() {
    console.log("Closing product details...");
    const modal = document.getElementById('product-modal');
    modal.style.display = 'none';
}
window.onclick = function(event) {
    const cartModal = document.getElementById('cart-modal');
    const productModal = document.getElementById('product-modal');
    if (event.target === cartModal) {
        closeCart();
    } 
    if (event.target === productModal) {
        closeProduct();
    }
}