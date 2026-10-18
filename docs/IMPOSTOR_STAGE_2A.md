# THE IMPOSTOR — Stage 2A

## Delivered scene

A static Scene2D composition uses the supplied background1, clockmini, arrow_clock1 and timer_rectangle PNGs. The timer label is dynamically rendered as `ДО КОНЦА ГОЛОСОВАНИЯ`, with static `00:12` below it. No status/debug labels appear. No gameplay, transitions, animations, player elements, phone UI, networking or Stage 2B work was added.

The three backgrounds are each 1672×941. Background1 stays visible; backgrounds 2 and 3 remain loaded and available. Clock is 1223×1286, arrow 1024×1536, panel 1942×809. Source files and Stage 1 asset ownership are unchanged.

## Layout

One Stage and its existing owned SpriteBatch use a 1920×1080 FitViewport. Non-16:9 surfaces are letterboxed with black bars. Images and text scale together; there are no resolution-specific positions. Background uses centered Scaling.fill, preserving aspect ratio. The source differs from 16:9 by about 0.05%, so this trims less than one source pixel horizontally and leaves no gaps inside the composition.

`ImpostorLayout` holds immutable design-space bounds. All coordinates below use bottom-left origin and virtual pixels:

| Element | X | Y | Width | Height |
| --- | ---: | ---: | ---: | ---: |
| Clock body | 1608 | 782 | 224 | 235.539 |
| Timer panel | 1550 | 628 | 340 | 141.637 |
| Timer label | 1580 | 720 | 280 | 24 |
| Timer digits | 1580 | 654 | 280 | 64 |
| Reserved top players | 260 | 790 | 1240 | 240 |
| Reserved central content | 360 | 470 | 1140 | 290 |
| Reserved table | 300 | 100 | 1300 | 340 |
| Clock region | 1540 | 620 | 360 | 420 |

Clock and panel share center X=1720. Clock body center Y≈899.769. These bounds include each PNG's transparent padding. Noto Sans at 16 design pixels provides Cyrillic, using UiFonts.body. UiFonts.horror(52) provides the large crimson digits. Both fonts are generated once per screen, owned by the screen, and disposed with it.

Rendering order is background, three empty reserved groups (environment, players, gameplay), clock body, arrow, panel, label, digits. No additional batches or stages were introduced. The static render path performs no asset loading, font generation, layout rebuilding, timer updates or animation updates.

## Arrow pivot

The measured clock face spindle is approximately (614,680) in the original clock image's top-left coordinate system. The arrow hub is approximately (512,1317) in its 1024×1536 PNG, well below the image center. Conversion to bottom-left origin gives arrow origin (512,219), before scaling.

The arrow is an independent Image actor with its origin at that hub, positioned so its hub coincides with the clock spindle at world (1720.458,892.993). Its uniform scale is approximately 0.06227876, fitting the hand tip to the face radius (~440 source clock pixels). Rotation stays at zero (twelve o'clock); later rotation can use the actor origin without shifting the hub. No source PNG was cropped or modified.

## Resource behavior

The existing ImpostorAssets scope loads 22/22 PNGs once, and reentry reuses both textures and actors. Hiding retains screen resources; the development launcher disposes them after navigation. Borrowed Image actors never dispose textures. Background/clock/panel failures omit those images and log paths; the hand is omitted if the body is unavailable. Text remains usable if the panel is missing. No unrelated screen acquires Impostor textures.

## Files

Modified from Stage 1:

- core/src/main/java/com/erni/finalanswer/impostor/ImpostorScreen.java
- lwjgl3/src/test/java/com/erni/finalanswer/lwjgl3/ImpostorCheck.java
- lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/ImpostorPreviewLauncher.java (window title)
- lwjgl3/build.gradle (task descriptions and development screenshot output path)

Created:

- core/src/main/java/com/erni/finalanswer/impostor/ImpostorLayout.java
- docs/IMPOSTOR_STAGE_2A.md

Stage 1 state, registry, loader, source PNGs, existing menus/trivia/clock, production launch, server and protocols were not modified.

## Verification

Passed:

```sh
./gradlew :lwjgl3:classes :lwjgl3:devClasses :lwjgl3:testClasses :core:roundCheck :core:clockCheck :server:test
./gradlew :lwjgl3:impostorCheck :lwjgl3:playCheck
./gradlew :lwjgl3:impostorPreview
```

Compilation and existing round/clock checks passed. Server reports 24 tests with zero failures. Existing graphical PLAY regression passed. The actual dev launcher opened and reported 22/22 textures loaded.

Extended real OpenGL regression checks actor visibility/order, exact text and glyph support, artwork proportions, measured hub alignment, text bounds and padding, centered viewport/uniform scaling, background pixels, black letterbox bars, ESC navigation, reentry, recreation and texture disposal. A real desktop resize to 1024×768 is requested as part of lifecycle verification. Deterministic offscreen framebuffer rendering covers all five target dimensions, avoiding operating-system window-size limits; screenshots are framebuffer renders, not desktop screenshots.

All 22 assets loaded normally. Degraded tests intentionally simulate missing background/clock/panel and corrupt stamp: 18/22 load, errors include the exact paths, the degraded scene still renders, and successful resources are released. Managed texture count returns to baseline after scopes and screens are disposed, including font textures. No new dependency was added; the dev launcher remains in the dev source set, outside production outputs.

Initial graphical runs failed because the label and digits had insufficient height for their generated font line metrics. The actual bounds were corrected to 24 and 64 pixels respectively; final graphical checks passed. Compilation also emits a deprecation note for the existing-style framebuffer capture helper in the test; it does not affect the checks.

## Screenshots and visual review

Development artifacts, excluded from production assets:

- lwjgl3/build/impostor-check/screenshots/impostor-1920x1080.png
- lwjgl3/build/impostor-check/screenshots/impostor-1600x900.png
- lwjgl3/build/impostor-check/screenshots/impostor-1280x720.png
- lwjgl3/build/impostor-check/screenshots/impostor-1366x768.png
- lwjgl3/build/impostor-check/screenshots/impostor-1024x768.png

The 1920×1080, 1280×720 and 1024×768 captures were inspected: background fills the composition, the hand sits at the watch spindle, clock/panel remain aligned and within the safe area, text does not clip, and the 4:3 frame has centered black bars. This is visual inspection as well as runtime verification; final aesthetic approval remains with the user. The small label necessarily becomes smaller at low resolutions, and textures remain synchronous/full-resolution as in Stage 1. The timer overlaps part of a background wall decoration at the far right, while leaving the lamp, red door, table and reserved player/content regions clear. No final gameplay composition is implied.

## Launch

```sh
./gradlew :lwjgl3:impostorPreview
```

ESC returns to the existing menu. Relaunch for a fresh preview; programmatic cached-screen reentry is covered by the regression. Run `./gradlew :lwjgl3:impostorCheck` to regenerate all five screenshots and repeat lifecycle checks. No server or completed trivia match is needed.

Stage 2A stops here. Stage 2B has not started.
