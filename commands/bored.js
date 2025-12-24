const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'bored', description: 'Be bored' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('😑 Bored').setDescription(`**${message.author.username}** is bored... 😑`).setColor('#808080')] });
  }
};
