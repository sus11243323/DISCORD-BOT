const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'softban',
        description: 'Ban and immediately unban a user to delete their messages'
    },
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.reply('❌ You need the Ban Members permission to use this command!');
        }

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args.slice(1).join(' ') || 'Softban - Message cleanup';

        if (!member) {
            return message.reply('❌ Usage: `!softban @user [reason]`');
        }

        if (member.roles.highest.position >= message.member.roles.highest.position) {
            return message.reply('❌ You cannot softban this user due to role hierarchy!');
        }

        if (!member.bannable) {
            return message.reply('❌ I cannot softban this user. Check role hierarchy!');
        }

        try {
            const userId = member.user.id;
            const userTag = member.user.tag;

            await member.ban({ deleteMessageDays: 7, reason: `Softban: ${reason} | By ${message.author.tag}` });
            await message.guild.members.unban(userId, 'Softban complete');

            const embed = new EmbedBuilder()
                .setTitle('🔨 User Softbanned')
                .setDescription('User was banned and unbanned to delete their messages')
                .setColor('#FFA500')
                .addFields(
                    { name: 'User', value: userTag, inline: true },
                    { name: 'Softbanned By', value: message.author.tag, inline: true },
                    { name: 'Messages Deleted', value: '7 days worth', inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('❌ Failed to softban the user. Check bot permissions!');
        }
    }
};
