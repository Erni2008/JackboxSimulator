# Hanging cage lobby

The existing room transport, `RoomSession`, server player IDs, character selection, main menu,
Impostor screen and quiz flow are retained. `FinalAnswerGame.activateRoom()` opens the new
`CageLobbyScreen`. Its PLAY button calls the existing `showPlayScreen()`; MENU opens the old
main menu, whose PLAY button returns to the cage room while the server phase is LOBBY.
The phone QR/network selector is the existing `ConnectionPanel`. No protocol changes.

## Assets

These are byte-for-byte copies of the supplied PNGs, packaged under `assets/lobby/`.
The gate was subsequently replaced with the user-supplied `kletka2.png`.
The originals remain untouched. TextureRegions crop transparent margins at runtime; no
replacement artwork, alpha flattening, SVGs, physics or 3D dependencies are used.

| Supplied file | Packaged path under assets/lobby |
| --- | --- |
| cage.png | cages/cage_open.png |
| kletka2.png (latest supplied gate) | cages/cage_bars.png |
| key.png | cages/cage_key.png |
| chain1.png | cages/chain.png |
| chain2.png | cages/chain_hook.png |
| background_cages.png | background_cages.png |
| skeletone_head.png | characters/skeleton/head.png |
| skeleton_body.png | characters/skeleton/body.png |
| skeletonleft_arm.png | characters/skeleton/left_arm.png |
| arm_right.png | characters/skeleton/right_arm.png |
| skeleton_leg1.png | characters/skeleton/left_leg.png |
| skeleton_leg2.png | characters/skeleton/right_leg.png |

All required visual assets were found under alternate names. No metallic impact/locking sound
files were found. `HangingCage.setSoundCues()` accepts optional shared, preloaded audio callbacks;
impact and lock cues fire once on crossing their timeline boundaries. No fake sound is substituted.

## Ownership and components

- `CageLobbyScreen`: 1920×1080 FitViewport, authored background, parchment room code, existing
  phone connection UI, host-only PLAY/IMPOSTOR controls, MENU and LEAVE ROOM.
- `CageLobby`: owns one `CageAssets` and one nickname font; exactly eight reusable `HangingCage`
  instances; adapts live room snapshots and exposes `registerCharacter(id, factory)`.
- `CageAssets`: owns eleven reusable textures (five cage/suspension and six character; the screen
  owns its background separately). Crops regions using the existing `RuntimeTextures` convention.
- `CageAssignments`: stable player-ID-to-slot mapping. Actual roster removal frees only that slot;
  list reordering and temporary offline status do not reshuffle seats or replay spawning.
- `HangingCage`: independent timeline, stationary hook, endpoint-connected chain, common stationary
  transform, clipped character, clipped sliding gate, shaft-pivot key and cached nameplate text.
- `CageAnimator`: pure delta-time timeline with boundary-crossing impact/lock events.
- `CageCharacter`: reusable character interface. `SkeletonCharacter` and `CharacterAnimator`
  implement the six-part skeleton and continuous local pose interpolation.
- `CageLayoutManager`: eight slots, safe artwork/UI region and independent ceiling lanes.
- `CageNameplate`: cached glyph-bound fitting, horizontal alignment, bold font and frame-safe padding.

The lobby owns and disposes every texture and font once, not per player. Character instances are
lightweight and retain shared asset references. Render uses cached transforms, colors, regions,
glyph layout and vectors; there are no per-frame texture loads or character allocations.

## Layout and pivots

Change `CageLayoutManager.FIRST_RING`, `SPACING`, `SCALE`, `CEILING` and `RING_HEIGHTS`.
The current cage scale is 0.93 (about 11% larger than the first layout).
Coordinates are viewport design units, not physical screen pixels. The two tiers are staggered:
chains to the lower tier pass between upper cages. Keep each lower chain lane clear of upper
cage bounds, and keep the bottom of every cage above the connection controls. FitViewport
letterboxes narrower/taller displays without cropping the room or changing animation geometry.

Cage-local artwork is 300×333. The suspension pivot is `(149,324)`. Each frame the ring is
transformed to its parent coordinates before drawing the ceiling-to-ring chain. The hook is
outside the rotated/scaled transform. Chain strips repeat at their original aspect ratio; only
the final strip is cropped to length. The cage, character, gate, key and nickname share the
same transform. Cages are stationary while idle. A brief 0.4-second damped rotation (up to 0.32 degrees)
plays only when the sliding gate hits bottom; reduced-motion mode suppresses this reaction.
Per-slot phase still varies character idle motion. Reduced-motion mode disables breathing.

`HangingCage` contains calibrated opening, gate and keyhole coordinates. The key rotates about
its shaft endpoint at the existing gate keyhole; there is no additional lock graphic. Gate
movement is cubic acceleration into an abrupt stop, clipped before it enters the opening.
The character is bounded by an interior scissor rectangle; its largest standing and seated
poses fit within that rectangle. Nicknames use upright Noto Sans SemiCondensed SemiBold, generated at size 48 with a
0.7-pixel emboldening border. `CageNameplate` measures every cached glyph quad including
borders and descenders, scales the complete string uniformly, and centres its actual ink
inside the padded nameplate rectangle `(126,27,101,18)`. No truncation or line wrap is used.
An additional scissor prevents ink from crossing the illustrated frame. Geometry is computed
only when the nickname changes; every cage retains its own cache over the shared font.

The skeleton now has fixed proportions throughout standing and sitting. It no longer grows
or shortens its legs to simulate a pose. `ArticulatedLimb` draws two overlapping TextureRegions
from each original arm/leg PNG, with calibrated elbow/knee pivots. No new or altered PNGs are
required. `TwoBonePose` solves the intermediate joint while preserving both bone lengths.
Foot targets stay planted as the pelvis lowers, and hands move towards the knees. Shoulder
blades and hip caps sit behind the torso to conceal joins. The pelvis and ribcage use separate overlapping regions of the original body PNG. The
spine and neck have separate local transforms, so shoulders can sag and the head can bow
without dragging the feet. Upper arms sit behind the ribs, while forearms and hands draw
in front to rest visibly on the lap. Hand placement starts 0.16 seconds after sitting begins;
spinal slump and head bow start 0.22 seconds after it. Breathing affects the ribcage, not the
pelvis or foot anchors.

`SkeletonCharacter` specifies the source-pixel anatomical pivots, segment scale, foot targets
and torso/head dimensions. `CharacterAnimator` supplies the pelvis descent, hand targets,
one-second still entrance, bowed head, and slow occasional downward nod after sitting. Quintic easing
provides zero endpoint velocity and acceleration. Character scale stays constant after its
brief 1.5% spawn entrance. The antique key remains 60×120 cage-local units.

## Timings and character extensions

Edit the public timing constants in `CageAnimator`:

| Action | Seconds |
| --- | --- |
| Spawn fade / scale | 0.50 |
| Still entrance hold | 1.00 |
| Gate closing | 0.60 |
| Scared recoil | 0.40, overlaps the key approach |
| Key approach / turn / withdraw | 0.90 |
| Sad / seated transition | 0.95, begins immediately after looking |
| Total to seated pose | 2.45 including 0.50 spawn |

After the spawn, the character keeps its head still for exactly one second, then sits while the gate
closes and the key sequence continues. The impact recoil is an upper-body overlay and never
moves the planted feet. States are SPAWNING, LOOKING_AROUND, IDLE, SCARED, SAD and LOCKED_IDLE.
Idle looping motions are independent of frame rate and vary by slot phase.
The key phase breakpoints and insertion depth are in `HangingCage.drawKey()`; the calibrated
keyhole centre is `(226.4,67.7)` for the replacement gate. The gate is rendered at
146.88×215.68 local units with its PNG aspect preserved, and clipped as it enters the opening. `CageLobbyScreen.cages()` exposes the character registry and
`CageLobby.cage(slot)` exposes per-cage optional sound cues.

The snapshot's `characterId` selects a registered factory. Only skeleton body-part artwork was
supplied, so other IDs currently use the skeleton fallback while retaining the selected ID.
Register future characters through `CageLobby.registerCharacter()`; no networking change is needed.
A changed character selection replaces its local character without moving the player or restarting
the cage animation. Future factories should share lobby-owned assets and avoid per-player textures.

## Verification and preview

- `./gradlew :core:cageCheck`: stable assignments, list reordering, vacancy reuse, 1000 join/leave
  cycles, eight simultaneous assignments, independent timelines, frame-rate equivalence,
  reset during animation, cue boundary, pose states, motionless entrance timing, fixed scale, planted feet, constant bone lengths,
  cage separation and chain corridors.
- `./gradlew :core:check :server:test :lwjgl3:classes :lwjgl3:devClasses`: existing checks,
  real HTTP/WebSocket quiz tests and compilation.
- `./gradlew :lwjgl3:cagePreview`: isolated developer window. R resets; 1 and 8 change occupancy;
  L removes a middle player; J rejoins. These controls live only in `src/dev` and are excluded
  from production jars.
- `./gradlew :lwjgl3:cagePreview -PcageCheck=true`: captures spawn, still entrance, closing gate,
  key, seated idle, leave/rejoin, empty room and single occupancy to `generated/cage-preview/`;
  exercises 1600×900, 960×540 and 1024×768 windows and exits automatically. The capture setup
  validates Cyrillic descenders, punctuation and 24 wide W characters before restoring the
  normal preview roster. Each nickname update asserts that all rendered glyph vertices remain
  inside the nameplate bounds. Short punctuation-only names retain the normal font size rather
  than enlarging into oversized symbols.

Visual limitations: this is authored 2D perspective cutout art. Overlapping joint regions provide articulated
elbows and knees without adding textures; there is no mesh skin deformation. Gate
alignment and joints are calibrated for these specific PNGs and should be recalibrated for new
art. Scissors are axis-aligned in screen space, and the brief impact rotation is tiny; character poses
stay inset from the edges to avoid visible leakage. The fully seated pose is partly obscured by
the actual foreground bars, as expected. Small displays reduce nickname/body-part detail.

The current rig is enlarged uniformly by 5% about the floor anchor. Neck placement is
compacted slightly to retain clearance below the cage roof. Initial skull turns are removed;
head bowing and the later sad-idle motion are retained.
