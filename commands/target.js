module.exports = {
    data: { name: 'target', description: 'Targets a user' },
    async execute(message, args) {
        const user = message.mentions.users.first();
        if (!user) return message.reply("Mention someone!");

        message.reply(`🎯 **${user} has been targeted. Good luck.**`);
    }
};
