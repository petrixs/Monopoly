const Property = require('../../src/game/property');
const Player = require('../../src/game/player');

describe('Property class', () => {
    let property;
    let player;

    beforeEach(() => {
        property = new Property('Boardwalk', 'property', 400, 50);
        player = new Player('John');
    });

    test('initial properties should be set correctly', () => {
        expect(property.name).toBe('Boardwalk');
        expect(property.type).toBe('property');
        expect(property.price).toBe(400);
        expect(property.rentAmount).toBe(50);
        expect(property.owner).toBeNull();
    });

    test('buying a property should set the owner and deduct player money', () => {
        player.money = 500;
        property.buy(player);
        expect(property.owner).toBe(player);
        expect(player.money).toBe(100);
    });

    test('cannot buy a property without sufficient money', () => {
        player.money = 300;
        property.buy(player);
        expect(property.owner).toBeNull();
        expect(player.money).toBe(300);
    });

    test('paying rent should transfer money from tenant to owner', () => {
        let owner = new Player('Alice');
        owner.money = 1000;
        property.owner = owner;

        player.money = 500;
        property.rent(player);

        expect(owner.money).toBe(1050);
        expect(player.money).toBe(450);
    });
});