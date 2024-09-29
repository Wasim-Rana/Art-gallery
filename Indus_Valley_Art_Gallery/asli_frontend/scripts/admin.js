document.addEventListener('DOMContentLoaded', () => {
    // Form Switching: Admin and User login forms
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const userLoginBtn = document.getElementById('user-login-btn');

    if (adminLoginBtn && userLoginBtn) {
        
        adminLoginBtn.addEventListener('click', () => {
            document.getElementById('login-options').style.display = 'none';
            document.getElementById('admin-login-form').style.display = 'block';
        });

        
        userLoginBtn.addEventListener('click', () => {
            document.getElementById('login-options').style.display = 'none';
            document.getElementById('user-login-form').style.display = 'block';
           
            document.getElementById('toggle-register-login').style.display = 'block';
        });
    }

    
    const toggleRegisterLogin = document.getElementById('toggle-register-login');
    if (toggleRegisterLogin) {
        toggleRegisterLogin.addEventListener('click', (event) => {
            event.preventDefault();
            document.getElementById('user-login-form').style.display = 'none';
            document.getElementById('user-register-form').style.display = 'block';
        });
    }

    // Admin login functionality
    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            
            if (username === 'admin' && password === 'admin') {
                alert('Admin login successful!');
                window.location.href = 'dashboard.html';  // Redirect to admin dashboard
            } else {
                alert('Invalid admin credentials.');
            }
        });
    }

    // User login functionality
    const userLoginForm = document.getElementById('user-login-form');
    if (userLoginForm) {
        userLoginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const username = document.getElementById('user-username').value;
            const password = document.getElementById('user-password').value;

            try {
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('User login successful!');
                    localStorage.setItem('userName', data.username); // Store username for greeting
                    window.location.href = 'index.html';  // Redirect to user home page
                } else {
                    alert('Invalid username or password.');
                }
            } catch (error) {
                console.error('Error logging in:', error);
                alert('An error occurred during login.');
            }
        });
    }

    // User registration functionality
    const userRegisterForm = document.getElementById('user-register-form');
    if (userRegisterForm) {
        userRegisterForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const newUsername = document.getElementById('register-username').value;
            const newEmail = document.getElementById('register-email').value;
            const newPassword = document.getElementById('register-password').value;

            try {
                const response = await fetch('http://localhost:3000/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        uname: newUsername,
                        email: newEmail,
                        u_password: newPassword
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    alert(data.message);  // Show registration success message
                    userRegisterForm.style.display = 'none';  // Hide registration form
                    document.getElementById('user-login-form').style.display = 'block';  // Show login form
                } else {
                    alert(data.message || 'Registration failed.');
                }
            } catch (error) {
                console.error('Error during registration:', error);
                alert('An error occurred during registration.');
            }
        });
    }
});
