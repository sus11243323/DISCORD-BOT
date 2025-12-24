const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'highfive', description: 'High five someone' },
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Mention someone!');
    message.reply({ embeds: [new EmbedBuilder().setTitle('🙌 High Five').setDescription(`**${message.author.username}** and **${user.username}** high fived!`).setColor('#FFD700')] });
  }
};
