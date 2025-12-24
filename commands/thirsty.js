const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'thirsty', description: 'Be thirsty' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('🥤 Thirsty').setDescription(`**${message.author.username}** is thirsty! 💧`).setColor('#0099FF')] });
  }
};
