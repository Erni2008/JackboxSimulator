// Wire-cutting puzzle: pure rules, no rendering. The manual prints the RULES
// (digit table + vowel exception); the fuse box shows the serial and the wires.
// The player must combine both — the book never states the answer directly.
// Browser-side for the test scene; the Java server can later own `generate`.
import {rng} from '../manual/page-art';
import type {Fault, Mode} from './diagnostics';
import {resolve} from './rules24';

export const WIRE_COLORS = {red: '#9e1208', yellow: '#c79300', blue: '#0f3a8c', green: '#1f6e1c', purple: '#4a1670', white: '#b9b6ad'} as const;
export type WireColor = keyof typeof WIRE_COLORS;
const ALL = Object.keys(WIRE_COLORS) as WireColor[];
const VOWELS = 'AEIOU';

export interface WireRules { /** colour to cut for last digit pairs 0-1, 2-3, 4-5, 6-7, 8-9 */ table: WireColor[] }
export interface WireTask { serial: string; wires: WireColor[]; answer: number; fault: Fault; mode: Mode; rule: number; section: string }

function shuffle<T>(a: T[], r: () => number) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

export function makeRules(seed: number): WireRules { const r = rng(seed * 101 + 7); return {table: shuffle(ALL, r).slice(0, 5)}; }

export function solve(rules: WireRules, serial: string, wires: WireColor[]) {
  const last = +serial[serial.length - 1]; let i = wires.indexOf(rules.table[Math.floor(last / 2)]);
  if ([...serial.slice(3)].some(c => VOWELS.includes(c))) i = (i + 1) % wires.length;
  return i;
}

/** One panel configuration. Serial alphabet avoids look-alikes (no O/0, I/1, S/5 confusion). */
export function makeTask(_rules: WireRules, seed: number, count = 6, fixed: {fault?: Fault; mode?: Mode} = {}): WireTask {
  const r = rng(seed * 7919 + 3), L = 'ABCDEFHKMNPRTUVXZ', D = '2346789';
  const pick = (s: string) => s[Math.floor(r() * s.length)];
  const serial = `${pick(L)}${pick(D)}${pick(L)}${pick(D)}${pick(D)}`;
  const wires = shuffle(ALL, r).slice(0, Math.max(4, Math.min(6, count)));
  const faults: Fault[] = ['overload', 'short', 'power'], fault = fixed.fault || faults[Math.floor(r() * 3)], mode: Mode = fixed.mode || (r() < .5 ? 'normal' : 'emergency');
  const res = resolve({fault, mode, wires, serial}); return {serial, wires, fault, mode, answer: res.wire, rule: res.rule, section: res.section};
}

const cap = (c: string) => c[0].toUpperCase() + c.slice(1);
/** Rows for the manual's "Order of Cutting" table. */
export function manualRows(rules: WireRules) {
  const pairs = ['0 or 1', '2 or 3', '4 or 5', '6 or 7', '8 or 9'];
  return [...rules.table.map((c, i) => ({condition: `Serial ends in ${pairs[i]}`, action: `cut ${cap(c)}`})),
    {condition: 'Serial bears a vowel (A E I O U)', action: 'cut the next wire to the right'}];
}
