const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'sarcasm', description: 'Be sarcastic' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('🙄 Sarcasm').setDescription(`**${message.author.username}**: Yeah, sure... 🙄`).setColor('#FFA500')] });
  }
};
