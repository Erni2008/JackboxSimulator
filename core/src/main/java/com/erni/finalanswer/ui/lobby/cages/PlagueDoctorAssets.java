package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.utils.Disposable;
import java.util.ArrayList;
import java.util.List;

/** Explicit nine-file allowlist. Runtime emission is isolated from the approved lantern only. */
public final class PlagueDoctorAssets implements Disposable {
    public static final List<String> SOURCE_PATHS=List.of("doktor1.png","doktor_body.png","left_hand_doktor.png","doktor4.png",
        "doktor5.png","doktor6.png","doktor7.png","doktor8.png","doktor9.png");
    public record Part(TextureRegion region,int x,int y,int width,int height) {}
    private final List<Texture> owned=new ArrayList<>();
    public final Part head,body,collar,freeUpper,freeLower,freeHand,rightArm,leftLeg,rightLeg,hat,robe,lantern;
    public final TextureRegion fire,radial;
    public PlagueDoctorAssets() {
        try {
            Part fullHead=load(SOURCE_PATHS.get(0)),fullBody=load(SOURCE_PATHS.get(1));
            // The torso supplies the foreground collar; the portrait's redundant scarf tail is hidden.
            head=crop(fullHead,0,0,1284,1050);
            body=crop(fullBody,0,600,1199,712);collar=crop(fullBody,0,0,1199,600);
            Pixmap arm=read(SOURCE_PATHS.get(2));
            Pixmap upper=new Pixmap(arm.getWidth(),arm.getHeight(),Pixmap.Format.RGBA8888);
            Pixmap lower=new Pixmap(arm.getWidth(),arm.getHeight(),Pixmap.Format.RGBA8888);
            Pixmap hand=new Pixmap(436,1024,Pixmap.Format.RGBA8888);
            try {
                upper.setBlending(Pixmap.Blending.None);lower.setBlending(Pixmap.Blending.None);hand.setBlending(Pixmap.Blending.None);
                for(int y=0;y<arm.getHeight();y++) for(int x=0;x<arm.getWidth();x++) {
                    int pixel=arm.getPixel(x,y),a=pixel&255;
                    float d=x-720;
                    float upperMask=1-smooth((d-50)/35),lowerMask=smooth((d+85)/35);
                    upper.drawPixel(x,y,(pixel&0xffffff00)|Math.round(a*upperMask));
                    if(x>=1100) hand.drawPixel(x-1100,y,pixel);
                    else lower.drawPixel(x,y,(pixel&0xffffff00)|Math.round(a*lowerMask));
                }
                freeUpper=part(texture(upper),arm.getWidth(),arm.getHeight());
                freeLower=part(texture(lower),arm.getWidth(),arm.getHeight());
                freeHand=new Part(new TextureRegion(texture(hand)),1100,0,436,1024);
            } finally {arm.dispose();upper.dispose();lower.dispose();hand.dispose();}
            rightArm=load(SOURCE_PATHS.get(3));
            leftLeg=load(SOURCE_PATHS.get(4));rightLeg=load(SOURCE_PATHS.get(5));
            hat=load(SOURCE_PATHS.get(6));robe=load(SOURCE_PATHS.get(7));
            Pixmap base=read(SOURCE_PATHS.get(8)),emission=new Pixmap(base.getWidth(),base.getHeight(),Pixmap.Format.RGBA8888);
            try {
                base.setBlending(Pixmap.Blending.None);emission.setBlending(Pixmap.Blending.None);
                for(int y=0;y<base.getHeight();y++) for(int x=0;x<base.getWidth();x++) {
                    // Inside the glass; dark crossbars and the metal frame do not pass the luminance mask.
                    if(!insideGlass(x,y)) continue;
                    int pixel=base.getPixel(x,y),r=pixel>>>24,g=pixel>>>16&255,b=pixel>>>8&255,a=pixel&255;
                    float mask=smooth((r-170)/65f)*smooth((g-75)/110f);
                    if(mask<=0) continue;
                    emission.drawPixel(x,y,(pixel&0xffffff00)|Math.round(a*mask));
                    float dim=1-.85f*mask;
                    base.drawPixel(x,y,(Math.round(r*dim)<<24)|(Math.round(g*dim)<<16)|(Math.round(b*dim)<<8)|a);
                }
                lantern=part(texture(base),base.getWidth(),base.getHeight());fire=new TextureRegion(texture(emission));
            } finally {base.dispose();emission.dispose();}
            Pixmap glow=new Pixmap(48,48,Pixmap.Format.RGBA8888);
            try {
                glow.setBlending(Pixmap.Blending.None);
                for(int y=0;y<48;y++) for(int x=0;x<48;x++) {
                    float dx=(x-23.5f)/23.5f,dy=(y-23.5f)/23.5f,f=Math.max(0,1-dx*dx-dy*dy);
                    glow.drawPixel(x,y,0xffffff00|Math.round(255*f*f*f));
                }
                radial=new TextureRegion(texture(glow));
            } finally {glow.dispose();}
        } catch(RuntimeException error) {dispose();throw error;}
    }
    private static boolean insideGlass(int x,int y) {
        if(y<510||y>995) return false;
        float v=(y-510)/485f;
        return x>470-110*v&&x<785-45*v;
    }
    private static float smooth(float p) {p=Math.max(0,Math.min(1,p));return p*p*(3-2*p);}
    private static Pixmap read(String path) {
        if(!Gdx.files.internal(path).exists()) throw new IllegalStateException("Missing Plague Doctor sprite: "+path);
        return new Pixmap(Gdx.files.internal(path));
    }
    private Part load(String path) {Pixmap p=read(path);try{return part(texture(p),p.getWidth(),p.getHeight());}finally{p.dispose();}}
    private static Part part(Texture texture,int w,int h) {return new Part(new TextureRegion(texture),0,0,w,h);}
    private static Part crop(Part original,int x,int y,int w,int h) {
        return new Part(new TextureRegion(original.region().getTexture(),x,y,w,h),x,y,w,h);
    }
    private Texture texture(Pixmap p) {
        Texture t=new Texture(p);owned.add(t);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);return t;
    }
    @Override public void dispose() {for(Texture t:owned)t.dispose();owned.clear();}
}
