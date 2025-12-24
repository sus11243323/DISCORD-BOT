const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const warningsFile = path.join(dataDir, 'warnings.json');

/* =========================
   FILE SYSTEM HELPERS
========================= */

function ensureDataDir() {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}

function loadWarnings() {
    ensureDataDir();
    if (!fs.existsSync(warningsFile)) return {};
    return JSON.parse(fs.readFileSync(warningsFile, 'utf8'));
}

function saveWarnings(warnings) {
    ensureDataDir();
    fs.writeFileSync(warningsFile, JSON.stringify(warnings, null, 2));
}

/* =========================
   COMMAND
========================= */

module.exports = {
    data: {
        name: 'warn',
        description: 'Warn a user and apply punishments automatically'
    },

    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.reply('❌ You need **Moderate Members** permission.');
        }

        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]);

        const reason = args.slice(1).join(' ') || 'No reason provided';

        if (!member) {
            return message.reply('❌ Usage: `!warn @user [reason]`');
        }

        if (!member.moderatable) {
            return message.reply('❌ I cannot moderate this user (role too high).');
        }

        const warnings = loadWarnings();
        const guildId = message.guild.id;
        const userId = member.id;

        if (!warnings[guildId]) warnings[guildId] = {};
        if (!warnings[guildId][userId]) warnings[guildId][userId] = [];

        warnings[guildId][userId].push({
            reason,
            moderator: message.author.tag,
            date: new Date().toISOString()
        });

        saveWarnings(warnings);

        const warnCount = warnings[guildId][userId].length;

        /* =========================
           EMBED
        ========================= */

        const embed = new EmbedBuilder()
            .setTitle('⚠️ User Warned')
            .setColor('#FFA500')
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '👤 User', value: `${member.user.tag} (${member.id})` },
                { name: '🛡️ Moderator', value: message.author.tag, inline: true },
                { name: '📊 Total Warnings', value: `${warnCount}`, inline: true },
                { name: '📝 Reason', value: reason }
            )
            .setFooter({ text: message.guild.name })
            .setTimestamp();

        await message.reply({ embeds: [embed] });

        try {
            await member.send(
                `⚠️ You were warned in **${message.guild.name}**\n` +
                `**Reason:** ${reason}\n` +
                `**Total Warnings:** ${warnCount}`
            );
        } catch {
            console.log(`⚠️ Could not DM ${member.user.tag}`);
        }

        /* =========================
           AUTO TIMEOUT (3+)
        ========================= */

        if (warnCount >= 3 && warnCount < 5) {
            try {
                if (!member.communicationDisabledUntilTimestamp) {
                    await member.timeout(
                        24 * 60 * 60 * 1000,
                        'Reached 3 warnings'
                    );

                    await message.channel.send(
                        `⏳ ${member.user.tag} has been **timed out for 1 day** (3 warnings).`
                    );
                }
            } catch (err) {
                console.error('❌ Timeout failed:', err);
            }
        }

        /* =========================
           AUTO BAN (5+)
        ========================= */

        if (warnCount >= 5) {
            try {
                await member.send('🚫 You have been banned for too many warnings.');
                await member.ban({ reason: 'Reached 5 warnings' });

                await message.channel.send(
                    `🚫 ${member.user.tag} has been **banned** (5 warnings).`
                );
            } catch (err) {
                console.error('❌ Ban failed:', err);
            }
        }
    }
};
