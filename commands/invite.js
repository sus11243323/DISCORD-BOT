const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: {
        name: 'invite',
        description: 'Get the bot invite link'
    },
    async execute(message, args) {
        const clientId = message.client.user.id;
        const permissions = PermissionFlagsBits.Administrator;
        
        const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=bot`;

        const embed = new EmbedBuilder()
            .setTitle('🔗 Invite Me!')
            .setDescription(`Click the link below to add me to your server!`)
            .setColor('#5865F2')
            .addFields(
                { name: 'Invite Link', value: `[Click Here](${inviteUrl})`, inline: false },
                { name: 'Support', value: 'Need help? Contact the bot owner!', inline: false }
            )
            .setThumbnail(message.client.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
