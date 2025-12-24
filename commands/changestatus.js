const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: {
        name: 'changebotactivity',
        description: 'Change the bot status (online, idle, dnd, invisible)'
    },
    async execute(message, args) {
        // Only allow the bot owner to use this command
        const OWNER_ID = '1057830290749390902';
        if (message.author.id !== OWNER_ID) {
            return message.reply('❌ You cannot use this command!');
        }

        const status = args[0]?.toLowerCase();
        const validStatuses = ['online', 'idle', 'dnd', 'invisible'];

        if (!status || !validStatuses.includes(status)) {
            return message.reply(`❌ Invalid status! Please use one of: ${validStatuses.join(', ')}`);
        }

        try {
            await message.client.user.setPresence({ status: status });
            message.reply(`✅ Bot status changed to **${status}**`);
        } catch (error) {
            console.error(error);
            message.reply('❌ Failed to change bot status.');
        }
    }
};
