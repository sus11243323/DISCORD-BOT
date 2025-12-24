const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'smile', description: 'Smile' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('😊 Smile').setDescription(`**${message.author.username}** is smiling!`).setColor('#FFD700')] });
  }
};
