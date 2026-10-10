// Everything the fair remembers lives in this one browser entry.
const KEY = 'wmt-fair';
export const save = { seen: [], tickets: 0, rounds: 0, weighRounds: 0 };
try { Object.assign(save, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) {}
try { const old = JSON.parse(localStorage.getItem('wmt-real-or-fake')); if (old && old.seen && !save.seen.length) save.seen = old.seen; } catch (e) {}
export const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) {} };
