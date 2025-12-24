const { EmbedBuilder, version } = require('discord.js');

module.exports = {
    data: {
        name: 'botinfo',
        description: 'Display bot information'
    },
    async execute(message, args) {
        const client = message.client;
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

        const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        const totalChannels = client.channels.cache.size;
        const memUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

        const embed = new EmbedBuilder()
            .setTitle(`🤖 ${client.user.username} Info`)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 256 }))
            .setColor('#5865F2')
            .addFields(
                { name: '📊 Stats', value: 
                    `**Servers:** ${client.guilds.cache.size}\n` +
                    `**Users:** ${totalMembers.toLocaleString()}\n` +
                    `**Channels:** ${totalChannels}`, inline: true },
                { name: '⚙️ System', value:
                    `**Node.js:** ${process.version}\n` +
                    `**Discord.js:** v${version}\n` +
                    `**Memory:** ${memUsage} MB`, inline: true },
                { name: '⏱️ Uptime', value: uptimeString, inline: true },
                { name: '📝 Commands', value: `${client.commands.size} commands loaded`, inline: true },
                { name: '🏓 Ping', value: `${client.ws.ping}ms`, inline: true },
                { name: '📅 Created', value: `<t:${Math.floor(client.user.createdTimestamp / 1000)}:D>`, inline: true }
            )
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
