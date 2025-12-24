const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'nickname',
        description: 'Change a user\'s nickname'
    },
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageNicknames)) {
            return message.reply('❌ You need the Manage Nicknames permission to use this command!');
        }

        const member = message.mentions.members.first();
        const newNickname = args.slice(1).join(' ');

        if (!member) {
            return message.reply('❌ Usage: `!nickname @user <new nickname>` or `!nickname @user` to reset');
        }

        if (member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerId) {
            return message.reply('❌ You cannot change the nickname of this user due to role hierarchy!');
        }

        try {
            const oldNickname = member.nickname || member.user.username;
            await member.setNickname(newNickname || null);

            const embed = new EmbedBuilder()
                .setTitle('📝 Nickname Changed')
                .setColor('#5865F2')
                .addFields(
                    { name: 'User', value: member.user.tag, inline: true },
                    { name: 'Old Nickname', value: oldNickname, inline: true },
                    { name: 'New Nickname', value: newNickname || 'Reset to username', inline: true }
                )
                .setFooter({ text: `Changed by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('❌ Failed to change nickname. Check bot permissions!');
        }
    }
};
