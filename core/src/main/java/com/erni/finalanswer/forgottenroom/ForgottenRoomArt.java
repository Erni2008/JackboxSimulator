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
    final Texture soft,pixel,plaque,plaqueSmall,frameCanvas,vignette,dial,medal;

    ForgottenRoomArt(){
        soft=radial(256);pixel=solid();plaque=placeholder(220,320,false);plaqueSmall=placeholder(200,200,false);frameCanvas=placeholder(320,300,true);vignette=vignette(512,288);dial=dial(512);medal=medal(256);
    }
    Texture background(String path){return load(path);}
    /** A player's character face, baked round on dark velvet (forgotten_room/portraits/<id>.png); null if unknown. */
    Texture portrait(String characterId){return characterId==null||characterId.isEmpty()?null:load("forgotten_room/portraits/"+characterId+".png");}
    /** Real artwork for this look of the object, or null while it hasn't been made yet. */
    /** Art for an object in a room: a picture in the room's own frame is pre-warped to that frame's perspective. */
    Texture object(ForgottenRoomModel m,ForgottenRoomModel.Obj o,boolean inFrame){
        if(inFrame&&m.background.contains(".")){Texture t=load(m.background.substring(0,m.background.lastIndexOf('.'))+"_"+o.id()+"_v"+o.variant()+".png");if(t!=null)return t;}
        return object(o);
    }
    Texture object(ForgottenRoomModel.Obj o){
        if(o.light()){Texture t=load("forgotten_room/objects/"+o.id()+(o.lit()?"_on":"_off")+".png");if(t!=null)return t;}
        Texture t=load("forgotten_room/objects/"+o.id()+"_v"+o.variant()+".png");if(t!=null)return t;
        return load("forgotten_room/objects/"+o.id()+".png");
    }
    /** Preload every look a round can show, so the blackout never stalls on disk reads. */
    void preload(ForgottenRoomModel m){
        background(m.background);
        for(var list:List.of(m.objects,m.original))for(var o:list){object(o);object(m,o,true);}
        for(String id:m.characters.values())portrait(id);
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
    /**
     * An antique timer dial: knurled brass bezel lit from the upper left, a dark groove, deep enamel face with a fine
     * guilloché of concentric rings and a printed minute track. The live arc, hand and numerals are drawn over it.
     */
    private static Texture dial(int n){
        Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);float c=(n-1)/2f,R=c;
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){
            float dx=x-c,dy=y-c,d=(float)Math.sqrt(dx*dx+dy*dy)/R;if(d>1){p.drawPixel(x,y,0);continue;}
            double ang=Math.atan2(dy,dx);float light=(float)(.5+.5*Math.cos(ang+2.35));   // brightest toward the upper left
            float r,g,b,a=Math.min(1,(1-d)*R/1.5f);
            if(d>.86f){ // brass bezel with knurling
                float t=(d-.86f)/.14f;float bevel=(float)Math.sin(t*Math.PI);float knurl=(float)(.5+.5*Math.sin(ang*96))*(t>.55f?1:0);
                float k=.42f+.5f*light*bevel+.12f*bevel-.10f*knurl;
                r=.70f*k+.07f;g=.52f*k+.045f;b=.30f*k+.02f;
                if(t<.08f||t>.94f){r*=.45f;g*=.45f;b*=.45f;}
            }else if(d>.80f){ // dark groove
                float k=.06f+.05f*light;r=k;g=k*.85f;b=k*.8f;
            }else{ // enamel face
                float vign=1-d*d*.55f;float guil=(float)(.5+.5*Math.sin(d*R*.9))*.018f;
                r=(.085f+.03f*light)*vign+guil;g=(.045f+.018f*light)*vign+guil*.8f;b=(.05f+.02f*light)*vign+guil*.7f;
                if(d>.70f&&d<.715f){r+=.20f;g+=.15f;b+=.08f;}                                      // printed track rim
                double deg=Math.toDegrees(ang);double m=((deg%6)+6)%6;
                boolean major=(((deg%30)+30)%30)<1.2||(((deg%30)+30)%30)>28.8;
                if(d>.72f&&d<(major?.79f:.765f)&&(m<.9||m>5.1)){float k=major?.55f:.32f;r+=k;g+=k*.78f;b+=k*.42f;}
            }
            p.drawPixel(x,y,Color.rgba8888(Math.min(1,r),Math.min(1,g),Math.min(1,b),a));
        }
        Texture t=new Texture(p,true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);p.dispose();return t;
    }
    /** A gilt medallion ring with a transparent middle, lit from the upper left; frames portraits and rank seals. */
    private static Texture medal(int n){
        Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);float c=(n-1)/2f,R=c;
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){
            float dx=x-c,dy=y-c,d=(float)Math.sqrt(dx*dx+dy*dy)/R;if(d>1||d<.80f){p.drawPixel(x,y,0);continue;}
            double ang=Math.atan2(dy,dx);float light=(float)(.5+.5*Math.cos(ang+2.35));float t=(d-.80f)/.20f;
            float bevel=(float)Math.sin(t*Math.PI),k=.38f+.55f*light*bevel+.15f*bevel;
            float r=.78f*k+.08f,g=.58f*k+.05f,b=.30f*k+.02f;if(t<.1f||t>.9f){r*=.5f;g*=.5f;b*=.5f;}
            float a=Math.min(1,Math.min((1-d)*R/1.2f,(d-.80f)*R/1.2f));
            p.drawPixel(x,y,Color.rgba8888(Math.min(1,r),Math.min(1,g),Math.min(1,b),a));}
        Texture t=new Texture(p,true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);p.dispose();return t;
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
    @Override public void close(){for(Texture t:cache.values())t.dispose();cache.clear();soft.dispose();pixel.dispose();plaque.dispose();plaqueSmall.dispose();frameCanvas.dispose();vignette.dispose();dial.dispose();medal.dispose();}
}
