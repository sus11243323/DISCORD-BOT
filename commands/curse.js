const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'curse', description: 'Curse someone (playful)' },
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    message.reply({ embeds: [new EmbedBuilder().setTitle('🔮 Curse').setDescription(`**${message.author.username}** cursed **${user.username}**! 🔮`).setColor('#000000')] });
  }
};
