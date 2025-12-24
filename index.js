/* =========================
   🔧 CORE IMPORTS
========================= */
const express = require("express");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

/* =========================
   🔎 ENV DEBUG (SAFE)
========================= */
console.log("🔍 Token present:", Boolean(process.env.DISCORD_BOT_TOKEN));
console.log("📂 App directory:", __dirname);

/* =========================
   🌐 UPTIME SERVER
========================= */
const app = express();

app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.head("/", (req, res) => {
  res.status(200).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Uptime server running");
});

/* =========================
   🔁 SAFE SELF PING (NO CRASH)
========================= */
setInterval(async () => {
  try {
    await fetch("https://example.com");
    console.log("🔁 Self-ping OK");
  } catch (err) {
    console.log("⚠️ Self-ping failed (ignored)");
  }
}, 5 * 60 * 1000);

/* =========================
   🛡️ GLOBAL CRASH PROTECTION
========================= */
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection (ignored):", reason);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception (ignored):", err);
});

/* =========================
   🤖 DISCORD CLIENT
========================= */
const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials,
  EmbedBuilder
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildPresences
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();

/* =========================
   🧠 OPENAI (SAFE INIT)
========================= */
const { OpenAI } = require("openai");

let openai = null;

if (process.env.OPENAI_API_KEY) {
  try {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    console.log("🧠 OpenAI enabled");
  } catch (e) {
    console.log("⚠️ OpenAI failed to initialize (disabled)");
  }
} else {
  console.log("⚠️ OPENAI_API_KEY missing — AI disabled");
}

/* =========================
   📁 FORCE COMMANDS FOLDER
========================= */
const forceCommandsPath = path.join(__dirname, "commands");

try {
  if (!fs.existsSync(forceCommandsPath)) {
    fs.mkdirSync(forceCommandsPath);
    fs.writeFileSync(path.join(forceCommandsPath, ".gitkeep"), "");
    console.log("📁 Commands folder auto-created");
  } else {
    console.log("📁 Commands folder exists");
  }
} catch (e) {
  console.log("⚠️ Failed to create commands folder (ignored)");
}

/* =========================
   📂 LOAD COMMANDS
========================= */
const commandsPath = path.join(__dirname, "commands");

if (fs.existsSync(commandsPath)) {
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

  console.log(chalk.cyan.bold("\n📦 Loading Commands..."));

  for (const file of commandFiles) {
    try {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
        console.log(chalk.green(`✅ Loaded: ${file}`));
      } else {
        console.log(chalk.yellow(`⚠️ Invalid command: ${file}`));
      }
    } catch (err) {
      console.log(chalk.red(`❌ Failed loading ${file} (ignored)`));
    }
  }
} else {
  console.log("⚠️ Commands folder not found (skipped)");
}

/* =========================
   ⏳ LOADING VISUAL
========================= */
console.log(chalk.cyan("⏳ Starting bot..."));

/* =========================
   🟢 READY
========================= */
client.once("ready", () => {
  console.log(chalk.green.bold(`✅ Online as ${client.user.tag}`));

  client.user.setPresence({
    status: "idle",
    activities: [{ name: "Moderating GWS <:icondihh:1450244819980128276>", type: 4 }]
  });
});

/* =========================
   💬 MESSAGE HANDLER (! PREFIX)
========================= */
client.on("messageCreate", async (message) => {
  try {
    if (message.author.bot) return;

    const prefix = "!";
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (commandName === "ai") {
      if (!openai) {
        return message.reply("❌ AI is disabled.");
      }

      const prompt = args.join(" ");
      if (!prompt) {
        return message.reply("❌ Write something after `!ai`");
      }

      try {
        await message.channel.sendTyping();

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Reply in Polish if the user uses Polish, otherwise English." },
            { role: "user", content: prompt }
          ],
          max_tokens: 500
        });

        return message.reply(response.choices[0].message.content);
      } catch (err) {
        console.error("❌ AI error (ignored):", err);
        return message.reply("❌ AI error.");
      }
    }

    const command = client.commands.get(commandName);
    if (!command) return;

    await command.execute(message, args);

  } catch (err) {
    console.error("❌ Message handler error (ignored):", err);
  }
});

/* =========================
   🔐 TOKEN VALIDATION
========================= */
if (process.env.DISCORD_BOT_TOKEN) {
  console.log("🔐 DISCORD_BOT_TOKEN length:", process.env.DISCORD_BOT_TOKEN.length);
} else {
  console.log("❌ DISCORD_BOT_TOKEN is undefined");
}

/* =========================
   🔐 LOGIN (SAFE)
========================= */
if (!process.env.DISCORD_BOT_TOKEN) {
  console.error("❌ DISCORD_BOT_TOKEN missing — bot not logged in");
} else {
  client.login(process.env.DISCORD_BOT_TOKEN)
    .catch(err => {
      console.error("❌ Login failed (ignored):", err);
    });
}
