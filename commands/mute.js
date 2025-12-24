const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'mute',
        description: 'Mute a user using timeout (modern Discord mute)'
    },
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.reply('❌ You need the Moderate Members permission to use this command!');
        }

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args.slice(1).join(' ') || 'No reason provided';

        if (!member) {
            return message.reply('❌ Usage: `!mute @user [reason]`');
        }

        if (member.roles.highest.position >= message.member.roles.highest.position) {
            return message.reply('❌ You cannot mute this user due to role hierarchy!');
        }

        if (!member.moderatable) {
            return message.reply('❌ I cannot mute this user. Check role hierarchy!');
        }

        try {
            await member.timeout(28 * 24 * 60 * 60 * 1000, `${reason} | Muted by ${message.author.tag}`);

            const embed = new EmbedBuilder()
                .setTitle('🔇 User Muted')
                .setColor('#FF6B6B')
                .addFields(
                    { name: 'User', value: `${member.user.tag}`, inline: true },
                    { name: 'Muted By', value: message.author.tag, inline: true },
                    { name: 'Duration', value: '28 days (max)', inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            message.reply({ embeds: [embed] });

            try {
                await member.send(`🔇 You have been muted in **${message.guild.name}**\n**Reason:** ${reason}`);
            } catch (e) {}
        } catch (error) {
            console.error(error);
            message.reply('❌ Failed to mute the user. Check bot permissions!');
        }
    }
};
