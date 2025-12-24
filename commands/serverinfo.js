 const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'serverinfo',
        description: 'Display server information and statistics'
    },
    async execute(message, args) {
        const guild = message.guild;
        
        const embed = new EmbedBuilder()
            .setTitle(`📊 ${guild.name} Server Information`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setColor('#5865F2')
            .addFields(
                { name: '👑 Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: '🆔 Server ID', value: guild.id, inline: true },
                { name: '📅 Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
                { name: '👥 Members', value: `${guild.memberCount}`, inline: true },
                { name: '💬 Channels', value: `${guild.channels.cache.size}`, inline: true },
                { name: '🎭 Roles', value: `${guild.roles.cache.size}`, inline: true },
                { name: '😊 Emojis', value: `${guild.emojis.cache.size}`, inline: true },
                { name: '🔒 Verification Level', value: guild.verificationLevel.toString(), inline: true },
                { name: '📈 Boost Level', value: `Level ${guild.premiumTier}`, inline: true }
            )
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
