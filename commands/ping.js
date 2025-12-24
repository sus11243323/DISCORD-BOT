const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'ping',
        description: 'Check bot latency'
    },
    async execute(message, args) {
        const sent = await message.reply('🏓 Pinging...');
        const latency = sent.createdTimestamp - message.createdTimestamp;
        const apiLatency = Math.round(message.client.ws.ping);

        let status;
        let color;
        if (latency < 100) {
            status = '🟢 Excellent';
            color = '#00FF00';
        } else if (latency < 200) {
            status = '🟡 Good';
            color = '#FFFF00';
        } else if (latency < 400) {
            status = '🟠 Fair';
            color = '#FFA500';
        } else {
            status = '🔴 Poor';
            color = '#FF0000';
        }

        const embed = new EmbedBuilder()
            .setTitle('🏓 Pong!')
            .setColor(color)
            .addFields(
                { name: 'Bot Latency', value: `${latency}ms`, inline: true },
                { name: 'API Latency', value: `${apiLatency}ms`, inline: true },
                { name: 'Status', value: status, inline: true }
            )
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        sent.edit({ content: null, embeds: [embed] });
    }
};
