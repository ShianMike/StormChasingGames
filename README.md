# Storm Chasing Dashboard

A React dashboard showcasing popular Roblox storm chasing games with live stats from the Roblox API.

**Live site:** [shianmike.github.io/StormChasingGames](https://shianmike.github.io/StormChasingGames/)

## Games Tracked

| Game | Creator | Description |
|------|---------|-------------|
| **Twisted** | Twisted Official | The OG storm chasing game set in Keysota |
| **TwisterX** | Fluzerify | Tornado sim with thermodynamics & radar |
| **Helicity** | Helicity Official Group | Realistic storm chasing in the state of Edmund |
| **CHASED** | Tornado_boyz | Semi-realistic storm photography sim |
| **Roaring Skies** | sel's chaotic games | Tornado chasing on Northarrow Island |
| **Vortex** | Vortex Developer Team | WIP storm chasing focused on human impact |
| **Mini Tornadoes 2** | rahkeio | Miniature-scale tornado roleplay |
| **RTS: Chasing** | RainbowDoesGames | Hyperrealism tech-demo (archived) |
| **Storm Chasers Reborn 7** | ProtoManly | Classic storm chasing with vehicles |
| **Storm Analysis, Inc.** | Storm Analysis, Inc. | Radar-based storm tracking & forecasting |

## Coming Soon

- **Severity** — A new storm chasing experience ([Discord](https://discord.gg/severity))
- **Intrepid** — An upcoming storm chasing game
- **R22** — An upcoming storm chasing game

## Live Stats

Stats are fetched from the Roblox API automatically:
- **GitHub Pages** — GitHub Actions re-fetches and redeploys every 10 minutes
- **Local dev** — Express proxy fetches live data every 60 seconds

Data includes active players, visits, likes/dislikes, favorites, and game thumbnails.

## Tech Stack

- **React + Vite** — Frontend framework & dev server
- **Roblox API** — Live game stats, votes & thumbnails
- **Express** — Local dev proxy (port 3001) to bypass CORS
- **GitHub Actions** — CI/CD with 10-minute scheduled data refresh
- **GitHub Pages** — Static hosting

## Local Development

```bash
npm install

# Start proxy server (port 3001)
npm run server

# In another terminal, start dev server
npm run dev
```

## Deployment (GitHub Pages)

1. Push to `main` branch
2. In repo **Settings > Pages**, set Source to **GitHub Actions**
3. The workflow fetches live data, builds, and deploys automatically
4. Stats refresh every 10 minutes via scheduled workflow
