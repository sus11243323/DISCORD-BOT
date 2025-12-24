const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'membercount',
        description: 'Display server member statistics'
    },
    async execute(message, args) {
        const guild = message.guild;
        
        await guild.members.fetch();
        
        const totalMembers = guild.memberCount;
        const humans = guild.members.cache.filter(m => !m.user.bot).size;
        const bots = guild.members.cache.filter(m => m.user.bot).size;
        const online = guild.members.cache.filter(m => m.presence?.status === 'online').size;
        const idle = guild.members.cache.filter(m => m.presence?.status === 'idle').size;
        const dnd = guild.members.cache.filter(m => m.presence?.status === 'dnd').size;
        const offline = guild.members.cache.filter(m => !m.presence || m.presence.status === 'offline').size;

        const embed = new EmbedBuilder()
            .setTitle(`👥 ${guild.name} Member Stats`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setColor('#5865F2')
            .addFields(
                { name: '📊 Total', value: `**${totalMembers}** members`, inline: false },
                { name: '👤 Humans', value: `${humans}`, inline: true },
                { name: '🤖 Bots', value: `${bots}`, inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: '🟢 Online', value: `${online}`, inline: true },
                { name: '🟡 Idle', value: `${idle}`, inline: true },
                { name: '🔴 DND', value: `${dnd}`, inline: true },
                { name: '⚫ Offline', value: `${offline}`, inline: true }
            )
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
