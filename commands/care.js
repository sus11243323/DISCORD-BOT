const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'care', description: 'Show that you care' },
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    message.reply({ embeds: [new EmbedBuilder().setTitle('💙 Care').setDescription(`**${message.author.username}** cares about **${user.username}**! 💙`).setColor('#0099FF')] });
  }
};
