const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'schedule',
        description: 'Schedule a message to be sent at a specific time (admin-only).'
    },

    async execute(message, args) {
        if (!message.member.permissions.has('Administrator')) 
            return message.reply('❌ You need Administrator permission to use this command.');

        if (args.length < 3) 
            return message.reply('❌ Usage: !schedule #channel HH:MM Your message here');

        // Get the channel
        const channel = message.mentions.channels.first();
        if (!channel) return message.reply('❌ Please mention a valid channel.');

        // Parse the time
        const timeParts = args[1].split(':');
        if (timeParts.length !== 2) return message.reply('❌ Time must be in HH:MM format.');

        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);
        if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            return message.reply('❌ Invalid time.');
        }

        // Get the message content
        const scheduledMessage = args.slice(2).join(' ');
        if (!scheduledMessage) return message.reply('❌ Please provide a message to send.');

        // Calculate the delay
        const now = new Date();
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0, 0);

        // If time has passed, schedule for tomorrow
        if (scheduledTime <= now) scheduledTime.setDate(scheduledTime.getDate() + 1);
        const delay = scheduledTime - now;

        // Confirmation embed
        const embed = new EmbedBuilder()
            .setTitle('✅ Message Scheduled')
            .setDescription(`Your message will be sent in ${channel} at **${scheduledTime.toLocaleTimeString()}**`)
            .setColor('#5865F2')
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

        // Schedule the message
        setTimeout(() => {
            channel.send(scheduledMessage);
        }, delay);
    }
};
