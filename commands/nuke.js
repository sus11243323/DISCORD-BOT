const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'nuke',
        description: 'Delete all messages in a channel by cloning it'
    },
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return message.reply('❌ You need the Manage Channels permission to use this command!');
        }

        const confirmMsg = await message.reply('⚠️ **WARNING:** This will delete ALL messages in this channel!\nType `confirm` within 15 seconds to proceed.');

        const filter = m => m.author.id === message.author.id && m.content.toLowerCase() === 'confirm';
        
        try {
            const collected = await message.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] });

            const channel = message.channel;
            const position = channel.position;
            const parent = channel.parent;

            const newChannel = await channel.clone({
                name: channel.name,
                parent: parent,
                position: position,
                reason: `Channel nuked by ${message.author.tag}`
            });

            await channel.delete(`Nuked by ${message.author.tag}`);

            const embed = new EmbedBuilder()
                .setTitle('💣 Channel Nuked!')
                .setDescription('All messages have been deleted.')
                .setColor('#FF0000')
                .addFields(
                    { name: 'Nuked By', value: message.author.tag, inline: true }
                )
                .setImage('https://media.giphy.com/media/HhTXt43pk1I1W/giphy.gif')
                .setTimestamp();

            const nukeMsg = await newChannel.send({ embeds: [embed] });
            setTimeout(() => nukeMsg.delete().catch(() => {}), 5000);

        } catch (error) {
            if (error.message === 'time') {
                message.reply('❌ Nuke cancelled - confirmation timed out.');
            } else {
                console.error(error);
                message.reply('❌ Failed to nuke the channel. Check bot permissions!');
            }
        }
    }
};
