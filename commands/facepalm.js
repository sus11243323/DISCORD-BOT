const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'facepalm', description: 'Facepalm' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('🤦 Facepalm').setDescription(`**${message.author.username}** facepalmed... 🤦`).setColor('#FF6B6B')] });
  }
};
