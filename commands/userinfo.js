const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'userinfo',
        description: 'Display information about a user'
    },
    async execute(message, args) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        
        const roles = member.roles.cache
            .filter(role => role.id !== message.guild.id)
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, 10);

        const embed = new EmbedBuilder()
            .setTitle(`👤 User Information - ${member.user.tag}`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setColor(member.displayHexColor || '#5865F2')
            .addFields(
                { name: '🆔 User ID', value: member.id, inline: true },
                { name: '📛 Nickname', value: member.nickname || 'None', inline: true },
                { name: '🤖 Bot', value: member.user.bot ? 'Yes' : 'No', inline: true },
                { name: '📅 Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: '📥 Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: '🎭 Roles', value: roles.length ? roles.join(', ') : 'None', inline: false }
            )
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
