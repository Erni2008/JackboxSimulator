package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.utils.Disposable;
import java.util.ArrayList;
import java.util.List;

/** Original art is immutable. Facial light and stem are isolated once into shared runtime textures. */
public final class PumpkinAssets implements Disposable {
    public static final String DIRECTORY="lobby/characters/pumpkin/";
    public record Part(TextureRegion region,int x,int y,int width,int height) {}
    private final List<Texture> owned=new ArrayList<>();
    public final Part head,body,leftArm,rightArm,leftLeg,rightLeg,stem;
    public final TextureRegion eyes,mouth,smoke;
    // Openings only: never the pumpkin skin, scarf or the full-character reference.
    private static final float[] LEFT_EYE={340,408,410,478,520,532,650,578,603,636,506,670,414,645,363,576};
    private static final float[] RIGHT_EYE={880,515,928,422,1012,320,1086,284,1128,326,1138,412,1090,506,1006,551,932,552};
    private static final float[] MOUTH={225,645,350,742,470,775,584,766,700,775,843,724,953,642,1046,630,1133,564,1247,490,1197,674,1098,803,930,899,745,943,566,937,410,887,295,789};
    private static final float[] STEM={358,147,393,79,444,41,508,22,537,39,560,75,548,115,531,130,511,105,487,94,452,100,419,133,421,159,443,196,459,229,490,256,532,273,550,286,520,297,461,304,398,308,371,293,389,267,385,239,368,212,353,180};
    public PumpkinAssets() {
        try {
            Pixmap original=read("pumpkin1.png"),eyePixels=new Pixmap(original.getWidth(),original.getHeight(),Pixmap.Format.RGBA8888),mouthPixels=new Pixmap(original.getWidth(),original.getHeight(),Pixmap.Format.RGBA8888);
            try {
                original.setBlending(Pixmap.Blending.None);eyePixels.setBlending(Pixmap.Blending.None);mouthPixels.setBlending(Pixmap.Blending.None);
                for(int y=0;y<original.getHeight();y++) for(int x=0;x<original.getWidth();x++) {
                    int pixel=original.getPixel(x,y),r=pixel>>>24,g=pixel>>>16&255,b=pixel>>>8&255,a=pixel&255;
                    boolean eye=inside(LEFT_EYE,x,y)||inside(RIGHT_EYE,x,y),lip=inside(MOUTH,x,y);
                    float mask=(eye||lip)?smooth((r-175)/55f)*smooth((g-55)/85f):0;
                    if(mask<=0) continue;
                    int light=(pixel&0xffffff00)|Math.round(a*mask);
                    (eye?eyePixels:mouthPixels).drawPixel(x,y,light);
                    float dim=1-.78f*mask;
                    original.drawPixel(x,y,(Math.round(r*dim)<<24)|(Math.round(g*dim)<<16)|(Math.round(b*dim)<<8)|a);
                }
                head=part(texture(original),0,0,original.getWidth(),original.getHeight());
                eyes=new TextureRegion(texture(eyePixels));mouth=new TextureRegion(texture(mouthPixels));
            } finally { original.dispose();eyePixels.dispose();mouthPixels.dispose(); }
            // Keep the authored shoulder silhouette and its natural painted collar; no second scarf overlay.
            body=load("pumpkin2.png",0,0,1230,1278);
            leftArm=load("pumpkin3.png",0,0,1327,1185);rightArm=load("pumpkin4.png",0,0,1331,1182);
            leftLeg=load("pumpkin5.png",0,0,1328,1184);rightLeg=load("pumpkin6.png",0,0,1350,1165);
            // There is no standalone stem PNG. Only this polygon of the reference contains wood.
            Pixmap reference=read("pumpkin.png"),stemPixels=new Pixmap(220,300,Pixmap.Format.RGBA8888);
            try {
                stemPixels.setBlending(Pixmap.Blending.None);
                for(int y=0;y<300;y++) for(int x=0;x<220;x++)
                    if(inside(STEM,x+350,y+15)) stemPixels.drawPixel(x,y,reference.getPixel(x+350,y+15));
                stem=part(texture(stemPixels),350,15,220,300);
            } finally {reference.dispose();stemPixels.dispose();}
            Pixmap radial=new Pixmap(32,32,Pixmap.Format.RGBA8888);
            try {
                radial.setBlending(Pixmap.Blending.None);
                for(int y=0;y<32;y++) for(int x=0;x<32;x++) {
                    float dx=(x-15.5f)/15.5f,dy=(y-15.5f)/15.5f,f=Math.max(0,1-dx*dx-dy*dy);
                    radial.drawPixel(x,y,0xffffff00|Math.round(255*f*f*f));
                }
                smoke=new TextureRegion(texture(radial));
            } finally {radial.dispose();}
        } catch(RuntimeException error) {dispose();throw error;}
    }
    private static Pixmap read(String name) {
        String path=DIRECTORY+name;
        if(!Gdx.files.internal(path).exists()) throw new IllegalStateException("Missing Pumpkin Head art: assets/"+path);
        return new Pixmap(Gdx.files.internal(path));
    }
    private Part load(String name,int x,int y,int w,int h) {
        Pixmap pixels=read(name);
        try {return part(texture(pixels),x,y,w,h);} finally {pixels.dispose();}
    }
    private static Part part(Texture texture,int x,int y,int w,int h) {
        // The isolated stem texture has a source-art offset but starts at its own texture origin.
        return new Part(new TextureRegion(texture,texture.getWidth()==w?0:x,texture.getHeight()==h?0:y,w,h),x,y,w,h);
    }
    private Texture texture(Pixmap pixels) {
        Texture texture=CharacterTextures.upload(pixels);owned.add(texture);return texture;
    }
    private static float smooth(float p) {p=Math.max(0,Math.min(1,p));return p*p*(3-2*p);}
    private static boolean inside(float[] polygon,float x,float y) {
        boolean result=false;
        for(int i=0,j=polygon.length-2;i<polygon.length;j=i,i+=2)
            if((polygon[i+1]>y)!=(polygon[j+1]>y)&&x<(polygon[j]-polygon[i])*(y-polygon[i+1])/(polygon[j+1]-polygon[i+1])+polygon[i]) result=!result;
        return result;
    }
    @Override public void dispose() {for(Texture texture:owned) texture.dispose();owned.clear();}
}
