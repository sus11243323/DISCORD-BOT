const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'cold', description: 'Be cold' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('🥶 Cold').setDescription(`**${message.author.username}** is cold! Brrr! ❄️`).setColor('#0099FF')] });
  }
};
