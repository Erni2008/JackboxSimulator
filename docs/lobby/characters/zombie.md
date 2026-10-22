# Lobby zombie

The zombie uses the existing `CageCharacter`, `CageLobby` factory, `HangingCage`,
Stage/Batch transforms, eight stable assignments, and 1920×1080 FitViewport.
`SkeletonCharacter`, `GhostCharacter`, cage geometry, backgrounds, and buttons are unchanged.
The existing selection controls gain one Zombie option; no new selection screen is added.

## Source artwork and assembly

The six originals remain at the project root. `core:processResources` packages their
unchanged bytes with the same names, so desktop development and packaged builds load
the same files through `RuntimeTextures`. No source file is moved, renamed, or edited.

| File | Part | Source dimensions | Pivot from source top-left | Uniform scale |
| --- | --- | --- | --- | --- |
| zombie1.png | Head | 1286×1223 | Neck: 650,1110 | .043 |
| zombie2.png | Body | 1024×1536 | Belt: 520,1190 | .043 |
| zombie3.png | Screen-left arm | 930×1691 | Shoulder: 615,105 | .033 |
| zombie4.png | Screen-right arm | 930×1691 | Shoulder: 405,110 | .033 |
| zombie5.png | Screen-left leg | 930×1691 | Hip: 460,125 | .036 |
| zombie6.png | Screen-right leg | 1024×1536 | Hip: 560,80 | .039 |

The root anchors at cage-local (174,68). Hips are 55 design units above that floor.
Legs inherit the root; the body inherits hip position, torso angle, and uniform scale.
Arms attach at (-16,32) and (16,33), and the head attaches at (1,40) in body space.
The pivot helper converts top-left source-art coordinates to Batch's bottom-left origin.
Full texture dimensions and transparent padding are accounted for independently.
Draw order is legs → arms → torso → head, hiding roots beneath overlapping fabric.
The large head, uneven shoulders, long arms, and differently shaped legs are preserved.

Legs reuse the skeleton's `ArticulatedLimb` and `TwoBonePose`. Each unchanged PNG is
rendered as overlapping upper/lower regions at its knee, permitting a crouch and weight
shift without foot sliding. Both fixed end targets remain reachable throughout APPEAR
and IDLE. Hip balance offsets are small enough to remain covered by the torso.
The neutral assembly can be inspected with N in the development studio.

## Animation

`ZombieAnimationState` has exactly APPEAR and IDLE. Every new character owns its own
`ZombieAnimator`, mutable pose, random generator, event schedule, and elapsed time.
Shared textures are lazily loaded once by the lobby and disposed with it.

APPEAR lasts 2.2 seconds:

1. 0–.4: rise from a grounded crouch with a bowed head and slight torso compression.
2. .4–.85: lift the head and straighten the torso.
3. .85–1.25: short neck/torso twitch with delayed, different shoulder reactions.
4. 1.25–1.75: asymmetric reach, stronger on the right, with a small uniform torso enlargement.
5. 1.75–2.2: relax into the live idle pose with quintic easing.

Entrance offsets are added to the running idle pose and vanish with zero velocity and
acceleration at 2.2 seconds. Changing state never resets the underlying motion phase.
No opacity fade substitutes for the physical entrance.

IDLE combines slow torso sway, grounded hip shifts, delayed neck tilt, asymmetric arm
swings/reaches, and separate balancing legs. Head events are scheduled approximately
3–7 seconds apart; one other event (left arm, right arm, or torso shudder) is scheduled
3–8 seconds apart. Events are spaced apart to avoid simultaneous jolts. Each has a
quick eased attack, brief hold, and slower eased recovery. Random values are chosen
only at event boundaries; event ordering is preserved across different frame rates.
Slot phase produces slightly different continuous motion rates. Reduced motion lowers
idle oscillation/twitch strength while preserving the entrance and state lifecycle.

`CageCharacter` gains a backward-compatible delta update overload. Its default delegates
to the original absolute cage-time method, so skeleton and ghost behavior is preserved.
`HangingCage` supplies the actual frame delta; zombies use that delta for their own
occupant-local clock, including when selected in an already occupied, older cage.

`CageLobby.synchronize` already preserves instances for the same player/character,
including fresh snapshots and nickname/status changes. New occupants and selection
changes create fresh zombies in APPEAR. Clearing a slot drops its character reference,
so the removed instance stops updating; rejoining creates a new entrance. No new
network event or gameplay animation is introduced.

## Tuning

- `ZombieAnimator.APPEAR_SECONDS`: entrance end time; keep the final settle interval consistent.
- `SWAY_SPEED`, `SWAY_DEGREES`: torso movement.
- `TWITCH_MIN`, `TWITCH_MAX`: head event spacing (other events have their own 3–8 interval).
- `idle` calculations in `update`: arm frequencies/angles, head delay, balancing amplitudes.
- `appear`: five authored beats and reach strength.
- `ZombieCharacter`: per-part scales, source pivots, attachment positions, neck/shoulder overlap,
  floor anchor, and IK knee coordinates. Root display scale multiplies the complete assembly.

Rendering allocates no per-frame textures, regions, poses, matrices, or temporary objects.
The character uses its caller's Batch begin/end and restores Batch color and transform.

## Files in this change

Created:

- `core/.../ui/lobby/cages/ZombieAnimationState.java`
- `core/.../ui/lobby/cages/ZombieAnimator.java`
- `core/.../ui/lobby/cages/ZombieAssets.java`
- `core/.../ui/lobby/cages/ZombieCharacter.java`
- `core/.../test/.../lobby/ZombieCheck.java`
- `lwjgl3/src/dev/.../ZombieStudioLauncher.java`
- `lwjgl3/src/dev/.../ZombieLobbyCheck.java`
- `docs/lobby/characters/zombie.md`

Modified:

- `CageCharacter.java`, `HangingCage.java`: backward-compatible delta hook.
- `CageLobby.java`: zombie factory and shared-resource ownership.
- `LobbyPanel.java`, `web/index.html`: Zombie in existing character controls.
- `RoomService.java`, `RoomServiceTest.java`: accept zombie and verify roster/reconnect preservation.
- `core/build.gradle`: unchanged source-art resources and executable verification task.
- `lwjgl3/build.gradle`: development-only launch/check tasks, excluded from release classes.

## Validation — 2026-10-20

Passed:

```sh
./gradlew :core:check :server:test :lwjgl3:devClasses
./gradlew :core:zombieCheck
./gradlew :lwjgl3:zombieStudio -PzombieStudioCheck=true
./gradlew :lwjgl3:zombieLobbyCheck
./gradlew :lwjgl3:ghostPreview -PghostCheck=true :lwjgl3:cagePreview -PcageCheck=true
```

All 113 server tests passed with zero failures/errors. Core verification includes
APPEAR/IDLE boundary continuity, 30/60 FPS agreement across scheduled events, eight
independent instances, invalid delta handling, reduced motion, and both planted feet.
Actual desktop OpenGL captures were inspected for neutral assembly, entrance phases,
and idle; the real lobby fixture asserts one-shot appearance, snapshot preservation,
ghost/zombie/skeleton changes, unchanged neighboring instances, removal, rejoin,
empty/single occupancy, and 1600×900, 960×540, and 1024×768 window sizes. No GL errors
were reported. Existing ghost and skeleton graphical previews also completed.

The lobby fixture supplies synthetic `RoomSession` snapshots through the real roster
adapter; it does not claim eight physical network clients or manual UI selection.
Server tests separately cover accepting Zombie and preserving its ID through reconnect.
Rendering was exercised at a configured 60 FPS; no target-device performance benchmark
is claimed. The originals retain their painted lighting and alpha, including differences
between the two leg images.

Inspect `generated/zombie-preview/studio-0.png` for the neutral rig and
`generated/zombie-preview/lifecycle-1.png` for eight assembled zombies before gate closure.
Use `./gradlew :lwjgl3:zombiePreview` for the live lobby, or `:lwjgl3:zombieStudio`
for a large inspection view (N neutral, R replay appearance).

## Lobby presentation size refinement

Zombie lobby presentation is now uniformly enlarged by 7% around the existing (174,68) floor anchor. Foot placement, part proportions, animation timing and standalone studio scales are unchanged.

Tune `LOBBY_SCALE` in the corresponding character class. Sizes were calibrated against the existing cage opening and inspected in eight-slot graphical previews with resizing and leave/rejoin checks. Skeleton size and the lobby layout are unchanged.
