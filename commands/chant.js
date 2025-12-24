const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'chant', description: 'Start a chant' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('📢 Chant').setDescription(`**${message.author.username}** started a chant! USA! USA! USA!`).setColor('#0099FF')] });
  }
};
