#!/bin/sh
# Builds the current RoomServer and runs it for Unity development on its own port (default 18180), with
# THE LAST COMMAND debug commands enabled. Never touches whatever already listens on 8080.
#   tools/unity/run_dev_server.sh [port]
set -e
cd "$(dirname "$0")/../.."
PORT="${1:-${FA_DEV_PORT:-18180}}"
if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port $PORT is already in use:"; lsof -nP -iTCP:"$PORT" -sTCP:LISTEN; exit 1
fi
./gradlew -q :server:installDist
echo "Final Answer dev server → http://127.0.0.1:$PORT (Last Command debug ON)"
SERVER_OPTS="-Dlastcommand.debug=true" exec server/build/install/server/bin/server "$PORT"
