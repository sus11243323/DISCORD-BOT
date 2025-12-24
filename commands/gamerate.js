module.exports = {
    data: { name: 'gamerate', description: 'Rates how gamer someone is' },
    async execute(message, args) {
        const user = message.mentions.users.first() || message.author;
        const percent = Math.floor(Math.random() * 101);

        message.reply(`🎮 **${user}** is **${percent}% gamer**`);
    }
};
