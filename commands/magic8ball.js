module.exports = {
    data: { name: 'magic8ball', description: 'Ask the magic 8 ball' },
    async execute(message, args) {
        if (!args[0]) return message.reply("Ask a question!");

        const replies = [
            "Yes.",
            "No.",
            "Maybe.",
            "Ask again later.",
            "Definitely not.",
            "100% yes.",
            "Stop asking stupid questions."
        ];

        const reply = replies[Math.floor(Math.random() * replies.length)];

        message.reply(`🎱 **${reply}**`);
    }
};
