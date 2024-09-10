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
            // Show registration toggle link
            document.getElementById('toggle-register-login').style.display = 'block';
        });
    }

    // Toggle between login and registration forms for users
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
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid admin credentials.');
            }
        });
    }

    // User login functionality
    const userLoginForm = document.getElementById('user-login-form');
    if (userLoginForm) {
        userLoginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const username = document.getElementById('user-username').value;
            const password = document.getElementById('user-password').value;

            const savedCredentials = JSON.parse(localStorage.getItem('userCredentials')) || {};

            if (savedCredentials.username === username && savedCredentials.password === password) {
                alert('User login successful!');
                window.location.href = 'index.html';  // Redirect to user home page
            } else {
                alert('Invalid username or password.');
            }
        });
    }

    // User registration functionality
    const userRegisterForm = document.getElementById('user-register-form');
    if (userRegisterForm) {
        userRegisterForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const newUsername = document.getElementById('register-username').value;
            const newEmail = document.getElementById('register-email').value;
            const newPassword = document.getElementById('register-password').value;

            // Save credentials in localStorage
            localStorage.setItem('userCredentials', JSON.stringify({
                username: newUsername,
                email:newEmail,
                password: newPassword
            }));

            alert('Registration successful! You can now log in.');
            document.getElementById('user-register-form').style.display = 'none';
            document.getElementById('user-login-form').style.display = 'block';
        });
    }
});
