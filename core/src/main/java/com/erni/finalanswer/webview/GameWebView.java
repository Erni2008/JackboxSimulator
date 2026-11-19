package com.erni.finalanswer.webview;

import com.badlogic.gdx.Gdx;

/**
 * Where the web-based 3D mini-games (Cursed Run, Hell Cage host screen) are shown on the host's computer.
 * The desktop build shows them inside the game as a borderless full-screen view; anything else falls back
 * to the system browser.
 */
public interface GameWebView {
    /** Show the page (replaces the page if the view is already open). */
    void open(String url);
    /** The mini-game ended: close the view and return to the game window. */
    void close();

    /** Fallback: the system browser (no automatic close). */
    GameWebView BROWSER = new GameWebView() {
        @Override public void open(String url) {Gdx.net.openURI(url);}
        @Override public void close() {}
    };
}
