window.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profile-form');
    const editSaveBtn = document.getElementById('edit-save-btn');
    const formFields = profileForm.querySelectorAll('input, select');
    const successMessage = document.getElementById('success-message');

    let currentUserId; // Store the current user's ID

    // Fetch the current user's data when the page loads
    async function loadUserData() {
        try {
            const response = await fetch('http://localhost:3000/api/get-current-user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const userData = await response.json();
                currentUserId = userData.userid; // Set the current user's ID
                
                // Populate fields with existing user data from both 'users' and 'profile' tables
                document.getElementById('profile-name').value = userData.name || ''; 
                document.getElementById('profile-email').value = userData.email || '';

                // Populate profile-specific fields from 'profile' table
                document.getElementById('phone').value = userData.phone || '';
                document.getElementById('address').value = userData.address || '';
                document.getElementById('gender').value = userData.gender || '';
                document.getElementById('pincode').value = userData.pincode || '';
            } else {
                console.error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    // Load the user data on page load
    loadUserData();

    toggleEditMode(false);

    // Function to toggle the fields between editable and read-only
    function toggleEditMode(editable) {
        formFields.forEach(field => {
            field.disabled = !editable; // Enable or disable the fields
        });
        editSaveBtn.textContent = editable ? 'Save' : 'Edit'; // Update the button text
    }

    // Handle Edit/Save button click
    editSaveBtn.addEventListener('click', async () => {
        if (editSaveBtn.textContent === 'Edit') {
            // Switch to Edit mode
            toggleEditMode(true);
        } else {
            // Collect the form data
            const profileData = {
                uid: currentUserId, // Ensure correct field name
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                gender: document.getElementById('gender').value,
                pincode: document.getElementById('pincode').value,
            };
    
            // Simple validation
            if (!profileData.phone || !profileData.address) {
                alert('Phone and Address are required.');
                return;
            }
    
            try {
                const response = await fetch('http://localhost:3000/api/update-profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(profileData)
                });
    
                if (!response.ok) {
                    throw new Error(`Failed to update profile: ${response.status}`);
                }
    
                const data = await response.json();
                console.log('Profile updated successfully:', data);
                toggleEditMode(false); // Switch back to view mode after saving
    
                successMessage.style.display = 'block'; // Show success message
                setTimeout(() => {
                    successMessage.style.display = 'none'; // Hide message after 3 seconds
                }, 3000);
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('Failed to update profile. Please try again.');
            }
        }
    });
});
