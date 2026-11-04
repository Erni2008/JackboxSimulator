# THE BROKEN ELEVATOR — The Engineer's Manual

Mode 5 has no elevator scene yet, so the manual is an isolated, reusable Three.js component with a stand-in cage test scene.

- Source: `web3d/src/games/broken-elevator/manual/` (book, materials, page-art, content, interaction, physics, audio, test-scene); entry `web3d/src/broken-elevator-manual.ts`.
- Build: `cd web3d && node build.mjs` → `web/broken-elevator-manual/`. Open `/broken-elevator-manual/` (`?quality=low|high`).
- Puzzle hook: implement `ManualRuleSource.manual()` and call `book.setContent(...)`. `SAMPLE_MANUAL` is specimen content only; no server logic changed.
- Assets: leather / rusted steel scans and `boiler_room` HDRI from Poly Haven (CC0); IM Fell & Caveat fonts (OFL); page turn = existing `page_turn.wav`. Leather, pickup, close and metal-impact sounds are synthesised (no recordings in the project) — drop real files into `SAMPLE_URLS` in `audio.ts`.
- Missing for full photorealism: a dedicated aged-brass scan (brass is procedural), real foley recordings, the real elevator scene.
- Physics: custom single-body solver (box vs cage planes), chosen over Rapier to avoid ~2 MB WASM for one dynamic body.
