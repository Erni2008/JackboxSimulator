# THE LAST COMMAND — event audio

This document records the initial audio integration. See [the newer voice/effects update](THE_LAST_COMMAND_AUDIO_UPDATE.md) for current cue counts, Success2 mapping, voice templates and the typing limitation.

Implemented for Java/libGDX and the local browser development version. Gameplay validation, generation, difficulty, 20-task victory, network messages, machine models and controller layout are unchanged.

## Managers and event adapters

- `core/src/main/java/com/erni/finalanswer/audio/LastCommandAudio.java`: scene-owned cache using the existing PresentationAudio backend and global AudioMix SFX gain. Seventeen short libGDX Sound clips, one streaming Music (victory), bounded voices, throttling, priorities, independent volume, pause and idempotent disposal.
- `core/src/main/java/com/erni/finalanswer/lastcommand/LastCommandAudioEvents.java`: native presentation events. TheLastCommandScreen connects accepted panel actions, existing CRT animation frames and server snapshots; LastCommandNetworkBridge suppresses local action echoes.
- `web3d/src/runtime/sfx-bank.ts`: WebAudio short clips and streaming HTMLAudio victory. AudioEvents in `audio-events.ts` performs equivalent event mapping; `audio.ts` retains existing challenge radio/silence/delayed/speech signals.

Physical feedback is immediate locally; subsequent authoritative snapshots do not replay it. Answer, circuit verdict and victory cues come exclusively from validated server snapshots. Duplicate event keys are bounded and suppressed. Joining an existing state does not replay historical verdicts. No audio network protocol was introduced; player-specific terminal state remains isolated.

## Actual source files and mappings

Original files live in `assets/sounds/last_command/`; portable playback copies and the canonical manifest live in `assets/sounds/last_command/runtime/`.

| Original file | Event |
| --- | --- |
| button_pressed.wav | Accepted large red button press, once per press |
| small_button_click.wav | Small buttons, keypad and physical selection |
| lever.wav | Actual lever position change |
| adjuster.wav | Meaningful dial / numeric selector steps; throttled |
| door_open.wav | Beginning of existing hatch opening |
| second_metal_cracking.wav | Low-volume structural stress at existing expanded-machine degradation stages |
| metal_cracking.wav | Critical degradation stages; not random after interactions |
| wrong_answer.wav | Authoritative incorrect verdict |
| success.wav | Authoritative ordinary correct verdict |
| success.mp3 | Authoritative local 20-task victory, streamed once after existing blackout |
| wires1.wav | Circuit contact rotation |
| failed.circuit.wav | Confirmed incorrect circuit submission; incomplete board alone is silent |
| electrical_circuit_done.wav | Authoritative successful circuit submission / power activation |
| machine_shutdown .wav | Existing expanded-machine final CRT blackout |
| 1 to 4 sound(appearing sequence).wav | Source for four approved pitch variants below |

Memory variants: `memory_note_red.wav`, `memory_note_green.wav`, `memory_note_blue.wav`, `memory_note_yellow.wav`, mapped to red, green, blue, yellow. Source inspection found one 0.241-second impulse, not four sequential notes. With user authorization, variants use pitch ratios 1, 2^(4/12), 2^(7/12), 2, preserving the original. Notes play at existing flash onsets using server time; old notes stop before the next. Late/resumed frames do not enqueue missed notes.

`second_metal_creaking.wav` does not exist in the provided directory. The actual filename is `second_metal_cracking.wav`; it is used quietly for stress. The shutdown filename really has a space before `.wav`. Neither original was renamed. No new failure/hatch animation was invented: shutdown is connected to the existing expanded victory blackout, not unrelated failure/result transitions. Decorative structural audio is suppressed during memory and reaction/silence tasks. Existing optional native voice/radio recordings are outside this supplied sound set and were not replaced.

All fifteen originals retain their SHA-256 values. PCM24, float WAV and extensible WAV sources have compatible PCM16 runtime copies; original rates/channels are preserved. The import script is `tools/audio/prepare_last_command_audio.py`. It can reproduce the runtime files from the original user directory (or `--source` location; see script help). Assets preload once per game screen / browser audio scope, never in the render loop. Browser decoding is asynchronous; native Sound loading occurs when the scene is created. No new dependencies.

## Manual listening

Browser: `http://localhost:18096/last-command-3d/audio-test.html` (substitute your development server port). Press Load, then any of 18 named effects. Volume and Stop all are provided. This separate page creates no room and changes no score. Normal `npm --prefix web3d run build` and watch produce both bundles.

Native: `./gradlew :lwjgl3:lastCommandAudioPreview`. All 18 effects have individual buttons, +/- volume, Space to stop, Escape to exit. No server is required.

## Automated verification

- `python3 tools/checks/check_last_command_audio_assets.py`: hashes of 15 originals, runtime PCM formats, valid manifest mappings, four distinguishable pitch variants.
- `./gradlew :core:lastCommandAudioCheck`: fake-backend event regression for authority/dedup, throttle, circuits, flash synchronization, protected challenges, victory/shutdown, mute/pause and resource disposal.
- `./gradlew :lwjgl3:lastCommandAudioDecodeCheck`: real libGDX backend loads 17 Sound and one Music without codec errors; exits without playing.
- `tools/checks/check_last_command_sound_library.cjs`: real browser decoding, actual playback starts for all 18 clips, volume, stop and AudioContext disposal.
- `tools/checks/check_last_command_audio_gameplay.cjs`: real HTTP/WebSocket gameplay, controls, local echo suppression, incomplete/incorrect/correct circuit, twenty validated tasks, no ordinary success over final victory, single shutdown/victory.
- `tools/checks/check_last_command_audio_memory_network.cjs`: actual memory flash/tone counts and two-client audio isolation.
- `tools/checks/check_last_command_realism_audio.cjs`: retained graphics/quality regression updated to inspect semantic rotary playback rather than assume the only one-second buffer is adjuster.

Browser scripts use PLAYWRIGHT_MODULE, CHROME_PATH and LC_URL environment variables, matching other repository checks. Automated playback/codec checks do not constitute a subjective listening review on the user's speakers.

## Files changed for audio

Native: LastCommandAudio.java, LastCommandAudioEvents.java, TheLastCommandScreen.java, LastCommandNetworkBridge.java, LastCommandAudioCheck.java, LastCommandAudioPreview.java, core/build.gradle, lwjgl3/build.gradle. LastCommandExpansionCheck.java now explicitly requests its MATH fixture instead of relying on an outdated random seed.

Browser/server: runtime/sfx-bank.ts, runtime/audio-events.ts, runtime/audio.ts, runtime/preferences.ts, runtime/view.ts, main.ts, audio-test.ts, build.mjs, package.json, web/last-command-3d/audio-test.html, audio-test.css, LastCommandDevRoutes.java, LastCommandDevIsolationTest.java (production SFX endpoint remains unavailable).

Assets/tooling/docs: fifteen original audio assets, runtime assets/manifest, tools/audio/prepare_last_command_audio.py, four new sound checks, updated realism sound check, .gitignore, assets/sounds/last_command/README.md, THE_LAST_COMMAND_DEV.md, this document. Existing machine material/lighting edits in the working tree predate this audio integration.

Verified in this workspace: browser build succeeds; core checks pass; all 213 server tests pass; real native decode, native panel logic, native live CRT/network rendering, browser 18-cue listening bench, memory/network isolation, gameplay verdict/victory sequence and realism/quality checks pass. The rapid-answer regression explicitly verifies that voice limits cannot discard a new validated verdict. Sound-test screenshot: `generated/last-command-sfx/sound-test.png`.
