const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'apologize', description: 'Apologize to someone' },
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Mention someone!');
    message.reply({ embeds: [new EmbedBuilder().setTitle('😔 Apology').setDescription(`**${message.author.username}** apologized to **${user.username}**. Sorry! 😔`).setColor('#0099FF')] });
  }
};
