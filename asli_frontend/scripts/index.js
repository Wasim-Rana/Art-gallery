// JavaScript functionality for the index page
document.addEventListener('DOMContentLoaded', () => {
    const backToTopButton = document.querySelector('.back-to-top');
    const contactForm = document.getElementById('contact-form');


    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const uname = localStorage.getItem('userName');
    let picon= document.getElementById('profile-icon');
    let pblock=document.getElementById('profile-details')

    if(uname){
    const ublock = document.getElementById('uname');

    ublock.innerHTML=`<p>Hello ${uname}</p>`

    
    
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
    }
    else{
        picon.addEventListener('click', () => {
            location.href = './login.html'; // Redirect to login page
        });
    }

    //contact form submission
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value
        };
    
        try {
            const response = await fetch('http://localhost:3000/submit-contact', { // Assuming your backend is running on port 3000
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
        
            if (response.ok) {
                alert('Message submitted successfully!');
                contactForm.reset();
            } else {
                alert('Failed to submit message. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    });

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        document.getElementById('cart-count').textContent = cart.length;
    }
    
    updateCartCount();
});