const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'marry', description: 'Marry someone' },
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Mention someone!');
    message.reply({ embeds: [new EmbedBuilder().setTitle('💍 Married').setDescription(`**${message.author.username}** married **${user.username}**! Congratulations! 💍`).setColor('#FF69B4')] });
  }
};
