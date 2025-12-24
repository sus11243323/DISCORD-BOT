const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'handshake', description: 'Handshake' },
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Mention someone!');
    message.reply({ embeds: [new EmbedBuilder().setTitle('🤝 Handshake').setDescription(`**${message.author.username}** shook hands with **${user.username}**!`).setColor('#5865F2')] });
  }
};
