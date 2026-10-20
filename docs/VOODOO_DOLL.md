# VOODOO DOLL — implementation and verification

The doll is integrated into the existing Final Answer cage lobby, through `CageCharacter`, `CageLobby` factories and stable player-to-cage assignments. There is no new screen design, networking protocol, physics engine or character framework. The existing Batch, viewport, resource lifetime and development source-set patterns are reused.

## Source images and remaining art work

All twelve original root files `vudu1.png`–`vudu12.png` were inspected visually and copied byte-for-byte into `assets/lobby/characters/voodoo/`. Every file is RGBA, has nonzero visible pixels and genuinely transparent pixels. The machine-readable alpha counts, bounds and SHA-256 hashes are in `generated/voodoo-preview/asset-validation.json`. Runtime loading rejects missing images or images lacking transparent pixels; it never performs background color-key removal.

| File | Dimensions | Role |
| --- | --- | --- |
| vudu1.png | 1295×1215 | Head with seams, smile and empty eye patches |
| vudu2.png | 1295×1215 | Red button, screen-left |
| vudu3.png | 1295×1215 | Black button, screen-right |
| vudu4.png | 1295×1215 | One needle reused for four independent instances |
| vudu5.png | 1024×1536 | Torso, **already containing a red heart** |
| vudu6.png | 1254×1254 | Separate heart, intentionally not overlaid on the current torso |
| vudu7.png | 1536×1024 | Screen-right arm |
| vudu8.png | 1536×1024 | Screen-left arm |
| vudu9.png | 1536×1024 | Screen-left leg |
| vudu10.png | 1536×1024 | Screen-right leg |
| vudu11.png | 1536×1024 | Decorative thread sheet, cropped with configured regions |
| vudu12.png | 1536×1024 | Stuffing/fabric sheet, cropped with configured regions |

**Heart conflict:** the supplied torso has an embedded heart. Default `embeddedHeart=true` skips the separate-heart sprite entirely. A localized body mesh gently expands the existing stitched heart area, without duplicating the heart or covering it with a rectangle. A restricted emission mask samples the existing red patch only for the requested elimination glow. For a genuinely independent sewn-on heart, manually export a clean heart-free torso with unchanged dimensions/registration, then set `embeddedHeart=false`; the existing separate-heart node supports scale pulses and glow.

**Background quality:** vudu5 and vudu7–vudu12 include painted, partially transparent brown haze around their content. They do have real transparency, but their art is not a fully clean cutout. No masking trick is applied to hide this. For final art polish, re-export those files with clean transparent surroundings. The thread/stuffing sheets are loose arrangements rather than padded production atlases; configurable rectangular regions are used, and some edge scraps may need better isolation/padding in the source export. PNGs and their source alpha are not overwritten by this implementation. No replacement art was generated.

## Files created

- `core/src/main/java/com/erni/finalanswer/ui/lobby/cages/VoodooConfig.java`
- `core/src/main/java/com/erni/finalanswer/ui/lobby/cages/VoodooAssets.java`
- `core/src/main/java/com/erni/finalanswer/ui/lobby/cages/VoodooAnimationController.java`
- `core/src/main/java/com/erni/finalanswer/ui/lobby/cages/VoodooCharacter.java`
- `core/src/main/java/com/erni/finalanswer/ui/lobby/cages/VoodooRoomEvents.java`
- `core/src/test/java/com/erni/finalanswer/lobby/VoodooCheck.java`
- `lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/VoodooStudioLauncher.java`
- `lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/VoodooLobbyCheck.java`
- `assets/lobby/characters/voodoo/voodoo_config.json` and twelve unchanged PNG copies.
- This document and graphical/alpha validation artifacts under `generated/voodoo-preview/`.

## Files modified

- `CageLobby.java`: lazy shared assets/config, doll factory, event adapter and disposal.
- `FinalAnswerGame.java`: forwards existing accepted room snapshots to the cage animation adapter, including while the cached lobby is hidden.
- `LobbyPanel.java`, `web/index.html`: Voodoo option in existing character selectors.
- Server `RoomService.java`: allows `characterId=voodoo` in the existing join request.
- Server `RoomServiceTest.java`: selection and reconnect regression.
- `core/build.gradle`, `lwjgl3/build.gradle`: CPU, studio and lobby verification tasks.

Existing Skeleton, Ghost, Zombie, Dracula, Pumpkin Head and Plague Doctor renderers/animators, cage artwork/layout, room background, names and controls are unchanged by the Voodoo integration.

## Rig and configuration

`voodoo_config.json` contains every sprite's source, optional atlas rectangle, parent, local X/Y, source-pixel pivot, uniform source-art scale, local rotation, local X/Y scale, alpha, visibility and draw order. Parent relationships are validated against missing names and cycles. It also contains lobby size/anchor, atlas rectangles, embedded-heart deformation geometry, idle periods/amplitudes, gesture intervals, blend time and state durations.

The body is the parent for short limbs and the large head. The head owns both buttons and all four needles. Limb roots overlap behind the torso; eyes/needles draw over the head. Needle pivots are near their points of entry, not the image center. Threads have separate attachments and motion phases. Parent matrices propagate rotation and scale to every child. Each instance owns its mutable part transforms, matrices and animation pose; only textures and read-only configuration are shared in production.

Editing a part's `scaleX` and `scaleY` uniformly also scales its children. `artScale` controls the individual source image size; attachment coordinates are independently configurable when calibrating new artwork. Changing `order` or atlas regions is applied when constructing/reloading the rig. Every draw restores incoming Batch color, transform and separate RGB/alpha blend functions, including after the localized glow passes.

## States

- **IDLE:** independent 3.5-second breathing, 4-second torso sway, delayed 4.5-second head motion, asynchronous shoulders and threads. Seeded gestures occur every 6–12 seconds and avoid consecutive repetitions: head twitch, shoulder reaction, a random subset of briefly vibrating needles, a frozen pose or suspicious tilt. Motions blend back naturally.
- **SELECTED, 2.5 seconds:** .3-second freeze, controlled head lift, red-button illumination, brief four-needle reaction, exactly three heart pulses over .4 seconds and smooth return to IDLE. Only a new assignment/selection creates a fresh instance; roster refreshes retain it.
- **VICTORY, 2.8 seconds:** straightening, raised arms, brighter red button, heart/needle reaction and two small eased hops, then IDLE.
- **DEFEAT, 3 seconds:** lowered head, relaxed shoulders/arms, two slower heart pulses and a short still pause, then IDLE. It never triggers death.
- **DEATH / BROKEN DOLL, 5 seconds:** staged tension, needle extraction, button tearing, stuffing release, loss of balance and final inert collapse.
- **ELIMINATION / CURSED DISAPPEARANCE, 3.5 seconds:** freeze, lift, disordered limb reaction, face/heart illumination and dark smoke, shrinking first to .65 and then zero. It stays invisible.

Ordinary blends last .2 seconds. Both terminal states can interrupt ordinary states and remain terminal; an explicit IDLE/SELECTED reset is required before replaying a terminal animation. They do not automatically revive or transition to each other. Configured durations scale the complete authored timeline, including detachable-part/particle timing.

### Refined death choreography

0–.8 seconds: growing pressure, restrained high-frequency cloth/head tension and accelerating heartbeat. Four needles release from .8 seconds in a seeded shuffled order with .2-second spacing. Their initial velocities follow the actual transformed shafts; each extraction produces a short damped recoil.

At 1.95 and 2.15 seconds the red and black buttons tear away after a small local shake. They fall under analytic gravity, spin, make one restrained floor bounce and settle with friction. They remain as part of the broken-doll scene.

At 2.5 seconds the chest begins to sag. The hands detach at 2.8/3.05 seconds and drop with low lateral velocity rather than being thrown sideways. Twenty-four pooled thread/stuffing particles leave in a staggered burst. The body progressively loses height before the main fall at 3.8–4.55 seconds; the heavy head follows a fraction later. A small decaying impact and thread response settle by five seconds. The final pose and detached parts stop moving completely. Source images provide all fabric particles.

Detached parts capture their current parent-transformed attachment. Positions are analytic trajectories with gravity, rather than frame-dependent Euler integration. Small bounded update steps sample release boundaries consistently. No rigid-body engine is used.

## Real multiplayer events and scope limits

Selection uses the existing `characterId` field. The normal room snapshot/reconnect preserves it; the eight cage assignments remain stable.

`VoodooRoomEvents` maps the existing quiz `results[].isCorrect` to VICTORY/DEFEAT and the existing Impostor `result.participants[].winner` likewise. Snapshot game/question/match IDs provide deduplication keys and deterministic seeds. Existing server start/completion timestamps provide elapsed age; receiving/reconnecting clients seek forward instead of restarting a result animation. Instance-level bounded deduplication prevents repeated snapshots from replaying an outcome. When the cached lobby is hidden, the state is caught up on its next update. These animations are rendered where the existing cage lobby is visible; other gameplay screens are not redesigned to show cages.

The existing `players[].isAlive=false` field is recognized as a terminal death signal. **Current server gameplay never changes that field to false, and has no authoritative death or elimination event.** Therefore DEATH and ELIMINATION are fully implemented/testable animations, but a real server-triggered death/elimination was not available to validate. Elimination is deliberately not inferred from a voluntary leave or a preliminary vote. Future gameplay can call the existing adapter entry point:

```java
cages.playVoodoo(playerId, VoodooAnimationController.State.ELIMINATION,
    stableEventId, seed, elapsedSeconds);
```

No new wire messages or per-frame synchronization were added. For live terminal events, gameplay must supply authoritative event identity/start time; that remains a game-rule integration task rather than an invented networking protocol.

## Debugging and testing

Select **Voodoo Doll** in the controller's existing join form or native character cycle.

```sh
./gradlew :lwjgl3:voodooPreview
./gradlew :lwjgl3:voodooStudio
```

Studio controls:

| Key | Action |
| --- | --- |
| I | IDLE; also explicitly resets a terminal state |
| S | SELECTED |
| V | VICTORY |
| L | DEFEAT |
| D | DEATH; from a terminal state use I first, or R to reload |
| E | ELIMINATION; from a terminal state use I first |
| Space | Pause/resume animation |
| P / B | Pivot crosses / sprite bounds |
| Tab | Select next rig part |
| Arrows | Move selected attachment; Shift uses a larger increment |
| + / − | Uniformly scale selected part and its children |
| [ / ] | Rotate selected part |
| Ctrl+S | Save geometry into the original voodoo_config.json |
| R | Reload config and assets, recreate dolls |

The studio uses the same production renderer, with one large rig and seven smaller instances. All tools/controls are in the development source set, excluded from production packaging. Ordinary players see none of them.

```sh
./gradlew :core:check :server:test :lwjgl3:devClasses
./gradlew :lwjgl3:voodooLobbyCheck
./gradlew :lwjgl3:voodooStudio -PvoodooStudioCheck=true
```

CPU checks cover JSON round-trip, hierarchy, entry freeze, exactly three selection heart pulses, six states, smooth transition entry, 30/60 FPS equivalence, independent instances, seeded needle sequence, persistent terminal states and existing result mappings. GL checks cover eight dolls, selection once, roster refresh, duplicate result snapshots, mid-lobby selection, leaving/rejoining, resolution changes, empty/single rooms, mixed rendering with every existing character and Batch color/transform/blend restoration. Studio captures cover every state, and checks exercise live parent rotation/scaling and zero-delta pause. Interactive keyboard events are implemented; no separate automated keyboard-driving suite is claimed.

All core checks and 117 server tests passed with zero failures. The actual desktop studio and lobby ran without GL errors. The body-part hierarchy and death/elimination stages were visually inspected. Twelve original PNG copies were checked byte-for-byte. No target-hardware performance benchmark or real multi-client terminal event verification is claimed.

## Performance and cleanup

One shared owner loads twelve sprite textures and the small runtime masks/soft-smoke primitive on first use. Instances own no native resources. Character removal discards only instance state; lobby disposal releases shared native resources once. The particle pool contains 24 preallocated records, reused across plays. Rendering/updates create no new textures, regions, matrices, particle objects or random generators per frame. Every frame reuses the existing Batch and mesh vertex buffers. Decorative randomness is sampled only at event boundaries. No threads, sleeps, Blender or extra rendering dependencies are introduced.
