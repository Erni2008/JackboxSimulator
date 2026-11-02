# Final Answer — Unity 6.6 host

Unity `6000.6.7f1`, URP, Linear, Input System. Java RoomServer и телефонный сайт не изменены (протокол v1).

## Запуск
- **Editor:** открыть `unity/FinalAnswer`, сцена `Assets/FinalAnswer/Scenes/Bootstrap.unity` → Play.
- **Сборка для разработчика:** меню *Final Answer → Build macOS (Developer)* → `Builds/macOS-Dev/FinalAnswer Dev.app`.
- **Обычная сборка:** *Final Answer → Build macOS* (без инструментов разработчика; включить их можно переменной `FA_DEV=1`).
- После добавления/замены ассетов: *Final Answer → Configure Project* (импорт, каталог `ArtCatalog`, сцена).

Сервер по умолчанию `http://127.0.0.1:8080` (меняется в SETTINGS). Если он не запущен, а в репозитории есть
`./gradlew :server:installDist`, Unity поднимет его сам и остановит только свой процесс.

## Интерфейс (перенос с Java/libGDX)
| Java | Unity |
|---|---|
| `MainMenu` (фон, свеча 96 кадров, логотип, 5 PNG-кнопок) | `MainMenuView` |
| `RoomSettingsScreen` + `OptionsMainWindow`, `PlayerCountSelector`, `GameModeSelector`, `ModeInfoDialog` | `CreateRoomView`, `ModeInfoDialog` |
| `GenerationCodeScreen` (generate / reroll / OK / back, heartbeat черновика) | `GenerationCodeView` + `GameManager` |
| `CageLobbyScreen`, `HangingCage`, `CageAnimator`, `ConnectionPanel` (QR) | `CageLobbyView`, `HangingCageView`, `CageTimeline`, `ConnectionPanel`, `QrCode` |
| 8 ригов персонажей клеток | запечённые флипбуки: `tools/unity/bake_cage_characters.sh` рендерит оригинальный Java-код |
| `GameAudio` (hover/press, решётка, замок, цепи, эмбиент) | `ShellAudio` |
| `messages*.properties` | `Localization` (те же файлы) |

Координаты, кропы PNG, тайминги и цвета взяты из Java-кода без изменений.

## Режим разработчика (Editor и Developer-сборка)
- **F1 — соло-тест.** Выберите игру (викторина, Cursed Boxes, The Impostor, Last Command, только лобби), число ботов
  и поведение ответов → «ЗАПУСТИТЬ». Сервер, комната и боты-телефоны создаются автоматически, игра стартует сама.
- **F3 — отладка.** Состояние сокета/комнаты/фазы, журнал событий, боты, SYNC, обрыв хоста (проверка переподключения),
  обрыв/возврат ботов, выход бота, тест звуков, mute.
- **Командная строка:** `"FinalAnswer Dev.app/Contents/MacOS/Final Answer" -fa-solo cursed -fa-bots 3 [-fa-server URL]`
  (`quiz|cursed|impostor|lastcommand|lobby`).
- **Визуальный тур:** `-fa-tour <папка>` проходит меню → комната → код → лобби → старт → викторина и сохраняет скриншоты окна.

Боты используют только публичный API телефона (как `web/app.js`), сервер остаётся авторитетным.

## Состояние модулей
| Модуль | Статус |
|---|---|
| Меню, создание комнаты, код, лобби с клетками, старт матча | перенесено с Java |
| Викторина (`PlayScreen`: комната со светом свечей, печать вопроса по буквам, ответы, готические часы, персонажи игроков, музыка/тиканье/замок/голос ведущего) + финальная таблица | перенесено с Java |
| Cursed Boxes | работает по серверу; представление пока 2D-сетка |
| The Impostor, The Last Command | сервер ведёт игру; в Unity экран фазы. Last Command в соло ждёт готовности терминала хоста (этап 3–5) |

## Проверки
- EditMode: `-runTests -testPlatform EditMode` — 27 тестов.
- E2E: `FA_SMOKE_SERVER=http://127.0.0.1:18080 Unity -batchmode -projectPath . -executeMethod FinalAnswer.EditorTools.IntegrationSmoke.Run`
- QR: `-executeMethod FinalAnswer.EditorTools.QrExport.Run` + любой декодер (проверено macOS Vision).
