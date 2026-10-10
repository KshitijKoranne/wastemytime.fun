import * as THREE from 'three';
import { CASES, RANKS } from './cases.js';
import * as S from './sound.js';
import { pbr, image, STALL, prop } from './world.js';
import { save, persist } from './save.js';

const INK = { real: '#1f7a45', fake: '#c0262d' };
const TYPE = '"Special Elite", "Courier New", monospace', SLAB = '"Alfa Slab One", Georgia, serif', PEN = 'Caveat, "Comic Sans MS", cursive';
const rand = (a, b) => a + Math.random() * (b - a);
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const smooth = (cur, to, k, dt) => cur + (to - cur) * (1 - Math.exp(-k * dt));

export const tickets = () => save.tickets;

/* ---------- the seal cut into the stamp's rubber ---------- */
function sealCanvas(size = 512) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const x = c.getContext('2d'), r = size / 2;
  x.translate(r, r); x.fillStyle = x.strokeStyle = '#000';
  x.lineWidth = size * 0.035; x.beginPath(); x.arc(0, 0, r * 0.93, 0, 7); x.stroke();
  x.lineWidth = size * 0.014; x.beginPath(); x.arc(0, 0, r * 0.66, 0, 7); x.stroke();
  const ring = (txt, rad, start, span) => {
    x.font = `${size * 0.1}px ${SLAB}`; x.textAlign = 'center'; x.textBaseline = 'middle';
    const ch = [...txt], step = span / (ch.length - 1);
    ch.forEach((c2, i) => { const a = start + i * step; x.save(); x.rotate(a); x.translate(0, -rad); x.fillText(c2, 0, 0); x.restore(); });
  };
  ring('TRUTH BOOTH', r * 0.795, -1.25, 2.5);
  x.save(); x.rotate(Math.PI); ring('NIGHT FAIR', r * 0.795, -1.0, 2.0); x.restore();
  for (const a of [Math.PI / 2 + 0.05, -Math.PI / 2 - 0.05]) { x.save(); x.rotate(a); x.translate(0, -r * 0.795); star(x, size * 0.04); x.restore(); }
  x.font = `${size * 0.135}px ${SLAB}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('CHECKED', 0, size * 0.01);
  x.fillRect(-r * 0.5, -size * 0.1, r, size * 0.012); x.fillRect(-r * 0.5, size * 0.09, r, size * 0.012);
  x.save(); x.translate(0, -size * 0.17); star(x, size * 0.035); x.restore();
  x.save(); x.translate(0, size * 0.18); star(x, size * 0.035); x.restore();
  return c;
}
function star(x, s) { x.beginPath(); for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 - Math.PI / 2, rr = i % 2 ? s * 0.45 : s; x.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } x.closePath(); x.fill(); }

/* rubber-stamp impression: the seal in ink, broken up by paper tooth and uneven pressure */
function inked(seal, color, amount) {
  const c = document.createElement('canvas'); c.width = seal.width; c.height = seal.height;
  const x = c.getContext('2d');
  x.drawImage(seal, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, c.width, c.height);
  const id = x.getImageData(0, 0, c.width, c.height), d = id.data, W = c.width;
  const tx = Math.cos(rand(0, 6.28)), ty = Math.sin(rand(0, 6.28));
  for (let i = 0; i < d.length; i += 4) {
    if (!d[i + 3]) continue;
    const p = i / 4, u = (p % W) / W - 0.5, v = Math.floor(p / W) / W - 0.5;
    const press = 0.75 + 0.6 * (u * tx + v * ty) + amount * 0.35;
    const grain = Math.random();
    let a = press - grain * 0.55;
    if (Math.random() < 0.04) a *= 0.2;
    d[i + 3] *= Math.max(0, Math.min(1, a * 1.25));
  }
  x.putImageData(id, 0, 0);
  return c;
}

/* ---------- index cards ---------- */
const CW = 1536, CH = 1024;
let paperImg = null;
function paperCanvas() {
  const c = document.createElement('canvas'); c.width = CW; c.height = CH;
  const x = c.getContext('2d');
  if (paperImg && paperImg.complete) x.drawImage(paperImg, 0, 0, CW, CH); else { x.fillStyle = '#efe6d0'; x.fillRect(0, 0, CW, CH); }
  return [c, x];
}
function wrap(x, text, maxW) {
  const words = text.split(' '), lines = []; let line = '';
  for (const w of words) { const t = line ? line + ' ' + w : w; if (x.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; }
  if (line) lines.push(line); return lines;
}
function typed(x, text, X, Y, maxW, maxH, size, minSize = 34) {
  let lines, lh;
  for (; size >= minSize; size -= 3) { x.font = `${size}px ${TYPE}`; lines = wrap(x, text, maxW); lh = size * 1.28; if (lines.length * lh <= maxH) break; }
  lines.forEach((l, i) => {
    // a typewriter strikes each line a little unevenly
    x.globalAlpha = 0.9; x.fillStyle = '#26221f'; x.fillText(l, X, Y + i * lh);
    x.globalAlpha = 0.25; x.fillText(l, X + 1.5, Y + i * lh + 1);
  });
  x.globalAlpha = 1;
  return lines.length * lh;
}
function cardFront(no, total, claim, cat) {
  const [c, x] = paperCanvas();
  x.textBaseline = 'alphabetic';
  x.font = `40px ${TYPE}`; x.fillStyle = '#3a332c'; x.globalAlpha = 0.85;
  x.fillText('TRUTH BOOTH', 96, 130); x.textAlign = 'right'; x.fillText(`No. ${no} of ${total}`, CW - 96, 130); x.textAlign = 'left';
  x.font = `36px ${TYPE}`; x.globalAlpha = 0.6; x.fillText(`Subject: ${cat}`, 96, 232); x.globalAlpha = 1;
  const h = 560;
  x.textBaseline = 'top';
  typed(x, claim, 96, 300, CW - 192 - 40, h, 96);
  // pencilled target for the stamp
  x.setLineDash([10, 14]); x.lineWidth = 3; x.strokeStyle = 'rgba(70,64,58,.35)';
  x.beginPath(); x.arc(CW - 270, CH - 190, 140, 0, 7); x.stroke(); x.setLineDash([]);
  x.font = `30px ${TYPE}`; x.fillStyle = 'rgba(70,64,58,.5)'; x.textAlign = 'center'; x.fillText('stamp here', CW - 270, CH - 205);
  return c;
}
function cardBack(no, ans, note, said, ok) {
  const [c, x] = paperCanvas();
  x.font = `40px ${TYPE}`; x.fillStyle = '#3a332c'; x.globalAlpha = 0.85; x.textBaseline = 'alphabetic';
  x.fillText('THE TRUTH', 96, 130); x.textAlign = 'right'; x.fillText(`No. ${no}`, CW - 96, 130); x.textAlign = 'left'; x.globalAlpha = 1;
  // verdict in a big rubber stamp
  const v = document.createElement('canvas'); v.width = 760; v.height = 240;
  const vx = v.getContext('2d'); vx.lineWidth = 16; vx.strokeRect(10, 10, 740, 220); vx.lineWidth = 5; vx.strokeRect(34, 34, 692, 172);
  vx.font = `150px ${SLAB}`; vx.textAlign = 'center'; vx.textBaseline = 'middle'; vx.fillText(ans ? 'REAL' : 'FAKE', 380, 128);
  const iv = inked(v, ans ? INK.real : INK.fake, 0.8);
  x.save(); x.translate(96 + 380 * 0.82, 300); x.rotate(-0.05); x.globalCompositeOperation = 'multiply'; x.drawImage(iv, -380 * 0.82, -120 * 0.82, 760 * 0.82, 240 * 0.82); x.restore();
  x.textBaseline = 'top';
  typed(x, note, 96, 440, CW - 192, 400, 58, 38);
  x.font = `64px ${PEN}`; x.fillStyle = ok ? '#1f6b3c' : '#b4231f'; x.textBaseline = 'alphabetic';
  x.save(); x.translate(CW - 96, CH - 70); x.rotate(-0.03); x.textAlign = 'right';
  x.fillText(`You said ${said}. ${ok ? 'Correct!' : 'Not quite.'}`, 0, 0); x.restore();
  return c;
}

/* ---------- the booth ---------- */
export function createBooth({ group, camera, ui, bulbs, onTicket }) {
  const { top, D } = STALL;
  const zc = D / 2 - 0.25;
  const loader = new THREE.TextureLoader();
  paperImg = new Image(); paperImg.src = '/assets/art/card_paper.jpg';
  const seal = sealCanvas();

  /* card: a thin box, printed on both sides */
  const CARD = { w: 0.36, d: 0.24 }, cardPos = new THREE.Vector3(0, top + 0.0012, zc - 0.05);
  const edgeMat = new THREE.MeshStandardMaterial({ color: 0xe6dcc4, roughness: 0.9 });
  // three r186 allocates fixed-size GPU storage per texture, so each new card face gets a fresh texture
  const canvasTex = (c) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const setMap = (mat, c) => { if (mat.map) mat.map.dispose(); mat.map = canvasTex(c); mat.needsUpdate = true; };
  const frontMat = new THREE.MeshStandardMaterial({ roughness: 0.88 });
  const backMat = new THREE.MeshStandardMaterial({ roughness: 0.88 });
  const card = new THREE.Mesh(new THREE.BoxGeometry(CARD.w, 0.0009, CARD.d), [edgeMat, edgeMat, frontMat, backMat, edgeMat, edgeMat]);
  card.castShadow = card.receiveShadow = true;
  group.add(card);
  let frontCanvas = null;

  /* ink pads: real tins, photographed from above, on a tin body */
  const tin = new THREE.MeshStandardMaterial({ color: 0x8f8b84, metalness: 0.85, roughness: 0.58 });
  const pads = {};
  for (const [kind, x0, img] of [['real', -0.29, 'pad_green'], ['fake', 0.29, 'pad_red']]) {
    const t = loader.load(`/assets/art/${img}.jpg`); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    const topMat = new THREE.MeshStandardMaterial({ map: t, roughness: 0.5, metalness: 0.1 });
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.018, 0.14), [tin, tin, topMat, tin, tin, tin]);
    m.position.set(x0, top + 0.009, zc + 0.205); m.castShadow = m.receiveShadow = true; group.add(m);
    // the open lid stands behind the tin, with a paper label
    const lc = document.createElement('canvas'); lc.width = 512; lc.height = 440;
    const lx = lc.getContext('2d');
    const gr = lx.createLinearGradient(0, 0, 512, 440); gr.addColorStop(0, '#c9c6bf'); gr.addColorStop(0.5, '#9d9992'); gr.addColorStop(1, '#bdb9b1');
    lx.fillStyle = gr; lx.fillRect(0, 0, 512, 440);
    for (let i = 0; i < 2600; i++) { lx.fillStyle = `rgba(${Math.random() < 0.5 ? '255,255,255' : '40,36,30'},${Math.random() * 0.08})`; lx.fillRect(Math.random() * 512, Math.random() * 440, Math.random() * 40, 1); }
    lx.fillStyle = '#efe6cf'; lx.fillRect(56, 70, 400, 300);
    lx.strokeStyle = INK[kind]; lx.lineWidth = 10; lx.strokeRect(76, 90, 360, 260);
    lx.fillStyle = INK[kind]; lx.font = `120px ${SLAB}`; lx.textAlign = 'center'; lx.textBaseline = 'middle'; lx.fillText(kind === 'real' ? 'REAL' : 'FAKE', 256, 205);
    lx.font = `34px ${TYPE}`; lx.fillStyle = '#3a332c'; lx.fillText(kind === 'real' ? 'green ink' : 'red ink', 256, 300);
    const lt = new THREE.CanvasTexture(lc); lt.colorSpace = THREE.SRGBColorSpace; lt.anisotropy = 8;
    const lg = new THREE.BoxGeometry(0.14, 0.12, 0.004); lg.translate(0, 0.06, 0);
    const lid = new THREE.Mesh(lg, [tin, tin, tin, tin, new THREE.MeshStandardMaterial({ map: lt, roughness: 0.5, metalness: 0.3 }), tin]);
    lid.castShadow = true; group.add(lid);
    // on phones a paper tag in front of the tin carries the word instead of the standing lid
    const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.11, 0.0945), new THREE.MeshStandardMaterial({ map: lt, roughness: 0.85 }));
    tag.rotation.x = -Math.PI / 2; tag.receiveShadow = true; group.add(tag);
    pads[kind] = { x: x0, z: zc + 0.205, mesh: m, label: lid, tag };
  }

  /* the stamp: turned and varnished wooden handle, a block, a rubber seal */
  const stamp = new THREE.Group();
  const prof = [[0, 0], [0.0125, 0], [0.0125, 0.004], [0.0095, 0.012], [0.0082, 0.03], [0.0092, 0.044], [0.0145, 0.055], [0.0195, 0.066], [0.0205, 0.075], [0.0178, 0.085], [0.0105, 0.0915], [0, 0.0935]].map(([r, y]) => new THREE.Vector2(r, y));
  const wood = pbr('fine_grained_wood', { scale: 0.12, rough: 0.55 });
  const handleMat = new THREE.MeshPhysicalMaterial({ map: wood.map, normalMap: wood.normalMap, roughness: 0.42, clearcoat: 0.7, clearcoatRoughness: 0.35, color: 0xd9a06a });
  const handle = new THREE.Mesh(new THREE.LatheGeometry(prof, 40), handleMat); handle.position.y = 0.027; stamp.add(handle);
  const block = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.043, 0.022, 48), handleMat); block.position.y = 0.0165; stamp.add(block);
  const st = new THREE.CanvasTexture(seal); st.colorSpace = THREE.SRGBColorSpace;
  const lab = new THREE.Mesh(new THREE.CircleGeometry(0.036, 48), new THREE.MeshStandardMaterial({ map: st, roughness: 0.8, color: 0xd9ccb0 }));
  lab.rotation.x = -Math.PI / 2; lab.rotation.z = Math.PI; lab.position.y = 0.0277; stamp.add(lab);
  const rubberMat = new THREE.MeshStandardMaterial({ color: 0x3b2018, roughness: 0.85 });
  const rubber = new THREE.Mesh(new THREE.CylinderGeometry(0.039, 0.039, 0.0055, 48), rubberMat); rubber.position.y = 0.00275; stamp.add(rubber);
  stamp.traverse(o => { if (o.isMesh) o.castShadow = true; });
  const rest = new THREE.Vector3(0, top, zc + 0.215);
  stamp.position.copy(rest); group.add(stamp);

  /* Landscape: pads either side of the card. Portrait (phones held upright): pads under the card, lids open
     flat towards you, so the card can fill the screen width and stay readable. */
  let portrait = null;
  function arrange(p) {
    if (p === portrait) return;
    portrait = p;
    for (const k of ['real', 'fake']) {
      const s = k === 'real' ? -1 : 1, pd = pads[k];
      pd.x = s * (p ? 0.12 : 0.29); pd.z = zc + (p ? 0.1 : 0.205);
      pd.mesh.position.set(pd.x, top + 0.009, pd.z);
      pd.label.visible = !p; pd.label.position.set(pd.x, top + 0.018, pd.z - 0.072); pd.label.rotation.set(-0.22, 0, 0);
      pd.tag.visible = p; pd.tag.position.set(pd.x, top + 0.0008, pd.z + 0.125);
    }
    cardPos.z = zc + (p ? -0.13 : -0.05);
    if (!slide && phase !== 'read') card.position.z = cardPos.z;
    rest.set(0, top, zc + (p ? 0.1 : 0.215));
    if (!held && !anim && !autoRun) { stamp.position.x = rest.x; stamp.position.z = rest.z; target.copy(rest); }
  }

  /* crates at each end of the counter: true cards left, fakes right */
  const bins = { real: new THREE.Vector3(-0.66, top, zc), fake: new THREE.Vector3(0.66, top, zc) };
  for (const [kind, p] of Object.entries(bins)) {
    prop('wooden_crate_02', (s) => {
      const bb = new THREE.Box3().setFromObject(s), sz = bb.getSize(new THREE.Vector3());
      const k = 0.34 / Math.max(sz.x, sz.z); s.scale.setScalar(k);
      s.position.set(p.x, top - bb.min.y * k, p.z); s.rotation.y = kind === 'real' ? 0.06 : -0.08; group.add(s);
      p.y = top + sz.y * k * 0.55; p.h = sz.y * k;
      // chalked tag on the crate
      const c = document.createElement('canvas'); c.width = 512; c.height = 200; const x = c.getContext('2d');
      x.fillStyle = '#e9dfc6'; x.fillRect(0, 0, 512, 200); x.strokeStyle = INK[kind]; x.lineWidth = 8; x.strokeRect(14, 14, 484, 172);
      x.fillStyle = INK[kind]; x.font = `98px ${SLAB}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(kind === 'real' ? 'REAL' : 'FAKES', 256, 104);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
      const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.17, 0.066), new THREE.MeshStandardMaterial({ map: t, roughness: 0.9 }));
      tag.position.set(p.x, top + sz.y * k * 0.55, p.z + sz.z * k / 2 + 0.003); group.add(tag);
    });
  }
  const binned = [];

  /* the "Step right up" poster on the booth's side wall */
  const pt = loader.load('/assets/art/poster_stepup.jpg'); pt.colorSpace = THREE.SRGBColorSpace;
  const poster = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.93), new THREE.MeshStandardMaterial({ map: pt, roughness: 0.85 }));
  poster.position.set(-STALL.W / 2 + 0.085, 1.9, 0.1); poster.rotation.y = Math.PI / 2; group.add(poster);

  /* ---------- state ---------- */
  let deck = [], idx = 0, results = [], phase = 'off';
  let held = false, ink = 0, inkKind = null, pressT = 0, onPad = null, down = false;
  const target = new THREE.Vector3().copy(rest);
  let stampY = top, cardFlip = 0, cardFlipTo = 0, cardLift = 0, view = 'counter';
  let anim = null, slide = null;
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plane = new THREE.Plane(), tmp = new THREE.Vector3();
  const wq = new THREE.Quaternion();

  function deal() {
    let unseen = CASES.map((c, i) => i).filter(i => !save.seen.includes(i));
    if (unseen.length < 10) { save.seen = []; unseen = CASES.map((c, i) => i); }
    const of = w => shuffle(unseen.filter(i => CASES[i][0] === w));
    const k = 4 + (Math.random() * 3 | 0);
    let pick = of(1).slice(0, k); pick = pick.concat(of(0).slice(0, 10 - pick.length));
    if (pick.length < 10) pick = pick.concat(shuffle(unseen.filter(i => !pick.includes(i))).slice(0, 10 - pick.length));
    return shuffle(pick);
  }

  function drawFront() {
    const i = deck[idx];
    frontCanvas = cardFront(String(idx + 1).padStart(2, '0'), deck.length, CASES[i][2], CASES[i][1]);
    setMap(frontMat, frontCanvas);
  }
  function showCard(fromBack) {
    drawFront();
    cardFlip = cardFlipTo = 0; cardLift = 0;
    card.rotation.set(0, rand(-0.04, 0.04), 0);
    card.visible = true;
    if (fromBack) { slide = { t: 0, dur: 0.55, from: cardPos.clone().add(new THREE.Vector3(0, 0, -0.42)), to: cardPos.clone() }; card.position.copy(slide.from); S.paper(); }
    else card.position.copy(cardPos);
    phase = 'stamp';
    ui.card(idx + 1, deck.length);
    ui.hint(results.length ? null : 'first');
    ui.say(`Card ${idx + 1}. ${CASES[deck[idx]][2]}`);
  }

  function start() {
    deck = deal(); idx = 0; results = [];
    for (const b of binned.splice(0)) drop(b);
    view = 'counter'; ink = 0; inkKind = null; setRubber();
    showCard(true);
  }

  function setRubber() {
    rubberMat.color.set(0x3b2018);
    if (inkKind && ink > 0) rubberMat.color.lerp(new THREE.Color(INK[inkKind]).convertSRGBToLinear(), Math.min(1, ink) * 0.9);
  }

  /* pointer -> point on the counter, in the booth's own frame */
  function counterHit(e) {
    const r = e.target.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    group.updateMatrixWorld();
    const o = group.localToWorld(new THREE.Vector3(0, top, 0));
    plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), o);
    if (!ray.ray.intersectPlane(plane, tmp)) return null;
    return group.worldToLocal(tmp.clone());
  }
  function screenOf(v) { const p = group.localToWorld(v.clone()).project(camera); return p; }
  function nearStamp(e) {
    const r = e.target.getBoundingClientRect(), p = screenOf(stamp.position.clone().add(new THREE.Vector3(0, 0.05, 0)));
    const sx = (p.x + 1) / 2 * r.width + r.left, sy = (1 - p.y) / 2 * r.height + r.top;
    return Math.hypot(e.clientX - sx, e.clientY - sy) < Math.max(56, r.width * 0.07);
  }
  const inPad = (p) => { for (const k in pads) { const pd = pads[k]; if (Math.abs(p.x - pd.x) < 0.085 && Math.abs(p.z - pd.z) < 0.085) return k; } return null; };
  function cardLocal(p) { // point in the card's own axes (x along the long side, z along the short side)
    const dx = p.x - card.position.x, dz = p.z - card.position.z, a = -card.rotation.y;
    return { u: dx * Math.cos(a) - dz * Math.sin(a), v: dx * Math.sin(a) + dz * Math.cos(a) };
  }
  const onCard = p => { const c = cardLocal(p); return Math.abs(c.u) < CARD.w / 2 + 0.01 && Math.abs(c.v) < CARD.d / 2 + 0.01; };

  function down_(e) {
    if (phase !== 'stamp') return false;
    if (!held && nearStamp(e)) { held = true; down = true; S.paper(); ui.hint('carry'); const p = counterHit(e); if (p) target.copy(p); return true; }
    return false;
  }
  function move_(e) { if (!held) return; const p = counterHit(e); if (p) { target.x = THREE.MathUtils.clamp(p.x, -0.5, 0.5); target.z = THREE.MathUtils.clamp(p.z, zc - 0.25, zc + 0.42); } }
  function up_() {
    if (!held) return;
    held = false; down = false;
    if (onCard(stamp.position) && phase === 'stamp') stampCard(stamp.position.clone());
    else { onPad = null; target.copy(rest); }
  }

  function stampCard(p) {
    if (!inkKind || ink < 0.3) {
      ui.hint(inkKind ? 'dry' : 'noink');
      target.copy(rest);
      anim = { kind: 'tap', t: 0, p };
      return;
    }
    phase = 'pressing';
    anim = { kind: 'press', t: 0, p, inkKind, amount: ink };
  }

  function impress(p, kind, amount) {
    const c = cardLocal(p);
    const u = (c.u / CARD.w + 0.5) * CW, v = (c.v / CARD.d + 0.5) * CH;
    const ctx = frontCanvas.getContext('2d'), s = 340;
    const imp = inked(seal, INK[kind], amount);
    ctx.save(); ctx.translate(u, v); ctx.rotate(rand(-0.35, 0.35) - stamp.rotation.y); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.92;
    ctx.drawImage(imp, -s / 2, -s / 2, s, s); ctx.restore();
    frontMat.map.needsUpdate = true;
  }

  function judge(kind) {
    const i = deck[idx], ans = !!CASES[i][0], ok = (kind === 'real') === ans;
    results.push({ i, ok, kind });
    if (!save.seen.includes(i)) save.seen.push(i);
    if (ok) { save.tickets++; S.bell(); onTicket(save.tickets); } else S.buzz();
    persist();
    const back = cardBack(String(idx + 1).padStart(2, '0'), ans, CASES[i][3], kind, ok);
    setMap(backMat, back);
    ui.say(`${ok ? 'Correct.' : 'Not quite.'} It is ${ans ? 'real' : 'fake'}. ${CASES[i][3]}`);
    setTimeout(() => { if (phase !== 'pressing') return; cardLift = 1; cardFlipTo = Math.PI; S.flip(); view = 'read'; phase = 'read'; ui.read(ok, ans, idx === deck.length - 1); }, 650);
  }

  function next() {
    if (phase !== 'read') return;
    const ans = !!CASES[deck[idx]][0], dest = bins[ans ? 'real' : 'fake'];
    // filed cards are small on screen: give them small textures, and free them when they leave
    const flyer = card.clone(); flyer.material = card.material.map(m => m.clone()); flyer.material[2].map = canvasTex(shrink(frontCanvas)); flyer.material[3].map = canvasTex(shrink(backMat.map.image));
    group.add(flyer); binned.push(flyer);
    const from = card.position.clone(), to = new THREE.Vector3(dest.x + rand(-0.03, 0.03), (dest.y || top + 0.1) + Math.min(binned.length, 8) * 0.004, dest.z + rand(-0.02, 0.02));
    flights.push({ m: flyer, t: 0, from, to, r0: flyer.rotation.clone(), spin: rand(-1, 1) });
    S.toss();
    card.visible = false; view = 'counter';
    idx++;
    if (binned.length > 14) drop(binned.shift());
    phase = 'between';
    if (idx >= deck.length) { phase = 'end'; setTimeout(() => { if (phase === 'end') finish(); }, 700); }
    else setTimeout(() => { if (phase === 'between') showCard(true); }, 380);
  }
  const flights = [];
  function shrink(c) { const o = document.createElement('canvas'); o.width = 384; o.height = 256; o.getContext('2d').drawImage(c, 0, 0, 384, 256); return o; }
  function drop(m) { group.remove(m); m.material.forEach((x, i) => { if (i === 2 || i === 3) { x.map.dispose(); x.dispose(); } }); }

  function finish() {
    save.rounds++;
    const score = results.filter(r => r.ok).length;
    if (score === deck.length) { save.tickets += 5; onTicket(save.tickets); }
    persist();
    const [, rank, line] = RANKS.filter(r => score >= r[0]).pop();
    const missed = results.filter(r => !r.ok).map(r => ({ claim: CASES[r.i][2], ans: !!CASES[r.i][0] }));
    ui.end({ score, total: deck.length, rank, line, missed, tickets: save.tickets, perfect: score === deck.length, grid: results.map(r => r.ok) });
  }

  /* keyboard: R / F runs the whole motion for you, timed in scene time so slow devices keep up */
  let autoRun = null;
  function auto(kind) {
    if (phase !== 'stamp' || held || autoRun) return;
    autoRun = { kind, t: 0 };
    held = true; down = true; target.set(pads[kind].x, 0, pads[kind].z);
  }
  function autoStep(dt) {
    if (!autoRun) return;
    autoRun.t += dt;
    if (autoRun.t > 1.0 && !autoRun.moved) { autoRun.moved = true; target.set(cardPos.x + 0.09, 0, cardPos.z + 0.03); }
    if (autoRun.t > 1.45) { autoRun = null; up_(); }
  }

  /* ---------- per frame ---------- */
  function update(dt) {
    autoStep(dt);
    // carried stamp
    if (held) {
      stamp.position.x = smooth(stamp.position.x, target.x, 18, dt);
      stamp.position.z = smooth(stamp.position.z, target.z, 18, dt);
      const pk = inPad(stamp.position);
      if (pk && down) {
        pressT += dt;
        if (pressT > 0.12) {
          if (onPad !== pk) { onPad = pk; S.squish(); if (inkKind !== pk) ink = 0; inkKind = pk; ui.hint('inked-' + pk); }
          ink = Math.min(1, ink + dt * 2.6); setRubber();
          stampY = smooth(stampY, top + 0.0175, 22, dt);
        } else stampY = smooth(stampY, top + 0.075, 14, dt);
      } else { pressT = 0; onPad = null; stampY = smooth(stampY, top + 0.075, 14, dt); }
      stamp.rotation.z = smooth(stamp.rotation.z, THREE.MathUtils.clamp((target.x - stamp.position.x) * -6, -0.3, 0.3), 10, dt);
      stamp.rotation.x = smooth(stamp.rotation.x, THREE.MathUtils.clamp((target.z - stamp.position.z) * 6, -0.3, 0.3), 10, dt);
    } else if (anim && (anim.kind === 'press' || anim.kind === 'tap')) {
      anim.t += dt;
      const t = anim.t;
      stamp.position.x = smooth(stamp.position.x, anim.p.x, 20, dt); stamp.position.z = smooth(stamp.position.z, anim.p.z, 20, dt);
      stamp.rotation.x = smooth(stamp.rotation.x, 0, 20, dt); stamp.rotation.z = smooth(stamp.rotation.z, 0, 20, dt);
      if (t < 0.09) stampY = smooth(stampY, top + 0.0012, 40, dt);
      else if (!anim.done) {
        anim.done = true;
        if (anim.kind === 'press') { S.thump(0.6 + anim.amount * 0.4); impress(anim.p, anim.inkKind, anim.amount); ink = 0; inkKind = null; setRubber(); judge(anim.inkKind); }
        else S.thump(0.3);
      } else if (t > 0.22) { stampY = smooth(stampY, top, 10, dt); target.copy(rest); stamp.position.x = smooth(stamp.position.x, rest.x, 8, dt); stamp.position.z = smooth(stamp.position.z, rest.z, 8, dt); if (t > 0.9) anim = null; }
    } else {
      stamp.position.x = smooth(stamp.position.x, target.x, 8, dt); stamp.position.z = smooth(stamp.position.z, target.z, 8, dt);
      stampY = smooth(stampY, top, 10, dt);
      stamp.rotation.x = smooth(stamp.rotation.x, 0, 8, dt); stamp.rotation.z = smooth(stamp.rotation.z, 0, 8, dt);
    }
    stamp.position.y = stampY;

    // card slide-in, lift and flip
    if (slide) { slide.t += dt; const k = Math.min(1, slide.t / slide.dur), e = 1 - Math.pow(1 - k, 3); card.position.lerpVectors(slide.from, slide.to, e); if (k >= 1) slide = null; }
    cardFlip = smooth(cardFlip, cardFlipTo, 7, dt);
    if (!slide) card.position.y = top + 0.0012 + Math.sin(Math.min(1, cardFlip / Math.PI) * Math.PI) * 0.09;
    card.rotation.x = cardFlip;

    for (let i = flights.length - 1; i >= 0; i--) {
      const f = flights[i]; f.t += dt / 0.6;
      const k = Math.min(1, f.t), e = k * k * (3 - 2 * k);
      f.m.position.lerpVectors(f.from, f.to, e); f.m.position.y += Math.sin(k * Math.PI) * 0.22;
      f.m.rotation.y = f.r0.y + f.spin * k * 2; f.m.rotation.x = Math.PI + k * 0.4 * f.spin;
      const sc = 1 - 0.25 * k; f.m.scale.set(sc, 1, sc);
      if (k >= 1) flights.splice(i, 1);
    }
  }

  /* ---------- camera views, in the booth's frame ---------- */
  function viewPose(aspect, fov) {
    arrange(aspect < 0.8);
    const v = view === 'read'
      ? { look: new THREE.Vector3(card.position.x, top + 0.02, card.position.z + 0.05), hx: 0.215, hz: 0.19, pitch: 1.25 }
      : aspect < 0.8 ? { look: new THREE.Vector3(0, top, zc + 0.02), hx: 0.205, hz: 0.28, pitch: 1.05 }
      : { look: new THREE.Vector3(0, top, zc + 0.07), hx: 0.52, hz: 0.27, pitch: 0.82 };
    const tv = Math.tan(THREE.MathUtils.degToRad(fov) / 2), th = tv * aspect;
    const dist = Math.max(v.hx / th, v.hz * Math.sin(v.pitch) / tv + v.hz * Math.cos(v.pitch)) * 1.06;
    const pos = v.look.clone().add(new THREE.Vector3(0, Math.sin(v.pitch), Math.cos(v.pitch)).multiplyScalar(dist));
    return { pos: group.localToWorld(pos), look: group.localToWorld(v.look.clone()) };
  }
  // where to stand on the midway to look at the booth
  function approach() { return group.localToWorld(new THREE.Vector3(0, 1.65, D / 2 + 3.4)); }

  arrange(innerWidth / innerHeight < 0.8);

  return {
    stamp, start, next, update, viewPose, approach, auto, dbg: { pads, card, top },
    down: down_, move: move_, up: up_,
    get phase() { return phase; }, set phase(v) { phase = v; }, get held() { return held; },
    leave() { phase = 'off'; held = false; down = false; autoRun = null; anim = null; target.copy(rest); },
  };
}
