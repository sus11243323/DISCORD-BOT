const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'hate', description: 'Playful hate' },
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    message.reply({ embeds: [new EmbedBuilder().setTitle('😈 Hate').setDescription(`**${message.author.username}** playfully hates **${user.username}**! 😈`).setColor('#FF0000')] });
  }
};
