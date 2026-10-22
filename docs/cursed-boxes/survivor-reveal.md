> Оригиналы, ранее находившиеся в корне, теперь размещены в `source_assets/cursed_boxes/`, `source_assets/shotgun/` и `source_assets/audio/`. Актуальные пути и исходные имена: [каталог](../../source_assets/catalog.json). Рабочие пути внутри `assets/` сохранены.

# CURSED BOXES survivor reveal

Implemented in the existing 3D gallery, shared with multiplayer and a dedicated local developer fixture. The shotgun, damage states, original damaged character PNGs, two-shot limit, nine-shot character test and global scores remain intact.

## Authority and synchronization

`CursedBoxesSession` now records elimination explicitly when an occupied compartment is hit. Explicit leavers are excluded; temporary disconnects retain their seats. All players still take their existing turns. Only after the last accepted shot has completed (or remaining turns are forfeited) does the server freeze its survivor roster, timestamps and presentation timings.

The phase changes from SELECTING/FIRING to REVEALING, then FINISHED. Zero survivors go directly to FINISHED. Survivor eligibility comes from the session's elimination set and player/box assignment map, never from client-side box appearance. Each survivor entry contains player ID, box ID, nickname and character ID. Empty boxes and eliminated players never enter this list. Scores are unchanged; final `outcomes` record each player's survival separately.

Only the authenticated Java host receives the complete private survivor assignments at reveal start. Phones receive each survivor assignment when that character's panel fade is scheduled to start. Existing hidden box assignments remain redacted. The server broadcasts timed updates and ends the reveal independently of phone/host connectivity. The Java host seeks forward using server time on reconnect instead of restarting the sequence. Browser clients have no reveal-control command. Final phones show YOU SURVIVED or ELIMINATED and the survivor list.

An existing transition bug found by integration testing is also fixed: a new player's accepted shot queued during the previous gun's table return now starts pickup after the return finishes.

## Timeline

`CursedSurvivorTimeline` is graphics-independent and shared by server and desktop. Its explicit states are WAITING, ANTICIPATION, SMOKE_APPEARING, PANEL_FADING, CHARACTER_REVEALING, CHARACTER_IDLE, NEXT_SURVIVOR and COMPLETED.

Default durations per survivor are 0.40 / 0.50 / 1.00 / 0.65 / 0.10 / 0.35 seconds, respectively, for a three-second slot. `Timings` is configurable and validated; the server sends its settings to the desktop. Reveal order is stable ascending box ID. Character alpha increases during panel fading, and the character-specific entrance continues into CHARACTER_REVEALING. Completed characters retain full visibility and independent idle animation. The panel stays at zero opacity until explicit reset/exit. Starts are idempotent, clock correction never rewinds, and reset clears only reveal presentation state.

## Front panels and depth

The source GLBs contain a single merged wood mesh, with no authored front attachment. `tools/assets/prepare_cursed_survivors.py` partitions the original triangles into a thin front slab and the remaining walls/back. It preserves every triangle, winding, vertex attribute, embedded texture and node transform. It creates no duplicate surface or overlay. The original GLBs are untouched.

The three prepared files are:

- `assets/cursed_boxes/survivors/intact_split.glb`
- `assets/cursed_boxes/survivors/damaged_split.glb`
- `assets/cursed_boxes/survivors/destroyed_split.glb`

`CrateSlot` borrows these shared models and owns independent panel material instances. Reveal flags and opacity are separate from INTACT/DAMAGED/DESTROYED gameplay state. Unrelated boxes keep their original render path. The opaque frame/back pass retains depth writes. Glow and characters render inside the compartment with depth testing and no depth writes, followed by the fading front panel through the existing PBR ModelBatch and foreground smoke. Completed panels are omitted. No new PBR pipeline or framebuffer was added. Per-compartment scissoring also contains clothing/accessories within the shelf opening.

## Artwork and animation

Five supplied intact portraits are copied byte-for-byte into `assets/cursed_boxes/survivors/`: Ghost (`ghost.png`), Dracula (root `vampir.png`), Plague Doctor (root `cumnoidoktor.png`), Skeleton (`skeleton.png`) and Pumpkin (`pumpkin.png`). Their alpha bounds and reviewed source-specific pivots are exported in `rigs.json`.

These flattened images are rendered as a continuous 22 × 26 quad sprite skin, with normalized bone weights and a reusable eight-bone hierarchy. Torso, head/hood, left/right upper arms, forearms and visible legs have independent transforms. Bones support local position, rotation, scale, pivot, inherited opacity, parent transform and rendering order. Ghost has no leg weights. All UVs refer to unchanged original artwork. Adjacent mesh vertices remain shared in deformation space, so rotations do not cut holes or duplicate limbs. Each identity has distinct entrance motions and phase-offset idle motion. Ghost floats; the others have restrained sway/breathing and floor-aligned placement.

For Puppeteer, Zombie and Voodoo, the project already has healthy separated artwork and animation rigs under `assets/lobby/characters/{puppeteer,zombie,voodoo}/`. The reveal reuses those resources, hierarchies, pivots and independent timelines directly in a perspective SpriteBatch. Puppeteer retains head, body, arms, hands, legs, eyes, hair and strings; Zombie retains head, torso, arms and articulated legs; Voodoo retains its configured head, body, arms, legs and accessories. No characters are converted to 3D or rendered through an FBO. Their established entrance/idle animation is reused or adapted to the reveal slot.

### Honest rigging limits

The five flattened portraits are **weighted deformation rigs**, not cleanly extracted layered limb textures. Their overlapping art cannot supply hidden shoulder/elbow/neck pixels. Rotations are intentionally restrained to preserve faces and silhouettes. Fully independent limb crossings, large joint rotations, Dracula's cape separation and a separate Ghost head/cloth layer would require manually prepared masks plus approved hidden joint artwork. No missing anatomy or replacement pixels are fabricated. The three existing layered characters retain their original anatomy constraints as well (for example, Zombie's supplied arms are whole-arm sprites).

## Cursed VFX

- Smoke: `assets/cursed_boxes/effects/cursed_smoke.png` — byte-identical to root `smoke1.png`.
- Glow: `assets/cursed_boxes/effects/cursed_glow.png` — byte-identical to root `smoke2.png`.

Both are 1536 × 1024 RGBA, alpha range 0–254, with transparent outer backgrounds inspected visually and numerically. No chroma key or background removal is applied. Four smoke decals and six red motes are pooled around the current box. Glow is behind the character and fades to a subtle residual level. A pooled red point light and temporary ambient adjustment provide anticipation; ambient light returns to its original value at completion. The photographed room background cannot receive actual geometric light, while the 3D boxes can.

All textures/rigs/materials/vertex arrays are prepared during staged loading and warmed before input. No image segmentation, new texture, new Mesh, shader compilation or static-buffer upload occurs during reveal. Each character has independent animation state; resources are released with the mini-game.

## Developer mode

Run `./gradlew :lwjgl3:cursedSurvivors` to open the dedicated reveal studio, initially showing five survivors. F8 cycles 1 → 3 → 5 → 8 → 0. R performs the existing scene reset. The fixture does not connect to a room or change scores. F8 is ignored in multiplayer and the existing nine-shot character-test mode, preserving that test's controls and behavior. Damage and already-visible eliminated representations are retained when restarting the local reveal fixture.

## Validation

Passed commands:

```
./gradlew :core:build :server:build :lwjgl3:classes
./gradlew :lwjgl3:cursedSurvivors -PcursedSurvivorQA=true -PcursedSurvivorCaptures=true :lwjgl3:cursedBoxesCharacters -PcursedCharacterQA=true
./gradlew :lwjgl3:cursedBoxesPhoneCheck
PLAYWRIGHT_MODULE=/tmp/cursed-survivor-browser/node_modules/playwright CHROME_PATH=/tmp/finalanswer-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell node tools/checks/check_cursed_boxes_browser.cjs
```

Core tests cover 0/1/3/5/8 counts, ordering, opacity endpoints, persistent reveal, idempotent start, reset, frame independence, stale/invalid clocks, parent transform/scale/opacity inheritance and no transform accumulation. Server tests cover survivor-only selection, five survivors from empty hits, one eliminated/one survivor, delayed public assignments, malicious client rejection, disconnect/reconnect, completion and preserved destruction.

Native GL QA passed 0/1/3/5/8 survivor fixtures, all eight identities, a damaged survivor, an excluded already-visible destroyed occupant, unchanged unrelated panels, permanent reveal, reset, resource stability and disposal. It reported zero cold shader compilations, texture uploads or static-buffer uploads. CPU submission averaged approximately 0.26 ms, with a 1.21 ms maximum on this machine; this is diagnostic, not a guarantee for every GPU or a before/after benchmark. Captures under `generated/cursed-boxes/survivors/` were visually inspected.

The existing nine-shot native test passed: eight persistent occupants, one empty destroyed compartment, seven intact boxes, ninth-shot limit, table return, reset and GL checks. The two-browser test exercised the real server and Java renderer, seven phone viewports, shots/retries/rejected actions, host/phone reconnect, zero survivors, a two-survivor round with a host reconnect during reveal, synchronized final results, unchanged scores and return to the existing question UI.

Offline verification confirmed that all seven packaged PNGs are byte-identical to their sources and that all three split GLBs conserve every original triangle and winding.

## Existing gameplay constraint

Eight players currently fire sixteen distinct destructive shots into sixteen boxes. Therefore a complete eight-player round necessarily eliminates every occupant. This change preserves that rule rather than changing ammunition or target eligibility. Smaller rosters can produce surviving players; eight-survivor presentation is supported and verified by the isolated developer fixture.

## Files

Created:

- `shared/src/main/java/com/finalanswer/protocol/CursedSurvivorTimeline.java`
- `core/src/main/java/com/erni/finalanswer/cursedboxes/CursedSurvivorAssets.java`
- `core/src/main/java/com/erni/finalanswer/cursedboxes/CursedSurvivorReveal.java`
- `core/src/main/java/com/erni/finalanswer/cursedboxes/CursedPortraitRig.java`
- `core/src/main/java/com/erni/finalanswer/cursedboxes/CursedSpriteSkeleton.java`
- `core/src/test/java/com/erni/finalanswer/cursedboxes/CursedSurvivorCheck.java`
- `lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/CursedSurvivorRevealLauncher.java`
- `tools/assets/prepare_cursed_survivors.py`, this document, prepared survivor GLBs/PNGs/rig metadata, two cursed VFX PNGs and native QA captures.

Updated:

- `CursedBoxesSession.java`, `RoomService.java`, `CursedBoxesTest.java` for authoritative survival, reveal timing, redaction and regression coverage.
- `CursedBoxesAssets.java`, `CrateSlot.java`, `CursedBoxesScreen.java`, `CursedBoxesRenderer.java`, `CursedCharacterController.java`, `CursedBoxesMultiplayerController.java` for loading, rendering, shared state and lifecycle.
- `ShotgunRenderer.java` to reuse its existing PBR batch for transparent panels.
- `web/cursed-boxes.js`, `CursedBoxesPhoneCheck.java`, `tools/checks/check_cursed_boxes_browser.cjs` for phone phase/results UI and live integration tests.
- `core/build.gradle` and `lwjgl3/build.gradle` for the clock regression and developer/native reveal launcher. Existing generated character QA profiles are refreshed by their original tests.
