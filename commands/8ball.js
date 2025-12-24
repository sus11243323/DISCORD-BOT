const { EmbedBuilder } = require('discord.js');
const responses = ['Yes', 'No', 'Maybe', 'Absolutely', 'Never', 'Ask again later', 'My sources say no', 'Outlook good', 'Don\'t count on it'];
module.exports = {
  data: { name: '8ball', description: 'Magic 8 ball' },
  async execute(message, args) {
    const res = responses[Math.floor(Math.random() * responses.length)];
    message.reply({ embeds: [new EmbedBuilder().setTitle('🎱 Magic 8 Ball').setDescription(res).setColor('#5865F2')] });
  }
};
