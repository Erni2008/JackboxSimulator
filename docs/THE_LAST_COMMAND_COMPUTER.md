# Replacement command-machine body: computer.glb

The supplied root `computer.glb` is now the body in both the browser/Three.js machine and the Java/libGDX machine. Its original bytes are retained (SHA-256 `7ddaf6d823f67ebdb9e2670540df7e1de0000e3e4a426984f1c9fa3a51ac558d`). The previous `box_final` assets remain on disk, but are no longer the selected body. No other GLB was replaced.

## Runtime preparation

The original contains 992,438 triangles and three embedded 4096×4096 maps. The existing four quality profiles now have `computer.glb` runtime copies:

| Profile | Triangles | Embedded maps | File bytes |
|---|---:|---|---:|
| HIGH | 446,597 | 3 × 4096² | 68,197,848 |
| MEDIUM | 218,336 | 3 × 2048² | 26,828,064 |
| LOW | 99,243 | 3 × 1024² | 10,424,308 |
| Mobile | 59,546 | 3 × 1024² | 8,180,632 |

These copies use ordinary glTF 2.0 and 16-bit primitive partitions, without required compression extensions. The preparation script checks that partitioning preserves the intermediate mesh attributes and embedded images. It does not overwrite the original source or other mechanism assets.

Regenerate with the installed Blender:

```sh
/Applications/Blender.app/Contents/MacOS/Blender -b -t 4 --python tools/assets/prepare_last_command_computer.py
python3 tools/assets/fit_last_command_computer.py
npm --prefix web3d run build
```

Model binaries follow the repository's existing ignored-asset workflow; the preparation scripts and JSON manifests record the reproducible build.

## Registration and appearance

The replacement is uniformly scaled by 0.9266; it is not stretched independently along its axes. Its measured screen opening is registered to the existing interactive CRT at `(-0.003, 0.495, 0.116)`, with a 2 mm clearance from the authored surface. Browser and native touchscreen hit regions therefore retain their established coordinates.

`assembly.json`, `panel.json` and `mechanisms.json` contain the fitted placements. Existing button, collar, regulator, lamp, lever, hatch, code and card models are retained. The front controls are rotated to the new vertical panel, and their centers/depths match measured recesses and socket lips. The code panel is seated against the upper plate. Side and rear mounts retain their compatible existing placements.

The generated bezel previously overlaid on the old body was removed: the supplied model already has its own frame and fasteners. Procedural recoloring is not applied to the new body; its authored PBR appearance is used. Existing mechanism appearance is retained. Camera framing was adjusted to keep the lower buttons in view.

Quality fallback now starts its settling period after model loading finishes, rather than treating loading/shader warm-up as steady-state poor frame rate. This avoids an immediate, unnecessary drop from HIGH to LOW after loading the larger body.

## Verification

- Java/server tests and native compilation passed: 194 tests, zero failures/errors.
- Browser expansion: a real 3D CRT click received an authoritative score; the second player's score stayed isolated.
- Native expansion: the new body loaded, a projected CRT key press reached the server, and no OpenGL error was reported.
- Physical browser controls: actual red cap and code-arrow taps, recovery/restart, LOW → MEDIUM → HIGH → LOW switching; no shader errors and matching final LOW resource counts.
- Native resource audit: two scene lifecycles ended with zero owned textures, buffers, framebuffers, renderbuffers, programs and shaders remaining.
- Retained classic campaign: 20 successes, one incorrect answer, delayed recalls, real rear-card clicks, two-client synchronization and restart passed.
- Visual captures include conditional, circuit, pressure, lever, hatch, code and animal tasks with the replacement body.

Screenshots are under `generated/last-command-expansion/` and `generated/last-command-computer/`. Source surface scans and opening measurements are retained with the latter. Physical-phone and long-duration GPU testing remain unperformed; browser touch emulation and native desktop checks should not be presented as those tests.

The gameplay expansion, implemented mechanics, optional audio requirements and remaining production limitations are documented separately in `THE_LAST_COMMAND_EXPANSION.md`.

Russian/detail update: task instructions are localized through shared `CommandText`; machine/controller labels use the corresponding `command-ru.js` presentation dictionary. Protocol identifiers and answer values remain unchanged. Desktop browser/native body rendering retains the HIGH body with original 4096² maps independently of effect quality; touch browsers retain MEDIUM 2048² maps. Browser texture anisotropy is 8 and the low-effect pixel-ratio cap is 1.5. Explicit quality selection is no longer overridden automatically.

Body material polish: browser normal-map strength is 0.18 and a body-only shader roughness floor of 0.38 reduces noisy specular highlights while preserving the supplied rust/base-color maps. Other module materials retain their existing treatment.
