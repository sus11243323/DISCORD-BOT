const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: {
        name: 'clear',
        description: 'Clear messages from a specific user'
    },
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply('❌ You need the Manage Messages permission to use this command!');
        }

        const user = message.mentions.users.first();
        const amount = parseInt(args[1]) || 100;

        if (!user) {
            return message.reply('❌ Usage: `!clear @user [amount]`\nExample: `!clear @user 50`');
        }

        if (amount < 1 || amount > 100) {
            return message.reply('❌ Amount must be between 1 and 100!');
        }

        try {
            const messages = await message.channel.messages.fetch({ limit: 100 });
            const userMessages = messages.filter(m => m.author.id === user.id).first(amount);

            if (userMessages.length === 0) {
                return message.reply(`❌ No recent messages found from ${user.tag}!`);
            }

            const deleted = await message.channel.bulkDelete(userMessages, true);

            const reply = await message.channel.send(`✅ Deleted **${deleted.size}** messages from **${user.tag}**!`);
            setTimeout(() => reply.delete().catch(() => {}), 3000);

        } catch (error) {
            console.error(error);
            message.reply('❌ Failed to clear messages. Messages older than 14 days cannot be deleted!');
        }
    }
};
