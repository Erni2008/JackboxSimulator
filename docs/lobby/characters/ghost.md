# Ghost character

The ghost uses the existing `CageCharacter` factory and `CageLobby` roster adapter. Skeleton rendering, cage assignments and game screens retain their existing architecture. No new WebSocket message types are introduced.

## Files

Created:

- `core/.../ui/lobby/cages/GhostAssets.java`: four shared textures, original-alpha bounds, eye regions, explicit disposal.
- `core/.../ui/lobby/cages/GhostAnimator.java`: graphics-independent procedural state machine.
- `core/.../ui/lobby/cages/GhostCharacter.java`: parent transforms, individual shoulder pivots, cloth quads, localized eye glow and instance particles.
- `core/.../test/.../lobby/GhostCheck.java`: timing, frame-rate comparison, bounds, interrupted transitions, death and recovery checks.
- `lwjgl3/src/dev/.../GhostStudioLauncher.java`: large inspection view with eight independent instances, different sizes and mirrored poses; excluded from release packaging.
- `assets/lobby/characters/ghost/ghost_{body,left_arm,right_arm,tail}.png`: byte-identical copies of the supplied root files `ghost1.png` through `ghost4.png`, respectively.

Modified:

- `CageLobby.java`: lazily loads one shared `GhostAssets`, registers `ghost`, disposes shared resources with the lobby.
- `HangingCage.java`: exposes its current character for development controls.
- `RoomApiClient.java`, `LobbyPanel.java`: optional character choice in the existing join request; old Java join signature remains supported.
- Server `RoomService.java`: accepts optional `characterId=skeleton|ghost`, rejects unsupported IDs before allocating a seat. Older clients retain the original guest IDs and skeleton fallback.
- `RoomServiceTest.java`: selection, invalid selection atomicity and reconnect coverage.
- `web/index.html`, `web/app.js`, `web/controller-theme.css`: Skeleton/Ghost choice in the controller join form.
- `CagePreviewLauncher.java`, `core/build.gradle`, `lwjgl3/build.gradle`: explicit development and verification tasks.

## Asset assembly

Original dimensions are body 1362×1155, left/right arms 1386×1135, tail 1854×848. Bounds are measured once using every pixel with nonzero alpha, with a six-pixel margin. No PNG pixels or alpha channels are modified. There are no missing assets.

Source-coordinate pivots (pixels measured from the original image's top-left), calibrated against the supplied artwork:

| Part | Pivot | Local attachment | Uniform art scale |
| --- | --- | --- | --- |
| Body | 690,700 | 0,0 | .095 |
| Left arm | 950,300 | -30,3 | .045 |
| Right arm | 400,300 | 30,0 | .045 |
| Tail | 400,80 | -25,-26 | .048 |

Render order is tail → arms → body → eye illumination → death wisps. Body fabric overlaps the shoulder and tail attachment regions. Arm rotation uses shoulder pivots; the tail has a fixed top attachment. The root inherits position, mirror, scale, sway and breathing; all child parts follow it. The default cage anchor is local `(174,151)`, entirely behind the existing gate and clipped to the cage opening.

The tail uses eight textured quads through the existing Batch, with stable UVs and gradually increasing rotation and lateral deformation below its upper 22%. The upper attachment retains its fixed authored orientation. No custom shader or physics dependency is required. The maximum cloth wave is 1.5 design units.

Only two source-eye crops use additive blending. Original body rendering uses ordinary alpha blending. Blend functions, transform and color are restored afterward. Death wisps reuse the original transparent tail and eye regions; they allocate no textures or particle objects.

## Animation and tuning

`GhostAnimator` is driven by delta time and stores one mutable pose per instance:

- **IDLE:** slow vertical float (~1–2% of displayed height), small sideways drift, asynchronous shoulder movement, subtle cloth sway and breathing, white eye pulse with a broad, occasional stronger crest.
- **SCARED:** .95 seconds, upward recoil, raised arms, slight contraction and brighter eyes; returns to idle. Available only through explicit development controls; the lobby never triggers it automatically.
- **HIT:** .65 seconds, short lateral recoil and body rotation, eye highlight and smooth recovery.
- **DEATH:** 2.7 seconds, .24-second movement freeze, eye intensification, gradual arm separation, body/tail fade, drifting fabric wisps, delayed eye fade and complete disappearance. Shared textures remain intact.

Transitions blend from the current pose over .16 seconds. Trigger with `ghost.setState(GhostAnimator.State.HIT)` (or another state). Death remains finished until explicitly changed or the instance is replaced.

`FLOAT_SPEED`, `FLOAT_AMPLITUDE`, `SCARED_SECONDS`, `HIT_SECONDS`, `DEATH_SECONDS` in `GhostAnimator` control the primary timings. Other frequencies/amplitudes are grouped in `idle()`; shoulder attachment geometry is in `GhostCharacter.drawAt()`. `drawAt(batch,x,y,size,flip,alpha)` supports other screens and sizes. Every offset and wave scales with the character. Reduced motion lowers continuous movement to 35%.

For use outside cages call `advance(delta,phase,reducedMotion)` followed by `drawAt`. Cage integration adapts its existing absolute timeline to delta time. Each join creates a new instance; leaving drops the instance without disposing shared textures. Different slot phases and a phase-derived ±2.5% motion rate prevent synchronized motion.

## Try it

In the real join form choose **Ghost** before joining. The native join dialog cycles **CHARACTER: SKELETON/GHOST** when clicked. The existing room snapshot and reconnect preserve `characterId`.

```sh
./gradlew :lwjgl3:ghostPreview
./gradlew :lwjgl3:ghostStudio
```

Both previews support I idle, S scared, H hit, D death and R restart. Studio F toggles mirroring. Cage preview additionally supports 1/8 occupancy, L leave, J rejoin; its F key enables mirroring. Development controls are absent from production source sets.

Automated graphical capture:

```sh
./gradlew :lwjgl3:ghostPreview -PghostCheck=true
./gradlew :lwjgl3:ghostStudio -PghostStudioCheck=true
./gradlew :core:check :server:test :lwjgl3:devClasses
node --check web/app.js
```

Artifacts are under `generated/ghost-preview/`. Cage capture asserts continuous IDLE across eight simultaneous joins, gate closure, leaving mid-animation, rejoining, empty/single occupancy and 1600×900, 960×540 and 1024×768 windows. Studio capture exercises all four states, large/small instances and mirrors.

For the current pass, see the dated verification record below. Server/network selection code and controller JavaScript were not changed or retested in this pass.

## Limits

HIT and DEATH are reusable local animation entry points and development controls. The lobby has no authoritative damage/death events; this change does not invent gameplay or add synchronization messages for those events. Wire the existing entry points when such gameplay events are available.

The original painted fabric retains its baked lighting under mirroring. The tail deformation is a lightweight strip, not simulated cloth. Eye glow reuses the existing painted white eye halo rather than screen-space bloom. Shoulder overlap is calibrated for these four supplied assets; future art needs its own attachment calibration. Death separation/particles are deliberately confined by the cage's existing opening clip in lobby views. Eight-instance rendering was exercised on the current desktop; no target-hardware performance benchmark is claimed.

## Idle refinement verification (2026-10-20)

This pass modifies `GhostCharacter.java`, `GhostAnimator.java`, `GhostCheck.java`,
`CagePreviewLauncher.java`, and this document. The existing asset loader, selection,
shared texture lifecycle, skeleton renderer, cage layout, and lobby factory are reused.
No source PNGs are changed. Existing explicit HIT/DEATH development APIs are retained;
no gameplay animations or events are added by this pass.

The lobby no longer automatically changes the ghost to SCARED when its gate closes.
The tail's top 22% is now fixed for both rotation and translation; the hem receives
phase-delayed rotation and a small continuous wave. Eyes retain their original white
base and get localized additive illumination, bounded between .9 and 1.28 intensity
before the existing .27 overlay opacity. Other body pixels use ordinary alpha blending.

Tune `FLOAT_AMPLITUDE` (design units) and `FLOAT_SPEED` (radians/second) in
`GhostAnimator`; adjust shoulder frequencies/angles and eye pulse in `idle()`.
Tune the tail wave amplitude (1.5 units), frequency (1.7), and pinned fraction (.22)
in `GhostCharacter.drawTail()`. Root scale multiplies all movement with the character.

Validation: `:core:check` and `:lwjgl3:devClasses` passed. The actual OpenGL lobby
preview ran with eight ghosts and continuous-IDLE assertions, all slot positions,
leave/rejoin, empty/single occupancy, and three window sizes. This uses synthetic room
snapshots through the real lobby roster adapter, rather than eight network clients.
Screenshots are saved to `generated/ghost-preview/stage-*.png`.

## Lobby presentation size refinement

Ghost lobby presentation is now uniformly enlarged by 6%. The lobby-only shoulder attachment inset is 4 design units per side, increasing overlap to preserve clearance for the claw sweep. The floating anchor stays (174,151); standalone studio geometry is unchanged.

Tune `LOBBY_SCALE` in the corresponding character class. Sizes were calibrated against the existing cage opening and inspected in eight-slot graphical previews with resizing and leave/rejoin checks. Skeleton size and the lobby layout are unchanged.
