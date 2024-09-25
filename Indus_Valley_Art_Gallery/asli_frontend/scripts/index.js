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
});
