module.exports = {
    data: { name: 'bless', description: 'Bless someone' },
    async execute(message, args) {
        const user = message.mentions.users.first();
        if (!user) return message.reply("Mention someone!");

        const blessings = [
            "+10 IQ",
            "+20 Luck",
            "Protection from cringe",
            "Ultra Sigma Energy",
            "Anti-Lag buff"
        ];

        const bless = blessings[Math.floor(Math.random() * blessings.length)];

        message.reply(`✨ **${user} has been blessed with ${bless}!**`);
    }
};
