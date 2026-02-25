import { useState, useMemo } from "react";
import Header from "./components/Header";
import StatsBar from "./components/StatsBar";
import GameGrid from "./components/GameGrid";
import ComingSoon from "./components/ComingSoon";
import Footer from "./components/Footer";
import useGameData from "./hooks/useGameData";
import { comingSoonGames } from "./data/games";
import "./App.css";

function App() {
  const { games, loading, error, lastUpdated } = useGameData();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("visits");
  const [view, setView] = useState("grid");

  const filteredAndSorted = useMemo(() => {
    let result = [...games];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.creator.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          (g.tags && g.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    const sortFns = {
      visits: (a, b) => b.visits - a.visits,
      activePlayers: (a, b) => b.activePlayers - a.activePlayers,
      favorites: (a, b) => b.favorites - a.favorites,
      likes: (a, b) => b.likes - a.likes,
      newest: (a, b) => new Date(b.created) - new Date(a.created),
      updated: (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated),
    };

    result.sort(sortFns[sortBy] || sortFns.visits);
    return result;
  }, [games, searchQuery, sortBy]);

  return (
    <>
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        view={view}
        onViewChange={setView}
      />
      <main className="main-content">
        {lastUpdated && (
          <div className="live-badge">
            <span className="live-dot"></span>
            LIVE — Updated {new Date(lastUpdated).toLocaleTimeString()}
          </div>
        )}
        {error && !lastUpdated && (
          <div className="offline-badge">
            OFFLINE — Using cached data
          </div>
        )}
        <StatsBar games={games} />
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Fetching live data from Roblox...</p>
          </div>
        ) : (
          <GameGrid games={filteredAndSorted} view={view} />
        )}
        <ComingSoon games={comingSoonGames} />
      </main>
      <Footer />
    </>
  );
}

export default App;
