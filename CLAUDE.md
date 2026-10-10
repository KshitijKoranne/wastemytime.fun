# wastemytime.fun

A simple home page (like neal.fun) that links to activities. Each activity is its own page: one stall of a 3D night fair (three.js).

- `src/` is the source; `npm run build` bundles each page in `src/pages/` to `public/js/` (esbuild, code splitting).
  Commit the built files: Vercel serves `public/` as static files with no build step (see `vercel.json`).
- `public/index.html` the home page. Plain HTML and CSS, no JavaScript. Tiles are 600×600 jpg in `public/tiles/`.
- `public/<slug>/index.html` one page per activity; shared styles in `public/css/fair.css`.
- `src/engine.js` renderer, sky, wet ground, bulbs, bloom, frame loop. Pages set `E.update(dt)`.
- `src/scenery.js` `corner()` (one stall with neighbours) and `midway()` (the whole fair, for the ride).
- `src/world.js` scene builders (stalls, arch, festoons, Ferris wheel and its ride, wet ground, bulbs).
- `src/hud.js` shared page chrome (start button, loading bar, tickets, sound switch).
- `src/save.js` the one localStorage save (`wmt-fair`).
- Activities:
  - `src/booth.js` + `src/cases.js` Truth Booth (Real or Fake): pick up stamp, ink on green/red pad, stamp the card.
  - `src/weigh.js` + `src/weights.js` Guess the Weight: set the red hand on a log dial, pull the lever.
  - `src/pages/ride.js` Night Ride on the Ferris wheel.
- `cases.js` and `weights.js`: append new entries at the end only (ids are array positions).
- `src/sound.js` all sound is synthesised in WebAudio.
- `public/assets/` Poly Haven CC0 textures, models and sky; `art/` holds generated sign and prop images.

Rules: no streaks or guilt mechanics. Every fact must be checked against a source.
Test URL flags: `?debug` exposes `window.fair`; `&fixed` runs a fixed 1/30 s time step (for slow test browsers).
`fair.DBG.ts` scales time, `fair.DBG.snap = true` makes the camera jump to its pose.
