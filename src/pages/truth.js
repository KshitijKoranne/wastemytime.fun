import * as THREE from 'three';
import { engine, smooth } from '../engine.js';
import { corner } from '../scenery.js';
import { createBooth } from '../booth.js';
import * as S from '../sound.js';
import { $, pill, say, esc, chrome, share } from '../hud.js';

const E = await engine({ shadowBox: { x: 14, z: 14, cz: 2 }, puddleArea: [22, 16, 0, 6] });
const { camera, coarse, DBG } = E;
const stall = corner(E, 'truth', 'year', 'data');

const hint = pill('#bhint');
const H = {
  first: coarse ? 'Drag the stamp onto an ink pad and hold it there. Green means real, red means fake. Then drag it onto the card.' : 'Drag the stamp onto an ink pad and hold. Green means real, red means fake. Then drop it on the card. Keys: R or F.',
  carry: 'Hold it on the green pad for REAL, or the red pad for FAKE.',
  'inked-real': 'Green ink. Now press it on the card.',
  'inked-fake': 'Red ink. Now press it on the card.',
  noink: 'Ink the stamp first. Hold it on a pad for a moment.',
  dry: 'Too little ink. Hold it on the pad a bit longer.',
};
let grid = [];
const ui = {
  card: (n, t) => { $('#cardNo').textContent = `Card ${n} of ${t}`; $('#read').hidden = true; },
  hint: (k) => hint(k && (H[k] || k)),
  say,
  read: (ok, ans, last) => {
    hint(null);
    $('#verdict').textContent = ok ? `Correct. It's ${ans ? 'real' : 'fake'}.` : `Not quite. It's ${ans ? 'real' : 'fake'}.`;
    $('#verdict').className = ok ? 'ok' : 'no';
    $('#plus').hidden = !ok;
    $('#nextBtn').textContent = last ? 'See your results' : 'Next card';
    $('#read').hidden = false; $('#nextBtn').focus({ preventScroll: true });
  },
  end: (d) => {
    $('#read').hidden = true; grid = d.grid;
    $('#eScore').textContent = d.score; $('#eTotal').textContent = d.total; $('#eRank').textContent = d.rank; $('#eLine').textContent = d.line;
    $('#eTix').textContent = d.tickets; $('#ePerfect').hidden = !d.perfect;
    $('#eMiss').innerHTML = d.missed.map(m => `<li>${esc(m.claim)}<span>It was ${m.ans ? 'real' : 'fake'}.</span></li>`).join('');
    $('#eMissWrap').hidden = !d.missed.length;
    $('#end').hidden = false; $('#againBtn').focus({ preventScroll: true });
    $('#shareBtn').onclick = () => share($('#shareBtn'), `Truth Booth\n${grid.map(o => o ? '🟩' : '🟥').join('')}\n${d.score}/${d.total}, ${d.rank}\nhttps://wastemytime.fun/truth-booth`);
  },
};
const hud = chrome(E, { startLabel: 'Step up to the counter', onStart: () => { mode = 'play'; booth.start(); $('#hud').hidden = false; S.setMusicLevel(0.05); } });
const booth = createBooth({ group: stall, camera, ui, bulbs: E.bulbs, onTicket: n => hud.ticket(n) });

$('#nextBtn').onclick = () => { booth.next(); $('#read').hidden = true; };
$('#againBtn').onclick = () => { $('#end').hidden = true; booth.start(); };

/* camera: a slow look at the booth from the midway, then in to the counter */
let mode = 'intro';
const look = new THREE.Vector3(0, 1.9, 0);
camera.position.set(1.4, 1.7, 9.6); camera.lookAt(look);
E.update = (dt) => {
  if (mode === 'intro') {
    const t = E.clock * 0.05;
    camera.position.set(1.4 + Math.sin(t) * 0.8, 1.7, 9.6 - Math.sin(t * 0.7) * 0.4);
    camera.lookAt(look);
    E.exposure = 0.95; E.close = false;
  } else {
    const v = booth.viewPose(camera.aspect, camera.fov), k = DBG.snap ? 1 : 1 - Math.exp(-2.6 * dt);
    camera.position.lerp(v.pos, k); look.lerp(v.look, k); camera.lookAt(look);
    E.close = camera.position.distanceTo(v.pos) < 1.2;
    E.exposure = E.close ? 0.3 : 0.95;
    booth.update(dt);
  }
};
{ const ready = E.onLoad; E.onLoad = () => { ready(); E.lightsOn(new THREE.Vector3(0, 0, 2)); }; }

/* input */
const canvas = $('#fair');
canvas.addEventListener('pointerdown', e => { if (mode === 'play' && booth.down(e)) canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', e => { if (mode === 'play') booth.move(e); });
canvas.addEventListener('pointerup', e => { if (mode === 'play') booth.up(e); });
canvas.addEventListener('pointercancel', () => { if (mode === 'play') booth.up(); });
addEventListener('keydown', e => {
  if (mode !== 'play' || (e.target.tagName === 'BUTTON' && (e.key === 'Enter' || e.key === ' '))) return;
  const k = e.key.toLowerCase();
  if (k === 'r') booth.auto('real'); else if (k === 'f') booth.auto('fake');
  else if ((k === 'enter' || k === ' ') && booth.phase === 'read') { e.preventDefault(); booth.next(); $('#read').hidden = true; }
});

if (location.search.includes('debug')) window.fair = { DBG, camera, booth, start: () => $('#start').click() };
