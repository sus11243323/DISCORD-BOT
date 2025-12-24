const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: {
        name: 'purge',
        description: 'Delete a specified number of messages from the channel'
    },
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply('❌ You need the Manage Messages permission to use this command!');
        }

        const amount = parseInt(args[0]);

        if (isNaN(amount) || amount < 1 || amount > 100) {
            return message.reply('❌ Usage: `!purge <number>`\nPlease provide a number between 1 and 100.');
        }

        try {
            const deleted = await message.channel.bulkDelete(amount + 1, true);
            const reply = await message.channel.send(`✅ Successfully deleted **${deleted.size - 1}** messages!`);
            
            setTimeout(() => reply.delete().catch(() => {}), 3000);
        } catch (error) {
            console.error(error);
            message.reply('❌ Failed to delete messages. Messages older than 14 days cannot be bulk deleted!');
        }
    }
};
