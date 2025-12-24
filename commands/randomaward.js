module.exports = {
    data: {
        name: 'randomaward',
        description: 'Gives a random funny award to a user'
    },
    async execute(message, args) {
        const user = message.mentions.users.first();
        if (!user) return message.reply("❌ Mention someone!");

        const awards = [
            "The Loudest Keyboard Award",
            "The Fastest Rage Quitter Award",
            "Professional Overthinker Award",
            "Sigma Award",
            "Unmuted Mic Jumpscare Award",
            "Best At Doing Nothing Award",
            "Certified Goofy Award"
        ];

        const emojis = ["🏆","🎖️","🥇","⭐","💎"];
        const award = awards[Math.floor(Math.random() * awards.length)];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];

        const embed = {
            title: `${emoji} Award Unlocked!`,
            description: `**${user}** has won:\n\n🎉 **${award}** 🎉`,
            color: 0xFFD700
        };

        message.reply({ embeds: [embed] });
    }
};
