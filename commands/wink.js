const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'wink', description: 'Wink at someone' },
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    message.reply({ embeds: [new EmbedBuilder().setTitle('😉 Wink').setDescription(`**${message.author.username}** winked at **${user.username}**! 😉`).setColor('#FF69B4')] });
  }
};
