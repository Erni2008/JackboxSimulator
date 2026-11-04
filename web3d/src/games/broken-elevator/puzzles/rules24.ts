// INDUSTRIAL EMERGENCY DIAGNOSTICS — the 24 disconnection rules (3 sections × 8).
// One data table drives BOTH the printed manual and the cut validation, so the book
// can never disagree with the panel. First matching rule wins, top to bottom; wire
// positions are counted left to right. (Browser-side for now; the server can import
// the same table when validation moves there.)
import type {Fault, Mode} from './diagnostics';
import type {WireColor} from './wire-puzzle';

export const TERMINALS = ['A1', 'B2', 'C3', 'D4', 'E5', 'F6'] as const;
export interface PanelState { fault: Fault; mode: Mode; wires: WireColor[]; serial: string }
export interface Rule { when: string[]; cut: number; test: (s: PanelState) => boolean }
export interface RuleSection { numeral: string; title: string; wires: 4 | 5 | 6; rules: Rule[] }

const FAULT = {overload: 'OVERLOAD', short: 'SHORT CIRCUIT', power: 'POWER FAILURE'} as const;
const lastDigit = (s: PanelState) => +s.serial[s.serial.length - 1];
const vowel = (s: PanelState) => /[AEU]/.test(s.serial);
const f = (k: Fault) => (s: PanelState) => s.fault === k, m = (k: Mode) => (s: PanelState) => s.mode === k;
const first = (c: WireColor) => (s: PanelState) => s.wires[0] === c, last = (c: WireColor) => (s: PanelState) => s.wires[s.wires.length - 1] === c;
const nth = (i: number, c: WireColor) => (s: PanelState) => s.wires[i] === c, none = (c: WireColor) => (s: PanelState) => !s.wires.includes(c);
const count = (c: WireColor, n: number) => (s: PanelState) => s.wires.filter(w => w === c).length === n;
const odd = (s: PanelState) => lastDigit(s) % 2 === 1, even = (s: PanelState) => lastDigit(s) % 2 === 0;
const leftOf = (a: WireColor, b: WireColor) => (s: PanelState) => s.wires.includes(a) && s.wires.includes(b) && s.wires.indexOf(a) < s.wires.indexOf(b);
const all = (...t: ((s: PanelState) => boolean)[]) => (s: PanelState) => t.every(x => x(s));
const R = (when: string[], cut: string, test: (s: PanelState) => boolean): Rule => ({when, cut: TERMINALS.indexOf(cut as any), test});
const ALWAYS = () => true;

export const RULES: RuleSection[] = [
  {numeral: 'I', title: 'FOUR WIRES', wires: 4, rules: [
    R([FAULT.overload, 'FIRST WIRE RED'], 'B2', all(f('overload'), first('red'))),
    R([FAULT.short, 'NO BLUE WIRE'], 'D4', all(f('short'), none('blue'))),
    R([FAULT.power, 'EMERGENCY MODE'], 'A1', all(f('power'), m('emergency'))),
    R(['LAST WIRE WHITE', 'SERIAL ENDS IN ODD DIGIT'], 'C3', all(last('white'), odd)),
    R([FAULT.overload, 'EMERGENCY MODE'], 'D4', all(f('overload'), m('emergency'))),
    R([FAULT.short, 'SERIAL CONTAINS A VOWEL'], 'A1', all(f('short'), vowel)),
    R(['A YELLOW WIRE IS PRESENT'], 'C3', count('yellow', 1)),
    R(['NO OTHER RULE APPLIES'], 'B2', ALWAYS),
  ]},
  {numeral: 'II', title: 'FIVE WIRES', wires: 5, rules: [
    R([FAULT.power, 'FIRST WIRE GREEN'], 'E5', all(f('power'), first('green'))),
    R([FAULT.overload, 'NO RED WIRE'], 'C3', all(f('overload'), none('red'))),
    R([FAULT.short, 'EMERGENCY MODE'], 'B2', all(f('short'), m('emergency'))),
    R(['THIRD WIRE BLUE', 'SERIAL ENDS IN EVEN DIGIT'], 'D4', all(nth(2, 'blue'), even)),
    R([FAULT.overload, 'NORMAL MODE'], 'A1', all(f('overload'), m('normal'))),
    R([FAULT.short, 'LAST WIRE PURPLE'], 'E5', all(f('short'), last('purple'))),
    R(['SERIAL CONTAINS A VOWEL'], 'D4', vowel),
    R(['NO OTHER RULE APPLIES'], 'C3', ALWAYS),
  ]},
  {numeral: 'III', title: 'SIX WIRES', wires: 6, rules: [
    R([FAULT.short, 'FIRST WIRE WHITE'], 'F6', all(f('short'), first('white'))),
    R([FAULT.power, 'NORMAL MODE'], 'B2', all(f('power'), m('normal'))),
    R([FAULT.overload, 'RED LEFT OF BLUE'], 'E5', all(f('overload'), leftOf('red', 'blue'))),
    R(['EMERGENCY MODE', 'SERIAL ENDS IN ODD DIGIT'], 'A1', all(m('emergency'), odd)),
    R([FAULT.power, 'LAST WIRE YELLOW'], 'D4', all(f('power'), last('yellow'))),
    R([FAULT.short, 'SERIAL CONTAINS A VOWEL'], 'C3', all(f('short'), vowel)),
    R([FAULT.overload], 'F6', f('overload')),
    R(['NO OTHER RULE APPLIES'], 'D4', ALWAYS),
  ]},
];

/** index of the wire to cut and the number (1-based) of the rule that decided it */
export function resolve(s: PanelState) {
  const sec = RULES.find(r => r.wires === s.wires.length)!; const k = sec.rules.findIndex(r => r.test(s));
  return {wire: sec.rules[k].cut, rule: k + 1, section: sec.numeral};
}
