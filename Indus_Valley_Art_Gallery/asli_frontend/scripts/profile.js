window.addEventListener('DOMContentLoaded', () => {
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');

    // Get user details from localStorage
    const storedName = localStorage.getItem('user-username');
    const storedEmail = localStorage.getItem('user-email');

    if (storedName) {
        profileName.value = storedName;
    }

    if (storedEmail) {
        profileEmail.value = storedEmail;
    }
});
