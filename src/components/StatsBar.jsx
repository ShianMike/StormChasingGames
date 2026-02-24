import { formatNumber } from "../utils/formatters";
import "./StatsBar.css";

function StatsBar({ games }) {
  const totalVisits = games.reduce((sum, g) => sum + g.visits, 0);
  const totalPlaying = games.reduce((sum, g) => sum + g.activePlayers, 0);
  const totalFavorites = games.reduce((sum, g) => sum + g.favorites, 0);
  const totalGames = games.length;

  const stats = [
    { label: "Total Games", value: totalGames },
    { label: "Combined Visits", value: formatNumber(totalVisits) },
    { label: "Players Right Now", value: formatNumber(totalPlaying) },
    { label: "Total Favorites", value: formatNumber(totalFavorites) },
  ];

  return (
    <div className="stats-bar">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-item">
          <span className="stat-value">{stat.value}</span>
          <span className="stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;
