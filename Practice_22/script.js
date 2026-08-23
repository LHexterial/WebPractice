const nav = document.querySelector('.nav');
const navHeight = nav.offsetHeight; // 缓存高度，避免重复读取
let ticking = false;

function fixNav() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const shouldActive = window.scrollY > navHeight + 150;
            nav.classList.toggle('active', shouldActive);
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', fixNav);