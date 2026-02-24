/**
 * Fetches live game data from Roblox APIs and saves to public/data/live-games.json
 * This runs in GitHub Actions (server-side) to avoid CORS issues.
 */

import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

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

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function main() {
  console.log("Fetching live data from Roblox APIs...");

  const [gamesRes, votesRes, thumbsRes] = await Promise.all([
    fetchJSON(`https://games.roblox.com/v1/games?universeIds=${universeIds}`),
    fetchJSON(
      `https://games.roblox.com/v1/games/votes?universeIds=${universeIds}`
    ),
    fetchJSON(
      `https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeIds}&countPerUniverse=1&size=768x432&format=Webp`
    ),
  ]);

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

  const output = {
    data: result,
    lastUpdated: new Date().toISOString(),
  };

  // Write to public/data/ so Vite includes it in the build
  const outDir = join(__dirname, "..", "public", "data");
  mkdirSync(outDir, { recursive: true });

  const outPath = join(outDir, "live-games.json");
  writeFileSync(outPath, JSON.stringify(output, null, 2));

  console.log(`Wrote ${result.length} games to ${outPath}`);
  console.log(
    "Games:",
    result.map((g) => g.name).join(", ")
  );
}

main().catch((err) => {
  console.error("Failed to fetch live data:", err.message);
  console.log("Writing empty fallback so the build can continue...");

  const outDir = join(__dirname, "..", "public", "data");
  mkdirSync(outDir, { recursive: true });
  const fallback = { data: [], lastUpdated: new Date().toISOString(), error: err.message };
  writeFileSync(join(outDir, "live-games.json"), JSON.stringify(fallback, null, 2));

  console.log("Fallback file written — app will use static data.");
});
