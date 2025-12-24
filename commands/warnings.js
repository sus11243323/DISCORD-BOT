const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const warningsFile = path.join(__dirname, '..', 'data', 'warnings.json');

function ensureDataDir() {
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}

function loadWarnings() {
    ensureDataDir();
    if (fs.existsSync(warningsFile)) {
        return JSON.parse(fs.readFileSync(warningsFile, 'utf8'));
    }
    return {};
}

module.exports = {
    data: {
        name: 'warnings',
        description: 'View warnings for a user'
    },
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.reply('❌ You need the Moderate Members permission to use this command!');
        }

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!member) {
            return message.reply('❌ Usage: `!warnings @user`');
        }

        const warnings = loadWarnings();
        const guildWarnings = warnings[message.guild.id] || {};
        const userWarnings = guildWarnings[member.id] || [];

        if (userWarnings.length === 0) {
            return message.reply(`✅ **${member.user.tag}** has no warnings!`);
        }

        const embed = new EmbedBuilder()
            .setTitle(`⚠️ Warnings for ${member.user.tag}`)
            .setColor('#FFA500')
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`Total Warnings: **${userWarnings.length}**`)
            .setTimestamp();

        userWarnings.slice(-10).forEach((warn, index) => {
            embed.addFields({
                name: `Warning #${index + 1}`,
                value: `**Reason:** ${warn.reason}\n**By:** ${warn.moderator}\n**Date:** ${new Date(warn.date).toLocaleDateString()}`,
                inline: false
            });
        });

        if (userWarnings.length > 10) {
            embed.setFooter({ text: `Showing last 10 of ${userWarnings.length} warnings` });
        }

        message.reply({ embeds: [embed] });
    }
};
