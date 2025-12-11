(async function() {
    let users = await fetchUsers();
    populateTableUsers(users);
    setCloseModalListener();
}())

async function fetchUsers() {
    let httpRequest = await fetch('https://jsonplaceholder.typicode.com/users');
    let response = await httpRequest.json();
    return response;
}

async function fetchUser(id) {
    let httpRequest = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    let response = await httpRequest.json();
    return response;
}

async function fetchTodosByUserId(id) {
    let httpRequest = await fetch(`https://jsonplaceholder.typicode.com/todos?userId=${id}`);
    let response = await httpRequest.json();
    return response;
}

function populateTableUsers(users) {
    let tableElement = document.querySelector('table.table-users');
    let tableBodyElement = tableElement.querySelector('tbody');
    for (let user of users) {
        tableBodyElement.append(buildRowUserElement(user));
    }
    tableElement.classList.remove('hidden');
}

function buildRowUserElement({id, name, username, email, company }) {
    let rowUserElement = document.createElement('tr');
    rowUserElement.setAttribute('data-id', id);
    
    let actionButton = content => {
        let button = document.createElement('a');
        button.setAttribute('class','button');
        button.textContent = content;
        return button;
    }

    let columnName = buildCellUserElement(name);
    let columnUsername = buildCellUserElement(username);
    let columnEmail = buildCellUserElement(email);
    let columnCompany = buildCellUserElement(company.name);
    let actions = document.createElement('div');
    actions.setAttribute('class','actions');
    actions.append(
        actionButton('Contact'),
        actionButton('Posts'),
        actionButton('To-Do')
    )
    setContactButtonListener(id, actions.querySelector('.button:nth-child(1)'));
    setPostsButtonListener(id, actions.querySelector('.button:nth-child(2)'));
    setTodoButtonListener(id, actions.querySelector('.button:nth-child(3)'));
    let columnActions = buildCellUserElement(actions);
    
    rowUserElement.append(
        columnActions,
        columnName,
        columnUsername,
        columnEmail,
        columnCompany
    )
    return rowUserElement;
}

function buildCellUserElement(content) {
    let cellElement = document.createElement('td');
    cellElement.append(content);
    return cellElement;
}

function setContactButtonListener(id, buttonElement) {
    buttonElement?.addEventListener('click', async event => {
        let user = await fetchUser(id);
        showContactModal(user);
    })
}

function showContactModal(user) {
    let overlay = document.querySelector('.overlay');
    overlay.classList.remove('hidden');
    let modalTitle = overlay.querySelector('.modal .title')
    modalTitle.textContent = "Contact Detail";
    let modalContent = overlay.querySelector('.modal .content');
    let htmlContent = `
        <table>
            <tr>
                <th><span>Address</span></th>
                <td class="row gap">
                    <div class="column">
                        <span>Street</span>
                        <span>Suite</span>
                        <span>City</span>
                        <span>Zip Code</span>
                    </div>
                    <div class="column">
                        <span>${user.address.street}</span>
                        <span>${user.address.suite}</span>
                        <span>${user.address.city}</span>
                        <span>${user.address.zipcode}</span>
                    </div>
                </td>
            </tr>
            <tr>
                <th><span>Phone</span></th>
                <td>${user.phone}</td>
            </tr>
            <tr>
                <th><span>Website</span></th>
                <td>${user.website}</td>
            </tr>
        </table>
    `;
    modalContent.innerHTML = htmlContent;
}

function setCloseModalListener() {
    let overlay = document.querySelector('.overlay');
    let closeButton = overlay.querySelector('.button');
    closeButton.addEventListener('click', event => {
        overlay.classList.add('hidden');
    })
}

function setTodoButtonListener(id, buttonElement) {
    buttonElement?.addEventListener('click', async event => {
        let todos = await fetchTodosByUserId(id);
        showTodosList(todos);
    })
}

function showTodosList(todos) {
    let list = document.querySelector('.list-todos');
    let htmlStringTodos = '';
    for (let todo of todos) {
        htmlStringTodos = htmlStringTodos + `<li><span class="text">${todo.title}</span><span class="icon">${todo.completed == true ? '<i class="fa fa-check"></i>' : ''}</span></li>`;
    }
    list.innerHTML = htmlStringTodos;
}

function setPostsButtonListener(id, buttonElement) {
    buttonElement?.addEventListener('click', async event => {
        window.location.href = `posts.html?id=${id}`;
    })
}