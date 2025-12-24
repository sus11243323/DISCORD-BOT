const { EmbedBuilder } = require('discord.js');

const jokes = [
    { setup: "Why don't scientists trust atoms?", punchline: "Because they make up everything!" },
    { setup: "Why did the scarecrow win an award?", punchline: "He was outstanding in his field!" },
    { setup: "Why don't eggs tell jokes?", punchline: "They'd crack each other up!" },
    { setup: "What do you call a fake noodle?", punchline: "An impasta!" },
    { setup: "Why did the bicycle fall over?", punchline: "Because it was two-tired!" },
    { setup: "What do you call a bear with no teeth?", punchline: "A gummy bear!" },
    { setup: "Why can't you give Elsa a balloon?", punchline: "Because she will let it go!" },
    { setup: "What do you call a fish without eyes?", punchline: "A fsh!" },
    { setup: "Why did the math book look so sad?", punchline: "Because it had so many problems!" },
    { setup: "What do you call a sleeping dinosaur?", punchline: "A dino-snore!" },
    { setup: "Why don't skeletons fight each other?", punchline: "They don't have the guts!" },
    { setup: "What did the ocean say to the beach?", punchline: "Nothing, it just waved!" },
    { setup: "Why did the golfer bring two pairs of pants?", punchline: "In case he got a hole in one!" },
    { setup: "What do you call a pile of cats?", punchline: "A meow-ntain!" },
    { setup: "Why did the cookie go to the doctor?", punchline: "Because it was feeling crummy!" }
];

module.exports = {
    data: {
        name: 'joke',
        description: 'Get a random joke'
    },
    async execute(message, args) {
        const joke = jokes[Math.floor(Math.random() * jokes.length)];

        const embed = new EmbedBuilder()
            .setTitle('😂 Random Joke')
            .setColor('#F1C40F')
            .addFields(
                { name: 'Setup', value: joke.setup },
                { name: 'Punchline', value: `||${joke.punchline}||` }
            )
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
