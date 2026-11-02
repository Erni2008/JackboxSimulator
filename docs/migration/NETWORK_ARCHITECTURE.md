# Сеть: Unity desktop + существующие браузерные контроллеры

Статус: план совместимости с протоколом v1; изменения сервера/телефонов на текущем этапе отсутствуют. Основание — исходники, перечисленные в конце, а не старые описания демо.

## 1. Топология и авторитетность

Первый перенос сохраняет Java `RoomServer` (Javalin) и `RoomService`. Unity — native host-клиент с прежним host token. Игроки открывают обычный сайт в Safari/Chrome на телефоне; сайт получает HTML/CSS/JS и публичные изображения/звуки от того же HTTP-сервера. Модели и Unity runtime на телефоны не отправляются.

```text
Unity desktop ──HTTP form / JSON WebSocket v1──┐
                                             ├── Java RoomServer ── RoomService ── Game sessions
Телефоны 2–8 ──HTTP site / JSON WebSocket v1───┘
```

В существующем Java desktop сервер может жить внутри JVM (`LocalServerManager`). Unity не может просто сконструировать Java-класс C#-вызовом. Первый сетевой стенд использует отдельный процесс Java-сервера. Для готовой desktop-версии `ServerProcessHost` запускает тот же server JAR через bundled JRE, проверяет `/health` и завершает **только принадлежащий ему процесс**. Внешний HTTPS-сервер — альтернативный режим; Unity не запускает локальный listener поверх внешнего.

Локальная публикация: bind на доступный LAN-интерфейс, показывать телефонный URL с IP компьютера и QR; `127.0.0.1` предназначен только для Unity на том же компьютере. Не подключаться автоматически к неизвестному сервису на занятом порту. Внешняя публикация: TLS reverse proxy, HTTP→HTTPS и WS→WSS, соблюдение `ServerConfig` origins/trusted proxy. Unity project не содержит host token или пароль в ScriptableObject.

## 2. Точный контракт HTTP

Сервер принимает `application/x-www-form-urlencoded`, возвращает JSON. Не заменять запросы JSON body без изменения API.

| Метод/путь | Использование |
|---|---|
| `GET /health` | Доступность сервера |
| `POST /rooms` | `name`, `maxPlayers` 2–8, `gameMode`, optional `password`, optional `questionCount` 1–12; возврат host credentials |
| `GET /rooms/{code}` | Публичное состояние без выдачи токена/личной роли |
| `POST /rooms/{code}/join` | `name`, `password`, optional `characterId`; возврат player credentials |
| `POST /rooms/{code}/heartbeat` | `token`; поддержание сессии, в том числе до WS |
| `POST /rooms/{code}/reroll` | Host `token`; только пустая незапущенная комната |
| `POST /rooms/{code}/leave` | `token`; host закрывает комнату, игрок покидает место |

Код генерируется сервером: 6 символов из `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`. Сервер не обязан использовать нарисованный клиентом предварительный код. `token` из ответа create/join сохраняется для AUTH; `hostSession`/`sessionToken` — существующие aliases credentials, не новые auth-протоколы.

Хост не занимает один из 2–8 телефонных слотов: `room.members` и `room.host` разделены. Старт обычной игры/Last Command/Cursed Boxes требует минимум двух online members. Impostor дополнительно проверяет roster из 3 или 4. Старые README со стартом при одном игроке не являются текущей спецификацией — приоритет у `RoomService`.

## 3. WebSocket и сообщения

Путь `/ws`, text JSON, envelope:

```json
{"type":"AUTH","requestId":"client-generated-id","payload":{"roomCode":"ABC234","token":"<runtime-only>"}}
```

Версия находится в CONNECTED и snapshots (`protocolVersion: 1`), а не обязательным новым полем envelope. Клиентские `type` удовлетворяют `[A-Z_]{1,40}`, `requestId` — `[A-Za-z0-9_-]{1,64}`. Broadcast от сервера имеет пустой requestId; replies несут requestId исходной команды. Нельзя отвергать broadcast, применив к нему клиентский regexp.

Последовательность: `CONNECTED → AUTH → AUTHENTICATED(snapshot) → game commands / broadcasts / STATE`. `PING` и `SYNC` возвращают `STATE`; app PING отправляется каждые 10 секунд. Это не то же самое, что protocol-level WebSocket ping frame.

Реальные ограничения сейчас:

- максимум envelope 16384 по `Protocol.MAX_MESSAGE_BYTES`; транспорт также ограничивает текст. `Protocol.decode` дополнительно проверяет Java string length и глубину JSON ≤24, поэтому тестировать UTF-8 payload, не полагаться только на количество C# chars;
- HTTP body до 8192 байт; unauthenticated WS закрывается после 5 секунд, idle WS — 35 секунд;
- WS token bucket capacity 30, refill 6/с на соединение; HTTP, create/join/upgrade имеют отдельные лимиты;
- серверный scheduler вызывает tick каждые 25 мс, но это не обещание сетевого RTT 25 мс и не обязательная рассылка 40 snapshots/с;
- `RoomService` сериализует операции `synchronized`; состояния комнат и результаты находятся в памяти процесса, распределённого storage нет.

Unity transport: один receive loop с reassembly до EndOfMessage, один сериализованный send queue; cancellation на disconnect/exit. [ClientWebSocket допускает один send и один receive параллельно](https://learn.microsoft.com/en-us/dotnet/api/system.net.websockets.clientwebsocket), несколько одновременных sends не планируются. Ограниченная входная очередь main thread; переполнение приводит к контролируемому resync/reconnect, не к неограниченной памяти. Поддержка на выбранных Unity player/backend проверяется отдельно.

## 4. Основные группы команд

| Область | Имеющиеся сообщения | Условие |
|---|---|---|
| Комната | AUTH, PING, SYNC, LEAVE_ROOM | Токен определяет права, playerId из клиента не источник авторизации |
| Викторина | START_GAME, PRESENTATION_READY, REVEAL_READY, NEXT_READY, SUBMIT_ANSWER | Host-ready после нужного показа; player answer один раз до deadline |
| Вступление | INTRO_READY, SKIP_INTRO, INTRO_PAUSE, INTRO_RESUME | Проверка gameId/introId и host |
| Last Command | START_LAST_COMMAND, LAST_COMMAND_ACTION, END_LAST_COMMAND | Проверка lobby/session/task identifiers |
| Cursed Boxes | START_CURSED_BOXES, CURSED_SCENE_READY, CURSED_HIDE, CURSED_SELECT, CURSED_FIRE, CURSED_SHOT_STARTED/IMPACT/COMPLETE, CURSED_RETURN_TO_LOBBY | Телефоны выбирают; host подтверждает существующие animation milestones по shotId |
| Impostor | UPDATE_IMPOSTOR_SETTINGS, START_IMPOSTOR, REPLAY_IMPOSTOR, IMPOSTOR_RETURN_TO_LOBBY, IMPOSTOR_TYPING, SUBMIT_CLUE, SUBMIT_SUSPICION, SUBMIT_FINAL_VOTE | Фазы, roster, права и точный набор полей проверяются сервером |

Точные DTO берутся из `RoomService.command`/`cursedCommand` и тестов. Таблица — навигация, не замена полного schema fixture. В payload, где сервер проверяет `keySet().equals(...)`, даже «полезное» новое поле вызывает отказ. Новый Unity build не добавляет `clientVersion` в каждую action.

## 5. Snapshot reducer, ACK и дедупликация

Snapshot содержит `revision`, `serverTime`, `roomId`, `roomCode`, `selfId`, roster, общую `phase`, optional `lastCommand`/`cursedBoxes`/`impostor`. `revision` увеличивается при broadcast, а reply STATE может иметь ту же revision. Сначала обработать корреляцию requestId/error, затем применить snapshot, если он не старше принятого для этой room/session. Нельзя отбрасывать равную revision до обработки ACK.

Identity scope: backend origin + roomId; вложенные сессии различаются по sessionId/gameId. Новый sessionId обнуляет pending input и локальные семантические caches. TCP-порядок внутри socket не защищает от позднего callback старого socket: generation token отсеивает его.

Дедупликация не универсальна для всех серверных команд:

- Last Command ведёт bounded request sets до 2048; в гонке — per player, в классической сессии — actor + requestId.
- Cursed Boxes хранит принятые shot requests и shotId; это отдельная модель идемпотентности.
- Викторина отвергает второй ответ через `submitted`; это не replayable command log.
- Эффекты Unity используют свои semantic keys: session + task/shot/result identity + milestone. Не проигрывать звук каждый раз, когда приходит тот же snapshot.

Не пересылать на reconnect всю очередь неотвеченных действий. Неидемпотентный rotary STEP мог уже исполниться. Восстановить AUTH/STATE, отменить непроверенные projections, а повторять только сообщения с известными правилами и тем же requestId. RELEASE требует сохранения существующего восстановления/отмены удержаний, а не повтора PRESS.

## 6. Last Command: персональные терминалы

Современный путь `LastCommandSession → CommandRace` ведёт независимые задания, положения механизмов, numeric input и score **для каждого actor**. `snapshot(self.id, now)` персонализирован. Это не одна общая физическая машина, у которой все телефоны бесконтрольно перетягивают один lever.

`registerActors(allMembers(...))` включает и host actor, хотя host не занимает телефонный слот. Unity в режиме полного паритета показывает свой authenticated host terminal, как существующий desktop/Three.js клиент. Нельзя молча переключать его на playerId другого игрока: нынешний протокол не предоставляет host spectator subscription чужого private task. Будущий общий spectator UI требует отдельного решения/расширения контракта; публичные scores уже доступны.

Реальный expanded action:

```json
{"type":"LAST_COMMAND_ACTION","requestId":"unique-id","payload":{"roomCode":"ABC234","sessionId":"session-from-state","taskId":"task-from-state","element":"TOUCH_PANEL","action":"KEY","value":"7"}}
```

Все value сохраняют string type: seed/64-bit identifiers не преобразуются через float/double. Element/action compatibility валидируется сервером. Numeric `KEY` допускает цифру/минус/CLEAR/DELETE, `CONFIRM` отдельно. Изменение входа не означает правильность.

Readiness: дождаться загрузки/готовности интерактивного экрана, отправить `TOUCH_PANEL/CLIENT_READY` с taskId; выполнить существующий `CLOCK_SYNC` challenge; сохранять `VISIBILITY HIDDEN/VISIBLE` semantics. Barrier включает зарегистрированные терминалы; не обходить его fake ready. `clockRttMs` сервер ограничивает 250 мс, реакционные проверки используют половину этого RTT. Unity не предлагает клиенту собственный `isCorrect` или время нажатия для доверенной оценки.

`sequence` панели нельзя безусловно считать единственным монотонным идентификатором события: в expanded режиме он вычисляется из serial, sequence и размера bounded request set. Граница задачи — `taskId`; результат — feedback + taskId + nextAt/finishedAt; важна also room revision.

## 7. Отклик без изменения правил

План переносит существующий `NumberInputPreview`: bounded очередь до 64 edits, мгновенное локальное представление и rebase по ACK requestId. Authoritative `touchscreen.input` не меняется клиентом. На ERROR, смене задачи, pause/verdict/разрыве projection сбрасывается. Rapid rotary работает отдельной pending intent-моделью; сетевой лимит не снимается ради FPS.

Ввод pointerdown даёт визуальный отклик; pointerup не повторяет цифру. Mechanical anticipation может начаться раньше принятой action, но не вызывает success и не превращает orbit drag в PRESS. Воспроизведение механического SFX допускает local feedback с подавлением echo; correct/wrong/victory — только из принятого авторитетного перехода.

## 8. Reconnect, приватность и результаты

Существующий desktop reconnect: до 12 попыток, exponential delay от 500 мс до 15 с + jitter. Unity должна явно показывать состояние, позволять retry и восстанавливать AUTH тем же токеном. Новый socket заменяет старый для того же member. Телефоны сохраняют credentials в sessionStorage; телефоны не обязаны передавать их Unity.

Host disconnect сейчас может закрыть комнату через 120 с; основной quiz имеет отдельный host-unresponsive предел 60 с и фазовые 90/30 с. Не обобщать эти значения как единую «паузу всех игр». Last Command индивидуально сдвигает deadlines при resume отключённого терминала, Cursed Boxes использует ready/shot-barriers, Impostor имеет собственные disconnected-participant правила.

Host token не попадает в QR, логи, отчёты, Git, local match history или телефонный HTML. Закрытые роли/слово/ballots и содержимое коробок доступны только в соответствующих персональных/host snapshots и фазах. Никаких public caches private snapshots. Debug-трассы обезличиваются; `LastCommandDevRoutes` доступны только при `lastcommand.dev=true`, Unity production не зависит от `/last-command-dev` и dev-эндпойнтов моделей.

Локальная история Unity записывается только по terminal result, с дедупликацией session/result key. Состояние Java rooms сейчас не переживает рестарт сервера; local result JSON это не исправляет. Для server restart recovery потребуется отдельная схема persisted state и миграций, после паритета.

## 9. Повторное использование браузерного кода

| Компонент | Решение |
|---|---|
| `web/index.html`, `app.js`, общие CSS | Оставить сайт/DOM/HTTP/WS поведение без переписывания |
| `last-command.js`, `command-touch.js`, `command-ru.js` | Оставить телефонные формы, canvas, labels; Unity делает native CRT отдельно |
| `cursed-boxes.js/css`, `impostor.js`, `suspicion.js`, `final-voting.js` | Оставить для последующих Unity модулей с тем же backend |
| `connection-health.js`, countdown/presentation helpers | Повторно использовать прямо на телефоне |
| `web3d/src/*` | Эталон Three.js-машины/инпута/аудио, не C#-библиотека и не часть phone Unity runtime |
| Браузерные audio helpers | Сохранить существующий scope и autoplay-unlock; не дублировать весь host sound на всех телефонах |

Доставка сайта остаётся Java server resource packaging (`server/build.gradle`). Unity не запускает обязательный embedded browser, не требует APK/IPA и не меняет origin сайта.

## 10. Порядок и приёмка

1. Снять contract fixtures из Java runtime/tests без секретов, включая равную revision с ACK, stale session, winner и paused terminal.
2. Подключить Unity transport к реальному внешнему Java-серверу; отдельно проверить Mono/IL2CPP и cancellation.
3. Создать комнату, подключить 2/4/8 старых browser controllers; сравнить roster и персональные snapshots.
4. Пройти numeric/mechanical tasks, ошибки, repeats, одновременные нажатия, rate-limit и host/player disconnect.
5. Повторить после отдельной clean install, без Editor и без внешней Java при bundled runtime.
6. Только после этого обсуждать C# server. Не запускать два арбитра одной комнаты и не переводить телефоны на новый протокол незаметно.

Источники: [Protocol](../../shared/src/main/java/com/finalanswer/protocol/Protocol.java), [RoomServer](../../server/src/main/java/com/finalanswer/server/RoomServer.java), [ServerConfig](../../server/src/main/java/com/finalanswer/server/ServerConfig.java), [RoomService](../../server/src/main/java/com/finalanswer/server/rooms/RoomService.java), [RealtimeClient](../../core/src/main/java/com/erni/finalanswer/network/RealtimeClient.java), [RoomApiClient](../../core/src/main/java/com/erni/finalanswer/network/RoomApiClient.java), [LocalServerManager](../../lwjgl3/src/main/java/com/erni/finalanswer/lwjgl3/hosting/LocalServerManager.java), [LastCommandSession](../../server/src/main/java/com/finalanswer/server/rooms/LastCommandSession.java), [CommandRace](../../server/src/main/java/com/finalanswer/server/rooms/CommandRace.java), [web/app.js](../../web/app.js), [NumberInputPreview](../../core/src/main/java/com/erni/finalanswer/lastcommand/NumberInputPreview.java).
