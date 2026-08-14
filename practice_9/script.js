const jokeEl = document.querySelector('.joke');
const jokeBtn = document.querySelector('.btn');

jokeBtn.addEventListener('click', generateJoke);
generateJoke();

async function generateJoke() {
   try {
        const config = {
            headers: {
                'Accept': 'application/json'
            }
       };
       const res = await fetch('https://icanhazdadjoke.com', config);
       if (!res.ok)
       {
           throw new Error('请求错误')
       }
       const data = await res.json();
       jokeEl.innerHTML = data.joke;
    }
    catch (e)
    {
       console.log('获取失败', e);
    }
    
}