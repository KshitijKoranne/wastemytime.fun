import * as THREE from 'three';
import { engine } from '../engine.js';
import { corner } from '../scenery.js';
import { createWeigh } from '../weigh.js';
import * as S from '../sound.js';
import { $, pill, say, esc, chrome } from '../hud.js';

const E = await engine({ shadowBox: { x: 14, z: 14, cz: 2 }, puddleArea: [22, 16, 0, 6] });
const { camera, coarse, DBG } = E;
const stall = corner(E, 'weight', 'graph', 'year');

const hint = pill('#whint');
let hinted = false;
const panel = $('#wpanel'), res = $('#wres');
const ui = {
  item(n, t, name) { $('#wNo').textContent = `Crate ${n} of ${t}`; $('#wName').textContent = name; res.hidden = true; panel.hidden = false; $('#weighBtn').disabled = false; },
  guess(text) { $('#wGuess').textContent = `about ${text}`; },
  hint(k) {
    if (!k || hinted) return hint(null);
    hinted = true;
    hint(coarse ? 'Turn the red hand to your guess. Then pull the lever down, or tap Weigh it.' : 'Drag the red hand to your guess, then pull the lever down. Keys: arrows, then Enter.');
  },
  weighing() { hint(null); $('#weighBtn').disabled = true; },
  result(d) {
    panel.hidden = true; res.hidden = false;
    const v = $('#wVerdict'); v.className = 'verdict ' + d.grade;
    v.textContent = d.grade === 'spot' ? `Spot on! +${d.won} tickets` : d.grade === 'close' ? `Close. +${d.won} ticket` : 'Way off.';
    $('#wTruth').textContent = `It weighs about ${d.truth}.`;
    $('#wNote').textContent = d.note;
    $('#wYou').textContent = `You guessed about ${d.guess}${d.off ? `, ${d.off}` : ''}.`;
    $('#wNext').textContent = d.last ? 'See your results' : 'Next crate';
    $('#wNext').focus({ preventScroll: true });
    say(`${v.textContent} It weighs about ${d.truth}. ${d.note}`);
  },
  end(d) {
    res.hidden = true; panel.hidden = true;
    $('#weScore').textContent = d.spot; $('#weTotal').textContent = d.total; $('#weWon').textContent = d.won; $('#weTix').textContent = d.tickets;
    $('#weRows').innerHTML = d.rows.map(r => `<tr class="${r.grade}"><td>${esc(r.name)}<br><small>You said ${esc(r.guess)}</small></td><td>${esc(r.truth)}</td></tr>`).join('');
    $('#wend').hidden = false; $('#wAgain').focus({ preventScroll: true });
  },
};
const hud = chrome(E, { startLabel: 'Step up to the scale', onStart: () => { mode = 'play'; weigh.start(); $('#hud').hidden = false; S.setMusicLevel(0.05); } });
const weigh = createWeigh({ group: stall, camera, ui, onTicket: n => hud.ticket(n) });
$('#weighBtn').onclick = () => weigh.unlock();
$('#wNext').onclick = () => { res.hidden = true; weigh.next(); };
$('#wAgain').onclick = () => { $('#wend').hidden = true; weigh.start(); };

let mode = 'intro';
const look = new THREE.Vector3(0, 1.8, 0);
camera.position.set(-1.2, 1.7, 9.6); camera.lookAt(look);
E.update = (dt) => {
  if (mode === 'intro') {
    const t = E.clock * 0.05;
    camera.position.set(-1.2 + Math.sin(t) * 0.8, 1.7, 9.6 - Math.sin(t * 0.7) * 0.4);
    camera.lookAt(look);
    E.exposure = 0.95; E.close = false;
  } else {
    const v = weigh.viewPose(camera.aspect, camera.fov), k = DBG.snap ? 1 : 1 - Math.exp(-2.6 * dt);
    camera.position.lerp(v.pos, k); look.lerp(v.look, k); camera.lookAt(look);
    E.close = camera.position.distanceTo(v.pos) < 1.2;
    E.exposure = E.close ? weigh.exposure : 0.95;
  }
  weigh.update(dt);
};
{ const ready = E.onLoad; E.onLoad = () => { ready(); E.lightsOn(new THREE.Vector3(0, 0, 2)); }; }

const canvas = $('#fair');
canvas.addEventListener('pointerdown', e => { if (mode === 'play' && weigh.down(e)) canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', e => { if (mode === 'play') weigh.move(e); });
canvas.addEventListener('pointerup', e => { if (mode === 'play') weigh.up(e); });
canvas.addEventListener('pointercancel', () => { if (mode === 'play') weigh.up(); });
// the mouse wheel turns the red hand too
canvas.addEventListener('wheel', e => { if (mode === 'play') { e.preventDefault(); weigh.key(e.deltaY < 0 ? 'arrowright' : 'arrowleft'); } }, { passive: false });
addEventListener('keydown', e => {
  if (mode !== 'play' || (e.target.tagName === 'BUTTON' && (e.key === 'Enter' || e.key === ' '))) return;
  if (weigh.key(e.key.toLowerCase())) e.preventDefault();
});

if (location.search.includes('debug')) window.fair = { DBG, camera, weigh, start: () => $('#start').click() };
