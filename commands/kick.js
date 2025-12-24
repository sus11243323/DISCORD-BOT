const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: {
        name: 'kick',
        description: 'Kick a user from the server'
    },
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return message.reply('❌ You need the Kick Members permission to use this command!');
        }

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args.slice(1).join(' ') || 'No reason provided';

        if (!member) {
            return message.reply('❌ Usage: `!kick @user [reason]`');
        }

        if (member.roles.highest.position >= message.member.roles.highest.position) {
            return message.reply('❌ You cannot kick this user due to role hierarchy!');
        }

        if (!member.kickable) {
            return message.reply('❌ I cannot kick this user. Check role hierarchy and permissions!');
        }

        try {
            await member.kick(`${reason} | Kicked by ${message.author.tag}`);
            message.reply(`✅ Successfully kicked **${member.user.tag}**\n**Reason:** ${reason}`);
        } catch (error) {
            console.error(error);
            message.reply('❌ Failed to kick the user. Check bot permissions!');
        }
    }
};
