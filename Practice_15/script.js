const smallCups = document.querySelectorAll('.cup-small');
const liters = document.querySelector('#liters');
const percentage = document.querySelector('.percentage');
const remained = document.querySelector('.remained');
updateBigCup();

function updateBigCup() {
    const fullCups = document.querySelectorAll('.cup-small.full');
    let fullCupsLen = fullCups.length;
    let totalCupsLen = smallCups.length;

    if (fullCupsLen === 0) 
    {
        percentage.style.visibility = 'hidden';
        percentage.style.height = '0';
    }
    else
    {
        percentage.style.visibility = 'visible';
        percentage.style.height = `${fullCupsLen / totalCupsLen * 330}px`
        percentage.innerText = `${fullCupsLen / totalCupsLen * 100}%`
    }

    if (fullCupsLen === totalCupsLen)
    {
        remained.style.visibility = 'hidden';
        remained.style.height = '0';
    }
    else
    {
        remained.style.visibility = 'visible';
        liters.innerText = `${2 - (250 * fullCupsLen / 1000)}L`;
    }
}


function highlightCups(idx) {
    if (idx === 7 && smallCups[idx].classList.contains('full')) idx--;
    else if (smallCups[idx].classList.contains('full') && !smallCups[idx].nextElementSibling.classList.contains('full')) idx--;

    smallCups.forEach((cup, idx2) => {
        if (idx2 <= idx) {
            cup.classList.add('full');
        }
        else {
            cup.classList.remove('full');
        }
    })
    updateBigCup();
}

smallCups.forEach((cup, idx) => {
    cup.addEventListener('click', () => { highlightCups(idx); });
})