import { formatNumber, getLikeRatio, getTimeSince } from "../utils/formatters";
import "./GameCard.css";

function GameCard({ game, view }) {
  const likeRatio = getLikeRatio(game.likes, game.dislikes);

  if (view === "list") {
    return (
      <div className="game-card-list">
        <div className="game-card-list-thumb-wrapper">
          <img
            src={game.thumbnailUrl}
            alt={game.name}
            className="game-card-list-thumb"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.classList.add("thumb-fallback");
            }}
          />
          {game.featured && <span className="featured-badge">Featured</span>}
        </div>

        <div className="game-card-list-info">
          <div className="game-card-list-header">
            <div>
              <h3 className="game-card-name">{game.name}</h3>
              <a
                href={game.creatorLink}
                target="_blank"
                rel="noopener noreferrer"
                className="game-card-creator"
              >
                {game.creator}
              </a>
            </div>
            <div className="game-card-list-actions">
              <a
                href={game.gameLink}
                target="_blank"
                rel="noopener noreferrer"
                className="play-btn"
              >
                View on Roblox
              </a>
            </div>
          </div>

          <p className="game-card-desc">{game.description}</p>

          <div className="game-card-list-stats">
            <div className="stat-chip">
              <span className="stat-chip-label">Visits</span>
              <span className="stat-chip-value">{formatNumber(game.visits)}</span>
            </div>
            <div className="stat-chip">
              <span className="stat-chip-label">Playing</span>
              <span className="stat-chip-value active-dot">{formatNumber(game.activePlayers)}</span>
            </div>
            <div className="stat-chip">
              <span className="stat-chip-label">Favorites</span>
              <span className="stat-chip-value">{formatNumber(game.favorites)}</span>
            </div>
            <div className="stat-chip">
              <span className="stat-chip-label">Rating</span>
              <span className="stat-chip-value">{likeRatio}%</span>
            </div>
            <div className="stat-chip">
              <span className="stat-chip-label">Max Players</span>
              <span className="stat-chip-value">{game.maxPlayers}</span>
            </div>
            <div className="stat-chip">
              <span className="stat-chip-label">Updated</span>
              <span className="stat-chip-value">{getTimeSince(game.lastUpdated)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-card">
      <div className="game-card-thumb-wrapper">
        <img
          src={game.thumbnailUrl}
          alt={game.name}
          className="game-card-thumb"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentElement.classList.add("thumb-fallback");
          }}
        />
        {game.featured && <span className="featured-badge">Featured</span>}
        <div className="game-card-overlay">
          <a
            href={game.gameLink}
            target="_blank"
            rel="noopener noreferrer"
            className="play-btn"
          >
            View on Roblox
          </a>
        </div>
      </div>

      <div className="game-card-body">
        <div className="game-card-header">
          <h3 className="game-card-name">{game.name}</h3>
          <a
            href={game.creatorLink}
            target="_blank"
            rel="noopener noreferrer"
            className="game-card-creator"
          >
            {game.creator}
          </a>
        </div>

        <p className="game-card-desc">{game.description}</p>

        <div className="game-card-tags">
          {game.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="game-tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="game-card-stats">
          <div className="game-stat">
            <span className="game-stat-value">{formatNumber(game.visits)}</span>
            <span className="game-stat-label">Visits</span>
          </div>
          <div className="game-stat">
            <span className="game-stat-value active-dot">{formatNumber(game.activePlayers)}</span>
            <span className="game-stat-label">Playing</span>
          </div>
          <div className="game-stat">
            <span className="game-stat-value">{formatNumber(game.favorites)}</span>
            <span className="game-stat-label">Favorites</span>
          </div>
        </div>

        <div className="game-card-footer">
          <div className="like-bar-wrapper">
            <div className="like-bar">
              <div className="like-bar-fill" style={{ width: `${likeRatio}%` }} />
            </div>
            <span className="like-ratio">{likeRatio}% approval</span>
          </div>
          <span className="game-genre">{game.genre}</span>
        </div>

        <div className="game-card-meta">
          <span>Max {game.maxPlayers} players</span>
          <span>Updated {getTimeSince(game.lastUpdated)}</span>
        </div>
      </div>
    </div>
  );
}

export default GameCard;
