// noinspection JSValidateTypes

const Monopoly = require('./src/game/game');

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const game = new Monopoly(["Alice", "Bob"]);

// for (let i = 0; i < 300; i++) {  // 100 ходов для демонстрации

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

    socket.on('request-game', (data) => {
        console.log('Received request-game:', data);
        socket.emit('response-game', {
            message: 'response-game',
            data: game
        });
    });

    socket.on('request-roll-dice', (data) => {
        console.log('request-roll-dice:', data);
        game.playTurn();
        socket.emit('response-roll-dice', {
            message: 'response-roll-dice',
            data: game
        });
    });
});


server.listen(3000, () => {
    console.log('Listening on port 3000');
});