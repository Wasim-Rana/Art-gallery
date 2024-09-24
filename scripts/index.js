document.addEventListener('DOMContentLoaded', () => {
    const ordersContainer = document.getElementById('orders-container');
    const usersContainer = document.getElementById('users-container');
    const purchasesContainer = document.getElementById('purchases-container');
    
    function displayOrders() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        ordersContainer.innerHTML = '';
        
        orders.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.classList.add('order-item');
            orderElement.innerHTML = `
                <h3>Order ID: ${order.id}</h3>
                <p>Customer: ${order.customerName}</p>
                <p>Total: $${order.total}</p>
                <p>Date: ${order.date}</p>
            `;
            ordersContainer.appendChild(orderElement);
        });
    }
    // Display logged-in users
    function displayLoggedInUsers() {
        const usersLoggedIn = JSON.parse(localStorage.getItem('usersLoggedIn')) || [];
        usersContainer.innerHTML = '';
        
        usersLoggedIn.forEach(user => {
            const userElement = document.createElement('div');
            userElement.textContent = user;
            usersContainer.appendChild(userElement);
        });
    }

    // Display purchases
    function displayPurchases() {
        const purchases = JSON.parse(localStorage.getItem('purchases')) || [];
        purchasesContainer.innerHTML = '';
        
        purchases.forEach(purchase => {
            const purchaseElement = document.createElement('div');
            purchaseElement.innerHTML = `
                <h4>Purchase by: ${purchase.customerName}</h4>
                <p>Total: $${purchase.total}</p>
                <p>Date: ${purchase.date}</p>
            `;
            purchasesContainer.appendChild(purchaseElement);
        });
    }

    displayOrders();
    displayLoggedInUsers();
    displayPurchases();

    
    document.getElementById('logout-button').addEventListener('click', () => {
        alert('Logged out successfully.');
        window.location.href = 'login.html';
    });

    const uname = localStorage.getItem('userName');
    const ublock = document.getElementById('uname');

    let picon= document.getElementById('profile-icon');
    let pblock=document.getElementById('profile-details')
    
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
});
