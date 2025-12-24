const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'hype', description: 'Get hyped!' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('🔥 Hype').setDescription(`**${message.author.username}** is hyped! Let's gooooo! 🎉`).setColor('#FF00FF')] });
  }
};
