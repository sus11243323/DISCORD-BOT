const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: {
        name: 'maintenance',
        description: 'Włącza lub wyłącza tryb konserwacji bota'
    },

    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ Ta komenda jest tylko dla administratorów.');
        }

        const mode = args[0];
        if (!mode || !['on', 'off'].includes(mode)) {
            return message.reply('❌ Usage: !maintenance on/off');
        }

        if (mode === 'on') {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('🛠️ TRYB KONSERWACJI')
                .setDescription(
                    '**BOT JEST W TRYBIE KONSERWACJI**\n' +
                    'Nie będziesz mógł używać komend.\n\n' +
                    'Bot zostanie tymczasowo wyłączony.'
                )
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });

            setTimeout(() => {
                process.exit(0);
            }, 2000);
        }

        if (mode === 'off') {
            const embed = new EmbedBuilder()
                .setColor('#00ff88')
                .setTitle('✅ KONIEC KONSERWACJI')
                .setDescription('Bot działa normalnie.')
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        }
    }
};
