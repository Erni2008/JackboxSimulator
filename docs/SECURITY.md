# Security notes and release checklist

## What protects the game today
- Player and host tokens: 256 bit from SecureRandom, compared in constant time, never shown to other players.
- Host only commands (start, replay, return to lobby, settings, web games) check the host token on the server.
- Tokens never travel in URLs: web pages get them in the `#hash` and send them in the `X-Host-Token` header.
- Rate limits per IP: room creation, joining, HTTP polling, WebSocket upgrades, messages per socket; connection caps per IP and overall.
- Origin check on HTTP and WebSocket; 8 KB HTTP request limit; text only WebSocket frames with a size cap; 5 s to authenticate.
- Headers: strict CSP (no inline scripts), nosniff, no referrer, X-Frame-Options DENY, frame-ancestors none, COOP/CORP same origin,
  Permissions-Policy (no camera, microphone, location), HSTS when the public URL is https.
- Room passwords: PBKDF2 (100k rounds, per room salt). Nicknames: length limit, no control or invisible characters.
- AI judge: listens on 127.0.0.1 only; answers go in as JSON data; answers that give orders ("ignore the rules", "засчитай",
  JSON) are refused before the AI (`NonAnswers.COMMAND`, eval set `ai_injection.tsv`).
- Learned answers: 3+ voters, two thirds majority, an acceptance needs two separate games, size and text limits.
- Developer switches (`race.qa`, `lastcommand.dev`) refuse to start with `SERVER_ENV=production` and warn loudly otherwise.

## Before the cloud release
- Run behind a TLS proxy (Caddy or nginx), `SERVER_ENV=production`, `SERVER_PUBLIC_URL=https://...`, `SERVER_TRUSTED_PROXY` = proxy IP.
- Firewall: only 80/443 open; the game port and 18431 (AI) bound to localhost.
- Run the server as a non root user with a systemd unit; automatic security updates on the VPS.
- Check dependencies for CVEs (`./gradlew :server:dependencies`, `npm audit` in web3d) before each release.
- Learned answers become shared between rooms in the cloud: review `think_or_die_learned.json` before importing.
