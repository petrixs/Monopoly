const Monopoly = require('./src/game/game');

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const game = new Monopoly(["Alice", "Bob"]);

// for (let i = 0; i < 300; i++) {  // 100 ходов для демонстрации
//     game.playTurn();
// }

//console.log(game.players);

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST']
    }
});

app.use(cors({
    origin: 'http://localhost:8080', // адрес вашего фронтенд-сервера
    methods: ['GET', 'POST'], // разрешенные методы
    allowedHeaders: ['Content-Type', 'Authorization']
}));

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('requestToBackend', (data) => {
        console.log('Received:', data);

        socket.emit('responseFromBackend', { message: 'Hello from backend!',playerId:'0', moveTo: 30 });
    });
});


server.listen(3000, () => {
    console.log('Listening on port 3000');
});