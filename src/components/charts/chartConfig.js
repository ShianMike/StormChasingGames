/**
 * Shared Chart.js configuration for the RSCC analytics dashboard.
 * Registers all required Chart.js components once and exports
 * reusable theme colors, font defaults, and option presets.
 */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

// One-time global registration
ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
);

/* ── Dashboard palette (matches index.css :root) ── */
export const COLORS = {
  indigo: "#6366f1",
  indigoLight: "#818cf8",
  cyan: "#22d3ee",
  green: "#22c55e",
  amber: "#f59e0b",
  rose: "#f43f5e",
  purple: "#a78bfa",
  orange: "#fb923c",
  teal: "#14b8a6",
  sky: "#38bdf8",
};

export const PALETTE = Object.values(COLORS);

/** Short display names for chart legends to keep them compact */
export function shortName(name) {
  const map = {
    "Twisted [BETA]": "Twisted",
    "CHASED [DEMO]": "CHASED",
    "Vortex [BETA 0.3.1]": "Vortex",
    "Mini Tornadoes 2": "Mini T.2",
    "RTS : Chasing [ Archived Tech-demo ]": "RTS",
    "Storm Chasers Reborn 7 [2.1]": "SC Reborn",
    "Storm Analysis, Inc. [BETA] [1.6 Update]": "Storm A.",
    "Roaring Skies": "Roaring",
  };
  return map[name] || name;
}

/* ── Shared defaults for dark-themed charts ── */
const gridColor = "rgba(255, 255, 255, 0.06)";
const tickColor = "rgba(255, 255, 255, 0.4)";
const fontFamily =
  '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

export const darkScales = {
  x: {
    grid: { color: gridColor, drawBorder: false },
    ticks: { color: tickColor, font: { family: fontFamily, size: 11 } },
  },
  y: {
    grid: { color: gridColor, drawBorder: false },
    ticks: { color: tickColor, font: { family: fontFamily, size: 11 } },
  },
};

export const darkTooltip = {
  backgroundColor: "rgba(15, 15, 25, 0.92)",
  titleColor: "#fff",
  bodyColor: "rgba(255, 255, 255, 0.75)",
  borderColor: "rgba(255, 255, 255, 0.08)",
  borderWidth: 1,
  padding: 10,
  cornerRadius: 8,
  titleFont: { family: fontFamily, weight: 600, size: 13 },
  bodyFont: { family: fontFamily, size: 12 },
  displayColors: true,
  boxPadding: 4,
};

export const darkLegend = {
  labels: {
    color: "rgba(255, 255, 255, 0.6)",
    font: { family: fontFamily, size: 12 },
    boxWidth: 12,
    boxHeight: 12,
    borderRadius: 3,
    padding: 14,
    usePointStyle: true,
    pointStyle: "rectRounded",
  },
};

/** Base options shared by all cartesian (line/bar) charts */
export const baseCartesianOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  plugins: {
    tooltip: darkTooltip,
    legend: { ...darkLegend, position: "top" },
  },
  scales: darkScales,
};
