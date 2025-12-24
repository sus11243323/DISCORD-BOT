const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'heal', description: 'Heal someone' },
  async execute(message, args) {
    const user = message.mentions.users.first();
    message.reply({ embeds: [new EmbedBuilder().setTitle('🏥 Heal').setDescription(`**${message.author.username}** healed **${user?.username || 'themselves'}**! ❤️`).setColor('#00FF00')] });
  }
};
