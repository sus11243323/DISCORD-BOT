const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const util = require('util');

module.exports = {
    data: {
        name: 'eval',
        description: 'Wykonuje kod JavaScript (ADMIN)'
    },

    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ Ta komenda jest tylko dla administratorów.');
        }

        const code = args.join(' ');
        if (!code) return message.reply('❌ Usage: !eval <kod>');

        try {
            let result = eval(code);
            if (typeof result !== 'string') {
                result = util.inspect(result, { depth: 1 });
            }

            const embed = new EmbedBuilder()
                .setColor('#5865F2')
                .setTitle('🧠 EVAL – WYNIK')
                .addFields(
                    { name: '📥 Kod', value: `\`\`\`js\n${code}\n\`\`\`` },
                    { name: '📤 Wynik', value: `\`\`\`js\n${result}\n\`\`\`` }
                )
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (err) {
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('❌ BŁĄD EVAL')
                        .setDescription(`\`\`\`\n${err.message}\n\`\`\``)
                ]
            });
        }
    }
};
