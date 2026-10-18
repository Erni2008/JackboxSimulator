# THE IMPOSTOR — Stage 2B

## Scope and existing support

Added only static presentation of explicitly supplied active participants, nicknames and three clue lines on front parchment. Stage 2A background, watch, hand and timer remain unchanged. There are no roles, secrets, submission, timers, votes, spectator weights, network selection, server/controller changes or gameplay transitions.

The existing player model is `RoomSession.Player(id, name, host, characterId, connectionStatus, hasSubmittedAnswer, score)`. Server character identifiers are `guest_1`, etc.; the browser displays these as text. No character PNGs, avatar asset registry, or avatar renderer was found. Stage 2B therefore reuses this player model, and accepts caller-supplied avatar actors derived from it. No nickname-to-avatar mapping or separate avatar identity model was introduced.

Only the development source set provides code-drawn placeholders, explicitly labeled `DEV AVATAR` and the existing-format character ID. These use one shared generated white pixel texture and one shared font; no placeholder PNG or production fallback artwork was added. If a production caller supplies no avatar renderer, the portrait slot is left empty and the missing character renderer is logged. Suitable real portrait artwork and its resolver are still needed before production integration.

## Data and validation

`ImpostorParticipant` wraps the existing Player and an immutable list of exactly three clue strings. Nicknames and IDs stay intact. `ImpostorScreen.setParticipants` accepts only three or four explicitly selected active participants and rejects duplicate IDs; it copies the input before storing it. Invalid count/duplicate configurations leave the previous configuration intact. The unconfigured screen can still display the Stage 2A scene, but an explicitly configured active list must have three or four entries.

The screen never inspects connected room players or selects participants. Only entries explicitly supplied as active are shown; spectator records are not passed into the row. Spectator eligibility, permissions and voting rules are deliberately unimplemented. No claims are made about future server enforcement.

## Layout and actual geometry

The existing 1920×1080 FitViewport and Scene2D Stage remain in use. `TOP_PLAYERS` is now (260,744,1240,240), beneath the hanging lamp and to the left of the clock region beginning at X=1540. Other Stage 2A bounds are unchanged.

Each independent participant Group has base size 328×240. Relative to the group:

| Element | X | Y | Width | Height |
| --- | ---: | ---: | ---: | ---: |
| Avatar fit area | 0 | 48 | 148 | 184 |
| Nickname | 0 | 8 | 148 | 36 |
| Paper group | 164 | 25 | 164 | 205.586 |
| Clue line 1, relative to paper | 29 | 124 | 105 | 32 |
| Clue line 2, relative to paper | 29 | 88 | 105 | 32 |
| Clue line 3, relative to paper | 29 | 52 | 105 | 32 |

The front/back paper PNGs are both 1120×1404; the front image preserves this ratio, including transparent edges. Back remains loaded and available without automatic switching. The paper is a separate Group with its origin at its center; the image and three Labels remain separate child actors. This supports future paper transforms or front/back replacement without baking text or portraits into textures. No flip/rotation animation is implemented.

For count N, uniform group scale is `min(1, (regionWidth - (N-1)*20)/(N*328))`. The gap is `min(64, (regionWidth - N*scaledWidth)/(N-1))`. The complete row is horizontally centered in the available region, and vertically centered inside it.

- Three players: scale 1, group origins X=324,716,1108; Y=744. Group size 328×240; gap 64.
- Four players: scale 295/328≈0.89939, origins X=260,575,890,1205; Y≈756.073. Displayed group size 295×215.854; gap 20. Avatar area ≈133.110×165.366; paper 147.5×184.902.

All coordinates are virtual, independent of the physical desktop resolution. Resize is handled uniformly by the existing viewport; 4:3 targets are letterboxed. Avatars supplied by a future resolver are uniformly fitted into the avatar area, preserving their natural proportions. Each participant Group remains independently transformable.

## Text rendering

One screen-owned UiFonts.body(24) font supplies Cyrillic-capable Noto Sans for all participants. Nicknames are centered at a consistent 22 design-pixel size before row scaling, with an offset (1.5,-1.5) dark shadow. Scene2D ellipsis (`...`) limits visual width without changing the source nickname or Label text.

Clues use independent centered Labels in dark brown ink. Each word starts at 22 design pixels and scales down only if needed to fit the 105-pixel safe line width. Lines are spaced 36 pixels apart, with padding clear of the pin and paper edges. `ImpostorParticipantView.setClues` updates text and scale in place; it retains the paper texture and actors. Rendering does not rebuild participants, generate fonts, load assets or perform per-frame file I/O.

The existing players layer is populated beneath gameplay/clock overlays. Participant groups contain avatar, paper and text actors; the watch, hand, panel and timer remain above them. One Stage/batch is used. All production fonts and Impostor textures remain screen-owned; development avatar resources remain owned by the preview fixture and are disposed after its screen. Row replacement removes actors without disposing their borrowed textures or fonts.

## Development controls

```sh
./gradlew :lwjgl3:impostorPreview
```

The preview starts with three deterministic participants. F3 selects three; F4 selects four. ESC returns to the existing main menu. Relaunch for a fresh preview. Cached-screen reentry is verified by the graphical check. The window title lists F3/F4 controls.

Sample players, words, placeholder drawings and F3/F4 handlers live only under `lwjgl3/src/dev/java`. The graphical test shares this dev output; production main/jar output does not include it. The normal launcher, main menu and room creation flow are unchanged.

## Files created

- core/src/main/java/com/erni/finalanswer/impostor/ImpostorParticipant.java
- core/src/main/java/com/erni/finalanswer/impostor/ImpostorParticipantView.java
- lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/ImpostorPreviewData.java
- docs/IMPOSTOR_STAGE_2B.md

## Files modified from Stage 2A

- core/src/main/java/com/erni/finalanswer/impostor/ImpostorScreen.java
- core/src/main/java/com/erni/finalanswer/impostor/ImpostorLayout.java
- lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/ImpostorPreviewLauncher.java
- lwjgl3/src/test/java/com/erni/finalanswer/lwjgl3/ImpostorCheck.java
- lwjgl3/build.gradle (allows graphical tests to reuse development fixtures, without adding dev output to main)

No dependencies, source PNG edits, shared player model edits, server changes or protocol changes were introduced.

## Verification

Passed:

```sh
./gradlew :lwjgl3:classes :lwjgl3:devClasses :lwjgl3:testClasses :core:roundCheck :core:clockCheck :server:test
./gradlew :lwjgl3:impostorCheck :lwjgl3:playCheck
./gradlew :lwjgl3:impostorPreview
```

- Compilation passed; existing round and clock checks passed.
- Existing server tests: 23 RoomServiceTest and one TransportTest, zero failures/errors/skips.
- Existing graphical PLAY regression passed.
- Impostor graphical check passed three- and four-player configurations, actual F3/F4 input handlers, count rejection for 0/1/2/5/6/8, duplicate rejection, identity binding, one-row spacing, avatar presence, nickname shadows/ellipsis, parchment proportions, exact clue strings, long Cyrillic text fitting, texture-preserving clue updates, clock/timer clearance, resize, ESC, reentry, recreation and disposal.
- Both configurations were rendered with real OpenGL into framebuffers at 1920×1080, 1600×900, 1280×720, 1366×768 and 1024×768. The lifecycle check also requests a native desktop resize to 1024×768. Framebuffers provide exact target dimensions regardless of OS window-size limits.
- Missing background/clock/panel/front-paper plus corrupt stamp simulation loads 17/22 assets, reports exact failures, renders the remaining scene, and hides ink if the paper is absent. These error logs are expected test output; normal loading is 22/22.
- Managed texture counts return to baseline after repeated screen disposal, including generated font textures; development pixel/font resources also return to the original application baseline.
- SHA-256 comparison confirms all 22 integrated PNGs still match their original root files. Dev launcher/fixture classes exist in dev outputs and are absent from main outputs.
- The actual preview task launches and reports 22/22 textures loaded. No Stage 2B test failures remained.

## Screenshots and limitations

Ten framebuffer screenshots were generated under `lwjgl3/build/impostor-check/screenshots`, using `impostor-{3|4}players-{width}x{height}.png`. Required captures:

- impostor-3players-1920x1080.png
- impostor-4players-1920x1080.png
- impostor-4players-1280x720.png

Those three captures were inspected: one horizontal row, correctly attached papers, readable sample text, consistent spacing, and clearance from the clock, timer and hanging lamp. These are real rendered framebuffer captures, not desktop screenshots. Manual visual approval by the user is still required. Real portraits cannot be approved until suitable assets exist. Extremely long words remain inside the paper by shrinking, so their readability necessarily decreases at small window sizes; sample clues fit without clipping. Avatar resolver/asset ownership integration with future production player artwork remains future work.

Stage 2B stops here. No gameplay or Stage 3 has started.
