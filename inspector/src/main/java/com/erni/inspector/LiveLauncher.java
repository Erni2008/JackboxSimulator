package com.erni.inspector;

import com.badlogic.gdx.backends.lwjgl3.*;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.lwjgl3.StartupHelper;
import java.nio.file.*;
import java.util.concurrent.*;

/** Optional developer launch; publishes immutable snapshots to a separate inspector process. */
public final class LiveLauncher {
    public static void main(String[] args) throws Exception {
        if (StartupHelper.startNewJvmIfRequired()) return;
        Path root = Path.of(args[0]).toAbsolutePath();
        Path session = Files.createTempDirectory("finalanswer-live-"); Path snapshot = session.resolve("snapshot.bin");
        String java = Path.of(System.getProperty("java.home"), "bin", "java").toString();
        System.out.println("Live snapshot: " + snapshot);
        new ProcessBuilder(java, "-cp", System.getProperty("java.class.path"), Inspector.class.getName(), root.toString(), snapshot.toString()).inheritIO().start();
        var config = new Lwjgl3ApplicationConfiguration(); config.setTitle("FinalAnswer · Inspector mode"); config.setWindowedMode(1280, 720); config.useVsync(true); config.setForegroundFPS(60);
        try { new Lwjgl3Application(new ObservedGame(snapshot), config); }
        finally {
            Files.deleteIfExists(snapshot); Files.deleteIfExists(session.resolve("snapshot.bin.tmp"));
            Files.deleteIfExists(session);
        }
    }
    private static final class ObservedGame extends FinalAnswerGame {
        private final Path snapshot;
        private final LiveCollector collector = new LiveCollector();
        private final ExecutorService writer = Executors.newSingleThreadExecutor(r -> { var t = new Thread(r, "inspector-snapshot-writer"); t.setDaemon(true); return t; });
        private final java.util.concurrent.atomic.AtomicBoolean writing = new java.util.concurrent.atomic.AtomicBoolean();
        private long nextSample;
        ObservedGame(Path snapshot) { this.snapshot = snapshot; }
        @Override public void render() {
            super.render();
            if (System.nanoTime() >= nextSample && writing.compareAndSet(false, true)) {
                nextSample = System.nanoTime() + 500_000_000L;
                var data = collector.capture(this);
                writer.execute(() -> { try { data.write(snapshot); } catch (Exception ex) { System.err.println("Inspector snapshot: " + ex.getMessage()); } finally { writing.set(false); } });
            }
        }
        @Override public void dispose() {
            writer.shutdown();
            try { if (!writer.awaitTermination(2, TimeUnit.SECONDS)) writer.shutdownNow(); } catch (InterruptedException ex) { Thread.currentThread().interrupt(); }
            super.dispose();
        }
    }
}
