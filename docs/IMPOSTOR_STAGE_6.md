# THE IMPOSTOR — Stage 6: final voting and identity reveal

## Delivered scope

The existing real three-round game now continues automatically through final discussion, private final voting, lock, animated vote reveal, suspect announcement, impostor identity reveal and a server-computed result. It stops at RESULT. No elimination, final guess, dictionary, subsequent challenge or Stage 7 mechanics were added.

The Stage 5 participant-outline PNG remains unavailable. The current portrait row, nickname plates, clue papers, room, ambient lighting, clock and fixed arrow are preserved. No PNG was generated, replaced or modified.

## Existing architecture reused

RoomService remains the sole authoritative synchronized registry. Existing session tokens, socket bindings, membership, reconnects, monotonic clock, Javalin tick, room capacity and trivia protocol are reused. The real Stage 4 suspicion and Stage 5 clue systems remain separate and functional.

FinalVoting is a small server-only ballot/result component owned by ImpostorSession, not a second room manager or voting server. FinalActSnapshot contains public presentation data. FinalVotePresentation is one Scene2D Group on the existing screen and Stage; it borrows existing assets/fonts and uses the original 1920×1080 FitViewport. The existing network adapter applies the new final-act fields on the libGDX render thread.

The explicit trusted Stage 5 roster entry remains:

```java
rooms.startImpostorGame(roomCode, explicitlyAssignedActivePlayerIds);
```

Exactly three/four active IDs are required. No automatic roster-selection algorithm, new room mode, production menu button or browser-accessible start endpoint was introduced.

## Server flow and timings

The existing EVIDENCE_REVIEW phase is now the timed FINAL DISCUSSION; its complete clue history remains available. The shared phase enum is extended only with VOTING_LOCKED, SUSPECT_ANNOUNCEMENT and IMPOSTOR_REVEAL.

| Phase | Timing / behavior |
| --- | --- |
| EVIDENCE_REVIEW / final discussion | 30 seconds by default |
| FINAL_VOTING | 20 seconds by default; may finish early when every active voter submitted |
| VOTING_LOCKED | 700 ms; snapshot is already immutable but still private |
| FINAL_VOTE_REVEAL | 800 ms card entry, one impact every 400 ms, then 1000 ms hold |
| SUSPECT_ANNOUNCEMENT | 3500 ms; show unique leader or tied participants |
| IMPOSTOR_REVEAL | 4000 ms; public actual identity and outcome become authorized |
| RESULT | Persistent final screen; no automatic next stage |

Discussion and voting durations are configurable through IMPOSTOR_DISCUSSION_MILLIS and IMPOSTOR_VOTING_MILLIS. Defaults are 30000 and 20000; accepted range is 1000–300000 milliseconds. Direct Java launches can also use impostor.discussionMillis and impostor.votingMillis system properties. Timing is immutable per session; clients cannot configure it.

All phase transitions and vote acceptance share the existing RoomService lock. A tick crosses at most one phase boundary, preserving reveal/announcement holds after a stall. Client timestamps, counts and outcomes are never trusted.

## Eligibility, security and results

Only the assigned active participants can cast final votes or be targets. The host and spectators cannot vote. Self-votes, invalid targets, extra/spoofed fields, unauthorized sockets, wrong rooms/sessions, duplicates and late requests are rejected. An accepted final vote cannot be changed. Preliminary suspicion maps never enter the calculation.

The active roster is the frozen final-voter set. Disconnecting or explicitly leaving does not shrink the denominator or erase an accepted vote. An unanswered disconnected slot becomes an abstention at the deadline. Reconnects restore the original stable ID and accepted vote; replaced sockets lose authorization. This follows the existing frozen-roster/reconnect approach and prevents disconnect manipulation of early completion.

Closing voting creates exactly one immutable snapshot: counts for every suspect, anonymous stamp targets, tied leaders and the server-only computed outcome. Repeated close calls return the same snapshot. Stamp targets are arranged round-robin by suspect; their order does not disclose voter-to-target associations.

The Stage 6 outcome is determined by the unique highest vote total:

- A unique leader who is the impostor: IMPOSTOR_CAUGHT.
- A unique innocent leader: IMPOSTOR_ESCAPED.
- Multiple leaders, including an all-abstention 0–0–0/0–0–0–0 result: NO_CONSENSUS.

Ties are deterministic. No participant is selected randomly or eliminated.

## Additive WebSocket contract

Protocol version remains 1. New request:

```json
{
  "type": "SUBMIT_FINAL_VOTE",
  "requestId": "unique-request",
  "payload": {
    "roomCode": "ABCDEF",
    "sessionId": "server-session",
    "suspectId": "active-player-id"
  }
}
```

Exactly those three payload keys are accepted. The authenticated binding supplies voter identity. Replies are FINAL_VOTE_ACCEPTED and FINAL_VOTE_REJECTED, correlated by requestId. Phase/progress changes use the existing IMPOSTOR_UPDATED personalized snapshot event.

Relevant rejection codes: INVALID_FINAL_VOTE, AUTH_REQUIRED, NOT_ELIGIBLE, INVALID_SUSPECT, SELF_VOTE, FINAL_VOTE_ALREADY_SUBMITTED, FINAL_VOTING_CLOSED, STALE_IMPOSTOR_SESSION and WRONG_ROOM. A duplicate arriving after closure receives FINAL_VOTING_CLOSED.

New nested snapshot fields:

- finalPhaseStartedAt and deadline: authoritative phase clock.
- finalRevealStartedAt: authoritative common stamp timeline.
- finalEligibleCount/finalSubmittedCount: public aggregate progress.
- finalVoteSubmitted/ownFinalVote: receiving player's own private confirmation only.
- finalVoteSnapshot: sequenceId, counts and stampTargets, first available in FINAL_VOTE_REVEAL.
- leadingSuspects: available from SUSPECT_ANNOUNCEMENT.
- revealedImpostorId/outcome: available only from IMPOSTOR_REVEAL onward.

No raw ballot map or full role map is broadcast. Locked vote totals are not exposed early. Public HTTP snapshots and spectators receive no hidden role/word data before the authorized identity reveal. Existing personalized Stage 5 role delivery stays private to the appropriate player.

## Phone controller

The existing browser application gains a final-act component and screen, retaining the existing join, trivia, clue and suspicion controllers. During discussion it lists participants and shows the server-based countdown. Voting shows WHO IS THE IMPOSTOR?, large participant cards, remaining time and aggregate progress. Self-cards, spectators, pending requests, already accepted voters and expired phases are disabled.

A click sends one request without a confirmation modal. Selection styling appears only after the server confirms ownFinalVote. Reload/reconnect restores it. Request timeouts request SYNC rather than inventing acceptance. Rejections show an error; no rejected selection is marked accepted. Dynamic values use textContent, never HTML injection.

Phones follow locked/reveal/announcement/identity/result phases. The final screen shows the actual impostor and final totals. Full totals are not displayed by the phone UI during the host's stamping sequence, although they are authorized in the reveal snapshot. No development controls enter the normal phone interface.

Actual character portrait textures are absent in this repository. Browser cards therefore display names without invented avatar URLs. Native final cards reuse the existing avatar factory when supplied, preserving aspect ratio inside a reserved 88×50 area; the default preview leaves it empty. This is an existing artwork limitation, not a completed character-art integration.

## Host presentation and stamp animation

The current participant row stays visible throughout discussion/voting. Titles, instructions and progress use the existing Noto Sans font. The gothic timer uses its original panel/type/color, with ДО КОНЦА ОБСУЖДЕНИЯ during discussion and ДО КОНЦА ГОЛОСОВАНИЯ during voting. All time displays extrapolate server timing; they do not cause phase transitions.

Existing artwork was inspected:

- suspect_papper.png: 1162×1353 parchment, used once per active suspect.
- stamp.png: 1278×1230 wooden stamp.
- suspect_print.png: 1286×1223 distressed circular ink with a silhouette and question mark.

All preserve their aspect ratios and transparency. Ink is tinted dark crimson, with small deterministic rotation/opacity variations. No replacement images, shaders, extra SpriteBatch or 3D framework were introduced.

Final cards are 250×291.093 virtual pixels, arranged on the table by count:

- Three cards: centers spaced 420 pixels, x=415,835,1255; y=160,100,160.
- Four cards: spacing 300, x=385,685,985,1285; y=190,130,130,190.
- Rotation is −3° × (index − (count−1)/2), with a centered origin.
- Nickname bounds are local (35,230,180,34), centered with visual ellipsis.
- Optional avatar fits in 88×50 pixels, centered horizontally at y=174.

Cards fade/scale in over 650 ms before impacts begin. The stamp moves between card points, descends, contacts at 220 ms into each 400 ms interval, then rises. An imprint briefly overshoots scale and settles. Each imprint remains an independent Image after impact.

Placement uses a two-column grid: local x=48+91×column and y=40+66×row, with sizes 66/68/70 pixels and preserved texture ratio. This fits all possible three/four-player final votes without hiding earlier marks. A card can legally receive at most three votes because self-voting is forbidden. Tiny rotation may create controlled edge overlap; individual marks remain distinguishable. Counts are shown separately in the result summary, never in place of stamps.

FinalRevealTiming shares lead/interval/impact/hold constants between server and host. The host uses finalRevealStartedAt and the immutable sequence ID, not independent per-card timers or frame counts. Repeated snapshots do not reset marks. Reconnecting mid-reveal restores already impacted stamps and resumes the current motion. Once visible, a stamp is not removed by clock resynchronization. Later phases retain all imprints and highlight the leader or actual impostor.

Long names are ellipsized visually in cards/summaries without modifying player data. New host ellipses use ASCII dots because the existing font atlas does not include U+2026. Title/detail entry fades and the identity name's subtle scale transition provide cinematic pacing without changing results.

## Ownership and preservation

The new Group and its actors borrow the existing screen asset scope and fonts. No additional textures/fonts are created, loaded per frame or independently disposed. A single reusable vector handles stamp coordinates; per-frame stamp updates do not allocate actors or perform file/network I/O. The network adapter remains on the render thread. Reentry, reset and screen disposal retain the existing ownership behavior. New lobby/non-final snapshots clear the previous final overlay and all displayed vote marks.

No existing PNG, menu, room-creation flow, room-code mechanism, trivia rule, player identity model or browser authentication convention was changed. The missing Stage 5 outline remains a separate visual task.

## Development preview

```sh
cd /Users/erni/Documents/FinalAnswer
./gradlew :lwjgl3:impostorPreview
```

F starts the offline final-act demonstration. Its shortened discussion/voting and predetermined caught result are dev-only. N resets; F3/F4 switch active count; ESC returns to the existing menu. Existing R/B paper controls, V suspicion and D/C collection demo remain. Switching demos cancels conflicting development timelines. None of these keys are installed in live network mode or production packaging.

## Real multiplayer launch

Use three terminals, each in the project directory:

```sh
# Terminal 1: real existing Javalin server/controller, isolated test roster setup
./gradlew :server:impostorBrowserFixture -PimpostorFixtureHost=0.0.0.0

# Terminal 2: print URL and room code; join 3/4 players, optionally spectators
python3 scripts/impostor_fixture_control.py info
python3 scripts/impostor_fixture_control.py players

# Terminal 3: native shared host screen; start before the match
./gradlew :lwjgl3:impostorPreview -PimpostorConnection=/Users/erni/Documents/FinalAnswer/server/build/impostor-browser/ready.json

# Terminal 2: explicitly select 3/4 IDs printed by players
python3 scripts/impostor_fixture_control.py start --players ID_A ID_B ID_C
```

Open the printed URL in independent browser sessions. Physical phones must use the computer's LAN IP in place of 127.0.0.1, with the same printed port, on the same network. Use separate profiles/devices for separate player sessions. Extra joined players spectate. Complete the real three clue/suspicion rounds; discussion and final voting now start automatically. Votes are submitted on the phones. No additional host trigger is needed.

For duration configuration, set environment variables when starting the fixture/server, e.g. IMPOSTOR_DISCUSSION_MILLIS=45000 and IMPOSTOR_VOTING_MILLIS=20000. Do not set impostorManualClock for manual play.

The fixture remains test-classpath-only, has a ten-minute lifetime, local-file orchestration and no browser admin route. The ready.json host credential is local and must not be shared with players. For another match run `python3 scripts/impostor_fixture_control.py new`, rejoin, reopen the native preview for the new credentials and explicitly select the roster again. Stop with `python3 scripts/impostor_fixture_control.py stop`.

## Verification and results

Passed:

- Full `./gradlew build` across existing modules.
- 72 server tests: 59 existing tests and 13 new final-voting tests, zero failures/errors/skips.
- Valid/private voting, self/duplicate/invalid/spectator/late rejection, strict deadlines, early completion, immutable counting, caught/escaped/tied/all-abstaining outcomes, disconnect policy, reconnect restoration, schema/room/session/auth validation, concurrent final submissions and session reset.
- ImpostorCheck: three/four final cards, aggregate progress, one independent visible mark per impact, retained marks, duplicate snapshot handling, safe placement, source proportions, ID-bound names, result/identity presentation, reconnect restoration, reset, resize, reentry and texture lifecycle.
- Actual real-time OpenGL stamp sequences for three and four players: visible mark count never decreases, final count equals accepted votes and wooden stamp motion is observed through descent/rise/movement. This supplements deterministic captures, not just compilation.
- Existing clue-flip, suspicion, PLAY, round/clock and inspector regressions.
- Real Chromium touch-emulated browsers against the actual Javalin server and native OpenGL host: three active + two spectators caught the impostor; four active + two spectators tied; three active + two spectators timed out with one innocent-target vote and the impostor escaped.
- Browser checks cover private state, disabled self/spectator cards, actual wire rejection, immutable accepted input, duplicate rejection, reconnect/reload, early completion, expiration, three clue rounds, all final phases, long Cyrillic names, final identity, totals and widths 360/390/768.
- Native host checks confirm no private role/word payloads, the server outcome title, completed title fade and exactly one retained stamp per accepted vote for three/four players.

Graphical captures cover 1920×1080, 1280×720 and 1024×768. Existing earlier-stage composition checks also retain 1600×900 and 1366×768. Representative desktop and mobile captures were inspected for clipping, text placement and distinguishable stamps. Manual aesthetic approval remains with the user; physical phones/Safari were not tested.

Commands:

```sh
./gradlew build :lwjgl3:impostorCheck :lwjgl3:playCheck
# Integrated QA: start these in separate terminals, in this order
./gradlew :server:impostorBrowserFixture -PimpostorManualClock=true
./gradlew :lwjgl3:impostorNetworkCheck -PimpostorFinalQA=true
node scripts/check_impostor_final_browser.cjs
```

Browser scripts support PLAYWRIGHT_MODULE and CHROME_PATH for an existing installation. No browser dependency was added to the project. Test-controlled server time makes short phases inspectable; normal play uses monotonic server time. Stage 5's existing browser harness is reused through an optional final-QA mode, so all clue rounds are exercised before every final act.

Initial verification issues were corrected: an ambiguous Java List import; a browser selector matching hidden preliminary-suspicion cards as well as final cards; screenshots captured before title entry fade completed; missing ellipsis glyphs; and the pre-existing Gradle no-JUnit-discovery configuration for executable core/desktop checks. The build now follows inspector's existing failOnNoDiscoveredTests=false convention for these modules. Core check explicitly runs roundCheck/clockCheck; GUI checks remain explicit JavaExec tasks for headless build compatibility. No discovered failing tests were suppressed.

Deliberate missing/corrupt-image errors from ImpostorCheck are expected degraded-resource tests. Normal loading is 23/23 existing textures. All source PNGs remain unchanged.

## Artifacts

- lwjgl3/build/impostor-check/screenshots/stage6/: three/four-player discussion, voting, mid-reveal, all-stamps, suspect, identity and result captures at three requested resolutions.
- lwjgl3/build/impostor-network-check/3players-real-network-final.png
- lwjgl3/build/impostor-network-check/4players-real-network-final.png
- server/build/impostor-browser/stage6-{count}players-{outcome}-{width}.png
- server/build/reports/tests/test/: authoritative server test report.

Screenshots are development artifacts, not production assets.

## Files created

- shared/src/main/java/com/erni/finalanswer/gameplay/impostor/FinalRevealTiming.java
- server/src/main/java/com/finalanswer/server/game/FinalVoting.java
- server/src/test/java/com/finalanswer/server/FinalVotingTest.java
- core/src/main/java/com/erni/finalanswer/impostor/FinalActSnapshot.java
- core/src/main/java/com/erni/finalanswer/impostor/FinalVotePresentation.java
- web/final-voting.js
- lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/ImpostorFinalPreview.java
- scripts/check_impostor_final_browser.cjs
- docs/IMPOSTOR_STAGE_6.md

## Files modified

- shared/src/main/java/com/erni/finalanswer/gameplay/impostor/ImpostorPhase.java
- server/src/main/java/com/finalanswer/server/game/ImpostorSession.java
- server/src/main/java/com/finalanswer/server/rooms/RoomService.java
- server/src/main/java/com/finalanswer/server/RoomServer.java
- server/src/test/java/com/finalanswer/server/ImpostorGameTest.java
- core/src/main/java/com/erni/finalanswer/impostor/ImpostorScreen.java
- core/src/main/java/com/erni/finalanswer/network/ImpostorSuspicionAdapter.java
- core/build.gradle
- lwjgl3/build.gradle
- lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/ImpostorPreviewLauncher.java
- lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/ImpostorPreviewData.java
- lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/ImpostorCluePreview.java
- lwjgl3/src/test/java/com/erni/finalanswer/lwjgl3/ImpostorCheck.java
- lwjgl3/src/test/java/com/erni/finalanswer/lwjgl3/ImpostorNetworkCheck.java
- web/app.js
- web/index.html
- web/style.css
- scripts/check_impostor_browser.cjs

The repository already contained uncommitted earlier stages; this list describes Stage 6 changes rather than the whole working tree.

## Remaining limitations

The Stage 5 outline PNG and actual character portrait artwork are still absent. Existing avatar integration is reused, with empty native avatar regions/name-only phone cards until usable artwork exists. No substitute character images were invented. Production roster/menu handoff remains the explicit Stage 5 integration boundary. Storage remains in-memory; server restart loses the session, consistent with the existing server. New matches use new sessions/room credentials. Physical devices and Safari need manual testing. Stage 6 ends at RESULT; Stage 7 was not started.
