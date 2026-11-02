# THE LAST COMMAND — первый Unity-модуль

Статус: технический план, игровые механики Unity не реализованы. Фактические источники — `CommandRace`, `LastCommandSession`, Java `lastcommand/*`, `web/command-touch.js` и `web3d/src/games/last-command/*`. Общие решения: [Unity](UNITY_ARCHITECTURE.md), [сеть](NETWORK_ARCHITECTURE.md), [ассеты](ASSET_MIGRATION.md).

## 1. Границы паритета

Переносится мрачная механическая машина с существующими корпусом, независимыми деталями, CRT, светом, скрытым люком и интерактивными панелями. Новые правила, физическая симуляция вместо кинематики, другие контроллеры телефонов и новый генератор не входят в первый перенос.

Различать три существующих пути:

1. **Основной expanded race:** `LastCommandSession → CommandRace`; персональные задания/механизмы каждого actor, scores, первый достигший 20 правильных ответов становится winner. Именно это основной критерий полноценного Unity-паритета.
2. **Classic campaign:** отдельный `LastCommandGame`, более узкий набор задач, другая модель общего panel snapshot/прогресса. Сохранить совместимость DTO/отдельный diagnostic route; не переносить его правила поверх expanded.
3. **Development rounds:** `LastCommandTestRound`: `mechanisms`, `memory`, `inspection`, собственный timeout и лимит ошибок. Preview семейства `PREVIEW_TASK` разрешён только development. Не включать dev APIs в production UI.

Нумерация «тип 12» или «задача 27» не контракт: использовать `taskType`/semantic IDs. Одна машина Unity не становится глобальным общим состоянием всех независимых терминалов. Хост сейчас имеет собственный actor, но не занимает телефонное место; spectator view чужого задания без расширения API отсутствует.

## 2. Активные семейства по реальному FAMILIES

30 семейств выбираются из категорий; `RECALL` добавляется условно при возврате сохранённой памяти. Таблица описывает текущий смысл, не придумывает новые варианты. Конкретный `touchscreen.kind`/параметры определяет серверная задача: UI нельзя жёстко выбирать только по русскому названию.

| Категория | `taskType` | Что Unity должна отображать/передавать |
|---|---|---|
| LOGIC | MATH | Арифметическое выражение, signed numeric input, отдельное подтверждение |
| LOGIC | NUMBER_SEQUENCE | Числовой ряд и правило, numeric input |
| LOGIC | COMPARISON | Выбор выражения по условию сравнения |
| LOGIC | FORBIDDEN | Цветные кнопки, запрещённый цвет; выбор по условию |
| LOGIC | ODD_SYMBOL | Выбор отличающегося знака |
| LOGIC | DECIPHER | Mapping символ→число, выражение с `+ − × ÷`/скобками; numeric result |
| LOGIC | POSITION | Позиции в сетке и пространственное правило |
| MECHANICAL | BUTTON | Нужная маленькая цветная кнопка |
| MECHANICAL | CIRCUIT | Поворот 3×3 контактов, public board, подтверждение цепи |
| MECHANICAL | LEVER_SEQUENCE | Свободная установка рычага/регулятора; проверка финальной конфигурации красной кнопкой |
| MECHANICAL | PRESSURE | Прибор/целевой диапазон, вращение в обе стороны, инерция показания на сервере |
| MECHANICAL | RADIO | Частота/качество сигнала, шаговый регулятор и подтверждение |
| MECHANICAL | FAULTY_GAUGE | Показания приборов и выбор неисправного по правилу |
| MECHANICAL | LEVER | Трёхпозиционный рычаг и подтверждение |
| MECHANICAL | ADJUSTER | Нужный угол регулятора и подтверждение |
| MECHANICAL | HATCH | Найти/открыть люк, прочесть записку, ввести код, подтвердить |
| MECHANICAL | COLOR | Выбрать цвет линзы и подтвердить |
| MECHANICAL | ENTER_CODE | Четыре механические цифры, red confirm |
| MECHANICAL | ANIMAL | Выбрать животное на панели и подтвердить |
| MECHANICAL | SYMBOL | Выбрать знак на панели и подтвердить |
| MEMORY | REVERSE | Запомнить последовательность и воспроизвести наоборот |
| MEMORY | SHUTDOWN | Запомнить механическую последовательность; не путать task с финальной shutdown-анимацией |
| MEMORY | NUMBER_MEMORY | Сохранить сгенерированный тип памяти; позже сервер создаёт RECALL |
| MEMORY | ANIMAL_MEMORY | Запоминание животных/пар, последующий выбор по сценарию |
| MEMORY | LIGHT_MEMORY | Световые сигналы, обычный или обратный порядок по серверному условию |
| MEMORY | FIND_CHANGE | Показ исходного экрана, промежуточная фаза и изменённый экран, выбор изменения |
| REACTION | TIMING | Движущийся указатель/сектор и момент подтверждения |
| REACTION | SILENCE | Дождаться разрешённого момента; не мешать случайными звуками |
| REACTION | FALSE_COMMAND | Противоречивые экранная и голосовая команды; явное правило доверия |
| REACTION | DELAYED_EXECUTION | Подтверждение в существующем отложенном временном окне |
| Условная память | RECALL | Вспомнить ранее сохранённый NUMBER_MEMORY; тип ввода зависит от памяти |

Существующий код содержит, но **не включает в пул FAMILIES**: `CONDITIONAL`, `STROOP`, `BROKEN_SWITCH`, `FUSE`, `SYMBOL_MEMORY`, `BALANCE`. «Уравновесить» не возвращать при переносе. Это не шесть новых режимов для Unity backlog.

Генерация остаётся серверной: weights LOGIC 20 / MECHANICAL 50 / MEMORY 20 / REACTION 10, difficulty 1–3 (default 2), recent history, weighted mechanical families, анти-повторы и отложенная память. После неправильного ответа score не растёт и обычно снова предлагается то же семейство; специальные правила памяти остаются в Java. Дефолтный seed недостаточен для воспроизведения всех задач: присутствуют actor identity, serial и секретный generationSalt. Не генерировать ответы локально «из того же seed».

## 3. Будущая композиция машины

```text
LastCommandScene
  LastCommandModule                 # lifecycle + context; не rules engine
  MachineRoot                       # общий pose, не подвижный корпус
    Body                            # computer.glb, статическая геометрия
    MainButtonMount
      Base                          # hole_final.glb
      CapPivot / CapMesh            # button.glb, локальный ход
    SmallButtons / Button[1..4]
    AdjusterMount / AdjusterPivot
    LightModule / Lens
    LeverBase / LeverPivot / Handle
    CodePanel / DigitSelectors
    AnimalPanel / SymbolPanel
    HatchMount                        # server placementId
      Frame / DoorPivot / Door
      NoteSurface                     # отдельное содержимое, окклюзия дверью
    Terminal                          # CRT surface + RT + UI presenter
  CameraRig / OrbitPivot / Camera
  Environment / ReflectionProbe / Lighting
  AudioScope
```

Это схема prefabs, не новый каталог созданных заглушек. Будущие роли:

- `LastCommandModule`: подписка на room snapshots, enter/exit, clock и scope; направляет данные в presentation.
- `MachinePresenter`: применяет подтверждённую pose/locks/visibility, requiredMechanisms и local anticipation.
- `MechanismBinding`: typed ID, pivot/rest pose, pick/collider, travel/angles, transition duration. Binding data — из имеющихся конфигов.
- `InteractionRouter`: один владелец pointer gesture; механическая деталь, UI или камера. Input никогда не вызывает validator.
- `TerminalPresenter`: стратегия по `touchscreen.kind` (number, choice, circuit, sequence, pressure/radio, reaction и т. п.), не switch из новых копий правил ответов.
- `PendingInputProjection`: presentation-only numeric/rotary intent, correlation ACK и cancellation.
- `AudioEventRouter`: state transitions/animation markers → semantic cue; не сеть аудио-RPC.

Конкретные типы и публичный API уточнить при foundation; не вводить reflection framework/универсальные анимируемые property bags до первого рабочего среза.

## 4. Механизмы, пивоты, взаимодействия

| ID | Конфигурация и поведение |
|---|---|
| BIG_BUTTON | Cap движется по локальной pressAxis из assembly, корпус/base неподвижны. Текущий базовый press/release 0,10/0,15 с; config stroke важнее магического Unity offset. Кнопка всегда видима, при ненужности только disabled |
| SMALL_BUTTON_1..4 | Независимый ход, удержание и отпускание; memory mapping: красный, зелёный, синий, жёлтый |
| ADJUSTER | Четыре положения 0/45/90/135°, циклический STEP. Левая половина уменьшает, правая увеличивает. Угол прямо на регуляторе; лишняя подпись угла в условии нерелевантных задач не возвращается |
| LEVER_MODULE | UP/MIDDLE/DOWN; позиция не равна результату задания сама по себе |
| LIGHT_MODULE | Линза/эмиссия, состояние и cue синхронизированы. Цикл ручного переключения OFF→RED→GREEN→YELLOW→BLUE отличается от порядка memory-note индексов — mapping задаётся явно |
| CODE_PANEL | Четыре цифры, STEP `index:+1/-1`, modulo 10; render code и numeric keyboard — разные виды ввода |
| ANIMAL_PANEL / SYMBOL_PANEL | Существующие значения/карточки, локальное выделение и подтверждение по task |
| HIDDEN_HATCH | Отдельная дверь/шарнир/содержимое; placementId back/right определяется сервером, не случайным Unity Update |
| TOUCH_PANEL | Виртуальный протокольный ID terminal actions. Не пытаться найти одноимённый mesh во всех GLB |

Shared transforms/pivots не менять при focus camera. При калибровке сохранять authored child transform и root scale. В исходных GLB нет анимаций, поэтому короткая кинематика реализуется целевыми позами с time-based interpolation; без зависимого от FPS накопления угла.

Gesture rules: pointerdown создаёт anticipation и захват; принятая action отправляется существующей семантикой клика/удержания; drag/orbit не превращается в PRESS. Нажатие numeric key — на pointerdown, отпускание не повторяет KEY. Потеря focus, pointer cancel, modal, смена task/module — отпустить/отменить и снять callbacks. Hover не меняет состояние. Обязательна проверка body occlusion и заблокированных деталей.

## 5. Люк и закрытая записка

`HATCH` в текущем генераторе выбирает back/right в начале; следующие HATCH-задачи того же игрока чередуют эти места. Внутри одной задачи, включая SYNC и open/close, mount стабилен. Не генерировать произвольную точку на каждом открытии и не переносить люк через соседнюю панель.

Сервер выдаёт `hint` только при разрешённом открытом hatch в соответствующей задаче. Presenter дополнительно показывает NoteSurface лишь при открытом состоянии и достижении ≥80% угла открытия, как `HiddenHatch.noteVisible`. При закрытии скрывает note немедленно, даже если текст ещё в texture/cache; закрытая дверь блокирует rendering/picking кода. При смене taskId сбрасывает старые hint/RT contents. То же правило для чёрной заготовки записки: скрытая поверхность целиком, не только белый текст.

`door_open` запускается при начале реального открытия, `metal_DOOR_CLOSE` — когда дверь фактически закрылась. Прерывание close повторным open отменяет ожидающий close cue; простой snapshot target=CLOSED не доказывает завершение анимации.

## 6. Состояния, задачи и тайминги

Внешняя room phase может оставаться LOBBY, пока существует вложенный lastCommand. Выбор модуля — по наличию `lastCommand` и его session identity, не только по верхнему Protocol.Phase. Вложенный `testRound` используется и основной игрой — название не означает, что payload всегда dev test.

Комбинация `status READY/PLAYING/WON`, `waitingForTerminals`, `awaitingReady`, `paused`, `readyAt`, `nextAt`, `revealUntil`, `requiredMechanisms` определяет доступность. Presentation states Unity (`Loading`, `Waiting`, `ShowingTask`, `Interacting`, `Feedback`, `Terminal`) производны от этих полей, не новые серверные фазы.

- Основная гонка требует CLIENT_READY и server barrier. Начальная готовность задачи около `now + 220 ms`, feedback до следующей задачи — `nextAt = now + 700 ms` в текущем коде; не зашивать эти числа вместо полученных timestamps.
- Механические/числовые проверки идут через action/CONFIRM. Для `LEVER_SEQUENCE` сколько угодно двигать детали до большой кнопки: промежуточные движения не дают ошибку/победу. SHUTDOWN — другой memory task, его последовательность не упрощается тем же правилом.
- В circuit поворот меняет public board. Unity может подсвечивать достижимый путь от питания к выходу, но это presentation; `CIRCUIT_COMPLETE/FAILED` и score приходят после проверки CONFIRM. Незавершённая цепь до submit не electrical failure.
- Memory показ/ввод управляется serverTime/revealUntil/signals; не проигрывать заново предыдущие notes после устаревшего STATE или reconnect. Существующий шаг световых сигналов 850 мс сохраняется как presentation timing; в кадре сверять целевой индекс, не откладывать его цепочкой coroutine WaitForSeconds.
- Reaction/silence/delayed проверяются сервером с его ограниченной RTT-компенсацией; `Time.timeScale`, плавность камеры и длина звука не продлевают окно ответа.
- Numeric prediction не меняет authoritative input/score. Pending edits ограничены 64; signed input — до девяти символов по нынешним правилам. Hardware digits/numpad/minus/Backspace/Enter и touch дают один intent на accepted press.

## 7. Противоречивые команды

`FALSE_COMMAND` содержит `trustHint`, `displayColor`, `spokenColor` и spoken text. Сервер генерирует противоречивую пару, выбирает доверенный источник и сохраняет истинный ответ скрытым. Unity показывает текущую карточку правила и два источника команды, а ведущий произносит **spokenColor**, даже если это неверный отвлекающий совет.

Переиспользовать `PRESS_RED/GREEN/BLUE/YELLOW` из `assets/audio/host/ru/manifest.json`: «Нажми красную/зелёную/синюю/жёлтую». Та же готовая запись/voiceId, никакого отдельного TTS. Ключ один раз на session+attempt+task; начать после готовности интерфейса и readyAt. Pause/смена задачи отменяют pending voice. Не отождествлять сыгранную фразу с правильным ответом и не говорить случайный цвет из нового RNG.

## 8. Событийная аудиокарта

Все имена — существующие оригиналы; рабочий путь/параметры берутся из runtime manifest. Cue не равен месту его загрузки. Реальные source/priority/throttle сохраняются, Unity audio backend другой.

| Cue | Файл | Триггер представления/авторитетности |
|---|---|---|
| BUTTON_PRESS | button_pressed.wav | Принятое локальное механическое нажатие большой кнопки; подавление echo |
| SMALL_BUTTON_CLICK | small_button_click.wav | Маленькая кнопка/цифровая клавиша, один accepted press |
| LEVER_MOVE | lever.wav | Начало значимого перемещения рычага |
| ROTARY_STEP | adjuster.wav | Значимый шаг регулятора/цифрового селектора, manifest throttle |
| HATCH_OPEN | door_open.wav | Начало реального открытия |
| HATCH_CLOSE | metal_DOOR_CLOSE.wav | Marker достигнутого закрытого положения |
| METAL_CREAK | second_metal_cracking.wav | Существующие стресс-переходы, low priority; запрет protected tasks |
| METAL_CRACK | metal_cracking.wav | Существующее усиление стресса, редко; не каждый input |
| ANSWER_CORRECT | Success2.wav | Новый подтверждённый правильный ответ; не submit |
| ANSWER_WRONG | wrong_answer.wav | Новый подтверждённый неправильный ответ, кроме специального symbol verdict |
| VICTORY | success.mp3 | Подтверждённая победа/20 у соответствующего терминала, один раз; не обычный успех |
| CIRCUIT_ROTATE | wires1.wav | Значимый поворот контакта, без replay на каждом кадре |
| CIRCUIT_FAILED | failed.circuit.wav | Серверный отрицательный circuit verdict после submit |
| CIRCUIT_COMPLETE | electrical_circuit_done.wav | Подтверждённое завершение/активация circuit один раз |
| MEMORY_NOTE_RED/GREEN/BLUE/YELLOW | memory_note_red/green/blue/yellow.wav | Соответствующая вспышка, общий clock/DSP scheduling, без наложения нот |
| MACHINE_SHUTDOWN | machine_shutdown .wav | Существующий финальный expanded shutdown-переход; не смена сцены |
| CONFIRM | confirm_button.wav | Валидная активация CONFIRM, отдельно от correct/wrong |
| SYMBOL_CLICK | symbol_clicked.wav | Принятое нажатие интерактивного символа |
| SYMBOL_WRONG | wrong_symbol_chosen.wav | Сервер подтвердил ошибку именно symbol task |
| SYMBOL_APPEAR | symbol_appear.wav | Символ действительно появился в нужной фазе |
| SCREEN_TRANSITION | transition_screen.wav | Реальная смена task face, включая after-phase FIND_CHANGE |
| QUESTION_TYPING / ALT | question_typing.wav / questiontyping2.wav | Сохранить для sound bench; автоматической Last Command typewriter-анимации сейчас нет |

`success.wav` и исходный `1 to 4 sound(appearing sequence).wav` сохраняются как оригиналы, не подменяют актуальные cues. Четыре notes — согласованные pitch-варианты исходного импульса.

Последний правильный ответ не должен одновременно запускать обычный success и victory. Сохранить существующий финальный порядок: авторитетное завершение → shutdown/визуальный переход → отложенный victory (в нынешнем router не раньше `finishedAt + 700 ms`). Общий WON snapshot содержит winner: нельзя объявлять выигравшими все терминалы с локальным score <20. Изменение этого финального режиссёрского порядка — отдельно от паритета.

Приоритеты: victory/вердикт/shutdown выше circuit/notes/кнопок, окружение ниже. Стартовый bounded voice pool соответствует нынешнему scope из восьми источников; не восемь новых AudioSources на каждый mesh. Critical feedback не вытесняется декоративным скрипом. Protected tasks: memory category и silence/reaction/false-command/timing задачи по существующему router; никаких случайных тресков, мешающих команде/сигналу.

## 9. Этапы реализации и приёмка

1. **Контракты:** DTO snapshots для expanded/classic/dev, JSON action corpus, identity/revision/ACK fixtures. Без сцены и без второго validator.
2. **3D-паритет:** body/base/cap → lever/adjuster/light/code → hatch → animal/symbol panels. Проверки каждой оси и collision/occlusion; сравнение с Java/Three.js.
3. **Один настоящий срез:** number task + mechanical confirm на реальном сервере; immediate input projection, authoritative outcome, старый телефон. Никакой mock-победы ради демонстрации.
4. **Панели:** choice/number → circuit → приборы → memory → reaction. Ввод и visual strategy общие, rules остаются на сервере.
5. **Аудио/голос/камера:** bank preload, markers, dedup, protected modes, orbit/focus с ручной отменой; camera smoothing по времени, без сети Transform sync.
6. **Полная матрица:** все 30 семейств + RECALL, отключённые семейства не появляются; гонка до 20 с 2/4/8 телефонами.
7. **Упаковка:** clean install Unity player + Java sidecar/external server, LAN URL, reconnect, полное освобождение scene/audio/RT.

Обязательные regression cases:

- 100 свободных изменений LEVER_SEQUENCE до подтверждения не меняют mistakes/score; неверный confirm даёт один wrong, верный — один success.
- Rapid numeric burst, ACK вне visual repaint, equal revision, stale taskId/session, release не повторяет digit; input projection не изменяет server input.
- Pressure: обе стороны управления и подсказка направления; инерция не зависит от Unity FPS.
- Hatch: нет чёрной записки при закрытии/начале загрузки; после open→close код не просвечивает; новый HATCH меняет mount, SYNC не меняет.
- Central button остаётся на машине при смене задания; невидимый/disabled control не пропускает input сквозь корпус.
- Circuit incomplete не издаёт failure; connected path может светиться до confirm, score остаётся прежним.
- Все четыре голоса соответствуют spokenColor; hint объясняет, кому верить, а не раскрывает независимый новый answer.
- Light colors/notes имеют стабильное соответствие; память не получает лишнюю ноту на reconnect/frame; silence не получает random stress audio.
- Восьмой игрок и host не смешивают персональные task/mechanism state; global winner не повторяется от дубликатов сообщений.
- Unload/reload/cancel async/pointer loss: нет висящих loops, listeners, временных materials/RenderTextures и late callbacks старой сцены.

Измерять end-to-end pointer→presented frame, server round trip, p95 frame, allocations и peak memory в standalone. Ранее измеренный локальный браузерный отклик не переносится автоматически на Unity и не является обещанием нового FPS.

Источники: [CommandRace](../../server/src/main/java/com/finalanswer/server/rooms/CommandRace.java), [LastCommandSession](../../server/src/main/java/com/finalanswer/server/rooms/LastCommandSession.java), [LastCommandGame](../../server/src/main/java/com/finalanswer/server/rooms/LastCommandGame.java), [LastCommandTestRound](../../server/src/main/java/com/finalanswer/server/rooms/LastCommandTestRound.java), [HiddenHatch](../../core/src/main/java/com/erni/finalanswer/lastcommand/HiddenHatch.java), [MechanicalButton](../../core/src/main/java/com/erni/finalanswer/lastcommand/MechanicalButton.java), [LastCommandAudioEvents](../../core/src/main/java/com/erni/finalanswer/lastcommand/LastCommandAudioEvents.java), [NumberInputPreview](../../core/src/main/java/com/erni/finalanswer/lastcommand/NumberInputPreview.java), [browser scene module](../../web3d/src/runtime/module.ts), [browser machine](../../web3d/src/games/last-command/machine.ts), [phone panels](../../web/command-touch.js).
