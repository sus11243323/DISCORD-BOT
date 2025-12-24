const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'pet', description: 'Pet someone' },
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Mention someone!');
    message.reply({ embeds: [new EmbedBuilder().setTitle('🐾 Pet').setDescription(`**${message.author.username}** petted **${user.username}**!`).setColor('#FF69B4')] });
  }
};
