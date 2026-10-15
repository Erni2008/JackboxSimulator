package com.erni.inspector;

import java.nio.file.*;
import java.util.Comparator;
import java.util.concurrent.*;

/** Verifies real change delivery and monitor shutdown with isolated source files. */
public class MonitorCheck {
    public static void main(String[] args) throws Exception {
        Path root = Files.createTempDirectory("inspector-monitor-");
        BlockingQueue<String> events = new LinkedBlockingQueue<>();
        try {
            Path source = Files.createDirectories(root.resolve("core/src/main/java/example"));
            Path file = source.resolve("Example.java");
            Files.writeString(file, "package example; class Example { int value; }");
            String initial = SourceMonitor.fingerprint(root);
            try (var monitor = new SourceMonitor(root, () -> events.add("change"), ex -> events.add("error: " + ex))) {
                Thread.sleep(900);
                if (!events.isEmpty()) throw new AssertionError("Unexpected initial refresh");
                Files.writeString(file, "package example; class Example { String value; }");
                if (initial.equals(SourceMonitor.fingerprint(root))) throw new AssertionError("Content change missed");
                expectChange(events);
                Path newPackage = Files.createDirectories(source.resolve("newpackage"));
                Path added = newPackage.resolve("Added.java");
                Files.writeString(added, "package example.newpackage; class Added {}"); expectChange(events);
                Files.delete(added); expectChange(events);
            }
            Files.writeString(file, "package example; class Example {}");
            if (events.poll(1600, TimeUnit.MILLISECONDS) != null) throw new AssertionError("Monitor active after close");
            System.out.println("PASS: automatic content refresh, new package/file, deletion and shutdown");
        } finally {
            try (var files = Files.walk(root)) { for (var p : files.sorted(Comparator.reverseOrder()).toList()) Files.delete(p); }
        }
    }
    private static void expectChange(BlockingQueue<String> events) throws Exception {
        String event = events.poll(6, TimeUnit.SECONDS);
        if (!"change".equals(event)) throw new AssertionError("Expected refresh, got " + event);
    }
}
