const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'gamble', description: 'Gamble coins' },
  async execute(message, args) {
    const win = Math.random() > 0.5;
    const amount = Math.floor(Math.random() * 100) + 50;
    const result = win ? `Won **${amount}** coins! 🎉` : `Lost **${amount}** coins! 😢`;
    message.reply({ embeds: [new EmbedBuilder().setTitle('🎰 Gamble').setDescription(result).setColor(win ? '#00FF00' : '#FF0000')] });
  }
};
