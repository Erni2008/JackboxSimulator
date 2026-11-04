# THE BROKEN ELEVATOR — The Engineer's Manual

Mode 5 has no elevator scene yet, so the manual is an isolated, reusable Three.js component with a stand-in cage test scene.

- Source: `web3d/src/games/broken-elevator/manual/` (book, materials, page-art, content, interaction, physics, audio, test-scene); entry `web3d/src/broken-elevator-manual.ts`.
- Build: `cd web3d && node build.mjs` → `web/broken-elevator-manual/`. Open `/broken-elevator-manual/` (`?quality=low|high`).
- Puzzle hook: implement `ManualRuleSource.manual()` and call `book.setContent(...)`. `SAMPLE_MANUAL` is specimen content only; no server logic changed.
- Assets: leather / rusted steel scans and `boiler_room` HDRI from Poly Haven (CC0); IM Fell & Caveat fonts (OFL); page turn = existing `page_turn.wav`. Leather, pickup, close and metal-impact sounds are synthesised (no recordings in the project) — drop real files into `SAMPLE_URLS` in `audio.ts`.
- Missing for full photorealism: a dedicated aged-brass scan (brass is procedural), real foley recordings, the real elevator scene.
- Physics: custom single-body solver (box vs cage planes), chosen over Rapier to avoid ~2 MB WASM for one dynamic body.

## cage.glb (current)
- The elevator is now the supplied `cage.glb` (repo root, 34 MB original). A web copy with identical geometry and 2048 px JPEG textures is in `web/broken-elevator-manual/models/cage.glb` (2.7 MB). The procedural cage remains only behind `?cage=procedural`.
- Scaled from measured bounds to 2.6 m; floor, ceiling and walls are found by raycasting the mesh; the player stands inside with 360° drag-look (disabled while holding the book).
- Gloss fix: the asset had roughness ≈ 0.19 and specular ×2. Roughness/metalness are rebuilt from its own albedo (rust rough and dielectric, iron matte-metallic) plus world-space triplanar corrosion from the CC0 rusty-steel scan.
- Limitation: the GLB interior walls are low-detail/smeared in the original texture; the overlay adds grain but cannot invent modelled detail.
- Book sits on a wall shelf (iron plank, brass brackets). Whole-page taps turn pages (right = forward, left = back), swipes too; no navigation buttons.
- Server rules: `?rules=<url>` loads ManualContent JSON (`loadManualContent`).
- Check: `tools/checks/check_broken_elevator_manual.cjs` (desktop + phone, real clicks/taps).
