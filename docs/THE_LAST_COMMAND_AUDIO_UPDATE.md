# The Last Command — voice commands and additional effects

## Implementation

The existing approved announcer identity is `final_answer_host_ru_v1`. Four reusable event templates were appended to `tools/host-tts/config/events.json`: PRESS_RED / Нажми красную; PRESS_GREEN / Нажми зелёную; PRESS_BLUE / Нажми синюю; PRESS_YELLOW / Нажми жёлтую.

Recordings were prepared through the existing local offline `tools/host-tts/scripts/narration.py` pipeline, with its unchanged approved reference, verified reference transcript, local checkpoint, generation settings and standard event export. No runtime synthesis, new TTS implementation, OS voice or external service was added. The resulting OGGs and durations are registered in the existing `assets/audio/host/ru/manifest.json`. Each clip is ~1.12–1.20 seconds. Technical checks passed; `manualReview` remains honestly `not_yet_reviewed`, since automated checks cannot approve pronunciation or performance.

Native playback reuses GameAudio.hostVoice() / HostVoiceManager.playLine(). Selection comes from the current authoritative `touchscreen.spokenColor`. The event adapter requests playback once after the puzzle interface has rendered and the existing ready time has arrived. Task replacement, pause, completion and disposal cancel the screen's narration. Repeated snapshots/frames and resume do not replay a started command.

The browser development version uses those exact same four recordings through its existing SfxBank; the previous operating-system SpeechSynthesis branch was removed. Voice clips use the established .8 voice gain and existing effects/master controls. Native playback inherits the shared HostVoiceManager volume/mix. No scoring, generation, timing, controller layout or visual animation was changed. Following the voice when the scenario requires the display is still incorrect.

## Sound mapping and limits

| Supplied filename | Connected event |
| --- | --- |
| question_typing.wav | Loaded as QUESTION_TYPING, default typing variant; manual audition only — see below |
| questiontyping2.wav | Loaded as QUESTION_TYPING_ALT; alternative manual audition |
| confirm_button.wav | Actual CONFIRM activation, or red-button confirmation in a task that requires it; independent from verdict |
| Success2.wav | ANSWER_CORRECT after the server's ordinary correct verdict; final victory still uses existing success.mp3 |
| wrong_symbol_chosen.wav | SYMBOL_WRONG only for authoritative wrong verdicts in symbol tasks |
| metal_DOOR_CLOSE.wav | HATCH_CLOSE when the existing visible hatch finishes closing; opening and task teardown do not trigger it |
| symbol_clicked.wav | SYMBOL_CLICK on symbol interaction; separate from wrong verdict |
| symbol_appear.wav | SYMBOL_APPEAR when a symbol-bearing terminal face becomes visible, including relevant memory phases |
| transition_screen.wav | SCREEN_TRANSITION on actual task-screen replacement outside protected memory/voice challenges, and once after the existing Find Change blackout when the changed panel becomes visible |

All nine requested WAVs were found with exactly these capitalizations under the user's THE_LAST_COMMAND_AUDIO directory. Original bytes and filenames are preserved in `assets/sounds/last_command/`; compatible PCM16 playback copies are in `runtime/`. Existing success.wav was checked and preserved; only the Last Command ANSWER_CORRECT mapping now selects Success2.wav. Existing `button_pressed.wav` and `small_button_click.wav` are reused; no duplicate button asset was created. The four originally proposed voice_press_*_ru.wav files are not required or fabricated.

**Typing limitation:** the current Last Command terminal draws the entire question immediately. There is no first-character/last-character animation interval to connect a typing loop to. Therefore neither typing recording is played during gameplay, and no fake timed loop or new visual/timing mechanic was introduced. Both files are preloaded and available for manual listening. A future genuine typewriter animation must supply its start/end/cancel events before these sounds can truthfully be described as integrated. All other seven newly supplied effects and four voice templates have actual gameplay connections.

## Ownership and performance

Existing managers remain in place: native LastCommandAudio (Sound cache and streaming victory) and HostVoiceManager (narration); browser SfxBank and its AudioEvents adapter. The canonical runtime manifest now registers 26 native effects (25 Sound + 1 Music) and four browser references to the existing host recordings. Both typing variants account for two of the loaded effects but have no gameplay trigger. No files are loaded from a render/update loop. Cue voices are bounded, rotary/click effects throttled, important feedback ducks lower-priority tails, and obsolete narration/notes are stopped. Native host resources remain owned by GameAudio; the Last Command screen cancels its requests on exit. Scene-owned SFX and browser contexts are disposed normally.

The new voice endpoint is a four-ID development allowlist and resolves only ready host-manifest event files. No voice/audio protocol or broadcast was added. Existing state snapshots drive per-player playback and verdict deduplication.

## Verification completed

- `npm --prefix web3d run build` — pass.
- `./gradlew :core:check :server:test --offline` — pass; 214 server tests, zero failures.
- `./gradlew :lwjgl3:lastCommandAudioDecodeCheck :lwjgl3:lastCommandExpansionCheck --offline` — pass: 25 short effects, streaming victory, four host OGG decodes, real native CRT touch/network/FBO rendering, no GL errors.
- `python3 -m unittest discover -s tools/host-tts/scripts -p test_narration.py` — 2 tests pass. Its obsolete eight-event assertion was updated for the actual 26-event catalogue and now checks all four command texts.
- `python3 tools/checks/check_last_command_audio_assets.py` — pass: 24 preserved supplied originals, runtime formats, voice references, memory note variants.
- `check_last_command_sound_library.cjs` — all 30 cues actually start in the browser; volume, stop and disposal pass.
- `check_last_command_audio_expanded.cjs` — real generated scenarios exercise all four host commands, no OS TTS, contradiction-rule authority, no SYNC repeats, confirm versus success, symbol appearance/click/wrong feedback, actual hatch closure, Find Change transition and no fake typing over static text.
- `check_last_command_audio_gameplay.cjs` — controls, circuit verdicts, 20 authoritative answers and final victory/shutdown pass.
- `check_last_command_audio_memory_network.cjs` — memory timing and two-player sound isolation pass.

Browser checks use LC_URL, PLAYWRIGHT_MODULE and CHROME_PATH as the other repository checks do. These are playback/codec/event checks, not a subjective listening endorsement.

## Manual review

Run the local server and open `http://localhost:18096/last-command-3d/audio-test.html`. All 30 effects/templates have individual audition buttons, volume and Stop all. Voice labels identify the four established-host commands. Typing clips are explicitly labelled as auditions without a current gameplay typing animation. For a generated puzzle: `/last-command-3d/?autostart=1&showcase=1&task=FALSE_COMMAND`.

## Modified files for this update

- Voice: `tools/host-tts/config/events.json`, `tools/host-tts/scripts/test_narration.py`, `assets/audio/host/ru/manifest.json`, four `assets/audio/host/ru/events/PRESS_*.ogg` recordings.
- Native: `core/src/main/java/com/erni/finalanswer/audio/LastCommandAudio.java`, `core/src/main/java/com/erni/finalanswer/lastcommand/LastCommandAudioEvents.java`, `core/src/main/java/com/erni/finalanswer/lastcommand/TheLastCommandScreen.java`.
- Browser: `web3d/src/runtime/sfx-bank.ts`, `web3d/src/runtime/audio-events.ts`, `web3d/src/runtime/audio.ts`, `web3d/src/main.ts`, `web3d/src/games/last-command/machine.ts` (hatch-motion query only), `web3d/src/audio-test.ts`.
- Routes: `server/src/main/java/com/finalanswer/server/LastCommandDevRoutes.java`.
- Assets/tooling: nine supplied WAV originals and PCM runtime copies, `assets/sounds/last_command/runtime/manifest.json`, `tools/audio/prepare_last_command_audio.py`, `.gitignore`, audio README/integration documents and this report.
- Checks: `core/src/test/java/com/erni/finalanswer/lastcommand/LastCommandAudioCheck.java`, `lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/LastCommandAudioPreview.java`, `tools/checks/check_last_command_audio_expanded.cjs`, asset/library checks and existing gameplay/memory/realism/type-12 checks (updated cache-size expectations).

Earlier machine design, regulator labels, pressure hint, central-button visibility and type-12 gameplay changes already in the working tree are separate from this audio update.
