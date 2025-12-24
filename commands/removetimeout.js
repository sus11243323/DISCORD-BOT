const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: {
        name: 'removetimeout',
        description: 'Remove a timeout from a user'
    },
    async execute(message, args) {
        // Check if the user has permission
        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.reply('❌ You need the Timeout Members permission to use this command!');
        }

        // Get the member from mention or ID
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args.slice(1).join(' ') || 'No reason provided';

        if (!member) {
            return message.reply('❌ Usage: `!removetimeout @user [reason]`');
        }

        if (member.roles.highest.position >= message.member.roles.highest.position) {
            return message.reply('❌ You cannot remove the timeout from this user due to role hierarchy!');
        }

        try {
            // Remove the timeout (set it to null)
            await member.timeout(null, `${reason} | Timeout removed by ${message.author.tag}`);
            message.reply(`✅ Timeout removed from **${member.user.tag}**\n**Reason:** ${reason}`);
        } catch (error) {
            console.error(error);
            message.reply('❌ Failed to remove timeout. Make sure I have permission to Moderate Members!');
        }
    }
};
