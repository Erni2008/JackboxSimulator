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

    /** Loads once per owner; a bad or missing PNG does not prevent other assets from loading. */
    public void load() {
        if (disposed) throw new IllegalStateException("Impostor assets already disposed");
        if (loaded) return;
        loaded = true;
        for (ImpostorAsset asset : ImpostorAsset.values()) {
            try {
                if (!Gdx.files.internal(asset.path()).exists()) {
                    report(asset, "Missing asset");
                    continue;
                }
                textures.put(asset, RuntimeTextures.load(asset.path()));
            } catch (RuntimeException error) {
                report(asset, "Cannot load asset: " + error.getMessage());
            }
        }
        Gdx.app.log("THE IMPOSTOR", "Loaded " + textures.size() + "/"
                + ImpostorAsset.values().length + " textures");
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
