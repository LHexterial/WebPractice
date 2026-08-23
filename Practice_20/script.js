const canvas = document.querySelector('#canvas');

const decreaseBtn = document.querySelector('#decrease');

const increaseBtn = document.querySelector('#increase');

const size_tip = document.querySelector('#size_tip');

const colorEl = document.querySelector('#color');

const clearEl = document.querySelector('#clear');

const saveEl = document.querySelector('#save');


const ctx = canvas.getContext('2d');

let isPressed = false;
colorEl.value = 'black';
let color = colorEl.value;

let size = 10;

let startPoint = {
    x: undefined,
    y: undefined
}

let endPoint = {
    x: undefined,
    y: undefined
}


function drawCircle(x, y, size)
{
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawLine(x1, y1, x2, y2)
{
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 2;
    ctx.stroke();
}

function updateSizeOnScreen() {
    size_tip.innerText = size
}


canvas.addEventListener('mousedown', (e) => {
    isPressed = true;
    startPoint.x = e.offsetX;
    startPoint.y = e.offsetY;
})

document.addEventListener('mouseup', (e) => {
    isPressed = false;
})

canvas.addEventListener('mousemove', (e) => {
    if (isPressed)
    {
        endPoint.x = e.offsetX;
        endPoint.y = e.offsetY;
        drawCircle(endPoint.x, endPoint.y, size);
        drawLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
        startPoint.x = endPoint.x;
        startPoint.y = endPoint.y;
    }
})

increaseBtn.addEventListener('click', () => {
    size += 5

    if(size > 50) {
        size = 50
    }

    updateSizeOnScreen()
})

decreaseBtn.addEventListener('click', () => {
    size -= 5

    if(size < 5) {
        size = 5
    }

    updateSizeOnScreen()
})

colorEl.addEventListener('change', (e) => color = e.target.value)


clearEl.addEventListener('click', () => ctx.clearRect(0,0, canvas.width, canvas.height))


saveEl.addEventListener('click', (e) => {
    const url = canvas.toDataURL("image/jpg");
    const a = document.createElement('a');
    a.href = url;
    a.download = '画板';
    a.target = '_blank';
    a.click();
})
