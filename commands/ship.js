module.exports = {
    data: { name: 'ship', description: 'Ship two users' },
    async execute(message, args) {
        const user1 = message.mentions.users.first();
        const user2 = message.mentions.users.at(1);

        if (!user1 || !user2) return message.reply("Mention two people!");

        const percent = Math.floor(Math.random() * 101);

        message.reply(`💘 **${user1} ❤️ ${user2} = ${percent}%**`);
    }
};
