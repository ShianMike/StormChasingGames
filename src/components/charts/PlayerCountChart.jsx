/**
 * PlayerCountChart — real-time line chart tracking active players per game.
 */
import { useState, useMemo, useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { baseCartesianOptions, PALETTE, shortName } from "./chartConfig";
import { formatNumber } from "../../utils/formatters";
import "./Charts.css";

const RANGES = [
  { label: "5m", minutes: 5 },
  { label: "15m", minutes: 15 },
  { label: "30m", minutes: 30 },
  { label: "1h", minutes: 60 },
];

const fmtTime = (ts) =>
  new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function PlayerCountChart({ games, playerHistory }) {
  const [rangeIdx, setRangeIdx] = useState(0);
  const [hidden, setHidden] = useState(new Set());
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && games.length > 0) {
      initialized.current = true;
      const top = games.reduce((best, g) => g.activePlayers > best.activePlayers ? g : best, games[0]);
      setHidden(new Set(games.filter(g => g.universeId !== top.universeId).map(g => g.universeId)));
    }
  }, [games]);

  const totalActive = games.reduce((s, g) => s + g.activePlayers, 0);
  const latestTime =
    playerHistory.length > 0
      ? playerHistory[playerHistory.length - 1].time
      : 0;
  const earliestTime =
    playerHistory.length > 0 ? playerHistory[0].time : 0;
  const dataSpanMs = latestTime - earliestTime;

  // Auto-advance to largest range that has data
  const bestIdx = useMemo(() => {
    for (let i = RANGES.length - 1; i >= 0; i--) {
      if (dataSpanMs >= RANGES[i].minutes * 60 * 1000 * 0.5) return i;
    }
    return 0;
  }, [dataSpanMs]);

  // Keep rangeIdx clamped to bestIdx
  const activeIdx = Math.min(rangeIdx, bestIdx);
  const range = RANGES[activeIdx];

  // Games that have data > 0 (candidates for the legend)
  const eligibleGames = useMemo(() => {
    const now = latestTime || Date.now();
    const windowMs = range.minutes * 60 * 1000;
    const cutoff = now - windowMs;
    const pts = playerHistory.filter((h) => h.time >= cutoff);
    const fallback = [{ time: now, players: Object.fromEntries(games.map((g) => [g.universeId, g.activePlayers])) }];
    const points = pts.length > 0 ? pts : fallback;
    return games.filter((g) =>
      points.some((h) => (h.players[g.universeId] || 0) > 0)
    );
  }, [games, playerHistory, range, latestTime]);

  const toggle = (id) =>
    setHidden((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const { chartData, chartOptions } = useMemo(() => {
    const now = latestTime || Date.now();
    const windowMs = range.minutes * 60 * 1000;
    const rangeCutoff = now - windowMs;
    const filtered = playerHistory.filter((h) => h.time >= rangeCutoff);

    const points =
      filtered.length > 0
        ? filtered
        : [{ time: now, players: Object.fromEntries(games.map((g) => [g.universeId, g.activePlayers])) }];

    // Fit x-axis to data if data < range, otherwise use full range window
    const xMin = dataSpanMs < windowMs && earliestTime > 0
      ? earliestTime - Math.max(dataSpanMs * 0.05, 10_000)
      : rangeCutoff;
    const xMax = now + Math.max(dataSpanMs * 0.02, 10_000);

    const shownGames = eligibleGames.filter((g) => !hidden.has(g.universeId));

    // Compute y-axis bounds from visible data
    let yMin = Infinity, yMax = -Infinity;
    for (const g of shownGames) {
      for (const h of points) {
        const v = h.players[g.universeId] || 0;
        if (v < yMin) yMin = v;
        if (v > yMax) yMax = v;
      }
    }
    if (!Number.isFinite(yMin)) { yMin = 0; yMax = 1; }
    const yRange = yMax - yMin || 1;
    const yPad = yRange * 0.1;
    const computedYMin = Math.max(0, Math.floor(yMin - yPad));
    const computedYMax = Math.ceil(yMax + yPad);

    return {
      chartData: {
        datasets: shownGames.map((g, i) => {
          const idx = eligibleGames.indexOf(g);
          return {
            label: shortName(g.name),
            data: points.map((h) => ({ x: h.time, y: h.players[g.universeId] || 0 })),
            borderColor: PALETTE[idx % PALETTE.length],
            backgroundColor: PALETTE[idx % PALETTE.length] + "18",
            fill: false,
            tension: 0.3,
            pointRadius: 0,
            pointHitRadius: 10,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: PALETTE[idx % PALETTE.length],
            borderWidth: 2,
          };
        }),
      },
      chartOptions: {
        ...baseCartesianOptions,
        animation: { duration: 400 },
        plugins: {
          ...baseCartesianOptions.plugins,
          legend: { display: false },
          tooltip: {
            ...baseCartesianOptions.plugins.tooltip,
            callbacks: {
              title: (items) => fmtTime(items[0].parsed.x),
              label: (ctx) =>
                ` ${ctx.dataset.label}: ${formatNumber(ctx.parsed.y)} players`,
            },
          },
        },
        scales: {
          ...baseCartesianOptions.scales,
          x: {
            ...baseCartesianOptions.scales.x,
            type: "linear",
            min: xMin,
            max: xMax,
            ticks: {
              ...baseCartesianOptions.scales.x.ticks,
              callback: (v) => fmtTime(v),
              maxTicksLimit: 6,
            },
          },
          y: {
            ...baseCartesianOptions.scales.y,
            type: "linear",
            min: computedYMin,
            max: computedYMax,
            ticks: {
              ...baseCartesianOptions.scales.y.ticks,
              callback: (v) => v.toLocaleString(),
            },
          },
        },
      },
    };
  }, [games, playerHistory, range, latestTime, hidden, eligibleGames, dataSpanMs, earliestTime]);

  return (
    <div className="chart-wrap chart-wrap--hero">
      <div className="chart-head">
        <div className="chart-head-left">
          <h3 className="chart-title">
            <span className="chart-live-dot" />
            Active Players
          </h3>
          <span className="chart-stat">
            {formatNumber(totalActive)} playing now
          </span>
        </div>
        <div className="chart-controls">
          <div className="chart-tabs">
          {RANGES.map((r, i) => {
            const disabled = i > bestIdx;
            return (
              <button
                key={r.label}
                className={`chart-tab${activeIdx === i ? " chart-tab--active" : ""}${disabled ? " chart-tab--disabled" : ""}`}
                onClick={() => !disabled && setRangeIdx(i)}
                title={disabled ? `Need more data for ${r.label} range` : ""}
              >
                {r.label}
              </button>
            );
          })}          </div>        </div>
      </div>

      <div className="chart-legend">
        {eligibleGames.map((g, i) => (
          <button
            key={g.universeId}
            className={`chart-legend-pill${hidden.has(g.universeId) ? " chart-legend-pill--off" : ""}`}
            onClick={() => toggle(g.universeId)}
          >
            <span
              className="chart-legend-swatch"
              style={{ background: PALETTE[i % PALETTE.length] }}
            />
            {shortName(g.name)}
          </button>
        ))}
      </div>

      <div className="chart-body chart-body--wide">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
