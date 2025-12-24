const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: "dm",
    description: "Send a DM to a user by ID (Usage: !dm [userID] [message])"
  },
  async execute(message, args) {
    console.log(`📨 DM command used by ${message.author.tag}`);

    const userID = args[0];
    const msgContent = args.slice(1).join(" ");

    if (!userID || !msgContent) {
      const errorEmbed = new EmbedBuilder()
        .setColor("#FF2E63")
        .setAuthor({
          name: "🚫 Missing Arguments",
          iconURL: "https://cdn-icons-png.flaticon.com/512/463/463612.png"
        })
        .setDescription([
          "⚠️ You must provide both a **user ID** and a **message**.",
          "",
          "```Usage: !dm [userID] [message]```",
          "💡 *Example:* `!dm 123456789012345678 Hello there!`"
        ].join("\n"))
        .addFields({ name: "🧩 Error Code", value: "`DM_ERR_001`", inline: true })
        .setFooter({ text: "Syntax validation failed." })
        .setTimestamp();

      await message.reply({ embeds: [errorEmbed] });
      console.log("⚠️ Missing arguments - DM not sent.");
      return;
    }

    try {
      const user = await message.client.users.fetch(userID);

      const dmEmbed = new EmbedBuilder()
        .setColor("#00FFC6")
        .setAuthor({
          name: "📬 You've Got a New Message!",
          iconURL: "https://cdn-icons-png.flaticon.com/512/2099/2099058.png"
        })
        .setDescription([
          "╭──────────────────────────────╮",
          `**💬 Message:**\n> ${msgContent}`,
          "╰──────────────────────────────╯",
          "",
          `👤 **From:** ${message.author.tag}`,
          `🕒 **Sent:** <t:${Math.floor(Date.now() / 1000)}:R>`
        ].join("\n"))
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: "🔐 Delivered via Secure DM System" })
        .setTimestamp();

      await user.send({ embeds: [dmEmbed] });

      const successEmbed = new EmbedBuilder()
        .setColor("#5865F2")
        .setAuthor({
          name: "✅ DM Sent Successfully",
          iconURL: "https://cdn-icons-png.flaticon.com/512/190/190411.png"
        })
        .setDescription([
          "✨ **Your message has been sent successfully!**",
          "",
          "━━━━━━━━━━━━━━━━━━━━━━━━━",
          `**👤 Sender:** ${message.author.tag} (\`${message.author.id}\`)`,
          `**🎯 Recipient:** ${user.tag} (\`${user.id}\`)`,
          "━━━━━━━━━━━━━━━━━━━━━━━━━",
          `💬 **Message Preview:**\n> ${msgContent}`
        ].join("\n"))
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: "✅ Message successfully delivered." })
        .setTimestamp();

      await message.reply({ embeds: [successEmbed] });
      console.log(`✅ DM successfully sent to ${user.tag} (${user.id})`);

    } catch (error) {
      console.error("❌ DM Failed:", error);

      const failEmbed = new EmbedBuilder()
        .setColor("#E63946")
        .setAuthor({
          name: "💥 DM Delivery Failed",
          iconURL: "https://cdn-icons-png.flaticon.com/512/463/463612.png"
        })
        .setDescription([
          "😔 I couldn't deliver the message.",
          "",
          "━━━━━━━━━━━━━━━━━━━━━━━━━",
          "• The user might have DMs disabled.",
          "• The ID may not belong to a valid user.",
          "━━━━━━━━━━━━━━━━━━━━━━━━━",
          "",
          `**Error Message:**\n\`\`\`${error.message}\`\`\``
        ].join("\n"))
        .setFooter({ text: "Check the user ID or their DM settings." })
        .setTimestamp();

      await message.reply({ embeds: [failEmbed] });
    }
  }
};
