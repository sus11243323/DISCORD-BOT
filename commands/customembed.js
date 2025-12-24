const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: {
        name: 'embed',
        description: 'Create a custom embed message'
    },
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply('❌ You need the Manage Messages permission to use this command!');
        }

        const input = args.join(' ');

        if (!input) {
            return message.reply('❌ Usage: `!embed title=Your Title | description=Your description | color=#5865F2`\nOptional: footer, image, thumbnail');
        }

        const parts = input.split('|').map(p => p.trim());
        const embedData = {};

        parts.forEach(part => {
            const [key, ...valueParts] = part.split('=');
            const value = valueParts.join('=').trim();
            if (key && value) {
                embedData[key.trim().toLowerCase()] = value;
            }
        });

        const embed = new EmbedBuilder();

        if (embedData.title) embed.setTitle(embedData.title);
        if (embedData.description) embed.setDescription(embedData.description);
        if (embedData.color) {
            const color = embedData.color.startsWith('#') ? embedData.color : `#${embedData.color}`;
            embed.setColor(color);
        } else {
            embed.setColor('#5865F2');
        }
        if (embedData.footer) embed.setFooter({ text: embedData.footer });
        if (embedData.image) embed.setImage(embedData.image);
        if (embedData.thumbnail) embed.setThumbnail(embedData.thumbnail);
        if (embedData.url) embed.setURL(embedData.url);

        embed.setTimestamp();

        try {
            await message.channel.send({ embeds: [embed] });
            message.delete().catch(() => {});
        } catch (error) {
            console.error(error);
            message.reply('❌ Failed to create embed. Check your input format!');
        }
    }
};
