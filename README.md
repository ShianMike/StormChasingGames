# Storm Chasing Dashboard

A React dashboard showcasing popular Roblox storm chasing games with live stats from the Roblox API.

## Games Tracked

- **Twisted** — The OG storm chasing game
- **TwisterX** — Tornado sim with thermodynamics & radar
- **Helicity** — Realistic storm chasing
- **CHASED** — Semi-realistic storm photography sim
- **Just Tornadoes** — Pure tornado chasing
- **Tornado Blox** — Chase and observe tornadoes
- **Mini Tornadoes 2** — Miniature-scale tornado roleplay
- **RTS: Chasing** — Hyperrealism tech-demo (archived)

## Live Stats

Stats are fetched from the Roblox API automatically:
- **GitHub Pages** — GitHub Actions re-fetches and redeploys every 10 minutes
- **Local dev** — Express proxy fetches live data every 60 seconds

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
