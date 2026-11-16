package com.erni.finalanswer.deaths;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.InputAdapter;
import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.audio.Sound;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.PolygonSpriteBatch;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.utils.Align;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.ui.UiFonts;
import com.erni.finalanswer.ui.lobby.cages.CageLobby;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/**
 * End of a mini-game: every player who died in it gets their own death, one after another, on a black stage — name,
 * anticipation, the impact with the cause slammed onto the screen, the aftermath. Any key skips to the next death.
 */
public final class DeathScreen extends ScreenAdapter {
    public record Death(String name,String characterId,DeathCause cause){}
    private static final float W=1920,H=1080,TAIL=.7f;

    private final List<Death> deaths;private final Runnable done;private final boolean ru;
    private final CageLobby source;private final boolean ownsSource;
    private final FitViewport view=new FitViewport(W,H);
    private final PolygonSpriteBatch batch=new PolygonSpriteBatch(2000);
    private final DeathTextures tex=new DeathTextures();
    private final BitmapFont nameFont=UiFonts.question(84),causeFont=UiFonts.question(130),small=UiFonts.nameplate(26);
    private final Map<DeathCause,Sound> hits=new EnumMap<>(DeathCause.class);private Sound heart;
    private int index=-1;private DeathActor actor;private float t;private boolean left,soundPlayed,heartPlayed;
    private long heartId=-1;

    /** @param source the room's character factory, or null to load one for this screen */
    public DeathScreen(List<Death> deaths,CageLobby source,boolean ru,Runnable done){
        this.deaths=List.copyOf(deaths);this.done=done;this.ru=ru;
        ownsSource=source==null;this.source=source!=null?source:new CageLobby();
        sound(DeathCause.SHOT,"models/shotgun/audio/fire.wav");sound(DeathCause.EXPLODED,"sounds/cursed_boxes/box_destroy_done.wav");
        sound(DeathCause.BURNED,"system_breach/sfx/firewall.wav");sound(DeathCause.CURSED,"sounds/cursed_boxes/horror_appearance.wav");
        var hb=Gdx.files.internal("sounds/cursed_boxes/heart_beating_done.wav");if(hb.exists())heart=Gdx.audio.newSound(hb);
        next();
    }
    private void sound(DeathCause c,String path){var f=Gdx.files.internal(path);if(f.exists())try{hits.put(c,Gdx.audio.newSound(f));}catch(RuntimeException ignored){}}
    private void next(){
        if(actor!=null){actor.dispose();actor=null;}
        if(heart!=null&&heartId>=0){heart.stop(heartId);heartId=-1;}
        index++;t=0;soundPlayed=heartPlayed=false;
        if(index>=deaths.size()){finish();return;}
        Death d=deaths.get(index);
        actor=new DeathActor(source.createCharacter(d.characterId()),source.presentation(d.characterId()),d.characterId(),d.cause(),(d.name()+d.characterId()).hashCode());
    }
    private void finish(){if(left)return;left=true;Gdx.app.postRunnable(done);}
    private float length(){return DeathActor.duration()+TAIL;}

    @Override public void show(){
        Gdx.input.setInputProcessor(new InputAdapter(){
            @Override public boolean keyDown(int k){if(actor!=null&&actor.impacted())next();return true;}
            @Override public boolean touchDown(int x,int y,int p,int b){if(actor!=null&&actor.impacted())next();return true;}
        });
    }
    @Override public void resize(int w,int h){view.update(w,h,true);}

    @Override public void render(float delta){
        float dt=Math.min(delta,1/20f);
        Gdx.gl.glClearColor(0,0,0,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
        if(actor==null)return;
        t+=dt;
        float since=t-DeathActor.IMPACT;var r=actor.recipe();
        if(!heartPlayed&&heart!=null&&t>.2f){heartPlayed=true;heartId=heart.play(.55f);}
        if(!soundPlayed&&since>=0){soundPlayed=true;if(heart!=null&&heartId>=0){heart.stop(heartId);heartId=-1;}Sound s=hits.get(r.cause);if(s!=null)s.play(.9f);}
        actor.update(dt,batch);
        if(t>=length()){next();if(actor==null)return;since=t-DeathActor.IMPACT;r=actor.recipe();}

        view.apply();
        float shake=since>=0&&since<r.shakeDur?r.shake*(1-since/r.shakeDur):0;
        float sx=MathUtils.sin(t*71)*shake,sy=MathUtils.cos(t*63)*shake*.7f;
        view.getCamera().position.set(W/2-sx,H/2-sy,0);view.getCamera().update();
        batch.setProjectionMatrix(view.getCamera().combined);
        float fade=Math.min(MathUtils.clamp(t/.45f,0,1),MathUtils.clamp((length()-t)/TAIL,0,1));
        float ax=W/2-DeathActor.W/2f,ay=150;

        // stage: a cold spotlight from above and its pool on the floor
        batch.begin();
        batch.setColor(.55f,.6f,.75f,.10f*fade);batch.draw(tex.soft,W/2-520,ay-40,1040,1300);
        batch.setColor(.85f,.85f,.95f,.20f*fade);batch.draw(tex.soft,W/2-380,ay+DeathActor.FLOOR-55,760,110);
        if(r.screenTint!=0&&since>-1){float k=MathUtils.clamp((since+1)/1f,0,1)*MathUtils.clamp((3.2f-since)/1.2f,0,1);
            batch.setColor(((r.screenTint>>>24)&0xff)/255f,((r.screenTint>>>16)&0xff)/255f,((r.screenTint>>>8)&0xff)/255f,.55f*k*fade);batch.draw(tex.soft,W/2-1100,ay-300,2200,1500);}
        batch.setColor(Color.WHITE);batch.end();

        actor.draw(batch,tex.shader,tex,ax,ay,fade);

        batch.begin();
        // impact flash over the whole screen
        if(since>=0&&since<.25f){float k=1-since/.25f;Color fc=new Color(r.flashColor);batch.setColor(fc.r,fc.g,fc.b,r.flash*k*k*fade);batch.draw(tex.pixel,-50,-50,W+100,H+100);}
        // vignette
        batch.setColor(0,0,0,1);
        Death d=deaths.get(index);
        float na=MathUtils.clamp((t-.15f)/.5f,0,1)*fade;
        nameFont.setColor(.93f,.9f,.86f,na);
        nameFont.draw(batch,d.name(),0,H-70,W,Align.center,false);
        small.setColor(.6f,.58f,.55f,na*.8f);
        small.draw(batch,(ru?"ПОГИБ  ":"DIED  ")+(index+1)+" / "+deaths.size(),0,H-175,W,Align.center,false);
        if(since>=0){float k=MathUtils.clamp(since/.18f,0,1);float punch=1+.6f*(1-k)*(1-k);
            causeFont.getData().setScale(punch);
            Color cc=switch(d.cause()){case SHOT->new Color(.92f,.1f,.12f,1);case BURNED->new Color(1,.5f,.12f,1);case EXPLODED->new Color(1,.8f,.3f,1);case CURSED->new Color(.72f,.45f,1,1);};
            causeFont.setColor(0,0,0,.7f*fade*k);causeFont.draw(batch,ru?d.cause().ru:d.cause().en,6,ay+120-6,W,Align.center,false);
            causeFont.setColor(cc.r,cc.g,cc.b,fade*k);causeFont.draw(batch,ru?d.cause().ru:d.cause().en,0,ay+120,W,Align.center,false);
            causeFont.getData().setScale(1);}
        batch.setColor(Color.WHITE);batch.end();
    }

    @Override public void hide(){Gdx.input.setInputProcessor(null);if(heart!=null&&heartId>=0){heart.stop(heartId);heartId=-1;}}
    @Override public void dispose(){
        if(actor!=null)actor.dispose();batch.dispose();tex.dispose();nameFont.dispose();causeFont.dispose();small.dispose();
        for(Sound s:hits.values())s.dispose();if(heart!=null)heart.dispose();if(ownsSource)source.dispose();
    }
}
