# wastemytime.fun

A walkable 3D night fair (three.js). Each stall is one activity.

- `src/` is the source; `npm run build` bundles it to `public/fair.js` (esbuild). Commit the built file:
  Vercel serves `public/` as static files with no build step (see `vercel.json`).
- `src/world.js` scene builders (stalls, arch, festoons, Ferris wheel, wet ground, bulbs).
- `src/booth.js` the Truth Booth (Real or Fake): pick up stamp, ink on green/red pad, stamp the card.
- `src/cases.js` the fact cards. Append new cases at the end only (ids are array positions).
- `src/sound.js` all sound is synthesised in WebAudio.
- `public/assets/` Poly Haven CC0 textures, models and sky; `art/` holds generated sign and prop images.

Rules: no streaks or guilt mechanics. Every fact must be checked against a source.
Test URL flags: `?debug` exposes `window.fair`; `&fixed` runs a fixed 1/30 s time step (for slow test browsers).
