const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'celebrate', description: 'Celebrate' },
  async execute(message, args) {
    message.reply({ embeds: [new EmbedBuilder().setTitle('🎉 Celebrate').setDescription(`Let's celebrate! Party time! 🎊🎉`).setColor('#FF00FF')] });
  }
};
