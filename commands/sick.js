const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'sick', description: 'Be sick' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('🤒 Sick').setDescription(`**${message.author.username}** is sick! Get well soon! 🏥`).setColor('#FF0000')] });
  }
};
