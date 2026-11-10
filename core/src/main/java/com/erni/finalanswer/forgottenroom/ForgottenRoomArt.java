package com.erni.finalanswer.forgottenroom;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import java.util.*;

/**
 * Textures for the room: backgrounds, object art and generated helpers (soft radial light, placeholder plaques).
 * Object art is looked up as {@code forgotten_room/objects/<id>_on|_off.png} for lights, {@code <id>_v<variant>.png},
 * then {@code <id>.png}; until the artwork exists a dignified placeholder plaque stands in. Everything is loaded
 * before the observation phase and cached; nothing is created per frame.
 */
final class ForgottenRoomArt implements AutoCloseable {
    private final Map<String,Texture> cache=new HashMap<>();private final Set<String> missing=new HashSet<>();
    final Texture soft,pixel,plaque,plaqueSmall,frameCanvas,vignette;

    ForgottenRoomArt(){
        soft=radial(256);pixel=solid();plaque=placeholder(220,320,false);plaqueSmall=placeholder(200,200,false);frameCanvas=placeholder(320,300,true);vignette=vignette(512,288);
    }
    Texture background(String path){return load(path);}
    /** Real artwork for this look of the object, or null while it hasn't been made yet. */
    Texture object(ForgottenRoomModel.Obj o){
        if(o.light()){Texture t=load("forgotten_room/objects/"+o.id()+(o.lit()?"_on":"_off")+".png");if(t!=null)return t;}
        Texture t=load("forgotten_room/objects/"+o.id()+"_v"+o.variant()+".png");if(t!=null)return t;
        return load("forgotten_room/objects/"+o.id()+".png");
    }
    /** Preload every look a round can show, so the blackout never stalls on disk reads. */
    void preload(ForgottenRoomModel m){
        background(m.background);
        for(var list:List.of(m.objects,m.original))for(var o:list)object(o);
        for(var c:m.changes){if(c.before()!=null)object(c.before());if(c.after()!=null)object(c.after());}
    }
    private Texture load(String path){
        if(path==null||path.isEmpty()||missing.contains(path))return null;
        Texture t=cache.get(path);if(t!=null)return t;
        var file=Gdx.files.internal(path);if(!file.exists()){missing.add(path);return null;}
        try{t=new Texture(file,true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);cache.put(path,t);return t;}
        catch(RuntimeException e){Gdx.app.error("ForgottenRoom","Cannot load "+path+": "+e.getMessage());missing.add(path);return null;}
    }

    private static Texture solid(){Pixmap p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();Texture t=new Texture(p);p.dispose();return t;}
    /** White radial falloff (smoothstep), used for light pools, shadows, vignette and the reveal spotlight. */
    private static Texture radial(int size){
        Pixmap p=new Pixmap(size,size,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);float c=(size-1)/2f;
        for(int y=0;y<size;y++)for(int x=0;x<size;x++){float d=(float)Math.hypot(x-c,y-c)/c;float a=d>=1?0:(1-d);a=a*a*(3-2*a);
            p.drawPixel(x,y,Color.rgba8888(1,1,1,a));}
        Texture t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;
    }
    /** Dark edges, clear centre: a gentle cinematic vignette stretched over the whole screen. */
    private static Texture vignette(int w,int h){
        Pixmap p=new Pixmap(w,h,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);
        for(int y=0;y<h;y++)for(int x=0;x<w;x++){float dx=(x-(w-1)/2f)/(w/2f),dy=(y-(h-1)/2f)/(h/2f);float d=(float)Math.sqrt(dx*dx*.85f+dy*dy*1.1f);
            float a=Math.max(0,Math.min(1,(d-.55f)/.75f));a=a*a*(3-2*a);p.drawPixel(x,y,Color.rgba8888(0,0,0,a));}
        Texture t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;
    }
    /**
     * Placeholder plaque: aged dark wood with a double gilt border and a diamond crest, so the room stays readable and
     * elegant before the real object art arrives. {@code canvas} draws a dim painted canvas for the picture frame.
     */
    private static Texture placeholder(int w,int h,boolean canvas){
        Pixmap p=new Pixmap(w,h,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);
        int r=Math.min(w,h)/9;
        for(int y=0;y<h;y++)for(int x=0;x<w;x++){
            float dx=Math.max(0,Math.max(r-x,x-(w-1-r))),dy=Math.max(0,Math.max(r-y,y-(h-1-r)));float edge=r-(float)Math.hypot(dx,dy);
            if(edge<0){p.drawPixel(x,y,0);continue;}
            float t=y/(float)h;float grain=(float)(Math.sin(x*.21+Math.sin(y*.05)*3)*.5+.5)*.05f;
            float cr=canvas?.20f-.06f*t:.13f-.05f*t+grain,cg=canvas?.15f-.05f*t:.09f-.04f*t+grain*.7f,cb=canvas?.12f-.04f*t:.08f-.03f*t+grain*.5f;
            float a=Math.min(1,edge/1.5f);
            if(edge<3){cr=.86f;cg=.68f;cb=.38f;}                           // outer gilt edge
            else if(edge<5){cr=.18f;cg=.12f;cb=.08f;}                      // dark bevel
            else if(edge>=9&&edge<10.4f){cr=.70f;cg=.53f;cb=.28f;a*=.75f;} // fine inner line
            p.drawPixel(x,y,Color.rgba8888(cr,cg,cb,a));
        }
        // diamond crest near the top
        int cx=w/2,cy=canvas?h/2:h/4,rad=Math.max(5,w/18);
        for(int y=-rad;y<=rad;y++)for(int x=-rad;x<=rad;x++)if(Math.abs(x)+Math.abs(y)<=rad)p.drawPixel(cx+x,cy+y,Color.rgba8888(.93f,.78f,.47f,Math.abs(x)+Math.abs(y)<=rad-2?1:.6f));
        Texture t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;
    }
    @Override public void close(){for(Texture t:cache.values())t.dispose();cache.clear();soft.dispose();pixel.dispose();plaque.dispose();plaqueSmall.dispose();frameCanvas.dispose();vignette.dispose();}
}
