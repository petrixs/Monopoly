module.exports = [
    {
        description: "Bank error in your favor. Collect $200.",
        action: (player) => {
            player.money += 200;
        }
    },
    {
        description: "Doctor's fees. Pay $50.",
        action: (player) => {
            player.money -= 50;
        }
    },
    {
        description: "Advance to Go. (Collect $200)",
        action: (player) => {
            player.position = 0; // Go клетка
            player.money += 200;
        }
    },
];
