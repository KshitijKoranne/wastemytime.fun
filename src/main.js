import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { GroundedSkybox } from 'three/examples/jsm/objects/GroundedSkybox.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { manager, setAniso, Bulbs, ground, puddleShader, stall, arch, festoons, ferris, prop, STALL } from './world.js';
import { createBooth, tickets } from './booth.js';
import * as S from './sound.js';

const $ = s => document.querySelector(s);
await Promise.all(['40px "Alfa Slab One"', '40px "Special Elite"', '40px Caveat'].map(f => document.fonts.load(f))).catch(() => {});
const coarse = matchMedia('(pointer: coarse)').matches;
const DBG = { f: 0, fixed: location.search.includes('fixed'), snap: false };
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const smooth = (c, t, k, dt) => c + (t - c) * (1 - Math.exp(-k * dt));

/* ---------- renderer ---------- */
const canvas = $('#fair');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, coarse ? 1.5 : 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.95;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
setAniso(renderer.capabilities.getMaxAnisotropy());

const scene = new THREE.Scene();
const FOG = new THREE.Color(0x0e0f0c);
scene.fog = new THREE.FogExp2(FOG, 0.0085);
const camera = new THREE.PerspectiveCamera(60, 1, 0.03, 900);

// one tone-mapped sky photo is both the backdrop and the reflections; its clamped moon cannot blow out the wet ground
// The photo is a real night field (Poly Haven, CC0). Projected onto a ground dome, it gives the fair real land,
// a tree line and far village lights out to the horizon.
const SKY_YAW = 2.58, MOON_UV = [0.5989, 0.4053];
const sky = new GroundedSkybox(new THREE.Texture(), 2.2, 420, coarse ? 64 : 96);
sky.material.fog = false; sky.rotation.y = SKY_YAW; sky.raycast = () => {}; scene.add(sky);
new THREE.TextureLoader(manager).load('assets/sky/sky.jpg', (t) => {
  t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.SRGBColorSpace;
  sky.material.map = t; sky.material.needsUpdate = true;
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromEquirectangular(t).texture;
  scene.environmentIntensity = 0.5;
  pm.dispose();
});
scene.environmentRotation.y = SKY_YAW;

/* ---------- light ---------- */
// moonlight comes from where the moon is in the photo
const moonDir = (() => { const ph = MOON_UV[0] * Math.PI * 2, th = MOON_UV[1] * Math.PI; return new THREE.Vector3(-Math.cos(ph) * Math.sin(th), Math.cos(th), -Math.sin(ph) * Math.sin(th)).applyAxisAngle(new THREE.Vector3(0, 1, 0), SKY_YAW); })();
const moon = new THREE.DirectionalLight(0xa9bce6, 0.2);
moon.position.copy(moonDir).multiplyScalar(40); moon.target.position.set(0, 0, -8);
moon.castShadow = true; moon.shadow.mapSize.set(coarse ? 1024 : 2048, coarse ? 1024 : 2048);
Object.assign(moon.shadow.camera, { left: -22, right: 22, top: 26, bottom: -26, near: 1, far: 100 });
moon.shadow.bias = -0.0004; moon.shadow.normalBias = 0.02;
scene.add(moon, moon.target);
scene.add(new THREE.HemisphereLight(0x29324d, 0x0d0b0a, 0.25));

/* ---------- the fair ---------- */
const bulbs = new Bulbs(2400);
scene.add(bulbs.mesh);
scene.add(ground());
// real reflections in the puddles (skipped on phones: it renders the fair twice)
const puddles = coarse ? null : new Reflector(new THREE.PlaneGeometry(16, 64), { shader: puddleShader, clipBias: 0.003, multisample: 0, textureWidth: 512, textureHeight: 512 });
if (puddles) { puddles.raycast = () => {}; puddles.rotation.x = -Math.PI / 2; puddles.position.set(0, 0.004, -12); puddles.material.transparent = true; puddles.material.depthWrite = false; scene.add(puddles); }

const gate = arch(bulbs); scene.add(gate);

// ponytail: point lights cost per pixel; ~14 is fine on laptops, phones skip the far ones
const STALLS = [
  { id: 'truth', name: 'Truth Booth', sign: 'assets/art/sign_truth.jpg', stripes: ['#a3231c', '#efe2c8'], wall: 'black_painted_planks', open: true, x: -6.7, z: -9 },
  { id: 'graph', name: 'Guess the Graph', sign: 'assets/art/sign_graph.jpg', stripes: ['#1f6f6b', '#efe2c8'], wall: 'blue_painted_planks', open: false, x: 6.7, z: -9 },
  { id: 'year', name: 'Dial a Year', sign: 'assets/art/sign_year.jpg', stripes: ['#5b2c6f', '#efe2c8'], wall: 'black_painted_planks', open: false, x: -6.7, z: -19.5 },
  { id: 'data', name: 'Hear the Data', sign: 'assets/art/sign_data.jpg', stripes: ['#c4561e', '#efe2c8'], wall: 'green_rough_planks', open: false, x: 6.7, z: -19.5 },
];
for (const s of STALLS) {
  const g = stall({ ...s, bulbs, glow: s.open ? 0xffb070 : 0xff9a5a });
  g.position.set(s.x, 0, s.z); g.rotation.y = s.x < 0 ? Math.PI / 2 : -Math.PI / 2;
  g.userData.info = s; s.group = g; scene.add(g);
}
const poles = [];
for (const z of [3.4, -4.2, -14.2, -25]) poles.push([-4.15, z], [4.15, z]);
scene.add(festoons(bulbs, poles));
const fw = ferris(bulbs); fw.position.set(0, 0, -60); scene.add(fw);

// lamp posts and a few props, all CC0 models from Poly Haven
const lampSpots = [[-4.7, 8.5], [4.7, 8.5], [-4.6, -31], [4.6, -31]];
prop('street_lamp_01', (m) => {
  // the model has its own bulb and glass: light them, and put the lamp's light where the bulb is
  m.traverse(o => {
    if (!o.isMesh) return;
    const n = o.material.name || '';
    if (n.endsWith('_bulb')) { o.material = o.material.clone(); o.material.emissive.set(0xffc58a); o.material.emissiveIntensity = 7; o.castShadow = false; }
    if (n.endsWith('_glass')) { o.material = o.material.clone(); o.material.emissive.set(0xffb070); o.material.emissiveIntensity = 0.35; o.material.transparent = true; o.material.opacity = 0.5; o.castShadow = false; }
  });
  const bb = new THREE.Box3().setFromObject(m), k = 4.6 / (bb.max.y - bb.min.y);
  let bulbAt = new THREE.Vector3(0, bb.max.y - 0.5, 0);
  m.traverse(o => { if (o.isMesh && (o.material.name || '').endsWith('_bulb')) new THREE.Box3().setFromObject(o).getCenter(bulbAt); });
  lampSpots.forEach(([x, z], i) => {
    const c = m.clone(); c.scale.setScalar(k); c.position.set(x, 0, z); c.rotation.y = x < 0 ? -Math.PI / 2 : Math.PI / 2; scene.add(c);
    c.updateMatrixWorld(true);
    const head = bulbAt.clone().applyMatrix4(c.matrixWorld);
    if (!coarse || i < 2) { const l = new THREE.PointLight(0xffc98f, 40, 16, 2); l.position.copy(head); scene.add(l); }
  });
});
const place = (name, list, size) => prop(name, (m) => {
  const bb = new THREE.Box3().setFromObject(m), sz = bb.getSize(new THREE.Vector3()), k = size / Math.max(sz.x, sz.y, sz.z);
  for (const [x, z, r, y = 0] of list) { const c = m.clone(); c.scale.setScalar(k); c.position.set(x, y - bb.min.y * k, z); c.rotation.y = r; scene.add(c); }
});
place('Barrel_01', [[-4.75, -12.1, 0.4], [4.9, -6.4, 1.2], [5.25, -22.2, 2.2]], 0.95);
place('wooden_crate_01', [[-5.05, -6.15, 0.2], [5.15, -12.5, -0.3], [5.1, -12.5, 0.5, 0.62], [-4.95, -22.6, 0.9]], 0.62);
place('metal_trash_can', [[4.45, 1.6, 0.3], [-4.5, -16.2, 1.1]], 0.95);

/* ---------- the Truth Booth ---------- */
const truth = STALLS[0];
const ui = boothUI();
const booth = createBooth({ group: truth.group, camera, ui, bulbs, onTicket: n => { $('#tix b').textContent = n; $('#tix').classList.remove('pop'); void $('#tix').offsetWidth; $('#tix').classList.add('pop'); } });
$('#tix b').textContent = tickets();

/* ---------- post ---------- */
const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: coarse ? 0 : 4 }));
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.5, 0.35, 1.0);
composer.addPass(bloom);
composer.addPass(new OutputPass());

function resize() {
  const w = innerWidth, h = innerHeight;
  camera.aspect = w / h;
  camera.fov = w / h < 0.8 ? 68 : 58;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
  composer.setSize(w, h);
  composer.setPixelRatio(renderer.getPixelRatio());
  if (puddles) puddles.getRenderTarget().setSize(Math.round(w * renderer.getPixelRatio() * 0.5), Math.round(h * renderer.getPixelRatio() * 0.5));
  bloom.setSize(w / 2, h / 2);
}
addEventListener('resize', resize); resize();

/* ---------- walking ---------- */
const me = { x: 0, z: 17, yaw: 0, pitch: 0.06, tx: 0, tz: 17, goal: null };
let mode = 'intro', lightsOn = -1, clock = 0;
const keys = {};
const B = { x0: -3.4, x1: 3.4, z0: -36, z1: 17 };
const clampXZ = (x, z) => [THREE.MathUtils.clamp(x, B.x0, B.x1), THREE.MathUtils.clamp(z, B.z0, B.z1)];
const look = new THREE.Vector3();

function walkTo(x, z, goal = null) { [me.tx, me.tz] = clampXZ(x, z); me.goal = goal; mode = 'walk'; }
function visit(s) {
  const a = s.group.localToWorld(new THREE.Vector3(0, 0, STALL.D / 2 + 3.2));
  walkTo(a.x, a.z, s);
}
function arrive(s) {
  me.yaw = Math.atan2(-(s.group.position.x - me.x), -(s.group.position.z - me.z));
  if (s.open) enterBooth();
  else toast(`${s.name} opens soon. The Truth Booth is open now.`);
}
function enterBooth() {
  mode = 'booth'; hint(null);
  $('#booth').hidden = false;
  S.setMusicLevel(0.06);
  booth.start();
}
function leaveBooth() {
  booth.leave(); mode = 'walk';
  $('#booth').hidden = true; $('#end').hidden = true; $('#read').hidden = true;
  S.setMusicLevel(0.16);
  const a = booth.approach(); me.x = me.tx = a.x; me.z = me.tz = a.z; me.pitch = 0.05;
  me.yaw = Math.atan2(-(truth.group.position.x - me.x), -(truth.group.position.z - me.z));
}

/* ---------- input ---------- */
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
let drag = null;
function pick(e) {
  ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hits = ray.intersectObjects(scene.children, true);
  for (const h of hits) {
    if (h.object === bulbs.mesh) continue;
    const g = h.object.userData.stallGroup; if (g && h.distance < 40) return { stall: g.userData.info };
    if (h.object.name === 'ground') return { ground: h.point };
    return null;
  }
  return null;
}
canvas.addEventListener('pointerdown', (e) => {
  if (mode === 'intro') return;
  if (mode === 'booth') { if (booth.down(e)) { canvas.setPointerCapture(e.pointerId); } return; }
  drag = { x: e.clientX, y: e.clientY, t: performance.now(), moved: 0, yaw: me.yaw, pitch: me.pitch };
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  if (mode === 'booth') { booth.move(e); return; }
  if (drag) {
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.moved = Math.max(drag.moved, Math.hypot(dx, dy));
    me.yaw = drag.yaw + dx * 0.0045; me.pitch = THREE.MathUtils.clamp(drag.pitch + dy * 0.0035, -0.5, 0.75);
    if (drag.moved > 8) hint(null);
  } else if (!coarse && mode === 'walk') {
    const p = pick(e); canvas.style.cursor = p && p.stall ? 'pointer' : 'default';
  }
});
canvas.addEventListener('pointerup', (e) => {
  if (mode === 'booth') { booth.up(e); return; }
  if (!drag) return;
  const tap = drag.moved < 8 && performance.now() - drag.t < 500; drag = null;
  if (!tap) return;
  const p = pick(e);
  if (p && p.stall) visit(p.stall);
  else if (p && p.ground) { walkTo(p.ground.x, p.ground.z); hint(null); }
});
canvas.addEventListener('pointercancel', () => { drag = null; if (mode === 'booth') booth.up(); });
addEventListener('keydown', (e) => {
  if (e.target.tagName === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) return;
  const k = e.key.toLowerCase(); keys[k] = true;
  if (mode === 'booth') {
    if (k === 'r') booth.auto('real'); else if (k === 'f') booth.auto('fake');
    else if (k === 'escape') leaveBooth();
    else if ((k === 'enter' || k === ' ') && booth.phase === 'read') { e.preventDefault(); booth.next(); $('#read').hidden = true; }
  }
});
addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });
addEventListener('blur', () => { for (const k in keys) keys[k] = false; });

/* ---------- HUD ---------- */
let hintT = 0;
function hint(t) { const h = $('#hint'); if (!t) { h.classList.remove('on'); return; } h.textContent = t; h.classList.add('on'); }
function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(hintT); hintT = setTimeout(() => el.classList.remove('on'), 3200); }
function boothUI() {
  const H = {
    first: coarse ? 'Drag the stamp onto an ink pad and hold it there. Green means real, red means fake. Then drag it onto the card.' : 'Drag the stamp onto an ink pad and hold. Green means real, red means fake. Then drop it on the card. Keys: R or F.',
    carry: 'Hold it on the green pad for REAL, or the red pad for FAKE.',
    'inked-real': 'Green ink. Now press it on the card.',
    'inked-fake': 'Red ink. Now press it on the card.',
    noink: 'Ink the stamp first. Hold it on a pad for a moment.',
    dry: 'Too little ink. Hold it on the pad a bit longer.',
  };
  return {
    card: (n, t) => { $('#cardNo').textContent = `Card ${n} of ${t}`; $('#read').hidden = true; },
    hint: (k) => { const el = $('#bhint'); if (!k) { el.classList.remove('on'); return; } el.textContent = H[k] || k; el.classList.add('on'); },
    say: (t) => { const l = $('#live'); l.textContent = ''; setTimeout(() => l.textContent = t, 40); },
    read: (ok, ans, last) => {
      $('#bhint').classList.remove('on');
      $('#verdict').textContent = ok ? `Correct. It's ${ans ? 'real' : 'fake'}.` : `Not quite. It's ${ans ? 'real' : 'fake'}.`;
      $('#verdict').className = ok ? 'ok' : 'no';
      $('#plus').hidden = !ok;
      $('#nextBtn').textContent = last ? 'See your results' : 'Next card';
      $('#read').hidden = false; $('#nextBtn').focus({ preventScroll: true });
    },
    end: (d) => {
      $('#read').hidden = true;
      $('#eScore').textContent = d.score; $('#eTotal').textContent = d.total; $('#eRank').textContent = d.rank; $('#eLine').textContent = d.line;
      $('#eTix').textContent = d.tickets; $('#ePerfect').hidden = !d.perfect;
      $('#eMiss').innerHTML = d.missed.map(m => `<li>${m.claim.replace(/[<&]/g, c => c === '<' ? '&lt;' : '&amp;')}<span>It was ${m.ans ? 'real' : 'fake'}.</span></li>`).join('');
      $('#eMissWrap').hidden = !d.missed.length;
      $('#end').hidden = false; $('#againBtn').focus({ preventScroll: true });
      $('#shareBtn').onclick = () => share(d);
    },
  };
}
function share(d) {
  const text = `Truth Booth at the Waste My Time night fair\n${d.grid.map(o => o ? '🟩' : '🟥').join('')}\n${d.score}/${d.total}, ${d.rank}\nhttps://wastemytime.fun`;
  const b = $('#shareBtn'), done = t => { b.textContent = t; setTimeout(() => b.textContent = 'Share my result', 2200); };
  if (navigator.share) navigator.share({ text }).catch(() => {});
  else if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => done('Copied'), () => done('Could not copy'));
}
$('#nextBtn').onclick = () => { booth.next(); $('#read').hidden = true; };
$('#againBtn').onclick = () => { $('#end').hidden = true; booth.start(); };
$('#leaveBtn').onclick = leaveBooth;
$('#fairBtn').onclick = leaveBooth;
const setSnd = () => { $('#snd').textContent = S.muted ? 'Sound off' : 'Sound on'; $('#snd').setAttribute('aria-pressed', String(!S.muted)); };
$('#snd').onclick = () => { S.setMuted(!S.muted); setSnd(); try { localStorage.setItem('wmt-muted', S.muted ? '1' : ''); } catch (e) {} };
try { if (localStorage.getItem('wmt-muted')) S.setMuted(true); } catch (e) {}
setSnd();

/* ---------- loading and the entrance ---------- */
manager.onProgress = (u, a, b) => { $('#bar i').style.width = Math.round(a / b * 100) + '%'; };
manager.onLoad = () => { $('#loading').hidden = true; $('#enter').disabled = false; $('#enter').textContent = 'Enter the fair'; };
$('#enter').onclick = () => {
  S.start(); S.setMusicLevel(0.16);
  $('#intro').classList.add('gone'); setTimeout(() => $('#intro').hidden = true, 900);
  mode = 'walk'; lightsOn = clock;
  me.tz = 10.5; me.tx = 0;
  $('#walkHud').hidden = false;
  setTimeout(() => hint(coarse ? 'Drag to look around. Tap the ground to walk. Tap a stall to visit it.' : 'Drag to look around. Click the ground or use WASD to walk. Click a stall to visit it.'), 2600);
  if (location.hash === '#truth-booth') setTimeout(() => visit(truth), 1800);
};

/* ---------- frame ---------- */
let last = performance.now(), lamps = null, lampsFull = false;
manager.onLoad = ((f) => () => { lamps = null; f(); })(manager.onLoad);
const camPos = new THREE.Vector3(), camLook = new THREE.Vector3();
function frame(now) {
  const dt = DBG.fixed ? 1 / 30 : Math.min(0.05, (now - last) / 1000); last = now; clock += dt; DBG.f++;

  if (mode === 'walk' || mode === 'intro') {
    // keyboard walking
    let fx = 0, fz = 0;
    if (keys.w || keys.arrowup) fz -= 1; if (keys.s || keys.arrowdown) fz += 1;
    if (keys.a || keys.arrowleft) fx -= 1; if (keys.d || keys.arrowright) fx += 1;
    if (fx || fz) {
      const sp = 3.4 * dt, c = Math.cos(me.yaw), s = Math.sin(me.yaw);
      [me.tx, me.tz] = clampXZ(me.x + (fx * c + fz * s) * sp * 4, me.z + (-fx * s + fz * c) * sp * 4); me.goal = null; hint(null);
    }
    const dx = me.tx - me.x, dz = me.tz - me.z, d = Math.hypot(dx, dz);
    if (d > 0.02) {
      const sp = Math.min(d, (mode === 'intro' ? 1.2 : 3.6) * dt * Math.min(1, d * 1.6 + 0.35));
      me.x += dx / d * sp; me.z += dz / d * sp;
      if (me.goal && d > 0.6) { const want = Math.atan2(-dx, -dz); let dy = want - me.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); me.yaw += dy * Math.min(1, dt * 4); }
    } else if (me.goal) { const g = me.goal; me.goal = null; arrive(g); }
    const bob = d > 0.05 && !reduce ? Math.sin(clock * 9) * 0.018 : 0;
    camPos.set(me.x, 1.65 + bob, me.z);
    camLook.set(me.x - Math.sin(me.yaw) * Math.cos(me.pitch), 1.65 + Math.sin(me.pitch) + bob, me.z - Math.cos(me.yaw) * Math.cos(me.pitch));
    camera.position.copy(camPos); camera.lookAt(camLook); look.copy(camLook);
  } else if (mode === 'booth') {
    const v = booth.viewPose(camera.aspect, camera.fov), k = DBG.snap ? 1 : 1 - Math.exp(-4.5 * dt);
    camera.position.lerp(v.pos, k); look.lerp(v.look, k); camera.lookAt(look);
    booth.update(dt);
  }

  if (puddles) puddles.visible = mode !== 'booth';
  // eye adaptation: the counter is lit by a bare bulb, so exposure drops at the booth and recovers outside
  const ex = mode === 'booth' ? 0.3 : 0.95;
  renderer.toneMappingExposure = DBG.snap ? ex : smooth(renderer.toneMappingExposure, ex, 2.2, dt);
  bloom.threshold = (mode === 'booth' ? 0.95 : 1.1) / renderer.toneMappingExposure;
  bloom.strength = mode === 'booth' ? 0.3 : coarse ? 0.38 : 0.48;
  fw.userData.tick(clock);
  scene.updateMatrixWorld();
  bulbs.update(clock);
  // the lights come on in a wave from the gate down the midway
  if (!lamps) { lamps = []; scene.traverse(o => { if (o.isLight && !o.isDirectionalLight && !o.isHemisphereLight) { o.userData.base ??= o.intensity; lamps.push({ light: o, base: o.userData.base, z: o.getWorldPosition(new THREE.Vector3()).z }); } }); }
  if (lightsOn < 0) { bulbs.mesh.instanceColor.array.fill(0.02); for (const l of lamps) l.light.intensity = l.base * 0.02; }
  else if (clock - lightsOn < 4.5) {
    const a = bulbs.mesh.instanceColor.array, T = clock - lightsOn;
    const on = z => THREE.MathUtils.clamp((T - 0.3 + z * 0.045) * 3, 0.02, 1);
    for (let i = 0; i < bulbs.n; i++) { const f = on(bulbs.wz[i]); a[i * 3] *= f; a[i * 3 + 1] *= f; a[i * 3 + 2] *= f; }
    for (const l of lamps) l.light.intensity = l.base * on(l.z);
  } else if (!lampsFull) { lampsFull = true; for (const l of lamps) l.light.intensity = l.base; }
  composer.render();
  requestAnimationFrame(frame);
}
camera.position.set(me.x, 1.65, me.z); camera.lookAt(0, 1.7, 0); look.set(0, 1.7, 0);
requestAnimationFrame(frame);

// ponytail: test hook for screenshots, only with ?debug in the URL
if (location.search.includes('debug')) window.fair = { DBG, me, visit, enterBooth, leaveBooth, booth, camera, get mode() { return mode; }, set mode(v) { mode = v; } };
