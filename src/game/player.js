class Player {
    constructor(name) {
        this._name = name;
        this._position = 0;
        this._money = 1500;
        this._inJail = false;
        this._turnsInJail = 0;
        this._getOutOfJailCards = 0;
    }

    // Геттеры и сеттеры
    get name() {
        return this._name;
    }

    set name(value) {
        if (typeof value === 'string' && value.trim().length > 0) {
            this._name = value;
        } else {
            throw new Error("Invalid player name");
        }
    }

    get position() {
        return this._position;
    }

    set position(value) {
        if (Number.isInteger(value) && value >= 0) {
            this._position = value % 40; // чтобы позиция не превышала 40
        } else {
            throw new Error("Invalid position value");
        }
    }

    get money() {
        return this._money;
    }

    set money(value) {
        if (Number.isInteger(value)) {
            this._money = value;
        } else {
            throw new Error("Invalid amount of money");
        }
    }

    get inJail() {
        return this._inJail;
    }

    set inJail(value) {
        this._inJail = Boolean(value);
    }

    get turnsInJail() {
        return this._turnsInJail;
    }

    set turnsInJail(value) {
        if (Number.isInteger(value) && value >= 0) {
            this._turnsInJail = value;
        } else {
            throw new Error("Invalid turns in jail value");
        }
    }

    get getOutOfJailCards() {
        return this._getOutOfJailCards;
    }

    set getOutOfJailCards(value) {
        if (Number.isInteger(value) && value >= 0) {
            this._getOutOfJailCards = value;
        } else {
            throw new Error("Invalid get out of jail cards value");
        }
    }

    move(spaces) {
        this._position += spaces;
        if (this._position >= 40) {
            this._position -= 40;  // возврат к началу поля после полного круга
            this._money += 200;  // прохождение "Go" дает игроку $200
        }
    }
}

module.exports = Player;