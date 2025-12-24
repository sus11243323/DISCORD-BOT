const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'fakeban',
        description: 'Udaje bana użytkownika (FAKE)'
    },

    async execute(message, args) {
        const user = message.mentions.users.first();
        if (!user) return message.reply('❌ Usage: !fakeban @user');

        const embed = new EmbedBuilder()
            .setColor('#ff4444')
            .setTitle('🔨 SYSTEM BANÓW')
            .setDescription(
                `Użytkownik **${user.tag}** został zbanowany.\n\n` +
                'Powód: naruszenie zasad 😈'
            )
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });

        setTimeout(() => {
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#00ff88')
                        .setTitle('😏 ŻART')
                        .setDescription('To był **fałszywy ban**.')
                        .setTimestamp()
                ]
            });
        }, 2000);
    }
};
