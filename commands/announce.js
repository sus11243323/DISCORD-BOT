const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: {
        name: 'announce',
        description: 'Send an announcement to a specific channel'
    },
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply('❌ You need the Manage Messages permission to use this command!');
        }

        const channelMention = args[0];
        const announcement = args.slice(1).join(' ');

        if (!channelMention || !announcement) {
            return message.reply('❌ Usage: `!announce #channel Your announcement message`');
        }

        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(channelMention);

        if (!channel) {
            return message.reply('❌ Invalid channel! Please mention a valid channel.');
        }

        const embed = new EmbedBuilder()
            .setTitle('📢 Announcement')
            .setDescription(announcement)
            .setColor('#5865F2')
            .setFooter({ text: `Announced by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        try {
            // Send announcement
            await channel.send({ embeds: [embed] });

            // Send confirmation (then delete it after 5s)
            const confirmation = await message.reply(`✅ Announcement sent to ${channel}!`);
            setTimeout(() => confirmation.delete().catch(() => {}), 5000);

            // Delete the user’s original command message
            await message.delete().catch(() => {});

        } catch (error) {
            console.error(error);
            message.reply('❌ Failed to send announcement. Check bot permissions!');
        }
    }
};
