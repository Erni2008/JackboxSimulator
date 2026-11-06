package com.erni.finalanswer.gameplay.elevator;

import java.util.*;

/**
 * АДСКАЯ КЛЕТКА — THE HOST'S SUITCASE (the fifth assignment). One suitcase per player, server-authoritative.
 *
 * <p>The suitcase always holds all five mechanisms; one of them is armed for this event (the others are dead
 * decoration). The server picks the armed module, keeps its generated layout and its solution, counts strikes and
 * decides DEFUSED / DETONATED. The phone only renders and sends actions; it is never told the answer.
 *
 * <p>Everything here is a fictional game device: abstract rules invented for FINAL ANSWER.
 */
public final class BombPuzzle {
    public enum Mechanism { WIRE_MAZE, HIDDEN_CONNECTIONS, XRAY, LASER, THERMAL }
    public enum Outcome { RUNNING, DEFUSED, DETONATED }
    /** progress the room restores on reconnect */
    public enum Stage { HIDDEN, FOUND, OPEN }
    public record Event(long seq, String type, String detail) {}

    /** armed mechanisms per event: always 3 of the 5, all must be neutralised */
    public static final int MODULES_PER_EVENT = 3;

    public final long seed; public final Difficulty difficulty; public final List<Mechanism> armed;
    private final long startedAt, limitMs; private Outcome outcome = Outcome.RUNNING; private Stage stage = Stage.HIDDEN;
    private int strikes; private long finishedAt = -1, lastSeq = -1; private String failReason = ""; private Event lastEvent;
    private final Set<Mechanism> neutralised = EnumSet.noneOf(Mechanism.class);
    public boolean rewarded; public long sentAt;
    /** generated layouts of the armed mechanisms (null for the others: they are dead decoration) */
    public final WireMaze wires; private final Set<Integer> cut = new TreeSet<>();
    public final HiddenLinks links; private int[] probe = {-1, -1}; private String reading = "";
    public final XrayCans xray; public final LaserGrid laser; public final ThermalCaps thermal;

    public BombPuzzle(long seed, Difficulty d, List<Mechanism> forced, long now) { this(seed, d, forced, now, d.bombMs); }
    public BombPuzzle(long seed, Difficulty d, List<Mechanism> forced, long now, long limitMs) {
        this.seed = seed; this.difficulty = d; this.armed = forced != null && !forced.isEmpty() ? List.copyOf(new LinkedHashSet<>(forced)) : pick(seed); this.startedAt = now; this.limitMs = limitMs;
        this.wires = armed.contains(Mechanism.WIRE_MAZE) ? WireMaze.generate(seed, d) : null;
        this.links = armed.contains(Mechanism.HIDDEN_CONNECTIONS) ? HiddenLinks.generate(seed, d) : null;
        this.xray = armed.contains(Mechanism.XRAY) ? XrayCans.generate(seed, d) : null;
        this.laser = armed.contains(Mechanism.LASER) ? LaserGrid.generate(seed, d) : null;
        this.thermal = armed.contains(Mechanism.THERMAL) ? ThermalCaps.generate(seed, d) : null;
    }
    /** three distinct mechanisms, random but reproducible from the seed, in bay order */
    public static List<Mechanism> pick(long seed) { List<Mechanism> all = new ArrayList<>(List.of(Mechanism.values())); Collections.shuffle(all, new Random(seed ^ 0x5EEDB0B5L));
        List<Mechanism> a = new ArrayList<>(all.subList(0, MODULES_PER_EVENT)); a.sort(Comparator.naturalOrder()); return List.copyOf(a); }
    public static Mechanism parse(String s) { if (s == null || s.isBlank()) return null; try { return Mechanism.valueOf(s.trim().toUpperCase(Locale.ROOT)); } catch (IllegalArgumentException e) { return null; } }
    /** "WIRE_MAZE,LASER" → list (unknown names dropped) */
    public static List<Mechanism> parseList(String s) { List<Mechanism> out = new ArrayList<>(); if (s != null) for (String p : s.split(",")) { Mechanism m = parse(p); if (m != null && !out.contains(m)) out.add(m); } return out; }

    /** time only: the fuse burns down; true when the outcome changed */
    public boolean advance(long now) { if (outcome != Outcome.RUNNING || now < startedAt + limitMs) return false; detonate(now, "TIMEOUT"); return true; }

    public boolean apply(String action, long seq, long now) { return apply(action, -1, seq, now); }
    /** arg: CUT — the wire (start slot); PROBE / BREAK — red * 32 + black contact ids. Old/duplicate seq are ignored. */
    public boolean apply(String action, int arg, long seq, long now) {
        advance(now); if (outcome != Outcome.RUNNING || seq <= lastSeq) return false; lastSeq = seq;
        switch (action) {
            case "FOUND" -> { if (stage == Stage.HIDDEN) stage = Stage.FOUND; }
            case "OPEN" -> stage = Stage.OPEN;
            case "CUT" -> { live(Mechanism.WIRE_MAZE); if (arg < 0 || arg >= wires.n) throw new IllegalArgumentException("INVALID_CUT");
                if (!cut.add(arg)) return false; lastEvent = new Event(seq, "CUT", String.valueOf(arg));
                if (arg == wires.solution()) neutralise(Mechanism.WIRE_MAZE, seq, now); else strike(seq, now, "WIRE " + arg); return true; }
            case "PROBE" -> { live(Mechanism.HIDDEN_CONNECTIONS); int red = arg / 32, black = arg % 32; if (arg < 0 || red >= 2 * links.n || black >= 2 * links.n) throw new IllegalArgumentException("INVALID_PROBE");
                probe = new int[]{red, black}; reading = links.read(red, black); lastEvent = new Event(seq, "PROBE", reading); return true; }
            case "BREAK" -> { live(Mechanism.HIDDEN_CONNECTIONS); int a = arg / 32, b = arg % 32; if (arg < 0 || a >= 2 * links.n || b >= 2 * links.n || a == b) throw new IllegalArgumentException("INVALID_BREAK");
                lastEvent = new Event(seq, "BREAK", a + "-" + b); if (links.isFiring(a, b)) neutralise(Mechanism.HIDDEN_CONNECTIONS, seq, now); else strike(seq, now, "LINK " + a + "-" + b); return true; }
            case "ISOLATE" -> { live(Mechanism.XRAY); if (arg < 0 || arg >= xray.cans.size()) throw new IllegalArgumentException("INVALID_ISOLATE"); lastEvent = new Event(seq, "ISOLATE", String.valueOf(arg));
                if (arg == xray.solution()) neutralise(Mechanism.XRAY, seq, now); else strike(seq, now, "CAN " + arg); return true; }
            case "ROTATE" -> { live(Mechanism.LASER); if (arg < 0 || arg >= laser.mirrors.length) throw new IllegalArgumentException("INVALID_MIRROR"); laser.rotate(arg); lastEvent = new Event(seq, "ROTATE", String.valueOf(arg)); return true; }
            case "CONFIRM" -> { live(Mechanism.LASER); lastEvent = new Event(seq, "CONFIRM", String.valueOf(laser.hit(laser.state())));
                if (laser.onTarget()) neutralise(Mechanism.LASER, seq, now); else strike(seq, now, "BEAM " + laser.hit(laser.state())); return true; }
            case "VENT" -> { live(Mechanism.THERMAL); if (arg < 0 || arg >= thermal.caps.size()) throw new IllegalArgumentException("INVALID_VENT"); lastEvent = new Event(seq, "VENT", String.valueOf(arg));
                if (arg == thermal.solution()) neutralise(Mechanism.THERMAL, seq, now); else strike(seq, now, "CAPSULE " + arg); return true; }
            default -> throw new IllegalArgumentException("UNKNOWN_BOMB_ACTION");
        }
        lastEvent = new Event(seq, action, ""); return true;
    }
    /** the action must target an armed, still live mechanism, with the lid open */
    private void live(Mechanism m) { if (stage != Stage.OPEN || !armed.contains(m) || neutralised.contains(m)) throw new IllegalArgumentException("NOT_LIVE"); }

    /** a module rejected a defusal action: the bomb flinches; past the difficulty's allowance it goes off */
    void strike(long seq, long now, String detail) { strikes++; lastEvent = new Event(seq, "STRIKE", detail); if (strikes > difficulty.bombStrikes) detonate(now, "WRONG"); }
    void neutralise(Mechanism m, long seq, long now) { neutralised.add(m); lastEvent = new Event(seq, "NEUTRALISED", m.name()); if (neutralised.containsAll(armed)) { outcome = Outcome.DEFUSED; finishedAt = now; lastEvent = new Event(seq, "DEFUSED", m.name()); } }
    private void detonate(long now, String why) { outcome = Outcome.DETONATED; finishedAt = now; failReason = why; lastEvent = new Event(lastSeq, "DETONATED", why); }

    public Set<Mechanism> neutralised() { return Collections.unmodifiableSet(neutralised); }
    public int[] probe() { return probe.clone(); }
    public String reading() { return reading; }
    public Set<Integer> cut() { return Collections.unmodifiableSet(cut); }
    public Outcome outcome() { return outcome; }
    public Stage stage() { return stage; }
    public int strikes() { return strikes; }
    public int strikesAllowed() { return difficulty.bombStrikes; }
    public long startedAt() { return startedAt; }
    public long deadline() { return startedAt + limitMs; }
    public long limitMs() { return limitMs; }
    public long finishedAt() { return finishedAt; }
    public long lastSeq() { return lastSeq; }
    public String failReason() { return failReason; }
    public Event lastEvent() { return lastEvent; }
}
