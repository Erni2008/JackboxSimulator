// INDUSTRIAL EMERGENCY DIAGNOSTICS — the 24 disconnection rules (3 sections × 8).
// One data table drives BOTH the printed manual and the cut validation, so the book
// can never disagree with the panel. First matching rule wins, top to bottom; wire
// positions are counted left to right. (Browser-side for now; the server can import
// the same table when validation moves there.)
import type {Fault, Mode} from './diagnostics';
import type {WireColor} from './wire-puzzle';

export const TERMINALS = ['A1', 'B2', 'C3', 'D4', 'E5', 'F6'] as const;
export interface PanelState { fault: Fault; mode: Mode; wires: WireColor[]; serial: string }
/** Structured condition: drives the icon renderer, the text fallback and the evaluator. */
export type Cond =
  | {k: 'fault'; v: Fault} | {k: 'mode'; v: Mode}
  | {k: 'pos'; at: number | 'last'; color: WireColor}       // wire at position (0-based) or the last one has colour
  | {k: 'none'; color: WireColor} | {k: 'has'; color: WireColor}
  | {k: 'leftOf'; a: WireColor; b: WireColor}
  | {k: 'odd'} | {k: 'even'} | {k: 'vowel'} | {k: 'else'};
export interface Rule { cond: Cond[]; when: string[]; cut: number; test: (s: PanelState) => boolean }
export interface RuleSection { numeral: string; title: string; wires: 4 | 5 | 6; rules: Rule[] }

const FAULT = {overload: 'OVERLOAD', short: 'SHORT CIRCUIT', power: 'POWER FAILURE'} as const;
const ORD = ['FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH', 'SIXTH'];
export function evalCond(c: Cond, s: PanelState): boolean {
  switch (c.k) {
    case 'fault': return s.fault === c.v; case 'mode': return s.mode === c.v;
    case 'pos': return s.wires[c.at === 'last' ? s.wires.length - 1 : c.at] === c.color;
    case 'none': return !s.wires.includes(c.color); case 'has': return s.wires.includes(c.color);
    case 'leftOf': return s.wires.includes(c.a) && s.wires.includes(c.b) && s.wires.indexOf(c.a) < s.wires.indexOf(c.b);
    case 'odd': return +s.serial[s.serial.length - 1] % 2 === 1; case 'even': return +s.serial[s.serial.length - 1] % 2 === 0;
    case 'vowel': return /[AEU]/.test(s.serial); case 'else': return true;
  }
}
export function condText(c: Cond): string {
  switch (c.k) {
    case 'fault': return FAULT[c.v]; case 'mode': return `${c.v.toUpperCase()} MODE`;
    case 'pos': return `${c.at === 'last' ? 'LAST' : ORD[c.at]} WIRE ${c.color.toUpperCase()}`;
    case 'none': return `NO ${c.color.toUpperCase()} WIRE`; case 'has': return `A ${c.color.toUpperCase()} WIRE IS PRESENT`;
    case 'leftOf': return `${c.a.toUpperCase()} LEFT OF ${c.b.toUpperCase()}`;
    case 'odd': return 'SERIAL ENDS IN ODD DIGIT'; case 'even': return 'SERIAL ENDS IN EVEN DIGIT'; case 'vowel': return 'SERIAL CONTAINS A VOWEL'; case 'else': return 'NO OTHER RULE APPLIES';
  }
}
const R = (cond: Cond[], cut: string): Rule => ({cond, when: cond.map(condText), cut: TERMINALS.indexOf(cut as any), test: s => cond.every(c => evalCond(c, s))});
const F = (v: Fault): Cond => ({k: 'fault', v}), M = (v: Mode): Cond => ({k: 'mode', v}), P = (at: number | 'last', color: WireColor): Cond => ({k: 'pos', at, color});
const ODD: Cond = {k: 'odd'}, EVEN: Cond = {k: 'even'}, VOWEL: Cond = {k: 'vowel'}, ELSE: Cond = {k: 'else'};

// Same 24 rules, same order and targets as before — only expressed as structured conditions.
export const RULES: RuleSection[] = [
  {numeral: 'I', title: 'FOUR WIRES', wires: 4, rules: [
    R([F('overload'), P(0, 'red')], 'B2'),
    R([F('short'), {k: 'none', color: 'blue'}], 'D4'),
    R([F('power'), M('emergency')], 'A1'),
    R([P('last', 'white'), ODD], 'C3'),
    R([F('overload'), M('emergency')], 'D4'),
    R([F('short'), VOWEL], 'A1'),
    R([{k: 'has', color: 'yellow'}], 'C3'),
    R([ELSE], 'B2'),
  ]},
  {numeral: 'II', title: 'FIVE WIRES', wires: 5, rules: [
    R([F('power'), P(0, 'green')], 'E5'),
    R([F('overload'), {k: 'none', color: 'red'}], 'C3'),
    R([F('short'), M('emergency')], 'B2'),
    R([P(2, 'blue'), EVEN], 'D4'),
    R([F('overload'), M('normal')], 'A1'),
    R([F('short'), P('last', 'purple')], 'E5'),
    R([VOWEL], 'D4'),
    R([ELSE], 'C3'),
  ]},
  {numeral: 'III', title: 'SIX WIRES', wires: 6, rules: [
    R([F('short'), P(0, 'white')], 'F6'),
    R([F('power'), M('normal')], 'B2'),
    R([F('overload'), {k: 'leftOf', a: 'red', b: 'blue'}], 'E5'),
    R([M('emergency'), ODD], 'A1'),
    R([F('power'), P('last', 'yellow')], 'D4'),
    R([F('short'), VOWEL], 'C3'),
    R([F('overload')], 'F6'),
    R([ELSE], 'D4'),
  ]},
];

/** index of the wire to cut and the number (1-based) of the rule that decided it */
export function resolve(s: PanelState) {
  const sec = RULES.find(r => r.wires === s.wires.length)!; const k = sec.rules.findIndex(r => r.test(s));
  return {wire: sec.rules[k].cut, rule: k + 1, section: sec.numeral};
}
