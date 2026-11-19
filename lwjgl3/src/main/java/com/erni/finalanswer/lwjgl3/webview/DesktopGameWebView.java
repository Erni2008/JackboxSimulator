package com.erni.finalanswer.lwjgl3.webview;

import com.badlogic.gdx.Gdx;
import com.erni.finalanswer.webview.GameWebView;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Shows the web mini-games in the in-game Chromium view (module :viewer) running as a child process of this JVM:
 * same Java runtime and class path, controlled over stdin ("load", "close"); the child also closes itself when
 * this process exits (stdin EOF). If the view cannot start, the page opens in the system browser instead.
 */
public final class DesktopGameWebView implements GameWebView {
    private Process process;
    private Writer commands;
    private volatile boolean ready;

    @Override public synchronized void open(String url) {
        if (process != null && process.isAlive() && send("load " + url) && send("front")) return;
        try {
            String java = ProcessHandle.current().info().command().orElse("java");
            List<String> cmd = new ArrayList<>(List.of(java,
                "--add-opens", "java.desktop/sun.awt=ALL-UNNAMED",
                "--add-opens", "java.desktop/sun.lwawt=ALL-UNNAMED",
                "--add-opens", "java.desktop/sun.lwawt.macosx=ALL-UNNAMED",
                "--enable-native-access=ALL-UNNAMED",
                "-Dapple.awt.application.name=Final Answer",
                "-cp", System.getProperty("java.class.path"),
                "com.erni.finalanswer.viewer.GameViewer", url, "Final Answer"));
            ready = false;
            Process p = new ProcessBuilder(cmd).redirectErrorStream(true).start();
            process = p; commands = new OutputStreamWriter(p.getOutputStream(), StandardCharsets.UTF_8);
            Thread watch = new Thread(() -> watch(p, url), "game-view");
            watch.setDaemon(true); watch.start();
        } catch (Exception e) {
            Gdx.app.error("GameView", "in-game view unavailable, using the browser", e);
            BROWSER.open(url);
        }
    }

    @Override public synchronized void close() {
        if (process == null) return;
        send("close");
        Process p = process; process = null; commands = null;
        Thread reaper = new Thread(() -> {try {if (!p.waitFor(5, java.util.concurrent.TimeUnit.SECONDS)) p.destroyForcibly();} catch (InterruptedException ignored) {p.destroyForcibly();}}, "game-view-close");
        reaper.setDaemon(true); reaper.start();
    }

    private synchronized boolean send(String line) {
        if (commands == null) return false;
        try {commands.write(line + "\n"); commands.flush(); return true;} catch (Exception e) {return false;}
    }

    /** Logs the child's output; if it dies before showing the page, the browser takes over so the host is never stuck. */
    private void watch(Process p, String url) {
        try (BufferedReader out = new BufferedReader(new InputStreamReader(p.getInputStream(), StandardCharsets.UTF_8))) {
            for (String line; (line = out.readLine()) != null; ) {
                if (line.equals("ready")) ready = true;
                if (Gdx.app != null) Gdx.app.log("GameView", line);
            }
            int code = p.waitFor();
            if (!ready && code != 0) {if (Gdx.app != null) Gdx.app.error("GameView", "view exited with " + code + " before showing the page; opening the browser"); BROWSER.open(url);}
        } catch (Exception ignored) {}
    }
}
