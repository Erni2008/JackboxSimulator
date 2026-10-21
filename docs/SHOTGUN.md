# Modular 3D shotgun

The existing game uses Scene2D/SpriteBatch for its screens and has no previous GLB
renderer. This component adds a separate, explicitly invoked libGDX PBR pass; it
changes no public menus, mini-game rules, phone UI or network messages.

## Files and assets

New runtime Java classes in `core/src/main/java/com/erni/finalanswer/shotgun/`:

- `ShotgunConfig`: validated JSON alignment, local movement directions, durations and easing.
- `ShotgunAssets`: GL-thread cache and owner of GLB meshes/materials/embedded textures.
- `ModularShotgun`: four independent Scene/ModelInstance objects, visibility and a common root.
- `ShotgunAnimator`: pump, bolt and reload controller with no graphics dependency.
- `ShotgunRenderer`: PBR camera pass, restrained directional lighting and small generated IBL maps.
- `ShotgunPreviewScreen`: camera orbit, component alignment, inspection and configuration saving.

Development/test additions:

- `lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/ShotgunPreviewLauncher.java`
- `core/src/test/java/com/erni/finalanswer/shotgun/ShotgunCheck.java`
- `assets/models/shotgun/shotgun_config.json`
- This document.

Build changes: `core/build.gradle` (gdx-gltf 2.3.0 and `shotgunCheck`),
`lwjgl3/build.gradle` (`shotgunPreview`), `.gitignore` (local QA captures).

The user confirmed the original order. The following copies are byte-for-byte
identical to the originals; no geometry, PNG, UV or material data was rewritten:

| Original in project root | Imported internal asset |
|---|---|
| `Shotgun1.glb` | `models/shotgun/shotgun_body.glb` |
| `shotgun2.glb` | `models/shotgun/shotgun_pump.glb` |
| `shotgun3.glb` | `models/shotgun/shotgun_bolt.glb` |
| `shotgun4.glb` | `models/shotgun/shotgun_shell.glb` |

All four GLBs load successfully with embedded base-color, normal and metallic/
roughness maps. The native check reports 9,352 vertices and 12,709 triangles across
the four source models. Load once per scene/level; create multiple rigs using the
same `ShotgunAssets`. Removing an individual rig must not dispose the shared cache.

## Important source-art limitation

**The supplied body is already a complete gun with a fixed wooden fore-end and
closed receiver/bolt detail.** Inspection found one node, one mesh, one primitive
and one material, with 2,338 triangles. The 78 index islands are seam patches rather
than labeled mechanical parts; several span multiple gun regions. Welding coincident
seam vertices produces one connected surface spanning the body and fixed mechanism.
There is no safe node/material switch to remove only the built-in pump and open a
receiver port. Arbitrary spatial deletion would risk unrelated surfaces and holes.

The current JSON explicitly sets `bodyHasFixedPump: true` and
`bodyHasClosedPort: true`. While BODY is shown, `ModularShotgun` suppresses the
separate PUMP/BOLT instead of overlaying duplicates. Consequently the only visible
pump in the full assembly is the **static source-body pump**. The preview refuses
P/O/C/L in that obstructed full assembly and reports why; it does not claim to
visually animate it or open its port. All four models still load and remain
available individually through Tab inspection or I solo.

To finish the full mechanism, replace `shotgun_body.glb` with a clean export that
contains no fixed wooden fore-end or closed bolt and has an actual open ejection
port. Preserve the supports, magazine guide, barrel, receiver walls and stock.
Then disable the two conflict flags and refine alignment. Do not disable the flags
with the current BODY just to make the warning disappear. Source models remain
byte-for-byte intact; no primitives, masked receiver or arbitrary mesh cuts substitute
for missing geometry. The separate bolt is also a stylized sleeve and needs final
artistic calibration against the corrected port.

No GLB is missing. Replacing a corrected asset at the same internal path and
restarting the preview is sufficient; then refine/save alignment and mark it
calibrated. Check all angles, especially while the pump is at its rear stop.

## Preview and controls

```sh
./gradlew :lwjgl3:shotgunPreview
```

This uses the existing **dev source set**, excluded from production distributions.
The configuration is read as an internal asset and saved to the source JSON's
absolute development path, supplied by Gradle. No public menu item was added.

| Control | Action |
|---|---|
| Left drag / right drag / wheel | Orbit / pan / zoom |
| F | Fit actually rendered components |
| F4 | Toggle compact diagnostic HUD / full help and details |
| B | Toggle temporary selected-model bounds highlight, including occluded parts |
| F1 / F2 / F3 | Side / reverse side / top inspection view |
| 1–4 | Select body / pump / bolt / shell |
| X / Y / Z | Choose local alignment axis |
| M | Cycle position / rotation / scale editing |
| Left / right arrow | Decrease / increase selected coordinate |
| Shift + arrow | Fine adjustment |
| U | Reset selected component alignment to identity |
| H | Toggle selected component visibility |
| I | Solo selected component |
| Tab | Toggle individual source inspection and assembly |
| P | Pump backward, hold, forward; synchronized bolt (isolated/clean-body diagnostic only) |
| O / C | Open / close bolt |
| L | Reload: open mechanism, move shell, hide loaded shell, close |
| T | Show shell at its loading start |
| R | Interrupt/reset animation to closed state, shell hidden |
| Space | Pause animation |
| G / A | Toggle grid / coordinate axes |
| K | Toggle calibrated flag after visual validation |
| Ctrl+S | Save component alignment and animation parameters |
| Esc | Close developer preview |

Inspection disables animation playback so each source can be checked safely.
For isolated motion, select 2 (PUMP) or 3 (BOLT), press I for solo, then P; or hide
BODY with 1 and H to view both independently moving parts. The HUD explicitly
labels this diagnostic mode. It is not verification of the obstructed full weapon.
B draws a temporary gold wireframe bounding box and never changes materials.
Visibility fields distinguish configured visibility, actual rendering and geometry
suppression; cycle phases expose IDLE/PUMP_BACKWARD/REAR_POSITION/PUMP_FORWARD.
Config editing, saving and reset are available without Blender. Visibility and
alignment are saved; temporary solo selection is not.

`position`, `rotation` (degrees), `scale` (positive XYZ), `anchor` and `visible` are per part.
Rotation convention is Z, then Y, then X in the transform chain. Original GLB node
rotations are retained underneath these alignment transforms. The common
`ModularShotgun.transform` moves/rotates/scales every component together.

`pumpDirection` and `boltDirection` are normalized assembly-local vectors, not
world axes. `pumpTravel`, `boltTravel`, `pumpDuration`, `boltDuration` and
`reloadDuration` tune the animation. Easing accepts `smooth`, `smoother`, `linear`.
`shellScale` is a positive uniform multiplier, currently **1.5**. The original
shell alignment scale remains [0.045, 0.045, 0.045]; effective scale is
[0.0675, 0.0675, 0.0675], exactly 50% larger along every axis. Original textures,
proportions and the assembly-local loading path are preserved. T shows it outside
the receiver at the starting position. Reload into the closed source port is
blocked by preview controls.

`scale` changes model dimensions; travel distances remain assembly units and are
then affected by the common root. `shellStart` / `shellEnd` are loading-path
offsets added to the shell's alignment transform. Once loaded the shell is omitted
from rendering, so it cannot visibly intersect the receiver at the end.

Commands return false if another command is active. `resetShotgun()` interrupts
any animation, allowing a new command immediately. Open-bolt idle is retained;
`boltState()` distinguishes CLOSED/OPENING/OPEN/CLOSING. Shell states are
HIDDEN/VISIBLE/MOVING/LOADED. Delta time is used throughout; invalid deltas are
ignored. Per-frame rig/animation code reuses matrices/vectors and loads no assets.

## Future mini-game integration

Create resources on the libGDX render thread when entering the relevant scene:

```java
ShotgunAssets assets = new ShotgunAssets(); // scene/level owner
ShotgunConfig config = ShotgunConfig.load(Gdx.files.internal(ShotgunConfig.PATH));
ModularShotgun gun = new ModularShotgun(assets, config);
ShotgunRenderer renderer = new ShotgunRenderer(perspectiveCamera);
renderer.provider(gun);

// Per frame, before the screen's 2D/UI pass:
gun.update(delta);
renderer.render(delta);

// Gameplay presentation event (no per-frame network messages):
if (gun.mechanismReady()) {
    gun.animator.playPumpAnimation();
    // On separate idle events: openBolt(), closeBolt(), playReloadAnimation().
    // Reset first if the current presentation must be interrupted.
}
// Otherwise retain the static BODY and report the source geometry conflict.

// On scene disposal, after all borrowing rigs are no longer used:
renderer.dispose();
assets.dispose();
```

The host chooses the camera, viewport and depth-buffer clear strategy, or renders
the 3D pass into its existing framebuffer before compositing UI. Root transformations
and all alignments remain local to the gun; no lobby camera is modified.
Cursed Boxes integration, firing, recoil, flash, smoke, audio, ejection and spent
shells are intentionally not implemented. The public root/controller APIs provide
the extension points; no new networking architecture is needed.

## Verification

```sh
./gradlew :core:check :server:test
./gradlew :lwjgl3:shotgunPreview -PshotgunQA=true
```

Controller checks exercise endpoints, 30/60/144 FPS stepping, conflicting commands,
invalid delta, reset interruption, instance independence, loading states and bad
configuration rejection. The OpenGL check loads the actual four GLBs, verifies
original base-color/normal material maps, parent rotation/scaling with local pump
travel, JSON save/load, visible versus loaded shell rendering, geometry-conflict
suppression and blocked preview commands, isolated pump/reload completion,
uniform 1.5× shell dimensions, shell/BODY separation at the shown start, exact
model transform restoration over 100 cycles and GL errors. Controller tests exercise 100 exact
cycles with no endpoint drift. Animated isolated models do not prove a functional
port in the merged BODY. Source views and assembly captures are generated under
`generated/shotgun/`. PNG capture stalls are restricted to the QA path; interactive
preview never captures frames automatically.

The existing mini-game graphical checks were not rerun for this isolated subsystem;
no 60 FPS guarantee across all hardware or physically correct final alignment is
claimed. The source-art limitation above still needs a corrected body export.

Dependency documentation: [gdx-gltf official project](https://github.com/mgsx-dev/gdx-gltf),
[official quick start](https://github.com/mgsx-dev/gdx-gltf/blob/master/demo/core/src/net/mgsx/gltf/examples/GLTFQuickStartExample.java).


### Attachment-based seating correction

The fore-end retains its earlier full uniform scale of **0.32**. Its source-model
attachment is now explicitly configured as `anchor: [-0.02256751, 0.109605, -0.001693]`,
measured from the actual imported model bounds. This anchor is placed at
`position: [0.43, 0.17, 0]`, centered on the magazine guide. The transform chain is
`root * motion * translation * rotation * scale * translation(-anchor) * originalNodes`.
Other parts default to a zero anchor, preserving their prior alignment. Resetting
editable position/rotation/scale retains the authored source attachment.

The 0.09-unit stroke remains on the guide, rather than entering the receiver or
extending beyond the front support. The real-GL check samples the entire stroke
at 60 intervals and verifies its swept X bounds against the source guide region
(0.148–0.635). It also verifies that the imported source anchor maps to the assembly
target, including the existing rotated/scaled-root checks. Both side views and a
top view are captured. No model/texture replacement or size reduction is used for
this seating correction. The original body's baked-in fore-end remains an asset
limitation during motion; the clean-body export described above is still needed
for a completely separate mechanism.
