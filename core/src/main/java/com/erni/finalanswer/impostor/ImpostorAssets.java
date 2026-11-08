package com.erni.finalanswer.impostor;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.ui.RuntimeTextures;
import java.util.Collections;
import java.util.EnumMap;
import java.util.Map;
import java.util.Optional;

/** Render-thread-only owner. Borrowed textures must never be disposed by actors. */
public final class ImpostorAssets implements Disposable {
    private final Map<ImpostorAsset, Texture> textures = new EnumMap<>(ImpostorAsset.class);
    private final Map<ImpostorAsset, String> failures = new EnumMap<>(ImpostorAsset.class);
    private boolean loaded;
    private boolean disposed;

    /** Decode every Impostor image in the background ahead of time (called while the host waits in the room). */
    public static void prewarm() {
        java.util.List<String> paths = new java.util.ArrayList<>();
        for (ImpostorAsset asset : ImpostorAsset.values()) paths.add(asset.path());
        RuntimeTextures.prewarm(paths);
    }

    /** Loads once per owner; a bad or missing PNG does not prevent other assets from loading. */
    public void load() {
        if (disposed) throw new IllegalStateException("Impostor assets already disposed");
        if (loaded) return;
        loaded = true;
        long started = System.nanoTime();
        for (ImpostorAsset asset : ImpostorAsset.values()) {
            try {
                if (!RuntimeTextures.exists(asset.path())) {
                    report(asset, "Missing asset");
                    continue;
                }
                textures.put(asset, RuntimeTextures.load(asset.path()));
            } catch (RuntimeException error) {
                report(asset, "Cannot load asset: " + error.getMessage());
            }
        }
        Gdx.app.log("THE IMPOSTOR", "Loaded " + textures.size() + "/"
                + ImpostorAsset.values().length + " textures in " + (System.nanoTime() - started) / 1_000_000 + " ms");
    }

    private void report(ImpostorAsset asset, String reason) {
        String message = reason + " [" + asset.path() + "]";
        failures.put(asset, message);
        Gdx.app.error("THE IMPOSTOR", message);
    }

    public boolean isAvailable(ImpostorAsset asset) { return textures.containsKey(asset); }

    /** Empty before loading, on failure, or after disposal. Ownership remains here. */
    public Optional<Texture> texture(ImpostorAsset asset) {
        return Optional.ofNullable(textures.get(asset));
    }

    public Map<ImpostorAsset, String> failures() { return Collections.unmodifiableMap(failures); }

    @Override public void dispose() {
        if (disposed) return;
        disposed = true;
        for (Texture texture : textures.values()) texture.dispose();
        textures.clear();
    }
}
