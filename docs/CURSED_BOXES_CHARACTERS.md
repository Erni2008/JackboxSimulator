# CURSED BOXES — eight characters and persistent nine-shot developer test

The existing shelf, source BOX3 destruction, modular shotgun, background, lighting,
particle pools, camera and normal two-shot rules are retained. No source artwork or
model geometry was replaced. The developer launcher is in `lwjgl3/src/dev`, excluded
from the production application/menu.

## Launch and controls

From the repository root:

```sh
./gradlew :lwjgl3:cursedBoxesCharacters
# Automatically fire all nine shots, then leave the final scene open:
./gradlew :lwjgl3:cursedBoxesCharacters -PcursedCharactersAuto=true
```

- `1`–`8`: select Ghost, Dracula, Plague Doctor, Puppeteer, Skeleton, Zombie, Pumpkin, Voodoo.
- `9`: select the designated empty box. Mouse selects any of these nine targets.
- `SPACE`: use the real pickup/aim/shot/destruction pipeline. Queued until aiming settles.
- `T`: explicitly restart and run eight character shots followed by one empty-box shot.
- `R`: reset all sixteen boxes, states, particles, gun and nine cartridges; shuffle a new valid distribution.
- `P`: optional front inspection, outside automatic playback. Default is **all fronts visible**.
- `F3`: existing performance overlay; `Q`: existing effect-quality switch.
- `F11`: existing borderless fullscreen toggle, preserving the monitor display mode.
- `ESC`: exit developer test.

All eight simulated players exist simultaneously, in eight distinct boxes. Each
has a separate `CrateSlot.occupantNickname`, displayed on its divider when revealed.
The sample names are `Ghost_Player`, `Dracula_Player`, `Doctor_Player`,
`Puppet_Player`, `Skeleton_Player`, `Zombie_Player`, `Pumpkin_Player`, `Voodoo_Player`.
They are test data, not names fetched from a multiplayer room.

The developer turn has nine cartridges. The normal constructor still grants two.
Destroyed targets and overlapping shots are rejected by the same turn controller;
the gun returns to its original tabletop transform after the last cartridge.

Character states are `HIDDEN → REACTING → REVEALED`. Reaction lasts 0.3 seconds,
then the character returns to its original position and subtle idle. **There is no
fade, despawn, timer-based hiding or automatic box reset.** Texture alpha stays at
full opacity. After the ninth shot all eight characters and nicknames remain,
with nine destroyed boxes, seven intact boxes and the final empty box still empty.
The completion overlay reports these totals. Only explicit reset/restart or exit
changes that final state.

## Original PNG registry

`CursedCharacterType` is the one-to-one registry; `CursedBoxesAssets.loadCharacter`
loads and validates all eight during staged loading, before gameplay. The seven
new runtime files are byte-identical copies of the root originals. The existing
Ghost runtime PNG is pixel-identical to `ghost3.png` (PNG compression differs).

| Identity | Original | Runtime path, relative to assets | Internal alpha hole |
|---|---|---|---|
| GHOST | ghost3.png | cursed_boxes/ghost_damaged.png | torso, 30,053 pixels |
| DRACULA | drakula-shot.png | cursed_boxes/characters/drakula-shot.png | torso, 30,489 |
| PLAGUE_DOCTOR | doktor_shot.png | cursed_boxes/characters/doktor_shot.png | torso, 33,284 |
| PUPPETEER | pupeetee_shot.png | cursed_boxes/characters/pupeetee_shot.png | torso, 31,602 |
| SKELETON | skeleton_shot.png | cursed_boxes/characters/skeleton_shot.png | torso, 41,957 |
| ZOMBIE | zombie_shot.png | cursed_boxes/characters/zombie_shot.png | torso, 27,461 |
| PUMPKIN | pumpkin_dead.png | cursed_boxes/characters/pumpkin_dead.png | torso, 21,611 |
| VOODOO | voddoo_shoot.png | cursed_boxes/characters/voddoo_shoot.png | head, 34,197 |

There are no missing or invalid character assets. Flood fill checks genuinely
transparent connected components that do not touch the image border, within the
character's torso/head region. Exterior silhouette transparency alone cannot pass.
Alpha ≤4/255 is considered transparent; an enclosed opening must occupy at least
0.5% of the image. Opaque and exterior-only test images are explicitly rejected.
Missing/undecodable/invalid assets produce diagnostics naming identity and path.

## Rendering, fitting and assignment

One shared `CursedCharacterController` prepares all slot/identity decals once;
switching does not allocate textures, model instances or meshes. Full original UVs
and aspect ratio are retained. `CursedCharacterFit` limits the rotated/breathing
silhouette, bob and per-character offset to the compartment clearance. Optional
scale/vertical-offset profiles live beside each enum entry.

Hidden occupants are not submitted behind closed fronts. Revealed/inspection
sprites use the existing depth-tested transparent decal pass with depth writes
disabled. Original transparent pixels therefore reveal the actual scene behind
them. No holes, background fills, new frames or damage artwork are generated.

The normal deterministic scenario retains the existing single occupied slot
(`scene.json.ghostSlot`, default 5) and fifteen empty boxes. `characterSeed` selects
identity modulo eight, leaving occupancy/outcomes unchanged. Default seed 0 keeps
Ghost. The developer layout uses its own seeded shuffle: eight identities, one
empty target and seven untouched boxes, with a different distribution on reset.
No networking, questions, scoring, lobby or other mini-games were changed.

## Performance changes

The former QA runner synchronously encoded large 2940×1664 PNGs on the render
thread; a measured encode took about **1.5 seconds**. Interactive mode has no
captures, GL audit or GPU fences. QA captures are now opt-in, with PNG compression
and writes handled by one bounded background worker (fast compression: measured
246–311 ms off-thread, versus about 1,500 ms previously). GPU readback remains on the
GL thread only for explicitly requested diagnostic captures; it is not used in
interactive playback.

The source wood meshes exported `doubleSided=true` despite being closed,
outward-wound volumes. At 50,000 triangles per crate, redundant back-face PBR
shading was expensive. Loading now enables back-face culling for these four shared
wood resources, without changing source files, geometry, material textures or
particle counts. Topology inspection found no boundary/non-manifold edges after
position welding at 1e-5, and positive volume for every connected component:

| Resource | Triangles | Closed components |
|---|---:|---:|
| intact.glb | 50,000 | 1 |
| destroyed.glb | 49,980 | 2 |
| splinter_a.glb | 47,136 | 26 |
| splinter_b.glb | 49,904 | 38 |

Character textures use loading-time mipmaps and trilinear minification. Hidden
occupants are culled; visible characters stay at full original resolution. All
models, textures and shader variants are warmed before input. Existing debris
pools and full-quality counts (four large fragments, seven small, two dust) remain.

Before/after serialized GPU-completion diagnostic, Apple M4, 2940×1664, 2,260
frames including all nine shots and the completed eight-character scene:

| Frame measurement | Before | After |
|---|---:|---:|
| Median CPU + GPU completion | 11.47 ms | 6.58 ms |
| 95th percentile | 15.12 ms | 13.75 ms |
| 99th percentile | 20.16 ms | 14.94 ms |
| Maximum | 31.75 ms | 17.95 ms |

These are diagnostics using `glFinish`, not a guaranteed FPS or a measurement of
presentation/vsync. Snapshot I/O, loading and presentation are excluded. Reports:
`generated/cursed-boxes/characters/before-performance.json` and `profile.json`.

## Validation commands

```sh
./gradlew :core:check :lwjgl3:assemble
# Same real scene/pipeline; validates nine shots, persistent reveals, reset and GL resources:
./gradlew :lwjgl3:cursedBoxesCharacters -PcursedCharacterQA=true
# Real delta/vsync frame pacing, without glFinish or PNG captures:
./gradlew :lwjgl3:cursedBoxesCharacters -PcursedCharacterQA=true -PcursedCharacterPaced=true -PcursedCharacterProfile=generated/cursed-boxes/characters/presentation-profile.json
# Optional diagnostic images, compressed/written off the render thread:
./gradlew :lwjgl3:cursedBoxesCharacters -PcursedCharacterQA=true -PcursedCharacterCaptures=true -PcursedCharacterProfile=generated/cursed-boxes/characters/capture-profile.json
./gradlew :lwjgl3:cursedBoxesPerformanceCheck -PcursedCycles=20 -PcursedProfile=generated/cursed-boxes/characters/normal-20-cycles.json
./gradlew :lwjgl3:cursedBoxes -PcursedQA=true -PcursedOutput=generated/cursed-boxes/characters/normal-regression
./gradlew :lwjgl3:cursedBoxesNavigationCheck
```

The native character check verifies eight simultaneous identities/nicknames,
initial hidden state, unique targets, exactly nine real shots, persistent prior
reveals, nine destroyed/seven intact, unchanged empty compartment, return to table,
tenth-shot rejection, 128 selections without resource growth, no gameplay shader
compiles/texture uploads/static mesh uploads, and correct explicit reset. It also
waits six seconds after completion to check persistence again. The normal two-shot
rules are tested separately.

## Build and test results

Passed `:core:check` (including every existing core check), `:lwjgl3:assemble`,
the native nine-shot character check, the normal two-shot/F3/F11/OpenGL check and
menu/cancel/reentry navigation check. Normal shader/model resources remain shared.
No required character PNG is missing or invalid. All eight native impact images
and the final completed scene were rendered and visually inspected after the
back-face/mipmap changes; the original holes and wood interiors remain visible.
The optional capture run also passed, including worker completion and disposal.

The real-delta presentation check used no captures or GPU fence. On Apple M4 at
2940×1664, after excluding the first ten startup intervals, 2,247 measured intervals
averaged **60.00 FPS**: median 16.667 ms, p95 16.709 ms, p99 17.414 ms, maximum
26.618 ms. There were four intervals above 25 ms and none above 50 ms. All nine
shots and eight persistent characters completed successfully. This is a measured
run on this machine, not a guarantee for other hardware.

The separate normal-game stress test passed 20 reset cycles / 40 shots / 6,000
frames: median serialized CPU+GPU time 6.18 ms, p95 7.23 ms, p99 9.30 ms, maximum
13.33 ms; zero GC collections during sampling, heap 136.93–137.93 MiB, eight loaded
models and twenty managed textures unchanged throughout. Both character and normal
checks observed zero gameplay shader compiles, texture uploads or static-buffer
uploads. The diagnostic sample recorder itself allocates sample records; it is
not installed in interactive gameplay.

Reports are in `generated/cursed-boxes/characters/presentation-profile.json` and
`normal-20-cycles.json`. The native character check explicitly waits six seconds
after completion before verifying that all eight are still revealed, with nine
destroyed/seven intact and an empty ninth target; an explicit R then verifies a
fresh hidden distribution and cleared effects.

## File manifest

Created Java files (core package `com.erni.finalanswer.cursedboxes`):
`CursedCharacterType`, `CursedCharacterImage`, `CursedCharacterFit`,
`CursedCharacterAssignment`, `CursedCharacterController`, `CursedCharacterTestLayout`,
`CursedCharacterTestMode`; test `CursedCharactersCheck`; development launcher
`lwjgl3/.../CursedBoxesCharactersLauncher`.

Modified Java files: `CursedBoxesAssets`, `CrateSlot`, `CursedBoxesConfig`,
`CursedBoxesScreen`, `CursedBoxesRenderer`, `CursedBoxesLoadingScreen`,
`CursedBoxesTurn`; the development-only `CursedBoxesPerformanceCheck` exposes its
existing GL audit for reuse. The old single-identity `GhostController` was replaced
by the shared controller. Modified configuration: `core/build.gradle`,
`lwjgl3/build.gradle`, `assets/cursed_boxes/scene.json`. Added the seven original
PNG copies listed above and this document.

## Technical limits

The optional P inspection hides the occupied intact crate instances, because its
front/back are one merged primitive; it never edits the mesh. Normal and automatic
playback keep intact fronts visible. The existing shelf is still the project's
authored textured geometry; no new shelf model was generated. Source GLB uploads
remain staged synchronous loading operations and can take about 0.2 seconds each;
they occur before gameplay. No FPS guarantee is made for unprofiled hardware.
