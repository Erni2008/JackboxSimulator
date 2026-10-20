package com.erni.finalanswer.ui;

import com.badlogic.gdx.graphics.Color;

/** Stable paired colors: light for dark scenes, deep ink for parchment nameplates. */
public final class PlayerColors {
    private static final String[] IDS={"ghost","dracula","plague_doctor","puppeteer","skeleton","zombie","pumpkin","voodoo"};
    private static final Color[] LIGHT=colors("77DDD0","EF8A9B","E9C17B","C4A0E8","EEE0B6","A9CC78","F0A36C","8EBFE8");
    private static final Color[] INK=colors("164C4B","732E3D","68491F","563875","574627","3D5427","7A3C1E","304F75");
    private PlayerColors(){}
    private static Color[] colors(String... hex){Color[] values=new Color[hex.length];for(int i=0;i<hex.length;i++)values[i]=Color.valueOf(hex[i]);return values;}
    private static int index(String character){for(int i=0;i<IDS.length;i++)if(IDS[i].equals(character))return i;return (character.hashCode()&0x7fffffff)%8;}
    public static Color light(String character){return LIGHT[index(character)];}
    public static Color ink(String character){return INK[index(character)];}
}
