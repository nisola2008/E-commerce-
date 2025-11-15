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
        <div class="product-card">
        <img src="${product.image}" alt"${product.title}" class="product-image">
        <h3 class="product-title">${product.title}</h3>
        <p class="product-price">$${product.price}</p>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id}, '${product.title.replace(/'/g, "\\'")}', ${product.price}, '${product.image}')">
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
