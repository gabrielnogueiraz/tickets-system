// Função para salvar os chamados no localStorage
function saveTickets(tickets) {
    localStorage.setItem('tickets', JSON.stringify(tickets));
}

// Função para carregar os chamados do localStorage
function loadTickets() {
    const tickets = localStorage.getItem('tickets');
    return tickets ? JSON.parse(tickets) : [];
}

// Função para renderizar os chamados na lista como uma tabela
function renderTickets(tickets) {
    const ticketList = document.getElementById('ticketList');
    ticketList.innerHTML = '';

    // Criar a tabela e o cabeçalho
    const table = document.createElement('table');
    table.className = 'ticket-table';

    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Data/Hora</th>
        <th>Usuário</th>
        <th>Serviço</th>
        <th>Descrição</th>
        <th>Mesa</th>
        <th>Matrícula</th>
        <th>Status</th>
        <th>Técnico</th>
    `;
    table.appendChild(headerRow);

    // Preencher a tabela com os chamados
    tickets.forEach((ticket, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${ticket.dateTime}</td>
            <td>${ticket.username}</td>
            <td>${ticket.service}</td>
            <td>${ticket.description}</td>
            <td>${ticket.deskNumber}</td>
            <td>${ticket.employeeId}</td>
            <td>
                <select class="status">
                    <option value="Concluido" ${ticket.status === 'Concluindo' ? 'selected' : ''}>Concluido</option>
                    <option value="A caminho" ${ticket.status === 'A caminho' ? 'selected' : ''}>A caminho</option>
                    <option value="Reset Solicitado" ${ticket.status === 'Reset Solicitado' ? 'selected' : ''}>Reset Solicitado</option>
                    <option value="REQ aberta" ${ticket.status === 'REQ aberta' ? 'selected' : ''}>REQ aberta</option>
                    <option value="Em análise" ${ticket.status === 'Em análise' ? 'selected' : ''}>Em análise</option>
                </select>
            </td>
            <td>
                <select class="techName">
                    <option value="Gabriel N." ${ticket.techName === 'Gabriel N.' ? 'selected' : ''}>Gabriel N.</option>
                    <option value="Jota" ${ticket.techName === 'Jota' ? 'selected' : ''}>Jota</option>
                    <option value="Elias" ${ticket.techName === 'Elias' ? 'selected' : ''}>Elias</option>
                    <option value="Luis" ${ticket.techName === 'Luis' ? 'selected' : ''}>Luis</option>
                    <option value="José" ${ticket.techName === 'José' ? 'selected' : ''}>José</option>
                    <option value="Gustavo" ${ticket.techName === 'Gustavo' ? 'selected' : ''}>Gustavo</option>
                    <option value="Thiago" ${ticket.techName === 'Thiago' ? 'selected' : ''}>Thiago</option>
                    <option value="Higor" ${ticket.techName === 'Higor' ? 'selected' : ''}>Higor</option>
                </select>
            </td>
        `;

        table.appendChild(row);

        // Atualiza o status no localStorage automaticamente ao alterar o status
        row.querySelector('.status').addEventListener('change', function () {
            const updatedStatus = row.querySelector('.status').value;
            tickets[index].status = updatedStatus;
            saveTickets(tickets);
        });

        // Atualiza o técnico no localStorage automaticamente ao alterar o nome do técnico
        row.querySelector('.techName').addEventListener('change', function () {
            const updatedTechName = row.querySelector('.techName').value;
            tickets[index].techName = updatedTechName;
            saveTickets(tickets);
        });
    });

    ticketList.appendChild(table);
}

// Função para salvar o nome do usuário no localStorage
function saveUsername(username) {
    localStorage.setItem('loggedInUser', username);
}

// Função para carregar o nome do usuário do localStorage
function loadUsername() {
    return localStorage.getItem('loggedInUser');
}

// Verifica se o usuário já está logado ao carregar a página
window.addEventListener('load', function () {
    const username = loadUsername();
    if (username) {
        document.getElementById('usernameField').value = username;
        const dateTime = new Date().toLocaleString();
        document.getElementById('dateTimeField').value = dateTime;

        // Esconde o login e mostra os formulários
        document.querySelector('.login-container').style.display = 'none';
        document.querySelector('.ticket-container').style.display = 'block';
        document.querySelector('.ticket-list-container').style.display = 'block';

        // Carrega e renderiza os chamados
        const tickets = loadTickets();
        renderTickets(tickets);
    }
});

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;

    // Salva o nome do usuário no localStorage
    saveUsername(username);

    // Armazena o nome de usuário e a data/hora
    document.getElementById('usernameField').value = username;
    const dateTime = new Date().toLocaleString();
    document.getElementById('dateTimeField').value = dateTime;

    // Esconde o login e mostra os formulários
    document.querySelector('.login-container').style.display = 'none';
    document.querySelector('.ticket-container').style.display = 'block';
    document.querySelector('.ticket-list-container').style.display = 'block';

    // Carrega e renderiza os chamados
    const tickets = loadTickets();
    renderTickets(tickets);
});

// Função para preencher o nome do usuário logado no header
function updateHeaderUsername() {
    const username = loadUsername();
    if (username) {
        document.getElementById('loggedInUser').textContent = username;
    }
}

// Função para logout
function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.reload(); // Recarrega a página para voltar ao login
}

// Atualiza o header com o nome do usuário logado
window.addEventListener('load', function () {
    updateHeaderUsername();
});

// Adiciona evento de logout ao botão
document.getElementById('logoutButton').addEventListener('click', logout);

document.getElementById('ticketForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const service = document.getElementById('service').value;
    const description = document.getElementById('description').value;
    const deskNumber = document.getElementById('deskNumber').value;
    const employeeId = document.getElementById('employeeId').value;
    const username = document.getElementById('usernameField').value;
    const dateTime = document.getElementById('dateTimeField').value;

    const tickets = loadTickets();

    // Cria novo ticket
    const newTicket = {
        username,
        dateTime,
        service,
        description,
        deskNumber,
        employeeId,
        status: 'A caminho', // Default status
        techName: 'Gabriel. N' // Default technician name
    };

    tickets.push(newTicket);
    saveTickets(tickets);
    renderTickets(tickets);

    // Limpar formulário
    document.getElementById('ticketForm').reset();
});




