const { EmbedBuilder } = require('discord.js');
const insults = ['You silly goose!', 'You\'re a bit much!', 'C\'mon now!', 'Really?', 'Oh please!'];
module.exports = {
  data: { name: 'insult', description: 'Playful insult' },
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    const insult = insults[Math.floor(Math.random() * insults.length)];
    message.reply({ embeds: [new EmbedBuilder().setTitle('😜 Roast').setDescription(`**${message.author.username}** to **${user.username}**: ${insult}`).setColor('#FF6B6B')] });
  }
};
