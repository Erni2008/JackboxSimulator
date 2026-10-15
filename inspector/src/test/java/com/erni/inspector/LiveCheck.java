package com.erni.inspector;
import java.nio.file.*;
import java.util.*;
public class LiveCheck {
    static class Parent { private int inherited = 7; }
    static class ObjectFixture extends Parent {
        int value = 2; ObjectFixture self = this;
        ObjectFixture child; List<ObjectFixture> list = new ArrayList<>();
        public String toString() { throw new AssertionError("Must not call object methods"); }
        int getValue() { throw new AssertionError("Must not call getters"); }
    }
    public static void main(String[] args) throws Exception {
        var root = new ObjectFixture(); root.child = new ObjectFixture(); root.list.add(root.child);
        var collector = new LiveCollector(); var first = collector.capture(root);
        var node = first.nodes().getFirst();
        if (node.fields().stream().noneMatch(f -> f.signature().endsWith("inherited") && f.value().equals("7"))) throw new AssertionError("Inherited field missing");
        if (node.fields().stream().noneMatch(f -> f.signature().endsWith("self") && f.reference() == node.id())) throw new AssertionError("Cycle missing");
        if (first.nodes().stream().noneMatch(n -> n.type().equals("java.util.ArrayList") && n.fields().stream().anyMatch(f -> f.signature().equals("[0]")))) throw new AssertionError("Collection missing");
        root.value = 19; var second = collector.capture(root);
        if (second.nodes().getFirst().id() != node.id()) throw new AssertionError("Unstable identity");
        if (second.nodes().getFirst().fields().stream().noneMatch(f -> f.signature().endsWith("value") && f.value().equals("19"))) throw new AssertionError("Value update missing");
        if (root.value != 19 || root.self != root) throw new AssertionError("Mutation");
        Path dir = Files.createTempDirectory("live-check-"); Path file = dir.resolve("snapshot.bin");
        try { second.write(file); if (!second.equals(LiveSnapshot.read(file))) throw new AssertionError("Protocol mismatch"); }
        finally { Files.deleteIfExists(file); Files.delete(dir); }
        System.out.println("PASS: live private/inherited fields, cycles, identities, collections, no method calls, read-only protocol");
    }
}
