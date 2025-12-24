const { EmbedBuilder } = require("discord.js");

let channelData = {};

module.exports = {
    data: {
        name: "addgame",
        description: "Add a game to a channel's game embed"
    },
    async execute(message, args) {

        if (args.length < 2)
            return message.reply("❌ Use: `!addgame gamename image(optional) #channel`");

        const gameName = args[0];
        let image = null;
        let channel = null;

        for (let i = args.length - 1; i >= 1; i--) {
            const maybeChannel = message.mentions.channels.first();
            if (maybeChannel) {
                channel = maybeChannel;
                args.pop();
                break;
            }
        }

        if (!channel)
            return message.reply("❌ You must mention a channel at the end: `!addgame game url #channel`");

        if (args[1]) image = args[1];

        if (!channelData[channel.id]) {
            channelData[channel.id] = {
                games: [],
                messageId: null
            };
        }

        channelData[channel.id].games.push({
            name: gameName,
            image: image
        });

        let desc = "";
        for (let g of channelData[channel.id].games) {
            desc += `🎮 **${g.name}**`;
            if (g.image) desc += `\n📸 ${g.image}`;
            desc += `\n\n`;
        }

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("🎮 Game List")
            .setDescription(desc)
            .setTimestamp();

        if (!channelData[channel.id].messageId) {
            const msg = await channel.send({ embeds: [embed] });
            channelData[channel.id].messageId = msg.id;

            return message.reply(`✅ Created new game embed in ${channel} and added **${gameName}**`);
        }

        try {
            const msg = await channel.messages.fetch(channelData[channel.id].messageId);
            await msg.edit({ embeds: [embed] });

            return message.reply(`✅ Added **${gameName}** to the existing embed in ${channel}`);
        } catch {
            const msg = await channel.send({ embeds: [embed] });
            channelData[channel.id].messageId = msg.id;

            return message.reply(`⚠️ Old embed missing. Recreated new embed and added **${gameName}**.`);
        }
    }
};
