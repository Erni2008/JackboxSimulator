# THE LAST COMMAND: рабочий локальный браузерный пилот

Дата: 25 октября 2026. Этот отчёт описывает первоначальный пилот; последующая итерация — `THE_LAST_COMMAND_POLISH.md` (новый mobile LOD, интерфейс, camera focus и третий тестовый сценарий). Запуск и управление: [THE_LAST_COMMAND_DEV.md](../THE_LAST_COMMAND_DEV.md).

## Что реализовано

- `./THE_LAST_COMMAND_DEV`: npm build/watch + существующий Java/Javalin-сервер на одном порту, readiness check, автоматическое открытие браузера, прямой DEV-запуск. Проверка занятого порта и корректное завершение дочерних процессов по Ctrl+C. Отдельный Vite/WebSocket/Node game server не создавался.
- Three.js 0.186.1 / WebGL2, GLTFLoader, OrbitControls; общий TS runtime и отдельный модуль игры. Общий `InteractiveSceneModule` задаёт load/state/update/input/dispose lifecycle. Существующая Java/libGDX-версия сохранена.
- Все десять существующих runtime GLB: корпус, cap/base, adjuster, light, обе части рычага, рамка/дверца люка, code display. Модели загружаются один раз на активный модуль, максимум две одновременно при декодировании. Кнопки используют общую геометрию/карты и независимые материалы.
- Параметры сборки берутся из прежних assembly/panel/mechanisms JSON. Pivots рычага и петли люка сохранены. Канонический placementId выбирает сервер из seed; JS не воспроизводит Java PRNG. Основной CRT показывает условия, отдельная GLB-панель кода остаётся над ним.
- Нативный GLSL-слой старения переиспользован из исходного weathering.glsl в браузерных материалах, без новых карт. Цвета маленьких кнопок и линзы изменяются по маске; металлический корпус индикатора не перекрашивается целиком. PBR-карты и исходные normal maps сохранены.
- Для отсутствующих животных/символов/сигнального блока созданы только закреплённые 2D CanvasTexture-поверхности на задней панели. После осмотра они сужены, чтобы труба не перекрывала выбор. Есть изображения-глифы и устойчивые текстовые ID. Новых GLB/копий GLB не создавалось.
- Mouse/touch ray picking с окклюзией ближайшей поверхностью. Drag/pinch отделены от tap; удержание кнопки начинается после неподвижной паузы, release/cancel/blur отпускают её. Сохраняются локальные оси, press 0,1 / release 0,15 с, lever 0,28 с, hatch 0,5 с, плавный dial и прокрутка цифр.
- Серверные явно тестовые сценарии mechanisms/memory: seed-based цели, условия, progress/feedback, ошибки, таймер, победа/поражение, результат, новый раунд. Это не утверждённый окончательный набор двадцати задач. Ответы проверяет Java, TS не содержит независимых правил победы.
- Прежняя JSON envelope и `/ws`, прежние AUTH/room/session/revision/dedup/held ownership. Аддитивно введены panel selections и TEST_ROUND внутри LAST_COMMAND_ACTION. Обычный START_LAST_COMMAND сохраняет требование ведущего и двух онлайн-гостей. DEV-сессия имеет явное отдельное разрешение одиночного старта/подключения во время раунда; production join не ослаблен.
- Сессия панели общая, как в существующем LastCommandSession. Это совместный тест, а не самовольно введённые индивидуальные задания. Камера/качество локальны. Ведущий в обычных комнатах по-прежнему отдельно от 2–8 гостей.

## Производительность

LOW 30 FPS/DPR≤1/no shadows; MEDIUM 60 cap/DPR≤1,4/no shadows; HIGH 60 cap/DPR≤2/one cached 1024² shadow map. Автокалибровка — ограниченный render+completion probe; начинает с low-ресурсов и повышает только render profile при достаточном измеренном запасе. HIGH только вручную. Предусмотрено понижение при устойчивом плохом p95.

Дополнительно: остановка GPU-кадров в idle/background, кэш теней при вращении камеры, frustum culling и отсечение обратных дисплеев, обновление canvas только при изменении/анимации, отсутствие динамических point lights для сигнальных ламп. При HIGH→LOW карты теней действительно освобождаются.

Короткий замер: Chromium headless, ANGLE Metal / Apple M4, viewport 1400×1000, DPR1, фактический backbuffer сцены 1070×935, по пять секунд вращения на профиль, один seed/камера. Это smoke benchmark с лимитами, не тест максимальной пропускной способности или нагрева.

| Профиль | FPS | Средний кадр | Draw calls, контрольный кадр | Треугольники, контрольный кадр | Загрузка 10 моделей |
|---|---:|---:|---:|---:|---:|
| LOW | 30,0 | 33,33 мс | 23 | 654 830 | 0,61 с |
| MEDIUM | 60,0 | 16,67 мс | 23 | 682 824 | 0,93 с |
| HIGH | 60,0 | 16,67 мс | 23 | 770 338 | 1,83 с |

До кэширования теней/отсечения дисплеев HIGH: 43 calls, 1 540 670 triangles; после: 23 / 770 338 в сравнимом контрольном кадре вращения. FPS до/после одинаково ограничен 60; запас мощности и температура не измерены. Во время движения механизма shadow pass снова выполняется, поэтому 23 calls не обещаются для каждой анимации/ракурса.

Idle check: 0 новых GPU-render кадров за 0,7 с после завершения анимаций. Сеть продолжала работать.

JS heap в коротком замере: около 76/125/261 MiB для LOW/MEDIUM/HIGH; это измерение Chromium heap, не GPU memory и не чистая память модели. Консервативный расчёт текстур по image/sampler и RGBA8+mips: 69,6/201,6/549,6 MiB; буферов геометрии — около 18,5/19,1/21,0 MiB. Оценка исключает окружение/тени/драйвер и не равна VRAM. GPU time/реальная VRAM недоступны. Эти цифры подтверждают, почему HIGH нельзя автоматически назначать телефону.

Сырые измерения: `generated/last-command-browser/performance.json`, исходное сравнение `before-render-optimization.json`. Измерения местного диска/localhost не прогнозируют загрузку по Wi-Fi или FPS слабого Android.

## Проверки

- Gradle: server build/tests, core/shared verification, desktop compile; browser esbuild bundle.
- Server: 159 JUnit tests, 0 failures/errors, включая deterministic round, win/loss/restart, early memory input, permissions/dedup и production isolation.
- Реальный HTTP + WS, десять GLB, два DEV-клиента, обычный host+2 guests; состояния синхронизированы.
- Оба тестовых сценария доведены до WON. Проверены LOST и restart, code wrap/arrow input, reconnect, восстановление autostart при устаревшем токене, press/release, отсутствие press при orbit, ray picking красного cap и доступность задней панели.
- Touch события Chromium на настоящей 3D-кнопке и стрелке кода. Это эмуляция ввода, не физический Android/iPhone.
- LOW→MEDIUM→HIGH→LOW: десять источников в каждом профиле; счётчики GPU texture/geometry возвращаются к исходным после LOW. В контрольном фронтальном ракурсе с ленивыми canvas uploads: 35→35→37→35 textures, 18 geometries. После посещения задней стороны загружаются остальные canvas, поэтому абсолютные значения зависят от осмотренных сторон.
- Неверная WS-команда отклонена и показана в UI; следующая корректная команда проходит. Неизвестный GLB URL — 404. Production запуск не выдаёт DEV endpoints/GLB и не ослабляет свой CSP.
- Проверен отдельный запуск на 8081: health 200, Ctrl+C завершил сервер и watcher, порт освободился. Занятый порт отклоняется без завершения чужого процесса.
- SHA-256: 10 исходных и 30 runtime GLB совпадают с прежним optimization.json.

Автотесты: `tools/checks/check_last_command_3d.cjs`, `check_last_command_3d_controls.cjs`, `benchmark_last_command_3d.cjs`. JSON и скриншоты: `generated/last-command-browser/`.

## Изменённые и новые файлы

- `.gitignore`, `THE_LAST_COMMAND_DEV`, `THE_LAST_COMMAND_DEV.md`.
- `tools/dev/run-last-command.py` и три браузерных проверки выше.
- `web3d/package.json`, `package-lock.json`; `src/main.ts`, `src/runtime/{network,assets,view,module}.ts`, `src/games/last-command/machine.ts`.
- `web/last-command-3d/{index.html,style.css}`; app.js/map генерируются и не хранятся в Git.
- `server/build.gradle`, `RoomServer.java`, `LastCommandDevRoutes.java`.
- `server/.../rooms/{RoomService,LastCommandSession,LastCommandTestRound}.java`.
- `server/.../LastCommandDevIsolationTest.java`, `server/.../rooms/LastCommandTestRoundTest.java`.
- Этот отчёт и generated/last-command-browser/*.

Точка отката до реализации: `69d86c4`. Другие мини-игры и их web UI не переписывались; core/shared regression suite сохранена.

## Оставшиеся проверки и ограничения

1. Настоящие Android/iPhone/Safari не тестировались. Нужны touch/pinch, системное аудио/фон, WebGL restore и 15–20 минут на нагрев/память. Chrome mobile viewport не является их заменой.
2. LOW всё ещё достаточно тяжёлый (около 633 тыс. уникальных исходных треугольников). Дальнейший мобильный LOD/texture bake нужен по результатам физического теста. Стабильные 30 FPS на слабых Android не гарантируются.
3. Панели животных/символов/сигналов имеют рабочие 2D-поверхности; финальная художественная модель/атлас для них отсутствует. Эмодзи зависят от системного шрифта, ID и подписи неизменны.
4. Полная визуальная приёмка всех ракурсов и обеих точек люка на Safari/телефонах остаётся ручной. Осмотрены front/rear и выполнен ray-test задней панели; идеальная посадка всех узлов не заявляется.
5. DEV routes рассчитаны на доверенную локальную сеть. Публичный deployment, браузерное основное меню всех игр и перенос остальных игр в 3D в эту итерацию не входят.
6. WebGL context loss показывает причину и предлагает восстановление страницы; повторная загрузка восстанавливает серверную сессию. Полный бесшовный context rebuild на настоящем Safari ещё не проверен.
7. Java-сервер хранит раунды в памяти: его остановка завершает локальные сессии. Reload страницы сохраняет игру, restart сервера — нет. При прямом autostart устаревшая DEV-сессия автоматически заменяется новой; на ручной странице UI предлагает сменить комнату.

Официальная документация: [Three GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html), [OrbitControls](https://threejs.org/docs/pages/OrbitControls.html), [WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html).
