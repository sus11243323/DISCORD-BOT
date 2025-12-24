const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'banner',
        description: 'Get a user\'s banner'
    },
    async execute(message, args) {
        const user = message.mentions.users.first() || message.author;

        try {
            const fetchedUser = await user.fetch();
            const banner = fetchedUser.bannerURL({ dynamic: true, size: 1024 });

            if (!banner) {
                return message.reply(`❌ **${user.tag}** doesn't have a banner!`);
            }

            const embed = new EmbedBuilder()
                .setTitle(`🎨 ${user.tag}'s Banner`)
                .setColor('#5865F2')
                .setImage(banner)
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('❌ Failed to fetch user banner!');
        }
    }
};
