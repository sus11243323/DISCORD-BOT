const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'glow', description: 'Glow with happiness' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('🌟 Glow').setDescription(`**${message.author.username}** is glowing! 🌟`).setColor('#FFD700')] });
  }
};
