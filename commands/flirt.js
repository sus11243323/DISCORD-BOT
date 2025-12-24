const { EmbedBuilder } = require('discord.js');
const flirts = ['Are you a parking ticket? You\'ve got FINE written all over you!', 'Do you believe in love at first sight or should I walk by again?', 'You must be a magician, because whenever I look at you, everyone else disappears.'];
module.exports = {
  data: { name: 'flirt', description: 'Flirt with someone' },
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Mention someone!');
    const flirt = flirts[Math.floor(Math.random() * flirts.length)];
    message.reply({ embeds: [new EmbedBuilder().setTitle('💕 Flirt').setDescription(`**${message.author.username}** flirts: ${flirt}`).setColor('#FF69B4')] });
  }
};
