# Final Answer — Stage 10: standalone desktop hosting and packaging

## Architecture and scope

The existing Java 21/libGDX lwjgl3 launcher, asynchronous RoomApiClient, RoomServer/Javalin HTTP and WebSocket service, static classpath web resources, host ownership, room-code protocol and Stage 9 controller were inspected before changes. RoomServer is reused unchanged: no second server, room registry, voting system, cross-origin relaxation or admin HTTP endpoint was added.

Desktop launcher now injects HostingAccess into FinalAnswerGame/RoomApiClient. By default LocalServerManager starts exactly one embedded RoomServer **when the first room is created**, not every time a screen opens. Startup/readiness runs on a background executor; RoomApiClient sends CREATE only after `/health` succeeds and returns callbacks to the libGDX thread. A shared startup future prevents duplicate starts, and a running owned server is reused. Occupied ports fail with a readable message; unrelated listeners are never adopted or terminated. Failure/retry, explicit close during startup and an idempotent shutdown hook are covered by checks.

An explicit `finalanswer.server` / `FINALANSWER_SERVER_URL` selects external mode. The manager probes availability and never closes the external service. `finalanswer.hosting=local|external` can explicitly choose the mode. Local API traffic uses loopback internally, but phone URLs never advertise wildcard/loopback addresses.

Owned local server binds one existing HTTP/WebSocket port on `0.0.0.0` (default 8080). It preserves same-origin checks, credentials, role personalization, voting validation, results, replay and in-memory cleanup. There is no router configuration, firewall modification or privilege escalation. This is LAN hosting, not an internet hosting/tunnelling service.

## Standalone launch

The tested Apple Silicon build is:

```
lwjgl3/build/standalone-release/mac-aarch64/FinalAnswer.app
```

Distribution archive:

```
generated/distributions/FinalAnswer-mac-apple-silicon-stage10.zip
```

Extract the ZIP and open FinalAnswer.app normally. No Gradle command or separate Java installation is required. The complete bundle must stay intact. Create a room through the existing CREATE ROOM → CREATE → GENERATE → OK flow. Room creation starts the owned server and waits for readiness. The existing lobby gains the QR/address panel; other screens and artwork were not redesigned.

On Windows, the prepared packaging task produces a folder containing FinalAnswer.exe, app libraries and runtime. Distribute **the entire folder**, not the EXE alone. That output has not been built/tested here.

## Development launch and configuration

```sh
# One process; automatic local hosting on room creation
./gradlew :lwjgl3:run

# A different owned local port
./gradlew :lwjgl3:run -PlocalServerPort=18091

# Explicit external service: no owned embedded server
./gradlew :lwjgl3:run -ProomServerUrl=https://your-server.example

# Existing dedicated server remains supported for external/deployment workflows
./gradlew :server:run
./gradlew :lwjgl3:run -ProomServerUrl=http://127.0.0.1:8080
```

Native launchers also accept JVM properties via the JVM configuration / JAVA_TOOL_OPTIONS:

- `finalanswer.hosting=local|external`
- `finalanswer.server=http(s)://host:port` (or environment FINALANSWER_SERVER_URL)
- `finalanswer.localPort=8080`; port 0 is supported for isolated tests and advertises the actual bound port.
- `finalanswer.dataDir=...` overrides writable data location for diagnostics/tests.
- `finalanswer.logToFile=true` is the packaged default.

If the port is already occupied, choose another port or close the other application yourself. Final Answer does not assume an existing process on 8080 belongs to it. There is no silent port switching.

## Phone connection, QR and diagnostics

LanDiscovery enumerates active interfaces instead of assuming en0. It excludes loopback, wildcard, link-local/multicast, point-to-point and known virtual/VPN interfaces, prefers private IPv4 addresses, and retains multiple candidates. NETWORK / REFRESH in the lobby cycles available candidates and refreshes discovery. Address changes update the displayed URL/QR; the server binds the same port. Refresh/discovery/health monitoring run off the render thread. Interface/port/status and same-network/firewall guidance are shown compactly beside the QR.

The QR is locally generated using [ZXing 3.5.4](https://github.com/zxing/zxing/releases), with a four-module white quiet zone, medium error correction, square aspect and nearest texture filtering. It contains only:

```
http://ACTUAL_LAN_IPV4:ACTUAL_PORT/?room=PUBLIC_ROOM_CODE
```

No token, participant identity, password, word or role is included. Scanning opens the unchanged Stage 9 join workflow with the public code prefilled. The player still enters nickname and any required password; all validation is retained. Manual URL + code entry remains available. No external QR service or third-party upload is used.

Phones and host must share an accessible network. Guest Wi-Fi/client isolation, VPN routes and firewalls can prevent connections even when local health is successful. Select the correct interface, check that the phone is not using mobile data, and allow incoming connections for Final Answer through the OS's normal firewall UI if needed. No physical phone scan or firewall-change test was performed; successful local health is not proof of remote-device reachability.

## Lifecycle and persistence

Health is checked every five seconds after startup, with request timeouts. Unexpected unavailability is reported and owned resources are closed; another room-creation attempt can start a new server. Existing phone reconnect/session policies are reused. Exiting closes the realtime client, outstanding HTTP operations, owned server, scheduler and HTTP client, releasing the port. A JVM shutdown hook handles ordinary termination signals; an OS process kill also releases sockets, but no application can promise graceful callbacks after a hard kill.

All room/match state remains in memory. Full owned-server/application restart loses rooms and credentials. Old codes cannot be used against a newly started registry; tests confirm 404 after restart. No persistence or host migration was invented. External rooms remain governed by their existing server disconnection/expiry policy; this client never shuts that server down.

## Writable data and resources

Bundled textures, fonts, native libraries, browser controller/image-button assets and server web files are loaded from application jars/classpath; the source checkout is unnecessary. Thin application/dependency jars preserve Jetty/Javalin ServiceLoader metadata, avoiding fat-jar duplicate-service loss. The server static route remains the existing public classpath web allowlist, never an arbitrary filesystem mount.

Writable data is separated from bundled assets:

- macOS: `~/Library/Application Support/FinalAnswer/`
- Windows: `%LOCALAPPDATA%/FinalAnswer/` (user AppData/Local fallback)
- Linux: `$XDG_DATA_HOME/FinalAnswer/` or `~/.local/share/FinalAnswer/`

Preferences live under preferences/. Packaged technical logs go to logs/desktop.log with a bounded previous-log rotation. Error labels stay readable rather than showing Java stack traces. Development console logs remain available. All test/self-check outputs in this session were explicitly directed inside the project.

## Packaging tasks

[Java 21 jpackage app-image](https://docs.oracle.com/en/java/javase/21/jpackage/packaging-overview.html) is the canonical native application-image path. Existing Construo cross-target archive tasks remain available and their runtime module list includes networking/server dependencies; those archives were not validated in this stage. New packageMac/Windows/Linux tasks produce directly launchable native app images, rather than duplicating the older ZIP archive output.

Use a **full JDK 21 with jpackage** on the target OS and desired CPU architecture:

```sh
# Apple Silicon macOS + ARM64 JDK 21
./gradlew :lwjgl3:packageMac

# Intel macOS + x64 JDK 21, on an appropriate Intel build environment
./gradlew :lwjgl3:packageMac

# Windows 10/11 + x64 JDK 21 (PowerShell/cmd)
.\gradlew.bat :lwjgl3:packageWindows

# Linux + matching JDK 21
./gradlew :lwjgl3:packageLinux
```

Default output: `lwjgl3/build/standalone/<os>-<JVM-architecture>/`. The task refuses to overwrite an existing app image. Move previous output aside or select a fresh output path:

```sh
./gradlew :lwjgl3:packageMac -PpackageOutput=build/standalone-release/mac-aarch64
```

The build above was actually executed. `packageOutput` is relative to lwjgl3 when relative. `-PpackageVersion=1.0.0` overrides native bundle version; default is 1.0.0 because macOS jpackage rejects a zero-leading version. Project version remains 0.1.0. Target-OS guards refuse a Windows/Linux package request on macOS rather than claiming a cross build. The current ARM64 runtime is not universal or Intel-compatible by implication. The prepared Linux task retains bin/java for the existing NVIDIA StartupHelper relaunch path; that platform-specific path was not executed here.

jpackage/jlink bundle Java modules for desktop, HTTP client, logging/management, naming/SQL/XML, crypto/TLS, charset/locales and zip resources. Native libGDX/LWJGL libraries are included as dependencies. Current bundle is about 404 MB; runtime about 122 MB; ZIP about 316 MB. No installed system Java was used by its native launcher: self-check reports java.home inside Contents/runtime/Contents/Home.

Existing project icons in lwjgl3/icons were reused without modification. They are template rocket icons, not final branded Final Answer platform icons; a production-branded ICNS/ICO set remains pending. The game window uses the existing Final_Answer.png. The built macOS bundle is ad-hoc signed, with no Developer ID/notarization. Public distribution signing/notarization and Windows installer/signing are not delivered. OS security protections were not bypassed.

## Implemented / built / tested

| Target/feature | Implemented | Built | Tested here |
| --- | --- | --- | --- |
| Owned embedded server/readiness/cleanup | yes | yes | real Javalin + native libGDX + browsers |
| LAN discovery/choice + local QR | yes | yes | enumeration, encoded/decoded QR, native display; no physical phone |
| Apple Silicon `.app` + bundled JRE | yes | yes | native bundle launched; opt-in self-check passed from /private/tmp |
| Intel macOS packaging | prepared | no | no Intel execution |
| Windows 10/11 application image | prepared | no | only wrong-OS guard tested on macOS |
| Linux application image | prepared | no | only configuration prepared |
| Developer ID/notarization/installer | no | no | no |

The normal packaged launcher was started. Computer Use did not have access to operate FinalAnswer's native controls, so manual/native click automation is not claimed. Packaged self-check and source-level native integration use the normal room API and authenticated host socket programmatically, not private server admin endpoints. Physical devices, Safari, real Wi-Fi firewall traversal, Intel and Windows execution were not tested.

## Automated and multiplayer verification

```sh
./gradlew :lwjgl3:desktopHostingCheck
./gradlew build :lwjgl3:impostorCheck :lwjgl3:playCheck
./gradlew :lwjgl3:desktopHostingQA
PLAYWRIGHT_MODULE=/path/to/playwright CHROME_PATH=/path/to/chrome node scripts/check_desktop_hosting_browser.cjs
```

- Existing server suite: 104 tests; no failures/errors in the final report. Role/vote security, Stage 7 replay and Stage 9 configuration tests remain.
- DesktopHostingCheck: async shared startup/reuse, real readiness/room creation/controller/static assets, occupied owned/unrelated ports, never stopping external servers, unavailable external service, restart without false persistence, unexpected termination monitoring/restart, cancellation/shutdown and released ports; LAN address filtering and QR round-trip decoding at multiple sizes.
- Native checks: existing main-menu/resource, clues/stamps/results/settings/reduced-motion regressions plus QR URL correctness, stable texture count on replacement/polling and disposal. PLAY, round/clock, presentation/audio and inspector checks remain.
- Real desktop game + owned RoomServer + six independent Chromium phone controllers: four matches, 3/3/4/4 active participants with spectators, caught/escaped/no-consensus outcomes, two replays, two lobby returns, browser reload and temporary socket interruption at results, correct personal/spectator results, stable room/code/IDs, distinct match IDs, actual server timers and server cleanup on application exit. One-round, five-second settings shorten this test through the legitimate Stage 9 host settings command; production defaults are unchanged.
- QA ready metadata contains only public URL/code/address data. Test-only local-file orchestration lives on the test classpath and sends normal authenticated commands through the native host client. No test route enters the server.
- The first parallel compile/package attempt transiently replaced a class while a graphical test was running; the final checks were rerun sequentially. Earlier failures were not suppressed.

Reports/artifacts:

- `server/build/reports/tests/test/index.html`
- `lwjgl3/build/desktop-hosting-qa/report.json`, cleanup.json (four matches, six stable players, four unique match IDs, zero browser page errors, released port)
- `lwjgl3/build/desktop-hosting-qa/*.png` native screenshots
- `generated/standalone-release-check/self-check.json` and self-check-lobby.png
- `generated/distributions/FinalAnswer-mac-apple-silicon-stage10.zip`
- `lwjgl3/build/standalone-release/mac-aarch64/FinalAnswer.app`

## Packaged self-check

This is an explicit diagnostic mode, never enabled in normal play. It opens the actual native game, creates a temporary room through RoomApiClient (thereby starting the owned server), checks packaged HTTP/web/image routes, captures its lobby/QR, exits and verifies the port is released. It writes no private token to the report.

Executed from a directory outside the checkout:

```sh
cd /private/tmp
JAVA_TOOL_OPTIONS='-Dfinalanswer.selfCheck=true -Dfinalanswer.localPort=18091 -Dfinalanswer.dataDir=/ABSOLUTE/PROJECT/generated/standalone-release-check' \
  /ABSOLUTE/PROJECT/lwjgl3/build/standalone-release/mac-aarch64/FinalAnswer.app/Contents/MacOS/FinalAnswer
```

Use your actual project path in place of /ABSOLUTE/PROJECT. The resulting report recorded passed=true, portReleased=true, workingDirectory=/private/tmp and java.home inside the app's bundled runtime. The mode is testing/diagnostics, not a claim that a person clicked through native controls.

## Files

Created:

- `core/src/main/java/com/erni/finalanswer/network/HostingAccess.java`
- `core/src/main/java/com/erni/finalanswer/network/ConnectionQr.java`
- `core/src/main/java/com/erni/finalanswer/ui/lobby/ConnectionPanel.java`
- `lwjgl3/src/main/java/com/erni/finalanswer/lwjgl3/hosting/LocalServerManager.java`
- `lwjgl3/src/main/java/com/erni/finalanswer/lwjgl3/hosting/LanDiscovery.java`
- `lwjgl3/src/main/java/com/erni/finalanswer/lwjgl3/hosting/DesktopPaths.java`
- `lwjgl3/src/main/java/com/erni/finalanswer/lwjgl3/hosting/ApplicationSelfCheck.java`
- `lwjgl3/src/test/java/com/erni/finalanswer/lwjgl3/hosting/DesktopHostingCheck.java`
- `lwjgl3/src/test/java/com/erni/finalanswer/lwjgl3/hosting/DesktopHostingQA.java`
- `lwjgl3/packaging.gradle`
- `scripts/check_desktop_hosting_browser.cjs`
- `docs/IMPOSTOR_STAGE_10.md`

Modified:

- `core/build.gradle`
- `core/src/main/java/com/erni/finalanswer/FinalAnswerGame.java`
- `core/src/main/java/com/erni/finalanswer/network/RoomApiClient.java`
- `core/src/main/java/com/erni/finalanswer/ui/lobby/LobbyPanel.java`
- `lwjgl3/build.gradle`
- `lwjgl3/src/main/java/com/erni/finalanswer/lwjgl3/Lwjgl3Launcher.java`
- `lwjgl3/src/main/java/com/erni/finalanswer/lwjgl3/StartupHelper.java`
- `lwjgl3/src/test/java/com/erni/finalanswer/lwjgl3/ImpostorCheck.java`
- `web/app.js` (public-code prefill only)
- `README.md`

Existing backgrounds/buttons/fonts, Stage 9 controller styling, server state machine and game rules were preserved. Stage 5 participant outline/portrait artwork and Stage 8 audio files remain pending; packaging does not fabricate missing assets. Stage 11 was not started.
