# The Impostor: sound integration

The existing `PresentationAudio` scope preloads the shared-screen WAVs and continues loading/playing its original optional OGG effects. No game rules, role assignment, vote calculations, stage durations, or wire events change.

| Resource under `assets/sounds/impostor/` | Device / existing event |
| --- | --- |
| `mini_game_introduction.wav` | Shared screen, once at the initial INTRO/ROLE_REVEAL presentation |
| `page_turn.wav` | Shared screen, successful `revealClues()` or `flipPapersBack()` animation |
| `card_role_impostor.wav` | Only the active impostor's visible phone during ROLE_REVEAL |
| `vote_started.wav` | Shared screen, official FINAL_VOTING entry |
| `vote_sent.wav` | Phone, personalized FINAL_VOTE_ACCEPTED with accepted vote state |
| `runtime/voting_closed.wav` | Shared screen, official transition out of FINAL_VOTING, including early completion |
| `runtime/wooden_stumb_hit.wav` | Shared screen, each stamp's contact marker, not each render/update |
| `impostor_role_reveal.wav` | Shared screen, IMPOSTOR_REVEAL animation entry |

All eight originals were found in the project root, also present under `/Users/erni/Desktop/candles/2game/sounds/`, and copied without renaming or alteration to `assets/sounds/impostor/`. Root and desktop originals remain intact. `manifest.json` records source WAV SHA-256, PCM format and duration. WAVs remain ignored by Git under the user's existing private-media rules.

`tools/assets/prepare_impostor_audio.py` creates two reproducible runtime copies, preserving originals: voting_closed has approximately 10.86x gain (original peak about 0.069, prepared peak 0.75); wooden_stumb_hit removes 0.5003 seconds of nearly silent pre-impact lead, retaining one millisecond before the transient and the complete remaining tail. Original filenames remain unchanged in the runtime subdirectory. The stamp event stays at the existing `FinalRevealTiming.IMPACT=220ms`; no animation timings are shifted to compensate for the recording. At the existing 400ms stamp interval, four source hits mixed at the default .65 gain peak around .653 before other optional effects.

Clock ticking reuses `assets/sounds/questions/clock_ticks.wav` (`QuestionAudio.CLOCK`), streamed/looped by the extended PresentationAudio scope. No duplicate clock file. One Music instance is driven by the same EVIDENCE_REVIEW / FINAL_VOTING deadline displayed on the shared screen, seeks to phase elapsed time on start/resume, stops at deadline, early phase exit, hide/pause and disposal. Existing master/SFX gain, local volume and sound-enabled controls apply. The existing hand texture now rotates around its measured hub using authoritative stage progress; application pause holds it, reduced motion updates in whole-second steps. Reset restores twelve o'clock.

The phone audio bridge (`web/impostor-audio.js`) preloads/decodes only the two personal sounds. User gestures unlock Web Audio; a hidden phone/tab does not play private cues. Heard cue keys persist across reload in sessionStorage and duplicates do not replay. Sound-enabled settings, visibility, disconnect and disposal stop active sources. Only the two personal WAVs are copied into server web resources at `/audio/impostor/`; no audio or secret-role event is transmitted between clients.

Validation commands:

```sh
python3 tools/assets/prepare_impostor_audio.py
node tools/checks/check_impostor_audio.cjs
./gradlew :core:check :server:test :lwjgl3:classes --offline
./gradlew :lwjgl3:impostorCheck -PimpostorAudioQA=true --offline
```

The native check includes one intro/start/close cue per event, a moving real clock hand and pause, four marks/hits on one card, low-FPS marker crossing, duplicate/restored snapshots and disposal. Browser `check_impostor_browser.cjs` with `IMPOSTOR_FINAL_QA=1` covers 3/4-player matches, two spectators, private role audio, accepted/repeated/reloaded vote cues and timeout/early completion. Real mobile Safari/Android hardware listening remains a manual check; browser autoplay requires the normal join/touch gesture.

For a visible real-time sound demo, start `:server:impostorBrowserFixture` with its default real clock, run `:lwjgl3:impostorPreview -PimpostorConnection=/absolute/path/to/server/build/impostor-browser/ready.json`, then run `tools/dev/run_impostor_audio_demo.cjs` using Playwright and a full headed Chromium executable via PLAYWRIGHT_MODULE / CHROME_PATH. It joins four independent active tabs plus one observer, uses actual accepted inputs and real stage timers, and leaves the native host/browser open at the end. Close the browser to end the browser demo. It introduces no production admin endpoint.

Finale presentation: phones now switch to an entirely black view immediately after their accepted final vote and for VOTING_LOCKED, FINAL_VOTE_REVEAL, SUSPECT_ANNOUNCEMENT, IMPOSTOR_REVEAL and RESULT. Receipts/drafts/names/cards are cleared, navigation and game progress chrome are hidden, and reload preserves the blackout. Unsubmitted players retain voting controls; the initial private role card is unchanged. Normal lobby/next-game routing restores the UI. This changes presentation, not authoritative snapshot delivery or scoring. The shared nickname and identity highlight begin at `FinalRevealTiming.IDENTITY_NAME_MILLIS=3400`, with a 120ms fade, matching the supplied reveal track's strong 3.4–3.7s accent. The 4s game phase itself is unchanged; the held identity scene retains the original phase start across RESULT/reconnect.

Writing feedback additionally preloads `assets/sounds/impostor/writing_words_on_paper_theimpostor.wav` (copied unchanged from the project root; 17s PCM16). The same phone audio bridge reacts to eligible clue-input events only. Consecutive letters extend one voice/envelope; after 200ms without input it fades and stops by 240ms. Audio scheduling uses the existing Web Audio clock, with no render loop or per-letter sample decoding. It stops on accepted clue, phase exit, mute, hide or disconnect and works again in subsequent rounds. This quiet source uses a fixed gain of 5.2 (source peak .032, output peak about .166); source WAV remains unchanged. The demo types real letters with small intervals so the pen motion and sound are both exercised.

## Host writing and caught-impostor elimination

Phones send an additive `IMPOSTOR_TYPING` message (roomCode/sessionId/round only) on real input, at most once per 220ms. The server validates membership, phase, round, accepted-clue state and session, coalesces rapid repeats and grants a 450ms activity lease. Only the authenticated host receives the aggregate `writingUntil` value; neither keystrokes, draft text nor per-player activity is broadcast. Expired/disconnected/submitted activity cannot keep a sound alive. Existing clients without this optional message remain compatible.

PresentationAudio preloads one looping Music from `assets/sounds/impostor/runtime/writing_words_on_paper_theimpostor.wav` (offline gain-prepared copy of the original quiet recording). Multiple writers share that voice; phase exit/activity expiry fades it out in 100ms, and mute/pause/hide/disposal stop it. No audio data is sent over the socket. Settings and the existing master/SFX mix apply.

`ImpostorElimination` wraps existing portrait groups without replacing art or modifying rigs. Only authoritative IMPOSTOR_CAUGHT and the actual impostorId qualify. It starts 450ms after the 3.4s identity accent, slumps/briefly twitches, fades, rises and settles at .48 opacity with an ELIMINATED marker. Both the upper portrait and the final card use the same deterministic pose. Other players, IMPOSTOR_ESCAPED and NO_CONSENSUS remain unchanged. Late snapshots seek the same pose; replay/reset restores original transforms. Phones stay black. This is a visual outcome presentation, not a new scoring, resurrection or permanent player-life rule.

Validation additionally includes host-only/private typing snapshots, invalid/stale/spectator inputs, coalescing, expiry and submitted-clue rejection; real 3/4-player native network host checks prove writing playback starts and stops in each match; `:lwjgl3:impostorCharactersCheck` covers original rigs with only the caught portrait faded; graphical final-card checks and pure pose checks cover persistence, restored transforms and escaped outcomes.
