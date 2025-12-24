const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'praise', description: 'Praise someone' },
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    message.reply({ embeds: [new EmbedBuilder().setTitle('🌟 Praise').setDescription(`All hail **${user.username}**! 🌟`).setColor('#FFD700')] });
  }
};
