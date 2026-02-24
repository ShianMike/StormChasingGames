import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());

// Game config: placeId -> universeId mapping
const GAMES = [
  { placeId: 6161235818, universeId: 2251388500 },
  { placeId: 16272604134, universeId: 5615055859 },
  { placeId: 17759606919, universeId: 6083162964 },
  { placeId: 16303389919, universeId: 5624742469 },
  { placeId: 114925869242419, universeId: 8925404604 },
  { placeId: 16491465835, universeId: 5680730476 },
  { placeId: 124621117378550, universeId: 7512606763 },
  { placeId: 93120267632796, universeId: 6975389394 },
];

const universeIds = GAMES.map((g) => g.universeId).join(",");

// Cache with TTL (refresh every 60 seconds)
let cache = { data: null, timestamp: 0 };
const CACHE_TTL = 60 * 1000;

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function fetchAllGameData() {
  const now = Date.now();
  if (cache.data && now - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }

  try {
    const [gamesRes, votesRes, thumbsRes] = await Promise.all([
      fetchJSON(
        `https://games.roblox.com/v1/games?universeIds=${universeIds}`
      ),
      fetchJSON(
        `https://games.roblox.com/v1/games/votes?universeIds=${universeIds}`
      ),
      fetchJSON(
        `https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeIds}&countPerUniverse=1&size=768x432&format=Webp`
      ),
    ]);

    // Build lookup maps
    const votesMap = {};
    for (const v of votesRes.data) {
      votesMap[v.id] = v;
    }

    const thumbsMap = {};
    for (const t of thumbsRes.data) {
      if (t.thumbnails && t.thumbnails.length > 0) {
        thumbsMap[t.universeId] = t.thumbnails[0].imageUrl;
      }
    }

    const result = gamesRes.data.map((game) => {
      const votes = votesMap[game.id] || {};
      const thumbUrl = thumbsMap[game.id] || "";
      const gameConfig = GAMES.find((g) => g.universeId === game.id);

      return {
        universeId: game.id,
        placeId: gameConfig?.placeId || game.rootPlaceId,
        name: game.name,
        creator: game.creator?.name || "Unknown",
        creatorType: game.creator?.type || "User",
        creatorId: game.creator?.id || 0,
        gameLink: `https://www.roblox.com/games/${gameConfig?.placeId || game.rootPlaceId}`,
        thumbnailUrl: thumbUrl,
        description: game.description || "",
        genre: game.genre || "All",
        maxPlayers: game.maxPlayers || 0,
        created: game.created,
        lastUpdated: game.updated,
        visits: game.visits || 0,
        favorites: game.favoritedCount || 0,
        activePlayers: game.playing || 0,
        likes: votes.upVotes || 0,
        dislikes: votes.downVotes || 0,
      };
    });

    cache = { data: result, timestamp: now };
    return result;
  } catch (err) {
    console.error("Error fetching from Roblox API:", err.message);
    if (cache.data) return cache.data;
    throw err;
  }
}

app.get("/api/games", async (req, res) => {
  try {
    const data = await fetchAllGameData();
    res.json({ data, lastUpdated: new Date(cache.timestamp).toISOString() });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch game data" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
  console.log(`Fetching data for ${GAMES.length} games every ${CACHE_TTL / 1000}s`);
});
