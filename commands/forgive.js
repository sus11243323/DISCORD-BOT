const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'forgive', description: 'Forgive someone' },
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Mention someone!');
    message.reply({ embeds: [new EmbedBuilder().setTitle('💚 Forgive').setDescription(`**${message.author.username}** forgave **${user.username}**. All is well! 💚`).setColor('#00FF00')] });
  }
};
