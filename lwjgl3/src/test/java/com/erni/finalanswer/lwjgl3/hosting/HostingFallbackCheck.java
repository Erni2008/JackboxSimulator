package com.erni.finalanswer.lwjgl3.hosting;

/** Cloud unreachable -> the game must fall back to its own local server instead of failing (release builds). */
public final class HostingFallbackCheck {
    public static void main(String[] args) throws Exception {
        var hosting = new LocalServerManager(18399, "http://127.0.0.1:9", true); // nothing listens on port 9
        long t = System.nanoTime();
        String api = hosting.ensureReady().get();
        long ms = (System.nanoTime() - t) / 1_000_000;
        hosting.close();
        if (!api.startsWith("http://127.0.0.1:")) throw new AssertionError("expected the local fallback, got " + api);
        var strict = new LocalServerManager(18398, "http://127.0.0.1:9", false);
        try {strict.ensureReady().get(); throw new AssertionError("without fallback an unreachable server must fail");}
        catch (java.util.concurrent.ExecutionException expected) {} finally {strict.close();}
        System.out.println("hosting fallback OK: unreachable cloud -> " + api + " in " + ms + " ms; strict mode fails as expected");
        System.exit(0);
    }
}
