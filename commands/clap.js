const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'clap', description: 'Clap for someone' },
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    message.reply({ embeds: [new EmbedBuilder().setTitle('👏 Clap').setDescription(`Clapping for **${user.username}**! 👏👏👏`).setColor('#FFD700')] });
  }
};
