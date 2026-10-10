import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const manager = new THREE.LoadingManager();
const texLoader = new THREE.TextureLoader(manager);
const gltfLoader = new GLTFLoader(manager);
let maxAniso = 4;
export const setAniso = a => { maxAniso = Math.min(8, a); };

/* ---------- textures & materials ---------- */
const cache = {};
// one texture per (file, tiling): clones of an unloaded texture never upload in three r186
function tex(url, srgb, rep = 1) {
  const key = url + '|' + rep;
  if (!cache[key]) {
    const t = texLoader.load(url);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(rep, rep);
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = maxAniso;
    cache[key] = t;
  }
  return cache[key];
}
// Poly Haven set: diff (sRGB), nor (OpenGL normal), arm (AO / rough / metal packed).
// Geometry UVs are in metres (see uvWorld), so `scale` is metres per texture tile.
export function pbr(name, { scale = 1, color, rough = 1, metal = 0, normal = 1, ao = true } = {}) {
  const b = `/assets/tex/${name}/`, r = 1 / scale;
  const arm = tex(b + 'arm.jpg', false, r);
  const m = new THREE.MeshStandardMaterial({
    map: tex(b + 'diff.jpg', true, r),
    normalMap: tex(b + 'nor.jpg', false, r),
    normalScale: new THREE.Vector2(normal, normal),
    roughnessMap: arm, metalnessMap: arm, aoMap: ao ? arm : null,
    roughness: rough, metalness: metal,
  });
  if (color) m.color.set(color);
  return m;
}
export function image(url, srgb = true) { const t = tex(url, srgb, 1); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return t; }

/* Box with UVs in world metres per face, so textures keep one density on every face. */
export function uvWorld(geo) {
  const p = geo.attributes.position, n = geo.attributes.normal, uv = geo.attributes.uv;
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    if (ax >= ay && ax >= az) uv.setXY(i, z, y); else if (ay >= az) uv.setXY(i, x, z); else uv.setXY(i, x, y);
  }
  geo.setAttribute('uv1', uv.clone());
  return geo;
}
export function box(w, h, d, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(uvWorld(new THREE.BoxGeometry(w, h, d)), mat);
  m.position.set(x, y, z); m.castShadow = m.receiveShadow = true;
  return m;
}

/* ---------- bulbs: every light bulb in the fair is one instance ---------- */
export class Bulbs {
  constructor(max = 2000) {
    this.max = max; this.n = 0;
    // a glass bulb: white-hot in the middle, its colour strongest at the rim
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false });
    mat.onBeforeCompile = (s) => {
      s.vertexShader = 'varying float vF;\n' + s.vertexShader.replace('#include <project_vertex>', `#include <project_vertex>
        vF = abs(dot(normalize(normalMatrix * mat3(instanceMatrix) * normal), normalize(-mvPosition.xyz)));`);
      s.fragmentShader = 'varying float vF;\n' + s.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
        float f = vF; if (!(f >= 0. && f <= 1.)) f = 1.;   // tiny far bulbs can give NaN, which bloom smears into a blob
        float hot = max(diffuseColor.r, max(diffuseColor.g, diffuseColor.b));
        diffuseColor.rgb = diffuseColor.rgb * (.5 + .5 * f) + vec3(pow(f, 6.) * hot * .15);`);
    };
    this.mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 12, 10), mat, max);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3);
    this.mesh.frustumCulled = false;
    this.base = []; this.mode = []; this.k = []; this.parent = []; this.local = []; this.r = []; this.wz = []; this.wx = [];
    this.m = new THREE.Matrix4(); this.v = new THREE.Vector3(); this.c = new THREE.Color();
  }
  // mode: 0 steady, 1 chase, 2 ferris colour wave, 3 twinkle.  k = order index / phase
  add(pos, color, { r = 0.035, mode = 0, k = 0, parent = null, power = 5 } = {}) {
    if (this.n >= this.max) return;
    const i = this.n++;
    this.base[i] = new THREE.Color(color).multiplyScalar(power);
    this.mode[i] = mode; this.k[i] = k; this.parent[i] = parent; this.local[i] = pos.clone(); this.r[i] = r;
  }
  update(t) {
    const { m, v, c } = this;
    for (let i = 0; i < this.n; i++) {
      v.copy(this.local[i]);
      if (this.parent[i]) v.applyMatrix4(this.parent[i].matrixWorld);
      this.wz[i] = v.z; this.wx[i] = v.x;
      m.makeScale(this.r[i], this.r[i], this.r[i]).setPosition(v);
      this.mesh.setMatrixAt(i, m);
      let a = 1;
      const k = this.k[i];
      switch (this.mode[i]) {
        case 1: a = ((k + Math.floor(t * 7)) % 4 === 0) ? 0.12 : 1; break;
        case 2: { const h = (k * 0.07 + t * 0.08) % 1; c.setHSL(h, 0.9, 0.55).multiplyScalar(3.2 * (0.55 + 0.45 * Math.sin(k * 0.9 - t * 3))); this.mesh.setColorAt(i, c); continue; }
        case 3: a = 0.82 + 0.18 * Math.sin(t * 9 + k * 13.1) * Math.sin(t * 2.3 + k * 5.7); break;
      }
      c.copy(this.base[i]).multiplyScalar(a);
      this.mesh.setColorAt(i, c);
    }
    this.mesh.count = this.n;
    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.instanceColor.needsUpdate = true;
  }
}

/* ---------- ground: worn asphalt that has just been rained on ---------- */
const WET = `
      float h2(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
      float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
        return mix(mix(h2(i),h2(i+vec2(1,0)),f.x), mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),f.x), f.y); }
      float wet(vec2 p){ float n = n2(p*.35)*.55 + n2(p*1.1)*.3 + n2(p*3.7)*.15; return smoothstep(.57,.7,n); }
      float fade(vec2 p){ return 1. - smoothstep(34., 58., length((p - vec2(0., -14.)) * vec2(1.25, .8))); }`;
// Puddle reflections: a mirror render, shown only inside the same puddle mask the asphalt uses.
export const puddleShader = {
  name: 'Puddles',
  uniforms: { color: { value: null }, tDiffuse: { value: null }, textureMatrix: { value: null } },
  vertexShader: `uniform mat4 textureMatrix; varying vec4 vUv; varying vec3 vW;
    void main(){ vUv = textureMatrix * vec4(position, 1.0); vW = (modelMatrix * vec4(position, 1.0)).xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `uniform sampler2D tDiffuse; varying vec4 vUv; varying vec3 vW;` + WET + `
    void main(){
      float m = wet(vW.xz) * fade(vW.xz);
      if (m < .01) discard;
      vec4 uv = vUv; uv.x += (n2(vW.xz * 9.) - .5) * .012 * uv.w; uv.y += (n2(vW.zx * 7.) - .5) * .02 * uv.w;
      vec3 V = normalize(cameraPosition - vW);
      float fr = .04 + .96 * pow(1. - max(V.y, 0.), 5.);
      float far = exp(-distance(cameraPosition, vW) * .035);
      vec3 r = texture2DProj(tDiffuse, uv).rgb;
      r = min(r, vec3(2.5));
      gl_FragColor = vec4(r * mix(.3, .8, fr), m * far * .85);
    }`,
};
export function ground() {
  const g = new THREE.PlaneGeometry(160, 160);
  g.rotateX(-Math.PI / 2);
  const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 160, uv.getY(i) * 160);
  g.setAttribute('uv1', uv.clone());
  const mat = pbr('worn_asphalt', { scale: 3.2, normal: 0.9 });
  mat.onBeforeCompile = (s) => {
    s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vW;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvW = (modelMatrix * vec4(transformed,1.0)).xyz;');
    s.fragmentShader = s.fragmentShader.replace('#include <common>', `#include <common>
      varying vec3 vW;` + WET)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
      float pud = wet(vW.xz);
      roughnessFactor = mix(roughnessFactor * .85, .16, pud * fade(vW.xz));`)
      .replace('#include <map_fragment>', `#include <map_fragment>
      diffuseColor.rgb *= mix(.62, .3, wet(vW.xz) * fade(vW.xz));
      diffuseColor.a *= fade(vW.xz);`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
      normal = normalize(mix(normal, normalize((viewMatrix * vec4(0.,1.,0.,0.)).xyz), wet(vW.xz) * fade(vW.xz) * .9));`);
  };
  mat.envMapIntensity = 0.8;
  mat.transparent = true;
  const m = new THREE.Mesh(g, mat);
  m.receiveShadow = true;
  m.name = 'ground';
  return m;
}

/* ---------- canvas helpers ---------- */
export function stripeTexture(a, b, n) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 256;
  const x = c.getContext('2d');
  for (let i = 0; i < n; i++) { x.fillStyle = i % 2 ? b : a; x.fillRect(Math.floor(i * c.width / n), 0, Math.ceil(c.width / n) + 1, c.height); }
  // sun-fade and grime, heavier at the bottom edge where rain runs off
  const id = x.getImageData(0, 0, c.width, c.height), d = id.data;
  for (let y = 0; y < c.height; y++) for (let xx = 0; xx < c.width; xx++) {
    const i = (y * c.width + xx) * 4, g = 1 - (y / c.height) * 0.16 - Math.random() * 0.05;
    d[i] *= g; d[i + 1] *= g; d[i + 2] *= g;
  }
  x.putImageData(id, 0, 0);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = maxAniso;
  return t;
}

/* ---------- a market stall ---------- */
// Local frame: x across the front, y up, +z points out to the midway.
export const STALL = { W: 4.2, D: 2.6, H: 2.75, top: 1.06 };
let poolCanvas = null;
const poolTex = () => {
  if (!poolCanvas) {
    poolCanvas = document.createElement('canvas'); poolCanvas.width = poolCanvas.height = 128;
    const c = poolCanvas.getContext('2d'), gr = c.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, '#fff'); gr.addColorStop(0.35, 'rgba(255,255,255,.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = gr; c.fillRect(0, 0, 128, 128);
    poolCanvas = new THREE.CanvasTexture(poolCanvas);
  }
  return poolCanvas;
};
export function stall({ sign, stripes, wall, open, bulbs, glow = 0xffb070, counter = true, bulbX = 0 }) {
  const { W, D, H, top } = STALL;
  const g = new THREE.Group();
  const paint = pbr('distressed_painted_planks', { scale: 1.6 });
  const floorWood = pbr('old_wood_floor', { scale: 1.4 });
  const wallMat = pbr(wall, { scale: 1.8 });
  const counterTop = pbr('old_wood_floor', { scale: 0.9, rough: 0.85 });

  g.add(box(W, 0.16, D, floorWood, 0, 0.08, 0));                         // platform
  g.add(box(W, H, 0.08, wallMat, 0, H / 2, -D / 2 + 0.04));                // back wall
  for (const s of [-1, 1]) g.add(box(0.08, H, D, wallMat, s * (W / 2 - 0.04), H / 2, 0)); // sides
  for (const s of [-1, 1]) g.add(box(0.13, H, 0.13, paint, s * (W / 2 - 0.02), H / 2, D / 2 - 0.02)); // posts
  if (counter) {
    g.add(box(W, top - 0.06, 0.06, paint, 0, (top - 0.06) / 2 + 0.03, D / 2 - 0.04));              // counter front
    g.add(box(W + 0.12, 0.06, 0.62, counterTop, 0, top - 0.03, D / 2 - 0.25));                       // counter top
  }
  g.add(box(W + 0.24, 0.08, D + 0.14, pbr('black_painted_planks', { scale: 1.6 }), 0, H + 0.04, 0)); // roof

  // striped canvas awning, sloping out over the counter, with a scalloped valance
  const n = 12, len = 1.15, drop = 0.42;
  const stripes1 = stripeTexture(stripes[0], stripes[1], n);
  const linen = pbr('rough_linen', { scale: 0.35, normal: 0.8 });
  const cloth = new THREE.MeshStandardMaterial({ map: stripes1, normalMap: linen.normalMap, normalScale: new THREE.Vector2(0.6, 0.6), roughness: 0.92, side: THREE.DoubleSide });
  const aw = new THREE.Mesh(new THREE.PlaneGeometry(W + 0.24, Math.hypot(len, drop), 24, 6), cloth);
  const sl = Math.atan2(drop, len);
  aw.position.set(0, H + 0.02 - drop / 2, D / 2 + len / 2);
  aw.rotation.x = -Math.PI / 2 + sl;
  // a little sag between the frame bars
  const ap = aw.geometry.attributes.position;
  for (let i = 0; i < ap.count; i++) { const x = ap.getX(i); ap.setZ(i, ap.getZ(i) - 0.035 * Math.sin(((x / (W + 0.24)) + 0.5) * Math.PI * 3) ** 2); }
  aw.geometry.computeVertexNormals();
  aw.castShadow = true; aw.receiveShadow = true;
  g.add(aw);
  const sh = new THREE.Shape(), ww = W + 0.24, sc = 0.13, vh = 0.26;
  sh.moveTo(-ww / 2, 0); sh.lineTo(ww / 2, 0); sh.lineTo(ww / 2, -vh);
  for (let i = n - 1; i >= 0; i--) { const x0 = -ww / 2 + (i + 1) * ww / n, x1 = -ww / 2 + i * ww / n; sh.quadraticCurveTo((x0 + x1) / 2, -vh - sc * 2, x1, -vh); }
  sh.lineTo(-ww / 2, 0);
  const vg = new THREE.ShapeGeometry(sh, 6), vu = vg.attributes.uv, vp = vg.attributes.position;
  for (let i = 0; i < vu.count; i++) vu.setXY(i, (vp.getX(i) + ww / 2) / ww, 1 + vp.getY(i) / 0.6);
  const val = new THREE.Mesh(vg, cloth);
  val.position.set(0, H + 0.02 - drop, D / 2 + len);
  val.castShadow = true;
  g.add(val);
  for (let i = 0; i < n; i++) bulbs.add(new THREE.Vector3(-ww / 2 + (i + 0.5) * ww / n, H - drop - vh - sc * 1.55, D / 2 + len + 0.01), 0xffc27a, { mode: 3, k: i, parent: g, power: 2, r: 0.03 });

  // hand-painted sign on the roof, ringed with marquee bulbs
  const sw = W * 0.96, shh = sw / 4.03, sy = H + 0.12 + shh / 2;
  const edge = pbr('black_painted_planks', { scale: 1 });
  const face = new THREE.MeshStandardMaterial({ map: image(sign), roughness: 0.62, normalMap: edge.normalMap, normalScale: new THREE.Vector2(0.25, 0.25) });
  const sb = box(sw, shh, 0.07, [edge, edge, edge, edge, face, edge], 0, sy, D / 2 - 0.12);
  sb.material[4].map.wrapS = sb.material[4].map.wrapT = THREE.ClampToEdgeWrapping;
  const su = sb.geometry.attributes.uv; // face +z: map the image 0..1
  for (let i = 16; i < 20; i++) su.setXY(i, su.getX(i) / sw + 0.5, su.getY(i) / shh + 0.5);
  g.add(sb);
  g.add(box(sw + 0.12, shh + 0.12, 0.05, edge, 0, sy, D / 2 - 0.18));
  const per = 2 * (sw + shh), cnt = Math.round(per / 0.165);
  for (let i = 0; i < cnt; i++) {
    let d = (i / cnt) * per, x, y;
    if (d < sw) { x = -sw / 2 + d; y = shh / 2; } else if ((d -= sw) < shh) { x = sw / 2; y = shh / 2 - d; }
    else if ((d -= shh) < sw) { x = sw / 2 - d; y = -shh / 2; } else { d -= sw; x = -sw / 2; y = -shh / 2 + d; }
    bulbs.add(new THREE.Vector3(x * 1.035, sy + y * 1.11, D / 2 - 0.07), 0xffd08a, { mode: open ? 1 : 3, k: i, parent: g, power: open ? 3 : 1.6 });
  }

  // a bare bulb on a cord lights the booth from inside
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.5), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 }));
  cord.position.set(bulbX, H - 0.25, 0.25); g.add(cord);
  bulbs.add(new THREE.Vector3(bulbX, H - 0.52, 0.25), glow, { mode: 3, k: 7, parent: g, power: open ? 5 : 1.4, r: 0.045 });
  if (open) {
    const pl = new THREE.PointLight(glow, 14, 8, 2);
    pl.position.set(bulbX, H - 0.56, 0.25); g.add(pl);
    const spill = new THREE.PointLight(0xffc690, 22, 8, 2);
    spill.position.set(0, 1.7, D / 2 + len + 0.9); g.add(spill);
  } else {
    // shutters down: no real lights, just the warm pool the sign throws on the wet ground (much cheaper to draw)
    const pool = new THREE.Mesh(new THREE.CircleGeometry(2.6, 32), new THREE.MeshBasicMaterial({ map: poolTex(), color: 0xffb27a, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false }));
    pool.rotation.x = -Math.PI / 2; pool.position.set(0, 0.012, D / 2 + len + 0.6); pool.raycast = () => {}; g.add(pool);
  }

  if (!open) {
    // roll-down shutter, pulled to the counter
    const iron = pbr('corrugated_iron', { scale: 1.2, metal: 1, rough: 1 });
    iron.color.set(0x9aa0a6);
    const sh2 = box(W - 0.2, H - top - 0.05, 0.03, iron, 0, top + (H - top) / 2, D / 2 - 0.1);
    sh2.rotation.y = 0; g.add(sh2);
  }
  g.traverse(o => { if (o.isMesh) o.userData.stallGroup = g; });
  return g;
}

/* ---------- the entrance arch ---------- */
export function arch(bulbs) {
  const g = new THREE.Group();
  const post = pbr('black_painted_planks', { scale: 1.4 });
  const W = 7.6, H = 6.3;
  for (const s of [-1, 1]) {
    g.add(box(0.46, H, 0.46, post, s * W / 2, H / 2, 0));
    g.add(box(0.7, 0.5, 0.7, pbr('rusty_metal_02', { scale: 1, metal: 1 }), s * W / 2, 0.25, 0));
    for (let i = 0; i < 26; i++) for (const f of [-1, 1]) bulbs.add(new THREE.Vector3(s * W / 2 + f * 0.11, 0.7 + i * 0.215, 0.245), 0xffcf85, { mode: 1, k: i + (s > 0 ? 2 : 0), parent: g, power: 2.4 });
  }
  const sw = 7.2, sh = sw / 4.03, sy = H + sh / 2 - 0.25;
  const edge = pbr('black_painted_planks', { scale: 1 });
  const face = new THREE.MeshStandardMaterial({ map: image('/assets/art/sign_entrance.jpg'), roughness: 0.6 });
  const sb = box(sw, sh, 0.12, [edge, edge, edge, edge, face, edge], 0, sy, 0);
  const su = sb.geometry.attributes.uv;
  for (let i = 16; i < 20; i++) su.setXY(i, su.getX(i) / sw + 0.5, su.getY(i) / sh + 0.5);
  g.add(sb);
  g.add(box(sw + 0.2, sh + 0.2, 0.08, edge, 0, sy, -0.08));
  const per = 2 * (sw + sh), cnt = Math.round(per / 0.19);
  for (let i = 0; i < cnt; i++) {
    let d = (i / cnt) * per, x, y;
    if (d < sw) { x = -sw / 2 + d; y = sh / 2; } else if ((d -= sw) < sh) { x = sw / 2; y = sh / 2 - d; }
    else if ((d -= sh) < sw) { x = sw / 2 - d; y = -sh / 2; } else { d -= sw; x = -sw / 2; y = -sh / 2 + d; }
    bulbs.add(new THREE.Vector3(x * 1.03, sy + y * 1.09, 0.1), 0xffd08a, { mode: 1, k: i, parent: g, power: 3 });
  }
  // a crown of bulbs on a steel arc above the sign
  const R = 3.9, cy = sy + sh / 2 - 0.4;
  const arc = new THREE.Mesh(new THREE.TorusGeometry(R, 0.045, 8, 64, Math.PI), new THREE.MeshStandardMaterial({ color: 0x2b2b2e, metalness: 0.8, roughness: 0.4 }));
  arc.position.set(0, cy, 0); g.add(arc);
  for (let i = 0; i <= 44; i++) { const a = Math.PI * i / 44; bulbs.add(new THREE.Vector3(Math.cos(a) * R, cy + Math.sin(a) * R, 0.06), i % 2 ? 0xff5a4a : 0xffd08a, { mode: 1, k: i, parent: g, power: 3, r: 0.045 }); }
  // two flood lamps on the beam light the sign from below
  for (const s of [-1, 1]) {
    const f = new THREE.SpotLight(0xffd7a8, 40, 10, 0.5, 0.8, 2);
    f.position.set(s * 2.4, sy - sh / 2 - 0.1, 1.4); f.target.position.set(s * 1.4, sy, 0); g.add(f, f.target);
    const can = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, 0.22, 14), new THREE.MeshStandardMaterial({ color: 0x1d1c1a, metalness: 0.7, roughness: 0.45 }));
    can.position.copy(f.position); can.lookAt(f.target.position); can.rotateX(Math.PI / 2); g.add(can);
  }
  const lamp = new THREE.PointLight(0xffc27a, 60, 14, 2); lamp.position.set(0, 2.6, 1.6); g.add(lamp);
  return g;
}

/* ---------- festoon lights strung across the midway ---------- */
export function festoons(bulbs, poles) {
  const g = new THREE.Group();
  const wood = pbr('old_wood_floor', { scale: 1 });
  const wireMat = new THREE.MeshStandardMaterial({ color: 0x15130f, roughness: 0.7 });
  const top = 4.7;
  for (const [x, z] of poles) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.1, top + 0.2, 10), wood);
    p.position.set(x, (top + 0.2) / 2, z); p.castShadow = true; g.add(p);
  }
  let k = 0;
  for (let i = 0; i < poles.length - 1; i++) {
    const a = new THREE.Vector3(poles[i][0], top, poles[i][1]), b = new THREE.Vector3(poles[i + 1][0], top, poles[i + 1][1]);
    const L = a.distanceTo(b), sag = 0.35 + L * 0.05, pts = [];
    for (let j = 0; j <= 30; j++) { const t = j / 30, p = a.clone().lerp(b, t); p.y -= sag * 4 * t * (1 - t); pts.push(p); }
    const curve = new THREE.CatmullRomCurve3(pts);
    const w = new THREE.Mesh(new THREE.TubeGeometry(curve, 60, 0.007, 4), wireMat); g.add(w);
    const cnt = Math.floor(L / 0.62);
    for (let j = 1; j < cnt; j++) { const p = curve.getPoint(j / cnt); p.y -= 0.06; bulbs.add(p, 0xffc98a, { mode: 3, k: k++, power: 2.6, r: 0.032 }); }
  }
  return g;
}

/* A wide field of rough grass under everything, for views from high up, where the sky photo's ground would smear. */
export function field() {
  const m = new THREE.Mesh(new THREE.CircleGeometry(400, 48), new THREE.MeshStandardMaterial({ map: tex('/assets/tex/aerial_grass_rock/diff.jpg', true, 64), emissiveMap: tex('/assets/tex/aerial_grass_rock/diff.jpg', true, 64), emissive: 0x2a3038, roughness: 1 }));
  m.rotation.x = -Math.PI / 2; m.position.y = -0.03; m.receiveShadow = true; m.raycast = () => {};
  return m;
}

/* ---------- the Ferris wheel ---------- */
// Wheel turns in the x-y plane. Gondolas hang from the rim and stay level; each is an open car you can sit in.
// Cars hang on axles in front of the wheel (z = car), so riders face out with nothing in the way.
export const WHEEL = { R: 13, hub: 16.4, cars: 16, deck: 1.0, seatEye: -1.15, car: 1.95 };
export function ferris(bulbs, { glow = true } = {}) {
  const g = new THREE.Group(), wheel = new THREE.Group();
  const { R, hub, cars: sp, deck, car: ZC } = WHEEL;
  const steel = new THREE.MeshStandardMaterial({ color: 0xe6e0d4, metalness: 0.35, roughness: 0.48 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x3b3a3c, metalness: 0.6, roughness: 0.5 });
  wheel.position.y = hub; g.add(wheel);
  for (const z of [-0.95, 0.95]) {
    for (const r of [R, R * 0.6]) { const t = new THREE.Mesh(new THREE.TorusGeometry(r, r === R ? 0.13 : 0.08, 8, 120), steel); t.position.z = z; wheel.add(t); }
    for (let i = 0; i < sp; i++) {
      const a = (i / sp) * Math.PI * 2, s = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, R), steel);
      s.position.set(Math.cos(a) * R / 2, Math.sin(a) * R / 2, z); s.rotation.z = a - Math.PI / 2; wheel.add(s);
      for (let j = 1; j <= 8; j++) bulbs.add(new THREE.Vector3(Math.cos(a) * R * j / 8.6, Math.sin(a) * R * j / 8.6, z + (z > 0 ? 0.12 : -0.12)), 0xffffff, { mode: 2, k: i * 2 + j, parent: wheel, r: 0.07 });
    }
    for (let i = 0; i < 120; i++) { const a = (i / 120) * Math.PI * 2; bulbs.add(new THREE.Vector3(Math.cos(a) * (R + 0.18), Math.sin(a) * (R + 0.18), z), 0xffffff, { mode: 2, k: i, parent: wheel, r: 0.08 }); }
  }
  // a cross bar between the rims, running on out to the car's axle
  for (let i = 0; i < sp; i++) { const a = (i / sp) * Math.PI * 2, c = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, ZC + 1.05), steel); c.rotation.x = Math.PI / 2; c.position.set(Math.cos(a) * R, Math.sin(a) * R, (ZC - 0.95) / 2); wheel.add(c); }
  const hubM = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2.4, 20), dark); hubM.rotation.x = Math.PI / 2; wheel.add(hubM);
  const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 1.6, 16), dark); axle.rotation.x = Math.PI / 2; axle.position.set(0, hub, -2); g.add(axle);

  // open cars: floor, low walls with a rolled rail, a bench, four posts and a canopy
  const cols = [0xa82a22, 0xd9a43a, 0x2c6a8e, 0x3f7d4f];
  const seatWood = pbr('fine_grained_wood', { scale: 0.4, rough: 0.6 });
  const gondolas = [];
  const W2 = 0.8, D2 = 0.72, FL = -2.35, WH = 0.55;
  for (let i = 0; i < sp; i++) {
    const a = (i / sp) * Math.PI * 2, gd = new THREE.Group();
    const body = new THREE.MeshStandardMaterial({ color: cols[i % 4], metalness: 0.3, roughness: 0.5 });
    const part = (w, h, d, m, x, y, z) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.castShadow = true; gd.add(o); return o; };
    part(W2 * 2, 0.06, D2 * 2, body, 0, FL, 0);
    part(W2 * 2, WH, 0.04, body, 0, FL + WH / 2, -D2);
    part(W2 * 2, WH * 0.62, 0.04, body, 0, FL + WH * 0.31, D2);               // front wall is lower, to see out
    for (const sx of [-1, 1]) part(0.04, WH, D2 * 2, body, sx * W2, FL + WH / 2, 0);
    for (const [x, z, w, d] of [[0, -D2, W2 * 2, 0], [0, D2, W2 * 2, 0], [-W2, 0, 0, D2 * 2], [W2, 0, 0, D2 * 2]]) {
      const rl = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, w || d, 8), steel);
      rl.position.set(x, FL + (z > 0 ? WH * 0.62 : WH), z); rl.rotation.set(w ? 0 : Math.PI / 2, 0, w ? Math.PI / 2 : 0); gd.add(rl);
    }
    part(W2 * 1.8, 0.07, 0.42, seatWood, 0, FL + 0.45, -D2 + 0.26);           // bench
    part(W2 * 1.8, 0.4, 0.06, seatWood, 0, FL + 0.7, -D2 + 0.06);             // backrest
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.6), steel); p.position.set(sx * (W2 - 0.04), FL + 0.8 + WH / 2, sz * (D2 - 0.04)); gd.add(p); }
    const rr = 1.2, roof = new THREE.Mesh(new THREE.CylinderGeometry(rr, rr, D2 * 2 + 0.12, 20, 1, true, -0.75, 1.5), body.clone());
    roof.material.side = THREE.DoubleSide; roof.castShadow = true;
    roof.rotation.x = -Math.PI / 2; roof.position.y = FL + 1.875 - rr * Math.cos(0.75); gd.add(roof);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.62), dark); rod.position.y = -0.31; gd.add(rod);
    gd.position.set(Math.cos(a) * R, Math.sin(a) * R, ZC);
    gd.userData.base = a;
    wheel.add(gd); gondolas.push(gd);
  }
  // A-frame legs, all behind the wheel so the cars swing clear
  for (const [z, zt] of [[-1.9, -1.55], [-4.6, -2.6]]) for (const x of [-7.5, 7.5]) {
    const a = new THREE.Vector3(x, 0, z), b = new THREE.Vector3(0, hub, zt), L = a.distanceTo(b);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, L, 10), steel);
    leg.position.copy(a).lerp(b, 0.5); leg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    leg.castShadow = true; g.add(leg);
  }
  // boarding deck with steps up from the midway side
  const deckMat = pbr('old_wood_floor', { scale: 2 });
  g.add(box(18, deck, 5, deckMat, 0, deck / 2, ZC));
  for (let k = 0; k < 4; k++) g.add(box(3.2, deck * (k + 1) / 4, 0.32, deckMat, 0, deck * (k + 1) / 8, ZC + 2.5 + 1.28 - k * 0.32));
  if (glow) { const l = new THREE.PointLight(0xff9a6a, 120, 32, 2); l.position.set(0, 4, 6); g.add(l); }
  g.traverse(o => { if (o.isMesh) o.userData.ride = true; });

  /* Turning. Normally a slow steady turn. ride() stops it with the nearest car at the bottom, waits while you sit
     down, takes you once round with a pause at the top, and stops at the bottom again. */
  let angle = 0, speed = 0.045, plan = null;
  const carAngle = (gd) => gd.userData.base + angle;
  const wrap = (x) => ((x % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  function dock() { // nearest car that will reach the bottom next, and how far the wheel must turn
    let best = null;
    for (const gd of gondolas) { const d = wrap(-Math.PI / 2 - carAngle(gd)); if (!best || d < best.d) best = { gd, d }; }
    if (best.d < 0.35) best.d += 0; // close enough to brake into
    return best;
  }
  function brakeTo(target, dt, vmax) {
    const left = target - angle;
    const v = Math.min(vmax, Math.max(0.004, Math.sqrt(2 * 0.03 * Math.max(left, 0))));
    angle = Math.min(target, angle + v * dt);
    return angle >= target - 1e-5;
  }
  g.userData.ride = {
    begin(onStage, hold = false) { const d = dock(); plan = { stage: 'dock', gd: d.gd, target: angle + d.d, onStage, t: 0, hold }; return d.gd; },
    go() { if (!plan) return; plan.hold = false; if (plan.stage === 'board') plan.t = 0; },
    again() { if (plan && plan.stage === 'off') { plan.stage = 'board'; plan.start = angle; plan.hold = false; plan.t = 0; plan.onStage && plan.onStage('board'); } },
    get car() { return plan && plan.gd; },
    get stage() { return plan && plan.stage; },
    end() { plan = null; },
  };
  g.userData.tick = (dt) => {
    if (!plan) { speed += (0.045 - speed) * Math.min(1, dt); angle += speed * dt; }
    else {
      plan.t += dt;
      const go = (st) => { plan.stage = st; plan.t = 0; plan.onStage && plan.onStage(st); };
      if (plan.stage === 'dock' && brakeTo(plan.target, dt, 0.06)) { go('board'); plan.start = angle; }
      else if (plan.stage === 'board' && !plan.hold && plan.t > 2.2) go('up');
      else if (plan.stage === 'up' && brakeTo(plan.start + Math.PI, dt, 0.13)) go('top');
      else if (plan.stage === 'top' && plan.t > 7) go('down');
      else if (plan.stage === 'down' && brakeTo(plan.start + Math.PI * 2, dt, 0.13)) go('off');
    }
    wheel.rotation.z = angle;
    for (const gd of gondolas) gd.rotation.z = -angle;
  };
  return g;
}

/* ---------- Poly Haven props ---------- */
export function prop(name, cb) {
  gltfLoader.load(`/assets/models/${name}/${name}.gltf`, (gl) => {
    gl.scene.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; } });
    cb(gl.scene);
  });
}
