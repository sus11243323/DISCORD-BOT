const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'shocked', description: 'Be shocked' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('😱 Shocked').setDescription(`**${message.author.username}** is shocked! Oh no! 😱`).setColor('#FF0000')] });
  }
};
