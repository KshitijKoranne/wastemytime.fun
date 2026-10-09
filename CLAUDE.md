# wastemytime.fun

Static site, no build. Vercel serves `public/` (see `vercel.json`).

- `public/index.html` — lobby: a felt letter board; each activity is a "floor".
- `public/<activity>/index.html` — one self-contained HTML file per activity.

Brand: "Bureau of Wasted Time". Green felt desk (#1d4a3b), triplicate forms
(paper #fbf8f0, rose #f3c2cc, canary #f3dd70), carbon-violet ink #3a379c, stamp red #d6382d.
Fonts: Big Shoulders Stencil Display (stamps/titles), Bricolage Grotesque (text),
Courier Prime (form fields), Caveat (supervisor's pen).

Rules: no streaks or guilt mechanics. Every fact must be checked against a source.
Real or Fake cases: append new ones at the end of `CASES` (ids are array positions).
