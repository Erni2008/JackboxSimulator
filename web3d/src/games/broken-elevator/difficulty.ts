// THE BROKEN ELEVATOR — room difficulty (mirror of shared/.../gameplay/elevator/Difficulty.java).
// Source: the room snapshot (elevatorDifficulty) > ?diff=easy|normal|hard > last used on this device > NORMAL.
// In a room the server builds the machines; the client only needs the timers for the clock and for practice machines.
import {L} from './i18n';
export type Diff = 'EASY' | 'NORMAL' | 'HARD';
const KEY = 'finalanswer-elevator-diff';
const LIMITS: Record<Diff, {wire: number; pressure: number; formula: number; lock: number; bomb: number}> = {
  EASY: {wire: 90_000, pressure: 60_000, formula: 60_000, lock: 90_000, bomb: 240_000}, NORMAL: {wire: 60_000, pressure: 45_000, formula: 45_000, lock: 70_000, bomb: 180_000}, HARD: {wire: 45_000, pressure: 35_000, formula: 35_000, lock: 55_000, bomb: 150_000}};
const valid = (d: unknown): d is Diff => d === 'EASY' || d === 'NORMAL' || d === 'HARD';
let current: Diff = (() => { const q = new URLSearchParams(location.search).get('diff')?.toUpperCase(); if (valid(q)) return q;
  try { const s = localStorage.getItem(KEY); if (valid(s)) return s; } catch {} return 'NORMAL'; })();
const listeners: ((d: Diff) => void)[] = [];
export const DIFF = () => current;
export const limitMs = (k: "wire" | "pressure" | "formula" | "lock" | "bomb") => LIMITS[current][k];
export const diffName = (d: Diff = current) => d === 'EASY' ? L('Лёгкий', 'Easy') : d === 'HARD' ? L('Сложный', 'Hard') : L('Средний', 'Normal');
export function onDiff(f: (d: Diff) => void) { listeners.push(f); }
export function setDiff(d: unknown) { if (!valid(d) || d === current) return; current = d; try { localStorage.setItem(KEY, d); } catch {} for (const f of listeners) f(d); }
