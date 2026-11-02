package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.math.Vector3;
import com.badlogic.gdx.utils.Json;

/** Adjustable attachment points and card dimensions; read from {@code models/cursed_cards/dealer.json}. */
public final class DealerConfig {
    public static final String FILE="models/cursed_cards/dealer.json";
    /** Runtime models come from {@link CursedCardsQuality}; the 71 MB source lives in source_assets. */
    public String comment;
    /** Inner slot width in model units. */
    public float slotWidth=.51f,slotClearance=1.18f;
    /** Usable length of the top card platform in model units; the whole card must lie inside it. */
    public float platformLength=.44f,platformWidth=.40f,platformClearance=1.04f;
    public Vector3 spawn=new Vector3(-.005f,.211f,.28f),exitDirection=new Vector3(0,0,1),deck=new Vector3(0,.478f,-.06f);
    /** Forward tilt of the card platform in the top tray, degrees (front edge lower). */
    public float deckTilt=7.9f;
    /** Deck orientation on the platform: 90 = lying crosswise (long side along the machine's width), 0 = lengthwise. Cards are always dealt lengthwise. */
    public float deckYaw=90;
    /** How far the bottom card is drawn back under the stack when fed, world units. */
    public float feedTravel=.3f;
    public Card card=new Card();
    public static final class Card{public float width=.63f,height=.88f,thickness=.003f,cornerRadius=.035f;public int cornerSegments=5;}
    public static DealerConfig load(){var f=Gdx.files.internal(FILE);if(!f.exists())return new DealerConfig();var json=new Json();json.setIgnoreUnknownFields(true);return json.fromJson(DealerConfig.class,f);}
    /** Smallest scale at which the card both clears the slot and lies entirely inside the top compartment. */
    public float machineScale(){boolean across=Math.abs(deckYaw%180)>45;
        float along=across?card.width:card.height,side=across?card.height:card.width;
        return Math.max(card.width*slotClearance/slotWidth,Math.max(along*platformClearance/platformLength,side*platformClearance/platformWidth));}
}
