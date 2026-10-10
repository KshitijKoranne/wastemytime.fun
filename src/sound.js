// All sound is synthesised in the browser. Nothing plays until the visitor taps "Enter".
let ac = null, master = null, sfx = null, music = null, NB = null, verb = null;
export let muted = false;

export function start() {
  if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
  try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
  master = ac.createGain(); master.gain.value = muted ? 0 : 1; master.connect(ac.destination);
  sfx = ac.createGain(); sfx.gain.value = 0.5; sfx.connect(master);
  NB = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
  const d = NB.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  // small hall reverb from a decaying noise impulse
  verb = ac.createConvolver();
  const L = ac.sampleRate * 2.6, ir = ac.createBuffer(2, L, ac.sampleRate);
  for (let c = 0; c < 2; c++) { const x = ir.getChannelData(c); for (let i = 0; i < L; i++) x[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / L, 3.2); }
  verb.buffer = ir;
  const vg = ac.createGain(); vg.gain.value = 0.35; verb.connect(vg).connect(master);
  ambience(); carousel();
}
export function setMuted(m) { muted = m; if (master) master.gain.setTargetAtTime(m ? 0 : 1, ac.currentTime, 0.05); }

function noise(t, dur, type, f, g, q, dest = sfx) {
  const n = ac.createBufferSource(), fl = ac.createBiquadFilter(), ga = ac.createGain();
  n.buffer = NB; fl.type = type; fl.frequency.value = f; if (q) fl.Q.value = q;
  ga.gain.setValueAtTime(0.0001, t); ga.gain.exponentialRampToValueAtTime(g, t + 0.008); ga.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  n.connect(fl).connect(ga).connect(dest); n.start(t, Math.random()); n.stop(t + dur + 0.05);
}
function tone(t, f, dur, g, type = 'sine', dest = sfx) {
  const o = ac.createOscillator(), ga = ac.createGain(); o.type = type; o.frequency.value = f;
  ga.gain.setValueAtTime(0.0001, t); ga.gain.exponentialRampToValueAtTime(g, t + 0.006); ga.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(ga).connect(dest); o.start(t); o.stop(t + dur + 0.05); return o;
}

/* distant crowd hum and a little wind */
function ambience() {
  const n = ac.createBufferSource(); n.buffer = NB; n.loop = true;
  const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 420; f.Q.value = 0.4;
  const g = ac.createGain(); g.gain.value = 0.035;
  const lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = 0.07; lg.gain.value = 0.015; lfo.connect(lg).connect(g.gain); lfo.start();
  n.connect(f).connect(g).connect(master); n.start();
}

/* an original waltz on a music box, coming from the Ferris wheel */
export let carouselGain = null;
function carousel() {
  music = ac.createGain(); music.gain.value = 0.0; music.connect(master); music.connect(verb);
  carouselGain = music;
  const scale = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19];
  const tune = [ // scale steps; each bar is three beats
    [7, 9, 11], [9, 7, 4], [5, 7, 9], [7, 4, 2], [4, 5, 7], [9, 11, 9], [7, 5, 4], [2, 4, 0],
    [7, 9, 11], [11, 9, 7], [5, 9, 11], [9, 7, 5], [4, 7, 9], [7, 4, 2], [4, 2, 1], [0, 4, 7],
  ];
  const bass = [0, 3, 4, 0, 5, 3, 4, 0, 0, 3, 4, 3, 5, 4, 4, 0];
  const beat = 0.42, root = 523.25 / 2;
  const f = s => root * Math.pow(2, scale[s % scale.length] / 12 + Math.floor(s / scale.length));
  let bar = 0, next = ac.currentTime + 0.5;
  const pluck = (t, fr, g) => { tone(t, fr, 1.6, g, 'sine', music); tone(t, fr * 4.01, 0.35, g * 0.18, 'sine', music); tone(t, fr * 2, 0.9, g * 0.22, 'triangle', music); };
  (function sched() {
    while (next < ac.currentTime + 1.5) {
      const b = tune[bar % tune.length];
      b.forEach((s, i) => pluck(next + i * beat, f(s) * 2, 0.11));
      pluck(next, f(bass[bar % bass.length]), 0.09);
      pluck(next + beat, f(bass[bar % bass.length] + 4), 0.05); pluck(next + 2 * beat, f(bass[bar % bass.length] + 4), 0.05);
      next += 3 * beat; bar++;
    }
    setTimeout(sched, 400);
  })();
}
export function setMusicLevel(v) { if (music) music.gain.setTargetAtTime(v, ac.currentTime, 0.4); }

/* booth sounds */
export function thump(s = 1) { if (!ac) return; const t = ac.currentTime; const o = tone(t, 150, 0.2, 0.8 * s); o.frequency.exponentialRampToValueAtTime(48, t + 0.14); noise(t, 0.07, 'lowpass', 1200, 0.5 * s); }
export function squish() { if (!ac) return; noise(ac.currentTime, 0.25, 'bandpass', 600, 0.25, 1.2); }
export function paper() { if (!ac) return; const t = ac.currentTime; noise(t, 0.28, 'highpass', 2600, 0.14); noise(t + 0.05, 0.2, 'bandpass', 5200, 0.06, 2); }
export function flip() { if (!ac) return; noise(ac.currentTime, 0.18, 'bandpass', 3400, 0.12, 0.8); }
export function bell() { if (!ac) return; const t = ac.currentTime; [1, 2.76, 5.4].forEach((m, i) => tone(t, 1320 * m, 1.4 - i * 0.35, 0.2 / (i + 1))); tone(t + 0.12, 1760, 1.2, 0.12); }
export function buzz() { if (!ac) return; const t = ac.currentTime; const o = tone(t, 110, 0.5, 0.18, 'sawtooth'); o.frequency.setValueAtTime(110, t); o.frequency.linearRampToValueAtTime(92, t + 0.45); }
export function toss() { if (!ac) return; noise(ac.currentTime + 0.35, 0.12, 'lowpass', 900, 0.3); paper(); }
export function step() { if (!ac) return; noise(ac.currentTime, 0.06, 'lowpass', 700, 0.05); }
