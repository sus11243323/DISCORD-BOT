// ⬇️ NA SAMEJ GÓRZE PLIKU
const express = require("express");
const app = express();

// GET (browser)
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

// HEAD (uptimerobot)
app.head("/", (req, res) => {
  res.status(200).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Uptime server running");
});

/* =========================
   🔁 ADDED: KEEP ALIVE
========================= */
setInterval(() => {
  fetch("https://11485d7f-9da2-4136-b684-2f585dd24c9c-00-3iee0280fslvm.spock.replit.dev/")
    .then(() => console.log("🔁 Self-ping OK"))
    .catch(() => console.log("⚠️ Self-ping failed"));
}, 5 * 60 * 1000);

/* =========================
   🛡️ ADDED: CRASH PROTECTION
========================= */
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});



const { Client, GatewayIntentBits, Collection, Partials, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

// ✅ ADDED (AI)
const { OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// 🧠 Create client
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

// 📂 Load commands dynamically
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

console.log(chalk.cyan.bold("\n📦 Loading Commands..."));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    delete require.cache[require.resolve(filePath)];
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
        console.log(chalk.green(`✅ Loaded command: ${file}`));
    } else {
        console.log(chalk.yellow(`⚠️ Skipped invalid command file: ${file}`));
    }
}
console.log(chalk.cyan.bold(`📁 Total Commands Loaded: ${client.commands.size}\n`));

// ─────────────── Loading Spinner ───────────────

function getAllJsFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);

    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            results = results.concat(getAllJsFiles(filePath));
        } else if (file.endsWith(".js")) {
            results.push(path.relative(__dirname, filePath));
        }
    }
    return results;
}

const workspaceFiles = getAllJsFiles(__dirname);
const spinnerChars = ["-", "\\", "|", "/"];
let spinnerIndex = 0;
let loadedPercent = 0;

console.log(chalk.cyan.bold("⏳ Loading bot..."));

const spinnerInterval = setInterval(() => {
    process.stdout.write(`\r${spinnerChars[spinnerIndex]} Loading bot... ${loadedPercent}%`);
    spinnerIndex = (spinnerIndex + 1) % spinnerChars.length;
}, 100);

const totalTime = workspaceFiles.length + 1;
const startTime = Date.now();
let lastLoadedIndex = -1;

const loadingInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    loadedPercent = Math.min(100, Math.floor((elapsed / totalTime) * 100));

    const fileIndex = Math.floor((loadedPercent / 100) * workspaceFiles.length);
    if (fileIndex > lastLoadedIndex && fileIndex < workspaceFiles.length) {
        console.log(chalk.gray(`📄 Loading file: ${workspaceFiles[fileIndex]}`));
        lastLoadedIndex = fileIndex;
    }

    if (loadedPercent >= 100) {
        clearInterval(spinnerInterval);
        clearInterval(loadingInterval);
        process.stdout.write("\r✅ Bot fully loaded 100%!            \n\n");
    }
}, 50);

// 🟢 Ready
client.once("ready", () => {
    console.log(chalk.green.bold(`\n✅ Bot is online as ${client.user.tag}`));
    console.log(chalk.blue(`📊 Connected to ${client.guilds.cache.size} server(s)`));
    console.log(chalk.magenta(`📡 Logged in at ${new Date().toLocaleString()}\n`));

    client.user.setPresence({
        status: "dnd",
        activities: [{ name: "Moderating the BEST GWS Server", type: 1 }]
    });
});

// 🆕 When bot joins a server
client.on("guildCreate", async (guild) => {
    try {
        const CHANNEL_ID = "1434533915087077446";
        const botName = client.user.username;

        const isPolish =
            guild.preferredLocale === "pl" ||
            /pl|polska|poland/i.test(guild.name);

        const channel = guild.channels.cache.get(CHANNEL_ID);
        if (!channel) return;

        if (!channel.permissionsFor(guild.members.me)?.has(["ViewChannel", "SendMessages"])) return;

        const embed = new EmbedBuilder()
            .setColor("#2B2D31")
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setTimestamp()
            .setFooter({
                text: `${botName} • Moderation Active`,
                iconURL: client.user.displayAvatarURL()
            });

        if (isPolish) {
            embed
                .setTitle("🛡️ Moderacja Aktywna")
                .setDescription(
                    `👋 **Witaj, ${guild.name}!**\n\n` +
                    `🔍 Rozpoczynam moderowanie serwera\n` +
                    `⚙️ Ochrona: **AKTYWNA**\n` +
                    `🚨 Monitoring: **ONLINE**`
                )
                .addFields(
                    { name: "👥 Członkowie", value: `${guild.memberCount}`, inline: true },
                    { name: "🌐 Język", value: "PL", inline: true },
                    { name: "🟢 Status", value: "ONLINE", inline: true }
                );
        } else {
            embed
                .setTitle("🛡️ Moderation Online")
                .setDescription(
                    `👋 **Hello, ${guild.name}!**\n\n` +
                    `🔍 Moderation system is now active\n` +
                    `⚙️ Protection: **ENABLED**\n` +
                    `🚨 Monitoring: **ONLINE**`
                )
                .addFields(
                    { name: "👥 Members", value: `${guild.memberCount}`, inline: true },
                    { name: "🌐 Language", value: "EN", inline: true },
                    { name: "🟢 Status", value: "ONLINE", inline: true }
                );
        }

        await channel.send({ embeds: [embed] });
        console.log(chalk.greenBright(`🆕 Joined server: ${guild.name}`));
    } catch (err) {
        console.error(chalk.red("❌ Guild join error:"), err);
    }
});

// 💬 COMMAND HANDLER (NO AUTOMOD)
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const prefix = "!";
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // 🤖 AI COMMAND (ADDED)
    if (commandName === "ai") {
        const prompt = args.join(" ");
        if (!prompt) {
            return message.reply("❌ Napisz coś po `!ai`");
        }

        try {
            await message.channel.sendTyping();

            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "If the user writes in Polish, reply in Polish. Otherwise reply in English."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 600
            });

            return message.reply(response.choices[0].message.content);
        } catch (err) {
            console.error("❌ AI ERROR:", err);
            return message.reply("❌ AI error (API / billing)");
        }
    }

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (err) {
        console.error(chalk.red("❌ Command error:"), err);
    }
});

// 🔐 Login
client.login(process.env.DISCORD_BOT_TOKEN);
