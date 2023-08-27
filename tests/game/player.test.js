const Player = require('../../src/game/player'); // путь к вашему файлу Player

describe('Player class', () => {

    let player;
    beforeEach(() => {
        player = new Player('John');
    });

    test('should instantiate with correct properties', () => {
        expect(player.name).toBe('John');
        expect(player.position).toBe(0);
        expect(player.money).toBe(1500);
        expect(player.inJail).toBe(false);
        expect(player.turnsInJail).toBe(0);
        expect(player.getOutOfJailCards).toBe(0);
    });

    test('should move player correctly', () => {
        player.move(5);
        expect(player.position).toBe(5);

        player.move(35);
        expect(player.position).toBe(0); // The player completed a loop around the board
        expect(player.money).toBe(1700); // Player received $200 after passing "Go"
    });

    test('should handle inJail property correctly', () => {
        player.inJail = true;
        expect(player.inJail).toBe(true);

        player.inJail = false;
        expect(player.inJail).toBe(false);
    });

    test('should throw error for invalid name', () => {
        expect(() => {
            player.name = '';
        }).toThrow("Invalid player name");
    });

    // Подобные тесты можно добавить для других свойств и методов класса Player

});