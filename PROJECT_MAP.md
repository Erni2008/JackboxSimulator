# Карта Final Answer

Актуальная точка входа в проект. Команды запускаются из корня; Java 21 используется во всех модулях.

## Структура

| Каталог | Назначение |
| --- | --- |
| `core/` | libGDX: экраны, мини-игры, графика, UI и звук |
| `shared/` | Общие вопросы, протокол и чистые Java-модели |
| `server/` | Авторитетная логика комнат, HTTP/WebSocket, состояния игроков |
| `web/` | Телефонные контроллеры HTML/CSS/JavaScript |
| `lwjgl3/` | Desktop-запуск, упаковка и native-проверки |
| `inspector/` | Отдельный инструмент просмотра кода |
| `assets/` | Только ресурсы, загружаемые игрой и упаковкой |
| `source_assets/` | Оригиналы, версии и исходники для подготовки ресурсов |
| `tools/assets/` | Импорт, подготовка и экспорт ресурсов |
| `tools/checks/` | Проверки проекта, API и браузерных контроллеров |
| `tools/dev/` | Ручные просмотры и управление тестовыми сессиями |
| `docs/` | Тематическая документация и реестры переносов |
| `generated/` | Сохранённые превью, профили и материалы QA |
| `deploy/` | Конфигурация развёртывания |
| `examples/` | Примеры вне основной сборки |
| `<module>/build/` | Локальные результаты Gradle; не исходники |

## Быстрый запуск

```sh
./gradlew :lwjgl3:run
./gradlew :server:check :core:check :shared:check :lwjgl3:assemble --offline
python3 tools/checks/check_project_layout.py
```

## Где менять систему

| Система | Основные точки входа |
| --- | --- |
| Жизненный цикл приложения | `core/src/main/java/com/erni/finalanswer/FinalAnswerGame.java` |
| Главное меню и настройки | `core/src/main/java/com/erni/finalanswer/screens/` |
| Общие кнопки и элементы UI | `core/src/main/java/com/erni/finalanswer/ui/` |
| Клетки и анимации персонажей лобби | `core/src/main/java/com/erni/finalanswer/ui/lobby/cages/` |
| CURSED BOXES, рендер и эффекты | `core/src/main/java/com/erni/finalanswer/cursedboxes/` |
| Модель, механизм и события дробовика | `core/src/main/java/com/erni/finalanswer/shotgun/` |
| Общий аудиомикс и звук UI/клеток | `core/src/main/java/com/erni/finalanswer/audio/` |
| THE IMPOSTOR | `core/src/main/java/com/erni/finalanswer/impostor/` |
| Вопросы и постановка раунда | `core/src/main/java/com/erni/finalanswer/gameplay/` |
| Комнаты, выборы и серверная авторитетность | `server/src/main/java/com/finalanswer/server/rooms/RoomService.java` |
| Серверные мини-игры | `server/src/main/java/com/finalanswer/server/game/` |
| Общие фазы и протокол | `shared/src/main/java/com/finalanswer/protocol/` |
| Телефон Cursed Boxes | `web/cursed-boxes.js`, `web/cursed-boxes.css` |
| Локализация | `assets/i18n/` |

CURSED BOXES использует 16 ячеек. В раунде после вопроса неверно ответившие выбирают убежища, а верно ответившие получают по одному выстрелу. Отдельный тренировочный запуск сохраняет два выстрела; тест персонажей — девять.

## Документация и оригиналы

- [Индекс документации](docs/README.md).
- [Cursed Boxes](docs/cursed-boxes/README.md), [мультиплеер](docs/cursed-boxes/multiplayer.md), [выбор убежища](docs/cursed-boxes/hiding.md).
- [Расширенная аудиосистема](docs/cursed-boxes/audio-expansion.md).
- [Правила размещения ресурсов](docs/assets/README.md).
- [Каталог оригиналов](source_assets/catalog.json): исходные имена, актуальные пути, SHA-256.
- [Инструменты](tools/README.md).
- [Развёртывание сервера](server/README.md).
- [История прежней карты](docs/development/project-map-history.md): сохранена для справки, не является актуальным индексом.
