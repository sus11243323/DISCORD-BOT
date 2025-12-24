const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: {
        name: 'unlock',
        description: 'Unlock a channel to allow members to send messages'
    },
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return message.reply('❌ You need the Manage Channels permission to use this command!');
        }

        const channel = message.mentions.channels.first() || message.channel;

        try {
            await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SendMessages: null
            });

            message.reply(`🔓 **${channel.name}** has been unlocked! Members can now send messages.`);
        } catch (error) {
            console.error(error);
            message.reply('❌ Failed to unlock the channel. Check bot permissions!');
        }
    }
};
