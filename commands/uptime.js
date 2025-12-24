const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'uptime',
        description: 'Check bot uptime'
    },
    async execute(message, args) {
        const uptime = process.uptime();
        
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        let uptimeString = '';
        if (days > 0) uptimeString += `${days}d `;
        if (hours > 0) uptimeString += `${hours}h `;
        if (minutes > 0) uptimeString += `${minutes}m `;
        uptimeString += `${seconds}s`;

        const embed = new EmbedBuilder()
            .setTitle('⏱️ Bot Uptime')
            .setColor('#5865F2')
            .addFields(
                { name: 'Uptime', value: uptimeString.trim(), inline: true },
                { name: 'Started', value: `<t:${Math.floor(Date.now() / 1000 - uptime)}:R>`, inline: true }
            )
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
