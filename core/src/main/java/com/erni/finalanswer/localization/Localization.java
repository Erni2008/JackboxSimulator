package com.erni.finalanswer.localization;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.utils.I18NBundle;

import java.util.Locale;

public class Localization {
    private final I18NBundle bundle;

    public Localization(String language) {
        Locale locale = Locale.forLanguageTag(language);
        bundle = I18NBundle.createBundle(Gdx.files.internal("i18n/messages"), locale, "UTF-8");
    
    }
    public String get(String key) {
        return bundle.get(key);
    }
}