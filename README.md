# Car Interface Simulator

Demo web simulator of a modern in-car multimedia interface inspired by Apple CarPlay-style dashboard layouts. This is not an official Apple product and does not claim affiliation with Apple.

## Tech

- React, TypeScript, Vite
- Tailwind CSS
- Lucide React icons
- Framer Motion animations
- Leaflet with OpenStreetMap fallback and optional Google Maps embed with your own API key
- localStorage persistence
- PWA manifest and service worker

## Integrations

- Car photo: upload on the dashboard; the image stays in this browser only.
- Maps: choose OpenStreetMap or Google Maps in Settings. Google Maps requires your own API key.
- Weather: mock Berghofen weather by default, with an Apple WeatherKit JWT field prepared in Settings.
- Music: YouTube Music, Apple Music, and Spotify connection states are saved locally with official service links.
- Radio: tries open Radio Browser streams and falls back to mock stations when unavailable.
- Phone contacts: uses the browser Contacts Picker API when the device/browser supports it.

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
```

The app runs locally at the URL printed by Vite, usually `http://localhost:5173`.

## GitHub Pages

The repository includes `.github/workflows/pages.yml`. Push `main` to GitHub, then open the Pages deployment URL from the workflow summary.
If the Pages URL returns 404, enable Pages with "GitHub Actions" as the source in the repository settings.

Pages source is set to GitHub Actions. This README update was used to trigger a fresh deployment after enabling Pages.
