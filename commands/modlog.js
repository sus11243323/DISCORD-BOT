const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configFile = path.join(__dirname, '..', 'data', 'modlog.json');

function ensureDataDir() {
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}

function loadConfig() {
    ensureDataDir();
    if (fs.existsSync(configFile)) {
        return JSON.parse(fs.readFileSync(configFile, 'utf8'));
    }
    return {};
}

function saveConfig(config) {
    ensureDataDir();
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
}

module.exports = {
    data: {
        name: 'modlog',
        description: 'Set or view the moderation log channel'
    },
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('❌ You need Administrator permission to use this command!');
        }

        const config = loadConfig();
        const action = args[0]?.toLowerCase();

        if (!action || action === 'view') {
            const channelId = config[message.guild.id];
            if (channelId) {
                const channel = message.guild.channels.cache.get(channelId);
                if (channel) {
                    return message.reply(`📋 Current modlog channel: ${channel}`);
                } else {
                    return message.reply('⚠️ Modlog channel was set but no longer exists. Use `!modlog set #channel` to set a new one.');
                }
            } else {
                return message.reply('❌ No modlog channel set. Use `!modlog set #channel` to set one.');
            }
        }

        if (action === 'set') {
            const channel = message.mentions.channels.first();
            if (!channel) {
                return message.reply('❌ Usage: `!modlog set #channel`');
            }

            config[message.guild.id] = channel.id;
            saveConfig(config);

            const embed = new EmbedBuilder()
                .setTitle('📋 Modlog Channel Set')
                .setColor('#5865F2')
                .addFields(
                    { name: 'Channel', value: `${channel}`, inline: true },
                    { name: 'Set By', value: message.author.tag, inline: true }
                )
                .setTimestamp();

            message.reply({ embeds: [embed] });
        } else if (action === 'remove' || action === 'disable') {
            delete config[message.guild.id];
            saveConfig(config);
            message.reply('✅ Modlog channel has been disabled.');
        } else {
            message.reply('❌ Usage: `!modlog [set #channel | view | remove]`');
        }
    },

    async log(guild, embed) {
        const config = loadConfig();
        const channelId = config[guild.id];
        if (channelId) {
            const channel = guild.channels.cache.get(channelId);
            if (channel) {
                await channel.send({ embeds: [embed] });
            }
        }
    }
};
