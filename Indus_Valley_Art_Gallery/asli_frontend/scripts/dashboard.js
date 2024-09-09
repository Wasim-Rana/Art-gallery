document.addEventListener('DOMContentLoaded', () => {
    const ordersContainer = document.getElementById('orders-container');
    
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
    
    displayOrders();
    
    document.getElementById('logout-button').addEventListener('click', () => {
        alert('Logged out successfully.');
        window.location.href = 'admin.html';
    });
});
