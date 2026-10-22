# THE IMPOSTOR — Stage 8 visual and audio polish

## Audit and boundaries

Inspected Stage 5 clue/history handling and paper flip, Stage 6 FinalVoting/FinalVotePresentation/FinalRevealTiming, Stage 7 immutable results/replay/lobby, the existing 1920×1080 FitViewport, reduced-motion preference, phone controllers, room state machine and all asset/audio paths. Existing Stage 5–7 functionality is real, with tests and same-room replay support; the earlier reports were checked against source. No server phases, deadlines, role assignment, vote counting, victory conditions, artwork or main-menu design were changed.

Reused PaperRevealController, FinalVotePresentation's absolute server-time stamp timeline, ImpostorRoomBackground's subtle illumination, ImpostorLifecyclePanel's result entry and GameSettings.reducedMotion. There was no existing libGDX Sound/Music manager and no WAV/OGG/MP3 audio assets in assets. Missing portrait artwork and the separate Stage 5 participant outline remain earlier visual limitations, not reasons to rewrite the minigame.

## Visual changes

- Added bounded PhaseTransition: configurable FADE_IN, FADE_OUT, DARKNESS, ZOOM, SLIDE and PAUSE styles; cancellation, replacement, deduplication by phase key, pause and restored-state suppression. No queues, gameplay callbacks or network traffic. Production uses short darkness transitions and a restrained result zoom. Other styles are available and tested; they are not all applied to every phase.
- Short ROUND 1/2/3 introductions on the existing host canvas. They never cover or disable phone input and do not add a pre-round wait or alter the server's answer deadline.
- Added 22 fixed dust particles at the left room margin. No dust crosses player cards, vote papers or timer. Existing room lighting is retained. The cinematic veil is temporary, low opacity, and never permanently dims the UI.
- Participant avatar actors, when supplied, drift vertically by at most 0.65 virtual pixels. Paper geometry/proportions/order remain unchanged; newly authorized clue text settles in after the flip midpoint.
- Existing 400 ms impact spacing and one persistent independent red imprint per vote remain intact. Stamp descent now accelerates; a small parchment recoil accompanies the existing ink pulse. No vote counters replace marks. Reduced motion disables stamp travel/recoil while retaining the authoritative reveal schedule and all imprints.
- Suspect and identity detail text has a short 600 ms dramatic hold, within the existing server presentation phases. Names/identity still come only from authorized snapshots. Tie handling is untouched.
- Results retain the Stage 7 layout with a restrained title scale entry. Reduced motion makes the result content immediately visible.
- Final-five-second timer emphasis uses existing server-time estimates, never a replacement timer or client phase transition. Reconnection suppresses obsolete warning cues.
- Phone CSS adds touch press feedback, desktop-only hover, smoother selected/confirmed states, private-role/round/identity/result entries and a gentle timer warning. Reduced-motion media queries remove motion and retain a static warning underline. No private data was added to public snapshots or CSS attributes.
- Fixed the phone draft loss on socket failure: one current session/round draft is retained in memory and restored only for that same round. New matches/rounds clear it. Local validation checks only one-word letter syntax/length; secret-word validation remains on the server. Confirmation styling and events require server acceptance.

Transitions do not postpone essential game information. Reconnecting clients restore the current state rather than playing old phase introductions. Resizing retains viewport-relative composition. Pause freezes local effects; resume cancels the interrupted transition. Server timers continue normally.

## Audio system and missing sounds

PresentationAudio owns one optional audio scope per ImpostorScreen. It supports cached loading, playback, clamped SFX volume, master mute, independent ambience mute, pause/resume, idempotent disposal and missing/corrupt-file fallback. Two optional looping ambience tracks crossfade over 1.2 seconds at 22% of the SFX volume. Native sound/ambience toggles and volume +/- controls are confined to the Impostor screen; they do not redesign global settings or menus. These controls are session-local, not persisted settings.

Supported optional OGG paths under `assets/audio/impostor/`:

```
hover.ogg              click.ogg
room_created.ogg       player_joined.ogg
round_intro.ogg        timer_warning.ogg
clue_submitted.ogg     clue_reveal.ogg
voting_start.ogg       vote_confirmed.ogg
stamp_impact.ogg       suspect.ogg
impostor.ogg           victory.ogg
defeat.ogg             lobby.ogg
room.ogg              suspense.ogg
```

Native playback hooks cover minigame UI click/hover, player join, round intro, clue reveal, voting start, live stamp impact, suspect/identity announcement, result outcome cue, lobby return and deadline warning. `room_created`, `clue_submitted` and `vote_confirmed` are supported categories; room creation occurs outside this screen, and private confirmation events are not broadcast to the host. Phones dispatch local `impostor:audio` CustomEvents for accepted clue/vote confirmation, as integration hooks only. There is no phone sound player or fabricated replacement audio.

**None of these audio files currently exist. Actual sounds/ambience are therefore silent.** The audio infrastructure, event hooks and missing-file behavior are implemented; sound production and listening QA remain pending. No sound was downloaded or generated. The existing texture backgrounds, stamps, parchment, clock and fonts were reused without edits.

## Files created

- `core/src/main/java/com/erni/finalanswer/presentation/PhaseTransition.java`
- `core/src/main/java/com/erni/finalanswer/audio/PresentationAudio.java`
- `core/src/main/java/com/erni/finalanswer/impostor/ImpostorAtmosphere.java`
- `core/src/test/java/com/erni/finalanswer/presentation/PresentationCheck.java`
- `docs/impostor/stages/stage-8.md`

## Files modified

- `core/build.gradle`
- `core/src/main/java/com/erni/finalanswer/impostor/ImpostorScreen.java`
- `core/src/main/java/com/erni/finalanswer/impostor/ImpostorParticipantView.java`
- `core/src/main/java/com/erni/finalanswer/impostor/FinalVotePresentation.java`
- `core/src/main/java/com/erni/finalanswer/impostor/ImpostorLifecyclePanel.java`
- `web/app.js`, `web/impostor.js`, `web/final-voting.js`, `web/style.css`
- `lwjgl3/src/test/java/com/erni/finalanswer/lwjgl3/ImpostorCheck.java`
- `tools/checks/check_impostor_lifecycle_browser.cjs`

## Tests and evidence

Commands:

```sh
./gradlew :core:presentationCheck :lwjgl3:compileTestJava :server:test
./gradlew build :lwjgl3:impostorCheck :lwjgl3:playCheck
./gradlew :server:impostorBrowserFixture -PimpostorManualClock=true
IMPOSTOR_POLISH_QA=1 PLAYWRIGHT_MODULE=/path/to/playwright CHROME_PATH=/path/to/chrome node tools/checks/check_impostor_lifecycle_browser.cjs
```

PresentationCheck uses fake audio devices: transition completion/interruption/cancellation/deduplication/pause/restoration/reduced motion, missing-file fallback, cue cache, mute, independent ambience mute, bounded volume, fades/crossfade, stop and disposal. It is wired into core check/build. No audio hardware is required, and this does not claim audible playback was tested.

Existing server tests remain: 92 tests, no failures/errors. Rules/security tests were not removed. Native OpenGL checks exercise existing paper/stamp animation, resized captures, reset/navigation/disposal, result panels and texture lifecycle. Stage 8 adds nonblocking round introductions, paused/cancelled effects, no texture allocations across atmospheric frames, unchanged authoritative phase, one cue per live impact, no duplicate/obsolete reconnect impact cues, and reduced-motion stamp preservation. Existing PLAY, round/clock and inspector checks run as regressions.

Real Chromium + Javalin: six consecutive matches in one room; three with 3 active + 3 spectators and three with 4 active + 2 spectators. Caught/escaped/no consensus for each roster, four replay transitions and two lobby returns. Stable room code/identity/players, correct personal/spectator results, private host/spectator state checks, socket failure with typed draft recovery, reconstructed current phase without obsolete CSS animation, reduced-motion spectator and no browser page errors. Host commands use an authenticated test browser socket, not a manual desktop button session. Only time advancement uses the test fixture; gameplay submissions and host actions use real WebSockets.

Reports/captures:

- `server/build/reports/tests/test/index.html`
- `server/build/impostor-browser/stage8-report.json`
- `server/build/impostor-browser/stage8-match-*.png`
- `lwjgl3/build/impostor-check/screenshots/stage8/`
- Existing Stage 6/7 capture directories are refreshed by native checks.

## Performance and limitations

Fixed 22-particle arrays, two one-pixel overlay textures allocated once per screen, cached optional audio, reused existing actors/textures and a single transition timeline. No per-frame file loading, new textures, particles, animation queues or network messages. Screen disposal releases overlay/audio resources; texture lifecycle is checked. No instrumented FPS/heap benchmark was performed, so no specific FPS claim is made.

The Stage 5 participant-outline PNG is still pending. The supplied portrait frame is a different existing asset. Actual character portraits are still absent; avatar motion runs only when an avatar actor is supplied. No silhouettes or new character artwork were fabricated. Sound assets, physical-device/Safari QA and audible mixing QA remain pending. Browser CSS feedback and native rendering are tested separately; manual desktop-host-to-physical-phone interaction was not performed.

## Launch and test

Normal server/desktop:

```sh
./gradlew :server:run
./gradlew :lwjgl3:run
```

Create a normal room, open THE IMPOSTOR in its lobby, connect separate browser sessions/phones, select exactly 3/4 active participants, START MATCH. Inspect round entries and the final-five-second warning, finish three clue rounds, vote, watch one separate mark per accepted vote, suspect/identity reveal and results. Test PLAY AGAIN → START MATCH and RETURN TO LOBBY with the same connected phones. Enable reduced motion in existing Settings; on phones use the OS/browser reduced-motion preference.

Isolated development host:

```sh
./gradlew :server:impostorBrowserFixture -PimpostorFixtureHost=0.0.0.0
python3 tools/dev/impostor_fixture_control.py info
./gradlew :lwjgl3:impostorPreview -PimpostorConnection=/Users/erni/Documents/FinalAnswer/server/build/impostor-browser/ready.json
```

Do not enable manual clock for human play. The fixture lasts ten minutes. Use the computer LAN address for physical phones and keep ready.json host credentials local. Offline preview `./gradlew :lwjgl3:impostorPreview` retains existing F/D/V and F3/F4 development controls.

Audio controls are visible in the lower-right of the Impostor screen. They are silent until suitable licensed audio files are supplied at the documented paths. Stage 9 was not started.
