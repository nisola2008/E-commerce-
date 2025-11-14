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