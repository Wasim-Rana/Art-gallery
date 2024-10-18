document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const checkoutButton = document.getElementById('checkout-button');
    const customerNameInput = document.getElementById('customer-name');
    const customerEmailInput = document.getElementById('customer-email');
    const customerAddressInput = document.getElementById('customer-address');
    const customerNumberInput = document.getElementById('customer-number');
    const cartMessageContainer = document.getElementById('cart-message-container');
    const form = document.querySelector('form');
    const paymentFormSection = document.getElementById('payment-form-section');

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

    // Payment Method Selection
    function clearPaymentForm() {
        paymentFormSection.innerHTML = '';
    }

    document.getElementById('gpay-btn').addEventListener('click', () => {
        clearPaymentForm();
        paymentFormSection.innerHTML = `
            <p>Google Pay</p>
            <button id="gpay-submit-btn">Pay with Google Pay</button>
        `;
        document.getElementById('gpay-submit-btn').addEventListener('click', () => {
            alert('Payment with Google Pay initiated!');
            completeOrder();
        });
    });

    document.getElementById('paypal-btn').addEventListener('click', () => {
        clearPaymentForm();
        paymentFormSection.innerHTML = `
            <p>PayPal</p>
            <button id="paypal-submit-btn">Pay with PayPal</button>
        `;
        document.getElementById('paypal-submit-btn').addEventListener('click', () => {
            alert('Payment with PayPal initiated!');
            completeOrder();
        });
    });

    document.getElementById('creditcard-btn').addEventListener('click', () => {
        clearPaymentForm();
        paymentFormSection.innerHTML = `
            <p>Credit Card</p>
            <div>
                <input type="text" id="cc-number" placeholder="Card Number" required>
                <input type="text" id="cc-name" placeholder="Card Holder Name" required>
                <input type="month" id="cc-expiry" placeholder="Expiry Date" required>
                <input type="text" id="cc-cvc" placeholder="CVC" required>
            </div>
            <button id="cc-submit-btn">Pay with Credit Card</button>
        `;
        document.getElementById('cc-submit-btn').addEventListener('click', () => {
            const ccNumber = document.getElementById('cc-number').value;
            const ccName = document.getElementById('cc-name').value;
            const ccExpiry = document.getElementById('cc-expiry').value;
            const ccCVC = document.getElementById('cc-cvc').value;

            if (ccNumber && ccName && ccExpiry && ccCVC) {
                alert('Payment with Credit Card initiated!');
                completeOrder();
            } else {
                alert('Please fill in all credit card fields.');
            }
        });
    });

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
                date: new Date().toISOString().split('T')[0]
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
