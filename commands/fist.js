const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'fist', description: 'Fist bump someone' },
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Mention someone!');
    message.reply({ embeds: [new EmbedBuilder().setTitle('👊 Fist Bump').setDescription(`**${message.author.username}** fist bumped **${user.username}**!`).setColor('#FF6B6B')] });
  }
};
