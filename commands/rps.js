const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'rps',
        description: 'Play Rock Paper Scissors'
    },
    async execute(message, args) {
        const choices = ['rock', 'paper', 'scissors'];
        const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
        
        const userChoice = args[0]?.toLowerCase();
        
        if (!userChoice || !choices.includes(userChoice)) {
            return message.reply('❌ Usage: `!rps <rock/paper/scissors>`');
        }

        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        let result;
        let color;
        
        if (userChoice === botChoice) {
            result = "It's a tie! 🤝";
            color = '#FFA500';
        } else if (
            (userChoice === 'rock' && botChoice === 'scissors') ||
            (userChoice === 'paper' && botChoice === 'rock') ||
            (userChoice === 'scissors' && botChoice === 'paper')
        ) {
            result = 'You win! 🎉';
            color = '#00FF00';
        } else {
            result = 'You lose! 😢';
            color = '#FF0000';
        }

        const embed = new EmbedBuilder()
            .setTitle('🎮 Rock Paper Scissors')
            .setColor(color)
            .addFields(
                { name: 'Your Choice', value: `${emojis[userChoice]} ${userChoice}`, inline: true },
                { name: 'Bot Choice', value: `${emojis[botChoice]} ${botChoice}`, inline: true },
                { name: 'Result', value: result, inline: false }
            )
            .setFooter({ text: `Played by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
