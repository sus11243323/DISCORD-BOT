const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'unmute',
        description: 'Unmute a user (remove timeout)'
    },
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.reply('❌ You need the Moderate Members permission to use this command!');
        }

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!member) {
            return message.reply('❌ Usage: `!unmute @user`');
        }

        if (!member.isCommunicationDisabled()) {
            return message.reply('❌ This user is not muted!');
        }

        try {
            await member.timeout(null, `Unmuted by ${message.author.tag}`);

            const embed = new EmbedBuilder()
                .setTitle('🔊 User Unmuted')
                .setColor('#00FF00')
                .addFields(
                    { name: 'User', value: `${member.user.tag}`, inline: true },
                    { name: 'Unmuted By', value: message.author.tag, inline: true }
                )
                .setTimestamp();

            message.reply({ embeds: [embed] });

            try {
                await member.send(`🔊 You have been unmuted in **${message.guild.name}**`);
            } catch (e) {}
        } catch (error) {
            console.error(error);
            message.reply('❌ Failed to unmute the user. Check bot permissions!');
        }
    }
};
