# Инструменты разработки

Это offline-утилиты и проверки, а не код игрового процесса. Gradle запускается из корня проекта. Node-утилиты сами переходят в корень; Python-утилиты находят его по `settings.gradle`.

| Каталог | Что находится внутри |
| --- | --- |
| `assets/` | Подготовка оригинальных моделей, PNG, звука и превью |
| `checks/` | Проверка структуры, API и браузерных контроллеров |
| `dev/` | Интерактивные просмотры, локальное управление тестами, отчёты профилей |

## Ресурсы

```sh
python3 tools/assets/prepare_cursed_boxes_audio.py
python3 tools/assets/prepare_cursed_audio_expansion.py
python3 tools/assets/import_cursed_boxes.py
python3 tools/assets/import_cursed_boxes_backgrounds.py
python3 tools/assets/prepare_cursed_survivors.py
```

Аудиоподготовка использует стандартную библиотеку Python. Импорт изображений требует Pillow, подготовка survivor rigs — также NumPy. `render_candle.py` запускается из Blender. Не запускайте всю подготовку без необходимости: импортёры намеренно обновляют `assets/`.

Оригиналы находятся через `source_assets/catalog.json` и `tools/assets/_sources.py`. Исходные имена файлов сохранены. Новые материалы сначала помещаются в `source_assets/incoming/`, затем регистрируются и подготавливаются для `assets/`.

## Основные проверки

`node tools/checks/check_controller_presentation.cjs` проверяет модель стадий обоих режимов без браузера. С `CONTROLLER_URL` дополнительно выполняет 36 мобильных визуальных проверок; нужны Playwright и Chromium.

Единая проверка проекта (Python 3 и JDK 21):

```sh
./gradlew verifyProject --offline
```

Она проверяет структуру и целостность оригиналов, запускает Java-проверки и собирает desktop-приложение. При нестандартном пути Python используйте `-PpythonExecutable=/path/to/python3`. `--offline` подходит, когда зависимости уже загружены; при первой установке уберите этот флаг. Проверка графики и телефонных браузеров запускается отдельно командами ниже.


```sh
python3 tools/checks/check_project_layout.py
./gradlew :server:check :core:check :shared:check :lwjgl3:assemble --offline
python3 tools/checks/check_room_api.py http://127.0.0.1:8080
```

Для browser QA нужен Playwright (`PLAYWRIGHT_MODULE` при внешней установке) и доступный Chromium (`CHROME_PATH`). Зависимости браузера не входят в игровой runtime.

```sh
./gradlew :lwjgl3:cursedBoxesFullRoundCheck --offline
KEEP_OPEN=0 PLAYWRIGHT_MODULE=/path/to/playwright CHROME_PATH=/path/to/chrome node tools/checks/check_cursed_full_round.cjs
```

## Просмотр телефонов с начала вопроса

Запустите `:lwjgl3:cursedBoxesFullRoundCheck`, затем подготовку и viewer в отдельных терминалах:

```sh
REVIEW_FROM_QUESTION=1 PLAYWRIGHT_MODULE=/path/to/playwright CHROME_PATH=/path/to/chrome node tools/checks/check_cursed_full_round.cjs
node tools/dev/review_cursed_players.cjs
```

Адрес viewer печатается в консоли. Он работает только на loopback, использует настоящую тестовую комнату и не добавляет маршруты в production-сервер. Артефакты и временные учётные данные находятся в игнорируемом `lwjgl3/build/cursed-full-round/`.

Остальные сценарии перечислены в [документации мини-игр](../docs/README.md). Результаты Gradle находятся в `build/` соответствующего модуля; сохранённые визуальные материалы — в `generated/`.
