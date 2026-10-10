import * as THREE from 'three';
import { engine, smooth } from '../engine.js';
import { midway } from '../scenery.js';
import { WHEEL } from '../world.js';
import * as S from '../sound.js';
import { $, pill, chrome } from '../hud.js';

/* Night Ride: a turn on the Ferris wheel above the fair. Board at the bottom, go round once,
   stop at the top to look out over the midway, the field and the far village lights. */
const E = await engine({ shadowBox: { x: 22, z: 34, cz: -22 }, puddleArea: [16, 64, 0, -12] });
const { camera, DBG } = E;
const fw = midway(E), ride = fw.userData.ride;
const hint = pill('#rhint');

let mode = 'intro', from = null, aim = null;   // aim: a pitch the view eases to, until you drag
const me = { yaw: Math.PI, pitch: 0.02 };              // facing back down the midway
const seat = new THREE.Vector3(), seatLook = new THREE.Vector3(), look = new THREE.Vector3(0, 12.5, -60);
const dirOf = (yaw, pitch, v = new THREE.Vector3()) => v.set(-Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch));
const anglesOf = (d) => ({ yaw: Math.atan2(-d.x, -d.z), pitch: Math.asin(THREE.MathUtils.clamp(d.y / d.length(), -1, 1)) });
const blend = (a, b, k) => ({ yaw: a.yaw + (((b.yaw - a.yaw) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI) * k, pitch: a.pitch + (b.pitch - a.pitch) * k });
const ease = (a, b, x) => { const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

const hud = chrome(E, { startLabel: 'Get on', onStart: () => { $('#hud').hidden = false; board(); } });
ride.begin((st) => {
  if (st === 'top') { aim = -0.42; hint(`You are about ${Math.round(WHEEL.hub + WHEEL.R)} metres up. Drag to look around.`); }
  if (st === 'down') { aim = 0.02; hint(null); }
  if (st === 'off') { hint(null); $('#again').hidden = false; }
}, true);
// walk up the midway to the waiting car, step in, turn round and sit down
function board() {
  mode = 'ride';
  from = { pos: camera.position.clone(), t: 0, a: anglesOf(look.clone().sub(camera.position)), b: anglesOf(seat.clone().sub(camera.position)) };
  hint('Sit back. Drag to look around.');
  S.setMusicLevel(0.3);
}
$('#againBtn').onclick = () => { $('#again').hidden = true; hint('Round you go again.'); ride.again(); };

E.update = (dt) => {
  const car = ride.car;
  if (car) { car.updateMatrixWorld(true); car.localToWorld(seat.set(0, WHEEL.seatEye, -0.15)); }
  if (mode === 'intro') {
    // down the midway, looking up at the wheel
    const t = E.clock * 0.05;
    camera.position.set(2.6 + Math.sin(t) * 1.2, 1.7, -27 - Math.sin(t * 0.7) * 1.5);
    camera.lookAt(look);
    return;
  }
  if (aim !== null) { me.pitch = smooth(me.pitch, aim, 1.4, dt); if (Math.abs(me.pitch - aim) < 0.005) aim = null; }
  if (from && from.t < 1) {
    from.t = Math.min(1, from.t + dt / 4.5);
    if (from.t === 1) ride.go();             // seated: the wheel starts a moment later
    camera.position.lerpVectors(from.pos, seat, ease(0, 1, from.t));
    const a = blend(blend(from.a, from.b, ease(0, 0.25, from.t)), me, ease(0.62, 1, from.t));
    look.copy(camera.position).add(dirOf(a.yaw, a.pitch));
  } else { camera.position.copy(seat); look.copy(seat).add(dirOf(me.yaw, me.pitch, seatLook)); }
  camera.lookAt(look);
};
{ const ready = E.onLoad; E.onLoad = () => { ready(); E.lightsOn(new THREE.Vector3(0, 0, -50)); }; }

/* drag to look around while seated */
const canvas = $('#fair');
let drag = null;
canvas.addEventListener('pointerdown', e => { if (mode !== 'ride') return; aim = null; drag = { x: e.clientX, y: e.clientY, yaw: me.yaw, pitch: me.pitch }; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', e => {
  if (!drag) return;
  me.yaw = drag.yaw + (e.clientX - drag.x) * 0.0045;
  me.pitch = THREE.MathUtils.clamp(drag.pitch + (e.clientY - drag.y) * 0.0035, -1.1, 0.9);
});
const end = () => { drag = null; };
canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
addEventListener('keydown', e => {
  if (mode !== 'ride') return;
  const k = e.key.toLowerCase(), step = 0.08; aim = null;
  if (k === 'arrowleft' || k === 'a') me.yaw += step; else if (k === 'arrowright' || k === 'd') me.yaw -= step;
  else if (k === 'arrowup' || k === 'w') me.pitch = Math.min(0.9, me.pitch + step); else if (k === 'arrowdown' || k === 's') me.pitch = Math.max(-1.1, me.pitch - step);
});

if (location.search.includes('debug')) window.fair = { DBG, E, camera, ride, me, start: () => $('#start').click() };
