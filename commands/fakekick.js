const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'fakekick',
        description: 'Udaje wyrzucenie użytkownika (FAKE)'
    },

    async execute(message, args) {
        const user = message.mentions.users.first();
        if (!user) return message.reply('❌ Usage: !fakekick @user');

        const embed = new EmbedBuilder()
            .setColor('#ffaa00')
            .setTitle('👢 SYSTEM')
            .setDescription(
                `Użytkownik **${user.tag}** został wyrzucony z serwera.`
            )
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });

        setTimeout(() => {
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#00ff88')
                        .setTitle('😄 SPOKOJNIE')
                        .setDescription('To był **fake kick**.')
                        .setTimestamp()
                ]
            });
        }, 2000);
    }
};
