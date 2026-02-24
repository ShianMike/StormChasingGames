import GameCard from "./GameCard";
import "./GameGrid.css";

function GameGrid({ games, view }) {
  if (games.length === 0) {
    return (
      <div className="no-results">
        <p className="no-results-title">No games found</p>
        <p className="no-results-text">Try adjusting your search query</p>
      </div>
    );
  }

  return (
    <div className={`game-grid ${view === "list" ? "game-grid--list" : ""}`}>
      {games.map((game) => (
        <GameCard key={game.id} game={game} view={view} />
      ))}
    </div>
  );
}

export default GameGrid;
