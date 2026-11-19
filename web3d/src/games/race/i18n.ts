// Race UI language: English by default (Steam), Russian when the room / phone is set to Russian.
// Source of truth is the room language the phone app stores ('finalanswer-lang'); ?lang=ru|en overrides for testing.
const pick = (): 'en' | 'ru' => {
  if (typeof location === 'undefined') return 'en';
  const q = new URLSearchParams(location.search).get('lang'); if (q === 'ru' || q === 'en') return q;
  try {const s = sessionStorage.getItem('finalanswer-lang') ?? localStorage.getItem('finalanswer-lang'); if (s === 'ru' || s === 'en') return s;} catch {}
  return 'en';
};
export const LANG = pick();
/** t('Русский', 'English') — every visible string carries both languages side by side. */
export const t = (ru: string, en: string) => LANG === 'ru' ? ru : en;

// Static page text (index.html) and a few strings set by the page loader: translated in place by exact match,
// so the HTML keeps one source and the English build needs no second page.
const DOM_EN: Record<string, string> = {
  'ПРОКЛЯТЫЙ ЗАБЕГ — FINAL ANSWER': 'CURSED RUN — FINAL ANSWER', 'Правила Проклятого забега': 'Cursed Run rules', 'FINAL ANSWER · ИСПЫТАНИЕ НА ВЫЖИВАНИЕ': 'FINAL ANSWER · SURVIVAL TRIAL',
  'ПРОКЛЯТЫЙ ЗАБЕГ': 'CURSED RUN', 'ИСКРА ЖИЗНИ': 'LIFE SPARK', 'Редкая реликвия': 'A rare relic', 'ПРОПУСТИТЬ ›': 'SKIP ›', 'НАЖМИТЕ, ЧТОБЫ НАЧАТЬ': 'TAP TO START',
  'Ущелье заката': 'Sunset Gorge', 'Проклятое кладбище': 'Cursed Graveyard', 'Дом коллекционера': 'The Collector\'s House', 'Катакомбы': 'Catacombs',
  'карта 1': 'map 1', 'карта 2': 'map 2', 'карта 3': 'map 3', 'карта 4': 'map 4', 'Вид персонажей': 'Character look', 'Чёткий': 'Crisp', 'Мультяшный': 'Cartoon', 'Готический': 'Gothic',
  'Выберите персонажа': 'Choose your character', 'Загрузка трассы…': 'Loading the track…', 'МЕСТО': 'PLACE', 'Звук': 'Sound', 'Прыжок': 'Jump', 'ФИНИШ!': 'FINISH!', 'ЕЩЁ РАЗ': 'AGAIN',
  'В ЛОББИ': 'TO THE LOBBY', 'ЖДЁМ ВЕДУЩЕГО': 'WAITING FOR THE HOST', 'ЗАБЕГ ЗАКРЫТ': 'RACE CLOSED', 'Нет сессии комнаты — вернитесь в игру': 'No room session — return to the game',
};
function localize(root: Node) {
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n: Node | null;
  while ((n = w.nextNode())) {const raw = n.nodeValue ?? '', k = raw.trim(); const en = DOM_EN[k]; if (en) n.nodeValue = raw.replace(k, en);}
  if (root instanceof Element || root === document.body) for (const el of (root as Element).querySelectorAll?.('[aria-label],[title]') ?? []) for (const a of ['aria-label', 'title']) {const v = el.getAttribute(a); if (v && DOM_EN[v]) el.setAttribute(a, DOM_EN[v]);}
}
if (LANG === 'en' && typeof document !== 'undefined') {
  const run = () => {document.documentElement.lang = 'en'; if (DOM_EN[document.title]) document.title = DOM_EN[document.title]; localize(document.body);
    new MutationObserver(ms => {for (const m of ms) {if (m.type === 'characterData') {const k = (m.target.nodeValue ?? '').trim(); if (DOM_EN[k]) m.target.nodeValue = DOM_EN[k];} else m.addedNodes.forEach(x => localize(x.nodeType === 3 ? x.parentNode ?? x : x));}})
      .observe(document.body, {childList: true, subtree: true, characterData: true});};
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', run); else run();
}
