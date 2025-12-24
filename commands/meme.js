const { EmbedBuilder } = require('discord.js');

const memeGifs = [
    'https://media.giphy.com/media/l0HlDtg9x8FZo0XO0/giphy.gif',
    'https://media.giphy.com/media/XRB1uf2F9bGMw/giphy.gif',
    'https://media.giphy.com/media/9eLvjZf05kNOw/giphy.gif',
    'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
    'https://media.giphy.com/media/g9GzsKzGQciP6/giphy.gif',
    'https://media.giphy.com/media/5VKbvrjYswpokB3KxN/giphy.gif',
    'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
    'https://media.giphy.com/media/3o6ZtpWzPAePtMOUPC/giphy.gif',
    'https://media.giphy.com/media/yoJC2GnSClbPODnt5i/giphy.gif',
    'https://media.giphy.com/media/10ECejNAspJUPm/giphy.gif',
    'https://media.giphy.com/media/l0HlQaQ6ACVd33yorK/giphy.gif',
    'https://media.giphy.com/media/11sBLVxNZZ21G4/giphy.gif',
    'https://media.giphy.com/media/l0IypeKl9NJhFXjiM/giphy.gif',
    'https://media.giphy.com/media/l0HlNaQ9Ncrhf7pDm/giphy.gif',
    'https://media.giphy.com/media/xTiTnIHHVwFI0wDylq/giphy.gif'
];

module.exports = {
    data: {
        name: 'meme',
        description: 'Send a random meme GIF'
    },
    async execute(message, args) {
        const gif = memeGifs[Math.floor(Math.random() * memeGifs.length)];

        const embed = new EmbedBuilder()
            .setTitle('😂 Random Meme')
            .setDescription('Here\'s a random meme to brighten your day!')
            .setImage(gif)
            .setColor('#5865F2')
            .setFooter({
                text: `Requested by ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL()
            })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
