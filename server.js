const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const http = require('http');
const { Server } = require('socket.io');

// Criação do app Express e servidor HTTP
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Configuração do banco de dados
const sequelize = new Sequelize('cercred_helpdesk', 'root', 'gnds2004', {
    host: 'localhost',
    dialect: 'mysql'
});

// Definição do modelo de Ticket
const Ticket = sequelize.define('Ticket', {
    username: { type: DataTypes.STRING, allowNull: false },
    service: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    deskNumber: { type: DataTypes.STRING, allowNull: false },
    employeeId: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: true },
    techName: { type: DataTypes.STRING, allowNull: true },
    dateTime: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

// Sincronizar os modelos com o banco de dados
sequelize.sync();

// Rotas API
app.post('/tickets', async (req, res) => {
    const ticket = await Ticket.create(req.body);

    // Emitir evento de novo ticket via WebSocket
    io.emit('ticketCreated', ticket);

    res.status(201).json(ticket);
});

app.get('/tickets', async (req, res) => {
    const tickets = await Ticket.findAll();
    res.json(tickets);
});

app.put('/tickets/:id', async (req, res) => {
    const ticket = await Ticket.findByPk(req.params.id);
    if (ticket) {
        await ticket.update(req.body);

        // Emitir evento de atualização de ticket via WebSocket
        io.emit('ticketUpdated', ticket);

        res.json(ticket);
    } else {
        res.status(404).send('Chamado não encontrado');
    }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
