const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: {
        name: 'lock',
        description: 'Lock a channel to prevent members from sending messages'
    },
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return message.reply('❌ You need the Manage Channels permission to use this command!');
        }

        const channel = message.mentions.channels.first() || message.channel;

        try {
            await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SendMessages: false
            });

            message.reply(`🔒 **${channel.name}** has been locked! Members can no longer send messages.`);
        } catch (error) {
            console.error(error);
            message.reply('❌ Failed to lock the channel. Check bot permissions!');
        }
    }
};
