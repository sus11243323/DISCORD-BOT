const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'ban',
        description: 'Ban a user by ID (bot uses admin)'
    },

    async execute(message, args) {
        // 🔒 ONLY YOU CAN USE THIS COMMAND
        const ALLOWED_USER_ID = '1057830290749390902';

        // 🏠 SERVER TO BAN FROM
        const TARGET_GUILD_ID = 'SERVER_ID_HERE';

        if (message.author.id !== ALLOWED_USER_ID) {
            return message.reply('❌ You are not allowed to use this command.');
        }

        const userId = args[0];
        if (!userId) {
            return message.reply('❌ Usage: `!ban USER_ID`');
        }

        try {
            const guild = await message.client.guilds.fetch(TARGET_GUILD_ID);

            await guild.members.ban(userId, {
                reason: `Banned by ${message.author.tag}`
            });

            const embed = new EmbedBuilder()
                .setTitle('🔨 User Banned')
                .setColor('#FF0000')
                .addFields(
                    { name: 'User ID', value: userId, inline: true },
                    { name: 'Server', value: guild.name, inline: true }
                )
                .setFooter({ text: `Action by ${message.author.tag}` })
                .setTimestamp();

            message.reply({ embeds: [embed] });

        } catch (err) {
            console.error(err);
            message.reply('❌ Failed to ban user (missing perms, wrong ID, or role hierarchy).');
        }
    }
};
