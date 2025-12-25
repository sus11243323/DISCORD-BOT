module.exports = {
  data: {
    name: "url",
    description: "Shows the public URL of the web server"
  },
  async execute(message, args) {
    try {
      // Railway automatically sets this environment variable for your project URL
      const url = process.env.RAILWAY_STATIC_URL || process.env.HOST || "URL not found";

      message.reply(`🌐 My public URL is: ${url}`);
    } catch (err) {
      console.error(err);
      message.reply("❌ Could not fetch the URL!");
    }
  }
};
