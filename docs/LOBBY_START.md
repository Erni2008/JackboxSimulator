# Waiting room ownership and match start

The existing RoomService remains authoritative. A room has 2–8 phone players plus a separate desktop host; the host does not occupy a cage. Membership tokens map to stable player IDs and exactly one of the eight existing character IDs. Character selection is committed atomically inside the room lock. A duplicate explicit choice returns CHARACTER_IN_USE; an omitted choice assigns the first available real character. Snapshots expose availableCharacters for the phone selector, but server validation resolves concurrent selections.

A dropped connection is OFFLINE and retains its ID, character and cage for reconnect. A replacement socket revokes the old one. Explicit lobby leave releases the seat and character immediately. Existing lobby expiration releases an offline reservation after ten minutes; host loss closes a room after the existing timeout. Half-open lobby sockets also expire after 45 seconds without authenticated traffic; this uses a reconnectable close code. Start is blocked until every reserved lobby member reconnects or leaves. No offline player is silently dropped from a match roster.

Only the authenticated host can START_GAME. The server requires at least two players and all lobby members online, checks character uniqueness, freezes participant IDs and creates the existing GameSession in STARTING. HTTP joins are blocked immediately, including during STARTING. Existing authenticated players can reconnect after start; they receive the current phase and never create duplicate participants.

## Shared transition

`Protocol.LOBBY_TRANSITION_MILLIS` is 4000 ms. GAME_STARTED includes `transitionStartedAt`, `transitionEndsAt` and `roundTitle`. Every desktop update uses server time, not time since receiving a packet. Snapshot refreshes therefore do not restart the animation. Late reconnects catch up to its current position. The first question starts at the shared deadline, even if a server tick is late. This is authoritative phase synchronization, not a guarantee of zero network latency or presentation on an offline device.

The existing CageLobbyScreen locks all lobby buttons while a start request is pending and throughout STARTING; rejection unlocks them. It applies a start-only ±3.8° cage rotation with independent phases, preserving the stationary hook and transformed ring/chain connection. Reduced motion suppresses this rotation. Launch swing and blackout use the same absolute-time `LobbyStartAnimation` clock: each cage moves until the overlay reaches full opacity at 2.5 seconds, then continues the same periodic motion behind the black screen until the scene handoff; no phase reset or frozen interval is inserted. A black overlay fades the room from 0.4–2.5 seconds; the first-round title fades in from 2.25–2.85 seconds. Idle animations, cage artwork, layout and character rigs are unchanged. The existing PlayScreen is prepared during STARTING and shown on QUESTION_STARTED. No parallel gameplay scene or networking infrastructure was added.

Phones show the same server countdown during STARTING. QUESTION_PRESENTATION opens the first question UI immediately with answers disabled and no running timer. The existing host PRESENTATION_READY handshake starts ANSWERING for everyone with the same authoritative deadline. Screen changes reset scrolling, so a long guest list cannot hide the first question heading. Disconnecting during the transition does not rewind other clients: returning clients recover the latest phase and their original identity.

## Verification

```sh
./gradlew :server:test :core:check :lwjgl3:compileJava :lwjgl3:compileDevJava
./gradlew :lwjgl3:lobbyStartCheck
```

`LobbyStartTest` covers unique ownership, atomic eight-player assignment, minimum player count, offline blocking, slot-preserving reconnect, late-join lock, start deadlines and reconnectable silent sockets. Existing question and Impostor continuation tests explicitly advance through STARTING. TransportTest exercises actual HTTP and WebSocket clients.

`lobbyStartCheck` is development-only and starts a private loopback server, the real desktop game and eight authenticated phone clients. It clicks the production PLAY button through Scene2D, verifies stable rig instances and shared deadlines, captures transition phases and confirms that all eight clients reach ANSWERING. Captures are ignored under `generated/lobby-start/`.

Browser verification uses the existing development host:

```sh
./gradlew :lwjgl3:desktopHostingQA
PLAYWRIGHT_MODULE=/path/to/playwright node scripts/check_lobby_start_browser.cjs
```

Start with a fresh `lwjgl3/build/desktop-hosting-qa/ready.json` from the current host. Optional PLAYWRIGHT_BROWSERS_PATH / CHROME_PATH select the local browser installation. The script uses eight separate mobile browser contexts, normal join UI, real HTTP/WebSockets, offline/reconnect, forbidden player start, late-join rejection, the real first-question UI, shared answer deadlines and one isolated answer submission. It exits the host and verifies its server port is released. The fixture's existing local-file command channel is test-only and adds no production administrative endpoint.

Native and browser captures were inspected. Physical phones, adverse WAN latency and hardware performance across devices were not tested.

Final results: 123 server tests passed (zero failures/skips), core checks and desktop/dev compilation passed; native eight-client start check and eight-context mobile browser check passed. Browser captures were rechecked after the scroll/timer presentation fix. No physical-device or WAN claims are made.

The native integration/interactive preview now includes eight sequential real phone submissions. Auto mode starts one player at a time and waits for server acceptance, +35% growth and visible idle playback before scheduling the next. Interactive auto mode is on by default; A toggles it, and 1–8 remain manual answer controls. Automated assertions verify every individual response and that unanswered neighbors remain small/shivering.

Current polish: the built-in twelve-question server catalog and first-round title are Russian. Desktop Cyrillic uses the bundled condensed semibold font with existing shadow/layout fitting. Cage and question nicknames share stable character-specific colors (deep ink on parchment, lighter tones on dark gameplay backgrounds).
