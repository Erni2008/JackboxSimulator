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
│   └── RoomSettingsScreen.java         ← экран создания комнаты
├── ui/                                 ← элементы внутри экранов
│   ├── windows/
│   │   ├── OptionsMainWindow.java      ← окно CREATE ROOM: поля и настройки
│   │   └── ModeInfoDialog.java         ← описание выбранного режима
│   ├── buttons/
│   │   ├── AnimatedImageButton.java    ← общая анимация больших кнопок меню
│   │   ├── CreateRoomButton.java       ← действие кнопки CREATE ROOM
│   │   ├── ConfirmCreateButton.java    ← кнопка CREATE внутри формы
│   │   ├── CancelRoomButton.java       ← CANCEL, возврат в главное меню
│   │   ├── PlayButton.java             ← действие PLAY
│   │   ├── SettingsButton.java         ← действие SETTINGS
│   │   ├── ExitButton.java             ← выход из игры
│   │   ├── GenerationCodeButton.java   ← действие GENERATION CODE
│   │   ├── PlayerCountSelector.java    ← выбор 2–8 игроков
│   │   └── GameModeSelector.java       ← Previous / Next и название режима
│   ├── effects/
│   │   ├── CyclingRoomBackground.java  ← смена трёх фонов и скорость переходов
│   │   └── TableCandle.java            ← три свечи, 96 кадров, свет и тени
│   ├── GameFonts.java                  ← шрифты главного меню
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
| Что происходит при CREATE ROOM | `ui/buttons/CreateRoomButton.java` |
| Что отображается на экране создания комнаты | `screens/RoomSettingsScreen.java` |
| Название, пароль, шрифт ввода, анимация окна | `ui/windows/OptionsMainWindow.java` |
| Кнопки MAX PLAYERS, их размер, цвета и состояния | `ui/buttons/PlayerCountSelector.java` |
| Скорость смены фонов | `ui/effects/CyclingRoomBackground.java` |
| Свечи и их освещение | `ui/effects/TableCandle.java` |
| Список игровых режимов | `rooms/GameMode.java` |
| Стрелки, INFO и подпись GAME MODE | `ui/buttons/GameModeSelector.java` |
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
- Класс: `ui/buttons/ConfirmCreateButton.java`.
- Размер и положение: `OptionsMainWindow.layoutIn()` (`createWidth`, нижний отступ `bottom`).
- Проверка названия и сбор настроек: `OptionsMainWindow.requestCreation()`.
- Обработчик: `RoomSettingsScreen`, подключается через `optionsWindow.setOnCreate(...)`.

CREATE доступна мышью и через Tab → Enter/Space. Пустое название не принимается.
После подтверждения `RoomSettingsScreen.getRequestedConfiguration()` возвращает
последний снимок настроек. Пока обработчик только сохраняет его и пишет сообщение
в консоль; создание комнаты на сервере и переход в лобби ещё не подключены.

## Отмена создания комнаты

`CancelRoomButton.java` находится в `ui/buttons/`, а её три PNG — в
`assets/ui/buttons/cancel_room/`. CREATE расположена слева, CANCEL — справа.
Размеры и положение обеих кнопок задаются в `OptionsMainWindow.layoutIn()`.

`RoomSettingsScreen(FinalAnswerGame game)` получает игру для переключения экранов.
`optionsWindow.setOnCancel(...)` вызывает `cancelCreation()`, которая возвращает
в `MainMenu` после завершения текущего события и освобождает ресурсы формы.
Работают мышь, Tab → Enter/Space и Esc. Если открыто описание режима, Esc сначала
закрывает только описание. При открытии комнаты старое главное меню также
освобождается, чтобы повторные переходы не оставляли старые текстуры в памяти.
