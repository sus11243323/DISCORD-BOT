const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'steal', description: 'Try to steal from someone' },
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Mention someone!');
    const success = Math.random() > 0.5;
    const msg = success ? `Stole **${Math.floor(Math.random() * 100)}** coins!` : 'Failed to steal!';
    message.reply({ embeds: [new EmbedBuilder().setTitle('💰 Steal').setDescription(msg).setColor(success ? '#00FF00' : '#FF0000')] });
  }
};
