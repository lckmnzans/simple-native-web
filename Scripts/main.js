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
    let contactButton = actionButton('Contact');
    let postsButton = actionButton('Posts');
    let todoButton = actionButton('To-Do');
    actions.append(contactButton, postsButton, todoButton)
    setContactButtonListener(id, contactButton);
    setPostsButtonListener(id, postsButton);
    setTodoButtonListener(id, todoButton);
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

function showContactModal({phone, website, address: {street, suite, city, zipcode}}) {
    let overlay = document.querySelector('.overlay');
    overlay.classList.remove('hidden');
    let modalTitle = overlay.querySelector('.modal .title')
    modalTitle.textContent = "Contact Detail";
    let modalContent = overlay.querySelector('.modal .content');
    let htmlContent = `
        <div class="column gap">
            <div class="row gap">
                <div class="column w-1">
                    <span><strong>Address</strong></span>
                </div>
                <div class="column gap">
                    <div class="row gap">
                        <div class="column">
                            <span class="color-purple">Street</span>
                            <span class="color-purple">Suite</span>
                            <span class="color-purple">City</span>
                            <span class="color-purple">Zip Code</span>
                        </div>
                        <div class="column">
                            <span>${street}</span>
                            <span>${suite}</span>
                            <span>${city}</span>
                            <span>${zipcode}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row gap">
                <div class="column w-1">
                    <span><strong>Phone</strong></span>
                </div>
                <div class="column">
                    <span>${phone}</span>
                </div>
            </div>

            <div class="row gap">
                <div class="column w-1">
                    <span><strong>Website</strong></span>
                </div>
                <div class="column">
                    <span>${website}</span>
                </div>
            </div>
        </div>
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
        htmlStringTodos = htmlStringTodos + `
            <li>
                <span class="text">${todo.title}</span>
                <span class="icon color-green">${todo.completed == true ? '<i class="fa fa-check"></i>' : ''}</span>
            </li>
        `;
    }
    list.innerHTML = htmlStringTodos;
}

function setPostsButtonListener(id, buttonElement) {
    buttonElement?.addEventListener('click', async event => {
        window.location.href = `posts.html?id=${id}`;
    })
}