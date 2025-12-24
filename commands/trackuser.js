const axios = require("axios");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

// Enhanced Configuration
const CACHE_MS = 90 * 1000;
const COOLDOWN_MS = 6 * 1000;
const PREMIUM_COOLDOWN_MS = 3 * 1000;

const cacheByQuery = new Map();
const cacheById = new Map();
const cooldowns = new Map();
const userHistory = new Map();

// Utility functions
function timeAgo(date) {
  if (!date) return "Unknown";
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s} second${s === 1 ? "" : "s"} ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} minute${m === 1 ? "" : "s"} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo} month${mo === 1 ? "" : "s"} ago`;
  const y = Math.floor(mo / 12);
  return `${y} year${y === 1 ? "" : "s"} ago`;
}

function accountAge(date) {
  if (!date) return "Unknown";
  const created = new Date(date);
  const diff = Date.now() - created.getTime();
  const years = Math.floor(diff / 1000 / 60 / 60 / 24 / 365);
  const days = Math.floor(diff / 1000 / 60 / 60 / 24);
  const months = Math.floor(days / 30);

  if (years > 0) return `${years} year${years === 1 ? "" : "s"} (${days} days)`;
  if (months > 0) return `${months} month${months === 1 ? "" : "s"} (${days} days)`;
  return `${days} day${days === 1 ? "" : "s"}`;
}

function formatNumber(num) {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
}

function getStatusEmoji(presenceType, isBanned = false) {
  if (isBanned) return "🚫";
  const emojis = {
    1: "🟢", // Online
    2: "🎮", // In Game
    3: "🧱", // In Studio
    4: "⚫", // Invisible
  };
  return emojis[presenceType] || "🔴";
}

// Enhanced safe fetch with better error handling
async function safeFetch(opts, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await axios({
        timeout: 10000,
        validateStatus: () => true,
        ...opts
      });

      if (res.status === 429) {
        const wait = Number(res.headers?.["retry-after"]) || Math.pow(2, i) + 1;
        await new Promise(r => setTimeout(r, wait * 1000));
        continue;
      }

      if (res.status >= 400) {
        if (i === attempts - 1) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        continue;
      }

      return res.data;
    } catch (err) {
      if (i === attempts - 1) throw err;
      const wait = Math.pow(2, i) * 1000;
      await new Promise(r => setTimeout(r, wait));
    }
  }
}

// Enhanced user resolution
async function resolveUserId(raw) {
  const cleanQuery = raw.trim();

  if (/^\d+$/.test(cleanQuery)) return cleanQuery;

  const methods = [
    async () => {
      try {
        const res = await safeFetch({
          method: "post",
          url: "https://users.roblox.com/v1/usernames/users",
          data: { usernames: [cleanQuery] },
          headers: { "Content-Type": "application/json" }
        });
        return res?.data?.[0]?.id;
      } catch (e) {
        return null;
      }
    },
    async () => {
      try {
        const res = await safeFetch({
          method: "get",
          url: `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(cleanQuery)}&limit=10`
        });
        return res?.data?.[0]?.id;
      } catch (e) {
        return null;
      }
    }
  ];

  for (const method of methods) {
    try {
      const userId = await method();
      if (userId) return String(userId);
    } catch (e) {
      continue;
    }
  }

  throw new Error(`User "${cleanQuery}" not found`);
}

// NEW: Enhanced game developer detection with top games
async function detectGameDeveloper(userId) {
  try {
    // Get user's created games
    const userGames = await safeFetch({
      method: "get",
      url: `https://games.roblox.com/v2/users/${userId}/games?accessFilter=Public&limit=100`
    }).catch(() => ({ data: [] }));

    const games = userGames.data || [];

    if (games.length === 0) {
      return { 
        isDeveloper: false, 
        reason: "No public games created", 
        games: [],
        topGames: []
      };
    }

    // Sort games by visits (most visited first)
    const sortedGames = games
      .filter(game => game.placeVisits !== undefined)
      .sort((a, b) => (b.placeVisits || 0) - (a.placeVisits || 0))
      .slice(0, 10); // Top 10 most visited games

    // Calculate total metrics
    let totalVisits = 0;
    let totalFavorites = 0;
    let totalPlaying = 0;
    let successfulGames = 0;
    let mostPopularGame = null;

    games.forEach(game => {
      totalVisits += game.placeVisits || 0;
      totalFavorites += game.favoritedCount || 0;
      totalPlaying += game.playing || 0;

      // Check if game meets success criteria
      if ((game.placeVisits || 0) >= 1000) {
        successfulGames++;
      }

      // Track most popular game
      if (!mostPopularGame || (game.placeVisits || 0) > (mostPopularGame.placeVisits || 0)) {
        mostPopularGame = game;
      }
    });

    // Developer criteria
    const criteria = {
      totalVisits,
      totalGames: games.length,
      successfulGames,
      has1000Visits: successfulGames > 0,
      hasMultipleGames: games.length >= 2,
      hasPopularGame: mostPopularGame && (mostPopularGame.placeVisits || 0) >= 5000,
      totalFavorites,
      averageVisits: totalVisits / games.length
    };

    // Determine developer status
    let isDeveloper = false;
    let developerLevel = "None";
    let reason = "";

    if (criteria.has1000Visits) {
      isDeveloper = true;

      if (criteria.totalVisits >= 1000000) {
        developerLevel = "Professional Developer";
        reason = `🎯 ${formatNumber(criteria.totalVisits)}+ total visits across ${criteria.totalGames} games`;
      } else if (criteria.totalVisits >= 100000) {
        developerLevel = "Experienced Developer";
        reason = `⭐ ${formatNumber(criteria.totalVisits)}+ total visits with ${criteria.successfulGames} successful games`;
      } else if (criteria.totalVisits >= 10000) {
        developerLevel = "Skilled Developer";
        reason = `📊 ${formatNumber(criteria.totalVisits)}+ visits and ${criteria.totalGames} games created`;
      } else {
        developerLevel = "Game Developer";
        reason = `🎮 ${criteria.successfulGames} game(s) with 1,000+ visits`;
      }
    } else if (criteria.totalGames >= 3) {
      isDeveloper = true;
      developerLevel = "Aspiring Developer";
      reason = `🛠️ ${criteria.totalGames} games created (gaining experience)`;
    } else if (criteria.totalGames > 0) {
      developerLevel = "Beginner Creator";
      reason = `🔧 ${criteria.totalGames} game(s) created`;
    }

    // Prepare top games for display
    const topGamesDisplay = sortedGames.slice(0, 5).map((game, index) => ({
      rank: index + 1,
      name: game.name,
      visits: game.placeVisits || 0,
      favorites: game.favoritedCount || 0,
      playing: game.playing || 0,
      created: game.created,
      url: `https://www.roblox.com/games/${game.id}`,
      isPopular: (game.placeVisits || 0) >= 1000
    }));

    return {
      isDeveloper,
      developerLevel,
      reason,
      stats: {
        totalGames: criteria.totalGames,
        totalVisits: criteria.totalVisits,
        successfulGames: criteria.successfulGames,
        totalFavorites: criteria.totalFavorites,
        totalPlaying: criteria.totalPlaying,
        averageVisits: Math.round(criteria.averageVisits),
        mostVisitedGame: mostPopularGame ? {
          name: mostPopularGame.name,
          visits: mostPopularGame.placeVisits || 0
        } : null
      },
      topGames: topGamesDisplay,
      allGames: sortedGames
    };
  } catch (error) {
    console.warn("[trackuser] Game developer detection failed:", error.message);
    return { 
      isDeveloper: false, 
      reason: "Error checking developer status", 
      games: [],
      topGames: []
    };
  }
}

// NEW: Format top games for display in embed
function formatTopGames(topGames, maxGames = 5) {
  if (!topGames || topGames.length === 0) return null;

  const displayGames = topGames.slice(0, maxGames);

  const gamesText = displayGames.map(game => {
    const rankEmoji = game.rank === 1 ? "🥇" : game.rank === 2 ? "🥈" : game.rank === 3 ? "🥉" : `**${game.rank}.**`;
    const popularBadge = game.isPopular ? " ✅" : "";
    return `${rankEmoji} [${game.name}](${game.url}) - **${formatNumber(game.visits)}** visits${popularBadge}`;
  }).join('\n');

  return {
    name: `🏆 Top Games (by visits)`,
    value: gamesText,
    inline: false
  };
}

// NEW: Enhanced game detection using Games API
async function getGameDetails(universeId, placeId) {
  try {
    const [gameDetails, placeDetails, gameVotes, servers] = await Promise.all([
      safeFetch({
        method: "get",
        url: `https://games.roblox.com/v1/games?universeIds=${universeId}`
      }).catch(() => ({ data: [] })),

      safeFetch({
        method: "get",
        url: `https://games.roblox.com/v1/games/multiget-place-details?placeIds=${placeId}`
      }).catch(() => []),

      safeFetch({
        method: "get",
        url: `https://games.roblox.com/v1/games/votes?universeIds=${universeId}`
      }).catch(() => ({ data: [] })),

      safeFetch({
        method: "get",
        url: `https://games.roblox.com/v1/games/${placeId}/servers/0?limit=10&sortOrder=2`
      }).catch(() => ({ data: [] }))
    ]);

    const game = gameDetails.data?.[0];
    const place = Array.isArray(placeDetails) ? placeDetails[0] : placeDetails;
    const votes = gameVotes.data?.[0];
    const serverList = servers.data || [];

    if (!game && !place) return null;

    return {
      id: universeId,
      placeId: placeId,
      name: game?.name || place?.name,
      description: game?.description || place?.description,
      creator: game?.creator,
      playing: game?.playing || 0,
      visits: game?.visits || place?.visits || 0,
      maxPlayers: game?.maxPlayers || 0,
      created: game?.created,
      updated: game?.updated,
      genre: game?.genre,
      isAllGenre: game?.isAllGenre,
      price: game?.price || place?.price,
      favoriteCount: game?.favoritedCount,
      upVotes: votes?.upVotes,
      downVotes: votes?.downVotes,
      servers: serverList,
      rootPlaceId: game?.rootPlaceId,
      sourceName: game?.sourceName,
      sourceDescription: game?.sourceDescription,
      url: `https://www.roblox.com/games/${placeId}`,
      imageToken: place?.imageToken,
      isPopularGame: (game?.visits || 0) >= 1000,
      developerStatus: (game?.visits || 0) >= 1000 ? "✅ Verified Game" : "🟡 New Game"
    };
  } catch (error) {
    console.warn("[trackuser] Game details fetch failed:", error.message);
    return null;
  }
}

// NEW: Get detailed server information
async function getServerDetails(placeId) {
  try {
    const [publicServers, privateServers] = await Promise.all([
      safeFetch({
        method: "get",
        url: `https://games.roblox.com/v1/games/${placeId}/servers/0?limit=5&sortOrder=2&excludeFullGames=true`
      }).catch(() => ({ data: [] })),
      safeFetch({
        method: "get",
        url: `https://games.roblox.com/v1/games/${placeId}/private-servers?limit=5`
      }).catch(() => ({ data: [] }))
    ]);

    const publicServerList = publicServers.data || [];
    const privateServerList = privateServers.data || [];

    return {
      publicServers: publicServerList,
      privateServers: privateServerList,
      totalPublicPlayers: publicServerList.reduce((sum, server) => sum + (server.playing || 0), 0),
      totalPrivatePlayers: privateServerList.reduce((sum, server) => sum + (server.playing || 0), 0),
      totalServers: publicServerList.length + privateServerList.length
    };
  } catch (error) {
    console.warn("[trackuser] Server details fetch failed:", error.message);
    return { publicServers: [], privateServers: [], totalPublicPlayers: 0, totalPrivatePlayers: 0, totalServers: 0 };
  }
}

// NEW: Enhanced presence with game detection
async function getEnhancedPresence(userId) {
  try {
    const presence = await safeFetch({
      method: "post",
      url: "https://presence.roblox.com/v1/presence/users",
      data: { userIds: [Number(userId)] },
      headers: { "Content-Type": "application/json" }
    });

    const presenceObj = presence?.userPresences?.[0];
    if (!presenceObj) return null;

    let gameInfo = null;
    let serverInfo = null;

    if (presenceObj.userPresenceType === 2 && presenceObj.placeId && presenceObj.universeId) {
      const [gameDetails, serverDetails] = await Promise.all([
        getGameDetails(presenceObj.universeId, presenceObj.placeId),
        getServerDetails(presenceObj.placeId)
      ]);

      gameInfo = gameDetails;
      serverInfo = serverDetails;

      if (gameInfo && serverDetails.publicServers) {
        const userServer = serverDetails.publicServers.find(server => 
          server.players?.some(player => player.id === Number(userId))
        );
        if (userServer) {
          gameInfo.currentServer = userServer;
        }
      }
    }

    return { 
      presence: presenceObj, 
      gameInfo,
      serverInfo,
      lastLocation: presenceObj.lastLocation || "Unknown"
    };
  } catch (e) {
    console.warn("[trackuser] Enhanced presence fetch failed:", e.message);
    return null;
  }
}

// NEW: Enhanced fake admin detection
async function detectFakeAdmin(userId, profile, badges) {
  const redFlags = [];

  const accountAge = profile.created ? (Date.now() - new Date(profile.created).getTime()) / (1000 * 60 * 60 * 24) : 0;
  if (accountAge < 30) {
    redFlags.push("New account (<30 days)");
  }

  const suspiciousBadges = badges.filter(badge => 
    badge.name.toLowerCase().includes('administrator') ||
    badge.name.toLowerCase().includes('owner') ||
    badge.name.toLowerCase().includes('founder') ||
    badge.name.toLowerCase().includes('ceo') ||
    badge.name.toLowerCase().includes('staff') &&
    !badge.name.toLowerCase().includes('roblox')
  );

  if (suspiciousBadges.length > 0) {
    redFlags.push("Suspicious badge names");
  }

  try {
    const followers = await safeFetch({
      method: "get",
      url: `https://friends.roblox.com/v1/users/${userId}/followers/count`
    }).catch(() => ({ count: 0 }));

    if (followers.count < 100 && suspiciousBadges.length > 0) {
      redFlags.push("Low follower count for admin");
    }
  } catch (e) {}

  const hasVerifiedBadge = badges.some(badge => 
    badge.name.toLowerCase().includes('verified') ||
    badge.name.toLowerCase().includes('official')
  );

  if (!hasVerifiedBadge && suspiciousBadges.length > 0) {
    redFlags.push("No verification badges");
  }

  return redFlags;
}

// NEW: Proper Roblox admin detection
async function getAdminStatus(userId, profile) {
  try {
    const officialStaffIds = [
      "1", "2", "10", "343", "344", "345", "1337"
    ];

    if (officialStaffIds.includes(userId)) {
      return "👑 Roblox Staff";
    }

    const badges = await safeFetch({
      method: "get",
      url: `https://badges.roblox.com/v1/users/${userId}/badges?limit=100`
    }).catch(() => ({ data: [] }));

    const userBadges = badges.data || [];

    const fakeFlags = await detectFakeAdmin(userId, profile, userBadges);

    if (fakeFlags.length > 2) {
      return "⚠️ Likely Fake Admin";
    }

    const staffLikeBadges = userBadges.filter(badge => 
      badge.name.toLowerCase().includes('admin') ||
      badge.name.toLowerCase().includes('staff') ||
      badge.name.toLowerCase().includes('moderator') ||
      badge.name.toLowerCase().includes('owner') ||
      badge.name.toLowerCase().includes('founder') ||
      badge.name.toLowerCase().includes('developer')
    );

    if (staffLikeBadges.length > 0) {
      return "⚡ Game Staff";
    }

    return "❌ No";

  } catch (error) {
    console.warn("[trackuser] Admin status check failed:", error.message);
    return "❓ Unknown";
  }
}

// NEW: Get user's previous names
async function getPreviousUsernames(userId) {
  try {
    const res = await safeFetch({
      method: "get",
      url: `https://users.roblox.com/v1/users/${userId}/username-history?limit=5`
    });
    return res?.data?.map(entry => entry.name) || [];
  } catch (e) {
    return [];
  }
}

// NEW: Get user's assets and creations
async function getUserAssets(userId) {
  try {
    const [assets, creations] = await Promise.all([
      safeFetch({
        method: "get",
        url: `https://inventory.roblox.com/v2/users/${userId}/inventory?assetTypes=Hat&limit=10`
      }).catch(() => ({ data: [] })),
      safeFetch({
        method: "get",
        url: `https://games.roblox.com/v2/users/${userId}/games?accessFilter=Public&limit=5`
      }).catch(() => ({ data: [] }))
    ]);

    return {
      assetCount: assets.data?.length || 0,
      creations: creations.data || []
    };
  } catch (e) {
    return { assetCount: 0, creations: [] };
  }
}

// NEW: Get user's premium and economy status
async function getEconomyStatus(userId) {
  try {
    const [robux, premium] = await Promise.all([
      safeFetch({
        method: "get",
        url: `https://economy.roblox.com/v1/users/${userId}/currency`
      }).catch(() => ({ robux: 0 })),
      safeFetch({
        method: "get",
        url: `https://premiumfeatures.roblox.com/v1/users/${userId}/premium-membership`
      }).catch(() => ({ hasMembership: false }))
    ]);

    return {
      robux: robux.robux || 0,
      hasPremium: premium.hasMembership || false
    };
  } catch (e) {
    return { robux: 0, hasPremium: false };
  }
}

// NEW: Create interactive buttons
function createActionButtons(userId, username, hasGame = false, gameUrl = null, isDeveloper = false) {
  const buttons = [
    new ButtonBuilder()
      .setLabel('Profile')
      .setURL(`https://www.roblox.com/users/${userId}/profile`)
      .setStyle(ButtonStyle.Link),
    new ButtonBuilder()
      .setLabel('Avatar')
      .setURL(`https://www.roblox.com/users/${userId}/avatar`)
      .setStyle(ButtonStyle.Link)
  ];

  if (hasGame && gameUrl) {
    buttons.push(
      new ButtonBuilder()
        .setLabel('Join Game')
        .setURL(gameUrl)
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel('Game Details')
        .setURL(gameUrl)
        .setStyle(ButtonStyle.Link)
    );
  }

  if (isDeveloper) {
    buttons.push(
      new ButtonBuilder()
        .setLabel('Developer Games')
        .setURL(`https://www.roblox.com/users/${userId}/creations`)
        .setStyle(ButtonStyle.Link)
    );
  }

  return new ActionRowBuilder().addComponents(buttons);
}

// NEW: Format game information for display
function formatGameInfo(gameInfo, serverInfo) {
  if (!gameInfo) return null;

  const fields = [];

  // Basic game info with developer status
  const gameTitle = gameInfo.isPopularGame ? 
    `🎮 ${gameInfo.name} ✅` : 
    `🎮 ${gameInfo.name}`;

  fields.push(
    { name: gameTitle, value: `[View Game](${gameInfo.url})`, inline: false },
    { name: "👥 Players", value: `**${formatNumber(gameInfo.playing)}** playing now`, inline: true },
    { name: "📊 Total Visits", value: `**${formatNumber(gameInfo.visits)}**`, inline: true },
    { name: "🎯 Max Players", value: `**${formatNumber(gameInfo.maxPlayers)}**`, inline: true }
  );

  // Game creator
  if (gameInfo.creator) {
    fields.push({
      name: "👤 Creator",
      value: `${gameInfo.creator.name}${gameInfo.creator.hasVerifiedBadge ? ' ✅' : ''}`,
      inline: true
    });
  }

  // Genre and price
  if (gameInfo.genre) {
    fields.push({ name: "🎪 Genre", value: gameInfo.genre, inline: true });
  }

  if (gameInfo.price && gameInfo.price > 0) {
    fields.push({ name: "💰 Price", value: `**${formatNumber(gameInfo.price)}** Robux`, inline: true });
  } else {
    fields.push({ name: "💰 Price", value: "**Free**", inline: true });
  }

  // Developer status for this game
  if (gameInfo.isPopularGame) {
    fields.push({
      name: "🏆 Game Status",
      value: "✅ **Popular Game** (1,000+ visits)",
      inline: true
    });
  }

  // Votes
  if (gameInfo.upVotes !== undefined && gameInfo.downVotes !== undefined) {
    const totalVotes = gameInfo.upVotes + gameInfo.downVotes;
    const likeRate = totalVotes > 0 ? ((gameInfo.upVotes / totalVotes) * 100).toFixed(1) : 0;
    fields.push({
      name: "👍 Votes",
      value: `**${formatNumber(gameInfo.upVotes)}** 👍 / **${formatNumber(gameInfo.downVotes)}** 👎 (${likeRate}%)`,
      inline: false
    });
  }

  // Favorites
  if (gameInfo.favoriteCount) {
    fields.push({ 
      name: "⭐ Favorites", 
      value: `**${formatNumber(gameInfo.favoriteCount)}**`, 
      inline: true 
    });
  }

  // Server information
  if (serverInfo) {
    fields.push({
      name: "🖥️ Servers",
      value: `**${serverInfo.totalServers}** servers (**${formatNumber(serverInfo.totalPublicPlayers)}** public, **${formatNumber(serverInfo.totalPrivatePlayers)}** private)`,
      inline: false
    });
  }

  // Created/Updated dates
  if (gameInfo.created) {
    fields.push({ 
      name: "📅 Created", 
      value: new Date(gameInfo.created).toLocaleDateString(), 
      inline: true 
    });
  }

  if (gameInfo.updated) {
    fields.push({ 
      name: "🔄 Updated", 
      value: timeAgo(new Date(gameInfo.updated)), 
      inline: true 
    });
  }

  return fields;
}

module.exports = {
  data: { name: "trackuser" },

  async execute(message, args) {
    const startTime = Date.now();
    let slowNotice;

    try {
      const caller = message.author.tag;
      const callerId = message.author.id;
      console.log(`[trackuser] triggered by ${caller} args=${args.join(" ")}`);

      // Enhanced cooldown with premium check
      const last = cooldowns.get(callerId) || 0;
      const now = Date.now();
      const cooldownTime = message.member?.premiumSince ? PREMIUM_COOLDOWN_MS : COOLDOWN_MS;

      if (now - last < cooldownTime) {
        const wait = ((cooldownTime - (now - last)) / 1000).toFixed(1);
        return message.reply({
          content: `🕒 Please wait ${wait}s before using this command again.${message.member?.premiumSince ? ' ⭐ Premium' : ''}`,
          ephemeral: true
        });
      }
      cooldowns.set(callerId, now);

      if (!args.length) {
        return message.reply("❌ Usage: `!trackuser <username|userId>`");
      }

      const rawQuery = args.join(" ").trim();
      const cacheKey = rawQuery.toLowerCase();

      // Cache check
      const cachedQ = cacheByQuery.get(cacheKey);
      if (cachedQ && now - cachedQ.ts < CACHE_MS) {
        console.log("[trackuser] returning cached (query)");
        const buttons = createActionButtons(cachedQ.userId, cachedQ.username, cachedQ.hasGame, cachedQ.gameUrl, cachedQ.isDeveloper);
        return message.reply({ 
          embeds: [cachedQ.embed],
          components: [buttons]
        });
      }

      // Show initial response
      const initialMsg = await message.reply(`🔍 **Fetching data for** \`${rawQuery}\`\n📊 *Please wait...*`);

      // Enhanced slow notice
      slowNotice = setTimeout(() => {
        message.channel.send("⏳ **Still gathering data...** This may take a moment...").catch(() => {});
      }, 5000);

      try {
        // Resolve user ID first
        const userId = await resolveUserId(rawQuery);
        console.log("[trackuser] resolved id:", userId);

        const cachedId = cacheById.get(userId);
        if (cachedId && now - cachedId.ts < CACHE_MS) {
          console.log("[trackuser] returning cached (id)");
          cacheByQuery.set(cacheKey, { ...cachedId, userId, username: rawQuery });
          const buttons = createActionButtons(userId, rawQuery, cachedId.hasGame, cachedId.gameUrl, cachedId.isDeveloper);
          clearTimeout(slowNotice);
          if (initialMsg.deletable) await initialMsg.delete().catch(() => null);
          return message.reply({ 
            embeds: [cachedId.embed],
            components: [buttons]
          });
        }

        // Track user search history
        const userSearches = userHistory.get(callerId) || [];
        userSearches.unshift({ query: rawQuery, userId, timestamp: now });
        userHistory.set(callerId, userSearches.slice(0, 10));

        // Parallel data fetching with error handling
        const [
          profileData,
          thumbData,
          previousNames,
          enhancedPresence,
          economyStatus,
          userAssets,
          followersRes,
          followingsRes,
          friendsRes,
          adminStatus,
          developerStatus  // NEW: Add developer detection
        ] = await Promise.allSettled([
          safeFetch({ method: "get", url: `https://users.roblox.com/v1/users/${userId}` }),
          safeFetch({ 
            method: "get", 
            url: `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false` 
          }),
          getPreviousUsernames(userId),
          getEnhancedPresence(userId),
          getEconomyStatus(userId),
          getUserAssets(userId),
          safeFetch({ 
            method: "get", 
            url: `https://friends.roblox.com/v1/users/${userId}/followers/count` 
          }),
          safeFetch({ 
            method: "get", 
            url: `https://friends.roblox.com/v1/users/${userId}/followings/count` 
          }),
          safeFetch({ 
            method: "get", 
            url: `https://friends.roblox.com/v1/users/${userId}/friends/count` 
          }),
          getAdminStatus(userId, await safeFetch({ method: "get", url: `https://users.roblox.com/v1/users/${userId}` })),
          detectGameDeveloper(userId)  // NEW: Check if user is a game developer
        ]);

        clearTimeout(slowNotice);

        // Process results with fallbacks
        const profile = profileData.status === 'fulfilled' ? profileData.value : null;
        if (!profile) {
          throw new Error("Could not fetch user profile");
        }

        const avatarUrl = thumbData.status === 'fulfilled' ? thumbData.value?.data?.[0]?.imageUrl : null;
        const presenceData = enhancedPresence.status === 'fulfilled' ? enhancedPresence.value : null;
        const presenceObj = presenceData?.presence;
        const gameInfo = presenceData?.gameInfo;
        const serverInfo = presenceData?.serverInfo;

        const followers = followersRes.status === 'fulfilled' ? (followersRes.value.count || 0) : 0;
        const followings = followingsRes.status === 'fulfilled' ? (followingsRes.value.count || 0) : 0;
        const friends = friendsRes.status === 'fulfilled' ? (friendsRes.value.count || 0) : 0;
        const previousNamesList = previousNames.status === 'fulfilled' ? previousNames.value : [];
        const assetsData = userAssets.status === 'fulfilled' ? userAssets.value : { assetCount: 0, creations: [] };
        const economyData = economyStatus.status === 'fulfilled' ? economyStatus.value : { robux: 0, hasPremium: false };
        const adminStatusResult = adminStatus.status === 'fulfilled' ? adminStatus.value : "❓ Unknown";
        const developerInfo = developerStatus.status === 'fulfilled' ? developerStatus.value : { 
          isDeveloper: false, 
          developerLevel: "None", 
          reason: "Error checking",
          topGames: [] 
        };

        // Enhanced status detection
        const statusEmoji = getStatusEmoji(presenceObj?.userPresenceType, profile.isBanned);
        let statusText = "Offline";
        if (presenceObj) {
          const statusMap = {
            1: "Online", 2: "In Game", 3: "In Studio", 4: "Invisible"
          };
          statusText = statusMap[presenceObj.userPresenceType] || "Offline";
        }

        // Build comprehensive embed
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        const embed = new EmbedBuilder()
          .setTitle(`${profile.displayName || profile.name} (@${profile.name}) ${profile.isBanned ? '🚫' : ''}${developerInfo.isDeveloper ? ' 🎮' : ''}`)
          .setURL(`https://www.roblox.com/users/${userId}/profile`)
          .setDescription(profile.description || "*No description provided*")
          .setColor(profile.isBanned ? 0xff5555 : 
                  developerInfo.isDeveloper ? 0x9b59b6 : // Purple for developers
                  statusText === "In Game" ? 0x2ecc71 : 
                  statusText === "Online" ? 0x00ff00 : 
                  statusText === "In Studio" ? 0xe67e22 : 0x95a5a6)
          .setTimestamp()
          .setFooter({ 
            text: `⏳ ${duration}s | 🔍 ${userSearches.length} searches | 💾 Cached ${CACHE_MS/1000}s` 
          });

        if (avatarUrl) embed.setThumbnail(avatarUrl);

        // === BASIC INFORMATION ===
        const basicFields = [
          { name: "🆔 User ID", value: `\`${userId}\``, inline: true },
          { name: "📶 Status", value: `${statusEmoji} ${statusText}`, inline: true },
          { name: "🕒 Last Online", value: presenceObj?.lastOnline ? timeAgo(new Date(presenceObj.lastOnline)) : "Unknown", inline: true },
          { name: "🚫 Ban Status", value: profile.isBanned ? "🚫 **BANNED**" : "✅ Clean", inline: true },
          { name: "👮 Admin Status", value: adminStatusResult, inline: true }
        ];

        // Add developer status to basic fields if applicable
        if (developerInfo.isDeveloper) {
          basicFields.push({ 
            name: "🎮 Developer Status", 
            value: `**${developerInfo.developerLevel}**`, 
            inline: true 
          });
        }

        basicFields.push(
          { name: "📅 Account Created", value: profile.created ? new Date(profile.created).toDateString() : "Unknown", inline: true },
          { name: "⏳ Account Age", value: accountAge(profile.created), inline: true }
        );

        embed.addFields(basicFields);

        // === SOCIAL STATISTICS ===
        embed.addFields(
          { name: "👣 Followers", value: `**${formatNumber(followers)}**`, inline: true },
          { name: "➡️ Following", value: `**${formatNumber(followings)}**`, inline: true },
          { name: "👥 Friends", value: `**${formatNumber(friends)}**`, inline: true }
        );

        // === ECONOMY & PREMIUM ===
        embed.addFields(
          { name: "💎 Premium", value: economyData.hasPremium ? "✅ **Active**" : "❌ Inactive", inline: true },
          { name: "💰 Robux Balance", value: `**${formatNumber(economyData.robux)}**`, inline: true },
          { name: "🎨 Assets Owned", value: `**${formatNumber(assetsData.assetCount)}**`, inline: true }
        );

        // === DEVELOPER INFORMATION ===
        if (developerInfo.isDeveloper) {
          const devFields = [
            { 
              name: "📈 Developer Stats", 
              value: developerInfo.reason, 
              inline: false 
            },
            { 
              name: "🎯 Games Created", 
              value: `**${developerInfo.stats.totalGames}** total games`, 
              inline: true 
            },
            { 
              name: "👀 Total Visits", 
              value: `**${formatNumber(developerInfo.stats.totalVisits)}** visits`, 
              inline: true 
            },
            { 
              name: "⭐ Successful Games", 
              value: `**${developerInfo.stats.successfulGames}** with 1,000+ visits`, 
              inline: true 
            }
          ];

          embed.addFields(devFields);

          // === TOP GAMES SECTION ===
          if (developerInfo.topGames && developerInfo.topGames.length > 0) {
            const topGamesField = formatTopGames(developerInfo.topGames, 5);
            if (topGamesField) {
              embed.addFields(topGamesField);
            }
          }
        }

        // === GAME INFORMATION (ENHANCED) ===
        if (presenceObj?.userPresenceType === 2 && gameInfo) {
          const gameFields = formatGameInfo(gameInfo, serverInfo);
          if (gameFields) {
            embed.addFields(gameFields);
          }
        }

        // === PREVIOUS USERNAMES ===
        if (previousNamesList.length > 0) {
          const prevNamesText = previousNamesList.slice(0, 3).join(', ') + (previousNamesList.length > 3 ? `... (+${previousNamesList.length - 3} more)` : '');
          embed.addFields({
            name: `📝 Previous Names (${previousNamesList.length})`,
            value: prevNamesText,
            inline: false
          });
        }

        // Create interactive buttons
        const buttons = createActionButtons(
          userId, 
          profile.name, 
          presenceObj?.userPresenceType === 2, 
          gameInfo?.url,
          developerInfo.isDeveloper
        );

        // Enhanced caching
        const cacheData = { 
          embed, 
          ts: Date.now(), 
          userId, 
          username: profile.name,
          hasGame: presenceObj?.userPresenceType === 2,
          gameUrl: gameInfo?.url,
          isDeveloper: developerInfo.isDeveloper
        };
        cacheByQuery.set(cacheKey, cacheData);
        cacheById.set(userId, cacheData);

        // Delete initial message and send result
        if (initialMsg.deletable) {
          await initialMsg.delete().catch(() => null);
        }

        await message.reply({ 
          embeds: [embed],
          components: [buttons]
        });
        console.log(`[trackuser] success for ${userId} (${duration}s)`);

      } catch (innerError) {
        clearTimeout(slowNotice);
        throw innerError;
      }

    } catch (err) {
      clearTimeout(slowNotice);
      console.error("[trackuser] error:", err.message);

      let errorMsg = "❌ Failed to fetch Roblox data. ";

      if (err.message.includes("not found")) {
        errorMsg += "User not found. Please check the username/ID and try again.";
      } else if (err.message.includes("rate limit") || err.message.includes("429")) {
        errorMsg += "Roblox API rate limit exceeded. Please try again in a few minutes.";
      } else if (err.message.includes("timeout") || err.code === "ECONNABORTED") {
        errorMsg += "Request timeout. The Roblox API is experiencing high load.";
      } else if (err.message.includes("profile")) {
        errorMsg += "Could not fetch user profile. The user may not exist or is private.";
      } else {
        errorMsg += "The Roblox API might be down or the user has privacy settings enabled.";
      }

      try {
        await message.reply(errorMsg);
      } catch (replyError) {
        console.error("[trackuser] Failed to send error message:", replyError.message);
      }
    }
  }
};