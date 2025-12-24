const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: {
        name: 'slowmode',
        description: 'Set slowmode for a channel'
    },
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return message.reply('❌ You need the Manage Channels permission to use this command!');
        }

        const duration = args[0];
        const channel = message.mentions.channels.first() || message.channel;

        if (!duration) {
            return message.reply('❌ Usage: `!slowmode <seconds/off> [#channel]`\nExample: `!slowmode 10` or `!slowmode off`');
        }

        let seconds;
        if (duration.toLowerCase() === 'off' || duration === '0') {
            seconds = 0;
        } else {
            seconds = parseInt(duration);
            if (isNaN(seconds) || seconds < 0 || seconds > 21600) {
                return message.reply('❌ Slowmode must be between 0 and 21600 seconds (6 hours)!');
            }
        }

        try {
            await channel.setRateLimitPerUser(seconds);
            
            if (seconds === 0) {
                message.reply(`⚡ Slowmode has been disabled in ${channel}!`);
            } else {
                message.reply(`🐌 Slowmode set to **${seconds} seconds** in ${channel}!`);
            }
        } catch (error) {
            console.error(error);
            message.reply('❌ Failed to set slowmode. Check bot permissions!');
        }
    }
};
