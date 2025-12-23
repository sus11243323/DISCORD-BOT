# Discord Moderation Bot

## Overview
A comprehensive Discord moderation bot built with Discord.js featuring 60+ powerful commands for server management, moderation, utility, and fun.

## Current State
Bot is fully operational and connected to Discord.

## Recent Changes (December 15, 2025)
- Added 10 new moderation commands: unban, slowmode, mute, unmute, softban, nuke, clear, warnings, clearwarnings, modlog
- Added 10 fun commands: coinflip, dice, avatar, banner, fortune, joke, quote, rps, emoji, hug
- Added 10 utility commands: afk, remind, embed, nickname, quickpoll, ping, uptime, invite, botinfo, membercount
- Updated warn.js to use persistent JSON storage
- Updated help command with categorized command list
- Created data directory for persistent storage (warnings, AFK, modlog settings)

## Project Architecture
- **index.js** - Main bot file with command handler and event listeners
- **commands/** - Directory containing 60 bot commands
- **data/** - Directory for persistent data storage (warnings.json, afk.json, modlog.json)
- **README.md** - Setup instructions and command documentation

## Commands Summary (60+ total)

### Moderation (18 commands)
- ban, unban, kick, mute, unmute, timeout, removetimeout
- warn, warnings, clearwarnings
- softban, purge, clear, nuke
- lock, unlock, slowmode, modlog

### Utility (16 commands)
- announce, role, nickname, embed, quickpoll, createpoll
- dm, afk, remind
- serverinfo, userinfo, membercount, botinfo
- ping, uptime, invite

### Fun (19 commands)
- coinflip, dice, rps, magic8ball, fortune, joke, quote
- ship, hug, avatar, banner, emoji
- story, bless, target, susrate, gamerate, randomaward, speedtest

### Bot Management (6 commands)
- changestatus, changebotname, resetbotname
- automod, trackuser, addgame

## Features
- Permission-based command access
- Role hierarchy respect
- Persistent warning system with auto-punishment
- AFK system with mention notifications
- Modlog channel for action tracking
- Embed messages with rich formatting
- Colorful console output with loading animation
- Auto-moderation capabilities

## Dependencies
- discord.js - Discord API wrapper
- chalk - Colorful console output
- Node.js 20

## Data Storage
- **data/warnings.json** - User warnings per guild
- **data/afk.json** - AFK status for users
- **data/modlog.json** - Modlog channel settings per guild
