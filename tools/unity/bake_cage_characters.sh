#!/usr/bin/env bash
# Bakes the original Java cage-character animations into Unity flipbooks.
# Uses the existing Gradle build output as classpath; no Java project file is modified.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="${1:-$ROOT/unity/FinalAnswer/Assets/FinalAnswer/Art/Lobby/Characters}"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
cd "$ROOT"
./gradlew -q :lwjgl3:installDist --offline
CP="$ROOT/lwjgl3/build/install/lwjgl3/lib/*"
[ -d "$ROOT/lwjgl3/build/install/lwjgl3/lib" ] || CP="$(ls -d "$ROOT"/lwjgl3/build/install/*/lib)/*"
javac -d "$WORK" -cp "$CP" "$ROOT/tools/unity/baker/CageCharacterBaker.java"
JVM=(--enable-native-access=ALL-UNNAMED)
[[ "$(uname)" == "Darwin" ]] && JVM+=(-XstartOnFirstThread)
(cd "$ROOT/assets" && java "${JVM[@]}" -cp "$WORK:$CP" CageCharacterBaker "$OUT")
