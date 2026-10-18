# THE IMPOSTOR — Stage 1

## Existing architecture

- Java 21 Gradle modules: `core` (libGDX client), `lwjgl3` (desktop backend), `shared` (pure Java questions and Gson protocol), `server` (Javalin HTTP/WebSocket server), `inspector` (independent development source browser).
- Desktop entry: `Lwjgl3Launcher` → `FinalAnswerGame.create()`. Existing `PlayPreviewLauncher` provides a separate local presentation preview. No mobile-native module exists.
- `FinalAnswerGame` caches MainMenu, RoomSettingsScreen, GenerationCodeScreen, SettingsScreen and PlayScreen. Navigation uses libGDX `Game.setScreen`; hiding does not dispose cached screens. The application explicitly disposes them at shutdown.
- Screens render Scene2D stages, with stage-owned batches and viewports (PlayScreen uses 1600×900 FitViewport). Custom actors handle the presentation.
- No existing AssetManager. Texture ownership is local to screens/actors. `RuntimeTextures` resolves build-prepared display textures and remembers original crop sizes; it does not own or deduplicate textures. `prepareRuntimeTextures` creates derivatives for selected existing asset groups. Impostor assets currently load original PNGs through the same loader.
- Existing animation facilities include Scene2D actors/actions, AnimatedImageButton, CyclingRoomBackground, ClockTimeline/ClockTimerActor, QuestionPresentationController, CinematicQuestion, TypewriterText and AnswersPresentationActor. None need modification for Stage 1.
- Trivia state uses RoundPhase/RoundController/RoundClock locally and GameSession on the server. NetworkRoundAdapter applies server snapshots to the host presentation. Settings and active room state belong to FinalAnswerGame.
- RoomApiClient handles room HTTP operations; RealtimeClient maintains an authenticated WebSocket and marshals callbacks onto the render thread. Shared Protocol defines existing wire messages.
- RoomServer serves HTTP, WebSocket and web controller files. RoomService serializes room/player commands, credentials, reconnects and deadlines; GameSession owns authoritative per-room trivia state. Rooms live in one process in memory. A scheduled tick advances existing server state.
- `web/index.html`, `web/app.js`, `web/style.css` implement the browser/phone controller, with sessionStorage credentials, HTTP join and WebSocket snapshots/answer submission. There is no Impostor phone UI yet.
- GameMode declares five room modes; StandardMode is descriptive metadata. No reusable mini-game lifecycle or mini-game engine exists. Stage 1 therefore uses an isolated screen and state, without adding a framework or changing room modes.

## Foundation and ownership

`shared/.../gameplay/impostor/ImpostorPhase` declares all 11 requested phases. Immutable `ImpostorState` is a pure Java snapshot holder initialized to INTRO; it defines no transitions, clocks, participants, secrets or protocol messages. Future server logic can use the same model without depending on libGDX.

`core/.../impostor/ImpostorAsset` is the single path registry. `ImpostorAssets` loads once per owner, returns optional borrowed textures, exposes availability and per-asset failure reports, and disposes successfully loaded textures exactly once. Actors must not dispose borrowed textures. All asset operations run on the render thread. Missing/corrupt files are logged independently and do not abort loading.

`ImpostorScreen` owns a Stage, font and asset scope. It uses a 1600×900 FitViewport and displays only a development status label. ESC uses the existing menu navigation. Hiding retains assets for reentry; the caller disposes the screen after it is no longer active. The dev launcher owns this lifecycle. A future production navigation owner must adopt that responsibility explicitly. No production screen is modified or loads Impostor assets during startup.

## Asset audit

The supplied files were at repository root, not under `assets/impostor`. All 22 were copied byte-for-byte into the six requested groups; originals were retained. Transparency and source PNG data are unchanged. No assets were generated or substituted.

| Requested name | Actual integrated path | Finding |
| --- | --- | --- |
| clock1.png | impostor/clock/clockmini.png | Supplied mini-game clock; existing root clock1.png belongs to the older clock series |
| stamp_mark.png | impostor/voting/suspect_print.png | Inspected red question-mark stamp impression |
| envelope_closed.png | impostor/envelopes/envelop1.png | Inspected closed envelope |
| envelope_sealed.png | impostor/envelopes/envelop2.png | Inspected wax-sealed envelope |
| envelope_open.png | impostor/envelopes/envelop3.png | Inspected open envelope |
| screenmessager.png | impostor/phone/screenmessanger.png | Actual supplied spelling |

All other names match the request. All 22 registered assets exist and load with real GL. No unresolved missing asset remains after these explicit mappings. The exact requested alternate filenames do not exist in the integrated groups; code uses actual filenames.

## Files created

Java paths relative to their source root:

- shared/src/main/java/com/erni/finalanswer/gameplay/impostor/ImpostorPhase.java
- shared/src/main/java/com/erni/finalanswer/gameplay/impostor/ImpostorState.java
- core/src/main/java/com/erni/finalanswer/impostor/ImpostorAsset.java
- core/src/main/java/com/erni/finalanswer/impostor/ImpostorAssets.java
- core/src/main/java/com/erni/finalanswer/impostor/ImpostorScreen.java
- lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/ImpostorPreviewLauncher.java
- lwjgl3/src/test/java/com/erni/finalanswer/lwjgl3/ImpostorCheck.java
- docs/IMPOSTOR_STAGE_1.md

Asset paths:
- assets/impostor/backgrounds/background1.png
- assets/impostor/backgrounds/background2.png
- assets/impostor/backgrounds/background3.png
- assets/impostor/clock/arrow_clock1.png
- assets/impostor/clock/clockmini.png
- assets/impostor/clock/timer_rectangle.png
- assets/impostor/envelopes/envelop1.png
- assets/impostor/envelopes/envelop2.png
- assets/impostor/envelopes/envelop3.png
- assets/impostor/papers/papper_player_back.png
- assets/impostor/papers/papper_player_front.png
- assets/impostor/papers/suspect_papper.png
- assets/impostor/phone/message.png
- assets/impostor/phone/pen.png
- assets/impostor/phone/phone1.png
- assets/impostor/phone/phone2.png
- assets/impostor/phone/phone3-rd.png
- assets/impostor/phone/phone3.png
- assets/impostor/phone/phone4.png
- assets/impostor/phone/screenmessanger.png
- assets/impostor/voting/stamp.png
- assets/impostor/voting/suspect_print.png

## Files modified

Only `lwjgl3/build.gradle`: adds the isolated dev source set, `impostorPreview`, and `impostorCheck`. No dependencies were added. The preview launcher is absent from main outputs and normal production packaging. Normal PLAY, room creation, main menu, server and wire protocol are unchanged.

## Verification (2026-10-18)

Successful:

```sh
./gradlew :lwjgl3:classes :lwjgl3:devClasses :lwjgl3:testClasses :core:roundCheck :core:clockCheck :server:test :inspector:check
./gradlew :lwjgl3:impostorCheck :lwjgl3:playCheck
./gradlew :lwjgl3:devClasses
./gradlew :lwjgl3:impostorPreview
```

- Server: 24 tests (23 RoomServiceTest, one real HTTP/WebSocket TransportTest), zero failures/errors/skips.
- Existing round, clock and inspector checks passed. Existing real graphical PLAY regression passed.
- Real graphical Impostor regression passed: 22/22 textures, stable repeated load, simulated missing and corrupt PNGs (expected error logs, 20/22 loaded), unaffected asset loading, empty retrieval on failure, INTRO state, rendering, resize, return to menu through ESC, reentry, recreation and idempotent disposal. Managed texture count returned to baseline after each disposed scope/screen.
- SHA-256 comparison confirmed all 22 copied PNGs match root originals. Checked launcher class exists in dev outputs and is absent from main outputs.
- Actual development launch task opened the scene and reported 22/22 assets loaded. Graphical runtime checks used real libGDX/OpenGL; no manual visual layout approval is claimed.
- Initial sandboxed Gradle attempt failed on the external Gradle cache lock (Operation not permitted). Repeated with approved cache access; verification then passed.

## Launch

From repository root with JDK 21:

```sh
./gradlew :lwjgl3:impostorPreview
```

ESC returns to the existing main menu. Relaunch the task for a fresh preview; no menu shortcut is installed. No server or trivia match is required. Production `:lwjgl3:run` is unchanged. To repeat the graphical lifecycle regression: `./gradlew :lwjgl3:impostorCheck`.

## Limits and Stage 2 handoff

Only state vocabulary, immutable initial state, isolated 16:9 scene, asset registry/ownership, dev launch and verification are prepared. Full-resolution asset loading is synchronous on first entry, consistent with existing loaders; there is no loading UI yet. Textures stay resident while a screen is cached and are freed by its owner. No final composition or animation has been designed or visually approved.

There are no gameplay transitions, timers, role assignment, words, clues, suspicions, votes, phone inputs, network messages, dictionary integration, elimination or follow-up challenges. Participant storage and server-authoritative rules remain future work; no fixed player count is introduced. Stage 2 can build the scene and actors using typed assets and the existing Stage, and extend shared snapshots/server logic when authorized. Stage 2 has not started.
