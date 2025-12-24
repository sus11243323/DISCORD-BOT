const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'tickle', description: 'Tickle someone' },
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Mention someone!');
    message.reply({ embeds: [new EmbedBuilder().setTitle('😄 Tickle').setDescription(`**${message.author.username}** tickled **${user.username}**!`).setColor('#FFD700')] });
  }
};
