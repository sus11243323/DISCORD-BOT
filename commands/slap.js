const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'slap', description: 'Slap someone' },
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    message.reply({ embeds: [new EmbedBuilder().setTitle('👋 Slap').setDescription(`**${message.author.username}** slapped **${user.username}**!`).setColor('#FF6B6B')] });
  }
};
