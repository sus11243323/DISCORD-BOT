const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'scared', description: 'Be scared' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('👻 Scared').setDescription(`**${message.author.username}** is scared! Boo! 👻`).setColor('#000000')] });
  }
};
