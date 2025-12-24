const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'coinflip',
        description: 'Flip a coin'
    },
    async execute(message, args) {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        const emoji = result === 'Heads' ? '🪙' : '💰';

        const embed = new EmbedBuilder()
            .setTitle(`${emoji} Coin Flip`)
            .setDescription(`The coin landed on **${result}**!`)
            .setColor(result === 'Heads' ? '#FFD700' : '#C0C0C0')
            .setFooter({ text: `Flipped by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
