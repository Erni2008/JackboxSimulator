> Четыре исходных GLB теперь находятся в `source_assets/shotgun/models/`. Имена сохранены; пути игровых моделей в `assets/models/shotgun/` не менялись.

# FINAL ANSWER modular shotgun

The existing libGDX developer preview now renders a complete working assembly:
fire/recoil/muzzle flash, manual pump and bolt operation, chamber state, case
ejection and single-round reload. The original four GLBs are unchanged. No public
menu, multiplayer protocol or unrelated mini-game has been modified.

## Assets and reversible body preparation

The user confirmed this source order; imported copies remain byte-identical:

| Original | Internal asset |
|---|---|
| `Shotgun1.glb` | `models/shotgun/shotgun_body.glb` |
| `shotgun2.glb` | `models/shotgun/shotgun_pump.glb` |
| `shotgun3.glb` | `models/shotgun/shotgun_bolt.glb` |
| `shotgun4.glb` | `models/shotgun/shotgun_shell.glb` |

The raw BODY is one node/mesh/primitive containing a fixed wooden fore-end and a
closed receiver. It has no separately named mechanical parts. Merely overlaying
PUMP/BOLT therefore duplicates the wood and obstructs the port.

`ShotgunBodyPreparation` creates a separate **cached runtime model**:

1. It checks the raw BODY's SHA-256 against the explicitly authored configuration.
2. It clips only the configured receiver window, interpolating positions, normals,
   tangents and UVs at its edges. Surfaces outside that volume are retained.
3. In the configured lower tube region, geometry is preserved and the existing
   textured BOLT metal material is reused. The baked-in wood becomes the stationary
   metal magazine guide, leaving one independently moving wooden PUMP.
4. It checks cut-area limits and surface-area conservation. It never edits the
   source mesh, GLB file or any PNG texture. Generated GPU meshes are owned by
   `ShotgunAssets` and shared across borrowing instances.

The current authored port is X -0.005..0.14, Y 0.17..0.208, Z 0.001..0.06 in the
imported BODY's local scene coordinates. The opposite receiver wall, stock,
barrel and supports remain. The port is a cut in the original surface rather
than a separate artist-authored thick-walled internal receiver.

`preparation.enabled=false` reverses preparation. The original BODY can also be
viewed with Tab, then 1. If a different file/checksum or unexpected hierarchy is
encountered, preparation fails safely and the raw-body conflict flags suppress
PUMP/BOLT overlays again; the preview reports the actual failure.

A future artist-authored clean BODY can replace the file without code changes:
disable preparation, disable `bodyHasFixedPump` / `bodyHasClosedPort`, and refine
alignment. Do not disable these conflict flags on the current raw BODY unless
runtime preparation succeeds.

The bolt is fitted to the prepared port using its source-space anchor and uniform
scale 0.13. Its 0.09-unit rearward stroke opens enough space for the enlarged shell.
The pump retains uniform scale 0.32 and its measured source anchor
[-0.02256751, 0.109605, -0.001693], attached at [0.43, 0.17, 0]. No pump size reduction
is used. Its complete 0.09-unit travel remains on the guide.

## Preview

```sh
./gradlew :lwjgl3:shotgunPreview
```

The launcher remains in the existing `dev` source set, excluded from production
distributions. Models, PBR maps, effects and sounds load once at startup. The gun
starts with one LIVE round in the developer configuration. Grid and axes are off
by default, and can still be enabled. F6 gives a clean cinematic view.

| Key | Action |
|---|---|
| Enter | Fire if chamber LIVE, bolt closed and mechanism idle |
| P | Pump backward / rear hold / forward; eject a spent or manually cycled live round |
| L | Reload one round into an EMPTY chamber |
| O / C | Open / close bolt; opening a chambered round also extracts it |
| F5 | Complete demonstration: reset loaded, fire, cycle/eject, reload, ready |
| R | Reset developer weapon and clear flying case/effects |
| T | Show the separate loading cartridge at its starting position |
| V | Mute / unmute weapon sounds |
| Space | Pause/resume animation; current sound voices stop on pause |
| Left drag / right drag / wheel | Orbit / pan / zoom |
| F | Fit actually rendered models |
| F1 / F2 / F3 | Side / reverse side / top view |
| F4 | Toggle detailed controls and component diagnostics |
| F6 | Toggle cinematic view / HUD |
| 1 / 2 / 3 / 4 | Select BODY / PUMP / BOLT / SHELL |
| B | Temporary gold bounds highlight; original materials remain unchanged |
| Tab | Original-source inspection / assembled runtime weapon |
| I | Solo selected component |
| H | Toggle selected component's configured visibility |
| X / Y / Z | Select alignment axis |
| M | Cycle position / rotation / scale editing |
| Left / right arrow | Adjust selected component; Shift gives fine increments |
| U | Reset selected editable transform, retaining its authored source anchor |
| G / A | Toggle grid / axes |
| K | Toggle calibration marker |
| Ctrl+S | Save JSON to its development source path |
| Esc | Close preview |

Original-source inspection pauses animation. Normal assembly and solo diagnostics
retain all existing controls. The HUD distinguishes configured visibility,
actual rendering, geometry conflicts, chamber state and mechanical phase.

## State and animation contract

The controller is single-chamber presentation, not a simulated multi-round tube
magazine. The preparing mode owns its actual ammunition rules and authority.

- `Chamber.LIVE`: fire is allowed while closed and idle.
- `fire()` enters FIRING with a short local recoil and procedural muzzle flash,
  then returns exactly to the resting pose. Chamber becomes SPENT immediately;
  firing again is rejected until the mechanism is cycled and reloaded.
- `cycle()` moves pump and bolt together: backward for 45% of the duration, rear
  hold for 10%, forward for 45%. Parts translate along configurable assembly-local
  axes and do not rotate during cycling.
- At normalized cycle time `ejectionAt` (0.4), the port is wide enough for the shell.
  A separate pooled instance of the **same cartridge model** is launched from
  `ejectionSocket`; the chamber becomes EMPTY. No new spent-case GLB is invented.
- The case spins around its configured center, follows a ballistic world-space
  path and fades near the end of its short lifetime. It no longer follows the gun
  after launch. No full rigid-body floor collision is simulated.
- `reload()` moves a visible cartridge toward the open port, hides it once inserted,
  closes the mechanism and makes the chamber LIVE. Loading over LIVE/SPENT or
  firing with an open bolt is rejected.
- Commands return false while another animation is active. Reset interrupts all
  motion and uses `startLoaded` to establish the developer/match setup state.

All movement uses delta time and absolute poses. There are no animation threads,
per-frame texture loads or new model instances during firing/ejection. Source
models, generated body meshes and all PBR maps are cached per asset owner.

## Configuration

`assets/models/shotgun/shotgun_config.json` contains per-part position, rotation
(degrees), scale, source-space anchor and visibility. The local chain is:

```
weapon root * recoil * mechanical travel * position * Z/Y/X rotation * scale
    * translation(-anchor) * original glTF node transforms
```

The prepared body bakes its original node orientation into its derived vertex
copy; the remaining imported parts keep their original node transforms.

Key parameters:

- `shellScale=1.5`: uniform multiplier over [0.045, 0.045, 0.045]; effective shell
  scale [0.0675, 0.0675, 0.0675]. Its proportions and source textures remain intact.
- `pumpDirection`, `pumpTravel`, `pumpDuration`, `boltDirection`, `boltTravel`,
  `boltDuration`, `reloadDuration`, `easing` (`smooth`, `smoother`, `linear`).
- `fireDuration`, `flashDuration`, `recoilPivot`, `recoilTravel`, `recoilAngle`, `muzzle`.
- `ejectionAt`, `ejectionSocket`, `ejectionVelocity`, `ejectionSpin`,
  `ejectionGravity` (world downward), `ejectionLifetime`.
- `shellStart` / `shellEnd`: local loading path; `startLoaded`: initial chamber.
- `preparation`: source checksum, port and guide bounds, safety limit. These are
  authored for the supplied BODY and must not be blindly applied to another model.
- `fireSound`, `pumpBackSound`, `pumpForwardSound`, `loadSound`, `audioVolume`.

The common `ModularShotgun.transform` can be moved, rotated or scaled by a game
scene. Mechanical motion remains local; an already ejected case remains in its
captured world frame. Temporary highlighting does not modify PBR materials.

## Audio

Four short mono PCM WAV clips are preloaded. The audio adapter follows accepted
shots and mechanical phases, without replacing the mode's event listener.
It adjusts playback rate to the configured phase duration and supports mute/stop.
The original source archives are not distributed.

Sources and licensing:

- Fire: [The Free Firearm Sound Library](https://opengameart.org/node/21826),
  Mossberg `N_26P.wav`, CC0; creators Ben Jaszczak, Brian Nelson, Kevin Heras,
  Matthew Nanney. One report is trimmed with a short fade/reverb and peak limit.
- Mechanism/loading: [Shotgun Reload Sound effects](https://opengameart.org/content/shotgun-reload-sound-effects),
  zer0_sol, CC0; trimmed/tempo-aligned mechanical actions.

Full credits, source links and conversion notes ship in
`assets/models/shotgun/audio/CREDITS.txt`. Audio can be replaced through configuration.

## New-mode integration

No provisional mode screen or new networking protocol has been invented. Create
one resource owner during scene entry on the GL thread, before visible action:

```java
ShotgunAssets assets = new ShotgunAssets();
ShotgunConfig config = ShotgunConfig.load(Gdx.files.internal(ShotgunConfig.PATH));
ModularShotgun gun = new ModularShotgun(assets, config);
ShotgunRenderer renderer = new ShotgunRenderer(perspectiveCamera);
ShotgunAudio audio = new ShotgunAudio(config); // optional; existing mode audio can use events instead
renderer.provider(gun);
gun.animator.listener((event, sequence) -> Gdx.app.log("Shotgun", sequence + ": " + event));

// After authoritative mode validation, choose ONE command as appropriate:
boolean accepted = gun.fire(); // or gun.cycle(), gun.reload()

// Each frame, before the host's 2D UI:
gun.update(delta);
audio.update(gun.animator);
renderer.render(delta);

// Scene exit, after all rigs borrowing assets are no longer rendered:
audio.dispose();
renderer.dispose();
assets.dispose();
```

The host controls the viewport/depth clear or renders the pass to its framebuffer.
`renderer.environment()` permits matching the upcoming mode's lighting.
`gun.muzzle(reusedVector)` and `gun.barrelDirection(reusedVector)` expose aim points
for the mode's own targeting logic. `readyToFire()`, `complete()` and
`mechanismReady()` expose operation gates. Match setup may use
`gun.animator.chamber(Chamber.LIVE/EMPTY)` while idle. Preview F5 is developer-only
and grants a round for demonstration; it is not multiplayer ammunition authority.

Events: FIRED, EJECTED, RELOADED, CYCLE_STARTED, EMPTY_TRIGGER, RESET. They have
monotonic per-instance sequence numbers. RELOADED observes the completed ready
state. Cosmetic transforms are not network messages; the future mode should
synchronize accepted commands/start times, then evaluate the local deterministic
controller. Damage, target selection, puzzle outcomes and server rules remain the
new mode's responsibility.

## Verification

```sh
./gradlew :core:check :server:test
./gradlew :lwjgl3:shotgunPreview -PshotgunQA=true -PshotgunAudioQA=true
```

Controller checks cover 30/60/144 FPS stepping, chamber interlocks, repeated shots,
exact endpoints across 100 cycles, event counts, reset, invalid delta and invalid
configuration. The OpenGL check uses the real GLBs and verifies:

- PBR base-color/normal maps, original-source inspection and cached body preparation.
- Actual absence of receiver surface inside the authored port.
- Full-size fore-end swept bounds, anchor mapping and local travel under parent rotation/scaling.
- Exact model transforms after 100 cycles, uniform 1.5x shell dimensions and clear shown position.
- A cartridge that fits the open port, spins around its center and remains independent
  when the gun moves after ejection.
- The complete assembled fire/flash/recoil/pump/ejection/reload sequence and F5 demo.
- Decoder/backend availability with `shotgunAudioQA`; automated volume is zero.
- GL errors and disposal of all owned preview/PBR/model/font/effect textures.

QA captures go to `generated/shotgun/` (ignored). QA uses fixed simulation steps
so PNG readback cannot skip a 55 ms flash. Interactive preview uses actual delta
and performs no automatic captures. QA FPS values include readbacks and are not a
performance benchmark or a cross-hardware 60 FPS guarantee.

## Files

New focused runtime helpers: `ShotgunBodyPreparation.java`, `ShotgunEffects.java`,
`ShotgunAudio.java`. Existing shotgun assets/configuration, animator, assembly,
renderer and preview are extended in place. Updated checks are `ShotgunCheck.java`
and the existing dev `ShotgunPreviewLauncher.java`; its Gradle task adds the audio
QA option. Original GLBs/PNGs and unrelated game screens are unchanged.
