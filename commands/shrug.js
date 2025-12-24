const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'shrug', description: 'Shrug' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('🤷 Shrug').setDescription(`**${message.author.username}**: ¯\\_(ツ)_/¯`).setColor('#5865F2')] });
  }
};
