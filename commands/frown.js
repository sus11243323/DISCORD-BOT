const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'frown', description: 'Frown' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('😔 Frown').setDescription(`**${message.author.username}** is frowning...`).setColor('#808080')] });
  }
};
