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

function saveWarnings(warnings) {
    ensureDataDir();
    fs.writeFileSync(warningsFile, JSON.stringify(warnings, null, 2));
}

module.exports = {
    data: {
        name: 'clearwarnings',
        description: 'Clear all warnings for a user'
    },
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('❌ You need Administrator permission to use this command!');
        }

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!member) {
            return message.reply('❌ Usage: `!clearwarnings @user`');
        }

        const warnings = loadWarnings();
        if (!warnings[message.guild.id]) {
            warnings[message.guild.id] = {};
        }

        const oldCount = (warnings[message.guild.id][member.id] || []).length;

        if (oldCount === 0) {
            return message.reply(`✅ **${member.user.tag}** already has no warnings!`);
        }

        warnings[message.guild.id][member.id] = [];
        saveWarnings(warnings);

        const embed = new EmbedBuilder()
            .setTitle('🧹 Warnings Cleared')
            .setColor('#00FF00')
            .addFields(
                { name: 'User', value: member.user.tag, inline: true },
                { name: 'Cleared By', value: message.author.tag, inline: true },
                { name: 'Warnings Removed', value: `${oldCount}`, inline: true }
            )
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
