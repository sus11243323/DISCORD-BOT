const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'wave', description: 'Wave at someone' },
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    message.reply({ embeds: [new EmbedBuilder().setTitle('👋 Wave').setDescription(`**${message.author.username}** waved at **${user.username}**!`).setColor('#5865F2')] });
  }
};
