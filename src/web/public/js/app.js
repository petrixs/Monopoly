import * as PIXI from 'pixi.js';
import io from 'socket.io-client';
import '../css/style.css';
import properties from '../../../game/types/propertyCards';

const app = new PIXI.Application({
    width: 800,
    height: 800,
    backgroundColor: 0xFFFFFF,
});

document.getElementById('gameboard').appendChild(app.view);


// ===================

const CELL_SIZE = 72; // размер каждой клетки
const BOARD_SIZE = 11; // 10 клеток на каждой стороне

// Функция для создания клетки
function createCell(x, y, property) {
    const cell = new PIXI.Graphics();
    cell.beginFill(0xE0E0E0); // цвет фона
    cell.drawRect(0, 0, CELL_SIZE, CELL_SIZE);
    cell.endFill();
    cell.x = x;
    cell.y = y;

    const text = new PIXI.Text(property.name, {
        fontFamily: 'Arial',
        fontSize: 11,
        fill: 0x000000,
        wordWrap: true,
        wordWrapWidth: CELL_SIZE - 4
    });

    text.x = (CELL_SIZE - text.width) / 2;  // центрирование по горизонтали
    text.y = (CELL_SIZE - text.height) / 2; // центрирование по вертикали

    cell.addChild(text);
    app.stage.addChild(cell);
}

let propertyIndex = 0;

// Нижняя строка
for (let i = BOARD_SIZE - 1; i >= 0; i--) {
    createCell(i * CELL_SIZE, (BOARD_SIZE - 1) * CELL_SIZE, properties[propertyIndex++]);
}

// Левая колонка
for (let i = BOARD_SIZE - 2; i > 0; i--) {
    createCell(0, i * CELL_SIZE, properties[propertyIndex++]);
}

// Верхняя строка
for (let i = 0; i < BOARD_SIZE; i++) {
    createCell(i * CELL_SIZE, 0, properties[propertyIndex++]);
}

// Правая колонка
for (let i = 1; i < BOARD_SIZE - 1; i++) {
    createCell((BOARD_SIZE - 1) * CELL_SIZE, i * CELL_SIZE, properties[propertyIndex++]);
}

class Player {
    static activePlayer = null; // Нет активного игрока изначально
    static queue = []; // Очередь игроков, ожидающих своего хода
    constructor(color) {
        this.color = color;
        this.position = 0;
        this.graphics = new PIXI.Graphics();
        this.draw();
        this.isMoving = false; // Флаг для проверки, двигается ли игрок
    }

    draw() {
        this.graphics.beginFill(this.color);
        this.graphics.drawCircle(0, 0, 15);
        this.graphics.endFill();
        app.stage.addChild(this.graphics);
        this.updatePositionGraphics();
    }

    updatePositionGraphics() {
        // Если позиция меньше 10, игрок находится на правой стороне
        if (this.position < 10) {
            this.graphics.x = ((10 - this.position) * CELL_SIZE) + (CELL_SIZE / 2);
            this.graphics.y = (BOARD_SIZE - 1) * CELL_SIZE + (CELL_SIZE / 2);
        }
        // Если позиция между 10 и 19, игрок находится на верхней стороне
        else if (this.position < 20) {
            this.graphics.x = (CELL_SIZE / 2);
            this.graphics.y = ((20 - this.position) * CELL_SIZE) + (CELL_SIZE / 2);
        }
        // Если позиция между 20 и 29, игрок находится на левой стороне
        else if (this.position < 30) {
            this.graphics.x = ((this.position - 20) * CELL_SIZE) + (CELL_SIZE / 2);
            this.graphics.y = (CELL_SIZE / 2);
        }
        // Если позиция между 30 и 39, игрок находится внизу
        else {
            this.graphics.x = (BOARD_SIZE - 1) * CELL_SIZE + (CELL_SIZE / 2);
            this.graphics.y = ((this.position - 30) * CELL_SIZE) + (CELL_SIZE / 2);
        }
    }
    moveTo(targetPosition, relative = false) {
        let finalPosition;

        if (relative) {
            finalPosition = (this.position + targetPosition) % 40;
        } else {
            finalPosition = targetPosition;
        }

        const steps = (finalPosition - this.position + 40) % 40;  // Вычисляем, сколько шагов нужно сделать

        if (Player.activePlayer) {
            // Если есть другой активный игрок, добавьте этого игрока в очередь
            Player.queue.push({ player: this, target: finalPosition });
            return;
        }

        Player.activePlayer = this;
        let movesMade = 0;

        const moveStep = () => {
            if (movesMade === steps) {
                Player.activePlayer = null;

                if (Player.queue.length) {
                    // Если в очереди есть игроки, начните с следующего игрока
                    const next = Player.queue.shift();
                    next.player.moveTo(next.target);
                }

                return;
            }

            this.position = (this.position + 1) % 40;
            this.updatePositionGraphics();
            movesMade++;
            setTimeout(moveStep, 500);
        };

        moveStep();
    }

}

function setGameSettings(params) {
    const playerStates = params.data.players;
    for (let i = 0; i < playerStates.length; i++) {
        const playerState = playerStates[i];
        players[i].position = playerState._position;
        players[i].updatePositionGraphics();
        console.log('updatePositionGraphics():player #'+i+' position:'+playerState._position);
    }
}

const colors = [0xFF0000, 0x00FF00, 0x0000FF];
const players = colors.map(color => new Player(color));

const rollDiceButton = document.getElementById('roll-dice');
const startGameButton = document.getElementById('start-game');

const names = ["Alice", "Bob"];

let token = sessionStorage.getItem('token');


if (!token) {
    token = names[Math.floor((Math.random()*names.length))];
    sessionStorage.setItem('token', token);
} else {
    console.log("Existing token found: ", token);
}

console.log(token);
const socket = io.connect('http://localhost:3000',{
    query: { token: token }
});

socket.on('connect', () => {
    console.log('Connected to server');

    console.log('request-reload-game');
    socket.emit('request-reload-game');

    socket.on('response-start-game', (params) => {
        console.log('response-start-game:', params.data);
        setGameSettings(params);
    });

    socket.on('response-roll-dice', (params) => {
        console.log('response-roll-dice:', params.data);
        const playerStates = params.data.players;
        for (let i = 0; i < playerStates.length; i++) {
            const playerState = playerStates[i];
            players[i].moveTo(playerState._position);
            console.log('players['+i+'].moveTo()', playerState._position);
        }
    });

});

rollDiceButton.addEventListener('click', () => {
    socket.emit('request-roll-dice');
    console.log('request-roll-dice');
});

startGameButton.addEventListener('click', () => {
    socket.emit('request-start-game');
    console.log('request-start-game');

});

// Пример использования:
// players[0].moveTo(30);  // Перемещаем первого игрока на 3 клетки вперед
// players[1].moveTo(12);
// players[2].moveTo(15);
// players[0].moveTo(20);