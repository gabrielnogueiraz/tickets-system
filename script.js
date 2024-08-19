// Função para carregar os chamados do servidor
async function loadTickets() {
    try {
        const response = await fetch('http://localhost:3000/tickets');
        const tickets = await response.json();
        return tickets;
    } catch (error) {
        console.error('Erro ao carregar os chamados:', error);
        return [];
    }
}

// Função para criar um novo chamado no servidor
async function createTicket(ticketData) {
    try {
        const response = await fetch('http://localhost:3000/tickets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ticketData)
        });
        return await response.json();
    } catch (error) {
        console.error('Erro ao criar o chamado:', error);
    }
}

// Função para atualizar um chamado no servidor
async function updateTicketStatus(id, updatedData) {
    try {
        await fetch(`http://localhost:3000/tickets/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });
    } catch (error) {
        console.error('Erro ao atualizar o chamado:', error);
    }
}

// Função para renderizar os chamados na lista como uma tabela
function renderTickets(tickets) {
    const ticketList = document.getElementById('ticketList');
    ticketList.innerHTML = '';

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

    tickets.forEach((ticket, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${ticket.dateTime}</td>
            <td>${ticket.username}</td>
            <td>${ticket.service}</td>
            <td>${ticket.description}</td>
            <td>${ticket.deskNumber}</td>
            <td>${ticket.employeeId || 'N/A'}</td>
            <td>
                <select class="status">
                    <option value="Concluido" ${ticket.status === 'Concluido' ? 'selected' : ''}>Concluido</option>
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

        // Atualiza o status e técnico no servidor automaticamente
        row.querySelector('.status').addEventListener('change', function () {
            const updatedStatus = row.querySelector('.status').value;
            tickets[index].status = updatedStatus;
            updateTicketStatus(ticket.id, { status: updatedStatus });
        });

        row.querySelector('.techName').addEventListener('change', function () {
            const updatedTechName = row.querySelector('.techName').value;
            tickets[index].techName = updatedTechName;
            updateTicketStatus(ticket.id, { techName: updatedTechName });
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

// Formatação de data para o formato MySQL
function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
    return formattedDate;
}

// Verifica se o usuário já está logado ao carregar a página
window.addEventListener('load', async function () {
    const username = loadUsername();
    if (username) {
        document.getElementById('usernameField').value = username;
        const dateTime = formatDateTime(new Date());
        document.getElementById('dateTimeField').value = dateTime;

        // Esconde o login e mostra os formulários
        document.querySelector('.login-container').style.display = 'none';
        document.querySelector('.ticket-container').style.display = 'block';
        document.querySelector('.ticket-list-container').style.display = 'block';

        // Carrega e renderiza os chamados
        const tickets = await loadTickets();
        renderTickets(tickets);
    }
});

document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;

    // Salva o nome do usuário no localStorage
    saveUsername(username);

    // Armazena o nome de usuário e a data/hora
    document.getElementById('usernameField').value = username;
    const dateTime = formatDateTime(new Date());
    document.getElementById('dateTimeField').value = dateTime;

    // Esconde o login e mostra os formulários
    document.querySelector('.login-container').style.display = 'none';
    document.querySelector('.ticket-container').style.display = 'block';
    document.querySelector('.ticket-list-container').style.display = 'block';

    // Carrega e renderiza os chamados
    const tickets = await loadTickets();
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

document.getElementById('ticketForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const service = document.getElementById('service').value;
    const description = document.getElementById('description').value;
    const deskNumber = document.getElementById('deskNumber').value;
    const employeeId = document.getElementById('employeeId').value;
    const username = document.getElementById('usernameField').value;
    const dateTime = document.getElementById('dateTimeField').value;

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!service || !description || !deskNumber || !username || !dateTime) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    const newTicket = {
        username,
        dateTime: formatDateTime(dateTime),
        service,
        description,
        deskNumber,
        employeeId,
        status: 'A caminho',
        techName: 'Gabriel N.'
    };

    await createTicket(newTicket);
    const tickets = await loadTickets();
    renderTickets(tickets);

    // Limpar formulário
    document.getElementById('ticketForm').reset();
});
