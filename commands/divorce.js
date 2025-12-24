const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'divorce', description: 'Divorce someone' },
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Mention someone!');
    message.reply({ embeds: [new EmbedBuilder().setTitle('💔 Divorced').setDescription(`**${message.author.username}** divorced **${user.username}**! Oh no! 💔`).setColor('#FF0000')] });
  }
};
