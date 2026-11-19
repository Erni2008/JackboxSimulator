# Облачный сервер к релизу

Схема: игра у ведущего — основной экран; игроки на телефонах открывают `https://play.<ваш домен>` и вводят код комнаты. Сервер комнат и сайт для телефонов — один процесс на облачном сервере.

Пока идёт разработка, всё работает на локальном сервере внутри игры (телефоны в той же Wi‑Fi). Ничего из этого документа делать не нужно до релиза.

## Что купить

| Что | Где | Цена |
| --- | --- | --- |
| Домен | Cloudflare Registrar / Namecheap | ~10–15 $ в год |
| Сервер (VPS) Ubuntu 24.04, 2 vCPU, 2–4 GB RAM | Hetzner CX22 / DigitalOcean | ~5–8 $ в месяц |

Нагрузочный тест (`tools/dev/load_test.cjs`): 150 комнат × 7 соединений, все в Проклятом забеге — 26% одного ядра, ~580 MB памяти, ни одной ошибки. Самого маленького сервера хватит с большим запасом.

## Шаги в день запуска

1. **DNS.** У регистратора домена создать запись `A`: `play` → IP сервера.
2. **Сервер.** Подключиться по SSH и поставить Java и Caddy:
   ```sh
   sudo apt update && sudo apt install -y openjdk-21-jre-headless caddy
   sudo useradd --system --home /opt/finalanswer finalanswer
   ```
3. **Сборка сервера** (на своём компьютере): `./gradlew :server:installDist`, затем скопировать `server/build/install/server/` на сервер в `/opt/finalanswer/`.
4. **Настройки.** `deploy/production.env.example` → `/etc/finalanswer/server.env`, заменить `play.example.com` на свой домен.
5. **Служба.** `deploy/finalanswer.service` → `/etc/systemd/system/`, затем
   `sudo systemctl enable --now finalanswer`.
6. **HTTPS.** `deploy/Caddyfile.example` → `/etc/caddy/Caddyfile` со своим доменом, `sudo systemctl reload caddy` — сертификат Caddy получит и продлит сам.
7. **Проверка.** `https://play.<домен>/health` отвечает `{"status":"ok"...}`.
8. **Игра.** В `lwjgl3/src/main/resources/finalanswer-hosting.properties` вписать `server.url=https://play.<домен>` и собрать релиз. Если облако недоступно (нет интернета), игра сама переключится на свой локальный сервер — проверка: `./gradlew :lwjgl3:hostingFallbackCheck`.

## Проверка перед релизом

- `BASE=https://play.<домен> ROOMS=20 node tools/dev/load_test.cjs` — с реального сервера ограничения на создание комнат включены, для теста запускайте QA‑сервер (`./gradlew :server:raceQa`) или снизьте `ROOMS`.
- Телефон через мобильный интернет (не Wi‑Fi) заходит по адресу и коду комнаты.
- Обновление сервера: остановить службу, заменить файлы, запустить. Идущие комнаты при перезапуске закрываются — обновлять, когда никто не играет.
