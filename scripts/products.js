var products = [];

document.addEventListener('DOMContentLoaded', () => {
    const fetchData = async () => {
        try {
            // Fetch the JSON data from the API endpoint
            const response = await fetch('/backend/data/db.json');

            // Check if the request was successful
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Parse the JSON data
            const data = await response.json();

            // Store the fetched data into the products array
            products = data;

            // Display all products by default
            displayProducts(products);
        } catch (error) {
            // Handle any errors that may occur
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const productsContainer = document.querySelector('.products-container');

    const categoryList = document.querySelectorAll('.category-list li');
    const popupModal = document.getElementById('popup-modal');
    const popupTitle = document.getElementById('popup-title');
    const popupImage = document.getElementById('popup-image');
    const popupArtist = document.getElementById('popup-artist');
    const popupMedium = document.getElementById('popup-medium');
    const popupSize = document.getElementById('popup-size');
    const popupPrice = document.getElementById('popup-price');
    const popupDescription = document.getElementById('popup-description');

    function displayProducts(filteredProducts) {
        productsContainer.innerHTML = '';
        filteredProducts.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product-item');
            productElement.innerHTML = `
                <img src="${product.imgsrc}" alt="${product.title}" onclick="showPopup(${product.id})">
                <h3>${product.title}</h3>
                <p>Price: $${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            productsContainer.appendChild(productElement);
        });
    }

    window.showPopup = function(productId) {
        const product = products.find(item => item.id === productId);
        if (product) {
            popupTitle.textContent = product.title;
            popupImage.src = product.imgsrc;
            popupArtist.textContent = product.artist || "Unknown Artist";
            popupMedium.textContent = product.medium || "Unknown Medium";
            popupSize.textContent = product.size || "Unknown Size";
            popupPrice.textContent = product.price;
            popupDescription.textContent = product.description || "No description available";
            popupModal.style.display = 'flex';
        }
    };

    // Function to close the popup
    window.closePopup = function() {
        popupModal.style.display = 'none';
    };

    categoryList.forEach(category => {
    category.addEventListener('click', (event) => {
        const selectedType = category.getAttribute('data-filter'); 
        const filteredProducts = selectedType === 'all' ? products : products.filter(product => product.type === selectedType);
        displayProducts(filteredProducts);
    });
})

    // Trigger the fetch function on page load
    fetchData();
});

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(product => product.id === productId);
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cart-count').textContent = cart.length;
}

updateCartCount();

const uname = localStorage.getItem('userName');
let picon= document.getElementById('profile-icon');
let pblock=document.getElementById('profile-details')

if(uname){
const ublock = document.getElementById('uname');

ublock.innerHTML=`<p>Hello ${uname}</p>`



picon.addEventListener('click' ,() =>{

    pblock.style.display='block'
})

let pclose=document.getElementById('close')
pclose.addEventListener('click',()=>{
    pblock.style.display='none'
})
// Log-out button functionality
const btn = document.getElementById('btn');
if (btn) {
    btn.addEventListener('click', () => {
        localStorage.removeItem('userName');  // Remove user data
        location.href = './login.html';  // Redirect to login page
    });
}
}
else{
picon.addEventListener('click', () => {
    location.href = './login.html'; // Redirect to login page
});
}
