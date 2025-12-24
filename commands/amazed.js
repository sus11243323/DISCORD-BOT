const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'amazed', description: 'Be amazed' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('😲 Amazed').setDescription(`**${message.author.username}** is amazed! Wow! 🤩`).setColor('#FFD700')] });
  }
};
