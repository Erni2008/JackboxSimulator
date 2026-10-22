# Dracula in the lobby

Dracula implements the existing `CageCharacter` interface and uses `CageLobby`'s
factory, `HangingCage`'s delta update, the existing Stage/Batch, clipping, eight stable
assignments, and FitViewport. Skeleton, Ghost, Zombie, cage dimensions, backgrounds,
nameplates, buttons, and lobby layout are unchanged. Dracula is added to the existing
native selector cycle and browser selector, and the server accepts `characterId=dracula`.

## Original artwork and assembly

All seven originals remain at the project root under their existing filenames.
`core:processResources` includes the unchanged bytes as classpath assets, just as the
zombie originals are packaged. There is no renaming, moving, regeneration, or pixel editing.

| Original | Component | Dimensions | Source pivot (top-left pixels) | Uniform scale |
| --- | --- | --- | --- | --- |
| drakula.png | Head | 1354×1161 | Neck 760,1045 | .057 |
| drakula2.png | Body | 1261×1247 | Hips 660,1050 | .047 |
| drakula3.png | Screen-left arm | 1015×1549 | Shoulder 220,360 | .033 |
| drakula7.png | Screen-right arm | 1050×1498 | Shoulder 890,360 | .033 |
| drakula6.png | Screen-left leg | 1024×1536 | Hip 735,120 | .0245 |
| drakula5.png | Screen-right leg | 1024×1536 | Hip 630,130 | .0245 |
| drakula8.png | Cape | 1322×1190 | Attachment 760,300 | .072 |

The root is cage-local (174,68), with hips 33 design units above the floor.
Body children attach at (-16,25), (16,25), and (0,40) for the two shoulders and neck.
The cape follows the same torso attachment motion at (0,34), behind the legs/body.
Pivots account for original dimensions and top-left source coordinates rather than
texture centers. The large head, small torso, thin arms, short legs and broad cape
retain their stylized proportions.

The torso owns the visible red-black collar and shoulder sockets. The cape uses only
source rows 300–1190, omitting its duplicate collar with a texture region. Arm socket
caps above source row 360 are likewise omitted. Sleeve rows 360–800 render behind the
body; forearms from row 800 down render in front, using exactly the same shoulder
pivot and rotation. These regions do not duplicate visible pixels. Head renders last.

Legs reuse the skeleton's `ArticulatedLimb` and `TwoBonePose`, with overlapping knee
regions and fixed boot targets at (-12,3) and (13,3) in root space. Slight hip movement
bends the legs; it does not move the boots. Source image contents are preserved.

## Three-second appearance

`DraculaAnimationState` has `DRACULA_APPEAR` and `DRACULA_IDLE`.
Each new occupant starts with its own `DraculaAnimator` and timer:

1. 0–.5s: lowered posture, bowed head, nearly invisible character and dark burgundy/gray smoke.
2. .5–1s: smooth alpha reveal and a small grounded rise; head stays lowered.
3. 1–1.5s: cape reveal expands from a narrow crop with feathered edges; arms open with a delay on the right.
4. 1.5–2s: head rises with a small eased overshoot as the torso straightens.
5. 2–2.5s: right-hand greeting with a restrained head tilt and bow.
6. 2.5–3s: entrance offsets ease to zero, joining the live idle pose without resetting motion time.

Quintic easing gives zero velocity and acceleration at the authored boundaries.
The cape crop finishes completely open; it is not simulated with extreme width scaling.
Nine soft smoke puffs use one shared 32×32 radial primitive made once with Pixmap.
Particle positions are analytic, rise slowly, fade smoothly, and finish before 1.9s.
No disk assets, per-frame textures, shaders, additive bloom, or facial deformation are needed.
Blinking is intentionally omitted because the source is a single painted head image.

## Cape and idle

The cape uses the same textured-quad Batch approach as the ghost's fabric: a 6×10 grid
with stable UVs and a reusable vertex array. The upper 20% stays pinned; displacement
increases quadratically toward the hem. Two slow waves, slight weighted rotation, and
occasional low-amplitude flutter move the fabric without excessive stretching.
There is only one cape draw pass and one cape texture. The collar is never duplicated.

Idle combines ±1.05° torso sway, .22-unit breathing, .2% uniform torso scale variation,
slow neck tilt, asynchronous arms, grounded weight shifts, and the flowing cape.
Each instance owns its Random, event timers, pose, and cloth array. Textures and the
smoke primitive are shared by the lobby. Slot phases slightly vary motion rate.

Head looks are sampled at 5–9 second intervals. Theatrical gestures are sampled at
6–12 second intervals and choose one head tilt, left-arm raise, right-hand greeting,
bow, or cape flutter. Each has eased attack, hold and recovery. The scheduler reserves
time for complete recovery; conflicting events may be deferred so they do not overlap.
No random values are sampled per frame. Event ordering is independent of frame rate.
Reduced motion lowers idle and cloth strength.

The existing roster adapter retains an instance for an unchanged player/character,
including fresh room snapshots and unrelated status updates. Selection changes create
a new instance with its own three-second entrance, independent of the cage's age.
Leaving drops the instance and stops updates. Rejoining creates a fresh appearance.
No new networking messages or gameplay animation states are introduced.

## Tuning

- `DraculaAnimator.APPEAR_SECONDS`: final entrance boundary (currently 3s).
- `BREATH_SPEED`, `BODY_SWAY`: breathing and torso motion.
- `GESTURE_MIN`, `GESTURE_MAX`: requested theatrical gesture spacing.
- `DraculaAnimator.appear()`: reveal timing, arm opening, head overshoot and bow.
- Idle calculations in `update()`: frequencies, angles, head-look timing and event envelopes.
- `DraculaCharacter.CAPE_SCALE`, `CAPE_WAVE`, grid constants and `drawCape()`: cape placement,
  flow strength, pinned fraction, reveal feathering and flutter.
- `DraculaCharacter` constructor and part draws: joint coordinates, display scales and overlap.
- `smoke()`: puff count, size, lifetime, opacity and colors.

There are no per-frame temporary objects or textures in character drawing. Caller
Batch begin/end ownership is preserved, and color/transform are restored. Blending
remains ordinary alpha blending throughout. `DraculaAssets` is loaded lazily once per
lobby and disposed by that lobby, including the procedural smoke texture.

## Files

Created:

- `core/.../ui/lobby/cages/DraculaCharacter.java`
- `core/.../ui/lobby/cages/DraculaAssets.java`
- `core/.../ui/lobby/cages/DraculaAnimator.java`
- `core/.../ui/lobby/cages/DraculaAnimationState.java`
- `core/.../test/.../lobby/DraculaCheck.java`
- `lwjgl3/src/dev/.../DraculaStudioLauncher.java`
- `lwjgl3/src/dev/.../DraculaLobbyCheck.java`
- `docs/lobby/characters/dracula.md`

Modified: `CageLobby.java`, `LobbyPanel.java`, `RoomService.java`, `RoomServiceTest.java`,
`web/index.html`, `core/build.gradle`, and `lwjgl3/build.gradle`.
The existing character implementations, `CageCharacter`, and `HangingCage` need no changes.

## Validation (2026-10-20)

Compilation, `:core:check`, `:lwjgl3:devClasses`, and all 114 server tests passed with
zero server failures/errors. Core checks cover 30/60 FPS agreement through scheduled
events, appearance/idle continuity, bounded neck motion, opacity/cape reveal bounds,
eight independent schedules, invalid delta handling, and reachable, stationary boot targets.

Actual desktop OpenGL studio captures cover neutral assembly and all six entrance
phases, idle, and multiple sizes. The real lobby fixture tests eight Draculas, one-shot
appearance, fresh snapshots preserving instances, selection changes in an old cage,
unaffected neighbors, removal stopping updates, rejoin, empty/single occupancy,
1600×900 / 960×540 / 1024×768 windows, and skeleton/ghost coexistence. It checks GL
errors. Existing Zombie, Ghost and Skeleton graphical checks also passed.

The graphical fixtures use synthetic RoomSession snapshots through the real lobby
adapter. They do not claim eight physical network clients or manual UI selection.
Server tests separately verify accepting Dracula and preserving its selection across
roster refreshes and reconnect. The source and packaged PNGs were compared byte-for-byte.
Rendering uses a configured 60 FPS; no target-device performance benchmark is claimed.

```sh
./gradlew :lwjgl3:draculaPreview
./gradlew :lwjgl3:draculaStudio
./gradlew :lwjgl3:draculaStudio -PdraculaStudioCheck=true
./gradlew :lwjgl3:draculaLobbyCheck
./gradlew :core:check :server:test :lwjgl3:devClasses
```

Studio controls: N shows the neutral rig, R replays the entrance, ESC closes.
Captures are in `generated/dracula-preview/` (`studio-0.png` neutral,
`studio-5.png` greeting, `lifecycle-3.png` eight characters before gate closure).
Development launchers are excluded from production classes and packaging.

## Lobby presentation size refinement

Dracula lobby presentation is now uniformly enlarged by 14% around the existing (174,68) floor anchor. The cape, smoke and entire articulated rig scale together; foot placement, animation timing and standalone studio scales are unchanged.

Tune `LOBBY_SCALE` in the corresponding character class. Sizes were calibrated against the existing cage opening and inspected in eight-slot graphical previews with resizing and leave/rejoin checks. Skeleton size and the lobby layout are unchanged.
