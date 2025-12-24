const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'quickpoll',
        description: 'Create a quick yes/no poll'
    },
    async execute(message, args) {
        const question = args.join(' ');

        if (!question) {
            return message.reply('❌ Usage: `!quickpoll <question>`');
        }

        const embed = new EmbedBuilder()
            .setTitle('📊 Quick Poll')
            .setDescription(question)
            .setColor('#5865F2')
            .setFooter({ text: `Poll by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        const pollMessage = await message.channel.send({ embeds: [embed] });
        await pollMessage.react('✅');
        await pollMessage.react('❌');

        message.delete().catch(() => {});
    }
};
