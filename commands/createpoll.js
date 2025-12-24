const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'createpoll',
        description: 'Create a poll with up to 10 options (single-choice voting).'
    },

    async execute(message, args) {
        if (args.length < 4) return message.reply('❌ Usage: !createpoll "Question" option1 option2 option3 1m');

        const question = args[0];
        const timeInput = args[args.length - 1];
        const duration = parseTime(timeInput);
        if (!duration) return message.reply('❌ Invalid time! Use 30s, 1m, 5m, 1h');

        const options = args.slice(1, args.length - 1);
        const emojis = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];
        if (options.length > emojis.length) return message.reply("❌ Max 10 options.");

        // BEAUTIFUL EMBED
        const embed = new EmbedBuilder()
            .setTitle(`📊 ${question}`)
            .setDescription(options.map((o, i) => `**${emojis[i]}** — ${o}`).join("\n"))
            .setColor("#5865F2")
            .setFooter({ text: `Poll ends in ${timeInput}` })
            .setTimestamp();

        const poll = await message.channel.send({ embeds: [embed] });

        // Add reactions
        for (let i = 0; i < options.length; i++) await poll.react(emojis[i]);

        // SINGLE-CHOICE VOTING
        const collector = poll.createReactionCollector({ time: duration });

        collector.on("collect", async (reaction, user) => {
            if (user.bot) return;

            // Remove ANY other emoji reacted by the same user
            for (const emoji of emojis) {
                if (emoji !== reaction.emoji.name) {
                    const r = poll.reactions.cache.get(emoji);
                    if (r) {
                        try { await r.users.remove(user.id); } catch {}
                    }
                }
            }
        });

        collector.on("end", async () => {
            // Fetch updated reaction counts
            const fetched = await poll.fetch();

            let final = `📊 **Final Results — ${question}**\n\n`;
            for (let i = 0; i < options.length; i++) {
                const r = fetched.reactions.cache.get(emojis[i]);
                const votes = r ? r.count - 1 : 0;
                final += `${emojis[i]} ${options[i]} — **${votes} votes**\n`;
            }

            // Delete poll message
            try { await poll.delete(); } catch {}

            const resultsMsg = await message.channel.send(final);

            // Auto-delete results after 10 seconds
            setTimeout(() => resultsMsg.delete().catch(() => {}), 10000);
        });
    }
};

// Time parser
function parseTime(t) {
    const m = t.match(/^(\d+)(s|m|h)$/);
    if (!m) return null;
    const n = parseInt(m[1]);
    return { s: n * 1000, m: n * 60000, h: n * 3600000 }[m[2]];
}
