const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'daily', description: 'Get daily reward' },
  async execute(message, args) {
    const reward = Math.floor(Math.random() * 100) + 50;
    message.reply({ embeds: [new EmbedBuilder().setTitle('🎁 Daily Reward').setDescription(`You earned **${reward}** coins!`).setColor('#FFD700')] });
  }
};
