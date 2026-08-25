const APIURL = 'https://api.github.com/users/'

const main = document.querySelector('#main');
const form = document.querySelector('#form');
const search = document.querySelector('#search');

async function getUser(usrname) {
    try {
        const res = await fetch(APIURL + usrname);
        if (!res.ok)
        {
            if (res.status === 404) throw new Error('用户不存在');
            throw new Error('网络请求错误');
        }
        const data = await res.json();
        createUserCard(data);
        getUserRepo(usrname);
    }
    catch (error) {
        console.log(error)
        createErrorCard(error.message);
    }
}

async function getUserRepo(usrname) {
    try {
        const res = await fetch(APIURL + usrname + '/repos?sort=created');
        if (!res.ok && res.status !== 404)
        {
            throw new Error('网络请求错误');
        }
        const data = await res.json();
        addReposToCard(data);
    }
    catch (error)
    {
        console.log(error);
        createErrorCard(error.message);
    }
}

function createUserCard(data)
{
    const userID = data.name || data.login;
    const userBio = data.bio ? `<p>${data.bio}</p>` : '';
    const cardHTML = `
    <div class = "card">
    <div>
        <img src="${data.avatar_url}" alt="${data.name}" class="avatar">
    </div>
    <div class="user-info">
        <h2>${userID}</h2>
        ${userBio}
        <ul>
            <li>${data.followers} <strong>Followers</strong></li>
            <li>${data.following} <strong>Following</strong></li>
            <li>${data.public_repos} <strong>Repos</strong></li>
        </ul>
        <div id="repos"></div>
    </div>
    </div>
    `
    main.innerHTML = cardHTML;
}

function createErrorCard(m)
{
        const cardHTML = `
        <div class="card">
            <h1>${m}</h1>
        </div>
    `

    main.innerHTML = cardHTML
}


function addReposToCard(repos)
{
    const reposEl = document.querySelector('#repos');
    repos.slice(0, 5).forEach(repo => {
        const repoEl = document.createElement('a');
        repoEl.classList.add('repo');
        repoEl.href = repo.html_url;
        repoEl.target = '_blank';
        repoEl.innerText = repo.name;
        reposEl.appendChild(repoEl);
    })
}



form.addEventListener('submit', (e) => {
    e.preventDefault()

    const user = search.value

    if(user) {
        getUser(user)

        search.value = ''
    }
})

