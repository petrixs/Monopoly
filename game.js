// noinspection JSValidateTypes

const Monopoly = require('./src/game/game');

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

//const game = new Monopoly(["Alice", "Bob"]);

// for (let i = 0; i < 300; i++) {  // 100 ходов для демонстрации

// }

//console.log(game.players);

const app = express();
const server = http.createServer(app);
let playersToken = [];
let game;
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

    const token = socket.handshake.query.token;
    console.log(`New connection: ${socket.id}`);
    console.log(`token: ${token}`);
    playersToken.push(token);

    socket.on('request-reload-game', (data) => {
        console.log('Received request-reload-game:', data);
        console.log(playersToken);

       if (!game) return;
        socket.emit('response-start-game', {
            message: 'response-start-game',
            data: game
        });
    });

    socket.on('request-start-game', (data) => {
        console.log('Received request-start-game:', data);
        console.log(playersToken);
        game = new Monopoly(playersToken);
        playersToken = [];
        io.emit('response-start-game', {
            message: 'response-start-game',
            data: game
        });
    });

    socket.on('request-roll-dice', (data) => {
        console.log('request-roll-dice:', data);
        game.playTurn();
        io.emit('response-roll-dice', {
            message: 'response-roll-dice',
            data: game
        });
    });
});


server.listen(3000, () => {
    console.log('Listening on port 3000');
});