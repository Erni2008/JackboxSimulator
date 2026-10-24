# Host Voice System — реализация и проверка

Утверждён профиль `final_answer_host_ru_v1`: пользователь прослушал вторую ICL-пробу
и подтвердил сходство. Первая аудио-only проба отклонена. Исходный
`voice_sample!.wav` сохранён без изменений; SHA-256 проверен.

Подробные команды, требования локальной установки, работа с transcript,
перегенерация и ограничения: [tools/host-tts/README.md](../../tools/host-tts/README.md).

## Изменённые Java-файлы

| Файл | Изменение |
| --- | --- |
| `core/.../audio/GameAudio.java` | Владение общим HostVoiceManager, update/pause/disposal |
| `core/.../screens/PlayScreen.java` | Озвучка реального вопроса по стабильному ID, отмена при выходе |
| `core/.../impostor/ImpostorScreen.java` | Одна реплика вступления по session ID, отдельное окно выбывания |
| `core/.../impostor/FinalVotePresentation.java` | Убрана повторная очистка, уже выполняемая clear() |
| `shared/.../questions/DemoQuestionSource.java` | Те же 5 demo-вопросов из общего каталога |
| `server/.../game/GameSession.java` | Те же 12 серверных вопросов из общего каталога |
| `lwjgl3/.../ImpostorCheck.java` | Проверка нового окна внутри существующего native QA |

## Новые классы и ресурсы

| Файл | Назначение |
| --- | --- |
| `core/.../audio/HostVoiceManager.java` | Асинхронные manifest/Music, очередь, отмена, callbacks, громкость, missing fallback |
| `core/.../impostor/ImpostorDeathWindow.java` | Только разоблачённый персонаж: смерть, превращение в призрака, затем результаты |
| `shared/.../questions/QuestionCatalog.java` | Единый источник для игры и offline-инструмента |
| `core/src/test/.../audio/HostVoiceCheck.java` | Логика асинхронного аудио без устройства |
| `lwjgl3/src/test/.../impostor/DeathWindowCheck.java` | Изоляция персонажа, reset и реальный Dracula rig/OpenGL |
| `lwjgl3/src/test/.../lwjgl3/HostVoicePlaybackCheck.java` | Реальное воспроизведение вопроса/реплики и отсутствие манифеста |
| `shared/src/main/resources/questions/ru.json` | 12 исходных вопросов, прежние ID/порядок/ответы, optional spokenText |
| `assets/audio/host/ru/manifest.json` | Соответствие ID локальным OGG и хешам |
| `tools/host-tts/scripts/clone_sample.py` | Одна проба утверждённого Base Voice Clone |
| `tools/host-tts/scripts/mlx_worker.py` | Модель и декодированный эталон один раз на пакет |
| `tools/host-tts/scripts/narration.py` | SQLite jobs, resume/retry, валидация, manifest, review flags, progress |
| `tools/host-tts/scripts/audio_export.py` | Настоящий mono Vorbis 64/96/128 kbps |
| `tools/host-tts/scripts/test_audio_export.py` | Реальные codec-тесты во временном каталоге |
| `tools/host-tts/scripts/test_narration.py` | Каталог/хеши, review flags, атомарный export и progress при generation lock |
| `tools/host-tts/config/example.json`, `events.json` | Переносимые настройки и 8 реплик с emotion metadata |

Также обновлены Gradle-задачи core/lwjgl3, `.gitignore`, индекс инструментов и README.
Личная конфигурация `config/local.json`, reference/transcript, lossless WAV,
generated OGG, SQLite и логи в Git не добавляются. Веса существующей модели
остались вне проекта; backend Qwen не изменялся.

## Реальные файлы

- Эталон для ICL: `tools/host-tts/reference/host_ru_icl_reference.wav` (0–8,3 секунды).
- Точный подтверждённый текст: `tools/host-tts/reference/host_ru_reference.txt`.
- Утверждённая проба: `tools/host-tts/output/samples/host_ru_test_002.wav` и `.ogg`.
- Игровые вопросы: `assets/audio/host/ru/questions/<id>_<hash>.ogg` — 12 файлов.
- Реплики: `assets/audio/host/ru/events/<id>_<hash>.ogg` — 8 файлов.
- Все точные имена и длительности — в [манифесте](../../assets/audio/host/ru/manifest.json).
- Lossless источники пакета — `tools/host-tts/output/lossless/`.

WAV сохраняет 24 кГц. Из-за ограничений установленного Vorbis encoder экспорт
96 kbps mono повышает частоту до 48 кГц. Исходная детализация не увеличивается.
Установлен `vorbis-tools`; FFmpeg используется для декодирования и проверки.

## Синхронизация и сохранение механик

Вопрос запускается только из существующего beginRound. Вступление THE IMPOSTOR
привязано к существующему INTRO/ROLE_REVEAL и session ID; личные роли не озвучиваются
на чужих устройствах. Телефонам новые аудиособытия не отправляются.
Ни callback, ни длительность файла не меняют серверные исходы, таймеры и фазы.
Существующие музыка и эффекты сохранены. Другие реплики подготовлены, но не
вставлены самовольно во все мини-игры.

Окно выбывания доступно только при публичном исходе IMPOSTOR_CAUGHT после раскрытия
ника. Показаны оригинальный персонаж и его переход в призрака; остальные закрыты
непрозрачной подложкой. Повторное подключение после окончания сцены не повторяет
её. Правила возвращения призрака не менялись.

## Выполненные проверки

- `:core:check`, `:server:test`, `:lwjgl3:compileDevJava` — успешны; сервер: 138 тестов, 0 ошибок.
- `:lwjgl3:impostorCheck -PimpostorAudioQA=true` — успешная существующая проверка 3/4 игроков, штампов, звуков, resize и disposal.
- `:lwjgl3:hostVoicePlaybackCheck` — настоящий вопрос + объявление, последовательное воспроизведение и graceful missing manifest.
- `:lwjgl3:impostorDeathWindowCheck` — только один персонаж, ghost/reset и оригинальный Dracula rig без GL-ошибок.
- 20 записей: 12 реальных вопросов + 8 реплик; декодирование/клиппинг/хеши проверены.
- Повторный запуск generate пропустил все 20 без загрузки модели и новой генерации.
- Python: 3 тестовых сценария, включая все 3 битрейта; syntax check и git diff --check успешны.
- Скриншоты окна смерти и призрака просмотрены; обнаруженное наследование тёмного batch tint исправлено локально в окне.

## Что остаётся

Индивидуальная дикция и актёрская подача всех 20 записей требуют прослушивания:
автоматическая техническая готовность не заменяет ручную оценку. Base Clone
не поддерживает управление эмоциями через instruct; категории сохранены как
метаданные. Английский профиль и удалённый GPU-транспорт не реализованы.
Структура языка и граница LocalWorker позволяют добавить их без изменения Java.
Массовая генерация 10 000 вопросов не запускалась.
