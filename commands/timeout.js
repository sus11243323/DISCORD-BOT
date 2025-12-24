const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: {
        name: 'timeout',
        description: 'Timeout a user for a specified duration'
    },
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.reply('❌ You need the Timeout Members permission to use this command!');
        }

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const duration = args[1];
        const reason = args.slice(2).join(' ') || 'No reason provided';

        if (!member || !duration) {
            return message.reply('❌ Usage: `!timeout @user <duration> [reason]`\nExample: `!timeout @user 10m Spamming`\nDurations: s=seconds, m=minutes, h=hours, d=days');
        }

        if (member.roles.highest.position >= message.member.roles.highest.position) {
            return message.reply('❌ You cannot timeout this user due to role hierarchy!');
        }

        const durationMs = parseDuration(duration);
        if (!durationMs) {
            return message.reply('❌ Invalid duration format! Use: 30s, 10m, 2h, or 1d');
        }

        try {
            await member.timeout(durationMs, `${reason} | Timed out by ${message.author.tag}`);
            message.reply(`✅ **${member.user.tag}** has been timed out for **${duration}**\n**Reason:** ${reason}`);
        } catch (error) {
            console.error(error);
            message.reply('❌ Failed to timeout the user. Check bot permissions!');
        }
    }
};

function parseDuration(duration) {
    const regex = /^(\d+)([smhd])$/;
    const match = duration.match(regex);
    
    if (!match) return null;

    const value = parseInt(match[1]);
    const unit = match[2];

    const multipliers = {
        s: 1000,
        m: 60000,
        h: 3600000,
        d: 86400000
    };

    return value * multipliers[unit];
}
