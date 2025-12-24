const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = {
  data: {
    name: "ai",
    description: "Ask the AI a question"
  },
  async execute(message, args) {
    const prompt = args.join(" ");
    if (!prompt) {
      return message.reply("❌ Usage: `!ai <question>`");
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant. Answer naturally and concisely."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
      });

      message.reply(response.choices[0].message.content);
    } catch (err) {
      console.error(err);
      message.reply("❌ AI error - make sure API key is set!");
    }
  }
};
