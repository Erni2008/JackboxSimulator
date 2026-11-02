# Final Answer — план переноса Java/libGDX → Unity 6.6

Дата анализа: 31 октября 2026. Фактическая база: Java-снимок `590e20b066af37adc92702778b2beda81f0ce9b3`, проверенный тег `java-libgdx-final-backup-verified`. Ветка подготовки: `planning/unity-migration-architecture`. Репозиторий: [Erni2008/JackboxSimulator](https://github.com/Erni2008/JackboxSimulator).

Этот этап содержит анализ, документацию и организацию исходных медиа. Unity-проект, C#-классы, сцены, новые механики и новый сервер **не реализованы**. Слова «создать», «должен» и имена будущих C#-компонентов ниже обозначают план.

## 1. Что существует в исходниках

| Подсистема | Фактическая реализация | Следствие для переноса |
|---|---|---|
| Приложение/экраны | `FinalAnswerGame`, `screens/*`, libGDX `Game`/`Screen`, Scene2D | Переносить жизненный цикл, а не наследование Java-классов |
| Модули Gradle | `core`, `lwjgl3`, `server`, `shared`, `inspector`; корневая сборка | Сохранить Java-проект рабочим рядом с будущим Unity-проектом |
| Основной цикл | Викторина: вопросы, озвучка/показ, ответы, раскрытие, результаты | Это отдельный игровой модуль Quiz, не четвёртая уже реализованная смертельная мини-игра |
| CURSED BOXES | 16 коробок, выбор укрытий/целей, очередь выстрелов, попадания, раскрытие персонажей, призраки | Сетевая игра отличается от локального стенда с двумя выстрелами и теста персонажей |
| THE IMPOSTOR | Тайные роли/слово, подсказки, подозрения, финальное голосование и результат | В существующем сервере состав этой игры ограничен **3 или 4** участниками |
| THE LAST COMMAND | 3D-экран Java и отдельный браузерный Three.js-экран; серверная гонка независимых терминалов | Первый кандидат для Unity; оба клиента — эталоны представления, Java-сервер — эталон правил |
| Дробовик/персонажи | Общие модели, кинематика, эффекты, локальные developer previews | Не считать каждый preview самостоятельной сетевой мини-игрой |
| Комнаты/сеть | Javalin, HTTP + JSON/WebSocket v1, `RoomService` | Сначала использовать сервер без изменения протокола |
| Телефоны | Обычный браузер, `web/index.html`, ES modules и CSS | Сохраняются; установка Unity на телефоны не нужна |
| Данные | JSON-каталог вопросов, JSON-манифесты ресурсов/аудио, properties/конфиги | Сначала переносить данные и их идентификаторы, затем представление |

`GameMode` перечисляет пять режимов комнаты (`standard`, `deadline`, `every_man_for_himself`, `trust_no_one`, `house_rules`). В `RoomService` эти строки проверяются и сохраняются, но отдельных полноценных серверных правил для всех пяти в текущем коде нет. `StandardMode` содержит описание/идентификатор, а не самостоятельный законченный движок. Комментарий о финальном побеге не является доказательством реализованного режима побега.

## 2. Текущие переходы и границы состояния

- Локальная навигация: MainMenu → RoomSettings → GenerationCode → CageLobby; Settings — отдельный экран. `FinalAnswerGame` владеет комнатой, соединением и экранными экземплярами.
- Общий серверный цикл: `LOBBY → STARTING → QUESTION_PRESENTATION → ANSWERING → REVEALING → RESULTS → ... → GAME_FINISHED`.
- Показ вопроса и раскрытие используют host-ready команды. По умолчанию ответы открыты 20 секунд (`TIME_ONLY`); сервер также поддерживает `ALL_SUBMITTED_OR_TIMEOUT` как серверную политику. Не заменять это локальным таймером Unity.
- `NEXT_READY`: сервер выделяет неверно ответивших живых участников; если есть и укрывающиеся, и стрелки, запускает Cursed Boxes, иначе продолжает вопросы. `RoomService` завершает/применяет результат мини-игры и возвращает основной цикл.
- Impostor имеет собственные фазы из `ImpostorPhase`; начальное представление и настройки на хосте не заменяют серверные фазы. Завершённый `ImpostorMatchResult` сохраняется в памяти комнаты при переходе к основной игре.
- Last Command запускается отдельной host-командой из лобби, имеет собственную сессию; основная гонка, classic campaign и диагностические сценарии различаются. Их нельзя свести к одному enum прогресса.
- Состояние интерфейса и состояние соединения независимы от игрового состояния. Reconnect восстанавливает серверную фазу, а не начинает новую игру.

### Фактические фазы остальных мини-игр

**Cursed Boxes:** wire snapshot вычисляет строки `PREPARING → HIDING_SELECTION → TARGET_SELECTION` (в grouped-target режиме) `→ SELECTING/FIRING → ELIMINATION → REVEALING → FINISHED`. В негрупповом режиме выбор и стрельба повторяются по очереди игроков; некоторые начальные состояния пропускаются, если укрытия уже назначены. `pendingShot` и shotId задают цикл выстрела. Отдельный enum `CursedBoxesPhase` содержит более подробный постановочный словарь, но его имена нельзя принять за фактический wire `phase`: читать `CursedBoxesSession.snapshot`. Скрытые позиции не раскрываются телефоном раньше положенной фазы.

**Impostor:** действующий `advance` проходит `ROLE_REVEAL → ROUND_CLUE_INPUT → ROUND_CLUE_REVEAL → PRELIMINARY_SUSPICION`; цикл повторяется до выбранного roundCount, затем `EVIDENCE_REVIEW → FINAL_VOTING → VOTING_LOCKED → FINAL_VOTE_REVEAL → SUSPECT_ANNOUNCEMENT → IMPOSTOR_REVEAL → RESULT`. Предварительные подозрения дополнительно имеют finalized/seal milestone. Replay проходит через `REPLAY_PREPARATION`. `INTRO` — также часть общего словаря, а enum `FINAL_GUESS`/`COMPLETE` не доказывает, что действующий сервер выполняет отдельное финальное угадывание слова: в текущем `advance` такой переход не выполняется.

**Last Command:** вложенные статусы основной гонки `READY/PLAYING/WON` плюс readiness/pause/reveal/feedback timestamps; diagnostic rounds дополнительно используют `LOST`. Подробности и отличия classic/expanded — в [плане модуля](THE_LAST_COMMAND_PLAN.md). Локальный `RoundPhase INTRODUCTION/ANSWERING/REVEAL` викторины не заменяет серверный Protocol.Phase.

## 3. Решения на весь перенос

1. **Первый этап — замена desktop-представления на Unity при сохранении Java-сервера.** Не переносить одновременно сетевой сервер, телефоны и проверку ответов.
2. **Цель комнаты — 2–8 телефонных игроков, хост отдельно.** Сохранить текущее ограничение Impostor 3–4. Расширение его до 8 — отдельное изменение правил после проверки паритета.
3. **Unity 6.6 / 6000.6.x + URP.** Exact patch, пакеты и платформы фиксируются перед первым Unity-коммитом. На момент анализа проверена официальная страница `6000.6.5f1`; это не заявление, что этот patch самый новый или уже установлен.
4. **Данные и правила отделены от визуального слоя.** Unity не генерирует правильный ответ, не начисляет очки и не определяет победителя по локальной анимации.
5. **Протокол v1 сохраняется.** Перед реализацией зафиксировать реальные JSON-примеры и их последовательности в контрактных тестах. Протокол не содержит готовой универсальной event-sourcing системы.
6. **Java и Unity развиваются в разных каталогах.** Будущий `unity/FinalAnswer/` создаётся позже. Перенос `core/`, `server/` и Gradle под `legacy/` сейчас не выполняется: он ломает относительные пути и усложняет эталонные сборки.
7. **Результаты:** существующие очки/исходы находятся в памяти сервера; долговременная история матчей — новая, явно отдельная подсистема, а не уже существующая БД.

## 4. Что упрощено сейчас

Из корня перемещены **43 публичных оригинала**: GLB в `source_assets/last_command/models/`, аудио в `source_assets/audio/{last_command,impostor,shotgun}/`. Ещё один приватный образец голоса перемещён локально в закрытую правилами Git папку `tools/host-tts/reference/supplied/`. Имена и байты сохранены, дубликаты рабочих ресурсов не удалены.

Офлайн-импортёры `prepare_last_command.py`, `prepare_last_command_computer.py` и `optimize_last_command.py` используют каталог `_sources.source_path`; partitioner принимает явный временный источник для Blender-конвейера. Это организация инструментов, а не изменение Java/JS-геймплея. Рабочие файлы `assets/`, Java/Gradle, HTML/CSS/JS/TS сохранены побайтно. Старые относительные Java fallback-пути к корню не являются основным загрузчиком и не используются при наличии сохранённых рабочих ресурсов.

Реестр: [unity-preparation-moves.json](../assets/unity-preparation-moves.json). Каталог: [source_assets/catalog.json](../../source_assets/catalog.json). Резервные ветка/теги не изменены. Проверка `check_java_backup.py` предназначена для точного backup checkout; на ветке с последующей организацией файлов её отличие путей ожидаемо.

## 5. Последовательность реализации и критерии допуска

| Этап | Работа следующего этапа | Измеримый критерий завершения |
|---|---|---|
| 0. Инвентаризация — текущий | Карта кода, ассетов, протокола и ограничений, безопасная организация | Protected-файлы совпадают по SHA-256; исходные медиа по реестру; документация связана |
| 1. Контрактный стенд | Сохранить sanitized JSON-трассы Java host/phone: create/join/auth/start/action/verdict/reconnect/end | Две, четыре и восемь телефонных сессий; при дубликатах/устаревшем taskId нет лишнего прогресса |
| 2. Unity foundation | Создать проект, pin patch/packages, Bootstrap, модули, Rooms/Transport/UI; отдельная тестовая сцена подключения | Unity создаёт комнату через неизменённый Java API, старые телефоны подключаются, lifecycle корректно закрывается |
| 3. Last Command: визуальный импорт | Проверить glTFast на реальных GLB, координаты/материалы/пивоты; собрать prefab без изменения правил | Сравнимые ракурсы/состояния с Java/Three.js; дверца закрывает записку; независимое движение деталей |
| 4. Last Command: интерактивный срез | Один настоящий поток number task и один mechanical task; отправка действий и authoritative verdict | Локальный ввод мгновенный, ответы/победа только серверные; reconnect не повторяет аудио/ввод |
| 5. Last Command: полный паритет | Все 30 активных семейств + отложенный RECALL, звук/голос/тайминг/полный lifecycle | Матрица [THE_LAST_COMMAND_PLAN](THE_LAST_COMMAND_PLAN.md), гонка до 20, 2–8 телефонов |
| 6. Оболочка и остальные игры | Лобби/вступление/викторина → Cursed Boxes → Impostor с текущим составом | Настоящие серверные переходы между модулями; скрытые сведения не утекли на телефоны |
| 7. Релиз и результаты | Windows/macOS сборки, Java sidecar/JRE либо внешний сервер; локальная история подтверждённых исходов | Clean install на машине без установленной Java при bundled JRE; smoke LAN и HTTPS; повторная загрузка сцены без утечек |
| 8. Необязательный C# backend | Отдельный ADR, портирование правил по одной игре под теми же контрактами | Паритет Java↔C#; только один backend авторитетен для конкретной комнаты |

Не обещать сроки без этапов 1–3: риск определяется импортом реальной геометрии, совместимостью transport в standalone/IL2CPP и поведением старых телефонов, а не количеством Java-классов.

## 6. Проверки и риски

Результаты текущего этапа:

- 1092 защищённых файлов Java/Gradle/resources/browser sources совпали по SHA-256 до и после организации; Java gameplay-код не изменён.
- 43 перемещённых публичных файла совпали по SHA-256; весь source catalogue из 104 записей проверен.
- `python3 tools/checks/check_project_layout.py` — PASS: чистый корень, catalogue/source resolver, Python syntax и локальные ссылки.
- `python3 tools/checks/check_last_command_audio_assets.py` — PASS: 24 оригинала, 26 SFX и 4 host template references.
- Отдельный временный GLB-fixture: старый partitioner и оба новых пути (catalogue/explicit temporary source) дали побайтно одинаковый выход. Тяжёлые Blender/glTFpack конвейеры целиком не перезапускались, рабочие модели не перегенерировались.
- `./gradlew :core:check :server:test :shared:check :lwjgl3:compileJava :inspector:compileJava --offline` — exit 0; серверные XML-результаты: 217 tests, 0 failures/errors.
- `npm --prefix web3d run build` — exit 0.
- Java backup branch/tags сохранили прежние SHA. Никаких commits/push текущей архитектурной работы автоматически не выполнялось.

Это не Unity-сборка: Unity-проект ещё не создавался, совместимость импортёра и C# transport в Unity player пока не проверена.

Будущие обязательные проверки: EditMode для DTO/reducer/проекции/дедупликации; PlayMode для захвата указателя, отмены/выхода, окклюзии люка и RT; интеграция с реальным Java-сервером и Playwright-контроллерами; профилирование standalone на фиксированном железе. Цель представления — стабильный кадр 16,7 мс на согласованной машине; это бюджет, не измеренный результат переноса.

Основные риски: разные системы координат; материалы CRT/металла не переносятся из GLSL автоматически; отсутствие готовых skeletal/animation clips у машины; server-ready барьеры; независимые терминалы вместо глобальных рычагов; двойной звук от local + echo; скрытые данные ролей; смена backend до паритета; требования будущей долговременной истории.

## 7. Источники и связанные решения

Факты: [FinalAnswerGame](../../core/src/main/java/com/erni/finalanswer/FinalAnswerGame.java), [RoomService](../../server/src/main/java/com/finalanswer/server/rooms/RoomService.java), [GameSession](../../server/src/main/java/com/finalanswer/server/game/GameSession.java), [CursedBoxesSession](../../server/src/main/java/com/finalanswer/server/game/CursedBoxesSession.java), [ImpostorSession](../../server/src/main/java/com/finalanswer/server/game/ImpostorSession.java), [CommandRace](../../server/src/main/java/com/finalanswer/server/rooms/CommandRace.java), [GameMode](../../core/src/main/java/com/erni/finalanswer/rooms/GameMode.java), [settings.gradle](../../settings.gradle).

Проектные решения: [UNITY_ARCHITECTURE](UNITY_ARCHITECTURE.md), [NETWORK_ARCHITECTURE](NETWORK_ARCHITECTURE.md), [ASSET_MIGRATION](ASSET_MIGRATION.md), [THE_LAST_COMMAND_PLAN](THE_LAST_COMMAND_PLAN.md).

Официальные источники Unity, проверенные 31.10.2026: [Unity 6.6 Manual](https://docs.unity.com/en-us/engine/6000.6/manual), [release notes 6000.6.5f1](https://unity.com/releases/editor/whats-new/6000.6.5f1). Выбор URP и порядка переноса — архитектурное решение этого плана, а не утверждение документации Unity о данном проекте.
