const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'flip', description: 'Flip a coin' },
  async execute(message, args) {
    const result = Math.random() > 0.5 ? 'Heads' : 'Tails';
    message.reply({ embeds: [new EmbedBuilder().setTitle('🪙 Coin Flip').setDescription(result).setColor('#5865F2')] });
  }
};
