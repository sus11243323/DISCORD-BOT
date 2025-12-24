const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: {
        name: 'resetname',
        description: 'Reset the bot username to Original GWS Bot'
    },
    async execute(message, args) {
        const OWNER_ID = '1057830290749390902';

        // Check if the user is the owner
        if (message.author.id !== OWNER_ID) {
            return message.reply('❌ You are not allowed to use this command.');
        }

        // Optional: also require Administrator permission
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('❌ You need Administrator permission to use this command.');
        }

        const originalName = 'Original GWS Bot';

        try {
            await message.client.user.setUsername(originalName);
            message.reply(`✅ Bot username has been reset to **${originalName}**`);
        } catch (error) {
            console.error(error);
            message.reply('❌ Failed to reset bot username. Remember, username can only be changed 2 times per hour!');
        }
    }
};
