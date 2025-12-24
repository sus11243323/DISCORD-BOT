const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'poke', description: 'Poke someone' },
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Mention someone!');
    message.reply({ embeds: [new EmbedBuilder().setTitle('👉 Poke').setDescription(`**${message.author.username}** poked **${user.username}**!`).setColor('#5865F2')] });
  }
};
