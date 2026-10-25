# THE LAST COMMAND (3D PREVIEW)

The three supplied root models are used as separate objects:

- `box_final.glb`: MAIN_BODY, fixed computer body.
- `hole_final.glb`: BIG_BUTTON_BASE, fixed metal housing.
- `button.glb`: BIG_BUTTON_CAP, moving red dome and its authored stem.

Runtime resources are in `assets/models/last_command/`. Original root files are
never modified. Open the third preview button in the lobby or press F7 in the
main menu. This preview is local; it adds no tasks or multiplayer messages.

## Assembly

`assembly.json` exposes independent XYZ position, Euler rotation in degrees
(X=pitch, Y=yaw, Z=roll) and XYZ scale for each model. Authored node transforms
remain intact. Calibration uses the body mount's actual geometry: its axis is
30 degrees above the front direction, and the housing and cap are rotated 60
degrees about X from their authored upright orientation.

The metal housing scale is 0.145, cap scale 0.081. Their shared center is aligned
to the source flange's fitted axis. The cap bottom starts 0.021 units above the
housing bottom along that axis. Pressing moves only the cap by 0.00972 scene
units (0.12 in cap-local units) along local -Y. Its bottom stays above the source
housing's closed cup floor throughout the stroke. The red dome protrudes above
the rim both at rest and under pressure.

`capPickMinY` (0.44) separates the red dome from the metal stem in the cap source's
coordinates after its authored node transform, before assembly placement.
Picking tests indexed source triangles, coarse bounds, closest-hit occlusion by
body/base and the red-only region. Starting an orbit outside the cap can never
trigger it by dragging across it. Starting on the red dome owns a hold gesture
until left release. Press takes 0.10 s, release 0.15 s, with smooth interpolation.

## Rendering and resources

Dedicated gdx-gltf PBR rendering preserves metallic/roughness and normal maps.
Indoor diffuse/specular cubemaps and a BRDF lookup provide metal reflections;
a warm key light casts PCF-filtered shadows, with dim cool fill/ambient light.
The industrial floor is generated as dark metal plates in one draw call.
Source maps are unchanged. `surface.json` controls an additional PBR corrosion layer
for each component: rust coverage, micro-relief and minimum roughness. Setting
`enabled` to false disables that layer without editing a GLB. The shader uses
solid multi-scale noise and analytic gradients for oxidized patches, flaking,
pitting and fine grain. Rust reduces metallic response and increases roughness;
original normal maps remain underneath. Its pattern excludes instance
translation, so button travel cannot make the surface slide. The source display
is masked separately and the red dome keeps its painted identity.

Warm grazing light, cool fill/rim lighting and a filmic highlight shoulder reveal
the surface relief. High-frequency detail fades below pixel size to limit shimmer.
No extra image maps, model reloads or per-frame resource allocations are used by
the corrosion layer. `WeatheredMetalShaderProvider` checks its hooks against the
pinned gdx-gltf 2.3 shader and fails explicitly if a future loader upgrade changes
those integration points. This layer affects the preview's renderer only.

Left drag orbits, right drag pans, wheel zooms. RESET CAMERA restores framing;
Esc/BACK exits. A conservative machine enclosure and floor-height limit prevent
camera penetration. Each asset is loaded once per visit and freed on exit,
along with shadows, generated floor, environment maps, font and UI resources.
The compact indexed CPU picking cache avoids per-triangle Vector3 objects.

## Lossless runtime preparation

Run `python3 tools/assets/prepare_last_command.py` (NumPy required) to regenerate
runtime copies from the three root GLBs. The body is partitioned into six
16-bit-index primitives, avoiding the loader's runtime 32-bit-index splitting.
All 495304 triangles, every indexed position/normal/UV and all embedded PNG bytes
are verified unchanged; no decimation or new compression extensions are used.
The prepared body is 27354388 bytes instead of 30260344 bytes. Base and cap
already use suitable indices and retain their original sizes. `preparation.json`
records source/runtime hashes and embedded image hashes. The originals remain
unchanged, and all three scene instances remain separate.

## Validation

- `./gradlew :core:check :lwjgl3:lastCommandPreviewCheck --offline`
- Animation timing, hold, interruption/reversal, local-axis travel, invalid delta.
- Real native OpenGL loading of all three supplied models.
- Actual red-cap ray pick, rejection of metal-base hit and rear-body occlusion.
- Mouse press/hold/drag/release, fixed body/base, exact 0.00972 travel.
- Orbit/reset/pan/zoom limit and prevention of press during an orbit.
- Two independent screen visits and repeated safe disposal.
- Native full-scene screenshot `/tmp/last-command-preview.png` and closeups
  `/tmp/last-command-button-0.png` through `-3.png` (rest/pressed, two angles).
- Source-model diagnostic: `./gradlew :lwjgl3:lastCommandModelInspection --offline`.

## Interactive front panel

The preview now also loads the user's original `adjuster.glb` and `light.glb`.
They were moved here from the project root without copying or altering their
bytes (see `panel-models.json`). `panel.json` calibrates four shared cap instances,
the rotary control and the indicator. No per-button GLB or texture copies exist.
See [front-panel API and validation](../../../docs/the-last-command-panel.md).
