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
  layout?: 'title' | 'contents' | 'standard' | 'endpaper' | 'rules' | 'guide' | 'pressure';
  /** rules layout: section index into RULES and which half (0 = rules 01–04, 1 = 05–08) */
  section?: number; half?: 0 | 1;
}

export interface ManualSection { id: string; numeral: string; title: string; pages: ManualPage[] }

export interface ManualContent { edition: string; specimen: boolean; sections: ManualSection[]; /** explicit physical page order (overrides the default title/contents/sections flow) */ layoutPages?: ManualPage[] }

/** Implemented by the future puzzle generator. Must be deterministic for a round seed. */
export interface ManualRuleSource { manual(): ManualContent }

export const SECTION_IDS = ['wiring', 'cutting', 'pressure', 'circuits', 'codes', 'power', 'mechanical', 'emergency'] as const;

/** Content can come from the Java server as JSON (same shape as ManualContent). */
export async function loadManualContent(url: string): Promise<ManualContent> { const r = await fetch(url); if (!r.ok) throw new Error(`Manual rules ${r.status}`); const c = await r.json(); if (!Array.isArray(c?.sections)) throw new Error('Manual rules: sections missing'); return c; }

/** Flattens content into physical pages: title, contents, then section pages; padded to even count. */
export function paginate(content: ManualContent): ManualPage[] {
  if (content.layoutPages) return content.layoutPages.length % 2 ? [...content.layoutPages, {layout: 'endpaper'}] : content.layoutPages;
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
    {id: 'circuits', numeral: 'IV', title: 'Electrical Circuits', pages: [
      {heading: 'Reading a Circuit Plate', paragraphs: [
        'Every panel of the car carries a plate showing its circuit. Lamps are drawn as circles, switches as hinged lines, fuses as small rectangles.',
        'A circuit is complete only when every switch upon its path is closed. The operator shall trace the path with a finger from the source to the lamp before throwing any switch.',
      ], steps: ['Find the source marked +.', 'Follow the line to each switch in turn.', 'Close only the switches that lie upon the path.', 'Leave all others open.'],
      notes: [{text: 'dead ends are traps', x: .6, y: .9, angle: -4, ink: 'red'}]},
      {heading: 'Plate IV \u2014 Warning Marks', diagram: {type: 'symbols', symbols: [
        {glyph: 'bolt', meaning: 'Live conductor'}, {glyph: 'flame', meaning: 'Heat / vent'},
        {glyph: 'gear', meaning: 'Moving parts'}, {glyph: 'drop', meaning: 'Hydraulic fluid'},
        {glyph: 'skull', meaning: 'Fatal \u2014 do not touch'}, {glyph: 'eye', meaning: 'Observe only'},
        {glyph: 'hand', meaning: 'Operate by hand'}, {glyph: 'triangle', meaning: 'General hazard'}]},
        caption: 'Where two marks appear together, the upper governs.'},
    ]},
    {id: 'codes', numeral: 'V', title: 'Emergency Access Codes', pages: [
      {heading: 'Deriving the Access Code', paragraphs: [
        'The emergency hatch is sealed by a four-figure combination. The combination is never written down; it is derived afresh from the instruments of the car.',
        'Take the figures in order from the plates named below. Where a plate shows no figure, use the number of rivets upon it.',
      ], steps: ['First figure: the floor indicator, last digit.', 'Second: the number of lamps lit.', 'Third: the gauge reading, first digit.', 'Fourth: the sum of the first three, last digit.'],
      notes: [{text: 'specimen rule \u2014 live rule changes each descent', x: .5, y: .92, angle: -2, ink: 'pencil', size: .8}]},
      {heading: 'Table V \u2014 Code Corrections', diagram: {type: 'cutting', rows: [
        {condition: 'If any figure is 0', action: 'read it as 9'},
        {condition: 'If two figures are equal', action: 'add one to the later'},
        {condition: 'If the bell has rung', action: 'reverse the order'},
        {condition: 'Otherwise', action: 'enter as derived'}]},
        caption: 'Apply corrections from top to bottom.'},
    ]},
    {id: 'power', numeral: 'VI', title: 'Power Restoration', pages: [
      {heading: 'Emergency Accumulators', paragraphs: [
        'When the main supply fails the car may be lowered upon its own accumulator bank. The bank holds sufficient charge for a single descent of not more than three floors.',
        'Cells are to be engaged in sequence from the left. A cell engaged out of turn will discharge the whole bank.',
      ], steps: ['Throw the isolating switch.', 'Engage cells one by one.', 'Release the brake only when the lamp burns steady.']},
      {heading: 'Fig. 4 — Accumulator Bank', diagram: {type: 'power', cells: 6, label: 'To brake solenoid'},
        notes: [{text: 'cell 4 cracked — skip?', x: .58, y: .74, angle: 5, ink: 'red'}]},
    ]},
    {id: 'mechanical', numeral: 'VII', title: 'Mechanical Repair', pages: [
      {heading: 'Failure of the Winding Gear', paragraphs: [
        'A slipping car is most often caused by a stripped pinion. Listen for an irregular knocking: one knock for each missing tooth.',
        'The governor will trip only when the car exceeds its rated speed by one half. Do not rely upon it.',
      ], notes: [{text: 'it did not trip for us', x: .18, y: .88, angle: -3, ink: 'pencil'}]},
      {heading: 'Fig. 5 — Gear Train', diagram: {type: 'gears', teeth: [24, 12, 18]}, caption: 'Driving wheel, pinion and governor wheel.'},
    ]},
    {id: 'emergency', numeral: 'VIII', title: 'Emergency Procedures', pages: [
      {heading: 'In the Event of Arrest Between Floors', diagram: {type: 'checklist', items: [
        'Remain calm. Do not force the gate.', 'Sound the bell three times.', 'Isolate the main supply.',
        'Inspect the junction box (Sect. I).', 'Regulate the buffer (Sect. III).', 'Derive the hatch code (Sect. V).', 'Restore power (Sect. VI).', 'Release the brake by hand.']}},
      {heading: 'Final Note', paragraphs: [
        'If these procedures fail, the operator shall record the hour and the names of all persons within the car upon the last page of this manual.',
      ], notes: [{text: 'the last page is full', x: .5, y: .62, angle: -8, ink: 'red', size: 1.4}]},
    ]},
  ],
};

/** INDUSTRIAL EMERGENCY DIAGNOSTICS: title + procedure, then one spread per wire count (I four, II five, III six). */
export function diagnosticsManual(): ManualContent {
  return {edition: 'Form VII', specimen: false, sections: [], layoutPages: [
    {layout: 'title'}, {layout: 'guide'},
    {layout: 'rules', section: 0, half: 0}, {layout: 'rules', section: 0, half: 1},
    {layout: 'rules', section: 1, half: 0}, {layout: 'rules', section: 1, half: 1},
    {layout: 'rules', section: 2, half: 0}, {layout: 'rules', section: 2, half: 1},
    {layout: 'pressure', half: 0} as any, {layout: 'pressure', half: 1} as any,
  ]};
}
