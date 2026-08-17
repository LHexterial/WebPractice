const icon = document.querySelector('.icon');
const nav = document.querySelector('.container nav')
icon.addEventListener('click', () => {
    nav.classList.toggle('active');
})