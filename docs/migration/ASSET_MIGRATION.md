# Ассеты: организация, импорт и проверка Unity

Статус: подготовка и план. Исходные игровые ресурсы `assets/` не конвертировались и не редактировались. Фактический инвентарь: [INVENTORY.json](INVENTORY.json), исходная база — проверенный Java backup `590e20b`.

## 1. Где теперь лежат файлы

| Каталог | Назначение | Что делать при переносе |
|---|---|---|
| `assets/` | Рабочие Java runtime-копии, конфиги, шрифты/аудио/модели | Оставить на месте, использовать как визуальный эталон |
| `source_assets/last_command/models/` | 9 GLB-оригиналов, ранее лежавших в корне | Хранить без изменения; имя `level_handler.glb` и другие опечатки не исправлять |
| `source_assets/audio/last_command/` | 24 новых исходных WAV/MP3 машины | Сохранить оригиналы; runtime PCM уже существует в `assets/sounds/last_command/runtime/` |
| `source_assets/audio/impostor/` | 9 исходных записей вступления/ролей/голосования/бумаги | Сопоставлять с текущими `assets/sounds/impostor/` и manifest, не по похожему имени |
| `source_assets/audio/shotgun/` | `wooden_stumb_hit.wav` | Использовать существующий runtime audio mapping |
| Прочие `source_assets/*` | Прежние исходники UI, фонов, персонажей, коробок и дробовика | Не смешивать с импортированными Unity prefabs |
| `tools/host-tts/reference/supplied/` | Приватный исходный `voice_sample!.wav`, перенесён локально | Остаётся ignored; не импортировать в Unity/git как игровой clip |
| `tools/assets/`, `tools/audio/` | Офлайн-конвейеры подготовки | Использовать сохранённые источники и явные аргументы, не runtime-файлы как редактируемые оригиналы |
| `generated/`, module `build/`, `assets/runtime/` | Воспроизводимые проверки/сборки/уменьшенные UI-текстуры | Не считать единственной копией ассетов; не переносить целиком в Unity |
| Будущий `unity/FinalAnswer/Assets/FinalAnswer/Games/*/Art` | Unity-импорт и prefabs | Создать позже с `.meta`, import settings и картой original SHA → GUID |

Итого перемещено 43 публичных файла и один приватный локальный sample, без переименования и изменения байтов. Точная карта old→new и SHA-256: [unity-preparation-moves.json](../assets/unity-preparation-moves.json). `source_assets/catalog.json` теперь содержит 104 записи, включая старые 61. Модели `adjuster.glb`, `light.glb`, `animal_panel.glb` и другие рабочие варианты доступны в `assets/`; отдельный исходный DCC-файл для каждого из них в репозитории не обнаружен. Это не мешает GLB-импорту, но нельзя обещать восстановление несуществующей авторской rig/Blender-сцены.

Офлайн path changes: `prepare_last_command.py` получает оригинал через `_sources.source_path(name)`, а при Blender-подготовке — явный временный `source`. `prepare_last_command_computer.py` использует тот же каталог и временный экспорт. `optimize_last_command.py` также разрешает перемещённые оригиналы через каталог и передаёт временный packed GLB явно; для adjuster/light без отдельного оригинала сохраняет прежний fallback в runtime source. Java runtime-пути, Gradle layouts и browser asset URLs не меняются. Скрипты подготовки других импортов с аргументом external source не запускались и не получают выдуманные оригиналы.

## 2. Измеренный инвентарь runtime-ресурсов

Учитываются 619 **отслеживаемых Git** файлов `assets/` общей длиной 1 189 133 864 байт. Это не оценка VRAM/RAM: сжатые и embedded текстуры при импорте занимают другую память. Вложенные `sounds/.../runtime/` включены; только генерируемая корневая `assets/runtime/` не отслеживается.

| Тип | Количество |
|---|---:|
| PNG | 315 |
| GLB | 67 |
| WAV / OGG / MP3 | 97 / 70 / 4 |
| TTF | 12 |
| BMFont `.fnt` / atlas | 4 / 1 |
| JSON / properties | 27 / 2 |
| GLSL / Blend | 3 / 1 |

Все 67 проверенных GLB в `assets/` не содержат glTF `animations` или `skins`. У high-профиля машины каждая из 12 GLB содержит один mesh и один node. Поэтому отдельные клипы «open hatch», «press button» и скелет персонажа не появятся после импорта автоматически. Нынешние движения — кодовая кинематика и/или процедурное движение 2D-элементов.

`last_command/{high,medium,low,mobile}` — уже подготовленные профили, а не четыре различных авторских машины. Native body выбирает high в существующем `TheLastCommandMachine`, даже при другом профиле деталей; браузер имеет свой quality selection. Сначала сравнить один согласованный профиль с эталоном, затем делать Unity LODGroup без повторного добавления четырёх корпусов в сцену.

## 3. Путь импорта 3D

1. Проверить [официальный glTFast editor importer](https://github.com/Unity-Technologies/com.unity.cloud.gltfast/blob/main/Packages/com.unity.cloud.gltfast/Documentation~/ImportEditor.md) на `computer.glb`, `button.glb`, `door.glb` и существующем дробовике. Пакет превращает GLB/glTF в Unity assets/prefabs; его версия фиксируется после smoke на Unity 6000.6.x.
2. Не конвертировать оригиналы в FBX поверх существующих файлов. Если конкретный материал/extension не поддержан выбранным importer, подготовить отдельную derived копию с письменным mapping и hash.
3. Создать Unity import manifest: исходный relative path, SHA-256, profile, importer version, GUID, material remaps, target prefab, координатная basis conversion и unit scale.
4. Проверить hierarchy, mesh count, triangle count, bounds, node local transforms, нормали/tangent handedness и UV. glTFast уже преобразует координаты; дополнительное ручное отражение «на всякий случай» запрещено.
5. Реконструировать сборку из `assembly.json`, `panel.json`, `mechanisms.json`: положение, ось шарнира/хода, authored transform, целевые углы. При смене basis переводить полную матрицу (`C × M × C⁻¹`), а не копировать значения Java Euler в Unity Euler. Unit scale фиксировать отдельно, без предположения, что все исходные Blender-единицы уже метры.
6. Geometry — дочерний объект Pivot. Точки шарниров брать из конфигов; mesh не центрировать автоматически. Дверца и cap — отдельные объекты, корпус статичен. Масштаб всей машины не должен менять относительный stroke.
7. Raycast collider/simplified pick surface проверить против корпуса и соседних механизмов. Не ставить один convex collider на всю машину и не разрешать лучу проходить сквозь закрытую дверь.
8. Сравнить одинаковые ракурсы: front/right/back, button rest/pressed, lever all positions, dial four angles, hatch closed/open/closing. Это отдельный acceptance gate до интерактивных правил.

## 4. Материалы, стекло, свет

glTF metallic/roughness PBR передаётся через importer → URP materials. Проверить embedded baseColor, metallic/roughness packing, normal и emissive карты. BaseColor/emission — корректный color space; normal/маски — data textures. Альфа cutout у персонажей/отверстий не заменяется непрозрачным black background.

`WeatheredMetalShaderProvider`, GLSL corrosion layer, Three.js `body-material`/`crt-glass`/`power-lighting` нельзя присоединить к URP как готовый shader. План: базовый PBR-паритет → один общий URP Shader Graph/минимальный custom shader для металла/CRT → проверка mobile/desktop-quality budget. Сначала использовать имеющиеся карты, затем отдельно согласовывать новый artwork. «Новый shader в плане» не означает, что перенесённый материал уже выглядит идентично.

CRT: отдельный непрозрачный экран с RenderTexture, стекло поверх с контролируемыми отражениями/roughness. UV input projection тестируется на реальной геометрии. Bloom не должен делать текст нечитаемым; emissive сам по себе не обязан освещать окружение — локальные light proxies ограничены и управляются budget. AO/shadows/reflection probe и key/fill воспроизводятся как scene setup, не запекаются в исходную GLB.

## 5. 2D UI, персонажи и шрифты

- Переиспользовать PNG, slicing/anchor-настройки воссоздать в uGUI. libGDX Skin/Scene2D Actor и BMFont `.fnt` не становятся Unity Canvas автоматически.
- TTF → TextMeshPro font assets с кириллицей, математическими знаками и символами задач. Создать проверку отсутствующих glyphs до полировки внешнего вида.
- 96 кадров свечей и кодовые rigs лобби остаются последовательностями/процедурными элементами. Не обещать готовый skeletal clip для Ghost/Zombie/Dracula/Pumpkin/Plague Doctor/Voodoo/Puppeteer/Skeleton.
- Прозрачность призраков, отверстия/повреждения коробок и порядок слоёв — часть механического feedback; screenshot-only сходство без окклюзии недостаточно.
- HTML/CSS и Canvas `command-touch.js` остаются на телефонах. Unity CRT получает native представление по тем же public DTO; браузерный JS не встраивается в Unity как скрытая зависимость.

## 6. Аудио

Существующий `assets/sounds/last_command/runtime/manifest.json`: 26 SFX cues + 4 ссылки на команды утверждённого ведущего. Оригиналы не заменяются runtime PCM16 и не переименовываются. `machine_shutdown .wav` содержит пробел перед расширением, `Success2.wav` — заглавную S; файл с «creaking» в плане соответствует реально существующему `second_metal_cracking.wav`. Путевые строки берутся из manifest, не из визуально похожего имени.

Четыре memory-note файла — ранее согласованные pitch-варианты одного короткого импульса, а не четыре извлечённых исходных тона. Unity импортирует готовые варианты; исходник сохранён.

- Short clicks/notes: preload и Decompress On Load для малого PCM по результатам профиля; длинные music/voice — Streaming или Compressed In Memory с измерением decode. Не загружать WAV при каждом нажатии.
- Нынешний `success.mp3` — финальная победа; `Success2.wav` — подтверждённый обычный успех. Старый `success.wav` сохранён, но не заменяет актуальный cue автоматически.
- `QUESTION_TYPING`/`ALT` доступны в sound bank/аудиостенде; у Last Command сейчас нет привязанной к ним настоящей typewriter-анимации. Не заявлять её перенос и не выдумывать character-by-character event.
- Готовые host OGG/manifest и `voiceId` переиспользуются. Генератор Qwen остаётся офлайн-инструментом; внешний model/private references не нужны игрокам. Новую TTS-систему на C# не проектировать.
- Идентификаторы, gain, throttle, priority и semantic event scope перенести в Unity cue catalog. Animation marker вызывает соответствующий cue один раз, local/server echo дедуплицируются.

## 7. Упаковка, память и контроль изменений

Оригиналы и unused profile не обязаны все попадать в Unity player; в Git они остаются. Стартовый импорт — локальные references и отдельные game scenes; Addressables не нужен до измерений. Хранить общий материал/mesh по одному экземпляру, не создавать полные texture copies у каждой кнопки.

Для каждой партии импорта: hash source до/после, import report, profiler snapshot, game-state capture, missing-file/glyph/material validation. Сравнить время загрузки, peak memory, draw calls и p95 frame time на фиксированном компьютере. Снижение polycount — отдельная derived операция, не скрытая часть «переноса без изменений».

Большие Git-файлы сейчас приняты GitHub, >100 MiB среди backup payload нет. LFS для новых крупных derived-ассетов можно ввести до их первого коммита; массовый `git lfs migrate` по Java backup запрещён, так как переписывает его историю. Unity `.meta` всегда сохраняются рядом с asset.

## 8. Порядок работ и критерии

1. Подтвердить сохранность организованных исходников по каталогу и protected hash check.
2. Зафиксировать importer/URP/координаты на четырёх репрезентативных GLB.
3. Собрать prefab машины по данным, без сетевых правил; подтвердить отсутствие click-through и открывание по нужной оси.
4. Добавить CRT/UI/fonts/audio catalogs, сохранить semantic IDs.
5. Пройти визуальную/state matrix Last Command, затем остальные игры.
6. Измерить ресурсы и только затем ввести LOD/Addressables/расширенную компрессию.

Источники: [TheLastCommandMachine](../../core/src/main/java/com/erni/finalanswer/lastcommand/TheLastCommandMachine.java), [PivotMechanism](../../core/src/main/java/com/erni/finalanswer/lastcommand/PivotMechanism.java), [конфиг сборки](../../assets/models/last_command/assembly.json), [механизмы](../../assets/models/last_command/mechanisms.json), [аудиоманифест](../../assets/sounds/last_command/runtime/manifest.json), [HostVoiceManager](../../core/src/main/java/com/erni/finalanswer/audio/HostVoiceManager.java), [исходный каталог](../../source_assets/catalog.json). Последовательность механик: [THE_LAST_COMMAND_PLAN](THE_LAST_COMMAND_PLAN.md).
