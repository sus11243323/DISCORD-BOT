const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'shine', description: 'Shine bright' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('⭐ Shine').setDescription(`**${message.author.username}** is shining brightly! ⭐`).setColor('#FFD700')] });
  }
};
