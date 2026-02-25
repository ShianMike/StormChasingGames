import "./ComingSoon.css";

function ComingSoon({ games }) {
  if (!games || games.length === 0) return null;

  return (
    <section className="coming-soon-section">
      <h2 className="coming-soon-heading">Coming Soon</h2>
      <div className="coming-soon-grid">
        {games.map((game) => (
          <div key={game.id} className="coming-soon-card">
            <div className="coming-soon-icon">🌪️</div>
            <div className="coming-soon-info">
              <h3 className="coming-soon-name">{game.name}</h3>
              <p className="coming-soon-desc">{game.description}</p>
              <span className="coming-soon-badge">{game.status}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ComingSoon;
