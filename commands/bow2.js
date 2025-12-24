const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'respect', description: 'Show respect' },
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    message.reply({ embeds: [new EmbedBuilder().setTitle('🙏 Respect').setDescription(`**${message.author.username}** respects **${user.username}**! 🙏`).setColor('#FFD700')] });
  }
};
