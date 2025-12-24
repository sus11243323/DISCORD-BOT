const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'hot', description: 'Be hot' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('🔥 Hot').setDescription(`**${message.author.username}** is hot! Too hot! 🌡️`).setColor('#FF0000')] });
  }
};
