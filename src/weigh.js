import * as THREE from 'three';
import { WEIGHTS } from './weights.js';
import * as S from './sound.js';
import { pbr, STALL, prop } from './world.js';
import { save, persist } from './save.js';

/* Guess the Weight. A cast-iron dial scale on a stage. A crate comes down on a rope; you turn the red hand to
   your guess; you pull the lock lever; the platform sinks and the needle swings to the true weight.
   The dial is logarithmic: 1 milligram to 10 billion tonnes, one step of ten every 15.8 degrees. */

const VMIN = -3, VMAX = 16;                       // log10 of grams
const SWEEP = THREE.MathUtils.degToRad(300);
const phiOf = v => -SWEEP / 2 + (v - VMIN) / (VMAX - VMIN) * SWEEP;   // clockwise from 12 o'clock
const vOf = phi => VMIN + (phi + SWEEP / 2) / SWEEP * (VMAX - VMIN);
const SLAB = '"Alfa Slab One", Georgia, serif', TYPE = '"Special Elite", "Courier New", monospace';
const rand = (a, b) => a + Math.random() * (b - a);
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const smooth = (c, t, k, dt) => c + (t - c) * (1 - Math.exp(-k * dt));

/* "about 3 tonnes", "about 250 grams" */
export function fmt(g) {
  const nice = (n) => { const p = Math.pow(10, Math.floor(Math.log10(n)) - 1); return Math.round(n / p) * p; };
  const num = (n) => { n = nice(n); return n >= 1000 ? n.toLocaleString('en-US', { maximumFractionDigits: 0 }) : String(+n.toPrecision(2)); };
  const one = (n, u, us) => `${num(n)} ${nice(n) === 1 ? u : us}`;
  if (g < 1) return one(g * 1000, 'milligram', 'milligrams');
  if (g < 1000) return one(g, 'gram', 'grams');
  if (g < 1e6) return one(g / 1000, 'kilogram', 'kilograms');
  const t = g / 1e6;
  if (t < 1e6) return one(t, 'tonne', 'tonnes');
  if (t < 1e9) return `${num(t / 1e6)} million tonnes`;
  return `${num(t / 1e9)} billion tonnes`;
}

const times = f => f < 20 ? f.toFixed(1).replace(/\.0$/, '') : f < 1e6 ? Number(f.toPrecision(2)).toLocaleString('en-US') : `${Number((f / 1e6).toPrecision(2))} million`;

/* ---------- the dial face, printed like an old enamel scale ---------- */
function dialFace(paper) {
  const N = 2048, c = document.createElement('canvas'); c.width = c.height = N;
  const x = c.getContext('2d'), C = N / 2, R = N / 2;
  const g = x.createRadialGradient(C, C * 0.85, R * 0.1, C, C, R);
  g.addColorStop(0, '#f6efdc'); g.addColorStop(0.75, '#ece0c3'); g.addColorStop(1, '#d9c8a0');
  x.fillStyle = g; x.fillRect(0, 0, N, N);
  if (paper && paper.complete && paper.naturalWidth) { x.globalAlpha = 0.35; x.globalCompositeOperation = 'multiply'; x.drawImage(paper, 0, 0, N, N); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; }
  const P = (phi, r) => [C + r * Math.sin(phi), C - r * Math.cos(phi)];
  x.strokeStyle = x.fillStyle = '#1d1a17'; x.lineCap = 'butt';
  // pinstripes
  x.strokeStyle = '#9b2a22'; x.lineWidth = 6; x.beginPath(); x.arc(C, C, R * 0.965, 0, 7); x.stroke();
  x.lineWidth = 3; x.beginPath(); x.arc(C, C, R * 0.94, 0, 7); x.stroke();
  // scale arc and ticks
  const r0 = R * 0.82;
  x.strokeStyle = '#1d1a17'; x.lineWidth = 7;
  x.beginPath(); x.arc(C, C, r0, -Math.PI / 2 - SWEEP / 2, -Math.PI / 2 + SWEEP / 2); x.stroke();
  for (let d = VMIN; d <= VMAX; d++) {
    for (let m = 1; m < 10; m++) {
      const v = d + Math.log10(m); if (v > VMAX) break;
      const phi = phiOf(v), len = m === 1 ? R * 0.11 : m === 5 ? R * 0.065 : R * 0.04;
      x.lineWidth = m === 1 ? 9 : m === 5 ? 5 : 3;
      const [a1, b1] = P(phi, r0), [a2, b2] = P(phi, r0 - len);
      x.beginPath(); x.moveTo(a1, b1); x.lineTo(a2, b2); x.stroke();
    }
  }
  // labels: every third step of ten gets its unit; the two between are 10 and 100
  const BIG = { '-3': '1 mg', 0: '1 g', 3: '1 kg', 6: '1 tonne', 9: '1,000 t', 12: '1 million t', 15: '1 billion t' };
  x.textAlign = 'center'; x.textBaseline = 'middle';
  for (let d = VMIN; d <= VMAX; d++) {
    const phi = phiOf(d), big = BIG[d];
    if (big) {
      x.font = `${d >= 12 ? 62 : 74}px ${SLAB}`; x.fillStyle = '#1d1a17';
      const [a, b] = P(phi, r0 - R * 0.21); x.fillText(big, a, b);
    } else {
      x.font = `46px ${TYPE}`; x.fillStyle = '#3a332c';
      const [a, b] = P(phi, r0 - R * 0.16); x.fillText(((d - VMIN) % 3 === 1) ? '10' : '100', a, b);
    }
  }
  // maker's mark
  x.fillStyle = '#9b2a22'; x.font = `64px ${SLAB}`; x.fillText('HONEST WEIGHT', C, C - R * 0.3);
  x.fillStyle = '#3a332c'; x.font = `42px ${TYPE}`; x.fillText('Night Fair Scale Co.', C, C - R * 0.2);
  x.font = `36px ${TYPE}`; x.fillText('1 milligram to 10 billion tonnes', C, C + R * 0.42);
  // stop pins
  for (const v of [VMIN - 0.25, VMAX + 0.25]) { const [a, b] = P(phiOf(v), r0 - R * 0.05); x.fillStyle = '#6b5a3a'; x.beginPath(); x.arc(a, b, 16, 0, 7); x.fill(); }
  // age: a soft darkening at the rim
  const v2 = x.createRadialGradient(C, C, R * 0.6, C, C, R); v2.addColorStop(0, 'rgba(60,40,10,0)'); v2.addColorStop(1, 'rgba(60,40,10,.28)');
  x.fillStyle = v2; x.fillRect(0, 0, N, N);
  return c;
}

/* ---------- the shipping tag on each crate ---------- */
function tagCanvas(name, no) {
  const c = document.createElement('canvas'); c.width = 900; c.height = 560;
  const x = c.getContext('2d');
  x.fillStyle = '#c8a877'; x.beginPath(); x.moveTo(90, 0); x.lineTo(900, 0); x.lineTo(900, 560); x.lineTo(90, 560); x.lineTo(0, 470); x.lineTo(0, 90); x.closePath(); x.fill();
  for (let i = 0; i < 5000; i++) { x.fillStyle = `rgba(${Math.random() < 0.5 ? '255,240,210' : '70,45,20'},${Math.random() * 0.07})`; x.fillRect(Math.random() * 900, Math.random() * 560, Math.random() * 3 + 1, 1); }
  x.fillStyle = '#e3cfa8'; x.beginPath(); x.arc(70, 280, 30, 0, 7); x.fill(); x.fillStyle = '#5a3f22'; x.beginPath(); x.arc(70, 280, 16, 0, 7); x.fill();
  x.fillStyle = '#9b2a22'; x.font = `44px ${SLAB}`; x.fillText(`CRATE No. ${no}`, 140, 80);
  x.fillStyle = '#2a211a'; x.font = `34px ${TYPE}`; x.fillText('Contents:', 140, 140);
  let size = 72, lines;
  const wrap = () => { const w = name.split(' '), out = []; let l = ''; for (const t of w) { const tt = l ? l + ' ' + t : t; if (x.measureText(tt).width > 700 && l) { out.push(l); l = t; } else l = tt; } out.push(l); return out; };
  for (; size > 40; size -= 4) { x.font = `${size}px ${TYPE}`; lines = wrap(); if (lines.length * size * 1.2 < 330) break; }
  lines.forEach((l, i) => x.fillText(l, 140, 210 + size * 0.9 + i * size * 1.2));
  x.strokeStyle = '#2a211a'; x.lineWidth = 3; x.setLineDash([10, 8]); x.strokeRect(120, 20, 760, 520);
  return c;
}

export function createWeigh({ group, camera, ui, onTicket }) {
  const floor = 0.16, zs = -0.3;                  // scale column stands at the back of the stage
  const loader = new THREE.TextureLoader();
  const paper = new Image(); paper.src = '/assets/art/card_paper.jpg';

  const ironN = pbr('rusty_metal_02', { scale: 0.5 });
  const iron = new THREE.MeshStandardMaterial({ color: 0x24392d, metalness: 0.5, roughness: 0.42, normalMap: ironN.normalMap, normalScale: new THREE.Vector2(0.35, 0.35) });
  const brass = new THREE.MeshStandardMaterial({ color: 0xc9a04a, metalness: 1, roughness: 0.3 });
  const steelPlate = pbr('rusty_metal_02', { scale: 0.6, metal: 1, rough: 0.9 }); steelPlate.color.set(0x8a8478);
  const scale = new THREE.Group(); group.add(scale);
  const add = (m, x, y, z) => { m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; scale.add(m); return m; };

  // base and the platform that sinks when unlocked
  add(new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.12, 1.08), iron), 0, floor + 0.06, 0.2);
  const plate = add(new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.035, 0.94), steelPlate), 0, floor + 0.14, 0.2);
  const plateY = plate.position.y;
  // column: turned cast iron with brass rings
  const prof = [[0.17, 0], [0.17, 0.05], [0.12, 0.09], [0.1, 0.2], [0.085, 0.75], [0.1, 0.8], [0.12, 0.86], [0.1, 0.92], [0.13, 1.0], [0.13, 1.05]].map(([r, y]) => new THREE.Vector2(r, y));
  add(new THREE.Mesh(new THREE.LatheGeometry(prof, 32), iron), 0, floor + 0.12, zs);
  for (const y of [0.2, 0.86]) { const rg = add(new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.012, 8, 40), brass), 0, floor + 0.12 + y, zs); rg.rotation.x = Math.PI / 2; }

  // dial head, facing the midway
  const head = new THREE.Group(); head.position.set(0, 1.74, zs); scale.add(head);
  const DR = 0.5;
  const casing = new THREE.Mesh(new THREE.CylinderGeometry(DR + 0.06, DR + 0.06, 0.17, 64), iron); casing.rotation.x = Math.PI / 2; casing.castShadow = true; head.add(casing);
  const bezel = new THREE.Mesh(new THREE.TorusGeometry(DR + 0.035, 0.034, 16, 96), brass); bezel.position.z = 0.09; head.add(bezel);
  const fin = new THREE.Mesh(new THREE.SphereGeometry(0.05, 20, 14), brass); fin.position.set(0, DR + 0.1, 0); head.add(fin);
  const faceTex = new THREE.CanvasTexture(dialFace(paper)); faceTex.colorSpace = THREE.SRGBColorSpace; faceTex.anisotropy = 8;
  const face = new THREE.Mesh(new THREE.CircleGeometry(DR, 96), new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.55 }));
  face.position.z = 0.086; head.add(face);
  paper.onload = () => { faceTex.image = dialFace(paper); faceTex.needsUpdate = true; };
  // needles: blued steel for the truth, red for the guess
  const needleShape = (len, w) => { const s = new THREE.Shape(); s.moveTo(-w, -len * 0.18); s.lineTo(w, -len * 0.18); s.lineTo(w * 0.35, len); s.lineTo(-w * 0.35, len); s.closePath(); return new THREE.ShapeGeometry(s); };
  const trueN = new THREE.Mesh(needleShape(DR * 0.86, 0.014), new THREE.MeshStandardMaterial({ color: 0x14161c, metalness: 0.8, roughness: 0.35 })); trueN.position.z = 0.095; head.add(trueN);
  const guessN = new THREE.Mesh(needleShape(DR * 0.8, 0.019), new THREE.MeshStandardMaterial({ color: 0xb3231c, roughness: 0.45, metalness: 0.2 })); guessN.position.z = 0.1; head.add(guessN);
  const capM = new THREE.Mesh(new THREE.SphereGeometry(0.035, 20, 12), brass); capM.position.z = 0.1; capM.scale.z = 0.5; head.add(capM);
  const glass = new THREE.Mesh(new THREE.CircleGeometry(DR + 0.01, 96), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.07, envMapIntensity: 0.6 }));
  glass.position.z = 0.118; head.add(glass);
  for (const n of [trueN, guessN]) n.castShadow = false;

  // the lock lever, on the right of the column
  const lever = new THREE.Group(); lever.position.set(0.15, floor + 0.62, zs + 0.03); scale.add(lever);
  const boss = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.06, 24), iron); boss.rotation.z = Math.PI / 2; boss.position.set(0.12, floor + 0.62, zs + 0.03); scale.add(boss);
  const hubL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.05, 20), brass); hubL.rotation.z = Math.PI / 2; lever.add(hubL);
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.017, 0.5, 12), brass); arm.position.y = 0.25; lever.add(arm);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.038, 20, 14), new THREE.MeshStandardMaterial({ color: 0x7a1712, roughness: 0.35 })); knob.position.y = 0.52; knob.scale.setScalar(1.25); lever.add(knob);
  lever.traverse(o => { if (o.isMesh) o.castShadow = true; });
  const LEVER_UP = -0.5, LEVER_DOWN = 0.9;          // rotation about x: up and leaning back, pulled down towards you
  lever.rotation.set(LEVER_UP, 0, -0.55);

  // a small stage spot so the dial reads from the midway
  const spot = new THREE.SpotLight(0xffe0b8, 7, 6, 0.55, 0.7, 2);
  spot.position.set(0.3, 2.55, 1.15); spot.target.position.set(0, 1.4, zs); group.add(spot, spot.target);

  /* the crate on its rope */
  const crate = new THREE.Group(); group.add(crate);
  let crateH = 0.55;
  prop('wooden_crate_01', (m) => {
    const bb = new THREE.Box3().setFromObject(m), sz = bb.getSize(new THREE.Vector3()), k = 0.6 / Math.max(sz.x, sz.y, sz.z);
    m.scale.setScalar(k); m.position.set(-(bb.min.x + bb.max.x) / 2 * k, -bb.min.y * k, -(bb.min.z + bb.max.z) / 2 * k);
    crate.add(m); crateH = sz.y * k; tag.position.set(0.02, crateH * 0.52, sz.z * k / 2 + 0.006);
    ring.position.y = crateH + 0.03;
  });
  const tagMat = new THREE.MeshStandardMaterial({ roughness: 0.9 });
  const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.212), tagMat); tag.rotation.z = 0.04; crate.add(tag);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.008, 8, 24), brass); crate.add(ring);
  const ropeMat = new THREE.MeshStandardMaterial({ color: 0x8c7650, roughness: 0.95 });
  const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 1, 8), ropeMat); group.add(rope);
  const CEIL = STALL.H - 0.04, HIGH = 3.4;
  crate.position.set(0, HIGH, 0.2);

  /* ---------- state ---------- */
  let items = [], idx = 0, results = [], phase = 'off';
  let guessV = 6, guessShown = 6, needleV = VMIN - 0.2, needleVel = 0, locked = true, leverA = LEVER_UP;
  let crateTo = HIGH, crateVel = 0, settleT = 0, dragging = null, hookY = HIGH, queued = false;
  const aiming = () => phase === 'aim' || phase === 'lowering';
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();

  function deal() {
    const sorted = WEIGHTS.map((w, i) => i).sort((a, b) => WEIGHTS[a][1] - WEIGHTS[b][1]);
    const n = 6, out = [];
    for (let k = 0; k < n; k++) { const lo = Math.floor(k * sorted.length / n), hi = Math.floor((k + 1) * sorted.length / n); out.push(sorted[lo + (Math.random() * (hi - lo) | 0)]); }
    return shuffle(out);
  }
  function setTag() {
    const t = new THREE.CanvasTexture(tagCanvas(WEIGHTS[items[idx]][0], String(idx + 1).padStart(2, '0')));
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    if (tagMat.map) tagMat.map.dispose(); tagMat.map = t; tagMat.needsUpdate = true;
  }
  function lowerCrate() {
    setTag();
    crate.position.y = HIGH; crateTo = plateY + 0.018; crateVel = 0;
    crate.rotation.y = rand(-0.12, 0.12);
    phase = 'lowering'; queued = false;
    ui.item(idx + 1, items.length, WEIGHTS[items[idx]][0]);
    ui.guess(fmt(Math.pow(10, guessV)));
  }
  function start() {
    items = deal(); idx = 0; results = [];
    locked = true; needleV = VMIN - 0.2; needleVel = 0;
    lowerCrate();
  }

  /* pointer helpers */
  function setNdc(e) { const r = e.target.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera); }
  function dialPhi() {
    const hit = ray.intersectObject(face)[0]; if (!hit) return null;
    const p = face.worldToLocal(hit.point.clone());
    if (Math.hypot(p.x, p.y) < DR * 0.12) return null;
    return Math.atan2(p.x, p.y);
  }
  function near(obj, e, px) {
    const p = obj.getWorldPosition(new THREE.Vector3()).project(camera), r = e.target.getBoundingClientRect();
    return Math.hypot((p.x + 1) / 2 * r.width + r.left - e.clientX, (1 - p.y) / 2 * r.height + r.top - e.clientY) < px;
  }
  function setGuessFromPhi(phi) {
    guessV = THREE.MathUtils.clamp(vOf(THREE.MathUtils.clamp(phi, -SWEEP / 2, SWEEP / 2)), VMIN, VMAX);
    ui.guess(fmt(Math.pow(10, guessV)));
  }

  function down(e) {
    if (!aiming()) return false;
    setNdc(e);
    if (phase === 'aim' && near(knob, e, Math.max(48, e.target.getBoundingClientRect().width * 0.05))) { dragging = { kind: 'lever', y: e.clientY, a: leverA }; return true; }
    const phi = dialPhi();
    if (phi !== null) { dragging = { kind: 'dial' }; setGuessFromPhi(phi); S.tick(); ui.hint(null); return true; }
    return false;
  }
  function move(e) {
    if (!dragging) return;
    if (dragging.kind === 'dial') { setNdc(e); const phi = dialPhi(); if (phi !== null) { const before = Math.round(guessV * 4); setGuessFromPhi(phi); if (Math.round(guessV * 4) !== before) S.tick(); } }
    else {
      leverA = THREE.MathUtils.clamp(dragging.a + (e.clientY - dragging.y) * 0.008, LEVER_UP, LEVER_DOWN);
      if (leverA > LEVER_DOWN - 0.12) { dragging = null; unlock(); }
    }
  }
  function up() { if (dragging && dragging.kind === 'lever') leverA = LEVER_UP; dragging = null; }

  // pulled while the crate is still coming down: weigh it as soon as it lands
  function unlock() {
    if (phase === 'lowering') { queued = true; ui.weighing(); return; }
    if (phase !== 'aim') return;
    phase = 'weighing'; locked = false; settleT = 0; leverA = LEVER_DOWN;
    S.thump(0.5); S.clunk();
    ui.weighing();
  }
  function key(k) {
    if (aiming()) {
      if (k === 'arrowleft' || k === 'arrowdown') { guessV = Math.max(VMIN, guessV - 0.125); ui.guess(fmt(Math.pow(10, guessV))); S.tick(); return true; }
      if (k === 'arrowright' || k === 'arrowup') { guessV = Math.min(VMAX, guessV + 0.125); ui.guess(fmt(Math.pow(10, guessV))); S.tick(); return true; }
      if (k === 'enter' || k === ' ') { unlock(); return true; }
    } else if (phase === 'result' && (k === 'enter' || k === ' ')) { next(); return true; }
    return false;
  }

  function judge() {
    const [name, grams, note] = WEIGHTS[items[idx]];
    const d = Math.abs(guessV - Math.log10(grams)), factor = Math.pow(10, d);
    const grade = d <= Math.log10(2) ? 'spot' : d <= 1 ? 'close' : 'off';
    const won = grade === 'spot' ? 3 : grade === 'close' ? 1 : 0;
    if (won) { save.tickets += won; persist(); onTicket(save.tickets); S.bell(); } else S.buzz();
    results.push({ i: items[idx], guess: guessV, grade, won });
    const dir = guessV < Math.log10(grams) ? 'light' : 'heavy';
    ui.result({ grade, won, name, truth: fmt(grams), note, guess: fmt(Math.pow(10, guessV)), off: grade === 'spot' ? '' : `${times(factor)} times too ${dir}`, last: idx === items.length - 1 });
    phase = 'result';
  }
  function next() {
    if (phase !== 'result') return;
    phase = 'raising'; crateTo = HIGH + 0.4; locked = true; leverA = LEVER_UP; S.creak();
    idx++;
  }
  function finish() {
    save.weighRounds = (save.weighRounds || 0) + 1; persist();
    const won = results.reduce((a, r) => a + r.won, 0), spot = results.filter(r => r.grade === 'spot').length;
    ui.end({ won, spot, total: items.length, tickets: save.tickets, rows: results.map(r => ({ name: WEIGHTS[r.i][0], truth: fmt(WEIGHTS[r.i][1]), guess: fmt(Math.pow(10, r.guess)), grade: r.grade })) });
    phase = 'end';
  }

  /* ---------- per frame ---------- */
  function update(dt) {
    // crate on the rope: eases down, bumps once on the plate
    if (phase === 'lowering' || phase === 'raising') {
      const goingUp = crateTo > crate.position.y;
      if (goingUp) { crate.position.y = Math.min(crateTo, crate.position.y + dt * 1.6); if (crate.position.y >= crateTo - 1e-3) { if (idx >= items.length) finish(); else lowerCrate(); } }
      else {
        const left = crate.position.y - crateTo;
        crate.position.y = Math.max(crateTo, crate.position.y - Math.max(0.3, Math.min(1.8, left * 3)) * dt);
        if (crate.position.y <= crateTo + 1e-4) { phase = 'aim'; S.thump(0.45); if (queued) unlock(); else ui.hint('first'); }
      }
    }
    const crateOn = phase === 'aim' || phase === 'weighing' || phase === 'result';
    crate.visible = crate.position.y < CEIL - crateH;
    const ropeTop = CEIL, ropeBot = crate.position.y + crateH + 0.03;
    hookY = crateOn ? Math.min(CEIL, hookY + dt * 2.2) : ropeBot;
    rope.visible = crate.visible && hookY < CEIL - 0.02;
    rope.scale.y = Math.max(0.01, ropeTop - hookY); rope.position.y = (ropeTop + hookY) / 2; rope.position.x = crate.position.x; rope.position.z = crate.position.z;

    // the plate sinks a few millimetres when the lock is off and a load is on it
    const sink = !locked && crateOn ? 0.012 : 0;
    plate.position.y = smooth(plate.position.y, plateY - sink, 14, dt);
    if (crateOn) crate.position.y = plate.position.y + 0.018;

    // needle: a damped spring, with stop pins at both ends
    const target = locked || !crateOn ? VMIN - 0.2 : Math.log10(WEIGHTS[items[idx]][1]);
    needleVel += (14 * (target - needleV) - 3.1 * needleVel) * dt;
    needleV += needleVel * dt;
    const lo = VMIN - 0.25, hi = VMAX + 0.25;
    if (needleV < lo) { needleV = lo; needleVel *= -0.35; } if (needleV > hi) { needleV = hi; if (needleVel > 2) { S.clunk(); S.boing(); } needleVel *= -0.35; }
    trueN.rotation.z = -phiOf(needleV);
    guessShown = smooth(guessShown, guessV, 18, dt);
    guessN.rotation.z = -phiOf(guessShown);
    if (phase === 'weighing') { settleT += dt; if (settleT > 1.4 && Math.abs(needleVel) < 0.15 && Math.abs(target - needleV) < 0.06) judge(); }

    leverA = dragging && dragging.kind === 'lever' ? leverA : smooth(leverA, locked ? LEVER_UP : LEVER_DOWN, 10, dt);
    lever.rotation.x = leverA;
  }

  function viewPose(aspect, fov) {
    const look = new THREE.Vector3(0, 1.06, 0.05), hy = 0.96, hx = aspect < 0.8 ? 0.62 : 0.78, pitch = 0.1;
    const tv = Math.tan(THREE.MathUtils.degToRad(fov) / 2);
    const dist = Math.max(hy / tv, hx / (tv * aspect)) * 1.05 + 0.4;
    const pos = look.clone().add(new THREE.Vector3(0, Math.sin(pitch), Math.cos(pitch)).multiplyScalar(dist));
    return { pos: group.localToWorld(pos), look: group.localToWorld(look.clone()) };
  }
  function approach() { return group.localToWorld(new THREE.Vector3(0, 1.65, STALL.D / 2 + 3.4)); }

  return {
    root: '#weigh', exposure: 0.42,
    start, update, viewPose, approach, down, move, up, key, next, unlock,
    get phase() { return phase; },
    leave() { phase = 'off'; dragging = null; locked = true; leverA = LEVER_UP; crate.position.y = HIGH; },
  };
}
