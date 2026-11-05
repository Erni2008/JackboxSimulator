#!/bin/sh
# Copies the generated elevator_* host lines (narration.py generate --kind events) into the elevator page as AAC.
# Usage (repo root): sh tools/host-tts/scripts/export_elevator_voice.sh
set -e; SRC=assets/audio/host/ru/events; DST=web/broken-elevator-manual/voice; mkdir -p "$DST"
for f in "$SRC"/elevator_*.ogg; do [ -e "$f" ] || continue; id=$(basename "$f" .ogg); id=${id#elevator_}; id=${id%_*}
  ffmpeg -loglevel error -y -i "$f" -c:a aac -b:a 64k -ac 1 "$DST/$id.m4a"; echo "$id"; done
