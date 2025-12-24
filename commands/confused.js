const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'confused', description: 'Be confused' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('😕 Confused').setDescription(`**${message.author.username}** is confused... 🤔`).setColor('#FFA500')] });
  }
};
