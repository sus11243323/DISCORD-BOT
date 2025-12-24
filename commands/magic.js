const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'magic', description: 'Cast magic' },
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    message.reply({ embeds: [new EmbedBuilder().setTitle('✨ Magic').setDescription(`**${message.author.username}** cast magic on **${user.username}**! ✨`).setColor('#9B59B6')] });
  }
};
