const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'laugh', description: 'Laugh' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('😂 Laugh').setDescription(`**${message.author.username}** is laughing! Hahaha!`).setColor('#FFD700')] });
  }
};
