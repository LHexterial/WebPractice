const resultEl = document.querySelector('#result');
const lengthEl = document.querySelector('#length');
const uppercaseEl = document.querySelector('#uppercase');
const lowercaseEl = document.querySelector('#lowercase');
const numbersEl = document.querySelector('#numbers');
const symbolsEl = document.querySelector('#symbols');
const generateEl = document.querySelector('#generate');
const clipboardEl = document.querySelector('#clipboard');


const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
};

function getRandomLower() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}
function getRandomSymbol() {
    const symbols = '!@#$%^&*(){}[]=<>/,.';
    return symbols[Math.floor(Math.random() * symbols.length)]
}


function generatePassword(lower, upper, number, symbol, length) {
    let generatedPassword = '';
    const typesCount = lower + upper + number + symbol;
    const typeArr = [{ lower }, { upper }, { number }, { symbol }].filter(itm => Object.values(itm)[0]);
    if (typesCount === 0) return '';
    for (let i = 0; i < length; i += typesCount)
    {
        typeArr.forEach(type => {
            const funcName = Object.keys(type)[0];
            generatedPassword += randomFunc[funcName]();
        })
    }
    const finalPassword = generatedPassword.slice(0, length);
    return finalPassword;
}


clipboardEl.addEventListener('click', () => {
    const passWord = resultEl.innerText;
    if (!passWord) return;
    navigator.clipboard.writeText(passWord);
    alert('Password copied to clipboard!')
})


generateEl.addEventListener('click', () => {
    const length = +lengthEl.value
    const hasLower = lowercaseEl.checked
    const hasUpper = uppercaseEl.checked
    const hasNumber = numbersEl.checked
    const hasSymbol = symbolsEl.checked

    resultEl.innerText = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length)
})
