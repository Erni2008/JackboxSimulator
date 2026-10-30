# THE LAST COMMAND — gameplay expansion

## Integration

The expansion runs in the existing `RoomService` / `LastCommandSession` lifecycle and uses the existing authenticated `LAST_COMMAND_ACTION` protocol. Other mini-game managers are unchanged. Existing GLB models and their placement configurations remain the machine assets.

`CommandRace` owns one `Player` per authenticated actor. Each has its own task instance, private generation seed, mechanisms, numeric input, sequence cursor, score, request history and pending memory challenge. `RoomService` produces a private snapshot for each recipient. Public room summaries contain only race status and scores; they do not create a playable spectator terminal.

The original `LastCommandGame` remains available through the `classic` development scenario. Existing mechanism, inspection and light-memory diagnostics remain available. The normal `START_LAST_COMMAND` route starts the expanded race.

The repository's established lobby counts guests separately from the host. Existing 2–8 guest lobby limits were preserved; the host can also operate its terminal. Standalone engine simulations cover 2, 4, 6 and 8 actors. This is **not** a claim that lobby policy was changed to count the host within an eight-person total.

## Generation and validation

Four configurable category weights default to LOGIC 20, MECHANICAL 50, MEMORY 20, REACTION 10. A match shares its family schedule across actors at the same assignment index, while individual task parameters differ. Recent families are excluded. A failed task is replaced by the same family with a new instance and seed, to preserve comparable complexity. There is no score penalty or overall failure timer.

Generation uses a stored private seed, bounded to eight validation attempts. The factory has explicit arithmetic rules; it never evaluates arbitrary expression text. It validates numeric formats, option indexes, sequence presence, pressure/frequency reachability and circuit solvability. Circuit completion runs a graph traversal of the **current** segment connections, accepting valid connectivity rather than one saved arrangement.

User-facing match seeds schedule families and presentation. Answer-generation seeds are salted on the server and retained in server state. They are deliberately **not** included in browser snapshots or task IDs. Reproducing an individual task requires its stored private task seed plus family, difficulty and generation context. Task IDs are opaque UUIDs. The classic seed behavior is unchanged.

Configuration uses JVM properties on the server process:

- `lc.weight.logic`, `lc.weight.mechanical`, `lc.weight.memory`, `lc.weight.reaction`
- `lc.difficulty` (1–3; arithmetic ranges, pressure tolerance, reaction sector width and signal duration)
- `lc.memory.length` (2–4; otherwise a shared deterministic sequence length is selected)

The weights must be nonnegative and total between 1 and 1,000,000. There is no leaderboard-based adaptive difficulty. Estimated duration metadata and aggregate server-observed completion counts/durations are available in the race state. These are an initial balancing model, **not** empirical proof of equal human completion times. Mechanical starting states are selected to keep action costs comparable; circuit layouts use comparable path lengths.

## Mechanics and controls

All rows below have procedural server generation, authoritative action handling and completion tests. They are available as task families in the expanded browser machine. The native renderer mounts an FBO instrument face on the original CRT, with numeric, option, circuit, adjustment, sequence and reaction controls. New instrument panels reuse the CRT and original rotary adjuster rather than requiring replacement GLBs.

| Requested mechanic | Implementation |
|---|---|
| Mathematical terminal | Integer arithmetic, precedence, parentheses, exact division, negative answers; digits, clear, delete and confirm |
| Number sequences | Arithmetic, geometric, increasing differences, alternating and combined rules; the applicable rule is stated |
| Expression comparison | Largest, smallest, closest, equality and absolute difference, using the same terminal controls |
| Forbidden button | Excluded colors, unlit tile, square restriction, combined shape/color restriction; physical color buttons can select matching tiles |
| Conditional commands | IF/ELSE, AND, OR, NOT over displayed lamp or switch states |
| Color contradiction | Written color, ink color, matching button, nonmatching color; explicit accessible ink label |
| Odd symbol | Unique differing shape or arrow from generated symbol families |
| Code deciphering | Shuffled symbol/digit mappings and generated codes; mapping stays visible |
| Positional attention | 3×3 layout; left, right, top, bottom, center, row/column and relative-to-center instructions |
| Electrical circuit | Rotatable straights, corners, junctions and blocked cells; three route templates with generated orientations/branches; graph connectivity validation |
| Lever sequence | Generated lever/dial targets and order, followed by red confirmation; every step validated |
| Reverse sequence | Generated symbol sequences with configurable length, shown before input is enabled |
| Broken switch | Probeable switches; return, missing indicator, wrong indicator and inverted indicator faults |
| Pressure control | Server-integrated damped pressure motion; target range; original rotary control or touchscreen adjustments; confirm |
| Fuse box | Smallest rating sufficient for a generated current; tap selection |
| Radio tuning | Reachable generated target and starting side/offset; tolerance, dial, strength feedback; browser synthesized static |
| Emergency shutdown | Generated mechanical action sequence; instructions hidden after observation |
| Faulty gauge | Generated numerical rule with exactly one inconsistent reading |
| Mechanical balance | Fixed counterweight target; reversible 1/2/5-unit additions; accepts every total that balances the model |
| Delayed number memory | First/last digit, first/last two digits, digit position and full-number recall |
| Animal memory | Position, repetition, missing item, shuffled selection and memorized animal/symbol pairing; original animal panel also remains a physical task |
| Colored lights | Timed visual/world indicators; repeated colors; forward/reverse reproduction; delayed stored-light sequence recall |
| Hidden symbols | Position, repeated item and missing item questions after observation |
| Find the change | Memorize a symbol/lamp/switch/gauge/illumination panel, blackout, select the single changed position |
| Timing challenge | Generated direction, start, sector and shared period; server-clock validation |
| Wait for silence | Randomized signal end, early-input failure, visual equivalent; browser oscillator signal |
| False command | Trusted display or audio/caption source; conflicting generated colors; browser speech synthesis when available |
| Delayed execution | Second-signal confirmation window; browser audio pulses and visual signal count |

The older four-digit mechanical code, animal/symbol panels, lever, adjuster, lamp and hatch also remain generated physical tasks. There are 36 selectable first-task families, plus scheduled recall tasks.

## Multiplayer and memory

Correct completion adds exactly one point. A memory observation adds none. First to 20 wins immediately in the serialized server event order; later actions are locked out. Wrong answers preserve the score and have a short 450 ms feedback transition.

A server-side CLIENT_READY handshake holds per-player clocks until the interface is loaded. The initial roster shares a readiness barrier: prompts stay hidden and clocks start together after all registered terminals are ready. Late development joins wait for their own interface without pausing an already-running race. Actions require the current session and task-instance ID. Request IDs are deduplicated with bounded histories. Stale task actions, post-completion actions, invalid controls and early memory input cannot award progress. Existing ordered WebSocket transport is retained; no separate transport was added.

Pending memory is private per player and can store numbers, animals, symbols, colors, switch states, symbol sequences and light sequences. Recall is scheduled after three **correctly completed** intervening tasks. Only one pending observation is assigned at a time. New cross-task observations are not assigned too close to 20 points to receive their recall. A wrong recall does not erase the stored information. Supported reconnect restores the same in-memory session. Observation/reaction clocks pause while disconnected or in a reported hidden/background view so an unseen prompt cannot expire offscreen. Process-restart persistence was not added.

Reaction timing uses server time, with half of a server-measured challenge/echo RTT, capped at 250 ms. No client timestamp determines correctness. Reconnection obtains a fresh measurement. This is bounded compensation, not a claim of perfect fairness under arbitrary network delay or deliberate packet manipulation.

## Rendering and audio

`web/command-touch.js` supplies the canvas instrument face and hit regions for both Three.js and the lightweight phone controller. Three.js maps real CRT UV hits to server actions. `CommandTouchDisplay` implements the corresponding native FBO face and ray/plane picking. Existing GLB buttons, levers and regulator still animate and reconcile from authoritative state.

The browser retains the immersive full-scene layout and temporary Start control. Native network play hides preview tools; F8 reveals diagnostics. Cameras use existing orbit infrastructure with smooth task focus. Cosmetic steam, sparks and warning indicators scale with progress in both renderers. They do not participate in picking, scoring or task generation. Browser effects respect reduced-motion preferences. Completion locks input before the short blackout/victory presentation.

Browser feedback uses real Web Audio synthesis and optional browser speech. Native command cues are lazy-loaded through the existing `GameAudio` manager. **Dedicated command foley files are not present.** The manager checks file existence and falls back to the existing UI press sound; it does not assume optional files exist.

Optional asset requirements are `assets/sounds/last_command/<cue>.wav` for:

`button`, `switch`, `lever`, `valve`, `metal`, `electrical`, `circuit`, `radio_static`, `tuning`, `steam`, `warning`, `correct`, `incorrect`, `memory`, `transition`, `shutdown`, `signal`, `voice_red`, `voice_green`, `voice_blue`, `voice_yellow`.

Native spoken conflict commands therefore currently use their visible caption fallback. Native signal/radio loop hooks are wired, but their dedicated assets are absent. Unsupported native font glyphs have readable text equivalents. Continuous native radio/static and silence audio do not yet match browser synthesis. No new external rendering/frontend dependencies or replacement model assets were introduced.

## Files

- `server/.../rooms/CommandRace.java`: private player terminals, task catalogue/factory, validation, memory, scoring, timing and telemetry.
- `server/.../rooms/LastCommandSession.java`: expanded/classic dispatch and private snapshots; existing diagnostic handlers retained.
- `server/.../rooms/RoomService.java`: recipient-specific snapshots and disconnect clock handling.
- `server/.../LastCommandDevRoutes.java`: retained classic scenario entry.
- `server/src/test/.../CommandRaceTest.java`: procedural, completion, fairness, security, memory and race tests; first-task seed catalogue.
- `core/.../lastcommand/CommandTouchDisplay.java`: native CRT FBO, controls and real ray picking.
- `core/.../lastcommand/CommandMachineEffects.java`: reused native cosmetic sprites.
- `core/.../lastcommand/LastCommandNetworkBridge.java`: task-bound actions, private round state, latency echo and visibility reconciliation.
- `core/.../lastcommand/TheLastCommandScreen.java`, `TheLastCommandRenderer.java`, `TheLastCommandMachine.java`, `OrbitCameraController.java`: native scene integration, visibility, camera, lifecycle and effect ownership.
- `core/.../audio/GameAudio.java`: lazy optional command foley and loop hooks through the existing application sound manager.
- `lwjgl3/build.gradle`, `lwjgl3/src/dev/.../LastCommandExpansionCheck.java`: native integration verification task.
- `web/command-touch.js`: shared browser canvas drawing and hit regions.
- `web/last-command.js`, `web/index.html`: lightweight controller integration, task-bound actions and contextual controls.
- `web/last-command-3d/index.html`: expanded/classic selector entries.
- `web3d/src/games/last-command/machine.ts`: CRT interaction, contextual display, cosmetic effects and resource disposal.
- `web3d/src/main.ts`, `runtime/network.ts`, `runtime/audio.ts`: task focus, task IDs, measured clock alignment, synthesized feedback and result transition.
- `tools/checks/check_last_command_expansion.cjs`, `check_last_command_expansion_gallery.cjs`, `check_last_command_touch_controller.cjs`: browser integration checks.
- Existing `check_last_command_campaign.cjs` and `check_last_command_mobile_smoke.cjs`: selectors updated for the immersive Start flow; classic regression explicitly selects the retained classic mode.
- `THE_LAST_COMMAND_DEV.md` and this document: entry points, configuration, tests and limitations.

Changes already present before this expansion to materials, scene CSS, deployment and rendering quality were preserved.

## Verification

- `./gradlew :server:test :core:compileJava`
- `./gradlew :lwjgl3:lastCommandExpansionCheck` — actual native GL window, authenticated room, generated math task, projected CRT tap, authoritative numeric input and screenshot; GL error checked.
- `node tools/checks/check_last_command_expansion.cjs` — real 3D CRT hit, valid answer, server score and independent second player.
- `node tools/checks/check_last_command_touch_controller.cjs` — lightweight mobile controller canvas tap and authoritative guest score.
- `node tools/checks/check_last_command_expansion_gallery.cjs` — launches and captures all 36 first-task families using the generated seed catalogue.
- `node tools/checks/check_last_command_mobile_smoke.cjs` — portrait browser emulation.
- `node tools/checks/check_last_command_campaign.cjs` — retained classic campaign through 20 successes, a wrong answer, delayed recall, two synchronized clients and restart.

Browser scripts accept `PLAYWRIGHT_MODULE`, `CHROME_PATH`, and `LC_URL`. `CommandRaceTest` generates 36,000 family/seed cases and completes 3,600 generated family cases, plus scoring, duplicate/stale messages, graph alternatives, timing, memory, reconnect, reproducibility, history and 2/4/6/8-actor tests. It writes `server/build/command-task-seeds.json` for the gallery harness.

Screenshots and reports are under `generated/last-command-expansion/`; classic reports remain under `generated/last-command-campaign/`.

## Remaining limitations

This is an integrated playable expansion, but not a claim that every requested presentation detail and every optional subvariant is production-finished:

- The specialized native foley/voice assets listed above are missing; continuous native audio parity remains unfinished.
- New instruments use existing rotary hardware and interchangeable CRT panels. Dedicated valve, fuse-cartridge and weight GLBs have not been authored.
- Circuit route generation currently has three templates, not arbitrary-size graph layouts. Completion nevertheless accepts every connected solution.
- Some families use a bounded visual vocabulary and compact panels, rather than unrestricted circuit sizes or arbitrary combinations of every instrument.
- Difficulty configuration is a compact global profile, not a complete designer-facing editor for every task parameter.
- Human duration balancing, adverse-network soak tests, physical-phone testing and long-running GPU/memory profiling remain necessary. Server actor simulations and browser emulation do not substitute for those checks.
- In-progress state survives supported reconnection, not a server process restart.
- Existing lobby guest/host counting is retained as described above.

These limitations mean the full production completion checklist in the request is not yet satisfied in every detail.

Button and exploration update: physical button, hatch, rear animal/symbol, lever and code families receive four selection tickets within the mechanical pool; other mechanical families receive one. Recent-family exclusion still applies. Rear selectors have no duplicate CRT buttons in the 3D client. Rear/hatch camera rotation is manual. Hatch completion requires opening the door, discovering a paper note, entering its generated four-digit code and confirming with the red button; opening alone awards no point. The code is withheld from snapshots until the hatch is open. Lightweight controllers retain accessible interaction alternatives.

Latest button/exploration verification: 195 server tests pass (including 36,000 generated cases and 3,600 completions); Java core compiles; browser build passes. `check_last_command_hatch.cjs` verifies hidden code, zero points for opening and one point for correct code/red confirmation; BUTTON/ANIMAL/SYMBOL gallery checks pass without JavaScript errors. Paper placement was checked in the open hatch screenshot.

Russian presentation verification: 196 server tests pass, including 3,600 localized family scenarios checked for untranslated instruction fragments. Browser validation confirms Russian conditional instructions, an authoritative CRT answer, isolated player scores, 4096 px body maps and anisotropy 8. False-command speech uses ru-RU in the browser; native voice cue identifiers remain language independent and missing recordings retain the documented caption fallback. Auto quality now requires sustained slow render submissions rather than idle frame intervals.

Developer task catalogue: open `/last-command-3d/?showcase=1&autostart=1` (optional `&task=RADIO`). A separate local development room exposes 37 catalogue entries with previous/next, fresh variant and module focus. All inputs use the existing server-generated tasks and validators. PREVIEW_TASK is rejected in non-development sessions; stale task IDs and duplicate requests cannot reassign tasks. Selecting a family resets the inspecting actor's practice progress; success normally generates another variant of the selected family. NUMBER_MEMORY runs the full three-completion recall cycle. RECALL provides a shortened observation/recall inspection cycle without granting a point for the observation. No answer-reveal or auto-complete action exists. Descriptions distinguish actual 3D controls from touchscreen mechanisms. Normal matches have no catalogue overlay.
Verification: 198 server tests pass; `check_last_command_showcase.cjs` selects every catalogue entry through the actual browser UI, checks new instance IDs, previous/next controls, Russian descriptions and absence of JavaScript errors.
