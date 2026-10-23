# Living players and ghosts during questions

The shared question screen retains up to eight room characters, including ghosts in the trivia `participantIds`. Public server `lifeState` / `isGhost` determines ghost presentation. Both living players and ghosts can answer, play an accepted-answer animation, and receive correctness indicators. Ghosts use their original character with reduced opacity, cool tint, idle animation and a GHOST label. Living characters have an ALIVE label (OFFLINE when disconnected).

Phone question and ghost screens show a public roster with ALIVE / GHOST labels and the local player's YOU marker. It contains no answers, results, or hiding assignments. Ghosts receive the same answer controls, timer and results as living players. Server validation remains authoritative. The next Cursed Boxes roster is built only from living participants, so ghosts cannot hide or shoot.

A trusted server revival changes the next snapshot; the same character object regains living status and eligibility for elimination mini-games. No automatic revival rule is introduced.

Checks: `:core:questionPlayersCheck`, `:lwjgl3:questionPlayersRenderCheck`, `:server:test`. Native captures: `generated/question-players/life-status-{2,4,6,8}.png`. Mobile QA: `tools/checks/check_controller_presentation.cjs` against a running controller server; covers eight mixed life states, long names, portrait and landscape sizes. Assets remain local and ignored by Git.

Personal status cards appear above the question and on the result screen. The ghost card explicitly explains continued trivia/scoring participation and exclusion from elimination games. Answer receipts precede the room roster. Roster DOM nodes are retained while player identities, names, life states and the local identity are unchanged; unrelated timer/state broadcasts do not rebuild them. Controller QA covers ghost answering, ghost results, return to living presentation and retained roster nodes across refreshes (48 viewport/case combinations).
