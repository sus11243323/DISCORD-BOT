# Discord Moderation Bot

A powerful Discord bot with moderation and utility commands.

## 🚀 Setup Instructions

### 1. Enable Required Intents
Go to the [Discord Developer Portal](https://discord.com/developers/applications):
1. Select your application
2. Go to the "Bot" section
3. Scroll down to "Privileged Gateway Intents"
4. Enable these intents:
   - ✅ **SERVER MEMBERS INTENT**
   - ✅ **MESSAGE CONTENT INTENT**
5. Click "Save Changes"

### 2. Invite the Bot
Generate an invite link with these permissions:
- Administrator (or specific permissions: Ban Members, Kick Members, Manage Messages, Manage Channels, Moderate Members, Manage Roles)

Invite URL template:
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot
```

Replace `YOUR_CLIENT_ID` with your bot's Client ID from the Developer Portal.

## 📋 Commands

All commands use the `!` prefix.

### Moderation Commands
- **!announce #channel <message>** - Send an announcement to a specific channel
- **!ban @user [reason]** - Ban a user from the server
- **!kick @user [reason]** - Kick a user from the server
- **!timeout @user <duration> [reason]** - Timeout a user (e.g., `!timeout @user 10m Spamming`)
- **!warn @user [reason]** - Warn a user and track their warning history
- **!purge <number>** - Delete up to 100 messages from a channel
- **!lock [#channel]** - Lock a channel (prevents sending messages)
- **!unlock [#channel]** - Unlock a channel

### Utility Commands
- **!serverinfo** - Display server statistics and information
- **!userinfo [@user]** - Show information about a user
- **!role add/remove @user <role name>** - Manage user roles
- **!help** - Display all available commands

## 🔒 Required Permissions

Commands require these Discord permissions:
- **Announce**: Manage Messages
- **Ban**: Ban Members
- **Kick**: Kick Members
- **Timeout**: Moderate Members
- **Lock/Unlock**: Manage Channels
- **Purge**: Manage Messages
- **Warn**: Moderate Members
- **Role**: Manage Roles

## ⏱️ Timeout Durations
When using the timeout command, use these formats:
- `30s` - 30 seconds
- `10m` - 10 minutes
- `2h` - 2 hours
- `1d` - 1 day

## 🎯 Examples

```
!announce #general Welcome to our server!
!ban @spammer Repeated spam violations
!timeout @user 30m Inappropriate language
!kick @troublemaker Breaking server rules
!purge 50
!lock #off-topic
!warn @user Please follow the rules
!role add @user Moderator
!serverinfo
!userinfo @member
```

## 📝 Notes
- The bot respects role hierarchy - you cannot moderate users with higher roles
- Messages older than 14 days cannot be bulk deleted with !purge
- Warning data is stored in memory and resets when the bot restarts
