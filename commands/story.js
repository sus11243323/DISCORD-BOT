module.exports = {
    data: {
        name: 'story',
        description: 'Generates a short random funny story'
    },
    async execute(message, args) {
        const characters = ["a raccoon", "a giant duck", "your clone", "a robot", "a suspicious cat"];
        const places = ["Walmart", "your basement", "a dark forest", "a McDonalds", "your school"];
        const events = [
            "fell from the ceiling",
            "started dancing aggressively",
            "stole your shoes",
            "turned into a meme",
            "screamed for no reason"
        ];
        const endings = [
            "and then vanished.",
            "and your WiFi died.",
            "and you woke up in Ohio.",
            "and it was all a dream.",
            "and the government blamed you."
        ];

        const c = characters[Math.floor(Math.random() * characters.length)];
        const p = places[Math.floor(Math.random() * places.length)];
        const e = events[Math.floor(Math.random() * events.length)];
        const end = endings[Math.floor(Math.random() * endings.length)];

        const embed = {
            title: "📖 Random Story",
            description: `One day, **${c}** appeared inside **${p}**, then **${e}**, ${end}`,
            color: 0x00A2FF
        };

        message.reply({ embeds: [embed] });
    }
};
