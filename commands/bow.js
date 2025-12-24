const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'bow', description: 'Bow to someone' },
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    message.reply({ embeds: [new EmbedBuilder().setTitle('🙇 Bow').setDescription(`**${message.author.username}** bowed to **${user.username}**! 🙇`).setColor('#FFD700')] });
  }
};
