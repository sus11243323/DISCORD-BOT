const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'dance', description: 'Dance!' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('💃 Dance').setDescription(`**${message.author.username}** is dancing! 🎉`).setColor('#FF00FF')] });
  }
};
