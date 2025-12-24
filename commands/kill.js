const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'kill', description: 'Roleplay kill' },
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    message.reply({ embeds: [new EmbedBuilder().setTitle('⚔️ Battle').setDescription(`**${message.author.username}** defeated **${user.username}**!`).setColor('#FF0000')] });
  }
};
