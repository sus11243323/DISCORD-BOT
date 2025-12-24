const { EmbedBuilder } = require('discord.js');

const fortunes = [
    "🌟 A beautiful, smart, and loving person will be coming into your life.",
    "🍀 Good luck will be yours today!",
    "💫 Your hard work will pay off soon.",
    "🎯 Focus on your goals and success will follow.",
    "🌈 Something wonderful is about to happen.",
    "💎 Hidden talents will be revealed soon.",
    "🦋 Change is coming, embrace it!",
    "🌺 Love is in the air.",
    "⭐ You will achieve great things.",
    "🎪 An exciting opportunity awaits you.",
    "🌙 Trust your instincts, they will guide you.",
    "🔮 The answer you seek is closer than you think.",
    "🎭 Today is a good day to try something new.",
    "🌻 Happiness is right around the corner.",
    "💫 Your creativity will lead to success.",
    "🍃 Let go of the past and embrace the future.",
    "⚡ Energy and enthusiasm will be your allies today.",
    "🌊 Go with the flow and good things will happen.",
    "🎁 A surprise gift is coming your way.",
    "🔥 Your passion will inspire others."
];

module.exports = {
    data: {
        name: 'fortune',
        description: 'Get your fortune told'
    },
    async execute(message, args) {
        const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];

        const embed = new EmbedBuilder()
            .setTitle('🔮 Fortune Cookie')
            .setDescription(fortune)
            .setColor('#9B59B6')
            .setFooter({ text: `Fortune for ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
