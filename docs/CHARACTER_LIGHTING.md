# Character rendering and lighting correction

## Investigation

The waiting room draws directly through the existing Stage/SpriteBatch. Before this follow-up its character path had no bloom, exposure shader or intermediate framebuffer. The background's separate shader does not supply character lighting. Source PNGs use straight alpha; there was no evidence that their RGB should be unpremultiplied or that a body-wide additive pass was present on Puppeteer.

Three concrete issues were found:

1. Puppeteer's already luminous amber eye received an additional additive iris image, pushing its highlights toward artificial illumination. A broad .87 RGB dimmer obscured the symptom rather than correcting that pass.
2. All high-resolution modular images used linear minification without mipmaps. Their fine brass, wood and cloth detail was point-sampled over very large reductions, producing unstable bright speckles during small movements. Unrelated RGB in transparent texels also needs exclusion when reducing alpha images.
3. Doctor's earlier uniform .60 RGB factor suppressed porcelain-mask readability together with the intentionally dark costume. Its lantern is a separate, intentional emissive effect and was not the cause of the dark character.

The previous character boundary restored only color and transform. Existing effects usually restored their own blend functions, but there was no boundary guarantee of standard blending/default shader, nor restoration after an arbitrary effect failure. This was hardened; an actual frame-to-frame shader leak was not observed and is not claimed as a proven cause.

## Corrections

- `CharacterTextures.java`: one shared character-only loader/upload helper. Level zero and original PNG bytes remain unchanged. Lower mip levels average coverage and alpha-weight RGB before converting back to straight alpha. Transparent texel RGB cannot contaminate reduced edges. Trilinear minification and linear magnification are used consistently. File textures retain reload support; existing generated textures keep their existing unmanaged lifetime. Mipmaps are generated once, not during rendering, and shared textures retain their asset owner's disposal.
- `CageCharacterPresentation.java`: standard existing default Batch shader, enabled straight-alpha blending, RGB `SRC_ALPHA / ONE_MINUS_SRC_ALPHA` and alpha `ONE / ONE_MINUS_SRC_ALPHA`. A `finally` block restores shader, all separate blend factors, blending enable, color and transform, including on exceptions. This original correction did not add a production shader or framebuffer; the selective tone-curve follow-up below now adds a shader.
- `PuppeteerAssets.java`, `PuppeteerCharacter.java`: removed the redundant emission texture/pass. All original body parts, colors, hierarchy and animation channels remain. The original iris can still dim/pulse through its existing color modulation, without additive illumination.
- `assets/lobby/character_presentation.json`: only Puppeteer's broad brightness workaround changes (.87 → 1). Every scale, anchor, position and growth time is identical.
- `PlagueDoctorCharacter.java`: retained the .60 base exposure and calibrated material groups: cloth ×1.08, mask ×1.20, hat/accessory group ×1.10. Thus effective mask modulation is .72 versus .648 for cloth. Black stays black; texture shading and hue remain intact. This is a restrained material distinction rather than a global exposure increase. Lantern emission coefficients and animation are unchanged.
- Asset loaders for Skeleton (`CageAssets` character branch), Ghost, Zombie, Dracula, Pumpkin, Plague Doctor, Voodoo and Puppeteer all use the shared character texture path. Cage/background/UI textures and samplers are excluded.

## Modified files

Production: new `CharacterTextures.java`; `CageCharacterPresentation.java`, `CageAssets.java`, `GhostAssets.java`, `ZombieAssets.java`, `DraculaAssets.java`, `PumpkinAssets.java`, `PlagueDoctorAssets.java`, `VoodooAssets.java`, `PuppeteerAssets.java`, `PuppeteerCharacter.java`, `PlagueDoctorCharacter.java`, and the single brightness field in `assets/lobby/character_presentation.json`.

Development: new `CharacterLightingCheck.java`, existing `LobbyCharacterPolishCheck.java` and `lwjgl3/build.gradle`. The pre-existing interactive preview option was preserved. Documentation: this file plus updated Puppeteer/presentation notes. Generated framing measurements are refreshed by QA.

## Verification

Commands:

```sh
./gradlew :core:check :lwjgl3:characterLightingCheck :lwjgl3:lobbyCharacterPolishCheck :lwjgl3:puppeteerStudio -PpuppeteerCheck=true
./gradlew :lwjgl3:lobbyCharacterPolishCheck -PcharacterPreview=true
```

Passed:

- Exact alpha-weighted reduction regression: one opaque red pixel plus three transparent white pixels reduces to red with 25% coverage, not a white/dark fringe. Odd-size mip reduction retains the last row/column.
- Actual framebuffer pixel test: correct source-over RGB and alpha even when the incoming Batch has blending disabled, additive factors and a different shader selected.
- Shader/blending/color/transform restoration, including a character that throws midway through a draw.
- Managed file-texture reload, complete mip chains, no OpenGL errors.
- No additive pass during Puppeteer INTRO and IDLE rendering.
- Actual costume-texture subpixel sampling: mean interior RGB change fell from **25.81 to 2.96** when moving in .2-pixel increments. This measures reduced minification aliasing, not a blanket reduction in texture brightness.
- Real mixed lobby with all eight characters during entrance and idle at 1600×900, 960×540 and 1024×768; screenshots inspected. Separate Puppeteer studio exercises all states/behaviors.
- Existing core animation checks pass. PNG diffs are empty; configuration comparison confirms unchanged geometry and timings.

The mixed idle screen averaged approximately **1.24 ms of CPU update/draw submission** on this machine, excluding screenshot encoding. This is not a cross-hardware GPU benchmark. Mipmaps add the usual roughly one-third texture storage; no per-frame texture creation, new physics or render targets were introduced in that pass.

## Follow-up: lantern, detail and entrance

Lantern exposure is now 3.6 (previously 1.5). Its existing warm halo is stronger, and a second masked warm emission pass adds radiance inside the glass after the first pass saturates. This does not change the character material exposure. Doctor textures use a desktop OpenGL sampler LOD bias of -0.55, retaining finer detail while preserving trilinear, coverage-correct mipmaps. Other samplers are unchanged; GLES keeps its existing default.

Puppeteer now reveals the complete rig with a smooth alpha channel over 0.08–0.9 seconds. Alpha is included in the existing pose blending, so early state changes recover smoothly. The entrance remains occupant-local and completes before the cage gate closes.

## Performance and readability follow-up

The doctor base material exposure is now .65 (previously .60), retaining the existing material ratios and independent lantern brightness. Puppeteer receives a small hue-preserving midtone lift at asset preparation: black and alpha remain unchanged, gain is capped to avoid clipping highlights. Its original eye textures keep their independent animation and are excluded from this grade. No PNG files are overwritten.

## Selective visibility correction (current)

The previous material tint and small CPU midtone lift could not adequately reveal dark details at cage size. Only `plague_doctor` and `puppeteer` now select a fragment shader through their presentation profile. All six other profiles continue using the default SpriteBatch shader. No geometry or animation settings changed.

Configurable `exposure` / `contrast` values in `assets/lobby/character_presentation.json` are 1.85 / 1.18 for Doctor and 1.90 / 1.20 for Puppeteer. These are tone-curve parameters, not vertex-color multipliers. For peak RGB value m, the curve computes t = pow(m, 1/contrast), mapped = exposure*t/(1+(exposure-1)*t), then scales all RGB by mapped/m. This preserves RGB ratios, black, alpha and hue; the smooth shoulder preserves highlight separation without hard clipping. The contrast parameter controls shadow/midtone opening rather than a midgray subtraction that crushes blacks. Existing material tint ratios remain underneath the curve.

Doctor temporarily selects the default shader for the existing lantern artwork and emissive passes, so their rendering is unchanged. The material shader returns for body parts. Presentation restores the caller's shader, blending, tint and matrix. Each graded profile lazily owns one program shared by all matching occupants, disposed with CageAssets; no per-frame textures, render targets or allocations are required.

The development mixed-lobby check now renders the exact same frozen character pose with grading enabled and disabled, verifies pixel-identical alpha and at least 1.45× mean luminance in opaque shadow/midtone pixels, and saves `before-<id>.png` beside `rig-<id>.png`. Run `./gradlew :core:check :lwjgl3:characterLightingCheck :lwjgl3:lobbyCharacterPolishCheck`. Preview: `./gradlew :lwjgl3:lobbyCharacterPolishCheck -PcharacterPreview=true` (R replays entrances, Escape closes).

Measured same-pose opaque shadow/midtone luminance gain: Doctor **1.819×** (10,720 pixels), Puppeteer **1.700×** (3,950 pixels). Alpha matched exactly. Core checks, GL lighting checks and mixed-lobby entrance/idle at three resolutions passed. Before/after rigs and actual lobby screenshots were visually inspected; no full hardware performance benchmark is claimed.

## Cage-only softer lighting

Presentation profiles now optionally define `cageExposure` and `cageContrast`. HangingCage calls `drawInCage`; question rigs retain the prior `draw` profile, so gameplay readability is unaffected. Doctor's cage curve is 1.55/1.10 (question curve 1.85/1.18), Puppeteer's 1.60/1.12 (question 1.90/1.20). Other characters receive a gentle cage-only 0.93/1.00 curve. This reduces the recent lift without changing source PNGs, alpha, body proportions, cage/background light or intended separate doctor lantern rendering. The same owned program is reused per character profile with uniforms selected at draw time and incoming state restored afterwards.

### Cage doctor correction and Impostor portraits

The doctor now uses `cageExposure: 0.85`, `cageContrast: 1.0`: the cage-only
midtone lift has been removed and material shading is reduced. Question/mini-game
profiles remain separate; the doctor's lantern still bypasses material grading.
Cage nameplates again use `UiFonts.nameplate(48)` with their original uniform brown ink.
Character colors belong to question labels and mini-game portrait nameplates.

`ImpostorCharacterActor` borrows the existing `CageLobby` texture owner and creates
an independent existing rig per portrait. The production Impostor avatar factory
now supplies these actors to participant frames, final voting and result cards.
No cage graphics or new character textures are used. Actors advance through Scene2D
`act(delta)` and restore the batch transform after drawing with the shared material profile.
Run `./gradlew :lwjgl3:impostorCharactersCheck` for an eight-character OpenGL contact
sheet, or `./gradlew :lwjgl3:impostorPreview` for the interactive three/four-player scene
(F3/F4 changes participant count, F5 switches between the two groups of four characters). The contact sheet is written to
`generated/impostor-characters.png`; this is a development artifact.
