// JavaScript functionality for the index page
document.addEventListener('DOMContentLoaded', () => {
    const backToTopButton = document.querySelector('.back-to-top');
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const uname = localStorage.getItem('userName');
    const ublock = document.getElementById('uname');

    if (uname) {
        ublock.innerHTML = `<p>Hello ${uname}</p>`;
        document.getElementById('profile-details').style.display = 'block';  // Show the profile block
    } else {
        document.getElementById('profile-details').style.display = 'none';  // Hide the profile block if no user is logged in
    }

    // Log-out button functionality
    const btn = document.getElementById('btn');
    if (btn) {
        btn.addEventListener('click', () => {
            localStorage.removeItem('userName');  // Remove user data
            location.href = './login.html';  // Redirect to login page
        });
    }
});
