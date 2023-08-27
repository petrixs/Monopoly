module.exports = [
    {
        description: "Advance to Go. (Collect $200)",
        action: (player) => {
            player.position = 0; // Go клетка
            player.money += 200;
        }
    },
    {
        description: "Bank error in your favor. Collect $200.",
        action: (player) => {
            player.money += 200;
        }
    },
    {
        description: "Get out of Jail Free. This card may be kept until needed or sold.",
        action: function(player) {
            player.getOutOfJailCards += 1;
            console.log(`${player.name} received a 'Get Out of Jail Free' card.`);
        }
    },
];