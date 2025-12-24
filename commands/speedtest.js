module.exports = {
    data: { name: 'speedtest', description: 'Tests player speed' },
    async execute(message, args) {
        const user = message.mentions.users.first() || message.author;
        const speed = Math.floor(Math.random() * 50) + 1;

        message.reply(`👟 **${user}** is running at **${speed} km/h**`);
    }
};
