# THE IMPOSTOR — Stage 2B visual rework

## Changes and limits

Replaced the development rectangles with one reusable gothic frame per explicitly active participant. Nicknames are dark, centered text on the frame's parchment nameplate. Papers start completely empty, and INTRO hides retained clue labels even if populated data is supplied. No debug avatar labels, guest labels, drawn portrait rectangles or floating nickname labels remain.

The existing RoomSession.Player and characterId remain the identity/appearance source. No usable character textures or avatar renderer exist in the repository. The preview therefore renders empty transparent frames as requested. The existing caller-supplied avatar actor hook remains available: an avatar is uniformly fitted into an inscribed opening, behind the frame. No characters or substitute avatar artwork were created. Missing avatars do not hide the frame.

No gameplay, network selection, role assignment, clue submission, server/controller changes, votes or subsequent-stage work was added. Only explicitly provided active records appear; count validation remains exactly three or four, with duplicate stable IDs rejected. Nicknames are never used as IDs.

## Asset and geometry

The new file was supplied at repository root as `impostor_avatar_frame.png`, not at the expected runtime path. It was copied byte-for-byte to `assets/impostor/portraits/impostor_avatar_frame.png` and added to ImpostorAsset. The existing ImpostorAssets loader owns a single texture shared by all participant frames; no new asset system was added. The source and all existing PNGs are unchanged.

Frame dimensions are 1297×1212 RGBA. Source alpha ranges from 0 to 255. The central inscribed rectangle at top-left source coordinates (350,290,595,525) has alpha 0–1; the parchment is nearly opaque (a center sample exceeds alpha 245). This rectangle stays clear of the upper emblem, rounded opening corners and bottom plate. Future avatar actors are uniformly fitted inside it, and drawn before the frame; they cannot cover the decorations.

The nameplate safe rectangle is defined relative to the source image: (390,935,520,130), top-left origin. The participant view converts source coordinates to bottom-left design coordinates using one uniform scale. The nameplate becomes (60.139,52.668,80.185,20.046) relative to the group. Nicknames use the existing Noto Sans font at 18 design pixels before group scaling, dark brown ink and visual ellipsis. The original nickname remains intact. No text is baked into textures.

## Participant layout

The existing 1920×1080 FitViewport, reserved region (260,744,1240,240), Stage and batch remain unchanged. Clock body, arrow, timer positions, dimensions, typography, color and static values are unchanged.

Each participant group is now 360×240 design pixels. Relative bounds:

| Element | X | Y | Width | Height |
| --- | ---: | ---: | ---: | ---: |
| Full frame PNG | 0 | 30 | 200 | 186.893 |
| Front paper | 208 | 28 | 152 | 190.543 |
| Nickname safe box | 60.139 | 52.668 | 80.185 | 20.046 |

All artwork keeps its original aspect ratio and transparent edges. Frame-to-paper canvas gap is eight pixels. The frame, avatar, nickname, paper group and future clue labels remain separate actors. The paper group still has its own center origin for future transforms.

The existing layout calculation uses the new group width:

- Scale: min(1, (region width − (count−1)×20)/(count×360)).
- Gap: min(64, remaining width/(count−1)).
- Center the complete row horizontally and vertically within the reserved region.

Three participants: scale 1, group origins X=276,700,1124 and Y=744, gap 64. Four participants: scale 295/360≈0.819444, origins X=260,575,890,1205 and Y≈765.667, gap 20. There are no extra slots or spectator frames. Both configurations remain in one row clear of the lamp, clock and timer.

## Empty papers and future ink

Development fixtures contain three empty strings per participant, with no sample words. Each paper's dynamic labels remain allocated once and hidden initially. Updating their text does not reveal them. The presentation-only `setPresentationPhase` permits visibility for ROUND_CLUE_REVEAL or EVIDENCE_REVIEW and hides it for INTRO and other phases. This is visibility gating only; no game-state transition or protocol is implemented. Future gameplay must explicitly supply the correct phase and real clue data, and may extend supported visibility phases when their behavior is defined. Missing paper artwork also hides ink.

## Background inspection and safe animation alternative

All three background images are 1672×941, but inspection found differences in the wall cracks, table grain, papers, lamp and furniture details. They are not registered lighting-only states; opacity blending would ghost these details. Consequently the requested safe alternative is used rather than blindly crossfading them.

ImpostorRoomBackground displays background1 with a cosine illumination cycle of 16 seconds. RGB brightness varies smoothly from 1.00 to 0.94 and back; opacity remains one. It alters only the background, leaving participant elements and clock/timer unaffected. Background2 and background3 remain managed and available for future use.

Progress uses delta seconds, with no per-frame allocation, I/O or texture loading. Resize and participant switching do not reset it; cached-screen reentry retains progress. Application pause freezes progress. Reduced-motion preferences use steady full illumination. The actor borrows its texture from the existing scope and has no separate texture ownership.

## Created files

- assets/impostor/portraits/impostor_avatar_frame.png
- core/src/main/java/com/erni/finalanswer/impostor/ImpostorRoomBackground.java
- docs/impostor/stages/stage-2b-visual-rework.md

## Modified files

- core/src/main/java/com/erni/finalanswer/impostor/ImpostorAsset.java
- core/src/main/java/com/erni/finalanswer/impostor/ImpostorParticipantView.java
- core/src/main/java/com/erni/finalanswer/impostor/ImpostorScreen.java
- lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/ImpostorPreviewData.java
- lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/ImpostorPreviewLauncher.java
- lwjgl3/src/test/java/com/erni/finalanswer/lwjgl3/ImpostorCheck.java

No dependencies, source PNG modifications, unrelated screen changes or server/protocol edits were introduced. The removed placeholder fixture resources no longer need allocation or disposal. Preview fixture data and F3/F4 listeners remain in the development source set.

## Verification

Successful commands:

```sh
./gradlew :lwjgl3:classes :lwjgl3:devClasses :lwjgl3:testClasses :core:roundCheck :core:clockCheck :server:test
./gradlew :lwjgl3:impostorCheck :lwjgl3:playCheck
./gradlew :lwjgl3:impostorPreview
```

Compilation, existing round/clock checks, 24 server tests and the existing graphical PLAY regression passed. The actual development launch opens and reports 23/23 textures loaded.

The extended graphical regression passed frame loading, source alpha sampling, future avatar fit/proportions/layer order, nickname nameplate bounds/ink color/text fitting, no debug avatar actors, empty development clues, INTRO privacy even for populated data, explicit reveal/hide visibility, stable IDs, three/four counts, no spectator slots, single-row spacing, clock/timer clearance, all existing clock/timer geometry and text checks, resize, ESC, reentry and disposal. Background tests verify changing illumination, a closed 16-second loop, equivalent delta progression at different frame steps, no reset on resize/reentry, steady reduced-motion mode and stable texture counts.

Missing frame/background/clock/paper/panel plus corrupt stamp simulation reports six failures and loads the remaining 17/23 textures without crashing. Missing frame hides the nickname rather than leaving floating text. All screen textures, including fonts, return to the original application baseline after disposal. SHA-256 comparisons confirm all 23 integrated PNG files match the untouched originals.

An initial graphical run failed because a retained future clue line box was shorter than its font line metrics. The box was corrected to 32 pixels; final graphical checks pass. No unresolved test failure remains.

Both participant configurations were rendered with real OpenGL into exact-size framebuffers at 1920×1080, 1600×900, 1280×720, 1366×768 and 1024×768. The lifecycle check also requests a native 1024×768 window resize. These captures are framebuffer renders rather than desktop screenshots, avoiding OS window-size limits.

Development screenshots are under `lwjgl3/build/impostor-check/screenshots/`:

- impostor-3players-1920x1080.png
- impostor-4players-1920x1080.png
- impostor-4players-1280x720.png
- Corresponding captures for both counts at the other requested resolutions.

The three listed compositions were inspected, and the final 1280×720 capture was reinspected after increasing nickname size. They show decorative empty frames, nicknames on the plates, empty papers, and clear separation from the watch/timer. The supplied frame's transparency lets the room show through until real avatars exist. Manual aesthetic approval remains with the user. Small nameplates necessarily limit text size at low resolutions; long names use ellipsis. The ambient effect is deliberately subtle, and crossfading the three geometry variants is deliberately avoided.

## Preview

```sh
./gradlew :lwjgl3:impostorPreview
```

F3 selects three active sample participants, F4 selects four, ESC returns to the existing menu. No server is needed. The corrections stop here; the next gameplay stage has not started.
