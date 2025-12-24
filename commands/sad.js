const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'sad', description: 'Express sadness' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('😢 Sad').setDescription(`**${message.author.username}** is feeling sad...`).setColor('#0099FF')] });
  }
};
