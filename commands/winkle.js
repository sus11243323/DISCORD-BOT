const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'winkle2', description: 'Sparkle' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('✨ Sparkle').setDescription(`**${message.author.username}** is sparkling! ✨`).setColor('#FF00FF')] });
  }
};
