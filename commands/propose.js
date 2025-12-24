const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'propose', description: 'Propose to someone' },
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Mention someone!');
    message.reply({ embeds: [new EmbedBuilder().setTitle('💍 Proposal').setDescription(`**${message.author.username}** proposed to **${user.username}**! Will you marry them? 💍`).setColor('#FF69B4')] });
  }
};
