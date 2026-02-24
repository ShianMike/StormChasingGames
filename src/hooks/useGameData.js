import { useState, useEffect, useCallback } from "react";
import fallbackGames from "../data/games";

// In production (GitHub Pages), fetch the pre-built static JSON
// In development, use the local Express proxy
const isDev = import.meta.env.DEV;
const API_URL = isDev
  ? "http://localhost:3001/api/games"
  : `${import.meta.env.BASE_URL}data/live-games.json`;
const REFRESH_INTERVAL = isDev ? 60 * 1000 : 5 * 60 * 1000; // 60s dev, 5min prod

export default function useGameData() {
  const [games, setGames] = useState(fallbackGames);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchGames = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      // If no live data (empty fallback), keep using static data
      if (!json.data || json.data.length === 0) {
        setLoading(false);
        return;
      }

      // Merge live data with static fallback for fields the API doesn't provide
      const merged = json.data.map((live) => {
        const fallback = fallbackGames.find(
          (f) => f.universeId === live.universeId
        );
        return {
          ...fallback,
          ...live,
          // Keep static fields that the API doesn't return
          id: fallback?.id || live.universeId,
          tags: fallback?.tags || [],
          featured: fallback?.featured || false,
          creatorLink: fallback?.creatorLink || "",
          gameLink:
            live.gameLink ||
            fallback?.gameLink ||
            `https://www.roblox.com/games/${live.placeId}`,
        };
      });

      setGames(merged);
      setLastUpdated(json.lastUpdated);
      setError(null);
    } catch (err) {
      console.warn("Live fetch failed, using fallback data:", err.message);
      setError(err.message);
      // Keep existing data (fallback or last successful fetch)
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
    const interval = setInterval(fetchGames, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchGames]);

  return { games, loading, error, lastUpdated, refetch: fetchGames };
}
