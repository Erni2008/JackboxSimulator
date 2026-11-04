// Content model for THE ENGINEER'S MANUAL.
//
// The book never invents rules. It renders whatever a ManualRuleSource returns.
// The puzzle generator (not built yet) will implement ManualRuleSource and feed
// the real, seeded rules for a round; until then SAMPLE_MANUAL is used and every
// page carries a "specimen" flag so nobody mistakes it for live gameplay data.

export type Ink = 'black' | 'red' | 'pencil';

export interface Annotation {
  /** handwritten note; x/y in page fractions (0..1), angle in degrees */
  text: string; x: number; y: number; angle?: number; ink?: Ink; size?: number;
}

export type Diagram =
  | {type: 'wiring'; terminals: string[]; wires: {from: number; to: number; label: string; pattern: 'solid' | 'dashed' | 'dotted' | 'double'}[]}
  | {type: 'cutting'; rows: {condition: string; action: string}[]}
  | {type: 'gauge'; min: number; max: number; unit: string; safeFrom: number; safeTo: number; needle: number}
  | {type: 'power'; cells: number; label: string}
  | {type: 'gears'; teeth: number[]}
  | {type: 'symbols'; symbols: {glyph: SymbolGlyph; meaning: string}[]}
  | {type: 'checklist'; items: string[]};

export type SymbolGlyph = 'bolt' | 'skull' | 'flame' | 'gear' | 'drop' | 'eye' | 'hand' | 'triangle';

export interface ManualPage {
  heading?: string;
  /** small caps line above the heading, e.g. "SECTION II" */
  kicker?: string;
  paragraphs?: string[];
  steps?: string[];
  diagram?: Diagram;
  caption?: string;
  notes?: Annotation[];
  /** title-page / contents layouts */
  layout?: 'title' | 'contents' | 'standard' | 'endpaper';
}

export interface ManualSection { id: string; numeral: string; title: string; pages: ManualPage[] }

export interface ManualContent { edition: string; specimen: boolean; sections: ManualSection[] }

/** Implemented by the future puzzle generator. Must be deterministic for a round seed. */
export interface ManualRuleSource { manual(): ManualContent }

export const SECTION_IDS = ['wiring', 'cutting', 'pressure', 'power', 'mechanical', 'symbols', 'emergency'] as const;

/** Flattens content into physical pages: title, contents, then section pages; padded to even count. */
export function paginate(content: ManualContent): ManualPage[] {
  const pages: ManualPage[] = [
    {layout: 'title'},
    {layout: 'contents', heading: 'Contents', paragraphs: content.sections.map(s => `${s.numeral} ${s.title}`)},
  ];
  for (const s of content.sections) for (const p of s.pages) pages.push({kicker: `Section ${s.numeral}`, ...p});
  if (pages.length % 2) pages.push({layout: 'endpaper'});
  return pages;
}

// ---------------------------------------------------------------------------
// Representative specimen content. Plausible, readable, NOT final puzzle rules.
// ---------------------------------------------------------------------------
export const SAMPLE_MANUAL: ManualContent = {
  edition: 'Specimen edition — rules supplied at run time',
  specimen: true,
  sections: [
    {id: 'wiring', numeral: 'I', title: 'Electrical Wiring', pages: [
      {heading: 'Electrical Wiring of the Car', paragraphs: [
        'The car receives its current through the travelling cable, which descends from the machine room and terminates at the junction box beneath the operating panel.',
        'Before any wire is disturbed the operator shall identify each conductor by its sheathing. Five patterns of sheathing are employed in this installation and are figured opposite.',
      ], steps: ['Open the junction box with the brass key.', 'Count the conductors present.', 'Note the pattern of the uppermost wire.', 'Consult Section II before cutting.'],
      notes: [{text: 'never trust the colour — count them', x: .52, y: .86, angle: -4, ink: 'pencil'}]},
      {heading: 'Fig. 1 — Junction Box', diagram: {type: 'wiring', terminals: ['A', 'B', 'C', 'D', 'E'], wires: [
        {from: 0, to: 2, label: 'Main', pattern: 'solid'}, {from: 1, to: 4, label: 'Brake', pattern: 'dashed'},
        {from: 2, to: 0, label: 'Lamp', pattern: 'dotted'}, {from: 3, to: 3, label: 'Bell', pattern: 'double'},
        {from: 4, to: 1, label: 'Earth', pattern: 'solid'}]},
        caption: 'Terminals A–E viewed from the operator’s side.',
        notes: [{text: 'E is live even when off!', x: .6, y: .935, angle: -3, ink: 'red'}]},
    ]},
    {id: 'cutting', numeral: 'II', title: 'Wire Cutting Protocols', pages: [
      {heading: 'Protocol for Severing Conductors', paragraphs: [
        'A conductor once cut cannot be restored within the car. The operator shall therefore read the whole of this table before the shears are applied.',
        'Conditions are to be tested in the order printed. The first condition which holds true determines the wire to be cut; all later lines are to be disregarded.',
      ], notes: [{text: 'first true line only', x: .2, y: .9, angle: 3, ink: 'red'}]},
      {heading: 'Table II — Order of Cutting', diagram: {type: 'cutting', rows: [
        {condition: 'If there are exactly three wires', action: 'cut the second'},
        {condition: 'If no wire is dashed', action: 'cut the last'},
        {condition: 'If the gauge reads above 80', action: 'cut the first dotted'},
        {condition: 'If the bell wire is present', action: 'cut the bell wire'},
        {condition: 'Otherwise', action: 'cut the uppermost'}]},
        caption: 'Specimen table. The live table is printed for each descent.'},
    ]},
    {id: 'pressure', numeral: 'III', title: 'Pressure Regulation', pages: [
      {heading: 'The Hydraulic Buffer', paragraphs: [
        'Beneath the car a column of oil arrests its descent. Should the pressure fall below the safe band the car will strike the pit; should it rise above, the relief valve will vent scalding fluid into the shaft.',
      ], steps: ['Read the gauge at eye level.', 'Turn the regulator one quarter for every ten pounds outside the band.', 'Wait for the needle to settle before turning again.'],
      notes: [{text: 'slowly. it sticks at 60', x: .55, y: .82, angle: -6, ink: 'pencil'}]},
      {heading: 'Fig. 3 — Buffer Gauge', diagram: {type: 'gauge', min: 0, max: 120, unit: 'lb / sq. in.', safeFrom: 45, safeTo: 75, needle: 88},
        caption: 'The shaded arc marks the safe band.'},
    ]},
    {id: 'power', numeral: 'IV', title: 'Emergency Power Systems', pages: [
      {heading: 'Emergency Accumulators', paragraphs: [
        'When the main supply fails the car may be lowered upon its own accumulator bank. The bank holds sufficient charge for a single descent of not more than three floors.',
        'Cells are to be engaged in sequence from the left. A cell engaged out of turn will discharge the whole bank.',
      ], steps: ['Throw the isolating switch.', 'Engage cells one by one.', 'Release the brake only when the lamp burns steady.']},
      {heading: 'Fig. 4 — Accumulator Bank', diagram: {type: 'power', cells: 6, label: 'To brake solenoid'},
        notes: [{text: 'cell 4 cracked — skip?', x: .58, y: .74, angle: 5, ink: 'red'}]},
    ]},
    {id: 'mechanical', numeral: 'V', title: 'Mechanical Failures', pages: [
      {heading: 'Failure of the Winding Gear', paragraphs: [
        'A slipping car is most often caused by a stripped pinion. Listen for an irregular knocking: one knock for each missing tooth.',
        'The governor will trip only when the car exceeds its rated speed by one half. Do not rely upon it.',
      ], notes: [{text: 'it did not trip for us', x: .18, y: .88, angle: -3, ink: 'pencil'}]},
      {heading: 'Fig. 5 — Gear Train', diagram: {type: 'gears', teeth: [24, 12, 18]}, caption: 'Driving wheel, pinion and governor wheel.'},
    ]},
    {id: 'symbols', numeral: 'VI', title: 'Warning Symbols', pages: [
      {heading: 'Plate VI — Warning Marks', diagram: {type: 'symbols', symbols: [
        {glyph: 'bolt', meaning: 'Live conductor'}, {glyph: 'flame', meaning: 'Heat / vent'},
        {glyph: 'gear', meaning: 'Moving parts'}, {glyph: 'drop', meaning: 'Hydraulic fluid'},
        {glyph: 'skull', meaning: 'Fatal — do not touch'}, {glyph: 'eye', meaning: 'Observe only'},
        {glyph: 'hand', meaning: 'Operate by hand'}, {glyph: 'triangle', meaning: 'General hazard'}]}},
      {heading: 'Reading the Marks', paragraphs: [
        'Marks are stamped upon every panel of the car. Where two marks appear together, the upper governs.',
        'A mark scratched through by hand has been countermanded by the chief engineer and is to be ignored.',
      ], notes: [{text: 'who scratched these out?', x: .5, y: .7, angle: -5, ink: 'red', size: 1.15}]},
    ]},
    {id: 'emergency', numeral: 'VII', title: 'Emergency Procedures', pages: [
      {heading: 'In the Event of Arrest Between Floors', diagram: {type: 'checklist', items: [
        'Remain calm. Do not force the gate.', 'Sound the bell three times.', 'Isolate the main supply.',
        'Inspect the junction box (Sect. I).', 'Regulate the buffer (Sect. III).', 'Engage accumulators (Sect. IV).', 'Release the brake by hand.']}},
      {heading: 'Final Note', paragraphs: [
        'If these procedures fail, the operator shall record the hour and the names of all persons within the car upon the last page of this manual.',
      ], notes: [{text: 'the last page is full', x: .5, y: .62, angle: -8, ink: 'red', size: 1.4}]},
    ]},
  ],
};
