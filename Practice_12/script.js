const tags_container = document.querySelector('#tags');
const textarea = document.querySelector('#textarea');
let timerInterval = null;
textarea.focus();

function CreateTags(input)
{
    const tags = input.split(',').filter(tag => tag.trim() !== '').map(tag => tag.trim());
    tags_container.innerHTML = '';
    tags.forEach(tag => {
        const tagEl = document.createElement('span');
        tagEl.classList.add('tag');
        tagEl.innerText = tag;
        tags_container.appendChild(tagEl);
    })

}

textarea.addEventListener('keyup', (e) => {
    CreateTags(e.target.value);

    if(e.key === 'Enter') {
        setTimeout(() => {
            e.target.value = ''
        }, 10)

        RandomPick(20);
    }
})

function randomSelectTag()
{
    const tags = document.querySelectorAll('.tag');
    return tags[Math.floor(Math.random() * tags.length)];
}

function RandomPick(times = 30)
{
    if (timerInterval)
    {
        clearInterval(timerInterval);
        timerInterval = null;
        document.querySelectorAll('.tag').forEach(tag => tag.classList.remove('highlight'));
    }
    const AllTags = document.querySelectorAll('.tag');
    if (AllTags.length === 0) return;
    if (AllTags.length === 1) {
        AllTags[0].classList.add('highlight');
        return;
    }
    let count = 0;
    timerInterval = setInterval(() => {
        const randtag = randomSelectTag();
        if (randtag)
        {
            randtag.classList.add('highlight');
            setTimeout(() => {
                randtag.classList.remove('highlight');
            }, 80);
        }
        count++;
        if (count >= times)
        {
            clearInterval(timerInterval);
            timerInterval = null;
            setTimeout(() => {
                const finaltag = randomSelectTag();
                finaltag.classList.add('highlight');
            }, 100);
        }
    }, 100)
}