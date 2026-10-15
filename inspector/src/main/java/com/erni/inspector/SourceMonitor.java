package com.erni.inspector;

import java.nio.file.*;
import java.security.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.function.Consumer;
import java.io.IOException;

/** Watches source content, including new/deleted directories; callbacks run off the UI thread. */
final class SourceMonitor implements AutoCloseable {
    private final ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor(r -> {
        Thread thread = new Thread(r, "inspector-source-monitor"); thread.setDaemon(true); return thread;
    });
    private String applied, pending;
    SourceMonitor(Path root, Runnable changed, Consumer<Exception> failed) {
        executor.scheduleWithFixedDelay(() -> {
            try {
                String next = fingerprint(root);
                if (applied == null) { applied = next; return; }
                if (next.equals(applied)) { pending = null; return; }
                // Wait for a stable save to avoid parsing partially written editor files.
                if (next.equals(pending)) { applied = next; pending = null; changed.run(); }
                else pending = next;
            } catch (Exception ex) { failed.accept(ex); }
        }, 0, 700, TimeUnit.MILLISECONDS);
    }
    static String fingerprint(Path root) throws IOException {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            for (String module : List.of("core", "lwjgl3")) {
                Path source = root.resolve(module + "/src/main/java");
                if (!Files.isDirectory(source)) continue;
                try (var walk = Files.walk(source)) {
                    for (Path file : walk.filter(p -> Files.isRegularFile(p) && p.toString().endsWith(".java")).sorted().toList()) {
                        digest.update(root.relativize(file).toString().getBytes(java.nio.charset.StandardCharsets.UTF_8));
                        digest.update((byte) 0); digest.update(Files.readAllBytes(file)); digest.update((byte) 0);
                    }
                }
            }
            return HexFormat.of().formatHex(digest.digest());
        } catch (NoSuchAlgorithmException ex) { throw new IllegalStateException(ex); }
    }
    public void close() { executor.shutdownNow(); }
}
