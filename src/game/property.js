class Property {
    constructor(name, type, price = 0, rentAmount = 0, street = null) {
        this._name = name;
        this._type = type; // "property", "chance", "community chest", "tax", "railroad", "utility", "go", "jail", "free parking", "go to jail"
        this._price = price;
        this._rentAmount = rentAmount;
        this._owner = null;
        this._street = street;
    }

    get name() {
        return this._name;
    }

    get type() {
        return this._type;
    }

    get price() {
        return this._price;
    }

    get rentAmount() {
        return this._rentAmount;
    }

    get owner() {
        return this._owner;
    }

    get street() {
        return this._street;
    }

    set owner(player) {
        if (!this._owner) {
            this._owner = player;
        }
    }

    buy(player) {
        if (!this._owner && player.money >= this._price) {
            player.money -= this._price;
            this._owner = player;
        }
    }

    rent(player) {
        if (this._owner && this._owner !== player) {
            player.money -= this._rentAmount;
            this._owner.money += this._rentAmount;
        }
    }
}

module.exports = Property;
