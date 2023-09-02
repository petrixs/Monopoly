const Player = require('./player');
const chanceCards = require('./types/chanceCards');
const properties = require('./types/propertyCards');
const communityChestCards = require('./types/communityChestCards');

class Monopoly {
    constructor(players) {
        this.players = players.map(playerName => new Player(playerName));
        this.properties = [

        ];
        this.currentPlayerIndex = 0;
    }

    rollDice() {
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const isDouble = dice1 === dice2;
        return {
            total: dice1 + dice2,
            isDouble
        };
    }

    nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    handlePlayerMovement(currentPlayer, diceRoll) {
        currentPlayer.move(diceRoll.total);
    }

    handlePropertyTransaction(currentPlayer) {

        const currentProperty = properties[currentPlayer.position];

        if(["property", "railroad", "utility"].includes(currentProperty.type) && currentProperty.owner === null) {
            let interestedPlayers = [...this.players].slice(this.currentPlayerIndex).concat(this.players.slice(0, this.currentPlayerIndex)); // создаем список игроков, начиная с текущего
            for (let player of interestedPlayers) {
                if (player.money >= currentProperty.price) {
                    console.log(`${player.name}, would you like to buy ${currentProperty.name} for ${currentProperty.price}?`);
                    if (true) {  // Это условие можно заменить на реальный ввод пользователя. Сейчас предполагается, что игрок всегда говорит "да"
                        currentProperty.buy(player);
                        break;
                    }
                }
            }
        } else if(currentProperty.owner && currentProperty.owner !== currentPlayer) {
            if (currentProperty.type === "property") {
                const sameStreetProperties = properties.filter(p => p.street === currentProperty.street);
                const ownedStreetProperties = sameStreetProperties.filter(p => p.owner === currentProperty.owner).length;

                if (ownedStreetProperties === sameStreetProperties.length) {
                    // Если владелец владеет всеми участками на улице, аренда удваивается
                    currentProperty.rentAmount *= 2;
                }
            }

            currentProperty.rent(currentPlayer);
        }
    }

    processChanceOrChestCard(currentPlayer) {

        const currentProperty = properties[currentPlayer.position];

        if (currentProperty.type === "chance") {
            let card = chanceCards[Math.floor(Math.random() * chanceCards.length)];
            console.log(`Chance Card: ${card.description}`);
            card.action(currentPlayer);
        }

        if (currentProperty.type === "community chest") {
            let randomElement = Math.floor(Math.random() * communityChestCards.length);
            let card = communityChestCards[randomElement];
            console.log(`Community Chest Card: ${card.description}`);
            card.action(currentPlayer);
        }

    }

    handleTax(currentPlayer) {
        const currentProperty = properties[currentPlayer.position];
        if (currentProperty.type === "tax") {
            if (currentProperty.name === "Income Tax") {
                // Вы можете добавить логику для выбора: платить фиксированную сумму или 10% от общей суммы
                const fixedTax = currentProperty.rentAmount;
                const percentageTax = 0.1 * currentPlayer.money; // 10% от общей суммы
                const taxToPay = Math.round(Math.min(fixedTax, percentageTax)); // Здесь мы просто берем минимальное значение
                currentPlayer.money -= taxToPay;
                console.log(`${currentPlayer.name} paid an Income Tax of $${taxToPay}`);
            } else if (currentProperty.name === "Luxury Tax") {
                currentPlayer.money -= currentProperty.rentAmount;
                console.log(`${currentPlayer.name} paid a Luxury Tax of $${currentProperty.rentAmount}`);
            }
        }
    }

    handleUtilities(currentPlayer) {
        const currentProperty = properties[currentPlayer.position];
        if (currentProperty.type === "utility" && currentProperty.owner && currentProperty.owner !== currentPlayer) {
            const owner = currentProperty.owner;
            const ownedUtilities = this.properties.filter(p => p.type === "utility" && p.owner === owner).length;

            // Симулируем бросок двух кубиков
            const diceRoll = this.rollDice().total;

            let multiplier = ownedUtilities === 1 ? 4 : 10;
            const rent = multiplier * diceRoll;

            currentPlayer.money -= rent;
            owner.money += rent;

            console.log(`${currentPlayer.name} rolled a total of ${diceRoll} and paid a rent of $${rent} to ${owner.name} for ${currentProperty.name}`);
        }
    }

    handleJailStatus(currentPlayer, diceRoll) {
        currentPlayer.turnsInJail += 1;

        if (diceRoll.isDouble || currentPlayer.turnsInJail === 3) {
            currentPlayer.inJail = false;
            currentPlayer.turnsInJail = 0;

            if(diceRoll.isDouble) {
                console.log(`${currentPlayer.name} rolled a double and is out of jail.`);
                currentPlayer.move(diceRoll.total);
            } else {
                console.log(`${currentPlayer.name} paid $50 and is out of jail.`);
                currentPlayer.money -= 50;
                currentPlayer.move(diceRoll.total);
            }

        } else {
            console.log(`${currentPlayer.name} still in jail. Turns in jail ${currentPlayer.turnsInJail}.`);
            this.nextPlayer();
            return true;
        }

        return false;
    }

    handleToJail(currentPlayer) {

        const currentProperty = properties[currentPlayer.position];

        if (currentProperty.type === "go to jail") {
            currentPlayer.position = 10;
            currentPlayer.inJail = true;
            console.log(`${currentPlayer.name} has been sent to jail!`);
        }
    }

    playTurn() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        const diceRoll = this.rollDice();

        if (currentPlayer.inJail && this.handleJailStatus(currentPlayer, diceRoll)) {
            return;
        }

        this.handlePlayerMovement(currentPlayer, diceRoll);
        this.handlePropertyTransaction(currentPlayer);
        this.processChanceOrChestCard(currentPlayer);
        this.handleTax(currentPlayer);
        this.handleUtilities(currentPlayer);
        this.handleToJail(currentPlayer);

        this.nextPlayer();
    }
}

module.exports = Monopoly;