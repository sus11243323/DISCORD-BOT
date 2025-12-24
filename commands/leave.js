module.exports = {
    data: {
        name: 'leave',
        description: 'Makes the bot leave the server'
    },
    async execute(message, args) {
        const OWNER_ID = '1057830290749390902';

        // ONLY owner check (NO permissions needed)
        if (message.author.id !== OWNER_ID) {
            return message.reply('❌ You are not allowed to use this command.');
        }

        try {
            await message.reply('👋 Leaving this server...');
            await message.guild.leave();
        } catch (error) {
            console.error(error);
            message.reply('❌ Failed to leave the server.');
        }
    }
};
