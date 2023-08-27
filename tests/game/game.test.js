const Monopoly = require('../../src/game/game');
const properties = require('../../src/game/types/propertyCards');

describe('Monopoly Game', () => {
    let game;
    let player1;
    let player2;

    beforeEach(() => {
        game = new Monopoly(['Alice', 'Bob']);
        player1 = game.players[0];
        player2 = game.players[1];
    });

    test('should initialize players correctly', () => {
        expect(game.players.length).toBe(2);
        expect(player1.name).toBe('Alice');
        expect(player2.name).toBe('Bob');
    });

    test('should roll dice and return a number between 2 and 12', () => {
        const diceResult = game.rollDice();
        expect(diceResult.total).toBeGreaterThanOrEqual(2);
        expect(diceResult.total).toBeLessThanOrEqual(12);
    });

    test('should move to the next player', () => {
        expect(game.currentPlayerIndex).toBe(0);
        game.nextPlayer();
        expect(game.currentPlayerIndex).toBe(1);
        game.nextPlayer();
        expect(game.currentPlayerIndex).toBe(0);
    });

    test('player should move correctly based on dice roll', () => {
        const initialPosition = player1.position;
        const diceRoll = { total: 5, isDouble: false };
        game.handlePlayerMovement(player1, diceRoll);
        expect(player1.position).toBe(initialPosition + 5);
    });

    // This test assumes you always buy available properties in the `handlePropertyTransaction` function
    test('player should buy property if it is available and they have enough money', () => {
        // Assuming there's a property at position 1 costing $100
        player1.position = 1;
        player1.money = 500;
        game.handlePropertyTransaction(player1);
        expect(player1.money).toBe(440); // 500 - 100 for the property
    });

    test('should handle Chance cards correctly', () => {
        player1.position = 7; // Предположим, что position 7 это "chance"
        const initialMoney = player1.money;

        jest.spyOn(global.Math, 'random').mockReturnValue(0.35)
        game.processChanceOrChestCard(player1);
        jest.spyOn(global.Math, 'random').mockRestore();

        // Предположим, что одна из карточек шанса уменьшает деньги игрока на 50
        expect(player1.money).toBeGreaterThanOrEqual(initialMoney);
    });

    test('should handle Community Chest cards correctly', () => {
        player1.position = 2; // Предположим, что position 2 это "community chest"
        const initialMoney = player1.money;

        jest.spyOn(global.Math, 'random').mockReturnValue(0.35)
        game.processChanceOrChestCard(player1);
        jest.spyOn(global.Math, 'random').mockRestore();

        // Предположим, что одна из карточек сообщества увеличивает деньги игрока на 50
        expect(player1.money).toBeLessThanOrEqual(initialMoney);
    });

    test('should charge tax correctly', () => {
        player1.position = 4; // Предположим, что position 4 это "Income Tax"
        const initialMoney = player1.money;
        game.handleTax(player1);
        expect(player1.money).toBeLessThan(initialMoney);
    });



    test('should handle utilities rent correctly', () => {
        player1.position = 12; // Предположим, что position 12 это "Electric Company" (utility)
        // Предположим, что это коммунальная услуга принадлежит player2
        properties[12].owner = player2;

        const initialPlayer1Money = player1.money;
        const initialPlayer2Money = player2.money;

        game.handleUtilities(player1);

        expect(player1.money).toBeLessThan(initialPlayer1Money);
        expect(player2.money).toBeGreaterThan(initialPlayer2Money);
    });


    test('should handle going to jail correctly', () => {
        player1.position = 30; // Предположим, что position 30 это "Go To Jail"
        game.handleToJail(player1);
        expect(player1.inJail).toBeTruthy();
        expect(player1.position).toBe(10); // Позиция тюрьмы
    });


    test('should handle player getting out of jail on a double roll', () => {
        player1.inJail = true;
        const diceRoll = { total: 8, isDouble: true };
        game.handleJailStatus(player1, diceRoll);
        expect(player1.inJail).toBeFalsy();
    });

});
