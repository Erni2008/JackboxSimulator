# Исходные материалы

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

Используемые холсты `papper3dview.png` и `word_reminise.png` теперь находятся в `../assets/impostor/phone/`. Изображения больше не нужно хранить в корне проекта. См. [правила размещения ресурсов](../docs/ASSET_ORGANIZATION.md).
