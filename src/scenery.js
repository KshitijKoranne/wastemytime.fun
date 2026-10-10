import * as THREE from 'three';
import { stall, arch, festoons, ferris, prop, field, STALL } from './world.js';

/* Stall cards. `open` stalls are lit for business; the others have their shutters down. */
export const STALLS = {
  truth:  { sign: '/assets/art/sign_truth.jpg',  stripes: ['#a3231c', '#efe2c8'], wall: 'black_painted_planks', open: true },
  weight: { sign: '/assets/art/sign_weight.jpg', stripes: ['#22405a', '#efe2c8'], wall: 'blue_painted_planks', open: true, counter: false, bulbX: -1.45 },
  graph:  { sign: '/assets/art/sign_graph.jpg',  stripes: ['#1f6f6b', '#efe2c8'], wall: 'green_rough_planks', open: false },
  year:   { sign: '/assets/art/sign_year.jpg',   stripes: ['#5b2c6f', '#efe2c8'], wall: 'black_painted_planks', open: false },
  data:   { sign: '/assets/art/sign_data.jpg',   stripes: ['#c4561e', '#efe2c8'], wall: 'green_rough_planks', open: false },
};
const make = (E, id, extra = {}) => stall({ ...STALLS[id], ...extra, bulbs: E.bulbs, glow: STALLS[id].open ? 0xffb070 : 0xff9a5a });

function lampPosts(E, spots) {
  prop('street_lamp_01', (m) => {
    // the model has its own bulb and glass: light them, and put the lamp's light where the bulb is
    m.traverse(o => {
      if (!o.isMesh) return;
      const n = o.material.name || '';
      if (n.endsWith('_bulb')) { o.material = o.material.clone(); o.material.emissive.set(0xffc58a); o.material.emissiveIntensity = 7; o.castShadow = false; }
      if (n.endsWith('_glass')) { o.material = o.material.clone(); o.material.emissive.set(0xffb070); o.material.emissiveIntensity = 0.35; o.material.transparent = true; o.material.opacity = 0.5; o.castShadow = false; }
    });
    const bb = new THREE.Box3().setFromObject(m), k = 4.6 / (bb.max.y - bb.min.y);
    const bulbAt = new THREE.Vector3(0, bb.max.y - 0.5, 0);
    m.traverse(o => { if (o.isMesh && (o.material.name || '').endsWith('_bulb')) new THREE.Box3().setFromObject(o).getCenter(bulbAt); });
    spots.forEach(([x, z, ry = 0], i) => {
      const c = m.clone(); c.scale.setScalar(k); c.position.set(x, 0, z); c.rotation.y = ry; E.scene.add(c);
      c.updateMatrixWorld(true);
      if (!E.coarse || i < 2) { const l = new THREE.PointLight(0xffc98f, 40, 16, 2); l.position.copy(bulbAt.clone().applyMatrix4(c.matrixWorld)); E.scene.add(l); }
    });
  });
}
function props(E, name, list, size) {
  prop(name, (m) => {
    const bb = new THREE.Box3().setFromObject(m), sz = bb.getSize(new THREE.Vector3()), k = size / Math.max(sz.x, sz.y, sz.z);
    for (const [x, z, r, y = 0] of list) { const c = m.clone(); c.scale.setScalar(k); c.position.set(x, y - bb.min.y * k, z); c.rotation.y = r; E.scene.add(c); }
  });
}

/* One corner of the fair: the activity's stall at the origin facing +z, shuttered neighbours either side,
   a string of lights across the front, a lamp post, and the Ferris wheel turning far behind. */
export function corner(E, id, left, right) {
  const g = make(E, id); E.scene.add(g);
  const gap = STALL.W + 0.5;
  for (const [nid, x] of [[left, -gap], [right, gap]]) { const n = make(E, nid); n.position.x = x; E.scene.add(n); }
  E.scene.add(festoons(E.bulbs, [[-7.6, 5.2], [-5.6, 6.0], [5.6, 6.0], [7.6, 5.2]]));
  lampPosts(E, [[9.4, 5.4, Math.PI / 2]]);   // off to the side, so it never crosses a sign
  props(E, 'Barrel_01', [[-2.45, 2.2, 0.4], [2.55, 2.0, 1.2]], 0.95);
  props(E, 'wooden_crate_01', [[-2.95, 2.4, 0.2], [-2.9, 2.35, 0.6, 0.62]], 0.62);
  const fw = ferris(E.bulbs, { glow: false }); fw.position.set(-16, 0, -46); fw.rotation.y = 0.35; E.scene.add(fw);
  E.ticks.push(dt => fw.userData.tick(dt));
  return g;
}

/* The whole midway, for the ride: gate, two rows of stalls, festoons, lamps, and the wheel at the far end. */
export function midway(E) {
  E.scene.add(field(), arch(E.bulbs));
  const rows = [['truth', -6.7, -9], ['weight', 6.7, -9], ['year', -6.7, -19.5], ['data', 6.7, -19.5], ['graph', 6.7, -30]];
  for (const [id, x, z] of rows) { const g = make(E, id); g.position.set(x, 0, z); g.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2; E.scene.add(g); }
  const poles = [];
  for (const z of [3.4, -4.2, -14.2, -25]) poles.push([-4.15, z], [4.15, z]);
  E.scene.add(festoons(E.bulbs, poles));
  lampPosts(E, [[-4.7, 8.5, -Math.PI / 2], [4.7, 8.5, Math.PI / 2], [-4.6, -36, -Math.PI / 2], [4.6, -36, Math.PI / 2]]);
  props(E, 'Barrel_01', [[-4.75, -12.1, 0.4], [4.9, -6.4, 1.2], [5.25, -22.2, 2.2]], 0.95);
  props(E, 'wooden_crate_01', [[-5.05, -6.15, 0.2], [5.15, -12.5, -0.3], [5.1, -12.5, 0.5, 0.62], [-4.95, -22.6, 0.9]], 0.62);
  props(E, 'metal_trash_can', [[4.45, 1.6, 0.3], [-4.5, -16.2, 1.1]], 0.95);
  const fw = ferris(E.bulbs); fw.position.set(0, 0, -60); E.scene.add(fw);
  E.ticks.push(dt => fw.userData.tick(dt));
  return fw;
}
