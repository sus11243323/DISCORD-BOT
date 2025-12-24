const { EmbedBuilder } = require('discord.js');
const compliments = ['You\'re awesome!', 'You\'re amazing!', 'Great job!', 'You rock!', 'You\'re the best!'];
module.exports = {
  data: { name: 'compliment', description: 'Compliment someone' },
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    const comp = compliments[Math.floor(Math.random() * compliments.length)];
    message.reply({ embeds: [new EmbedBuilder().setTitle('💬 Compliment').setDescription(`**${message.author.username}** says to **${user.username}**: ${comp}`).setColor('#FF69B4')] });
  }
};
