const root_container = document.querySelector('.root-container');
const left_container = document.querySelector('.left-container');
const right_container = document.querySelector('.right-container');
const upBtn = document.querySelector('.up-button');
const downBtn = document.querySelector('.down-button');

const totalLength = right_container.querySelectorAll('div').length;

let activeIndex = 0;

left_container.style.top = `-${(totalLength - 1) * 100}vh`;

function changeSlide(direction) {
    const sliderHeight = root_container.clientHeight;
    if (direction === 'up')
    {
        activeIndex++;
        if (activeIndex > totalLength - 1) {
            activeIndex = 0;
        }
    }
    else if (direction === 'down')
        {
            activeIndex--;
            if (activeIndex < 0)
            {
                activeIndex = totalLength - 1;
            }
        }
        right_container.style.transform = `translateY(-${activeIndex * sliderHeight}px)`
        left_container.style.transform = `translateY(${activeIndex * sliderHeight}px)`
}

upBtn.addEventListener('click', () => { changeSlide('up') });
downBtn.addEventListener('click', () => {
    changeSlide('down');
})