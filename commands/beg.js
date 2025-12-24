const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'beg', description: 'Beg for coins' },
  async execute(message, args) {
    const coins = Math.floor(Math.random() * 50);
    message.reply({ embeds: [new EmbedBuilder().setTitle('🙏 Beg').setDescription(`You begged and got **${coins}** coins!`).setColor('#5865F2')] });
  }
};
