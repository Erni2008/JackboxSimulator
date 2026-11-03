package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.utils.Disposable;

/**
 * Production HUD for THE CURSED CARDS: nameplates with one active-turn marker, a quiet phase line, short event toasts,
 * the DEATH spotlight dim and the final verdict. Laid out in the backdrop letterbox (1920×1080 reference), so it scales
 * with the window. No buttons and no hidden information.
 */
public final class CursedHud implements Disposable {
    public static final String[] DEFAULT_NAMES={"VESPER","MORDECAI","LILITH","ABSALOM","SERAPHINE","CORVIN","ODETTE","BALTHAZAR"};
    private final BitmapFont plate,status,phaseFont,title,toastFont;
    private final Texture pixel,spot,spotSoft;
    private final GlyphLayout layout=new GlyphLayout();
    private String phase="",shownPhase="",toast="";private float phaseFade,toastAge=99,time,verdictFade;
    private final Color gold=new Color(.93f,.76f,.45f,1),ivory=new Color(.92f,.86f,.76f,1),crimson=new Color(.95f,.22f,.18f,1),ash=new Color(.62f,.58f,.54f,1);

    public CursedHud(){
        var bebas=new FreeTypeFontGenerator(Gdx.files.internal("ui/fonts/BebasNeue-Regular.ttf"));var raj=new FreeTypeFontGenerator(Gdx.files.internal("ui/fonts/Rajdhani-SemiBold.ttf"));var horror=new FreeTypeFontGenerator(Gdx.files.internal("ui/fonts/Creepster-Regular.ttf"));
        plate=font(bebas,34,2);phaseFont=font(bebas,28,2);toastFont=font(bebas,40,2);status=font(raj,19,1);title=font(horror,96,0);
        bebas.dispose();raj.dispose();horror.dispose();
        Pixmap p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();pixel=new Texture(p);p.dispose();
        int n=256;p=new Pixmap(n,n,Pixmap.Format.RGBA8888);
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float u=(x+.5f)/n*2-1,v=(y+.5f)/n*2-1,r=(float)Math.sqrt(u*u+v*v),a=MathUtils.clamp((r-.18f)/.82f,0,1);a=a*a*(3-2*a);p.drawPixel(x,y,Color.rgba8888(0,0,0,r>=1?1:a));}
        spot=new Texture(p);spot.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();
        n=64;p=new Pixmap(n,n,Pixmap.Format.RGBA8888);for(int y=0;y<n;y++)for(int x=0;x<n;x++){float u=(x+.5f)/n*2-1,v=(y+.5f)/n*2-1,r=(float)Math.sqrt(u*u+v*v),a=MathUtils.clamp(1-r,0,1);p.drawPixel(x,y,Color.rgba8888(1,1,1,a*a));}
        spotSoft=new Texture(p);spotSoft.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();
    }
    private static BitmapFont font(FreeTypeFontGenerator g,int size,int spacing){var p=new FreeTypeFontGenerator.FreeTypeFontParameter();p.size=size;p.spaceX=spacing;p.characters+="—·←→";p.minFilter=p.magFilter=Texture.TextureFilter.Linear;p.genMipMaps=false;return g.generateFont(p);}

    public void phase(String text){if(!text.equals(phase)){phase=text;}}
    public void toast(String text){toast=text;toastAge=0;}
    public void update(float dt){time+=dt;toastAge+=dt;
        if(!phase.equals(shownPhase)){phaseFade-=dt*4;if(phaseFade<=0){shownPhase=phase;phaseFade=0;}}else phaseFade=Math.min(1,phaseFade+dt*2.5f);}
    public boolean animating(){return toastAge<2.6f||!phase.equals(shownPhase)||phaseFade<1;}

    /** Everything the HUD shows for one frame; filled by the table (no game state is read here). */
    public static final class Frame{
        public Rectangle view;public int players;public final Vector2[] plates=new Vector2[8];public String[] names=DEFAULT_NAMES;
        public int drawer=-1,source=-1,loser=-1;public final boolean[] safe=new boolean[8];
        public float dim,flash,fade;public final float[] plateScale=new float[8];public final Vector2 spotlight=new Vector2();public boolean verdict;
        public Frame(){for(int i=0;i<8;i++)plates[i]=new Vector2();}
    }
    public void draw(SpriteBatch batch,Frame f,float dt){
        Rectangle v=f.view;float k=v.height/1080f;
        batch.setColor(Color.WHITE);
        // DEATH: the room falls dark around the card.
        if(f.dim>0){float s=v.height*1.25f,cx=f.spotlight.x,cy=f.spotlight.y,a=f.dim*.82f;batch.setColor(1,1,1,a);
            batch.draw(spot,cx-s*.5f,cy-s*.5f,s,s);batch.setColor(0,0,0,a);
            batch.draw(pixel,v.x,v.y,cx-s*.5f-v.x,v.height);batch.draw(pixel,cx+s*.5f,v.y,v.x+v.width-(cx+s*.5f),v.height);
            batch.draw(pixel,cx-s*.5f,v.y,s,cy-s*.5f-v.y);batch.draw(pixel,cx-s*.5f,cy+s*.5f,s,v.y+v.height-(cy+s*.5f));batch.setColor(Color.WHITE);}
        // Supernatural red flash at the reveal.
        if(f.flash>0){batch.setColor(.75f,.02f,.02f,.32f*f.flash*f.flash);batch.draw(pixel,v.x,v.y,v.width,v.height);batch.setColor(Color.WHITE);}
        // Nameplates.
        for(int i=0;i<f.players;i++){Vector2 at=f.plates[i];String name=f.names[i%f.names.length];
            boolean active=i==f.drawer,target=i==f.source,dead=i==f.loser,ok=f.safe[i]&&!dead;float fade=f.dim>0&&!dead?1-f.dim*.7f:1;
            Color c=dead?crimson:active?gold:target?crimson:ok?ash:ivory;
            float pk=k*f.plateScale[i];plate.getData().setScale(pk);layout.setText(plate,name);float w=layout.width,h=layout.height,x=at.x-w*.5f,y=at.y+h*.5f;
            // soft dark backing keeps the name readable on bright felt or embroidery
            batch.setColor(0,0,0,.42f*fade);batch.draw(spotSoft,at.x-w*.75f,at.y-h*1.2f,w*1.5f,h*2.6f);batch.setColor(Color.WHITE);
            plate.setColor(0,0,0,.75f*fade);plate.draw(batch,name,x+2*pk,y-2*pk);plate.setColor(c.r,c.g,c.b,(ok?.65f:1)*fade);plate.draw(batch,name,x,y);
            // thin gold rule under the name, wider for the active player
            float rule=(active?1:.55f)*w;batch.setColor(gold.r,gold.g,gold.b,(active?.85f:.28f)*fade);batch.draw(pixel,at.x-rule*.5f,y-h-7*k,rule,Math.max(1,1.5f*k));
            String st=dead?"CURSED":ok?"SAFE":active?"DRAWS":target?"OFFERS A CARD":null;
            if(st!=null){status.getData().setScale(k);layout.setText(status,st);status.setColor(c.r,c.g,c.b,.9f*fade);status.draw(batch,st,at.x-layout.width*.5f,y-h-14*k);}
            if(active){float pulse=.5f+.5f*MathUtils.sin(time*3.2f),d=(7+2*pulse)*k,my=y+14*k;batch.setColor(gold.r,gold.g,gold.b,.9f*fade);
                batch.draw(pixel,at.x-d*.5f,my,d*.5f,d*.5f,d,d,.72f,.72f,45,0,0,1,1,false,false);
                batch.setColor(gold.r,gold.g,gold.b,.18f+.12f*pulse);batch.draw(pixel,at.x-d,my-d*.5f,d,d,d*2,d*2,.72f,.72f,45,0,0,1,1,false,false);}
            batch.setColor(Color.WHITE);}
        // Phase line, top centre, between two short gold rules.
        if(!shownPhase.isEmpty()&&f.dim<.5f){phaseFont.getData().setScale(k);layout.setText(phaseFont,shownPhase);float y=v.y+v.height-38*k,a=phaseFade*(1-f.dim*2);
            phaseFont.setColor(gold.r,gold.g,gold.b,a);phaseFont.draw(batch,shownPhase,v.x+(v.width-layout.width)*.5f,y);
            float rw=70*k,gap=22*k,ly=y-layout.height*.5f;batch.setColor(gold.r,gold.g,gold.b,.5f*a);
            batch.draw(pixel,v.x+(v.width-layout.width)*.5f-gap-rw,ly,rw,Math.max(1,k));batch.draw(pixel,v.x+(v.width+layout.width)*.5f+gap,ly,rw,Math.max(1,k));batch.setColor(Color.WHITE);}
        // Event toast, lower third.
        if(toastAge<2.6f&&!toast.isEmpty()&&f.dim<.2f){float a=toastAge<.3f?toastAge/.3f:toastAge>2.0f?1-(toastAge-2f)/.6f:1;toastFont.getData().setScale(k);layout.setText(toastFont,toast);
            float y=v.y+v.height*.18f+(1-a)*8*k;toastFont.setColor(0,0,0,.7f*a);toastFont.draw(batch,toast,v.x+(v.width-layout.width)*.5f+2*k,y-2*k);toastFont.setColor(ivory.r,ivory.g,ivory.b,a);toastFont.draw(batch,toast,v.x+(v.width-layout.width)*.5f,y);}
        // Verdict.
        verdictFade=f.verdict?Math.min(1,verdictFade+dt*.8f):0;
        if(verdictFade>0&&f.loser>=0){String who=f.names[f.loser%f.names.length];title.getData().setScale(k);layout.setText(title,"CURSED");float y=v.y+v.height*.86f;
            title.setColor(0,0,0,.8f*verdictFade);title.draw(batch,"CURSED",v.x+(v.width-layout.width)*.5f+3*k,y-3*k);title.setColor(crimson.r,crimson.g,crimson.b,verdictFade);title.draw(batch,"CURSED",v.x+(v.width-layout.width)*.5f,y);
            String sub=who+" HOLDS DEATH  ·  ALL OTHERS SURVIVE";phaseFont.getData().setScale(k);layout.setText(phaseFont,sub);phaseFont.setColor(ivory.r,ivory.g,ivory.b,verdictFade);phaseFont.draw(batch,sub,v.x+(v.width-layout.width)*.5f,y-110*k);}
        // Scene fade (entry from black and between phases).
        if(f.fade>0){batch.setColor(0,0,0,f.fade);batch.draw(pixel,v.x,v.y,v.width,v.height);}
        batch.setColor(Color.WHITE);
    }
    @Override public void dispose(){plate.dispose();status.dispose();phaseFont.dispose();title.dispose();toastFont.dispose();pixel.dispose();spot.dispose();spotSoft.dispose();}
}
