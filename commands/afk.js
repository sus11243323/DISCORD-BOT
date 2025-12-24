const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const afkFile = path.join(__dirname, '..', 'data', 'afk.json');

function ensureDataDir() {
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}

function loadAfk() {
    ensureDataDir();
    if (fs.existsSync(afkFile)) {
        return JSON.parse(fs.readFileSync(afkFile, 'utf8'));
    }
    return {};
}

function saveAfk(afkData) {
    ensureDataDir();
    fs.writeFileSync(afkFile, JSON.stringify(afkData, null, 2));
}

module.exports = {
    data: {
        name: 'afk',
        description: 'Set your AFK status'
    },
    async execute(message, args) {
        const reason = args.join(' ') || 'AFK';
        const afkData = loadAfk();

        afkData[message.author.id] = {
            reason: reason,
            timestamp: Date.now(),
            username: message.author.tag
        };

        saveAfk(afkData);

        const embed = new EmbedBuilder()
            .setTitle('💤 AFK Set')
            .setDescription(`You are now AFK: **${reason}**`)
            .setColor('#808080')
            .setFooter({ text: 'Your AFK will be removed when you send a message' })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },

    checkAfk(message) {
        const afkData = loadAfk();

        if (afkData[message.author.id]) {
            delete afkData[message.author.id];
            saveAfk(afkData);
            message.reply(`👋 Welcome back, ${message.author}! Your AFK has been removed.`).then(msg => {
                setTimeout(() => msg.delete().catch(() => {}), 5000);
            });
        }

        message.mentions.users.forEach(user => {
            if (afkData[user.id]) {
                const afk = afkData[user.id];
                const time = Math.floor((Date.now() - afk.timestamp) / 60000);
                message.reply(`💤 **${user.tag}** is AFK: ${afk.reason} (${time} minutes ago)`).then(msg => {
                    setTimeout(() => msg.delete().catch(() => {}), 5000);
                });
            }
        });
    }
};
