# THE IMPOSTOR — Stage 9 controller redesign and room settings

## Audit and visual design

Inspected actual button classes, source PNG dimensions/transparent margins, host fonts, the existing web controllers, static resource packaging, server session/room state, word source, replay and Stage 5's three paper slots. The workspace already contained uncommitted Stages 1–8; those systems were extended rather than replaced.

The phone controller now uses the original dark room artwork, distressed metal button frames, original room-code/input fields, aged clue/voting parchment and existing horror/readable fonts. Redesigned join, waiting, private role/word, clue entry/confirmation, discussion, suspect selection, vote confirmation, results, errors and connection presentation. Existing trivia controller logic is unchanged; its native browser buttons are also enhanced by the shared component rather than receiving independent button logic. Main menu and room-creation screens are unchanged.

Desktop Chrome and mobile-emulated screenshots were visually inspected, including join, voting and host configuration. Inputs were adjusted to remove generic outer rectangles; host numeric fields were centered and button proportions corrected after visual inspection. The phone uses the host's real artwork and visual vocabulary, adapted to a vertical layout; it is not a scaled copy of the desktop screen.

## Actual shared artwork

Original source files, unchanged:

- `assets/ui/buttons/player_count/button_up.png`
- `assets/ui/buttons/player_count/button_hover.png`
- `assets/ui/buttons/player_count/button_pressed.png`
- `assets/ui/buttons/settings/settings_up.png`, `settings_hover.png`, `settings_pressed.png` (native host settings launcher)
- `assets/ui/windows/create_room/field.png`, `field_hover.png` (normal field used; hover asset available)
- `assets/ui/windows/generation_code/CodeField.png`
- `assets/impostor/backgrounds/background1.png`
- `assets/impostor/papers/papper_player_front.png`
- `assets/impostor/papers/suspect_papper.png`
- `assets/impostor/portraits/impostor_avatar_frame.png`
- Existing `assets/ui/Final_Answer.png`
- `assets/ui/fonts/Creepster-Regular.ttf`, `NotoSans-Regular.ttf`, `RoadRage-Regular.ttf` and their existing licenses.

Menu PLAY, CREATE ROOM, SETTINGS, GENERATE and BACK assets were inspected. Their wording is baked into the PNGs, so relabelling those images would either show incorrect wording or require altering artwork. The blank player-count frame already used by the host is the suitable shared source for JOIN ROOM, SUBMIT, CONFIRM VOTE, retry and leave actions.

FinalAnswerButton uses SVG viewports over the exact original texture regions from PlayerCountSelector: UP `(293,198,1191,483)`, HOVER `(161,273,1208,452)`, PRESSED `(167,263,1198,456)`. This excludes transparent margins without generating/editing PNGs. SVG preserveAspectRatio retains artwork proportions. Text remains real accessible text. The component supports labels, optional icons, custom state images, callbacks, touch/pointer cancellation, keyboard press/focus and native disabled semantics. It enhances static and dynamically added buttons centrally. Missing images leave a readable functional fallback. No disabled PNG exists; disabled state is subdued from UP artwork.

Suspect buttons reuse the actual host parchment with separate selected labels; there are no dedicated parchment hover/pressed PNGs, so these use restrained brightness feedback. Selection is local and explicitly confirmed with CONFIRM VOTE. Merely tapping a suspect sends no vote. Accepted votes remain server-locked and duplicates are rejected. Spectators/self/expired phases cannot vote.

The server packages a narrow asset allowlist into classpath `web/art/`. It does not expose an assets filesystem mount, arbitrary files, credentials or source code. Browser checks compare all three button image responses byte-for-byte with the originals and verify an unlisted source-file path returns 404. Copies exist only as build resources for distribution; source artwork is shared.

## Settings

One immutable public ImpostorSettings record is owned by each authoritative room and copied into each new session's rules/timing. Defaults:

| Setting | Default | Accepted values |
| --- | --- | --- |
| Round count | 3 | 1–3 |
| Discussion | 30 seconds | 5–300 seconds |
| Voting | 20 seconds | 5–120 seconds |
| Clue submission | 10 seconds, existing default | 5–120 seconds |
| Word category | DEFAULT | DEFAULT only |
| Sound enabled | true | boolean |
| Visual effects enabled | true | boolean |
| Reduced motion | false | boolean |

The existing word system has one general/configured pool, not named categories. DEFAULT means that existing WordSource/IMPOSTOR_WORDS pool; no invented categories or new dictionary were added. The existing three clue-paper slots constrain round count to 1–3. Shorter matches reuse the same history/results structures, and completed-round statistics reflect actual rounds. Longer games require a future paper/history presentation extension.

Native host lobby: original SETTINGS image opens an Impostor-specific overlay with range-labelled fields, existing category, toggles and image-based APPLY/CLOSE buttons. Invalid entries are rejected locally and still validated independently on the server. Only the authenticated host in the lobby can change configuration. Active match, RESULT and REPLAY_PREPARATION are locked; return to lobby to edit before another match. No room-creation or main-menu redesign.

Settings persist through PLAY AGAIN and RETURN TO LOBBY, preserving room/code/participants. New rooms use defaults. Production matches now take discussion/voting timing from the synchronized room configuration; the older direct-session timing constructor remains available for existing fixtures/tests. Process-only timing overrides do not override an explicit room configuration.

Host respects room sound/effects/motion settings; a local reduced-motion preference can still reduce motion further. Sound-disabled rooms cannot be unmuted through the local sound button, and re-enabling room sound restores the prior local mute preference. Phones receive the same public configuration, display round count/timings in waiting, use the configured round total, suppress effects/motion according to room settings, and suppress optional audio confirmation hooks when sound is disabled. Actual audio files remain missing from Stage 8.

## Protocol changes

Version remains 1. New authenticated host request:

```json
{
  "type": "UPDATE_IMPOSTOR_SETTINGS",
  "requestId": "unique-request",
  "payload": {
    "roomCode": "ABCDEF",
    "sessionId": "current-lobbyId",
    "settings": {
      "roundCount": 2,
      "discussionSeconds": 30,
      "votingSeconds": 20,
      "clueSeconds": 10,
      "wordCategory": "DEFAULT",
      "soundEnabled": true,
      "visualEffectsEnabled": true,
      "reducedMotion": false
    }
  }
}
```

Exact fields and JSON types are required. Integer strings, decimal numbers, missing/extra keys, unsupported categories, invalid ranges and nonboolean toggles fail atomically. Validate host binding, room, lobby ID and phase. Errors use correlated IMPOSTOR_ACTION_REJECTED, including HOST_ONLY, SETTINGS_LOCKED, INVALID_IMPOSTOR_SETTINGS and STALE_IMPOSTOR_SESSION. Success broadcasts IMPOSTOR_SETTINGS_UPDATED and returns correlated STATE.

Public snapshots add `impostorSettings` and `impostorWordCategories: ["DEFAULT"]`. No secret word or role data was added. Existing join, IDs, role personalization, clues, ballots, results, replay and reconnection contracts remain intact. Final vote confirmation is a UI step using the existing SUBMIT_FINAL_VOTE request, not a second voting protocol.

## Files created

- `shared/src/main/java/com/erni/finalanswer/gameplay/impostor/ImpostorSettings.java`
- `core/src/main/java/com/erni/finalanswer/impostor/ImpostorSettingsPanel.java`
- `web/final-answer-button.js`
- `web/controller-theme.css`
- `server/src/test/java/com/finalanswer/server/ImpostorSettingsTest.java`
- `docs/IMPOSTOR_STAGE_9.md`

Development artifact: `generated/stage9-assets.jpg` is an inspection contact sheet, not production artwork.

## Files modified

- `server/build.gradle`
- `server/src/main/java/com/finalanswer/server/RoomServer.java`
- `server/src/main/java/com/finalanswer/server/rooms/RoomService.java`
- `server/src/main/java/com/finalanswer/server/game/ImpostorSession.java`
- `server/src/test/java/com/finalanswer/server/ImpostorGameTest.java` (room-isolation assertion now checks the actual session key, since public settings metadata exists in every room)
- `core/src/main/java/com/erni/finalanswer/impostor/ImpostorScreen.java`
- `core/src/main/java/com/erni/finalanswer/impostor/FinalVotePresentation.java`
- `web/index.html`, `web/app.js`, `web/impostor.js`, `web/final-voting.js`
- `lwjgl3/src/test/java/com/erni/finalanswer/lwjgl3/ImpostorCheck.java`
- `scripts/check_impostor_browser.cjs`
- `scripts/check_impostor_lifecycle_browser.cjs`

No original image was modified and no replacement artwork was generated.

## Verification

```sh
./gradlew :server:test :core:compileJava :lwjgl3:compileTestJava
./gradlew build :lwjgl3:impostorCheck :lwjgl3:playCheck
./gradlew :server:impostorBrowserFixture -PimpostorManualClock=true
IMPOSTOR_UI_QA=1 IMPOSTOR_POLISH_QA=1 PLAYWRIGHT_MODULE=/path/to/playwright CHROME_PATH=/path/to/chrome node scripts/check_impostor_lifecycle_browser.cjs
PLAYWRIGHT_MODULE=/path/to/playwright CHROME_PATH=/path/to/chrome node scripts/check_impostor_final_browser.cjs
```

Server: 104 tests, zero failures/errors, including 12 new settings tests. New coverage: defaults/public secrecy, host/unauthenticated/player authority, atomic invalid-value/type/schema/category rejection, stale/wrong-room requests, active/preparation lock, real configured timers, shortened-round result accuracy, replay/lobby persistence and reconnect configuration. Existing server rules/security and lifecycle tests remain.

Native OpenGL: settings overlay creation/edit/apply, invalid-entry rejection, hiding controls when disallowed, 1920×1080 / 1280×720 / 1024×768 captures and resource disposal. Existing clue/stamp/results, PLAY, transition/audio, round/clock and inspector regression checks remain.

Real Chrome desktop and mobile-emulated contexts: original assets/HTTP allowlist, hover, focus/Shift+Tab/Space, real touch tap, immediate press/release/cancel, disabled state, missing-image fallback, themed code/nickname errors, and no horizontal scrolling at 320×740, 390×844, 844×390 and 1280×800. Screenshots captured for join/waiting/role/clue/voting/results and native host settings.

Same-room multiplayer browser scenario: six matches with six stable participants. Three matches use 3 active + 3 spectators and default round/timings; the next three use 4 active + 2 spectators with 2 rounds, 12-second clues, 7-second discussion, 9-second voting and room reduced motion enabled. All three outcomes, four replay transitions, two lobby returns, current-state reconnect, draft preservation, private roles, spectator neutrality, host settings authorization/synchronization/persistence and selected-before-confirmed voting are checked. The server is real Javalin; only clock advancement is test-controlled. Host commands use an authenticated browser socket rather than a physical desktop-to-phone session.

The older final-act browser regression also exercises actual clue entry/confirmation, preliminary suspicion, private voting, duplicate/invalid rejection and timed reveals. Its expected UI text and vote-confirm interaction were updated, without removing security assertions.

Reports and visual artifacts:

- `server/build/reports/tests/test/index.html`
- `server/build/impostor-browser/stage9-report.json`
- `server/build/impostor-browser/stage9-desktop-join-*.png`
- `server/build/impostor-browser/stage9-mobile-join-*.png`
- `server/build/impostor-browser/stage9-{join,waiting,clue,voting}.png`
- `server/build/impostor-browser/stage9-role-*.png`, `stage9-match-*.png`
- `lwjgl3/build/impostor-check/screenshots/stage9/*stage9-host-settings*.png`

## Limits and missing assets

Safari and physical iPhone/Android devices were not tested. Chrome mobile emulation verifies responsive composition and touch semantics, not device-specific Safari behavior. The Stage 5 participant-outline PNG remains pending. Actual character portrait files remain absent; existing identity/frame/name presentation is used without fabricated avatar URLs. No dedicated JOIN/SUBMIT/CONFIRM VOTE PNGs or disabled-state PNG exists; original blank host frames supply those labels and a subdued disabled state. Sound files remain absent, so sound configuration controls the infrastructure/hooks but cannot produce missing audio.

Source artwork is high resolution and browser-cached; SVG wrappers reuse it without per-frame downloads or new canvas images. No instrumented mobile-device performance benchmark was performed. Room persistence is in-memory, consistent with the existing server.

## Launch and manual testing

```sh
./gradlew :server:run
./gradlew :lwjgl3:run
```

Create a normal room and open THE IMPOSTOR from its existing lobby. Open the server's phone-controller URL in independent browser profiles/devices. Join with the room code and nickname. On the host, SETTINGS opens the new panel; APPLY SETTINGS waits for server synchronization. Select exactly 3/4 active participants, then START MATCH. Extra connected players spectate.

Complete clues, tap a suspect, verify no vote is submitted until CONFIRM VOTE, and wait for the server acknowledgment. Finish the reveal/results, test PLAY AGAIN → START MATCH and RETURN TO LOBBY. Verify the room/code/participants and settings persist. Return to lobby to change configuration. Use browser/OS reduced motion or the room's reduced-motion setting.

For isolated QA, run the fixture with `-PimpostorFixtureHost=0.0.0.0`, print details with `python3 scripts/impostor_fixture_control.py info`, then open the native connected preview:

```sh
./gradlew :lwjgl3:impostorPreview -PimpostorConnection=/Users/erni/Documents/FinalAnswer/server/build/impostor-browser/ready.json
```

Do not use the manual clock for human play. The fixture expires after ten minutes. Keep ready.json's host credential local; physical phones use the computer's LAN address. Stage 10 was not started.
