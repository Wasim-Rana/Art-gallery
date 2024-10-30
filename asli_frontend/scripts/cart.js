document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const checkoutButton = document.getElementById('checkout-button');
    const customerNameInput = document.getElementById('customer-name');
    const customerEmailInput = document.getElementById('customer-email');
    const customerAddressInput = document.getElementById('customer-address');
    const customerNumberInput = document.getElementById('customer-number');
    const cartMessageContainer = document.getElementById('cart-message-container');
    const form = document.querySelector('form');
    
    function displayCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            // Hide form and show empty cart message
            form.style.display = 'none';
            cartMessageContainer.innerHTML = `
                <div class="empty-cart-message">
                    <h2>Your cart is empty</h2>
                    <p>Add items to your cart to proceed to checkout.</p>
                    <button id="shop-now-btn">Shop Now</button>
                </div>
            `;

            // Add event listener to redirect to product page
            document.getElementById('shop-now-btn').addEventListener('click', () => {
                window.location.href = 'products.html';
            });
        } else {
            // Show form and list cart items
            form.style.display = 'block';
            cartMessageContainer.innerHTML = ''; // Hide empty message

            cart.forEach((item, index) => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <img src="${item.imgsrc}" alt="${item.title}">
                    <div class="cart-item-details">
                        <h3>${item.title}</h3>
                        <p>Price: $${item.price}</p>
                    </div>
                    <button onclick="removeFromCart(${index})">Remove</button>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });

            checkoutButton.disabled = false;
        }
    }

    // Call function to initialize display
    displayCartItems();

    // Complete order function
    function completeOrder() {
        const customerName = customerNameInput.value.trim();
        const customerEmail = customerEmailInput.value.trim();
        const customerAddress = customerAddressInput.value.trim();
        const customerNumber = customerNumberInput.value.trim();
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (customerName && customerAddress && customerEmail && customerNumber) {
            const order = {
                id: Date.now(),
                customerName: customerName,
                customerEmail: customerEmail,
                customerAddress: customerAddress,
                customerNumber: customerNumber,
                total: cart.reduce((total, item) => total + item.price, 0),
                date: new Date().toISOString().split('T')[0],
            };
            
            let orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));
            localStorage.removeItem('cart');
            alert(`Thank you for your purchase, ${customerName}!`);
            displayCartItems();
        } else {
            alert('Please enter your details.');
        }
    }

    checkoutButton.addEventListener('click', completeOrder);
});

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

const uname = localStorage.getItem('userName');
let picon = document.getElementById('profile-icon');
let pblock = document.getElementById('profile-details');

if (uname) {
    const ublock = document.getElementById('uname');

    ublock.innerHTML = `<p>Hello ${uname}</p>`

    picon.addEventListener('click', () => {
        pblock.style.display = 'block';
    });

    let pclose = document.getElementById('close');
    pclose.addEventListener('click', () => {
        pblock.style.display = 'none';
    });
    // Log-out button functionality
    const btn = document.getElementById('btn');
    if (btn) {
        btn.addEventListener('click', () => {
            localStorage.removeItem('userName');  // Remove user data
            location.href = './login.html';  // Redirect to login page
        });
    }
} else {
    picon.addEventListener('click', () => {
        location.href = './login.html'; // Redirect to login page
    });
}
