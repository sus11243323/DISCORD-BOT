const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'angry', description: 'Express anger' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('😡 Angry').setDescription(`**${message.author.username}** is angry! 😠`).setColor('#FF0000')] });
  }
};
