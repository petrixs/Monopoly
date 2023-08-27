const Monopoly = require('./src/game/game');

const game = new Monopoly(["Alice", "Bob"]);

for (let i = 0; i < 300; i++) {  // 100 ходов для демонстрации
    game.playTurn();
}

console.log(game.players);