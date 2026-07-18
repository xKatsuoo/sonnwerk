# SONNWERK

Premium-Website für ein deutsches Solarunternehmen mit einer scroll-gesteuerten
Installationsgeschichte: vom Hausdach über die Photovoltaik-Montage bis zum
Energiefluss durch Wechselrichter, Speicher, Hausnetz, Wallbox und Smart Home.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · GSAP +
ScrollTrigger · Lenis · Framer Motion

## Getting Started

```bash
npm install
npm run dev
```

Öffnen Sie [http://localhost:3000](http://localhost:3000).

## Video-Pipeline

Die Hero-Sequenz basiert auf drei Rohvideos in `source-videos/` (Drohnenaufnahmen
Haus/Dach, Planungsvisualisierung, Montage). `scripts/build-video.mjs` trimmt,
verkettet und optimiert sie zu den Assets in `public/videos/` und
`public/images/` (Desktop-Video, Mobile-Video, Poster-Frame, Frame-Metadaten).

```bash
npm run build:video
```

Nur bei Änderungen an den Rohvideos erneut ausführen — die erzeugten Assets sind
bereits in `public/` vorhanden und werden von der Website direkt genutzt.

## Architektur der Scroll-Story

- `src/components/scroll-story/VideoScrollEngine.tsx` — pinnt den Hero-Bereich
  und bildet den Scroll-Fortschritt exakt auf `video.currentTime` ab
  (`requestVideoFrameCallback` auf Desktop, Canvas-Rendering auf Mobile). Das
  Video spielt nie automatisch, hat keine Controls und läuft beim
  Zurückscrollen sichtbar rückwärts.
- `src/components/scroll-story/EnergyFlowDiagram.tsx` — setzt die Geschichte
  dort fort, wo kein Filmmaterial existiert (Stromfluss bis Smart Home), als
  scroll-gescrubbtes SVG-Diagramm.
- `src/data/storyPhases.ts` — einzige Quelle für alle Phasentexte und
  Frame-/Fortschrittsgrenzen.

## Sonstige Skripte

```bash
npm run build   # Production-Build
npm run lint    # ESLint
npm run format  # Prettier (inkl. Tailwind-Klassensortierung)
```
