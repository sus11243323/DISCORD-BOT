const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'love', description: 'Show love' },
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    message.reply({ embeds: [new EmbedBuilder().setTitle('❤️ Love').setDescription(`**${message.author.username}** loves **${user.username}**! ❤️`).setColor('#FF0000')] });
  }
};
