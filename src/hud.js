import * as S from './sound.js';
import { save } from './save.js';

export const $ = s => document.querySelector(s);

export function pill(sel) {
  const el = $(sel);
  return (t) => { if (!t) { el.classList.remove('on'); return; } el.textContent = t; el.classList.add('on'); };
}
export function say(t) { const l = $('#live'); l.textContent = ''; setTimeout(() => l.textContent = t, 40); }
export const esc = t => String(t).replace(/[<&]/g, c => c === '<' ? '&lt;' : '&amp;');

/* tickets chip, sound switch, loading bar and the start button */
export function chrome(E, { startLabel, onStart }) {
  $('#tix b').textContent = save.tickets;
  const setSnd = () => { $('#snd').textContent = S.muted ? 'Sound off' : 'Sound on'; $('#snd').setAttribute('aria-pressed', String(!S.muted)); };
  try { if (localStorage.getItem('wmt-muted')) S.setMuted(true); } catch (e) {}
  $('#snd').onclick = () => { S.setMuted(!S.muted); setSnd(); try { localStorage.setItem('wmt-muted', S.muted ? '1' : ''); } catch (e) {} };
  setSnd();
  E.onProgress = f => { $('#bar i').style.width = Math.round(f * 100) + '%'; };
  E.onLoad = () => { $('#loading').hidden = true; const b = $('#start'); b.disabled = false; b.textContent = startLabel; };
  $('#start').onclick = () => {
    S.start();
    $('#intro').classList.add('gone'); setTimeout(() => $('#intro').hidden = true, 800);
    onStart();
  };
  return { ticket(n) { $('#tix b').textContent = n; const t = $('#tix'); t.classList.remove('pop'); void t.offsetWidth; t.classList.add('pop'); } };
}

export function share(btn, text) {
  const done = t => { const o = btn.textContent; btn.textContent = t; setTimeout(() => btn.textContent = o, 2200); };
  if (navigator.share) navigator.share({ text }).catch(() => {});
  else if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => done('Copied'), () => done('Could not copy'));
  else done('Could not copy');
}
