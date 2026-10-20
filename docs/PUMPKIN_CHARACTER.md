# Pumpkin Head lobby character

Implemented through the existing `CageCharacter` contract, `CageLobby` factories, stable player IDs, cage clipping and shared Batch. Existing Skeleton, Ghost, Zombie and Dracula animations, lobby art, layout, names and buttons are unchanged. Pumpkin is selectable as `characterId=pumpkin` in the existing controller join form and native character selector. The server validates it and includes it in the existing room snapshot; no new message types.

## Assets inspected and imported

All nine source files were inspected visually and copied byte-for-byte from `/Users/erni/Desktop/all icons/clock/backgrounds/impostor/playerFov(1minigame)/` into `assets/lobby/characters/pumpkin/`. Original PNGs and transparency are not overwritten.

| Actual filename | Dimensions | Content and use |
| --- | --- | --- |
| `pumpkin.png` | 985×1597 | Complete character reference, **not a glow mask**. Only the main wooden stem silhouette is isolated at load time. |
| `pumpkin1.png` | 1426×1103 | Oversized head without stem; contains painted facial illumination. Head and localized facial-light textures derive from this same source. |
| `pumpkin2.png` | 1230×1278 | Torso **with its own painted collar/scarf**. Kept intact to preserve shoulder silhouette. |
| `pumpkin3.png` | 1327×1185 | Screen-left arm, shoulder pivot 1100,150. |
| `pumpkin4.png` | 1331×1182 | Screen-right arm, shoulder pivot 220,150. |
| `pumpkin5.png` | 1328×1184 | Screen-left leg/foot; original image includes soft baked surrounding light. |
| `pumpkin6.png` | 1350×1165 | Screen-right leg/foot. |
| `pumpkin7.png` | 1548×1016 | Separate scarf. **Not rendered or loaded**, following the user's correction to remove the ill-fitting overlay. |
| `pumpkin8` | 1392×1130 | PNG without an extension; additional hood/fabric, **not a facial glow mask or a stem**. Not rendered or loaded. |

There is no standalone stem or isolated face mask among the supplied files. The implementation extracts the curved main stem from the reference and derives separate eye/mouth masks from the actual head. No full-character image is drawn over the rig. No new external image files are generated.

## Assembly

`PumpkinCharacter` uses reusable parent matrices root → torso → head → stem/facial light. Arms are children of the torso and rotate about shoulders. Every draw restores the incoming Batch transform, color and separate RGB/alpha blend functions. Image parts use uniform scale and source-pixel attachment coordinates rather than assuming equal PNG dimensions.

Default cage placement is `(174,68)`, scale 1, using the existing viewport and opening clip. Hip height is 36 design units. Torso origin is source `(630,1100)` at scale .052. Head neck pivot is `(720,1010)` at scale .05, local `(0,40)` in torso space. Its large original proportions are preserved. Stem pivot is `(465,295)` in the reference, at local `(-1,45.5)` on the head. Wood overlaps the head crown slightly.

Legs reuse the existing `TwoBonePose` solver. Each original leg supplies overlapping upper-leg, shin and foot regions. Ankles stay fixed at `(-15,8)` and `(15,8)` while hip breathing bends the knees; feet keep their authored angle and soles remain grounded. Legs draw first, then arms, torso, head, stem and facial light. The original torso collar connects to the head without an extra fabric layer.

**Scarf correction:** the separate scarf overlay and its mesh animation were removed. The small original collar already painted on the torso remains and follows the torso. It has no separate idle deformation. This deliberately supersedes the initial nine-part scarf requirement according to the user's later instruction.

## Appearance and idle

Each new `PumpkinCharacter` owns a new `PumpkinAnimator`, seeded random scheduler, timer and pose. The delta overload of the existing character interface keeps its entrance independent of the cage's older timeline. Repeated room snapshots retain the same instance; character selection changes or rejoining create a new one.

`PUMPKIN_APPEAR` lasts 3.5 seconds:

1. 0–.5: orange rising embers and dark soft smoke, invisible body.
2. .5–1: materialization with lowered head, bowed torso and bent legs.
3. 1–1.5: eyes ignite; mouth follows after a short delay.
4. 1.5–2: fast controlled head lift, small overshoot, outward arms, stem reaction and ember burst.
5. 2–2.5: suspicious head tilt and one raised arm.
6. 2.5–3: short theatrical scare, slight forward lean and at most 2.5% head scale change.
7. 3–3.5: smooth return to the continuing idle pose.

`PUMPKIN_IDLE` continues with torso breathing, grounded weight shifts, slow head sway, asynchronous shoulders, stem movement and warm flame flicker. One seeded random gesture starts every 6–12 seconds; duration is 1.8–2.6 seconds, including a smooth return. Choices include tilt, quick curiosity turn with stem settling, arm raise, small scare, glow pulse, stem flutter and posture adjustment. Random numbers are sampled only at event boundaries. Different seeds and cage phases prevent synchronization. Reduced motion lowers movement to 30%.

Facial glow uses polygon- and luminance-restricted eye/mouth masks made once from `pumpkin1.png`. Only those openings receive additive light. A runtime copy of the head dims the already-painted light underneath so ignition is visible; source files and their alpha are untouched. Smooth multi-frequency flicker replaces per-frame randomness. Alpha is clamped to avoid packed-color overflow during flashes. A single shared 32×32 radial runtime texture supplies soft smoke and embers; it is never used as a substitute for a missing character part.

## Files

Created:

- `core/src/main/java/com/erni/finalanswer/ui/lobby/cages/PumpkinAssets.java`
- `core/src/main/java/com/erni/finalanswer/ui/lobby/cages/PumpkinAnimationState.java`
- `core/src/main/java/com/erni/finalanswer/ui/lobby/cages/PumpkinAnimator.java`
- `core/src/main/java/com/erni/finalanswer/ui/lobby/cages/PumpkinCharacter.java`
- `core/src/test/java/com/erni/finalanswer/lobby/PumpkinCheck.java`
- `lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/PumpkinStudioLauncher.java`
- `lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/PumpkinLobbyCheck.java`
- Nine unchanged source copies in `assets/lobby/characters/pumpkin/`.

Modified: `CageLobby.java` (lazy shared resources/factory/disposal), `LobbyPanel.java` and `web/index.html` (selection), server `RoomService.java` and `RoomServiceTest.java` (validation/reconnect test), `core/build.gradle` and `lwjgl3/build.gradle` (checks and development launchers). No existing character renderer/animator was modified.

## Tuning and testing

`PumpkinAnimator` exposes `APPEAR_SECONDS`, `GESTURE_MIN/MAX`, `BREATH_SPEED`, `HEAD_SWAY`; `appear()` groups the seven phase envelopes and `update()` groups idle motion amplitudes. If changing overall entrance duration, adjust its phase boundaries together. `PumpkinCharacter` exposes `HEAD_SCALE`, `BODY_SCALE`, `STEM_SCALE`; its source-pixel pivots and cage anchor are in `drawPose()`. `PumpkinAssets` holds the stem and facial extraction contours. Use `advance(delta,phase,reducedMotion)` plus `drawAt(batch,x,floor,size,alpha)` for other previews/screens.

```sh
./gradlew :lwjgl3:pumpkinPreview
./gradlew :lwjgl3:pumpkinStudio
./gradlew :lwjgl3:pumpkinStudio -PpumpkinStudioCheck=true
./gradlew :lwjgl3:pumpkinLobbyCheck
./gradlew :core:check :server:test :lwjgl3:devClasses
```

Studio: R restarts appearance, N toggles neutral assembly, Escape closes. Cage preview uses the existing R/1/8/L/J controls. All development classes remain outside release source sets. Captures are saved under `generated/pumpkin-preview/`.

Verified: compilation, all core executable checks including existing characters, 115 server tests with zero failures, JavaScript syntax, real eight-instance lobby rendering, one-shot entrance, roster refresh without restart, mid-lobby character change, removed instances stopping updates, rejoin, empty/single room, 1600×900 / 960×540 / 1024×768 windows, and mixed Skeleton/Ghost/Zombie/Dracula/Pumpkin rendering. GL checks assert no rendering errors. Long-running graphics-free tests cover delta equivalence, gesture intervals/independence, bounded flame, appearance/idle continuity and fixed ankle targets. Original art copies are verified byte-for-byte.

Resources are created once per lobby on first Pumpkin use and shared by every instance. Animation updates and drawing allocate no per-frame textures, regions, matrices or particle objects. The lobby disposes all shared native textures. Eight instances were exercised on this desktop; a hardware-independent 60 FPS guarantee is not claimed.

## Remaining limitations

The supplied art has baked lighting and glow. Only the bright face interiors can be procedurally dimmed/relit; painted orange edge reflections remain. The extracted main stem omits decorative reference tendrils. Attachments and masks are calibrated to these particular source images and would need recalibration for replacement artwork. The separately supplied scarf and hood are intentionally unused; the original collar is part of the torso texture.
