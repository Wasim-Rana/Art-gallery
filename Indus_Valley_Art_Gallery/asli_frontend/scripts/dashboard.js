document.addEventListener('DOMContentLoaded', () => {
    const ordersContainer = document.getElementById('orders-container');
    const usersContainer = document.getElementById('users-container');
    const contactContainer = document.getElementById('contact-container');

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
 displayOrders()

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

    // Fetch and display contact submissions from the database
    async function displayContactSubmissions() {
        try {
            const response = await fetch('http://localhost:3000/admin/contacts');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const contacts = await response.json();
            contactContainer.innerHTML = '';
    
            contacts.forEach(contact => {
                const contactElement = document.createElement('div');
                contactElement.classList.add('contact-item');
                contactElement.innerHTML = `
                    <h4>Name: ${contact.name}</h4>
                    <p>Email: ${contact.email}</p>
                    <p>Phone: ${contact.phone}</p>
                    <p>Message: ${contact.message}</p>
                    <hr/>
                `;
                contactContainer.appendChild(contactElement);
            });
        } catch (error) {
            console.error('Error fetching contact submissions:', error);
        }
    }
    
    // Call the function to display contacts when the admin dashboard loads
    displayContactSubmissions();
   
    // displayLoggedInUsers()

    document.getElementById('logout-button').addEventListener('click', () => {
        alert('Logged out successfully.');
        window.location.href = 'login.html';
    });
});

