# Multiplayer protocol v1

Transport: same-origin HTTP form endpoints + JSON WebSocket `/ws`. All clients use
one envelope:

```json
{"type":"SUBMIT_ANSWER","requestId":"unique-uuid","payload":{"gameId":"uuid","questionId":"q1","answerIndex":1}}
```

Indices 0–3; display labels 1–4. Request IDs correlate replies, not identity.
Identity and role come only from the socket authenticated by its private token.
Question commands require both gameId and questionId; optional roomCode must match
that socket's room. Stale commands cannot affect the next question.

## HTTP

All mutations use POST `application/x-www-form-urlencoded`. Responses are JSON.

- `/rooms`: name (1–40), maxPlayers (2–8), gameMode (existing internal mode ID),
  optional password (<=64), questionCount (1–12, default5). Returns 201 plus room
  snapshot, roomId, code/roomCode, hostSession and legacy token alias. Client code
  proposals are ignored. Code is six characters from A–Z/2–9 without I/O.
- `/rooms/{code}/join`: name (1–24 Unicode), optional password. Returns snapshot
  plus sessionToken/token and selfId. Never hostSession.
- GET `/rooms/{code}`: public snapshot; no tokens, password or private selection.
- POST `/rooms/{code}/heartbeat`: token, authenticated snapshot (legacy generation flow).
- POST `/rooms/{code}/reroll`: host token; only empty lobby. Changes server code.
- POST `/rooms/{code}/leave`: token; host closes room, player leaves.
- GET `/health`: `{"status":"ok"}`; no administration endpoint.

Errors: HTTP status and `{"error":"CODE"}`. No passwords/tokens in URL or normal logs.
Create/join are not replay-idempotent: do not blindly retry after an ambiguous HTTP
failure. Unconfirmed rooms expire; UI allows explicit retry. WebSocket submissions
are atomic and immutable; duplicate requests cannot add another answer/score.

## Connection and events

Server sends CONNECTED with protocolVersion. Within 5 seconds send AUTH with
roomCode and token. AUTHENTICATED returns a personalized full snapshot.
New authentication with the same token closes the old socket (4001); only the new
socket may submit. Closed/expired rooms revoke tokens (4002). PING every10 seconds
returns STATE; SYNC requests STATE explicitly. Browser and host retry exponentially
up to12 attempts, max15s delay plus jitter; manual retry remains available.

Client commands:

| Command | Role | Meaning |
|---|---|---|
| AUTH | unauthenticated | Attach existing private session |
| PING / SYNC | either | Latest personalized state |
| START_GAME | host | Start lobby with >=1 online player |
| PRESENTATION_READY | host | Four answer animations finished; start server deadline |
| SUBMIT_ANSWER | player | One final answerIndex during ANSWERING |
| REVEAL_READY | host | Clock exited and first answer-reveal frame drawn |
| NEXT_READY | host | Result animation and hold finished |
| LEAVE_ROOM | either | Leave, or close room if host |

Events: CONNECTED, AUTHENTICATED, STATE, ROOM_UPDATED, PLAYER_JOINED, PLAYER_LEFT,
PLAYER_RECONNECTED, GAME_STARTED, QUESTION_STARTED, ANSWERING_STARTED,
ANSWER_ACCEPTED, ANSWER_REJECTED, ANSWERING_FINISHED, REVEAL_STARTED,
QUESTION_RESULTS, RESULTS_STARTED, GAME_FINISHED, ROOM_CLOSED, ERROR.
HTTP create response provides room-created state; no redundant ROOM_CREATED WebSocket
push occurs before authentication. Most events contain a complete snapshot; errors
contain code and echo requestId; unsolicited events use empty requestId.

Snapshots: protocolVersion, roomId, roomCode/code, roomSettings, roomStatus, phase,
revision, serverTime, publicUrl, hostConnected, players/currentPlayers. Each player:
id, name/nickname, characterId, connectionStatus, isAlive, score, hasSubmittedAnswer.
No chosen answers in public roster. Personalized fields: selfId, host,
hasSubmittedAnswer, currentAnswer (only this recipient's answer, -1 if none).
Tokens appear only in authenticated HTTP credential responses, never broadcasts.

In game: gameId, questionNumber/count, questionStartTime, phaseStartedAt,
answeringStartedAt, deadline, answeringEndedAt, remainingMilliseconds, question.
Question: id, text, answers[4]. correctAnswerIndex is absent during presentation
and answering, including host messages. Host receives it during REVEALING, **after**
server deadline, to drive existing visuals. Players/public GET receive it only in
RESULTS/GAME_FINISHED. Results include playerId, selectedAnswer (-1 for missing),
isCorrect, answeredInTime. Correct answers award100 points once; no time bonus.

## State and timing

LOBBY → STARTING → QUESTION_PRESENTATION → ANSWERING → REVEALING → RESULTS →
(next QUESTION_PRESENTATION or GAME_FINISHED).

Presentation remains the existing seeded glyph animation, voice-finish/two-second
hold, move, answer stagger. The host's PRESENTATION_READY begins exactly20s on the
server. Monotonic epoch time is injected for tests. Arrival at `now >= deadline`
is rejected, with **no hidden grace window**. Phone clocks never decide acceptance.
Clients estimate remaining time using serverTime + local monotonic elapsed; PING
RTT compensation is cosmetic. Server tick also closes phases without incoming input.

Default EndPolicy.TIME_ONLY waits the full20s even when everyone answered.
ALL_SUBMITTED_OR_TIMEOUT is an injectable server policy supported by RoomService
and tested end-to-end at the service layer. Players cannot change it.

At deadline: REVEALING, ANSWERING_FINISHED. Existing clock closes .2s, holds .1s,
falls .42s. REVEAL_READY is accepted no earlier than720ms and only after the host
has drawn its first reveal frame. Then RESULTS and result events reach phones.
NEXT_READY requires600ms reveal +2500ms hold. Duplicate ready events do not double
score; old-question events are rejected. At most12 questions.

A host absent60s ends a running game; presentation has90s watchdog, revealing/results
30s watchdog. Disconnected host room expires120s; disconnected lobby seats10min.
Players keep their game seat and answer across reconnect; an explicit leave revokes
rejoin. One offline player does not pause everyone. Finished rooms remain until the
host leaves/expires; a new game currently requires a new room.

## Security and operation

256-bit SecureRandom session tokens; distinct host/player credentials. Passwords
use salted PBKDF2-HMAC-SHA256 (100000 iterations), never public snapshots. State
mutations are serialized in RoomService. Frames max16KiB/depth24, HTTP body8KiB,
bounded socket output64 messages; slow consumers disconnect. WS commands burst30,
refill6/sec; connect burst20/refill1/sec; global512 sockets,32/IP; creation6 burst,
.1/sec; joins15 burst,.25/sec; maxRooms configurable1000 default. HTTP limit80/2sec.
Shared NAT users share IP limits. These are baseline protections, not a load audit.
Strict same-origin policy for browsers, explicit allowlist in production; native
clients still need credentials. Use HTTPS/WSS for internet. Browser uses textContent
and sessionStorage, not HTML injection or URL tokens. No persistence/multi-node yet.

## Extension: THE IMPOSTOR

Keep authentication, room membership, personalized snapshots and the transport.
Add a real phase/controller in server/game when implementing the rules; route
SUBMIT_TEXT / SUBMIT_SUSPICION / SUBMIT_VOTE only to that active phase. Validate
role, phase generation, size and one-submission rule there. Use the existing
ALL_SUBMITTED_OR_TIMEOUT policy with an explicit10s deadline, then simultaneous
server transitions. Serialize secret role/word only for the correct recipient,
never into public state. Add the real MINIGAME phase and events with its controller;
unknown future commands are rejected today. No fake minigame implementations exist.

## Files

Created: shared module/protocol; server/GameSession, ServerConfig, transport classes,
RoomServiceTest/TransportTest; core/network/RealtimeClient and NetworkRoundAdapter;
web/index.html, style.css, app.js; MultiplayerCheck; deploy examples; this document.

Expanded: existing RoomServer/RoomService, FinalAnswerGame, PlayScreen,
RoundController, RoomApiClient/RoomSession, GenerationCodeScreen, RoomCodeGenerator,
LobbyPanel, localization, Gradle configuration and existing checks/docs.
Question/QuestionSource/DemoQuestionSource moved unchanged in package name into shared
(Question additionally supports hidden network answer index -1). No second room server.
