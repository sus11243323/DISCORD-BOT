const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'dice',
        description: 'Roll a dice'
    },
    async execute(message, args) {
        const sides = parseInt(args[0]) || 6;
        
        if (sides < 2 || sides > 100) {
            return message.reply('❌ Dice must have between 2 and 100 sides!');
        }

        const result = Math.floor(Math.random() * sides) + 1;
        const diceEmoji = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

        const embed = new EmbedBuilder()
            .setTitle('🎲 Dice Roll')
            .setDescription(`You rolled a **${result}** on a ${sides}-sided dice!`)
            .setColor('#FF6B6B')
            .setFooter({ text: `Rolled by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        if (sides === 6) {
            embed.setDescription(`${diceEmoji[result - 1]} You rolled a **${result}**!`);
        }

        message.reply({ embeds: [embed] });
    }
};
