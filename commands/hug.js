const { EmbedBuilder } = require('discord.js');

const hugGifs = [
    'https://media.giphy.com/media/od5H3PmEG5EVq/giphy.gif',
    'https://media.giphy.com/media/ZQN9jsRWp1M76/giphy.gif',
    'https://media.giphy.com/media/lrr9rHuoJOE0w/giphy.gif',
    'https://media.giphy.com/media/3oEdv4hwWTzBhWvaU0/giphy.gif',
    'https://media.giphy.com/media/PHZ7v9tfQu0o0/giphy.gif',
    'https://media.giphy.com/media/l2QDM9Jnim1YVILXa/giphy.gif',
    'https://media.giphy.com/media/svXXBgduBsJ1u/giphy.gif',
    'https://media.giphy.com/media/wnsgren9NtITS/giphy.gif'
];

module.exports = {
    data: {
        name: 'hug',
        description: 'Give someone a hug'
    },
    async execute(message, args) {
        const target = message.mentions.users.first();

        if (!target) {
            return message.reply('❌ Usage: `!hug @user`');
        }

        if (target.id === message.author.id) {
            return message.reply('🤗 *hugs yourself* Self-love is important!');
        }

        const gif = hugGifs[Math.floor(Math.random() * hugGifs.length)];

        const embed = new EmbedBuilder()
            .setTitle('🤗 Hug!')
            .setDescription(`**${message.author.username}** gives **${target.username}** a warm hug!`)
            .setColor('#FF69B4')
            .setImage(gif)
            .setFooter({ text: 'Spread the love!', iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
