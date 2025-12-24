const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'cry', description: 'Cry' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('😭 Cry').setDescription(`**${message.author.username}** is crying...`).setColor('#0099FF')] });
  }
};
