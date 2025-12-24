const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'birthday', description: 'Celebrate a birthday' },
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    message.reply({ embeds: [new EmbedBuilder().setTitle('🎂 Birthday').setDescription(`Happy Birthday **${user.username}**! 🎉🎂🎁`).setColor('#FF00FF')] });
  }
};
