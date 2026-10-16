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
│   └── GenerationCodeScreen.java       ← экран GENERATION CODE, BACK и REROLL
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
режимов на русский. Самостоятельной кнопки выбора языка пока нет.

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
Сервер и запуск сетевой сессии пока не реализованы; ввод в форме сам по себе
не создаёт комнату на сервере.

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
число игроков и выбранный `GameMode`. Это данные для будущего сервера/сессии;
сам сервер и игровые механики режимов этим изменением не добавлены.

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
последний снимок настроек. Пока обработчик только сохраняет его и пишет сообщение
в консоль; создание комнаты на сервере и переход в лобби ещё не подключены.

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

## Сервер: текущее состояние

`server/` подключён в `settings.gradle` как отдельный модуль с плагином `application`.
Точка входа — `server/src/main/java/com/finalanswer/server/RoomServer.java`.
Запуск: `./gradlew :server:run`. Пока программа выводит `Server started` и завершается;
сетевые подключения и создание комнат ещё не реализованы. Сетевой код будем писать в `server/`,
а интерфейс клиента останется в `core/`. `lwjgl3/` отвечает за запуск на компьютере;
экраны и отрисовка интерфейса уже находятся в `core/`.

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
- REROLL убрана с экрана; её текстуры не загружаются. Исходные изображения сохранены.
- Поле центрируется формулой `fieldX = (WIDTH - fieldWidth) / 2`; GENERATE выровнена по его центру.
- GENERATE вызывает `RoomCodeGenerator.generate()` и обновляет четыре надписи в ячейках.
- BACK слева сверху и Esc возвращают в меню. Экран переиспользуется; ресурсы освобождаются при закрытии приложения.
- Оригиналы лежат в `source_assets/backgrounds/generation_code/` и
  `source_assets/buttons/reroll/`. Исходное имя `reroll_hocer.png` сохранено;
  рабочая копия называется `reroll_hover.png`.

Поле кода — отдельный `Image` с именем `codeField`: `assets/ui/windows/generation_code/CodeField.png`.
Размер и положение задаются в конструкторе `GenerationCodeScreen`: `fieldWidth`, `fieldY`, `codeField.setBounds(...)`. Пропорции оригинала сохраняются. Генерация текста пока не подключена.

### Кнопка GENERATE

`ui/buttons/generation/GenerateCodeButton.java` — три состояния новой кнопки под
полем кода. Ресурсы: `assets/ui/buttons/generate_code/generate_{up,hover,pressed}.png`.
Размер и положение — `generateWidth`, `generateHeight` и `generateButton.setBounds(...)`
в `GenerationCodeScreen`. Движения и мерцания у кнопки нет; появление общее с экраном.
Генерация пока не подключена. Для будущей логики предусмотрен
`generateButton.setOnGenerate(() -> { /* твой код */ });`.

BACK: `ui/buttons/generation/BackButton.java`, ресурсы `assets/ui/buttons/back/`. Размер и отступы задаются в `GenerationCodeScreen` (`backWidth`, отступ 32). Поле кода увеличено до 680 единиц с сохранением пропорций.

## Оптимизация интерфейса

- `FinalAnswerGame` создаёт и хранит только три экрана меню. Переходы выполняются
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

Локальная проверка: раньше создание меню при возврате занимало около 1109 мс,
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
