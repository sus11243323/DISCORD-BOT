/* =========================
   🔧 CORE IMPORTS
========================= */
const express = require("express");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const os = require("os");

/* =========================
   🔎 ENV DEBUG (SAFE)
========================= */
console.log("🔍 Token present:", Boolean(process.env.DISCORD_BOT_TOKEN));
console.log("📂 App directory:", __dirname);

// ➕ ADDED: Startup banner with ASCII and slow 15s cinematic loading
const asciiArt = `
                     ##################                     
                %###********************###%%%              
             ###***********#####***++=======+*%             
         @%%######**++=-::--=++****++++====***#%#          
    %##*=-:-=+**#****+=:.......  . ..    ...***%###        
    #:****:............ ....  ...          ...-#**%**##      
    %.****.  ............          ..++++++++   
  #+-+++.  ...-----++--....      ...++#+++++  
 #++-+++.  ...++####++++-......    .-++
`;

const bootInfo = [
  "Initializing kernel modules...",
  "Loading system services...",
  "Connecting to Discord gateway...",
  `Public URL: ${process.env.HOST || "https://discord-bot-17z4.onrender.com"}`,
  "Authenticating client...",
  "Starting uptime server...",
  "Finalizing startup...",
  "Boot complete ✅"
];

(async () => {
  console.clear();
  console.log(chalk.cyan(asciiArt));

  for (let i = 0; i < bootInfo.length; i++) {
    await new Promise(r => setTimeout(r, 1500)); // 1.5 sec per line = ~12s
    console.log(chalk.green(bootInfo[i]));
  }

  await new Promise(r => setTimeout(r, 3000)); // final 3s pause for total ~15s
})();

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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Render And Uptime Happy 😊");
  console.log(chalk.green(`🌐 Express listening on ${PORT}`));
});

/* =========================
   🔁 SAFE SELF PING (NO CRASH)
========================= */
setInterval(async () => {
  try {
    const projectUrl = `https://${process.env.HOST || "your-project-name.onrender.com"}`;
    await fetch(projectUrl);
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
    // GatewayIntentBits.GuildPresences ❌ COMMENT THIS
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();

// ➕ ADDED: Discord lifecycle logs
client.on("debug", d => console.log(chalk.gray("🧪 Discord debug:"), d));
client.on("warn", w => console.log(chalk.yellow("⚠️ Discord warn:"), w));
client.on("error", e => console.log(chalk.red("❌ Discord error:"), e));

client.on("shardReady", id => {
  console.log(chalk.green(`🧩 Shard ${id} ready`));
});

client.on("shardDisconnect", (_, id) => {
  console.log(chalk.red(`🔌 Shard ${id} disconnected`));
});

client.on("shardReconnecting", id => {
  console.log(chalk.yellow(`🔄 Shard ${id} reconnecting`));
});

/* =========================
   🧠 OPENAI (SAFE INIT)
========================= */
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
    status: "dnd",
    activities: [{ name: "Moderating GWS ✔️", type: 4 }]
  });
});

// ➕ ADDED: Extra ready confirmation
client.on("ready", () => {
  console.log(chalk.green("🎉 Discord session fully established"));
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

    // --- AI Command ---
    if (commandName === "ai") {
      if (!openai) return message.reply("❌ AI is disabled.");

      const prompt = args.join(" ");
      if (!prompt) return message.reply("❌ Write something after `!ai`");

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

    // --- URL Command ---
    if (commandName === "url") {
      try {
        const url = process.env.HOST || "URL not found";
        return message.reply(`🌐 My public URL is: ${url}`);
      } catch (err) {
        console.error("❌ URL command error (ignored):", err);
        return message.reply("❌ Could not fetch the URL!");
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

// ➕ ADDED: Token sanity warning
if (process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_BOT_TOKEN.length < 50) {
  console.log("⚠️ Token length looks suspicious");
}

/* =========================
   🔐 LOGIN (SAFE)
========================= */
console.log("🔐 Preparing Discord login…");

if (!process.env.DISCORD_BOT_TOKEN) {
  console.error("❌ DISCORD_BOT_TOKEN missing — bot not logged in");
} else {
  client.login(process.env.DISCORD_BOT_TOKEN)
    .catch(err => console.error("❌ Login failed (ignored):", err));
}

// ➕ ADDED: Heartbeat (Render visibility)
setInterval(() => {
  const date = new Date().toLocaleTimeString();
  console.log(
    chalk.magenta(`[${date}] 💓 Heartbeat | WS: ${client.ws.status} | Guilds: ${client.guilds.cache.size}`)
  );
}, 60 * 1000);

/* =====================================================
   🐧 ADD-ONLY LINUX SERVICE + LOGIN REPAIR (NEW CODE)
===================================================== */
function linux(icon, name, msg, color = "white") {
  const t = new Date().toISOString().split("T")[1].split(".")[0];
  console.log(chalk[color](`[ ${t} ] ${icon} ${name.padEnd(12)} │ ${msg}`));
}

console.log(chalk.gray("\n────────────────────────────────────────"));
console.log(chalk.cyan.bold(" discord.service • kornet.lat"));
console.log(chalk.gray("────────────────────────────────────────\n"));

linux("🖥️", "SYSTEM", `${os.type()} ${os.release()} ${os.arch()}`, "cyan");
linux("⚙️", "NODE", process.version, "cyan");
linux("📦", "PID", process.pid.toString(), "cyan");

/* 🔧 Gateway hang repair (Render-safe) */
setTimeout(() => {
  if (!client.isReady()) {
    linux("🚨", "GATEWAY", "Login stalled — forcing restart", "red");
    process.exit(1);
  }
}, 25_000);

/* 📡 Live gateway monitor */
setInterval(() => {
  const map = {
    0: "READY",
    1: "CONNECTING",
    2: "RECONNECTING",
    3: "IDLE",
    4: "NEARLY",
    5: "DISCONNECTED"
  };

  linux(
    "📡",
    "GATEWAY",
    `Status=${map[client.ws.status] ?? "UNKNOWN"} | Ping=${client.ws.ping}ms`,
    client.isReady() ? "green" : "yellow"
  );
}, 30_000);

/* 🔌 Hard Discord diagnostics */
client.on("invalidated", () => {
  linux("💀", "DISCORD", "Session invalidated (token revoked)", "red");
});

client.on("disconnect", () => {
  linux("🔌", "DISCORD", "Disconnected from gateway", "red");
});

client.on("reconnecting", () => {
  linux("🔄", "DISCORD", "Reconnecting…", "yellow");
});

client.on("rateLimit", info => {
  linux("⏱️", "RATELIMIT", `${info.method} ${info.path}`, "yellow");
});

/* 🟢 Extra ready confirmation */
client.on("ready", () => {
  linux("✅", "READY", `Online as ${client.user.tag}`, "green");
  linux("📡", "PING", `${client.ws.ping}ms`, "green");
});

/* =========================
   🔔 EXTRA FEATURES
========================= */
// System stats logger every 10 min
setInterval(() => {
  const uptime = (process.uptime() / 60).toFixed(1);
  const memUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
  const cpu = os.loadavg()[0].toFixed(2);
  linux("📊", "STATS", `Uptime: ${uptime}m | CPU Load: ${cpu} | RAM: ${memUsage}MB`, "cyan");
}, 10 * 60 * 1000);
