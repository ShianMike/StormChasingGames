import { useState } from "react";
import "./Header.css";

function Header({ searchQuery, onSearchChange, sortBy, onSortChange, view, onViewChange }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <h1 className="header-title">Storm Chasing Games</h1>
          <span className="header-subtitle">Roblox Dashboard</span>
        </div>

        <div className="header-controls">
          <div className="search-wrapper">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <select className="sort-select" value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
            <option value="visits">Most Visited</option>
            <option value="activePlayers">Active Players</option>
            <option value="favorites">Most Favorited</option>
            <option value="likes">Most Liked</option>
            <option value="newest">Newest</option>
            <option value="updated">Recently Updated</option>
          </select>

          <div className="view-toggle">
            <button
              className={`view-btn ${view === "grid" ? "active" : ""}`}
              onClick={() => onViewChange("grid")}
              aria-label="Grid view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              className={`view-btn ${view === "list" ? "active" : ""}`}
              onClick={() => onViewChange("list")}
              aria-label="List view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
