const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'kiss', description: 'Kiss someone' },
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Mention someone to kiss!');
    message.reply({ embeds: [new EmbedBuilder().setTitle('💋 Kiss').setDescription(`**${message.author.username}** kissed **${user.username}**!`).setColor('#FF69B4')] });
  }
};
