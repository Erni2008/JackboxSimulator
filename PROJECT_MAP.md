# Где что находится в Final Answer

Начинай здесь, если не знаешь, какой файл открыть.
Пути ниже указаны относительно корня проекта.

## Основные папки

```text
FinalAnswer/
├── core/src/main/java/com/erni/finalanswer/  ← код игры
├── assets/                                 ← ресурсы, которые загружает игра
├── source_assets/                          ← исходные картинки и старые копии
├── lwjgl3/                                 ← запуск игры на компьютере
├── server/                                 ← заготовка отдельного Java-сервера
├── inspector/                              ← инструмент для изучения Java-кода
├── scripts/                                ← вспомогательные скрипты
├── generated/                              ← сохранённые превью
├── examples/                               ← учебные заготовки вне сборки
└── PROJECT_MAP.md                          ← эта карта
```

## Код игры

Открой `core/src/main/java/com/erni/finalanswer/`:

```text
finalanswer/
├── FinalAnswerGame.java                 ← запускает игру и первый экран
├── screens/                            ← целые экраны
│   ├── MainMenu.java                   ← главное меню, фон, расположение кнопок
│   ├── RoomSettingsScreen.java         ← экран создания комнаты
│   ├── GenerationCodeScreen.java       ← GENERATE, код и OK
│   ├── SettingsScreen.java             ← настройки, языки и подтверждение видеорежима
│   └── PlayScreen.java                 ← первый экран игры
├── ui/                                 ← элементы внутри экранов
│   ├── windows/
│   │   ├── OptionsMainWindow.java      ← окно CREATE ROOM: поля и настройки
│   │   └── ModeInfoDialog.java         ← описание выбранного режима
│   ├── buttons/
│   │   ├── menu/                      ← только главное меню
│   │   │   ├── AnimatedImageButton.java ← общая анимация кнопок меню
│   │   │   ├── PlayButton.java
│   │   │   ├── CreateRoomButton.java   ← переход к настройкам комнаты
│   │   │   ├── GenerationCodeButton.java
│   │   │   ├── SettingsButton.java
│   │   │   └── ExitButton.java
│   │   ├── room/                      ← только форма CREATE ROOM
│   │   │   ├── ConfirmCreateButton.java ← подтверждение CREATE
│   │   │   ├── CancelRoomButton.java   ← отмена CANCEL
│   │   │   ├── PlayerCountSelector.java ← выбор 2–8 игроков
│   │   │   └── GameModeSelector.java   ← стрелки, INFO, название режима
│   │   ├── generation/
│   │   │   └── RerollButton.java       ← три состояния REROLL и будущий обработчик
│   │   └── SubtleStateDrawable.java    ← сохранённый вспомогательный drawable
│   ├── effects/
│   │   ├── CyclingRoomBackground.java  ← смена трёх фонов и скорость переходов
│   │   ├── GenerationCodeBackground.java ← плавный цикл stage1–stage4
│   │   └── TableCandle.java            ← три свечи, 96 кадров, свет и тени
│   ├── RuntimeTextures.java            ← рабочие текстуры и пересчёт вырезок
│   ├── GameFonts.java                  ← сохранённая утилита; меню больше не создаёт эти шрифты
│   └── MenuButton.java                 ← старый вариант кнопки; меню его не использует
├── rooms/                              ← данные и логика игровых режимов
│   ├── GameMode.java                   ← идентификаторы режимов и переключение по кругу
│   ├── RoomConfiguration.java          ← снимок настроек комнаты для будущей сессии
│   └── modes/
│       └── StandardMode.java           ← стандартный режим; остальные добавим позже
├── localization/
│   └── Localization.java              ← загрузка переводов по ключам
└── utils/
    └── DisplayManager.java            ← переключение полноэкранного режима
```

## Что хочешь изменить → какой файл открыть

| Задача | Файл относительно `core/src/main/java/com/erni/finalanswer/` |
| --- | --- |
| Положение и размер кнопок главного меню | `screens/MainMenu.java` |
| Что происходит при CREATE ROOM | `ui/buttons/menu/CreateRoomButton.java` |
| Что отображается на экране создания комнаты | `screens/RoomSettingsScreen.java` |
| Название, пароль, шрифт ввода, анимация окна | `ui/windows/OptionsMainWindow.java` |
| Кнопки MAX PLAYERS, их размер, цвета и состояния | `ui/buttons/room/PlayerCountSelector.java` |
| Скорость смены фонов | `ui/effects/CyclingRoomBackground.java` |
| Свечи и их освещение | `ui/effects/TableCandle.java` |
| Список игровых режимов | `rooms/GameMode.java` |
| Стрелки, INFO и подпись GAME MODE | `ui/buttons/room/GameModeSelector.java` |
| Окно с описанием режима | `ui/windows/ModeInfoDialog.java` |
| Собранные настройки комнаты | `rooms/RoomConfiguration.java` |
| Правила стандартного режима | `rooms/modes/StandardMode.java` |
| Как загружаются переводы | `localization/Localization.java` |

Тексты переводов лежат отдельно: `assets/i18n/messages.properties` — английский,
`assets/i18n/messages_ru.properties` — русский. Названия и описания всех пяти режимов переведены. Переключатель по умолчанию
работает на английском; `OptionsMainWindow.setLanguage("ru")` переключает подписи
режимов на русский. Общий язык выбирается в SETTINGS → Interface language и сохраняется после Apply.

## Изображения и шрифты

Рабочие файлы, которые использует игра:

- `assets/backgrounds/main_screen_background.png` — фон главного меню.
- `assets/backgrounds/create_room/` — три варианта освещения экрана комнаты.
- `assets/ui/windows/create_room/options_main.png` — оформление окна CREATE ROOM.
- `assets/ui/buttons/` — отдельная папка для каждой кнопки, `player_count` — для MAX PLAYERS.
- `assets/ui/fonts/` — шрифты и их лицензии.
- `assets/ui/buttons/game_mode/previous/` и `next/` — три состояния твоих стрелок режимов.
- `assets/models/candle/frames/` — 96 кадров трёх свечей.

Чтобы заменить картинку в игре, меняй файл в `assets/` и перезапускай игру.
`source_assets/` хранит оригиналы; замена только там не меняет игровой ресурс.
`source_assets/buttons/java_copies/` — сохранённые копии, которые раньше лежали
рядом с Java-классами. Игра не загружает их оттуда.

В `assets/models/candle/` также сохранены `.blend` и старый рендер одной свечи.
Текущая анимация использует только папку `frames/`.

## Как связаны части

```text
Desktop launcher → FinalAnswerGame → screens/MainMenu
                                       ↓ нажатие CreateRoomButton
                                    screens/RoomSettingsScreen
                                       ├── CyclingRoomBackground
                                       └── OptionsMainWindow
                                           ├── поле названия
                                           ├── поле пароля
                                           ├── PlayerCountSelector
                                           └── GameModeSelector
```

`rooms/` отвечает за будущие правила игры, `ui/` — за отображение и ввод.
Настройки формы передаются на GENERATION CODE; GENERATE создаёт комнату на сервере.
После OK код и участники отображаются в главном меню.

## Команды

Запуск из корня проекта:

```bash
./gradlew :lwjgl3:run
```

Проверка сборки игры:

```bash
./gradlew :lwjgl3:classes
```

Открыть инспектор кода:

```bash
./gradlew :inspector:run
```

Новая папка для будущих классов режимов:

```bash
mkdir -p core/src/main/java/com/erni/finalanswer/rooms/modes
```

`build/`, `.gradle/` и файлы Gradle нужны для сборки. Игровую логику пиши в `core/`.
Пустой `examples/Main.java` — учебная заготовка, а не точка входа игры.

## GAME MODE: управление и данные

Кнопки `<` / `>` переключают режимы по кругу в порядке из `GameMode.java`.
Tab переводит фокус: название комнаты → режим → пароль → CREATE → CANCEL → название комнаты.
В переключателе работают ← / →; Shift+Tab идёт в обратную сторону.
Название центрируется и при необходимости уменьшается, не меняя размер окна.

`OptionsMainWindow.getRoomConfiguration()` возвращает текущие название, пароль,
число игроков и выбранный `GameMode`. Эти данные передаются на сервер при генерации кода; игровые механики режимов пока не реализованы.

Кнопка INFO находится под полем GAME MODE, немного правее его центра. Она открывает
`ModeInfoDialog` с локализованным описанием текущего режима. Закрытие — CLOSE,
Esc или Enter. Когда фокус на переключателе режимов, клавиша I или Enter также
открывает информацию. Пока окно открыто, клики по настройкам под ним блокируются.
Три состояния кнопки находятся в `assets/ui/buttons/game_mode/info/`.

## Подтверждение CREATE

- Изображения: `assets/ui/buttons/confirm_create_room/`.
- Класс: `ui/buttons/room/ConfirmCreateButton.java`.
- Размер и положение: `OptionsMainWindow.layoutIn()` (`createWidth`, нижний отступ `bottom`).
- Проверка названия и сбор настроек: `OptionsMainWindow.requestCreation()`.
- Обработчик: `RoomSettingsScreen`, подключается через `optionsWindow.setOnCreate(...)`.

CREATE доступна мышью и через Tab → Enter/Space. Пустое название не принимается.
После подтверждения `RoomSettingsScreen.getRequestedConfiguration()` возвращает
последний снимок настроек. Обработчик сохраняет настройки и открывает GENERATION CODE. GENERATE регистрирует
комнату на сервере, OK возвращает в главное меню с лобби.

## Отмена создания комнаты

`CancelRoomButton.java` находится в `ui/buttons/room/`, а её три PNG — в
`assets/ui/buttons/cancel_room/`. CREATE расположена слева, CANCEL — справа.
Размеры и положение обеих кнопок задаются в `OptionsMainWindow.layoutIn()`.

`RoomSettingsScreen(FinalAnswerGame game)` получает игру для переключения экранов.
`optionsWindow.setOnCancel(...)` вызывает `cancelCreation()`, которая возвращает
в уже загруженное `MainMenu` после завершения текущего события.
Работают мышь, Tab → Enter/Space и Esc. Если открыто описание режима, Esc сначала
закрывает только описание. Три экрана меню принадлежат `FinalAnswerGame` и переиспользуются. Ресурсы
освобождаются при закрытии приложения; форма сбрасывается перед новым созданием комнаты.

## Сервер и лобби

Сервер подключён как модуль `server`; запуск — `./gradlew :server:run`.
Создание комнаты, уникальность кода, пароль, лимит игроков и heartbeat уже работают.
Инструкция и протокол — [server/README.md](server/README.md).

- `server/src/main/java/com/finalanswer/server/RoomServer.java` — HTTP-обработчики.
- `server/src/main/java/com/finalanswer/server/rooms/RoomService.java` — комнаты и участники.
- `core/.../network/RoomApiClient.java` — асинхронные запросы и возврат на UI-поток.
- `core/.../rooms/RoomSession.java` — подтверждённый сервером снимок лобби.
- `core/.../ui/lobby/LobbyPanel.java` — код и игроки в главном меню, вход через PLAY.
- `core/.../ui/buttons/generation/ConfirmCodeButton.java` — OK после генерации.
- `FinalAnswerGame` сохраняет настройки между экранами, активную комнату и обновляет список.

CREATE ROOM → настройки → CREATE → GENERATE → OK → главное меню с лобби.
PLAY без активной комнаты предлагает создать комнату; JOIN ROOM открывает ввод кода, имени и пароля.
Комнаты пока хранятся в памяти; игровые раунды не добавлены.

## Как работать без десятков вкладок

В настройках проекта VS Code включён предварительный просмотр: один клик по файлу
открывает временную вкладку, следующий файл заменяет её. Двойной клик закрепляет
вкладку. Лимит — 8 вкладок; файлы с несохранёнными изменениями исключены из лимита.
Папки `build/`, `.gradle/` и `.idea/` скрыты в проводнике VS Code, но остаются на диске.

Чтобы закрыть уже открытые сохранённые вкладки, вызови палитру команд
(`Cmd+Shift+P` на macOS) и выбери **Close Saved Editors**.

Новый код размещай по назначению: экраны — `screens/`, кнопки главного меню —
`ui/buttons/menu/`, кнопки формы — `ui/buttons/room/`, окна — `ui/windows/`,
правила режимов — `rooms/modes/`. Новые оригиналы PNG складывай в `source_assets/`,
а используемые игрой изображения — в соответствующую папку `assets/`.

## GENERATION CODE

- Экран: `core/src/main/java/com/erni/finalanswer/screens/GenerationCodeScreen.java`.
- Два активных фона: `assets/backgrounds/generation_code/stage2.png` и `stage3.png`. `stage1.png` и старый `stage4.png` не используются.
- Скорость переходов: `ui/effects/GenerationCodeBackground.java`,
  `HOLD_SECONDS` (1.8 с) и `TRANSITION_SECONDS` (2.6 с). Полный цикл — 8.8 с.
- Экран использует `FitViewport(1672, 941)`: вся картинка и все ячейки видны,
  пропорции сохраняются. При другом соотношении сторон остаются чёрные поля.
- REROLL справа от ячеек, с состояниями up/hover/pressed; появляется после генерации.
  Пробный код меняется локально. Для созданной комнаты используется POST `/rooms/{code}/reroll`:
  сервер меняет код атомарно, сохраняет настройки и токен ведущего, старый код перестаёт работать.
  После подключения других игроков смена кода запрещена.
- Поле центрируется формулой `fieldX = (WIDTH - fieldWidth) / 2`; GENERATE выровнена по его центру.
- GENERATE предлагает код через `RoomCodeGenerator.generate()`, регистрирует комнату на сервере и отображает подтверждённый код.
- BACK слева сверху и Esc возвращают в меню. Экран переиспользуется; ресурсы освобождаются при закрытии приложения.
- Оригиналы лежат в `source_assets/backgrounds/generation_code/` и
  `source_assets/buttons/reroll/`. Исходное имя `reroll_hocer.png` сохранено;
  рабочая копия называется `reroll_hover.png`.

Поле кода — отдельный `Image` с именем `codeField`: `assets/ui/windows/generation_code/CodeField.png`.
Размер и положение задаются в конструкторе `GenerationCodeScreen`: `fieldWidth`, `fieldY`, `codeField.setBounds(...)`. Пропорции оригинала сохраняются. Символы подтверждённого сервером кода отображаются отдельными Label.

### Кнопка GENERATE

`ui/buttons/generation/GenerateCodeButton.java` — три состояния новой кнопки под
полем кода. Ресурсы: `assets/ui/buttons/generate_code/generate_{up,hover,pressed}.png`.
Размер и положение — `generateWidth`, `generateHeight` и `generateButton.setBounds(...)`
в `GenerationCodeScreen`. Движения и мерцания у кнопки нет; появление общее с экраном.
Генерация подключена через асинхронный `RoomApiClient.create()`. После успеха появляется OK.

BACK: `ui/buttons/generation/BackButton.java`, ресурсы `assets/ui/buttons/back/`. Размер и отступы задаются в `GenerationCodeScreen` (`backWidth`, отступ 32). Поле кода увеличено до 680 единиц с сохранением пропорций.

## Оптимизация интерфейса

- `FinalAnswerGame` создаёт и хранит экраны меню и настроек; PlayScreen создаётся при первом запуске. Переходы выполняются
  через `showMainMenu()`, `showRoomSettings()`, `showGenerationCode()`; новые экраны
  не нужно создавать в обработчиках кнопок. `dispose()` экранов вызывается владельцем
  при закрытии приложения. CREATE ROOM сбрасывает старые поля и настройки.
- `gradle/runtime-textures.gradle` добавляет `prepareRuntimeTextures`: Gradle заранее
  уменьшает изображения до рабочих размеров с bicubic-фильтрацией Java2D/ImageIO.
  Повторно задача выполняется при изменении исходников. Фоны остаются в исходном разрешении.
- Результаты находятся в игнорируемой Git папке `assets/runtime/`. Её можно восстановить:
  `./gradlew prepareRuntimeTextures`. Обычные сборка и запуск готовят её автоматически.
- Оригиналы в `assets/` и `source_assets/` не изменяются. Новые изображения заменяй в
  обычных папках `assets/`, затем запускай игру через Gradle. Не редактируй `assets/runtime/`.
- `RuntimeTextures` загружает подготовленные копии и пересчитывает исходные координаты
  `TextureRegion`, сохраняя положение рамок. При отсутствии манифеста используются оригиналы.
- Все 96 кадров свечей сохранены; рабочий размер 256×256, 24 FPS, 24 MiB текстур вместо 54 MiB.
- Кнопки главного меню используют один общий shader с подсчётом владельцев.
  Неиспользуемые шрифты меню больше не создаются. Нажатие меняет состояние без сглаживания;
  скорость hover и анимация MAX PLAYERS сохранены. При возврате в меню нет повторного появления.

Замеры оптимизации до добавления настроек: раньше создание меню при возврате занимало около 1109 мс,
GENERATION CODE — 331 мс, CREATE ROOM — 670 мс. После изменений прогрев всех трёх
экранов занял около 602 мс при запуске. 400 переключений не создали новых текстур;
сам код четырёх переключений подряд занял не более 0.112 мс в контрольном замере.
Это время переключения Java-объектов, не полная задержка от мыши до вывода кадра.
При лимите 60 FPS визуальный отклик зависит также от следующего кадра и VSync.

Три прогретых экрана занимают около 115.7 MiB пиксельных данных текстур, включая шрифты
(по размерам/форматам загруженных Texture). Для сравнения, только старое главное меню
требовало около 154.7 MiB без учёта его шрифтов — экономия примерно 25% даже при хранении трёх экранов. Это оценка хранения текстур,
не всего RAM процесса и не фактических накладных расходов GPU-драйвера.
Проверены BACK, CANCEL, сброс формы, изменение размера окна и освобождение
всех управляемых текстур после завершения приложения.

Шрифт четырёх символов кода: `assets/ui/fonts/RoadRage-Regular.ttf` (лицензия рядом: `RoadRage-OFL.txt`). Размер 112 и набор символов задаются в `GenerationCodeScreen.createCodeFont()`. Цвет — `F0E8DE`, без свечения и обводки. Шрифт создаётся один раз на экран.

## SETTINGS: настройки и языки

- `core/.../screens/SettingsScreen.java` — интерфейс, предварительный выбор языка,
  Apply/Back/Defaults, клавиатура и подтверждение видеорежима с откатом через 15 секунд.
- `core/.../settings/GameSettings.java` — проверенный неизменяемый набор параметров.
- `core/.../settings/SettingsStore.java` — сохранение в LibGDX Preferences `FinalAnswer.settings`.
- `core/.../utils/DisplayManager.java` — полноэкранный/оконный режим, разрешение, VSync и FPS.
  Смена видеорежима защищена от повторного вызова render при событиях GLFW.
- `core/.../localization/Localization.java` — кэш UTF-8 I18NBundle EN/RU, форматирование сообщений
  и перевод сообщений сервера. `FinalAnswerGame.previewLanguage()` обновляет уже созданные экраны.
- `assets/i18n/messages.properties` / `messages_ru.properties` — подписи, подсказки и сообщения.

Настройки: English/Русский; полный экран; разрешение окна 1280×720 / 1600×900 / 1920×1080;
VSync; лимит 30 / 60 / 120 / 144 / 240 FPS либо без ограничений; уменьшение движения.
Полный экран использует нативный режим монитора. F11 вне SETTINGS переключает полный экран
и сохраняет параметр. В SETTINGS изменения видеорежима применяются через Apply.
Язык можно предварительно посмотреть сразу, Back отменяет несохранённые изменения.
Уменьшение движения останавливает покачивание окон, смену освещения и анимацию свечей.

Текстовые элементы настроек, режимов, лобби, диалогов, поля ввода и сообщения поддерживают русский.
Надписи внутри исходных PNG (например SETTINGS/CREATE ROOM/GENERATE) остаются частью изображений.
Название комнаты, имена игроков, код и внутренние идентификаторы режимов не переводятся.

Графическая проверка с отдельными временными Preferences (открывает два тестовых окна по очереди):

```bash
./gradlew :lwjgl3:settingsCheck
```

Проверяются: вход через SETTINGS, предварительный русский язык, отмена, сохранение,
русские режимы и placeholder, возврат видеорежима по Esc и по таймеру,
восстановление языка и параметров в новом JVM-процессе. Код проверки:
`lwjgl3/src/test/java/com/erni/finalanswer/lwjgl3/SettingsCheck.java`.

## PLAY: первая локальная версия экрана ведущего

- `core/.../screens/PlayScreen.java` — Stage, адаптивный FitViewport 1600×900,
  вопрос, четыре текстовых варианта, клавиши SPACE/ESC, владение графическими ресурсами.
- `core/.../gameplay/questions/Question.java` — неизменяемая модель и проверка данных.
- `core/.../gameplay/questions/QuestionSource.java` — контракт источника контента.
- `core/.../gameplay/questions/DemoQuestionSource.java` — пять английских вопросов.
- `core/.../gameplay/round/RoundClock.java` — время без привязки к графике.
- `core/.../gameplay/round/RoundController.java` — последовательность вопросов,
  последовательность показа через QuestionPresentationController и сброс раунда. Не обращается к серверу.
- `core/.../ui/play/TypewriterText.java` — сохранённый простой текстовый помощник;
  текущий PLAY использует CinematicQuestion и QuestionPresentationController.
- `core/.../ui/play/AnswersPresentationActor.java` — диагональная композиция, общие шрифты и сброс вариантов.
- `core/.../ui/play/AnswerView.java` — только номер и текст в кешах глифов; единый масштаб,
  наклон, плавное появление и исчезновение. Рамок, заливок и фоновых панелей нет.
- `lwjgl3/.../PlayPreviewLauncher.java` — отдельный локальный запуск
  `./gradlew :lwjgl3:playPreview`; обычная кнопка PLAY сохраняет проверку комнаты.
- `core/src/test/.../RoundCheck.java` и `lwjgl3/src/test/.../PlayCheck.java` —
  детерминированные проверки времени, переходов и графического интерфейса.

Eerie отсутствует: вопрос использует Creepster, при нехватке символов — Noto Sans. Фон первых двух вопросов
находится в assets/backgrounds/play/questions_01_02/, часы используют PNG из assets/clock/. Вопросы пока EN; подписи управления локализованы EN/RU.
Голосование, очки, мини-игры и синхронизация раундов
не реализованы. Позже сервер сможет передавать вопросы через отдельный источник;
контроллер и часы отделены от их отображения.

### Цикл раунда и раскрытие ответа

`gameplay/round/RoundPhase.java`: INTRODUCTION → ANSWERING → REVEAL.
`RoundTiming.java` задаёт 20 с на ответ и 4 с показа результата; постановка текста
настраивается отдельно в QuestionPresentationController (шаг букв 35 мс).
Отсчёт начинается после появления всех карточек. Их появление начинается после
полного вопроса, окончания озвучки, паузы 2 секунды и подъёма текста.
По тайм-ауту правильный ответ выделяется в течение 0,5 с, остальные приглушаются.
Дальше PlayScreen запускает новый вопрос и сбрасывает отсчёт, выделение и статус.
R позволяет ведущему раскрыть ответ досрочно; SPACE сохраняет быстрый переход в тестах.
Отсчёт и раскрытие пока не используют сервер или ответы игроков.

## Готические часы PLAY

- `core/.../gameplay/clock/ClockTimeline.java` — WAITING / RUNNING / CLOSING / FALLING / FINISHED,
  независимая от графики временная модель; настраиваемая длительность, по умолчанию 20 с.
- `core/.../ui/clock/ClockTimerActor.java` — PNG-слои, pivot, нормализация кадров,
  программный сектор через один ShapeRenderer, плавное закрытие и падение с ускорением.
- `assets/clock/` — копии исходных clock1–clock6 и clock8–clock11 из корня.
  `README.md` описывает выбранные кадры и координаты привязки. clock7 отсутствует и не нужен.
- `gradle/runtime-textures.gradle` готовит уменьшенные RGBA-копии часов, сохраняя оригиналы.
- `PlayScreen` синхронизирует часы с RoundController, размещает их справа и освобождает ресурсы.
  P ставит на паузу весь локальный раунд; Screen.pause()/resume() также останавливают время.
- `core/src/test/.../ClockCheck.java` проверяет углы, сроки анимаций, паузу и синхронизацию.
  PlayCheck проверяет запуск, закрытие, исчезновение, сброс и освобождение Texture/Mesh.

Запуск: `./gradlew :lwjgl3:playPreview`. Проверки: `./gradlew :lwjgl3:playCheck -PplayCapture=true`.
JSON-наборы вопросов и экран окончания сессии не возвращены.

## Анимированный фон первых двух вопросов

- `assets/backgrounds/play/questions_01_02/01.1.png` — `01.4.png`: рабочие копии
  новых изображений из корня, без изменения оригиналов.
- `core/.../ui/play/QuizBackground.java`: стабильная сцена 01.1 и shader локального света,
  медленный зум/панорамирование и затемнение для читаемости.
- `PlayScreen` добавляет фон первым Actor, включает только на вопросах 1–2
  и освобождает текстуры вместе с экраном. Пауза работает через общий Stage.act(step).
- Между 1 и 2 фазу не сбрасываем; на 3-м вопросе фон плавно уходит в чёрный.
  Уменьшение движения отключает цикл и движение камеры.

## Кинематографическая постановка вопроса

- `gameplay/presentation/QuestionPresentationController.java` — состояния, события,
  сигналы озвучки с поколениями, резервный timeout и точный запуск ответов/часов.
- `ui/play/CinematicQuestion.java` — cached glyph quads, fixed seed, тень, мягкое проявление
  букв и единая трансформация композиции без пересчёта переносов.
- `PlayScreen` задаёт позицию и масштаб вопроса; `AnswersPresentationActor` размещает ответы 1–4.
  `AnswerView` увеличивает правильный вариант до 140%, неверные полностью исчезают после падения часов.
  `PlayScreen.setResultsHandler()` позволяет подключить следующий экран после выдержки результата.
- `RoundController` использует новую временную последовательность. ClockTimerActor и
  ClockTimeline сохраняют IV→XII и закрытие за 0.2 с.
- `docs/QUESTION_PRESENTATION.md` — параметры и пример будущего подключения голоса.
- RoundCheck/PlayCheck обновлены под новую последовательность; старые фиксированные
  задержки 3 с и 3.96 с больше не используются для ответов и таймера.

Обновление фона PLAY: смешивание разных перспектив отключено; вместо четырёх
текстур используется одна с непрерывным освещением свечей. Shader создаётся
один раз; PlayCheck проверяет его освобождение. ClockTimerActor добавляет
общую микровибрацию корпуса/стрелки/сектора и более тёмный красный сектор.


## Сетевой игровой цикл

- `shared/src/main/java/com/erni/finalanswer/gameplay/questions/` — общие Question,
  QuestionSource, DemoQuestionSource (перенесены из core, пакеты сохранены).
- `shared/.../com/finalanswer/protocol/Protocol.java` — JSON, фазы, временные константы.
- `server/.../rooms/RoomService.java` — единый авторитетный реестр комнат/сессий.
- `server/.../game/GameSession.java` — вопросы, фазы, дедлайн и результаты.
- `server/.../RoomServer.java` — HTTP + WebSocket + сайт на одном порту.
- `core/.../network/RealtimeClient.java` — соединение и переподключение ведущего.
- `core/.../network/NetworkRoundAdapter.java` — серверное время → существующие анимации.
- `web/` — телефонный контроллер; `deploy/` — systemd/Caddy/production environment.
- `server/src/test/` — правила и реальный HTTP/WebSocket с тестовыми часами.
- `docs/MULTIPLAYER_PROTOCOL.md` и `server/README.md` — протокол и полный запуск.

В сетевом PLAY сервер переключает вопросы; SPACE/R/P доступны только в локальном preview.

## Уборка корневых изображений — 19 октября 2026

Все 52 корневых PNG разложены без изменения содержимого: два используемых холста — в `assets/impostor/phone/`, остальные оригиналы — в `source_assets/archive/root-imports/` по назначению. HTTP-пути ресурсов сохранены. Подробности и реестр старых/новых путей: [docs/ASSET_ORGANIZATION.md](docs/ASSET_ORGANIZATION.md).

### Актуализация персонажей лобби

- `assets/lobby/characters/` — все действующие модульные персонажи, включая zombie, dracula, plague_doctor и puppeteer.
- `assets/lobby/character_presentation.json` — параметры размера, положения и яркости внутри клетки.
- `source_assets/lobby/` — упорядоченные оригинальные импорты из корня; реестр перемещений: `docs/lobby-asset-moves.json`.
- `CageCharacterPresentation` применяет только оформление внутри клетки; анимации и размещение клеток сохраняются.
- `:lwjgl3:lobbyCharacterPolishCheck` проверяет смешанный состав и три разрешения; `:lwjgl3:puppeteerStudio` открывает настройку Кукловода.
