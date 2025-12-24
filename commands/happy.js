const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'happy', description: 'Express happiness' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('😊 Happy').setDescription(`**${message.author.username}** is happy! 😄`).setColor('#FFD700')] });
  }
};
