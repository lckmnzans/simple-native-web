(async function() {
    let users = await fetchUsers();
    fillTableUsers(users);
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

function fillTableUsers(users) {
    let tableBodyElement = document.querySelector('.table-users tbody');
    for (let user of users) {
        tableBodyElement.append(buildRowUserElement(user));
    }
}

function buildRowUserElement({id, name, username, email, company }) {
    let rowUserElement = document.createElement('tr');
        rowUserElement.setAttribute('data-id', id);
    let actionButton = (content) => {
        let button = document.createElement('button');
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
    setContactButtonListener(actions.querySelector('button:nth-child(1)'));
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

function setContactButtonListener(buttonElement) {
    buttonElement?.addEventListener('click', async event => {
        let rowUser = buttonElement.closest('tr');
        let id = rowUser?.getAttribute('data-id');
        let user = await fetchUser(id);
        console.log(user);
    })
}