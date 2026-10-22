# THE IMPOSTOR — Stage 4: preliminary suspicions

## Delivered scope

Added a server-authoritative, private preliminary suspicion system, browser selection interface, aggregate shared-screen envelope presentation and isolated development preview. It supports exactly three or four active participants and any number of spectators within the existing room capacity (currently eight room players, excluding the host). No preliminary selection affects elimination, scores, winners or final votes.

Existing trivia, normal PLAY, room creation, menu appearance and controller screens for other phases remain intact. No role, secret-word, real clue input, final voting/weighting, final guess or Stage 5 functionality was implemented.

## Existing architecture and integration boundary

RoomService remains the sole synchronized room registry, owning membership, session authentication and serialization of submissions/deadlines. The existing Javalin RoomServer, authenticated WebSocket bindings, protocol envelope, rate limits, monotonic server clock and scheduled tick are reused. No second server or extra production endpoint was introduced.

The current server has no Impostor participant assignment or clue-round orchestration. Therefore this stage does not invent a selection algorithm or expose a client start command. Two trusted in-process hooks prepare a separately scoped mini-game:

```java
String sessionId = rooms.installImpostorSession(roomCode, explicitlyAssignedActiveIds);
// Only after trusted orchestration has completed this clue round's reveal:
rooms.startPreliminarySuspicion(roomCode, sessionId, roundNumber);
```

Installation validates three/four distinct existing connected non-host player IDs. It is mutually exclusive with the existing trivia GameSession and another installed Impostor session, so it cannot disturb a running trivia match. The session's phase becomes READY, then PRELIMINARY_SUSPICION, then SUSPICION_FINALIZED. Top-level trivia phase fields and shared planned ImpostorPhase/ImpostorState are not repurposed. All mini-game state lives under the optional `impostor` snapshot field.

Starting the next suspicion round is a separate trusted call, sequentially restricted to rounds one through three after the previous phase is finalized. Finalization does not fabricate ROUND_CLUE_INPUT or EVIDENCE_REVIEW transitions. Production roster assignment, trivia-to-mini-game handoff and orchestration after real clue reveals remain integration dependencies for a later authorized stage.

## Server model, eligibility and deadlines

ImpostorSession belongs to a RoomService.Room and has its own generated session ID and explicit active-ID set. Each SuspicionRound retains room ID, session ID, round, server deadline, frozen eligibility and latest selection per voter. Previous rounds are retained separately. A missing selection means NOT_SUBMITTED/abstention; current snapshots expose a private hasSubmitted boolean. Full maps are accessible only through a server-side audit API and are never serialized in room snapshots. No final-vote map exists.

Each deadline is the monotonic server start time plus exactly 5000 milliseconds. All submit validation and ticking occur under the existing RoomService lock. The server ignores client clocks and derives the voter exclusively from the authenticated Peer binding; requests cannot specify a voter identity.

Eligibility policy:

- Freeze all connected, non-left, non-host room players at phase start, including active participants and spectators.
- Only the three/four assigned active players may be suspects; self-selection is forbidden.
- Latest valid selection replaces the previous one, without increasing the submitted total twice.
- Disconnect/reconnect does not shrink or expand the frozen set. Accepted selections remain attached to stable IDs.
- A disconnected abstainer remains in the denominator until the deadline. This prevents disconnect manipulation of early completion.
- A player connecting after phase start is not added until a subsequent phase. Explicit departures retain this phase's data but invalidate that session's further commands.
- Early completion happens only when every frozen eligible voter submitted, including spectators. Then further changes are rejected. Otherwise the phase ends at the deadline, including abstentions.
- Room closure/shutdown closes the mini-game and invalidates existing socket bindings through the existing lifecycle.

The host is a coordinator, consistent with the existing room model, and is not a voter or suspect. No spectator final-vote weighting is assumed.

## WebSocket contract and privacy

Protocol version remains 1: these are additive events/optional fields within the existing envelope. New submission:

```json
{
  "type": "SUBMIT_SUSPICION",
  "requestId": "unique_request_id",
  "payload": {
    "roomCode": "ROOM_CODE",
    "sessionId": "SERVER_SESSION_ID",
    "round": 1,
    "suspectId": "ACTIVE_PLAYER_ID"
  }
}
```

Exactly these four payload keys are accepted, with strict string/integer types. Extra voter/timestamp fields, missing values, numeric strings, invalid rounds and malformed targets are rejected. AUTH_REQUIRED, WRONG_ROOM, INVALID_SUSPICION, STALE_SUSPICION, NOT_ELIGIBLE, INVALID_SUSPECT, SELF_SUSPICION, SUSPICION_TOO_LATE and SUSPICION_CLOSED distinguish validation failures. Existing decode/rate-limit/authentication behavior is unchanged.

Events: IMPOSTOR_SESSION_READY, SUSPICION_STARTED, SUSPICION_UPDATED, SUSPICION_ACCEPTED, SUSPICION_REJECTED and SUSPICION_FINALIZED. Accepted/rejected replies correlate through requestId. Started/updated/finalized events contain the usual individually filtered room snapshot.

The nested snapshot contains sessionId, phase, round, deadline, eligibleCount, submittedCount and the active participant descriptors (id/name/characterId). Only the receiving authenticated player additionally gets eligible, hasSubmitted and their own selectedSuspectId. The public HTTP room view and host do not receive someone else's selected target. Broadcasts do not include raw maps, per-suspect totals, individual submission flags, roles or words. SubmittedCount counts voters, not voting weight.

## Phone controller

The existing vanilla JS controller now handles the optional nested mini-game snapshot before its unchanged trivia screens. The new CHOOSE A SUSPECT screen has a server-timed countdown, aggregate X/Y progress and three/four large touch cards using participant nicknames. Avatar artwork is not available in this repository, so no substitute character images are displayed.

A click sends one authenticated request immediately, without a confirmation screen. While awaiting acceptance, all cards are disabled and the UI says SENDING; the accepted selected border changes only when a server snapshot confirms it. The already accepted card is disabled against duplicate taps, while other valid cards remain selectable before closure. Self-cards, ineligible voters and ended phases are disabled. Server rejections show an error and retain the previously accepted choice. Timeout triggers SYNC rather than asserting acceptance. Reload/reconnect restores the server's latest private selection. Round changes clear the previous selection. Room closure returns through the existing join flow.

Remaining time is extrapolated from the existing serverTime/performance.now clock, so suspended tabs do not govern the deadline. Returning tabs use the existing SYNC behavior. Request IDs reuse the existing getRandomValues-based generator, including HTTP LAN usage; no new secure-context-only randomUUID dependency was introduced. Browser rendering uses textContent, not nickname HTML.

## Shared-screen presentation

SuspicionSnapshot contains only public aggregate data. The optional ImpostorSuspicionAdapter reads the existing RealtimeClient snapshots and serverNow clock; it is connected explicitly by calling `screen.connectSuspicion(connection)` after opening the appropriate screen. It does not select participants or change production navigation. No production path consumes development counts.

One SuspicionEnvelope Group sits at (660,380), size 600×330 in the existing 1920×1080 composition. Its image is at relative (60,50), size 480×273.213, preserving the 1662×946 PNG ratio. Its counter sits below the envelope. It clears participant frames/papers above, clock/timer to the right and the existing reserved regions.

Asset appearance was inspected, confirming:

- OPEN = envelop3.png
- CLOSED = envelop1.png
- SEALED = envelop2.png

The existing registry mappings and source textures are unchanged. One shared envelope is shown, never one per spectator. Entry fades/scales smoothly over 0.25 seconds. Authoritative finalization selects CLOSED, then SEALED after 0.35 seconds. It fades out after the final hold, hiding at 1.85 seconds and restoring the prior preview timer/context. These are presentation transitions after the server decision, not client voting decisions.

The timer uses the existing panel/font/color, changes its label to ДО КОНЦА ПОДОЗРЕНИЙ and displays deadline-based seconds. It displays zero after finalization; geometry, gothic watch and fixed arrow remain unchanged. If deadline time reaches zero before the server event, the view does not pretend to finalize: it waits for authoritative status. Aggregate updates do not restart the envelope entry animation.

Actors borrow the existing scoped assets/fonts. Rendering does not load textures, create fonts, perform file I/O or allocate an envelope per participant. All cached resources retain the existing disposal behavior.

## Development preview

```sh
./gradlew :lwjgl3:impostorPreview
```

Preserved: F3/F4 choose three/four participants; R reveals clues; B returns papers; N resets; ESC returns to the menu. New: V starts the suspicion demonstration. F3/F4/N cancel the demo safely. Paper state remains intact when the envelope finishes.

ImpostorSuspicionPreview exists only in the dev source set. It simulates aggregate counts for active count plus two spectators, with one abstention, finalizes at five seconds and lets the envelope close/seal/fade. No fake selections or simulated submission logic enter the server. It uses the same aggregate presentation API as the real network adapter. V is a visual entry, not a production bypass around missing clue orchestration.

## Files created

- server/src/main/java/com/finalanswer/server/game/ImpostorSession.java
- server/src/test/java/com/finalanswer/server/SuspicionTest.java
- server/src/test/java/com/finalanswer/server/SuspicionTransportTest.java
- server/src/test/java/com/finalanswer/server/SuspicionBrowserFixture.java
- core/src/main/java/com/erni/finalanswer/impostor/SuspicionSnapshot.java
- core/src/main/java/com/erni/finalanswer/impostor/SuspicionEnvelope.java
- core/src/main/java/com/erni/finalanswer/network/ImpostorSuspicionAdapter.java
- lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/ImpostorSuspicionPreview.java
- web/suspicion.js
- tools/checks/check_suspicion_browser.cjs
- docs/impostor/stages/stage-4.md

## Files modified

- server/src/main/java/com/finalanswer/server/rooms/RoomService.java
- server/src/main/java/com/finalanswer/server/RoomServer.java
- server/build.gradle (test-only local browser fixture task)
- core/src/main/java/com/erni/finalanswer/impostor/ImpostorScreen.java
- lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/ImpostorPreviewData.java
- lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/ImpostorPreviewLauncher.java
- lwjgl3/src/test/java/com/erni/finalanswer/lwjgl3/ImpostorCheck.java
- web/app.js
- web/index.html
- web/style.css

No dependencies, assets, menu artwork, existing player models, trivia rules, room creation settings or protocol-version changes were added.

## Verification results

Passed compilation of affected client/server/shared outputs and dev/test launchers, existing core round/clock checks, Impostor graphical checks, and the existing graphical PLAY regression.

Final server test reports: 42 tests, zero failures/errors/skips:

- RoomServiceTest: 23 existing tests.
- TransportTest: one existing real HTTP/WebSocket test.
- SuspicionTest: 17 new authoritative model/service tests.
- SuspicionTransportTest: one new real HTTP/WebSocket test.

Coverage includes valid active/spectator submission, invalid/self/spectator targets, spoofing/malformed payloads, unauthorized/wrong-room/wrong-session requests, duplicate replacement, strict deadline boundaries, abstentions, early completion including spectators, disconnect/reconnect and retained selection, late connections/frozen eligibility, room closure, concurrency, round/session/room isolation, three/four participant validation, four voters without spectators and preservation of earlier rounds. The new real transport test checks acceptance/rejection, personalized privacy, reconnect restoration, expiration and closure through actual sockets.

Graphical regression covers OPEN/CLOSED/SEALED, dynamic counts with spectators, five-second display/zero/restoration, reentry, reset, context preservation, reuse of textures and the earlier Stage 3/PLAY checks. Both participant counts were captured at 1920×1080, 1280×720 and 1024×768; existing composition checks also retain 1600×900 and 1366×768. Real OpenGL rendering, native resize and disposal were exercised. All 23 PNGs match untouched originals by SHA-256.

Real mobile Chromium tests used the existing local Playwright installation and installed Chrome, with 390×844 touch emulation and independent authenticated browser contexts. They passed for three active + two spectators and four active + two spectators. Tests verify real UI joining, participant card counts, self-disable, spectator submission, changed selections, no duplicate counter inflation, no leaked other-player target/raw maps, reload/reconnect restoration, no horizontal overflow, deadline closure, round reset, early completion at Y/Y including spectators and room closure. A test-only wire fault causes the real server to reject a UI selection; the phone shows the error and never marks it confirmed. No debug controls or test endpoint are added to the normal controller.

Commands used:

```sh
./gradlew :server:test :lwjgl3:classes :lwjgl3:devClasses :lwjgl3:testClasses :core:roundCheck :core:clockCheck :lwjgl3:impostorCheck :lwjgl3:playCheck
./gradlew :lwjgl3:impostorPreview
# Separate test-only server, controlled by local files and stopped by the script:
./gradlew :server:suspicionBrowserFixture
# In another terminal; provide installed Playwright/Chrome locations if not on default paths:
node tools/checks/check_suspicion_browser.cjs
```

The browser script supports PLAYWRIGHT_MODULE and CHROME_PATH environment variables. Its fixture binds only 127.0.0.1 on an ephemeral port, uses real HTTP/WebSockets, takes explicit active IDs from the test, and has no browser-accessible admin route. Fixture code is on the server test classpath only; local control/status artifacts stay under server/build/suspicion-browser. Dev preview controls remain outside main desktop outputs.

An initial new-test compile failed because a reassigned local variable was captured by a Java lambda; corrected. The first graphical run exposed an older ambient test assuming a bright initial phase despite possible startup delays; corrected to sample the complete bounded cycle. Final tests pass. No production ambient animation behavior was altered to satisfy the test.

## Screenshots and limitations

Shared-screen captures: `lwjgl3/build/impostor-check/screenshots/stage4/`, 18 images named `{3|4}players-suspicion-{open|closed|sealed}-{resolution}.png`. Mobile captures: `server/build/suspicion-browser/{3|4}participants-mobile-{open|sealed}.png`. The open four-player desktop composition, sealed three-player composition and four-player mobile UI were inspected for clipping, overlap and selected-state readability. Manual visual approval remains with the user.

Remaining limitations:

- No production Impostor roster assignment, clue orchestration or trivia-to-mini-game handoff exists yet; trusted hooks are ready but are not wired to a fabricated production start path.
- The optional native host network adapter is compiled; server transport, browser networking and native aggregate presentation were tested, but a complete production host match could not be tested without that missing orchestration.
- Actual character artwork remains unavailable; names are shown without invented avatars.
- Mobile tests used Chromium touch emulation, not physical iOS/Android devices or Safari.
- Storage remains in-memory in the existing single-process room server; restart loses sessions, as with trivia.
- No final vote weighting or conversion of suspicions was implemented. Final voting remains a separate future system.

Stage 4 stops here. Stage 5 has not started.
