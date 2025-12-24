const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'avatar',
        description: 'Get a user\'s avatar'
    },
    async execute(message, args) {
        const user = message.mentions.users.first() || message.author;

        const embed = new EmbedBuilder()
            .setTitle(`🖼️ ${user.tag}'s Avatar`)
            .setColor('#5865F2')
            .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: 'PNG', value: `[Link](${user.displayAvatarURL({ format: 'png', size: 1024 })})`, inline: true },
                { name: 'JPG', value: `[Link](${user.displayAvatarURL({ format: 'jpg', size: 1024 })})`, inline: true },
                { name: 'WEBP', value: `[Link](${user.displayAvatarURL({ format: 'webp', size: 1024 })})`, inline: true }
            )
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
