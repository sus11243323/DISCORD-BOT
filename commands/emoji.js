const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'emoji',
        description: 'Get info about an emoji or enlarge it'
    },
    async execute(message, args) {
        const emojiArg = args[0];

        if (!emojiArg) {
            return message.reply('❌ Usage: `!emoji <emoji>`');
        }

        const customEmojiMatch = emojiArg.match(/<(a)?:(\w+):(\d+)>/);

        if (customEmojiMatch) {
            const animated = customEmojiMatch[1] === 'a';
            const name = customEmojiMatch[2];
            const id = customEmojiMatch[3];
            const extension = animated ? 'gif' : 'png';
            const url = `https://cdn.discordapp.com/emojis/${id}.${extension}?size=256`;

            const embed = new EmbedBuilder()
                .setTitle(`😊 Emoji: ${name}`)
                .setColor('#5865F2')
                .setImage(url)
                .addFields(
                    { name: 'Name', value: name, inline: true },
                    { name: 'ID', value: id, inline: true },
                    { name: 'Animated', value: animated ? 'Yes' : 'No', inline: true },
                    { name: 'URL', value: `[Click Here](${url})`, inline: false }
                )
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            message.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setTitle('😊 Emoji')
                .setDescription(`Here's your emoji enlarged:\n\n# ${emojiArg}`)
                .setColor('#5865F2')
                .setFooter({ text: `This is a default emoji (cannot be enlarged further)` })
                .setTimestamp();

            message.reply({ embeds: [embed] });
        }
    }
};
