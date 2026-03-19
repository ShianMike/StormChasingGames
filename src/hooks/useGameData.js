import { useState, useEffect, useCallback, useRef } from "react";
import fallbackGames from "../data/games";

// In production (GitHub Pages), fetch the pre-built static JSON
// In development, use the local Express proxy
const isDev = import.meta.env.DEV;
const API_URL = isDev
  ? "http://localhost:3001/api/games"
  : `${import.meta.env.BASE_URL}data/live-games.json`;
const REFRESH_INTERVAL = isDev ? 30 * 1000 : 5 * 60 * 1000; // 30s dev, 5min prod
const MAX_HISTORY = 240; // ~2hr at 30s intervals
const STORAGE_KEY_PLAYERS = "sc_playerHistory";
const STORAGE_KEY_VISITS = "sc_visitHistory";
const MAX_AGE = 2 * 60 * 60 * 1000; // discard snapshots older than 2h

function loadHistory(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const cutoff = Date.now() - MAX_AGE;
    return parsed.filter((h) => h.time >= cutoff);
  } catch {
    return [];
  }
}

function saveHistory(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* quota exceeded — ignore */ }
}

export default function useGameData() {
  const [games, setGames] = useState(fallbackGames);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [playerHistory, setPlayerHistory] = useState(() => loadHistory(STORAGE_KEY_PLAYERS));
  const [visitHistory, setVisitHistory] = useState(() => loadHistory(STORAGE_KEY_VISITS));
  const snapshotPushed = useRef(false);

  const pushSnapshot = useCallback((gamesList) => {
    const time = Date.now();
    setPlayerHistory((prev) => {
      const snapshot = {
        time,
        players: Object.fromEntries(
          gamesList.map((g) => [g.universeId, g.activePlayers])
        ),
      };
      return [...prev, snapshot].slice(-MAX_HISTORY);
    });
    setVisitHistory((prev) => {
      const snapshot = {
        time,
        visits: Object.fromEntries(
          gamesList.map((g) => [g.universeId, g.visits])
        ),
      };
      return [...prev, snapshot].slice(-MAX_HISTORY);
    });
  }, []);

  // Persist history to localStorage outside of state updaters
  useEffect(() => {
    if (playerHistory.length > 0) saveHistory(STORAGE_KEY_PLAYERS, playerHistory);
  }, [playerHistory]);
  useEffect(() => {
    if (visitHistory.length > 0) saveHistory(STORAGE_KEY_VISITS, visitHistory);
  }, [visitHistory]);

  const fetchGames = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      // If no live data (empty fallback), keep using static data
      if (!json.data || json.data.length === 0) {
        setLoading(false);
        if (!snapshotPushed.current) {
          pushSnapshot(fallbackGames);
          snapshotPushed.current = true;
        }
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
      pushSnapshot(merged);
      snapshotPushed.current = true;
    } catch (err) {
      console.warn("Live fetch failed, using fallback data:", err.message);
      setError(err.message);
      if (!snapshotPushed.current) {
        pushSnapshot(fallbackGames);
        snapshotPushed.current = true;
      }
    } finally {
      setLoading(false);
    }
  }, [pushSnapshot]);

  useEffect(() => {
    fetchGames();
    const interval = setInterval(fetchGames, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchGames]);

  return { games, loading, error, lastUpdated, playerHistory, visitHistory, refetch: fetchGames };
}
