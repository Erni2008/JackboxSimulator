package com.erni.finalanswer.gameplay.elevator;

import java.util.*;

/**
 * THE HOST'S SUITCASE — mechanism IV, LASER ROUTING (fictional). A COLS×ROWS optical bed. The emitter on the left
 * wall fires east along its row. Mirrors turn between '/' (0) and '\' (1); baffles stop the beam; numbered sensors sit
 * where the beam can leave the bed (top, bottom, right). Chapter IV names the quench sensor from what is on the bed:
 * EASY — the number of baffles; NORMAL — (baffles + mirrors) mod sensors, + 1; HARD — (2·baffles + mirrors) mod sensors, + 1.
 * The generator guarantees that some mirror setting brings the beam onto the quench sensor and that the starting
 * setting does not. The server keeps the mirror states and traces the beam itself on CONFIRM.
 */
public final class LaserGrid {
    public static final int COLS = 8, ROWS = 4;
    /** exits: side 0 = top (index = column), 1 = right (row), 2 = bottom (column) */
    public record Exit(int side, int index) {}
    public final int emitterRow; public final int[][] mirrors; /** cells {c, r} */ public final int[][] baffles; public final List<Exit> sensors; public final int target; final int[] state;
    private LaserGrid(int e, int[][] m, int[][] b, List<Exit> s, int target, int[] state) { emitterRow = e; mirrors = m; baffles = b; sensors = List.copyOf(s); this.target = target; this.state = state; }
    public static int[] counts(Difficulty d) { return switch (d) { case EASY -> new int[]{3, 2, 4}; case NORMAL -> new int[]{4, 3, 5}; case HARD -> new int[]{5, 4, 6}; }; } // mirrors, baffles, sensors
    public static int quench(Difficulty d, int mirrors, int baffles, int sensors) { return switch (d) { case EASY -> baffles; case NORMAL -> (baffles + mirrors) % sensors + 1; case HARD -> (2 * baffles + mirrors) % sensors + 1; }; }

    public static LaserGrid generate(long seed, Difficulty d) {
        Random r = new Random(seed ^ 0x1A5E2L); int[] c = counts(d);
        while (true) {
            int e = r.nextInt(ROWS); Set<Integer> used = new HashSet<>(); used.add(e * COLS); // keep the emitter's first cell free
            int[][] m = new int[c[0]][], b = new int[c[1]][];
            for (int i = 0; i < c[0]; i++) { int cell; do cell = r.nextInt(COLS * ROWS); while (!used.add(cell)); m[i] = new int[]{cell % COLS, cell / COLS}; }
            for (int i = 0; i < c[1]; i++) { int cell; do cell = r.nextInt(COLS * ROWS); while (!used.add(cell)); b[i] = new int[]{cell % COLS, cell / COLS}; }
            List<Exit> exits = new ArrayList<>(); for (int i = 0; i < COLS; i++) { exits.add(new Exit(0, i)); exits.add(new Exit(2, i)); } for (int i = 0; i < ROWS; i++) exits.add(new Exit(1, i));
            Collections.shuffle(exits, r); List<Exit> s = new ArrayList<>(exits.subList(0, c[2]));
            int t = quench(d, c[0], c[1], c[2]); if (t < 1 || t > c[2]) continue;
            int[] start = new int[c[0]]; for (int i = 0; i < c[0]; i++) start[i] = r.nextInt(2);
            LaserGrid g = new LaserGrid(e, m, b, s, t, start);
            if (g.hit(start) == t) continue; boolean ok = false;
            for (int mask = 0; mask < 1 << c[0] && !ok; mask++) { int[] st = new int[c[0]]; for (int i = 0; i < c[0]; i++) st[i] = mask >> i & 1; ok = g.hit(st) == t; }
            if (ok) return g;
        }
    }
    /** the beam path as cell steps; returns the sensor number hit (1-based), 0 when it ends on a baffle, the left wall or an empty exit */
    public int hit(int[] st) {
        int x = 0, y = emitterRow, dx = 1, dy = 0;
        for (int step = 0; step < 200; step++) {
            if (x < 0) return 0; if (x >= COLS) return sensorAt(1, y); if (y < 0) return sensorAt(0, x); if (y >= ROWS) return sensorAt(2, x);
            for (int[] b : baffles) if (b[0] == x && b[1] == y) return 0;
            for (int i = 0; i < mirrors.length; i++) if (mirrors[i][0] == x && mirrors[i][1] == y) { // rows grow downward: '/' turns east→north (up)
                int ndx, ndy; if (st[i] == 0) { ndx = -dy; ndy = -dx; } else { ndx = dy; ndy = dx; } dx = ndx; dy = ndy; break; }
            x += dx; y += dy;
        }
        return 0;
    }
    private int sensorAt(int side, int index) { for (int i = 0; i < sensors.size(); i++) if (sensors.get(i).side() == side && sensors.get(i).index() == index) return i + 1; return 0; }
    public int[] state() { return state.clone(); }
    public void rotate(int i) { state[i] ^= 1; }
    public boolean onTarget() { return hit(state) == target; }
}
