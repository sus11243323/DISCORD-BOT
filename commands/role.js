const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: {
        name: 'role',
        description: 'Add or remove a role from a user'
    },
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return message.reply('❌ You need the Manage Roles permission to use this command!');
        }

        const action = args[0]?.toLowerCase();
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
        const roleName = args.slice(2).join(' ');

        if (!action || !member || !roleName) {
            return message.reply('❌ Usage: `!role <add/remove> @user <role name>`\nExample: `!role add @user Moderator`');
        }

        const role = message.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase());

        if (!role) {
            return message.reply('❌ Role not found! Please check the role name.');
        }

        if (role.position >= message.member.roles.highest.position) {
            return message.reply('❌ You cannot manage this role due to role hierarchy!');
        }

        if (role.position >= message.guild.members.me.roles.highest.position) {
            return message.reply('❌ I cannot manage this role due to role hierarchy!');
        }

        try {
            if (action === 'add') {
                if (member.roles.cache.has(role.id)) {
                    return message.reply(`❌ ${member.user.tag} already has the ${role.name} role!`);
                }
                await member.roles.add(role);
                message.reply(`✅ Added **${role.name}** role to **${member.user.tag}**`);
            } else if (action === 'remove') {
                if (!member.roles.cache.has(role.id)) {
                    return message.reply(`❌ ${member.user.tag} doesn't have the ${role.name} role!`);
                }
                await member.roles.remove(role);
                message.reply(`✅ Removed **${role.name}** role from **${member.user.tag}**`);
            } else {
                message.reply('❌ Invalid action! Use `add` or `remove`');
            }
        } catch (error) {
            console.error(error);
            message.reply('❌ Failed to manage role. Check bot permissions!');
        }
    }
};
