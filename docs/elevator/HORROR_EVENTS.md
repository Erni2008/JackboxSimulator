# Elevator horror events

Config: `assets/elevator/elevator_transition.json` → `events` (probability, phases, door limits, debug.force, flashing).
Code: `ElevatorEventType`, `ElevatorEventConfig`, `ElevatorEventManager`, `ElevatorEventSequence`, `ElevatorEventContext`.

## Host voice lines (needed, not recorded)
Played through `HostVoiceManager.playLine(id)`; add them to `assets/audio/host/ru/manifest.json` → `events` as
`events/<ID>_<hash>.ogg` with status `ready`. Missing lines are skipped; the event never waits for them.

| ID | Text |
|---|---|
| ELEVATOR_WATCHING_1 | Вы ведь понимаете, что здесь не одни? |
| ELEVATOR_WATCHING_2 | Не оборачивайтесь. |
| ELEVATOR_WATCHING_3 | Интересно… кто сейчас стоит за вашей спиной? |
| ELEVATOR_WATCHING_4 | Кажется, кто-то решил прокатиться с вами. |
| ELEVATOR_HOST_1 | Надеюсь, вам понравилась поездка. Хотя она ещё не закончилась. |
| ELEVATOR_HOST_2 | Странно… обычно этот лифт поднимается гораздо быстрее. |
| ELEVATOR_HOST_3 | Не переживайте. Последние пассажиры тоже думали, что всё под контролем. |
| ELEVATOR_HOST_4 | Интересно, сколько из вас доберётся до последнего этажа? |
| ELEVATOR_HOST_5 | Кстати… вы слышали этот звук? |
| ELEVATOR_HOST_6 | Не советую прислоняться к дверям. Особенно сегодня. |

## Sound files still missing (hooks only)
`assets/elevator/sfx/dark_ambience.wav`, `host_interruption.wav`, `motor_restart.wav`.

## Debug
`./gradlew :lwjgl3:elevatorTransitionPreview` — keys 1–5 trigger an event while cruising, 0 = no events, R = random.
`-Pel.event=FALSE_ARRIVAL` (or `NONE`) forces; `-Pel.events=/abs/dir` runs the checks and per-phase captures.
In code: `elevator.triggerEvent(ElevatorEventType.EMERGENCY_STOP)`, `elevator.events().debugForce/debugProbability/debugEnabled/describe()`.
