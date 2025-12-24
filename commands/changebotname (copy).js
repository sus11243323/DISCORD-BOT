const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: {
        name: 'changename',
        description: 'Change the bot username (rate limited to 2 per hour)'
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

        const newName = args.join(' ');
        if (!newName) return message.reply('❌ Please provide a new name for the bot!');

        try {
            await message.client.user.setUsername(newName);
            message.reply(`✅ Bot username changed to **${newName}**`);
        } catch (error) {
            console.error(error);
            message.reply('❌ Failed to change bot username. Remember, username can only be changed 2 times per hour!');
        }
    }
};
