(async function() {
    let params = new URLSearchParams(window.location.search);
    let id = params.get("id");
    let posts = await fetchPostsByUserId(id);
    let user = await fetchUser(id);
    setPageTitle(user);
    populateTablePosts(posts);
    setBackButtonListener();
}())

async function fetchPostsByUserId(id) {
    let httpRequest = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`);
    let response = await httpRequest.json();
    return response;
}

async function fetchUser(id) {
    let httpRequest = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    let response = await httpRequest.json();
    return response;
}

function setPageTitle({name}) {
    const mainHeaderTitle = document.querySelector('.main .page-title');
    mainHeaderTitle.textContent = name + "'s Posts";
}

function populateTablePosts(posts) {
    let tableBodyElement = document.querySelector('.table-wrapper tbody');
    let stringTableContent = '';
    for (let {body,title} of posts) {
        stringTableContent = stringTableContent + `
            <tr>
                <td>${title}</td>
                <td>${body}</td>
            </tr>
        `;
    }
    tableBodyElement.innerHTML = stringTableContent;
    tableBodyElement.closest('table').classList.remove('hidden');
}

function setBackButtonListener() {
    let backButton = document.querySelector('.button#back-button');
    backButton.addEventListener('click', event => {
        history.back();
    })
}