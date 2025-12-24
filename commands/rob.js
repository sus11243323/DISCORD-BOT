const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'rob', description: 'Rob a bank' },
  async execute(message, args) {
    const success = Math.random() > 0.7;
    const msg = success ? `Robbed the bank! Got **${Math.floor(Math.random() * 500)}** coins!` : 'You got caught!';
    message.reply({ embeds: [new EmbedBuilder().setTitle('🏦 Rob Bank').setDescription(msg).setColor(success ? '#00FF00' : '#FF0000')] });
  }
};
