const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'work', description: 'Work for money' },
  async execute(message, args) {
    const earn = Math.floor(Math.random() * 200) + 100;
    message.reply({ embeds: [new EmbedBuilder().setTitle('💼 Work').setDescription(`You earned **${earn}** coins!`).setColor('#5865F2')] });
  }
};
