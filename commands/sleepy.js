const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'sleepy', description: 'Be sleepy' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('😪 Sleepy').setDescription(`**${message.author.username}** is sleepy... 😪`).setColor('#808080')] });
  }
};
