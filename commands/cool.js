const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'cool', description: 'Be cool' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('😎 Cool').setDescription(`**${message.author.username}** is cool! 😎`).setColor('#5865F2')] });
  }
};
