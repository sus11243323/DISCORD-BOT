const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'remind',
        description: 'Set a reminder'
    },
    async execute(message, args) {
        const time = args[0];
        const reminder = args.slice(1).join(' ');

        if (!time || !reminder) {
            return message.reply('❌ Usage: `!remind <time> <reminder>`\nExample: `!remind 10m Take a break`\nFormats: s=seconds, m=minutes, h=hours');
        }

        const ms = parseTime(time);
        if (!ms || ms < 1000 || ms > 86400000) {
            return message.reply('❌ Invalid time! Use formats like: 30s, 10m, 2h (max 24 hours)');
        }

        const embed = new EmbedBuilder()
            .setTitle('⏰ Reminder Set')
            .setDescription(`I'll remind you in **${time}**`)
            .addFields({ name: 'Reminder', value: reminder })
            .setColor('#5865F2')
            .setFooter({ text: `Set by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });

        setTimeout(async () => {
            const reminderEmbed = new EmbedBuilder()
                .setTitle('⏰ Reminder!')
                .setDescription(reminder)
                .setColor('#FF6B6B')
                .addFields({ name: 'Set', value: `${time} ago`, inline: true })
                .setTimestamp();

            try {
                await message.author.send({ embeds: [reminderEmbed] });
            } catch {
                message.channel.send({ content: `${message.author}`, embeds: [reminderEmbed] });
            }
        }, ms);
    }
};

function parseTime(time) {
    const regex = /^(\d+)([smh])$/;
    const match = time.match(regex);
    
    if (!match) return null;

    const value = parseInt(match[1]);
    const unit = match[2];

    const multipliers = { s: 1000, m: 60000, h: 3600000 };
    return value * multipliers[unit];
}
