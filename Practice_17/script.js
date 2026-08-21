
const body = document.body;
const sliders = document.querySelectorAll('.slider');
const leftBtn = document.querySelector('#left');
const rightBtn = document.querySelector('#right');

let activeSlider = 0;

function SetToBody() {
    body.style.backgroundImage = sliders[activeSlider].style.backgroundImage;
}

function UpdateActive()
{
    sliders.forEach((slider) => {
        slider.classList.remove('active');
    })
    sliders[activeSlider].classList.add('active');
}

leftBtn.addEventListener('click', () => {
    activeSlider++;
    if (activeSlider >= sliders.length) activeSlider = 0;
    SetToBody();
    UpdateActive();
})

rightBtn.addEventListener('click', () => {
    activeSlider--;
    if (activeSlider < 0)
    {
        activeSlider = sliders.length -1;
    }
    SetToBody();
    UpdateActive();
})

SetToBody();