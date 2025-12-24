const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: {
        name: 'captcha',
        description: 'Force a user to solve a captcha'
    },

    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ Admin only.');
        }

        const target = message.mentions.members.first();
        if (!target) return message.reply('❌ Mention a user.');

        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const answer = a + b;

        const embed = new EmbedBuilder()
            .setColor(0xffaa00)
            .setTitle('🔐 CAPTCHA REQUIRED')
            .setDescription(
                `**${target}** must solve this captcha:\n\n` +
                `🧮 **${a} + ${b} = ?**\n\n` +
                `⏱️ You have **30 seconds**`
            )
            .setFooter({ text: 'Type the answer in chat' });

        await message.channel.send({ embeds: [embed] });

        const filter = m => m.author.id === target.id;
        const collector = message.channel.createMessageCollector({ filter, time: 30000 });

        let solved = false;

        collector.on('collect', async m => {
            if (parseInt(m.content) === answer) {
                solved = true;
                collector.stop();

                await message.channel.send(`✅ ${target} passed the captcha.`);
            }
        });

        collector.on('end', async () => {
            if (!solved) {
                try {
                    await target.timeout(5 * 60 * 1000, 'Failed captcha'); // 5 min timeout
                    message.channel.send(`❌ ${target} failed the captcha and was timed out.`);
                } catch {
                    message.channel.send('⚠️ Failed to punish user (missing permissions).');
                }
            }
        });
    }
};
