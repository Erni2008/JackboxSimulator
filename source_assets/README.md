# Исходные материалы

> Медиа хранятся только локально и исключены из Git. Для нового клона нужны приватные ресурсы из вашей копии. См. [правила приватных медиа](../docs/assets/private-media.md).

Здесь лежат оригиналы изображений и сохранённые копии, перенесённые из корня
проекта и папок Java. Файлы сохранены без изменения содержимого.

- `buttons/all_icons/` — исходные изображения больших кнопок меню.
- `buttons/player_count/` — три исходных состояния кнопок MAX PLAYERS.
- `buttons/game_mode/next/`, `previous/`, `info/` — оригиналы стрелок и INFO.
- `buttons/confirm_create_room/` — оригиналы CREATE в форме.
- `buttons/cancel_room/` — оригиналы CANCEL в форме.
- `buttons/java_copies/` — копии, раньше лежавшие рядом с Java-классами.
- `backgrounds/create_room/` — три оригинальных фона комнаты.
- `windows/create_room/` — оригинал оформления окна и поля выбора режима (`field`, `field_hover`).
- `candles/frames/` — 96 оригинальных кадров трёх свечей.

Игра загружает ресурсы из `assets/`. После правок оригинала обнови соответствующий
файл в `assets/`, чтобы увидеть изменение в игре. Карта кода: `../PROJECT_MAP.md`.

- `backgrounds/generation_code/` — четыре оригинала `stage1–stage4`.
- `buttons/reroll/` — оригиналы состояний REROLL (`hocer` — исходное имя hover).

- `buttons/generate_code/` — оригиналы трёх состояний GENERATE.

- `buttons/back/` — оригиналы BACK и BACK hover.

## Архив изображений из корня проекта

`archive/root-imports/` — 50 сохранённых исходных файлов, отсортированных по назначению: `impostor/`, `clock/`, `backgrounds/`, `ui/`. Из них 49 — побайтные копии существующих игровых ресурсов; один фон пока не используется. Они не загружаются игрой и не попадают в сборку.

Используемые холсты `papper3dview.png` и `word_reminise.png` теперь находятся в `../assets/impostor/phone/`. Изображения больше не нужно хранить в корне проекта. См. [правила размещения ресурсов](../docs/assets/README.md).

## Lobby artwork

`lobby/` хранит исходные импорты клетки, скелета, призрака, доктора, куклы Вуду и Кукловода. Действующие ресурсы загружаются только из `assets/lobby/`. Имена `pupper9.png` и `pupet16.png` сохранены как в оригинальных импортах. Реестр перемещений с SHA-256: `docs/assets/lobby-asset-moves.json`.

## Текущие разделы оригиналов

- `cursed_boxes/models/` — три коробки и исходные 3D-щепки.
- `cursed_boxes/characters/` — intact, damaged и прежние ghost-версии с исходными именами.
- `cursed_boxes/backgrounds/` — активные фоновые импорты; `alternatives/` хранит запасные версии.
- `cursed_boxes/effects/`, `shelf/` — исходные VFX, PNG-щепки и полка.
- `shotgun/models/` — четыре первоначальных GLB дробовика.
- `audio/cursed_boxes/` — восемь первоначальных WAV; `audio/cursed_boxes_expansion/` — 13 новых записей.
- `incoming/` — новые ещё не интегрированные оригиналы.

[Каталог импортов](catalog.json) хранит исходное имя, актуальный путь и SHA-256. Подготовка ресурсов находится в [tools/assets](../tools/assets/); импортёры больше не ищут файлы в корне. [Реестр текущего переноса](../docs/assets/project-layout-moves.json) позволяет найти любой перемещённый файл. Действующие пути libGDX внутри `assets/` не менялись.
