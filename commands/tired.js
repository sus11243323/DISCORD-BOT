const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'tired', description: 'Be tired' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('😴 Tired').setDescription(`**${message.author.username}** is tired... 😴`).setColor('#808080')] });
  }
};
