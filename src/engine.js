import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { GroundedSkybox } from 'three/examples/jsm/objects/GroundedSkybox.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { manager, setAniso, Bulbs, ground, puddleShader } from './world.js';

/* The shared night: renderer, sky, ground, moon, bloom, eye adaptation and the frame loop.
   Each activity page builds its own stall on top and sets E.update(dt) to drive the camera. */

export const smooth = (c, t, k, dt) => c + (t - c) * (1 - Math.exp(-k * dt));

export async function engine({ shadowBox = { x: 16, z: 16, cz: 0 }, puddleArea = [16, 30, 0, 4] } = {}) {
  await Promise.all(['40px "Alfa Slab One"', '40px "Special Elite"', '40px Caveat'].map(f => document.fonts.load(f))).catch(() => {});
  const coarse = matchMedia('(pointer: coarse)').matches;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DBG = { f: 0, fixed: location.search.includes('fixed'), snap: false, ts: 1 };

  const canvas = document.querySelector('#fair');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, coarse ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;   // redrawn every 4th frame below: the moon's shadows barely move
  setAniso(renderer.capabilities.getMaxAnisotropy());

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0e0f0c, 0.0085);
  const camera = new THREE.PerspectiveCamera(60, 1, 0.03, 900);

  // A real night field (Poly Haven, CC0) projected on a ground dome: land, a tree line and far village lights.
  // The same tone-mapped photo gives the reflections, so its clamped moon cannot blow out the wet ground.
  const SKY_YAW = 2.58, MOON_UV = [0.5989, 0.4053];
  const sky = new GroundedSkybox(new THREE.Texture(), 2.2, 420, coarse ? 64 : 96);
  sky.material.fog = false; sky.rotation.y = SKY_YAW; sky.raycast = () => {}; scene.add(sky);
  new THREE.TextureLoader(manager).load('/assets/sky/sky.jpg', (t) => {
    t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.SRGBColorSpace;
    sky.material.map = t; sky.material.needsUpdate = true;
    const pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromEquirectangular(t).texture;
    scene.environmentIntensity = 0.5;
    pm.dispose();
  });
  scene.environmentRotation.y = SKY_YAW;

  const moonDir = (() => { const ph = MOON_UV[0] * Math.PI * 2, th = MOON_UV[1] * Math.PI; return new THREE.Vector3(-Math.cos(ph) * Math.sin(th), Math.cos(th), -Math.sin(ph) * Math.sin(th)).applyAxisAngle(new THREE.Vector3(0, 1, 0), SKY_YAW); })();
  const moon = new THREE.DirectionalLight(0xa9bce6, 0.2);
  moon.target.position.set(0, 0, shadowBox.cz);
  moon.position.copy(moonDir).multiplyScalar(40).add(moon.target.position);
  moon.castShadow = true; moon.shadow.mapSize.set(coarse ? 1024 : 2048, coarse ? 1024 : 2048);
  Object.assign(moon.shadow.camera, { left: -shadowBox.x, right: shadowBox.x, top: shadowBox.z, bottom: -shadowBox.z, near: 1, far: 100 });
  moon.shadow.bias = -0.0004; moon.shadow.normalBias = 0.02;
  scene.add(moon, moon.target);
  scene.add(new THREE.HemisphereLight(0x29324d, 0x0d0b0a, 0.25));

  const bulbs = new Bulbs(2400);
  scene.add(bulbs.mesh);
  scene.add(ground());
  // puddle mirror: renders the scene twice, so phones skip it
  const [pw, pd, px, pz] = puddleArea;
  const puddles = coarse ? null : new Reflector(new THREE.PlaneGeometry(pw, pd), { shader: puddleShader, clipBias: 0.003, multisample: 0, textureWidth: 512, textureHeight: 512 });
  if (puddles) { puddles.raycast = () => {}; puddles.rotation.x = -Math.PI / 2; puddles.position.set(px, 0.004, pz); puddles.material.transparent = true; puddles.material.depthWrite = false; scene.add(puddles); }

  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: coarse ? 0 : 4 }));
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.5, 0.35, 1.0);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  let pr = renderer.getPixelRatio();
  function resize() {
    const w = innerWidth, h = innerHeight;
    camera.aspect = w / h; camera.fov = w / h < 0.8 ? 68 : 58; camera.updateProjectionMatrix();
    renderer.setSize(w, h, false); composer.setSize(w, h); composer.setPixelRatio(renderer.getPixelRatio());
    if (puddles) puddles.getRenderTarget().setSize(Math.round(w * renderer.getPixelRatio() * 0.5), Math.round(h * renderer.getPixelRatio() * 0.5));
    bloom.setSize(w / 2, h / 2);
  }
  addEventListener('resize', resize); resize();

  const E = {
    THREE, coarse, reduce, DBG, renderer, scene, camera, bulbs, manager, puddles,
    clock: 0, exposure: 0.95, close: false, update: null, ticks: [],
    lightsOnAt: -1, lightsOrigin: new THREE.Vector3(),
    lightsOn(origin) { if (origin) this.lightsOrigin.copy(origin); this.lightsOnAt = this.clock; },
  };

  // 30 frames a second unless you are touching something: the scene mostly glows and turns slowly,
  // so this halves the work (and the heat) with nothing lost. Pages set E.busy for fast motion.
  let wakeAt = 0, lastDraw = 0, slow = 0, n = 0;
  E.wake = () => { wakeAt = performance.now(); };
  for (const ev of ['pointerdown', 'pointermove', 'keydown', 'wheel']) addEventListener(ev, E.wake, { passive: true });

  // every lamp starts dark; lightsOn() brings them up in a wave from lightsOrigin
  let lamps = null, lampsFull = false;
  manager.onLoad = () => { lamps = null; E.onLoad && E.onLoad(); };
  manager.onProgress = (u, a, b) => E.onProgress && E.onProgress(a / b);
  function frame(now) {
    requestAnimationFrame(frame);
    if (!DBG.fixed && !E.busy && now - wakeAt > 2000 && now - lastDraw < 1000 / 30 - 4) return;
    const real = now - lastDraw; lastDraw = now;
    // automatic quality: if frames keep coming slower than 20 a second, draw fewer pixels
    if (!DBG.fixed && real > 50 && real < 400) { if (++slow > 40 && pr > 0.8) { pr = Math.max(0.8, pr * 0.8); renderer.setPixelRatio(pr); resize(); slow = 0; } }
    else slow = Math.max(0, slow - 1);
    const dt = (DBG.fixed ? 1 / 30 : Math.min(0.05, real / 1000)) * DBG.ts; E.clock += dt; DBG.f++;
    E.update && E.update(dt);
    for (const t of E.ticks) t(dt);
    if (puddles) puddles.visible = !E.close;
    // eye adaptation: a bare bulb a metre away is far brighter than the midway
    renderer.toneMappingExposure = DBG.snap ? E.exposure : smooth(renderer.toneMappingExposure, E.exposure, 2.2, dt);
    bloom.threshold = (E.close ? 0.95 : 1.1) / renderer.toneMappingExposure;
    bloom.strength = E.close ? 0.3 : coarse ? 0.38 : 0.48;
    scene.updateMatrixWorld();
    bulbs.update(E.clock);
    if (!lamps) { lamps = []; scene.traverse(o => { if (o.isLight && !o.isDirectionalLight && !o.isHemisphereLight) { o.userData.base ??= o.intensity; lamps.push({ light: o, base: o.userData.base, p: o.getWorldPosition(new THREE.Vector3()) }); } }); lampsFull = false; }
    const T = E.clock - E.lightsOnAt, O = E.lightsOrigin;
    if (E.lightsOnAt < 0) { bulbs.mesh.instanceColor.array.fill(0.02); for (const l of lamps) l.light.intensity = l.base * 0.02; }
    else if (T < 5) {
      const on = d => THREE.MathUtils.clamp((T - 0.15 - d * 0.045) * 3, 0.02, 1);
      const a = bulbs.mesh.instanceColor.array;
      for (let i = 0; i < bulbs.n; i++) { const f = on(Math.hypot(bulbs.wx[i] - O.x, bulbs.wz[i] - O.z)); a[i * 3] *= f; a[i * 3 + 1] *= f; a[i * 3 + 2] *= f; }
      for (const l of lamps) l.light.intensity = l.base * on(Math.hypot(l.p.x - O.x, l.p.z - O.z));
    } else if (!lampsFull) { lampsFull = true; for (const l of lamps) l.light.intensity = l.base; }
    renderer.shadowMap.needsUpdate = n++ % 4 === 0;
    composer.render();
  }
  requestAnimationFrame(frame);
  return E;
}
