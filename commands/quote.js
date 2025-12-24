const { EmbedBuilder } = require('discord.js');

const quotes = [
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { quote: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { quote: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { quote: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
    { quote: "The only thing we have to fear is fear itself.", author: "Franklin D. Roosevelt" },
    { quote: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
    { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { quote: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { quote: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
    { quote: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
    { quote: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
    { quote: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" }
];

module.exports = {
    data: {
        name: 'quote',
        description: 'Get an inspirational quote'
    },
    async execute(message, args) {
        const { quote, author } = quotes[Math.floor(Math.random() * quotes.length)];

        const embed = new EmbedBuilder()
            .setTitle('💭 Inspirational Quote')
            .setDescription(`*"${quote}"*`)
            .setColor('#3498DB')
            .setFooter({ text: `— ${author}` })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
