# Cloud setup (Ubuntu 24.04 VPS)

1. DNS: an A record `play.<domain>` → the VPS IP.
2. As root: `bash firewall.sh` (ufw: only 22/80/443, fail2ban, automatic security updates, SSH keys only).
   Put your SSH key in place first, the script turns password login off.
3. Users: `useradd --system --home /opt/finalanswer finalanswer` and `useradd --system --home /opt/finalanswer-ai finalanswer-ai`.
4. Game: `./gradlew :server:installDist`, copy `server/build/install/server/` to `/opt/finalanswer/` (owned by root, read only for the service).
5. AI: copy llama-server and the Qwen3 4B gguf to `/opt/finalanswer-ai/` (Apache 2.0 model, MIT runtime).
6. Config: `production.env.example` → `/etc/finalanswer/server.env` (mode 600), set the real domain.
7. Services: copy `finalanswer.service` and `finalanswer-ai.service` to `/etc/systemd/system/`, then
   `systemctl daemon-reload && systemctl enable --now finalanswer-ai finalanswer`.
8. TLS: install Caddy, `Caddyfile.example` → `/etc/caddy/Caddyfile` with the domain, `systemctl reload caddy`.
9. Check: `curl https://play.<domain>/health`, `systemd-analyze security finalanswer` (should say OK or better),
   and from outside `nmap play.<domain>` must show only 22, 80, 443.
