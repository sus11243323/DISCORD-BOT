const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'hungry', description: 'Be hungry' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('😋 Hungry').setDescription(`**${message.author.username}** is hungry! 🍕`).setColor('#FF6B6B')] });
  }
};
