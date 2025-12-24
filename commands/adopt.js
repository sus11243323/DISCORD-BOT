const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'adopt', description: 'Adopt someone' },
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    message.reply({ embeds: [new EmbedBuilder().setTitle('👶 Adopt').setDescription(`**${message.author.username}** adopted **${user.username}**! Welcome to the family! 👶`).setColor('#FF69B4')] });
  }
};
