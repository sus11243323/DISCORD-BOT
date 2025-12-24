const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'help',
        description: 'Display all available commands'
    },
    async execute(message, args) {
        const category = args[0]?.toLowerCase();

        const categories = {
            moderation: {
                emoji: '🔨',
                name: 'Moderation (18)',
                commands: ['ban', 'unban', 'kick', 'mute', 'unmute', 'timeout', 'removetimeout', 'warn', 'warnings', 'clearwarnings', 'softban', 'purge', 'clear', 'nuke', 'lock', 'unlock', 'slowmode', 'modlog']
            },
            utility: {
                emoji: '🛠️',
                name: 'Utility (16)',
                commands: ['announce', 'role', 'nickname', 'embed', 'quickpoll', 'createpoll', 'dm', 'afk', 'remind', 'serverinfo', 'userinfo', 'membercount', 'botinfo', 'ping', 'uptime', 'invite']
            },
            fun: {
                emoji: '🎮',
                name: 'Fun (19)',
                commands: ['coinflip', 'dice', 'rps', 'magic8ball', 'fortune', 'joke', 'quote', 'ship', 'hug', 'avatar', 'banner', 'emoji', 'story', 'bless', 'target', 'susrate', 'gamerate', 'randomaward', 'speedtest']
            },
            economy: {
                emoji: '💰',
                name: 'Economy (6)',
                commands: ['8ball', 'daily', 'work', 'gamble', 'flip', 'beg']
            },
            actions: {
                emoji: '👥',
                name: 'Actions (80)',
                commands: ['slap', 'kiss', 'punch', 'wave', 'dance', 'laugh', 'cry', 'smile', 'frown', 'pet', 'cuddle', 'tickle', 'poke', 'highfive', 'fist', 'handshake', 'hype', 'cheer', 'clap', 'chant', 'birthday', 'celebrate', 'sad', 'happy', 'angry', 'confused', 'bored', 'tired', 'hungry', 'thirsty', 'sleepy', 'cold', 'hot', 'sick', 'amazed', 'shocked', 'scared', 'cool', 'sarcasm', 'shrug', 'facepalm', 'bow', 'respect', 'apologize', 'forgive', 'blame', 'praise', 'compliment', 'insult', 'flirt', 'love', 'hate', 'marry', 'divorce', 'propose', 'adopt', 'care', 'wink', 'sparkle', 'shine', 'glow', 'magic', 'curse', 'steal', 'rob', 'heal', 'kill']
            },
            bot: {
                emoji: '⚙️',
                name: 'Bot Management (6)',
                commands: ['changestatus', 'changebotname', 'resetbotname', 'automod', 'trackuser', 'addgame']
            }
        };

        if (category && categories[category]) {
            const cat = categories[category];
            const commandList = cat.commands.map(cmd => `\`!${cmd}\``).join(', ');
            
            const embed = new EmbedBuilder()
                .setTitle(`${cat.emoji} ${cat.name}`)
                .setDescription(commandList)
                .setColor('#5865F2')
                .setFooter({ text: `Use !help for all categories | ${cat.commands.length} commands` })
                .setTimestamp();

            return message.reply({ embeds: [embed] });
        }

        const embed = new EmbedBuilder()
            .setTitle('🤖 Bot Commands (180+)')
            .setDescription('Use `!help <category>` for detailed commands\n\n**Categories:**')
            .setColor('#5865F2')
            .addFields(
                { name: '🔨 Moderation', value: '`!help moderation`\n18 commands', inline: true },
                { name: '🛠️ Utility', value: '`!help utility`\n16 commands', inline: true },
                { name: '🎮 Fun', value: '`!help fun`\n19 commands', inline: true },
                { name: '💰 Economy', value: '`!help economy`\n6 commands', inline: true },
                { name: '👥 Actions', value: '`!help actions`\n80 commands', inline: true },
                { name: '⚙️ Bot Management', value: '`!help bot`\n6 commands', inline: true }
            )
            .setFooter({ text: `Total: 180+ commands | Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
