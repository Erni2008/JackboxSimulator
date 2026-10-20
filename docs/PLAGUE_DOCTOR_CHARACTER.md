# Plague Doctor lobby character

Implemented through the existing `CageCharacter` / `CageLobby` / `HangingCage` architecture, using the existing Batch and skeleton two-bone IK helpers. No cage layout or existing character behavior was changed.

## Source artwork

Exactly nine source images are loaded, from the project root. The user supplied replacement arm supersedes the earlier arm image; the excluded unrelated image is not loaded.

| Part | Path | Dimensions |
|---|---|---|
| Mask/head | `doktor1.png` | 1284×1225 |
| Torso | `doktor_body.png` | 1199×1312 |
| Free left arm | `left_hand_doktor.png` | 1536×1024 |
| Lantern right arm | `doktor4.png` | 1427×1102 |
| Screen-left leg | `doktor5.png` | 1042×1510 |
| Screen-right leg | `doktor6.png` | 1050×1498 |
| Hat | `doktor7.png` | 1536×1024 |
| Lower robe | `doktor8.png` | 1697×927 |
| Lantern | `doktor9.png` | 1278×1230 |

Original PNG contents are unchanged. Texture regions, overlapping elbow masks, lantern emission and a procedural radial gradient are created once in memory, shared between instances, and disposed by the lobby. No new source PNG artwork is generated. Preview screenshots are development outputs only.

## Assembly and pivots

Source pivots below use pixel coordinates from the top-left. Local character coordinates use positive Y upwards.

| Component | Source pivot | Attachment / scale |
|---|---|---|
| Torso | (600,780) | Root hip height 41; scale .046 |
| Head | (790,1000) | Torso neck (1,24); scale .052 |
| Hat | (780,850) | Head (0,40); scale .047 |
| Free upper arm | (300,260) | Torso shoulder (-16,25); scale .038 |
| Free forearm | (720,540) | IK elbow; wrist source (1160,440) |
| Lantern arm | (360,160) | Torso shoulder (16,25); scale .028 |
| Lantern | Ring (655,70) | Right glove source (1225,525); scale .025 |
| Robe | Waist (770,80) | Torso (0,8); scale .053 |
| Left leg | Hip (620,120) | Knee (550,700), foot (560,1430); scale .03 |
| Right leg | Hip (500,115) | Knee (580,690), foot (560,1420); scale .03 |

Root parents both legs and torso. Torso parents robe, both arms and head; head parents hat; lantern arm parents the lantern at the actual glove grip. Feet target fixed root positions (-14,3) and (14,3), using the existing skeleton IK so breathing does not make them float.

The mask's redundant scarf tail is cropped by a texture region. Torso lower fabric renders behind the head and the original torso collar renders in front, seating the shortened neck. The hat follows the head with a restrained secondary rotation. The replacement free-arm sprite is divided at its elbow into overlapping runtime masks. A hand region shares the forearm transform but renders in front of the mask and behind the hat. The sleeve remains behind the portrait. No original art pixels are repainted.

## Animation

`PLAGUE_DOCTOR_APPEAR` lasts four seconds. Weak lantern light precedes the character, followed by eased materialization, neck-driven head rise, ignition, a small head turn, a slow free-hand approach to the hat, lantern inspection and settlement. The hat gesture overlaps phases slightly to avoid a rushed arm movement. At four seconds the procedural pose continues into `PLAGUE_DOCTOR_IDLE` without a pose reset.

Idle combines low-amplitude torso breathing, delayed head and hat sway, independent arm movement, pinned-waist robe cloth and one scheduled gesture every 7–14 seconds. Eight gesture variants include hat adjustment, lantern inspection, beak lowering, observation, weight shift and a composed pause. Random choices occur only at scheduled events; every instance owns its own seed, timer, pose and physics state.

The lantern uses a driven damped pendulum, integrated at 120 Hz: stiffness 16, damping 4.2, hand-acceleration forcing, maximum angle seven degrees. Render interpolation avoids fixed-step stair-stepping. Its ring follows the glove while rotation settles toward world gravity independently of arm rotation.

The lantern's original bright glass pixels supply a localized emission mask; the metal frame is excluded using the glass bounds and luminance. Multiple smooth frequencies vary flame intensity. A procedural soft radial halo and tiny embers illuminate the lantern only; character-surface reflections and lens glints are disabled. The halo position comes from the actual lantern rendering matrix. Batch transform, color and separate alpha/color blend functions are restored after rendering.

## Integration and ownership

`CageLobby` lazily loads shared assets for character ID `plague_doctor`. The existing assignment lifecycle preserves the same character instance when the same player and selection remain. Leaving removes the instance from updates; rejoining or changing back creates a fresh entrance. Server character validation and existing desktop/web character selectors accept the ID. Up to eight instances share immutable textures only.

## Files

Created production files in `core/.../ui/lobby/cages/`: `PlagueDoctorAnimationState`, `PlagueDoctorAnimator`, `PlagueDoctorAssets`, `PlagueDoctorCharacter`, `PlagueDoctorRig`.

Modified integration: `CageLobby.java`, `LobbyPanel.java`, `RoomService.java`, `web/index.html`, `core/build.gradle`, `lwjgl3/build.gradle`, `RoomServiceTest.java`.

Created development checks: `PlagueDoctorCheck.java`, `PlagueDoctorStudioLauncher.java`, `PlagueDoctorLobbyCheck.java`, and this document. Other pre-existing working-tree changes are not part of this implementation.

## Tuning and validation

Motion frequencies/amplitudes and phase easing: `PlagueDoctorAnimator.evaluate()` / `appear()`. Entrance duration and gesture interval constants are at the top of that class. Pendulum constants are beside them. Source pivots and grip coordinates: `PlagueDoctorRig` and `PlagueDoctorCharacter`; per-part scales are in the renderer. Lobby position/scale: `draw()` (170,62,`LOBBY_SCALE=1.32`), enlarged uniformly around the floor anchor. Lantern lighting strength/radius: `drawPose()`.

```sh
./gradlew :core:check :server:test
./gradlew :lwjgl3:plagueDoctorStudio -PplagueDoctorStudioCheck=true
./gradlew :lwjgl3:plagueDoctorLobbyCheck
./gradlew :lwjgl3:plagueDoctorPreview
```

Studio without check mode supports N for neutral pose and R for entrance replay. Preview opens the existing cage lobby fixture. These checks use synthetic rosters, not a live eight-client network session.

Core checks pass, including source allowlist, four-second state transition, boundary continuity, 30/60/120 FPS physics equivalence, independent gestures/flicker, constrained motion and grounded feet. Desktop studio checks actual rendered ring/glow attachment and Batch state restoration, with captured neutral/appearance/idle frames. Lobby checks eight doctors, preserved instances on roster refresh, selection changes, leave/rejoin, multiple resolutions and coexistence with Skeleton, Ghost, Zombie, Dracula and Pumpkin. Existing Pumpkin desktop regression also passes. Server suite: 116 tests, zero failures/errors.

Known limitations: PNGs have no separate eyelids or fingers; neither is independently animated. Hat contact is a stylized 2D shoulder/elbow gesture, not a 3D hand simulation. No live network multiplayer session or measured 60 FPS benchmark was performed.

## Current lighting

Character-surface additive reflections and lens glints are removed. Only the lantern retains its original flame, surrounding halo, flicker and sparks. The lobby rig scale is 1.32, up from 1.20.

## Character brightness

`PlagueDoctorCharacter.plagueDoctorBrightness = .60f` multiplies incoming Batch RGB uniformly for the legs, robe mesh, arms, torso, collar, mask/head and hat. Alpha and all animation transforms are preserved in every pose, including the neutral preview. Adjust this shared value within 0–1; the renderer clamps it. The original Batch color is restored after drawing. The lantern sprite and its existing flame, halo, sparks and flicker retain their previous brightness. Source PNGs, cages, background, UI and other characters are unchanged.

The independent `plagueDoctorLanternBrightness = 1.5f` exposure boosts existing flame, halo and sparks while character RGB remains at .60. Emission alpha is clamped to avoid packed-color overflow.
