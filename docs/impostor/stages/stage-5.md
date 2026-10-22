# THE IMPOSTOR — Stage 5 implementation and verification

Status: server/controller/reveal integration implemented and tested end-to-end. The participant-outline redesign is **blocked by the missing source PNG**. Stage 5 is therefore not fully complete. No Stage 6 functionality was added.

## Inspection and existing systems

Stage 4 exists: authoritative room-scoped suspicions, authenticated requests, frozen spectator eligibility, private accepted selections, browser cards, envelopes, timer, server/transport/browser tests and native graphical checks. Its original suspicion-only trusted hooks remain compatible.

The existing Java 21 modules (core, lwjgl3, shared, server, inspector), RoomService lock/authentication, Javalin server, Protocol envelope, browser controller, RealtimeClient, scoped ImpostorAssets, Scene2D FitViewport and PaperRevealController are reused. Production room creation, five room modes, normal PLAY and trivia rules were not changed. No dependencies or second server were added.

There is still no production roster-selection or menu handoff. The new trusted Java entry is:

```java
String session = rooms.startImpostorGame(roomCode, explicitlyAssignedPlayerIds);
```

This validates exactly three/four distinct existing connected non-host players and rejects running trivia/Impostor sessions. Remaining players are spectators. It does not invent a selection policy or expose a start command to phones. Existing Stage 4 installImpostorSession/startPreliminarySuspicion hooks remain for suspicion-only integration; they cannot bypass real-game reveal transitions.

## Server roles and words

ImpostorSession owns hidden role/word data, clue collection/history, shared phase vocabulary, deadlines and reveal sequence. SecureRandom chooses exactly one active impostor. WordSource is replaceable and injected through the RoomService constructor; its default selects from a small server-only development list. IMPOSTOR_WORDS may configure comma-separated single words. The selected word stays constant through the session.

RoomService manually builds personalized snapshots, never serializing the session model. Only an ordinary participant gets `role: ORDINARY` and `secretWord`. The impostor gets `role: IMPOSTOR` without a word. Spectators and the host receive neither. Public HTTP snapshots contain neither roles nor the word. No full role map is broadcast. Closing a session clears its hidden word/identity and pending collection.

Privacy limitation: generic invalid-clue errors and a three-attempt budget per player per round limit validation probing, but rejecting an exact secret while confirming other valid words necessarily creates a bounded guess-check signal. Generic wording cannot mathematically remove that signal. This implementation does not claim oracle-free validation. A stronger policy would require changing acceptance/feedback rules. The development word list should be replaced before production play.

## Clue validation and requests

New additive message within Protocol version 1:

```json
{"type":"SUBMIT_CLUE","requestId":"unique-request","payload":{"roomCode":"ABCDEF","sessionId":"server-session","round":1,"clue":"ТЕПЛО"}}
```

Exactly those four payload fields are accepted. No client identity/timestamp field is accepted. The authenticated socket binding determines the player. The server validates room, session, numeric round 1–3, phase, deadline, active membership and absence of a prior accepted submission. Spectators/host cannot submit. Rejected or repeated packets cannot replace an accepted clue.

Text is NFC-normalized, uppercased with Locale.ROOT and limited to 24 Unicode code points after normalization. It must contain only letters: empty text, whitespace, punctuation, control characters, HTML, emoji and excessively long input are rejected. Canonically equivalent Cyrillic/Latin spellings normalize consistently. Secret-word equality and the same player's previous revealed clues are checked server-side. All semantic/format failures use INVALID_CLUE, never a secret-specific reason. Invalid attempts consume the three-attempt budget; exhaustion yields the same generic rejection, then a missing marker if no clue was accepted.

Events: IMPOSTOR_STARTED, IMPOSTOR_UPDATED, CLUE_ACCEPTED, CLUE_REJECTED and IMPOSTOR_CLUES_REVEALED. Rejections retain request correlation. Error codes also include CLUE_ALREADY_SUBMITTED, CLUE_ROUND_CLOSED, STALE_IMPOSTOR_SESSION, NOT_ELIGIBLE, WRONG_ROOM and AUTH_REQUIRED. Existing suspicion/trivia contracts remain intact.

The nested mini-game snapshot adds phase, round, deadline, revealSequence and revealedClues. Each revealed round is a stable-ID → clue map; only finalized rounds are included. Personalized fields add activeParticipant, clueSubmitted and ownClue, plus the private role fields above. During collection, neither public viewers nor other players receive pending clues. Suspicion targets remain private and separate from clues/final votes.

## Authoritative progression and timing

All commands, deadline checks and transitions execute under the existing RoomService lock. Clients never advance production phases.

- ROLE_REVEAL: four seconds; the private role/word remains available afterward.
- ROUND_CLUE_INPUT: exactly 10 seconds, for rounds 1, 2 and 3.
- When every active participant submits, finalize immediately; spectators are excluded from completion.
- At timeout, finalize once with `—` for missing clues. Disconnects do not remove active slots.
- ROUND_CLUE_REVEAL: 500 ms, matching the existing visual flip.
- PRELIMINARY_SUSPICION: existing five-second private Stage 4 voting, including connected spectators frozen at phase entry.
- Finalized suspicion retains a 1.85-second presentation hold for envelope close/seal. Then start the next clue round, or EVIDENCE_REVIEW after round 3.
- EVIDENCE_REVIEW stops progression. No final vote, elimination or final guess is implemented.

Ticks cross at most one phase boundary, so a delayed tick cannot skip presentation phases. Duplicate submissions and deadline races cannot finalize twice. Suspicion early completion includes spectators, with the existing stable-ID reconnect/frozen-eligibility policy. Previous clue/suspicion rounds remain isolated and retained.

## Phone controller

The existing web application gains a separate Impostor controller section and component, without replacing trivia or suspicion screens. It shows personalized role information, the round, a large one-word field, Enter/button submission, server-based countdown and accepted-clue confirmation. Accepted inputs lock; no other clues appear before reveal. Spectators see a watching screen and no input/hidden role data. After reveals, the existing suspicion cards appear.

All dynamic text uses textContent or input.value, never HTML injection. Pending requests disable duplicate taps. Rejections leave input editable when permitted; timeout requests SYNC instead of asserting acceptance. Server snapshots restore private roles, accepted clues and suspicion choices after reload/reconnect. Phase messages take precedence over accepted-input status. Automatic focus is attempted once per input round. Existing server-time extrapolation and visibility/reconnect synchronization remain authoritative.

## Host reveal and rendering

ImpostorSuspicionAdapter now bridges complete real-game snapshots as well as the original suspicion-only snapshots. It binds the explicit server roster by stable IDs and consumes monotonic revealSequence values. A new reveal supplies one shared PaperRevealController event; duplicate snapshots do not restart animation. Reconnects can restore only already-public clue history. Input-phase transitions flip papers back before the next reveal.

PaperRevealController still uses 0.50 seconds, smootherstep and positive horizontal width scaling around the paper's vertical centerline. Texture switching remains at the midpoint; text scales with the paper. There are no per-participant timelines or new texture owners. The small restore API handles public history without replaying gameplay decisions.

During clue collection the existing gothic timer displays ДО КОНЦА РАУНДА and server-deadline seconds. Clock geometry, fixed hand, panel, typography and ambient lighting remain unchanged. The existing suspicion label/envelope presentation is preserved. Textures/fonts are not recreated in rendering; native network callbacks remain on the render thread.

## Participant redesign — blocked

No impostor_participant_outline.png, similarly named outline PNG, or additional supplied participant artwork exists in the repository. The existing asset is impostor_avatar_frame.png (1297×1212), which is the old portrait frame and is not the requested outline. No source PNG was edited, fabricated or silently substituted. A filename/location clarification was requested while independent implementation continued.

Consequently the existing portrait layout is preserved pending the actual outline and inspection of its alpha/geometry. No claim is made that the new outline loads, was visually approved, or has tested coordinates. Avatar artwork is still absent; the existing avatar-factory integration remains, with empty openings rather than fake production characters.

Current retained 1920×1080 layout: TOP_PLAYERS = (260,744,1240,240). Each logical group is 360×240. Three groups use scale 1 and gap 64, starting at x=276,700,1124; four use scale 0.819444, width 295 and gap 20, starting x=260,575,890,1205. Children retain their Stage 2B relative frame/nameplate/paper bounds; nickname text comes from the assigned stable-ID player's name. The paper is at (208,28), width 152 and natural 1120:1404 ratio. Clock/timer remain clear to the right. These are retained coordinates, not a proposed substitute outline design.

## Development launch and controls

Offline, with no server:

```sh
./gradlew :lwjgl3:impostorPreview
```

F3/F4: three/four sample participants. R: reveal next sample round. B: flip back. N: reset. V: suspicion/envelope demonstration. ESC: menu. Added D: begin a ten-second collection demonstration; C: simulate one participant's accepted clue. Repeated C reaches early completion; allow D to expire with fewer C submissions to reveal missing markers. Use B between rounds and N to restart after three. These simulations/sample words exist only in the dev source set.

Live local multiplayer, using the actual Javalin server, browser application and native adapter:

```sh
# Terminal 1: test-classpath fixture; real monotonic deadlines by default
./gradlew :server:impostorBrowserFixture
# Terminal 2: print controller URL and room code (never the host token)
python3 tools/dev/impostor_fixture_control.py info
# Open that URL in independent browsers/phone sessions, join at least three players.
python3 tools/dev/impostor_fixture_control.py players
# Open the native host in another terminal before starting, using the absolute ready.json path:
./gradlew :lwjgl3:impostorPreview -PimpostorConnection=/Users/erni/Documents/FinalAnswer/server/build/impostor-browser/ready.json
# Then pass exactly 3/4 explicit IDs printed above; remaining joined players spectate:
python3 tools/dev/impostor_fixture_control.py start --players ID_A ID_B ID_C
# To test another roster, create a new fixture room, rejoin, select explicit IDs again:
python3 tools/dev/impostor_fixture_control.py new
python3 tools/dev/impostor_fixture_control.py stop
```

After `new`, close/relaunch the native preview to use the new room credentials. The automated native check reconnects between rooms itself.

Live mode installs no F3/F4/R/B/N/V/C/D controls. ESC remains available. The ready file contains a local host credential and is owner-readable/writable on POSIX systems; it is outside served web resources and production assets. Do not share it with player browsers.

For physical LAN phones, explicitly start the fixture with `-PimpostorFixtureHost=0.0.0.0`, then use the computer's LAN IP with the printed port instead of 127.0.0.1. Native host/control commands can continue using loopback. The fixture has a ten-minute lifetime. No browser-accessible admin endpoint or new production mode/start button exists. Production orchestration should call the trusted Java hook after assigning the roster.

## Files created for Stage 5

- server/src/main/java/com/finalanswer/server/game/WordSource.java
- server/src/test/java/com/finalanswer/server/ImpostorGameTest.java
- server/src/test/java/com/finalanswer/server/ImpostorBrowserFixture.java
- web/impostor.js
- tools/checks/check_impostor_browser.cjs
- tools/dev/impostor_fixture_control.py
- lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/ImpostorCluePreview.java
- lwjgl3/src/test/java/com/erni/finalanswer/lwjgl3/ImpostorNetworkCheck.java
- docs/impostor/stages/stage-5.md

## Files modified for Stage 5

- server/src/main/java/com/finalanswer/server/game/ImpostorSession.java
- server/src/main/java/com/finalanswer/server/rooms/RoomService.java
- server/src/main/java/com/finalanswer/server/RoomServer.java
- server/build.gradle
- core/src/main/java/com/erni/finalanswer/impostor/ImpostorScreen.java
- core/src/main/java/com/erni/finalanswer/impostor/PaperRevealController.java
- core/src/main/java/com/erni/finalanswer/network/ImpostorSuspicionAdapter.java
- lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/ImpostorPreviewLauncher.java
- lwjgl3/src/test/java/com/erni/finalanswer/lwjgl3/ImpostorCheck.java
- lwjgl3/build.gradle
- web/app.js
- web/index.html
- web/style.css
- web/suspicion.js

Earlier stages were already present as uncommitted/untracked changes. This report lists Stage 5 work, not the whole working-tree diff.

## Verification

Passed:

- Server suite: 59 tests, zero failures/errors/skips (23 original RoomService, one original transport, 17 Stage 4 suspicion, one suspicion transport, 17 new Impostor tests).
- New tests cover three/four roles, exact single impostor, public/host/impostor/spectator privacy, pending-clue privacy, valid/invalid/malformed clues, Unicode, secret/repetition rejection, duplicate/spoofed/wrong-room/wrong-session/wrong-round/unauthorized submissions, eligibility, deadline/missing markers, concurrent final submissions, reconnects, full three-round suspicion progression, room isolation, attempt limits and cleanup.
- Real mobile Chromium: three active + two spectators and four active + two spectators. Existing HTTP join/auth/WebSocket/controller, private role delivery, no leaked secret in impostor/spectator frames, Enter and button, generic rejection, accepted lock, reload restoration, early completion, missing-clue timeout, all three reveal histories, spectator suspicion and evidence review passed. This uses the actual server with a test-controlled server clock for reliable short-phase inspection.
- Native OpenGL host + those real browsers: both participant counts reached three revealed rounds/EVIDENCE_REVIEW; hidden role fields were absent from host state. The host reconnected between separate fixture rooms.
- ImpostorCheck: original asset/degraded-resource/flip/suspicion/lifecycle checks plus authoritative roster/timer, sequence deduplication, restored history, three/four network-driven presentations and offline D/C early-completion/timeout controls. Captures at 1920×1080, 1280×720 and 1024×768; earlier five-resolution composition checks retained.
- Existing Stage 4 real-browser suspicion regression passed for three/four active players plus two spectators, including private replacement, rejection, reconnect, deadline, early completion and room closure.
- Existing PLAY graphical regression, core round/clock checks and inspector checks passed.
- Offline preview launched successfully and loaded 23/23 existing textures.

Commands:

```sh
./gradlew :server:test :lwjgl3:impostorCheck :lwjgl3:playCheck :inspector:check
./gradlew :lwjgl3:impostorPreview
# Automated integrated QA (three terminals):
./gradlew :server:impostorBrowserFixture -PimpostorManualClock=true
./gradlew :lwjgl3:impostorNetworkCheck
node tools/checks/check_impostor_browser.cjs
```

The Node script supports PLAYWRIGHT_MODULE and CHROME_PATH for an existing Playwright/Chrome installation; no dependency was added. It stops the fixture on completion. The native check must start before the browser script. Manual-clock fixture settings are test-only; production and default fixture deadlines use the server monotonic clock.

Initial verification failures were fixed: a JUnit helper needed Runnable::run conversion; a browser assertion waited for a transient accepted state after immediate finalization; accepted-input status incorrectly masked later reveal/evidence messages; the two-room native QA harness initially did not reconnect to the newly created fixture room. Final checks pass. Deliberate missing/corrupt-texture errors in ImpostorCheck are expected degraded-resource tests.

Screenshots:

- lwjgl3/build/impostor-check/screenshots/stage5/: 3/4 player initial and round 1/2/3 authoritative presentations at the three requested resolutions.
- lwjgl3/build/impostor-network-check/: 3players-real-network.png and 4players-real-network.png from actual browser-driven sessions.
- server/build/impostor-browser/: mobile role and round 1/2/3 screenshots for three/four active participants.

The desktop four-player and mobile captures were inspected for clipping and readability. They still show the old portrait frame because the new asset is missing. No perfect visual/animation approval is claimed. Physical phones and Safari were not tested; Chromium touch emulation was used. Existing PNG sources remain unchanged. Storage remains in-memory and production roster/menu integration remains an explicit boundary. The missing outline and validation feedback tradeoff are outstanding limitations, not completed guarantees.
