# Final Answer: offline host narration

The user approved `host_ru_test_002` on 2026-10-24. The first audio-only sample was
rejected for similarity. The approved ICL voice profile is `final_answer_host_ru_v1`.
The checked batch contains 12 actual project questions and 8 host lines, not 10,000
questions. Runtime playback uses local OGG assets and never calls Qwen.

The cinematic intro adds 23 separately reviewable lines, lossless timbre processing,
subtitles and a measured schedule. See [the intro guide](../../docs/cinematics/intro.md).

## Verified installation

Local app: `/Users/erni/Desktop/QwenTTS`. Its current HTTP server listens on
`127.0.0.1:8765`. `/health`, `/models/status`, `/models/available` were inspected.
`POST /voice-clone` requires multipart fields `text`, `language`, `reference_text`
and `reference_audio`; it returns WAV. Its current endpoint requires a transcript.
Do not send an invented transcript or call `/models/load` blindly: the latter can
download models. Starting the GUI/backend is unnecessary for the direct adapter.

The adapter uses that installation's `.venv` and actual `mlx_audio` Base model
`generate(ref_audio=..., ref_text=verified_transcript, lang_code="russian")`.
The installed source also supports audio-only speaker embeddings, but that initial
mode did not satisfy the user's voice-similarity requirement.
VoiceDesign, preset speakers and other identities are explicitly disallowed.
Models are local-only; Hugging Face offline mode is enabled. The user's running
backend and its model selection are left untouched.

Base cloning does not implement the CustomVoice/VoiceDesign `instruct` emotion
controls. Emotional categories must remain metadata or manually approved variants;
do not change model identity to obtain an emotion. This implementation exposes no
reusable embedding/prompt API, so none is fabricated here.

## Local inputs

- Original: project-root `voice_sample!.wav`, unchanged.
- Preserved copy: `reference/original.wav`.
- Approved segment: `reference/host_ru_icl_reference.wav`, first 8.3 seconds.
- User-verified exact transcript: `reference/host_ru_reference.txt`.
- Initial rejected audio-only segment: `reference/host_ru_reference.wav`.
- Source hash and segment coordinates: `reference/metadata.json`.
- Private machine paths: `config/local.json`; portable template: `config/example.json`.

Reference is mono PCM16, 24 kHz, 163.4 seconds. Its original SHA-256 remains
unchanged. The approved segment starts at 0 seconds. Exact transcript:
«Добро пожаловать в финальный ответ! Дамы и господа, рад приветствовать вас на
нашем замечательном шоу». ASR supplied a draft only; the user verified it before ICL.

## Generate one short sample

Requirements: the existing QwenTTS Python environment, FFmpeg/ffprobe and
`vorbis-tools` (`brew install vorbis-tools`). No project runtime dependencies are added.

```sh
/Users/erni/Desktop/QwenTTS/.venv/bin/python tools/host-tts/scripts/clone_sample.py \
  --config tools/host-tts/config/local.json \
  --text 'Добро пожаловать. Пришло время узнать ваш последний ответ.' \
  --output tools/host-tts/output/samples/host_ru_test_003
```

Choose a fresh output basename: existing files are protected. Failed encoding
does not discard or regenerate the lossless WAV; use `audio_export.export_vorbis`
to retry export separately. Valid bitrates: 64/96/128 kbps. At 24 kHz libvorbis
rejects the requested mono 96 kbps mode, so the export resamples to 48 kHz while
keeping the original generated WAV at 24 kHz. This adds no source detail.

`output/samples/host_ru_test_002.wav` and `.ogg` are the approved sample. Playback:

```sh
afplay tools/host-tts/output/samples/host_ru_test_002.wav
afplay tools/host-tts/output/samples/host_ru_test_002.ogg
```

Validation checks decoding, duration, finite samples, signal presence and peak;
these checks cannot establish voice similarity, pronunciation or emotion quality.
All audio, reference
transcripts, machine configuration and generated reports remain outside Git.

## Пакетная озвучка

Из корня FinalAnswer:

```sh
TTS_PYTHON=/Users/erni/Desktop/QwenTTS/.venv/bin/python

# Один вопрос / диапазон позиций каталога, начиная с 1
"$TTS_PYTHON" tools/host-tts/scripts/narration.py generate --id solar-largest
"$TTS_PYTHON" tools/host-tts/scripts/narration.py generate --range 1:12

# Недостающие вопросы; готовые валидные файлы автоматически пропускаются
"$TTS_PYTHON" tools/host-tts/scripts/narration.py generate --limit 50
"$TTS_PYTHON" tools/host-tts/scripts/narration.py generate --kind events

# Ошибки / принудительная перегенерация одного вопроса
"$TTS_PYTHON" tools/host-tts/scripts/narration.py retry --kind all
"$TTS_PYTHON" tools/host-tts/scripts/narration.py generate --id solar-largest --force

# Прогресс доступен и во время работающего пакета
"$TTS_PYTHON" tools/host-tts/scripts/narration.py progress
"$TTS_PYTHON" tools/host-tts/scripts/narration.py validate --kind all
"$TTS_PYTHON" tools/host-tts/scripts/narration.py export

# Убрать сомнительный файл из игрового манифеста / вернуть после прослушивания
"$TTS_PYTHON" tools/host-tts/scripts/narration.py flag --id solar-largest --reason 'Проверить ударение'
"$TTS_PYTHON" tools/host-tts/scripts/narration.py approve --id solar-largest
```

Единый источник: `shared/src/main/resources/questions/ru.json`. Сохранены прежние
12 ID, порядок, тексты и варианты ответов. `QuestionCatalog` читает его на сервере
и в demo. Необязательный `spokenText` задаёт произношение без изменения экранного
текста. Реплики: `config/events.json`. Эмоции — метаданные: Base Clone не поддерживает
instruct для актёрской подачи; не заменяем его другим голосом ради эмоций.

SQLite `output/jobs.sqlite` хранит статус, ошибки, попытки, lossless WAV, контент-хеш
и SHA-256 OGG. Контент-хеш учитывает текст, voiceId, эталон, transcript, checkpoint
и настройки. При обновлении реализации MLX также меняйте версию voiceId.
Один worker загружает модель один раз на пакет; эталон декодируется один раз.
Открытого API сохранения clone prompt/embedding нет, поэтому оно не выдумано.

Ctrl+C сохраняет готовые задания; следующий generate продолжает работу. До трёх
попыток на задание (`--attempts` допускает 1–5). Generation lock запрещает два
GPU-пакета одновременно; progress читает SQLite без захвата этого lock.
Манифест сохраняется атомарно каждые 50 заданий и при выходе. CLI выводит скорость,
ETA и объём файлов; сообщения модели — `output/worker.log`. В RAM не загружается
весь аудиокаталог. Больше 50 заданий за запуск требует `--allow-large`.
Пакет из 10 000 вопросов не запускался.

WAV сохраняются в `output/lossless/`, OGG — в `assets/audio/host/ru/questions/`
и `events/`. Имена содержат стабильный ID и короткий хеш; соответствие — в
`assets/audio/host/ru/manifest.json`. Повторная компрессия сжатых файлов запрещена.
Экспорт можно повторить отдельно без новой генерации:

```sh
python3 tools/host-tts/scripts/audio_export.py source.wav destination.ogg --bitrate 96
```

Проверяются декодирование, формат, длительность, каналы, пустой сигнал, конечные
значения, клиппинг и хеш. `ready` означает техническую готовность на основе
утверждённого голоса; `manualReview: not_yet_reviewed` честно отмечает, что каждую
реплику ещё не прослушивали отдельно. Автоматика не подтверждает ударение,
полноту произнесённого текста или эмоциональное качество. Для проблем — flag,
spokenText и перегенерация.

## Воспроизведение и проверки

`GameAudio` владеет `HostVoiceManager` и его AssetManager. Стандартный libGDX
MusicLoader загружает аудио асинхронно; JSON-манифест также читается worker-потоком.
В памяти максимум текущий клип,
одна загрузка и последний ожидающий запрос. Есть playQuestion/playLine,
stop/pause/resume/setVolume, callbacks COMPLETED/MISSING/CANCELLED/FAILED,
отмена устаревших загрузок и ограниченный кэш ID событий. Речь не накладывается.
Master/SFX и локальные настройки экрана сохранены; окружение мягко приглушается.

Интеграции: `PlayScreen.beginRound` — вопрос; `ImpostorScreen.presentPhase` —
вступление. Другие реплики доступны, но не вставлены во все сцены.
Сетевые ID вопроса/game/session предотвращают дубли; телефоны озвучку не получают.
Audio callback не управляет серверным исходом или фазой. Старое аудио отменяется
при выходе/смене вопроса; пауза сохраняет возможность продолжения. Нет файла —
предупреждение и продолжение игры без зависания.

```sh
# Настоящий вопрос и объявление через аудиоустройство, без TTS
./gradlew :lwjgl3:hostVoicePlaybackCheck --offline
./gradlew :core:check :server:test :lwjgl3:compileDevJava --offline
./gradlew :lwjgl3:impostorDeathWindowCheck --offline
python3 tools/host-tts/scripts/test_audio_export.py
python3 tools/host-tts/scripts/test_narration.py
```

Ручная проверка: открыть обычный вопрос, услышать речь один раз, проверить
неизменный таймер, паузу, master/SFX/mute и выход посреди речи. Затем открыть
THE IMPOSTOR: вступление звучит вместе с сохранёнными эффектами. Удалённый
временно OGG должен давать предупреждение; после проверки вернуть файл.

Backend GUI не нужен: worker запускается автоматически CLI. Штатный HTTP backend,
если он нужен отдельно и порт свободен, запускается из `/Users/erni/Desktop/QwenTTS`
командой `.venv/bin/python backend/server.py 8765`. Не добавляйте `--public`.

## Перенос и ограничения

Медиа, reference/transcript, личные пути, SQLite и логи исключены из Git.
После clone приватные аудио восстанавливаются отдельно. Скрипты, шаблоны,
каталог вопросов и небольшой манифест версионируются.

Runtime учитывает `audio/host/<language>/`; английский голос и генерация ещё
не реализованы. LocalWorker можно заменить защищённым удалённым transport,
сохранив jobs/validation/manifest и Java без изменений. Удалённый transport
сейчас не включён: нет аккаунта, обязательного интернета или загрузки эталона.
