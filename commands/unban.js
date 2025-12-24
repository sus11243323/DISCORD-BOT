const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'unban',
        description: 'Unban a user from the server'
    },
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.reply('❌ You need the Ban Members permission to use this command!');
        }

        const userId = args[0];
        const reason = args.slice(1).join(' ') || 'No reason provided';

        if (!userId) {
            return message.reply('❌ Usage: `!unban <user ID> [reason]`\nExample: `!unban 123456789012345678 Appeal accepted`');
        }

        try {
            const banList = await message.guild.bans.fetch();
            const bannedUser = banList.find(ban => ban.user.id === userId);

            if (!bannedUser) {
                return message.reply('❌ This user is not banned from this server!');
            }

            await message.guild.members.unban(userId, `${reason} | Unbanned by ${message.author.tag}`);

            const embed = new EmbedBuilder()
                .setTitle('🔓 User Unbanned')
                .setColor('#00FF00')
                .addFields(
                    { name: 'User', value: `${bannedUser.user.tag}`, inline: true },
                    { name: 'User ID', value: userId, inline: true },
                    { name: 'Unbanned By', value: message.author.tag, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('❌ Failed to unban the user. Make sure the ID is correct!');
        }
    }
};
