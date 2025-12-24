const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'punch', description: 'Punch someone' },
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    message.reply({ embeds: [new EmbedBuilder().setTitle('👊 Punch').setDescription(`**${message.author.username}** punched **${user.username}**!`).setColor('#FF4444')] });
  }
};
