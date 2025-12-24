const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'blame', description: 'Blame someone' },
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    message.reply({ embeds: [new EmbedBuilder().setTitle('👉 Blame').setDescription(`It's **${user.username}**'s fault! 👉`).setColor('#FF0000')] });
  }
};
