document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const checkoutButton = document.getElementById('checkout-button');
    const customerNameInput = document.getElementById('customer-name');
    const customerEmailInput = document.getElementById('customer-email');
    const customerAddressInput = document.getElementById('customer-address');
    const customerNumberInput = document.getElementById('customer-number');
    
    function displayCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartItemsContainer.innerHTML = '';
        
        cart.forEach((item, index) => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <img src="${item.imgSrc}" alt="${item.title}">
                <div class="cart-item-details">
                    <h3>${item.title}</h3>
                    <p>Price: $${item.price}</p>
                </div>
                <button onclick="removeFromCart(${index})">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        checkoutButton.disabled = cart.length === 0;
    }
    
    displayCartItems();
    
    checkoutButton.addEventListener('click', () => {
        const customerName = customerNameInput.value.trim();
        const customerEmail = customerEmailInput.value.trim();
        const customerAddress = customerAddressInput.value.trim();
        const customerNumber = customerNumberInput.value.trim();
        if (customerName && customerAddress && customerEmail && customerNumber ) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
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
    });
});

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items-container');
    const checkoutButton = document.getElementById('checkout-button');
    cartItemsContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <img src="${item.imgSrc}" alt="${item.title}">
            <div class="cart-item-details">
                <h3>${item.title}</h3>
                <p>Price: $${item.price}</p>
            </div>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    checkoutButton.disabled = cart.length === 0;
}
