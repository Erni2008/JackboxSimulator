# Multiplayer Final Answer

Требуется JDK 21. Сервер — отдельный Java-процесс, Javalin 7.2.3 / Jetty WebSocket,
JSON через Gson. Он не зависит от LibGDX. Один порт раздаёт сайт, HTTP API и `/ws`.

## Быстрый запуск

Из корня проекта, первый терминал:

```sh
./gradlew :server:run
```

Второй терминал:

```sh
./gradlew :lwjgl3:run
```

В игре: CREATE ROOM → настройки → CREATE → GENERATE → OK.
Сервер назначает шестизначный код; ведущий не занимает место игрока.
Открой `http://localhost:8080/` в двух отдельных вкладках, введи код и разные имена.
В каждой вкладке своя сессия (sessionStorage). Затем нажми PLAY у ведущего.
Для старта достаточно одного подключённого игрока, лимит комнаты 2–8 игроков.

После анимаций вопроса и четырёх ответов сервер запускает 20 секунд.
На телефоне выбери ответ один раз. После закрытия/падения часов хост подтверждает
раскрытие: телефоны получают результат, ведущий показывает правильный вариант.
После анимации и выдержки 2,5 секунды сервер выдаёт следующий вопрос.
По умолчанию 5 вопросов, HTTP `questionCount` позволяет 1–12.
SPACE/R/P работают только в локальном `./gradlew :lwjgl3:playPreview`.
В сетевой игре ходом управляет сервер; ESC возвращает ведущего в меню, не закрывая комнату.
Если ведущий надолго прекращает показ/отключается, сессия завершается по timeout.

## Телефон в Wi-Fi

Компьютер и телефон подключи к одной сети. На macOS узнай адрес:

```sh
ipconfig getifaddr en0
```

Если вывода нет, посмотри IP активного интерфейса в системных настройках сети.
Открой на телефоне `http://IP-КОМПЬЮТЕРА:8080/` — **не localhost**.
Разреши входящие соединения Java в firewall; гостевая Wi-Fi сеть может блокировать
связь устройств. Для другого компьютера ведущего:

```sh
./gradlew :lwjgl3:run -ProomServerUrl=http://IP-СЕРВЕРА:8080
```

При refresh/возвращении в браузер токен восстанавливает того же игрока и принятый
ответ. Дублированная вкладка может получить тот же sessionStorage: новое соединение
заменяет старое. Для независимых участников открывай новые вкладки и входи отдельно.

## Конфигурация

| Java property | Environment | Default |
|---|---|---|
| server.host | SERVER_HOST | 0.0.0.0 |
| server.port | SERVER_PORT | 8080 |
| server.publicUrl | SERVER_PUBLIC_URL | пусто |
| server.allowedOrigins | SERVER_ALLOWED_ORIGINS | same-origin |
| server.trustedProxy | SERVER_TRUSTED_PROXY | пусто |
| server.maxRooms | SERVER_MAX_ROOMS | 1000 |
| server.environment | SERVER_ENV | development |

AllowedOrigins — список точных origins через запятую; publicUrl также разрешён.
Сайт и WebSocket размещай на одном origin. Произвольный cross-origin HTTP API не включён.
Без Origin допускается нативный клиент, но права всё равно проверяются по токену.
Forwarded IP доверяется только точному адресу SERVER_TRUSTED_PROXY.
Хост: `-ProomServerUrl=...` либо `FINALANSWER_SERVER_URL` (Gradle property приоритетнее).
Production требует HTTPS publicUrl. TLS завершается на reverse proxy.

## Интернет / Linux VPS

Нужны реальный домен, VPS с JDK 21 и установленный Caddy. Публичный адрес сам по
себе после локального запуска не появляется. Здесь нет выдуманного deployment.

1. Направь DNS A/AAAA домена на VPS. Открой наружу только 80/443 и свой защищённый SSH.
2. Собери `./gradlew :server:installDist`. Скопируй **содержимое**
   `server/build/install/server/` в `/opt/finalanswer/` на VPS.
3. Создай системного пользователя `finalanswer` без интерактивного входа.
4. Создай `/etc/finalanswer/server.env` из [production.env.example](../deploy/production.env.example),
   замени домен. Дай чтение только root/сервисной группе. Backend слушает 127.0.0.1:8080.
5. Установи [systemd unit](../deploy/finalanswer.service) в
   `/etc/systemd/system/finalanswer.service`, затем `sudo systemctl daemon-reload`
   и `sudo systemctl enable --now finalanswer`.
6. Замени домен в [Caddyfile](../deploy/Caddyfile.example), установи его в `/etc/caddy/Caddyfile`,
   проверь `sudo caddy validate --config /etc/caddy/Caddyfile` и перезагрузи Caddy.
   Он обслуживает HTTPS и проксирует WebSocket upgrade автоматически.
7. Проверь `https://ТВОЙ-ДОМЕН/health`, сайт на телефоне и запусти ведущего:
   `./gradlew :lwjgl3:run -ProomServerUrl=https://ТВОЙ-ДОМЕН`.

При остановке процесс закрывает комнаты/сокеты и HTTP-сервер. Состояние хранится
**в памяти одного процесса**: перезапуск теряет комнаты. Несколько экземпляров за
балансировщиком пока не поддерживаются. Нужны отдельные persistence и маршрутизация
комнат прежде чем масштабировать горизонтально. Это рабочий срез викторины,
специальные механики пяти режимов и мини-игры пока не реализованы.

## Проверки и ограничения проверки

```sh
./gradlew :server:test :lwjgl3:classes :server:installDist
./gradlew :lwjgl3:playCheck -PplayCapture=true
python3 scripts/check_room_api.py http://127.0.0.1:8080
```

`RoomServiceTest`: бизнес-правила, фальшивые часы, роли, пароли, reconnect,
конкурентные ответы, дедлайн, 12 вопросов. `TransportTest`: настоящий HTTP/WebSocket
на случайном локальном порту, два игрока и ведущий; время управляется тестом.

Для проверки реального LibGDX с браузерами: запусти сервер, затем
`./gradlew :lwjgl3:multiplayerCheck`. Он напечатает код. Подключи два браузера;
тест сам запускает PLAY и завершается после двух результатов/начала третьего вопроса.
Снимки ведущего сохраняются в `/tmp/multiplayer-*.png`.

Проверены два Safari-клиента с реальным LibGDX, отправка ответа, результат,
следующие вопросы и refresh. Физические iPhone/Android и удалённый HTTPS deployment
в этой среде не проверялись. Нагрузочное тестирование ещё требуется.

Протокол, сроки и точки расширения: [MULTIPLAYER_PROTOCOL.md](../docs/MULTIPLAYER_PROTOCOL.md).
