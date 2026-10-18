# THE IMPOSTOR — Stage 7 completion audit

Stage 7 only. No Stage 8 mechanics or asset replacements.

## What existed and what was completed

The working tree already contained uncommitted Stages 1–6 and a partial Stage 7. These were preserved. The audit inspected actual sources rather than treating the Stage 6 report as proof.

Stage 6 is implemented in `ImpostorSession`, `FinalVoting`, `FinalRevealTiming`, `FinalVotePresentation` and the phone final-voting controller: final discussion, authoritative deadlines/ballot validation, immutable vote counting, individual stamp targets and animation, suspect announcement, actual identity reveal, caught/escaped/tied outcomes. Existing tests exercise phase boundaries, privacy, deadline/duplicate/self/spectator rejection and reconnect restoration. No blocking Stage 6 rule dependency was found.

The partial Stage 7 already provided the immutable `ImpostorMatchResult`, configurable `ImpostorResultPolicy`, host lifecycle commands, replay preparation, room roster selection, phone personal results and a native lifecycle panel. This completion pass added lifecycle regression coverage and real same-room browser QA, fixed lobby navigation and lobby reconnect routing, added scrollable voting/clue history, emphasized the impostor with a programmatic outline, hid obsolete timer UI in results/waiting, and updated older QA expectations for the new result screen/title.

## Authoritative lifecycle and results

The existing phase enum is retained: ROLE_REVEAL → three clue/suspicion rounds → EVIDENCE_REVIEW (final discussion) → FINAL_VOTING → VOTING_LOCKED → FINAL_VOTE_REVEAL → SUSPECT_ANNOUNCEMENT → IMPOSTOR_REVEAL → RESULT. RESULT persists until a validated host command.

Unique actual-impostor suspect means IMPOSTOR_CAUGHT and INNOCENTS win; unique innocent suspect means IMPOSTOR_ESCAPED and IMPOSTOR wins; tied leaders (including all abstentions) mean NO_CONSENSUS. The default winning side for no consensus is IMPOSTOR. Configure with `IMPOSTOR_NO_CONSENSUS_IMPOSTOR_WINS=false` or JVM property `impostor.noConsensusImpostorWins=false` for a future alternative policy. Assignment and display use the snapshot's winning side consistently.

The immutable result copies participants, ballots, abstentions, clue rounds and leaders. Spectators have no participant result. Statistics derive from the frozen active roster, submitted ballots and existing revealed clue maps; missing clues remain `—`. No second clue-history store was introduced. Voter-to-target history is public only in RESULT; the earlier reveal continues to expose anonymous stamp targets.

## Protocol (version 1, additive)

Authenticated host requests:

- `START_IMPOSTOR`: `{roomCode, sessionId, participantIds?}`. In the lobby, sessionId is the server lobbyId; an explicit array selects exactly 3/4 connected nonhost members. In REPLAY_PREPARATION, sessionId is the fresh match session and the preserved roster is used.
- `REPLAY_IMPOSTOR`: `{roomCode, sessionId}`. RESULT only. Closes old session, creates a fresh UUID/session, enters REPLAY_PREPARATION, emits IMPOSTOR_REPLAY_READY.
- `IMPOSTOR_RETURN_TO_LOBBY`: `{roomCode, sessionId}`. RESULT only. Clears match, creates a fresh lobbyId, preserves room/participants and emits IMPOSTOR_LOBBY_RETURNED.

Start emits IMPOSTOR_STARTED. Successful commands also receive correlated STATE; errors receive IMPOSTOR_ACTION_REJECTED. Validate host authority, exact payload keys, room/session and phase. Duplicate replay with the old session fails STALE_IMPOSTOR_SESSION; a repeat using the preparation session fails INVALID_PHASE. Duplicate starts cannot reassign roles. Existing clue/suspicion/final-vote commands remain session scoped. Clients cannot supply winning sides or result calculations.

Snapshots add lobbyId, optional impostorLobby roster, and `impostor.result` only in RESULT. The result includes matchId, completion time, outcome, impostorId, winningSide, per-player roles/winners/vote counts, ballots, abstentions, clueRounds, mostVoted and statistics. Match ID is the existing session UUID, not another competing identifier.

Replay creates a new session object, clearing roles, word, clues, suspicion rounds, timers, ballots, snapshots and result. The client detects session changes and clears private text, pending inputs and old presentation. Room code/ID, connections, member IDs/names/character IDs, host ownership, spectator roster and configuration are preserved. A secure random assignment runs again on START; the same impostor may legitimately be chosen by chance.

Host loss reuses existing behavior: room survives temporary socket loss; after 120 seconds of disconnected-host server time it closes with HOST_DISCONNECTED. No host migration was added. Storage remains in memory.

## Verification

Commands executed:

```sh
./gradlew :server:test :core:compileJava :lwjgl3:compileTestJava
./gradlew build :lwjgl3:impostorCheck :lwjgl3:playCheck
./gradlew :server:impostorBrowserFixture -PimpostorManualClock=true
PLAYWRIGHT_MODULE=/path/to/playwright CHROME_PATH=/path/to/chrome node scripts/check_impostor_lifecycle_browser.cjs
```

Server: 92 tests, zero failures/errors, including 20 new Stage 7 lifecycle tests. Coverage includes all three outcomes, both sides' winners, spectators, configurable tie policy, statistics, immutable history, round summaries, abstentions, complete replay reset, participant/configuration/code preservation, host authority, active-match and duplicate replay rejection, stale events, results/preparation/new-match/lobby reconnects, duplicate starts, three consecutive matches, client-result spoof rejection, lobby synchronization and existing host expiry.

Real Javalin + Chromium: six matches in ONE room, three with 3 active + 3 spectators, then three with 4 active + 2 spectators. Each roster exercised caught/escaped/no consensus. Four PLAY AGAIN transitions and two RETURN TO LOBBY transitions; fresh match IDs, stable room and six stable online participants, no application page errors. Phones reload in RESULT and REPLAY_PREPARATION, preserve their seat and receive current snapshots. Personal results and spectator neutrality are checked against server results. The script uses normal authenticated host WebSocket commands, real phone vote buttons and clue commands; only server time is advanced through the test-only local-file fixture.

Native OpenGL checks cover 3/4-player result cards, host-only controls, duplicate result application, reset, scrollable overflowing history, screenshots at 1920×1080 / 1280×720 / 1024×768, plus existing animated stamps, clue flips, resize/navigation/resource disposal. PLAY, round/clock and inspector regression checks remain part of validation. The six-match browser run uses an authenticated browser socket for host commands; it is not a physical-device or manual desktop-button end-to-end test.

Reports: `server/build/reports/tests/test/index.html`, `server/build/impostor-browser/stage7-report.json`. Phone captures: `server/build/impostor-browser/stage7-match-*.png`. Native captures: `lwjgl3/build/impostor-check/screenshots/stage7/`. Development build artifacts are not production assets.

## Launch and manual checks

Normal desktop: `./gradlew :lwjgl3:run`; server: `./gradlew :server:run` (server configuration in `server/README.md`). Create a room normally, open THE IMPOSTOR from its lobby, connect 3/4 players using the existing phone URL, select active participants, then START MATCH. Additional connected players spectate.

Isolated local setup, without changing the normal menu:

```sh
./gradlew :server:impostorBrowserFixture -PimpostorFixtureHost=0.0.0.0
python3 scripts/impostor_fixture_control.py info
./gradlew :lwjgl3:impostorPreview -PimpostorConnection=/Users/erni/Documents/FinalAnswer/server/build/impostor-browser/ready.json
```

Use separate browser profiles/devices, join the printed code. For physical phones substitute the computer's LAN IP in the printed URL. The ready.json host credential must stay local. Do not use the manual-clock option for normal play. The isolated fixture expires after ten minutes.

PLAY AGAIN: complete the three clue rounds and final voting, wait through identity reveal to RESULT, click PLAY AGAIN on the host, verify phones show WAITING FOR HOST and the same code/player IDs, then START MATCH. Phones retain their connections; roles and votes start fresh.

RETURN TO LOBBY: from RESULT click RETURN TO LOBBY on the host; the host shows the existing room lobby and active-roster controls, phones show the waiting lobby, and the same code remains. Select 3/4 active members and START MATCH again. No room-code entry or reconnection is required.

## Files

Stage 7 implementation files already present at audit start: `shared/.../ImpostorMatchResult.java`, `server/.../game/ImpostorResultPolicy.java`, `core/.../impostor/ImpostorLifecyclePanel.java`; lifecycle additions in existing ImpostorSession, RoomService, RoomServer, RealtimeClient, FinalAnswerGame, LobbyPanel, ImpostorScreen and web app/final-voting/HTML/CSS.

Created in this completion pass:

- `server/src/test/java/com/finalanswer/server/ImpostorLifecycleTest.java`
- `scripts/check_impostor_lifecycle_browser.cjs`
- `docs/IMPOSTOR_STAGE_7.md`

Modified in this completion pass:

- `core/src/main/java/com/erni/finalanswer/FinalAnswerGame.java`
- `core/src/main/java/com/erni/finalanswer/impostor/ImpostorScreen.java`
- `core/src/main/java/com/erni/finalanswer/impostor/ImpostorLifecyclePanel.java`
- `lwjgl3/src/test/java/com/erni/finalanswer/lwjgl3/ImpostorCheck.java`
- `lwjgl3/src/test/java/com/erni/finalanswer/lwjgl3/ImpostorNetworkCheck.java`
- `scripts/check_impostor_browser.cjs`

## Remaining limitations

The requested Stage 5 participant-outline PNG remains pending; the supplied portrait-frame asset is a separate existing resource. The result card now has a programmatic impostor outline and does not require that missing PNG. Actual participant portrait textures are absent from the repository: the existing avatar factory is reused when supplied, but the normal factory currently returns no artwork, so native avatar slots remain empty and phones use names. No original assets were modified and no unrelated artwork was generated.

Physical phones, Safari and a manual desktop button-to-phone end-to-end session were not tested. The production roster UI compiles and its panel/actions are covered separately by native rendering and server/browser tests. Those limitations must not be presented as verified device coverage. No unfinished Stage 6 voting/state-machine dependency blocks Stage 7.
