const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'cheer', description: 'Cheer for someone' },
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    message.reply({ embeds: [new EmbedBuilder().setTitle('📣 Cheer').setDescription(`Cheering for **${user.username}**! 🎉 You got this!`).setColor('#FFD700')] });
  }
};
