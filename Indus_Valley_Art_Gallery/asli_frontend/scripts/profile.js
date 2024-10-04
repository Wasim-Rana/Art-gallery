window.addEventListener('DOMContentLoaded', async () => {
    const profileForm = document.getElementById('profile-form');
    const editSaveBtn = document.getElementById('edit-save-btn');
    const formFields = profileForm.querySelectorAll('input, select');

    // Function to toggle the fields between editable and read-only
    function toggleEditMode(editable) {
        formFields.forEach(field => {
            field.disabled = !editable; // Enable or disable the fields
        });
        editSaveBtn.textContent = editable ? 'Save' : 'Edit'; // Update the button text
    }

    // Initially fetch and populate the user data
    async function loadUserData() {
        try {
            const response = await fetch('/api/get-current-user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const userData = await response.json();
                document.getElementById('profile-name').value = userData.name;
                document.getElementById('profile-email').value = userData.email;
                document.getElementById('phone').value = userData.phone || '';
                document.getElementById('address').value = userData.address || '';
                document.getElementById('gender').value = userData.gender || '';
                document.getElementById('pincode').value = userData.pincode || '';
            } else {
                console.error('Failed to fetch user details');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    }

    // Initially load the user data
    loadUserData();

    // Handle Edit/Save button click
    editSaveBtn.addEventListener('click', async () => {
        if (editSaveBtn.textContent === 'Edit') {
            // Switch to Edit mode
            toggleEditMode(true);
        } else {
            // Save the changes to the server
            const updatedUserData = {
                name: document.getElementById('profile-name').value,
                email: document.getElementById('profile-email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                gender: document.getElementById('gender').value,
                pincode: document.getElementById('pincode').value,
            };

            try {
                const response = await fetch('/api/update-profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedUserData),
                });

                if (response.ok) {
                    console.log('Profile updated successfully');
                    toggleEditMode(false); // Switch back to read-only mode
                } else {
                    console.error('Failed to update profile');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        }
    });

    // Initially set the form to read-only mode
    toggleEditMode(false);
});
