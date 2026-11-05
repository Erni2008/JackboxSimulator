// THE BROKEN ELEVATOR — one language for the whole page: UI, both books and every engraving on the machines.
// Decided once, before anything is drawn:  ?lang=ru|en  >  the room's language (stored by the phone controller /
// pushed by the host's game)  >  the browser language. If the room later reports another language, the page reloads.
export type Lang = 'ru' | 'en';
const KEY = 'finalanswer-lang';

function detect(): Lang {
  const q = new URLSearchParams(location.search).get('lang'); if (q === 'ru' || q === 'en') return q;
  try { const s = sessionStorage.getItem(KEY) || localStorage.getItem(KEY); if (s === 'ru' || s === 'en') return s; } catch {}
  return /^ru\b/i.test(navigator.language || '') ? 'ru' : 'en';
}
export const LANG: Lang = detect();
document.documentElement.lang = LANG;
/** pick the phrase for the page language */
export const L = (ru: string, en: string) => LANG === 'ru' ? ru : en;
/** the room says the game runs in another language: remember it and rebuild the page in that language */
export function followRoomLanguage(lang: unknown) {
  if (lang !== 'ru' && lang !== 'en') return; try { sessionStorage.setItem(KEY, lang); localStorage.setItem(KEY, lang); } catch {}
  if (lang !== LANG && !new URLSearchParams(location.search).get('lang')) location.reload();
}
/** static page chrome: elements carry data-ru / data-en */
export function translateDom() { document.querySelectorAll<HTMLElement>('[data-en]').forEach(el => { el.textContent = (LANG === 'ru' ? el.dataset.ru : el.dataset.en) ?? el.textContent; }); }
