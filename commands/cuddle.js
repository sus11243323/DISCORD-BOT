const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'cuddle', description: 'Cuddle someone' },
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Mention someone!');
    message.reply({ embeds: [new EmbedBuilder().setTitle('🤗 Cuddle').setDescription(`**${message.author.username}** cuddled **${user.username}**!`).setColor('#FF69B4')] });
  }
};
