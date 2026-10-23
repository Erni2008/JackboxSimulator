# Cursed Boxes — расширение звука

## Порядок в среде

Остановлены ранее запущенные агентом native-проверки и локальный сервер просмотра пультов. Временный файл тестовых учётных данных удалён. Новые 13 оригинальных записей перенесены из корня в `source_assets/audio/cursed_boxes_expansion/`: байты файлов сохранены, SHA-256 проверены. Исходники других ресурсов, код и результаты прошлых проверок не удалялись.

## Все новые ресурсы и события

Пути ниже заданы относительно `assets/`. Все 13 файлов найдены, доступны и декодируются; пустых замен нет.

| Ресурс | Событие |
| --- | --- |
| `sounds/cursed_boxes/shooted_box2.wav` | Второй слой того же `impact(shotSerial)`, который запускает существующий `box_destroy_done.wav`. Повторы одного залпа не воспроизводятся. |
| `sounds/cursed_boxes/appearance.wav` | Сохранён в кэше для будущих событий; обычное появление его не выбирает. |
| `sounds/cursed_boxes/appearance2.wav` | Единственный звук видимого появления выжившего, один раз на персонажа. |
| `sounds/cursed_boxes/appearance3.wav` | Сохранён, автоматически не выбирается; оригинал совпадает с `appearance.wav`. |
| `sounds/cursed_boxes/appearance4.wav` | Сохранён, автоматически не выбирается. |
| `sounds/cursed_boxes/horror_appearance.wav` | Явный `specialReveal(eventId)` для будущего реального специального события. Не играет автоматически. |
| `sounds/cursed_boxes/horror_appearance2.wav` | Второй специальный вариант, чередуется с первым. |
| `sounds/cages/gate_closes.wav` | `CageAnimator.IMPACT_AT`: существующая решётка достигла закрытого положения. Не открытие и не отдельная вставка ключа. |
| `sounds/cages/chain_cage.wav` | Сохранённый оригинал первой цепи. Для воспроизведения используется mono-копия ниже. |
| `sounds/cages/chain_cage2.wav` | Сохранённый оригинал второй цепи. Для воспроизведения используется mono-копия ниже. |
| `sounds/environment/creepy_basement.mp3` | Один `Music`, зацикленный в активном лобби клеток и комнате Cursed Boxes. |
| `sounds/ui/hover_button.wav` | Вход мыши в область доступной Scene2D-кнопки, включая её дочерние элементы. |
| `sounds/ui/button_press.mp3` | Принятое отпускание мыши/касания внутри доступной кнопки, перед исходным действием. |

Фактические playback-пути цепей: `sounds/cages/runtime/chain_cage.wav` и `sounds/cages/runtime/chain_cage2.wav`. Это offline mono PCM16-копии предоставленных stereo-записей; mono обеспечивает настоящее панорамирование OpenAL. Исходные записи не изменены. Подготовка повторяется командой:

```sh
python3 tools/assets/prepare_cursed_audio_expansion.py
```

Манифест `assets/sounds/cursed_boxes/expansion_manifest.json` содержит исходные пути, пути копий и SHA-256.

## Сохранение существующего звука

Все восемь прежних Cue, их ассеты и игровые маркеры сохранены: выстрел, механизм, гильза, дерево, сердцебиение, начало/конец раскрытия и вставка патрона. Старые звуки интерфейса/Impostor не удалены. Новый общий MASTER лишь умножает существующие локальные уровни; при значении 1 их поведение сохраняется.

Старое дерево остаётся основным слоем: `wood=.85`, дополнительный слой `newWood=.75`, общий `destructionHeadroom=.60`. Сумма коэффициентов дерева — .96 до остальных регуляторов. Если новый слой отсутствует, исходное дерево играет без дополнительного ослабления.

Для нового слоя воспроизводится `sounds/cursed_boxes/runtime/shooted_box2.wav`: offline-копия оригинала с удалением начальной тишины (оставлено 5 мс до первой значимой выборки) и мягким ограничением пиков до .95 при drive=4. Это поднимает тихие детали примерно на 7.5 дБ RMS без изменения оригинала. Исходная запись имела примерно в четыре раза меньший RMS, чем основной звук дерева; с прежними коэффициентами новый слой был слабее основного примерно на 14 дБ. Теперь разница уровней слоёв около 5 дБ. Параметры и измерения записаны в `assets/sounds/cursed_boxes/expansion_manifest.json`.

## Синхронизация и микс

- `CursedBoxesSoundManager.reveal()` проверяет реальную прозрачность персонажа и панели. На первой видимой фазе запускает только `appearance2.wav`; сетевые повторы и позднее восстановление не повторяют историческое аудио. Звуки устранения и разрушения не запускают appearance.
- Случайный выбор appearance отключён по запросу. Старый `reveal_done.wav` сохранён как ресурс, но не накладывается на survivor reveal; мистический звук подготовки остаётся на своём событии.
- Horror-файлы загружены, но подходящего специального игрового события сейчас нет. Добавлен явный дедуплицируемый hook, без выдуманного события.
- У каждой из восьми клеток своя история угла, скорости и cooldown. Звук связан с фактическим `getRotation()` после существующей анимации: начало движения, сильное изменение направления, успокоение. На неподвижной клетке цепь не запускается. Reduced motion не вызывает фиктивного движения.
- Цепи чередуются, громкость зависит от интенсивности, pan — от горизонтального положения клетки. Не более двух одновременных цепей. 15-секундные источники используются как короткие ряби с хвостом до 1.1 с и плавным затуханием .25 с.
- UI hover `.35`, press `.55`, gate `.75`, chain `.55`, ambience `.20`; cooldown hover .085 с, press .025 с. Scene2D touch-focus наблюдается без замены существующих обработчиков и без задержки действия.
- `AudioMix.GLOBAL`: MASTER, UI, ENVIRONMENT, CAGES, BOX_DESTRUCTION, CHARACTER_REVEAL. В текущем SettingsScreen нет аудиорегуляторов; новые коэффициенты доступны в коде, новая отдельная панель настроек не добавлялась. Существующие локальные mute/volume экрана Impostor также управляют новым UI feedback на нём.
- Атмосфера плавно входит/выходит за .65 с, приглушается до 48% на важных событиях и восстанавливается. Одна Music сохраняет позицию, не создаётся и не перезапускается на каждом кадре. Music pause/resume/loop/dispose отделены от коротких Sound.

## Изменённые Java-файлы

Производственный код:

1. `core/src/main/java/com/erni/finalanswer/FinalAnswerGame.java` — владелец общего кеша, жизненный цикл и подключение к Stage.
2. `core/src/main/java/com/erni/finalanswer/audio/PresentationAudio.java` — существующие уровни умножаются на общий MASTER.
3. `core/src/main/java/com/erni/finalanswer/cursedboxes/CursedBoxesAssets.java` — семь дополнительных ступеней предварительной загрузки.
4. `core/src/main/java/com/erni/finalanswer/cursedboxes/CursedBoxesSoundManager.java` — слоёное дерево, appearance/horror, уровни и маркеры раскрытия.
5. `core/src/main/java/com/erni/finalanswer/screens/CageLobbyScreen.java` — подключение звука к существующим клеткам и остановка при выходе.
6. `core/src/main/java/com/erni/finalanswer/ui/lobby/cages/CageLobby.java` — реальные события закрытия и наблюдение движения восьми клеток.
7. `core/src/main/java/com/erni/finalanswer/ui/lobby/cages/HangingCage.java` — обновлён комментарий существующих audio hooks; анимация не изменялась.

Новые классы:

8. `core/src/main/java/com/erni/finalanswer/audio/AudioMix.java` — общие категории и плавное приглушение атмосферы.
9. `core/src/main/java/com/erni/finalanswer/audio/GameAudio.java` — один прикладной кеш UI/клеток/атмосферы, ограниченные голоса, жизненный цикл.
10. `core/src/main/java/com/erni/finalanswer/audio/UiAudioCapture.java` — общий наблюдатель существующего Scene2D-ввода.

Проверки:

11. `core/src/test/java/com/erni/finalanswer/cursedboxes/CursedBoxesSoundCheck.java` — обновлённая проверка 15 Cue, дерева и вариаций.
12. `core/src/test/java/com/erni/finalanswer/audio/GameAudioCheck.java` — новый backend-independent тест кеша, микса, 8 клеток, pan, cooldown, pause/dispose.
13. `lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/CursedBoxesPhoneCheck.java` — native-счётчики, настоящий UI click/hover, loop Music.
14. `lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/CursedBoxesCharactersLauncher.java` — новая полная численность кешированных Cue.
15. `lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/CursedSurvivorRevealLauncher.java` — та же актуализация проверки загрузки.

16. `core/src/main/java/com/erni/finalanswer/impostor/ImpostorScreen.java` — только read-only getter существующего mute/volume для общего UI feedback; механика не менялась.

Также изменены `core/build.gradle` и `tools/checks/check_cursed_full_round.cjs`; добавлены offline-скрипт подготовки, этот отчёт и ресурсы.

## Воспроизводимые проверки

```sh
./gradlew :server:check :core:check :shared:check :lwjgl3:assemble --offline
./gradlew :lwjgl3:cursedBoxesFullRoundCheck --offline
KEEP_OPEN=0 PLAYWRIGHT_MODULE=/path/to/playwright CHROME_PATH=/path/to/chrome node tools/checks/check_cursed_full_round.cjs
```

Native-проверка использует настоящий сервер, четыре независимых телефонных контроллера, исходную 3D-сцену и реальное аудиоустройство. Двое отвечают неверно, двое верно, происходит попадание в Ghost и промах мимо Puppeteer; показывается только один финальный survivor. Дополнительно проверяются настоящий hover/click, пересечение границы MP3 loop, оба слоя дерева, одна appearance-вариация, отсутствие автоматического horror, решётки, цепи и отсутствие загрузки GPU-ресурсов во время кадров.

## Ограничения

- `appearance.wav` и `appearance3.wav` одинаковы; это четыре файла, но три уникальных записи. Оба файла сохранены и доступны.
- Особое horror-событие пока не существует, поэтому его hook остаётся явным, не автоматическим.
- Опциональный прежний `sounds/cursed_boxes/host_check_boxes.wav` отсутствует. Ни один из 13 новых файлов не отсутствует.
- Браузерные телефоны не получают новые аудиофайлы по сети. Запрос относится к libGDX-звуку общего экрана; сетевой протокол не менялся.

## Фактический результат проверки

- `:server:check :core:check :shared:check :lwjgl3:assemble --offline` — завершено успешно.
- Сервер: **131 тест, 0 ошибок**. Проверки аудио и остальных существующих систем core пройдены.
- Native + четыре браузерных телефона: **PASS**, 705 проверенных кадров, 10 кадров muzzle flash и 218 кадров механизма вставки патрона. Во время игровых кадров нет новых GL-компиляций, загрузок текстур или статических буферов.
- Старые Cue: SHOT=2, MECHANISM=4, SHELL_DROP=2, WOOD_BREAK=2, HEARTBEAT=1, REVEAL_START=1, REVEAL_COMPLETE=1, INSERT_ROUND=2.
- Новое дерево WOOD_EXTRA=2; одна обычная appearance, horror=0. Оба слоя запускаются на каждом из двух существующих impact-событий.
- Прикладной кеш: 5 Sound + 1 Music. Реальные Scene2D hover=1 / press=1; gate=4; chain1=12 / chain2=12, максимум два одновременных голоса цепей. Больше двух запусков цепей соответствует существующему раскачиванию при выходе клеток, не выстрелам.
- Нативная Music проверена переходом через конец настоящего MP3: остаётся playing, позиция оборачивается к началу. Это проверка работы loop, не измерение акустической бесшовности записи.
- После прогона приложение и сервер закрыты, порт освобождён: `cleanup.json` содержит `passed=true`, `portReleased=true`. Временные тесты не оставлены работающими.
- Результат: `lwjgl3/build/cursed-full-round/full-round-report.json`; логи сборок не содержат ошибок компиляции. Остаются прежние предупреждения deprecated API и предупреждение об отсутствующей необязательной записи ведущего.

Сеть, выбор игроков/коробок, правила выживания, камера, модели, анимации и визуальные эффекты этим изменением не менялись.

## Проверка appearance2 и слышимости дерева

Повторная проверка подтвердила прежний вызов второго слоя на событии impact; причина слабой слышимости — разница уровней записей. Оригинал `shooted_box2.wav` и его исходник в `source_assets` совпадают побайтно (SHA-256 `767f6f975e2eb8a47975110af3e3c7e6bd931ac001298ebc2a2feb8b3ea22a49`). У обработанной копии сохранены частота и каналы, пик .95, RMS .1198 вместо .0503 у исходной записи. Обработка выполняется до игры, не при выстреле.

Звуковой regression-тест проверяет appearance2 для каждого из 20 последовательных раскрытий, отсутствие остальных appearance и старого финального слоя, один запуск обоих слоёв дерева на залп и запас по сумме коэффициентов. Полная сетевая проверка дополнительно проверяет `APPEARANCE_2=1`, `REVEAL_COMPLETE=0` и `WOOD_BREAK=WOOD_EXTRA=2`.
