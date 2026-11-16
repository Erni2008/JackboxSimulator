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
    private final DeathTextures tex=new DeathTextures();private final DeathPost post=new DeathPost();
    private final com.badlogic.gdx.graphics.OrthographicCamera camera=new com.badlogic.gdx.graphics.OrthographicCamera(W,H),fixed=new com.badlogic.gdx.graphics.OrthographicCamera(W,H);
    {fixed.position.set(W/2,H/2,0);fixed.update();}
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
        actor=new DeathActor(source.createCharacter(d.characterId()),source.presentation(d.characterId()),d.characterId(),d.cause(),(d.name()+d.characterId()).hashCode());actor.woundTex=tex.dot;
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

    /** Hit-stop on the impact, then slow motion easing back to real time. */
    private float timeScale(float since){
        if(since<0||since>.9f)return 1;
        if(since<.07f)return .06f;
        return MathUtils.lerp(.28f,1,MathUtils.clamp((since-.07f)/.83f,0,1));
    }
    @Override public void render(float delta){
        float real=Math.min(delta,1/20f);
        Gdx.gl.glClearColor(0,0,0,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
        if(actor==null)return;
        float dt=real*timeScale(t-DeathActor.IMPACT);
        t+=dt;post.time+=real;
        float since=t-DeathActor.IMPACT;var r=actor.recipe();
        if(!heartPlayed&&heart!=null&&t>.2f){heartPlayed=true;heartId=heart.play(.55f);}
        if(!soundPlayed&&since>=0){soundPlayed=true;if(heart!=null&&heartId>=0){heart.stop(heartId);heartId=-1;}Sound s=hits.get(r.cause);if(s!=null)s.play(.9f);}
        actor.update(dt,batch);
        if(t>=length()){next();if(actor==null)return;since=t-DeathActor.IMPACT;r=actor.recipe();}

        float fade=Math.min(MathUtils.clamp(t/.45f,0,1),MathUtils.clamp((length()-t)/TAIL,0,1));
        float ax=W/2-DeathActor.W/2f,ay=150;
        float hitX=W/2+r.hitX*DeathActor.CHAR_H,hitY=ay+DeathActor.FLOOR+r.hitY*DeathActor.CHAR_H;

        // camera: a slow push-in during the anticipation, a punch on the impact, a hand-held settle
        float push=MathUtils.clamp(t/DeathActor.IMPACT,0,1);push=push*push*(3-2*push);
        float punch=since>=0?(float)Math.exp(-since*5)*.07f:0;
        float zoom=1/(1+.05f*push+punch-(since>0?.03f*MathUtils.clamp(since/2.5f,0,1):0));
        float shake=since>=0&&since<r.shakeDur?r.shake*(1-since/r.shakeDur)*(1-since/r.shakeDur):0;
        float sx=(MathUtils.sin(t*71)+.5f*MathUtils.sin(t*37))*shake,sy=(MathUtils.cos(t*63)+.5f*MathUtils.cos(t*29))*shake*.7f;
        float drift=MathUtils.sin(post.time*.7f)*3;
        float focusX=MathUtils.lerp(W/2,hitX,.25f*push),focusY=MathUtils.lerp(H/2,hitY,.18f*push);
        camera.zoom=zoom;camera.position.set(focusX-sx+drift,focusY-sy,0);camera.update();
        batch.setProjectionMatrix(camera.combined);

        post.begin();
        // stage: a cold spotlight from above, a pool of light on the floor, fire light when something burns
        batch.begin();
        batch.setColor(.5f,.56f,.72f,.12f*fade);batch.draw(tex.soft,W/2-560,ay-60,1120,1350);
        batch.setColor(.8f,.82f,.92f,.22f*fade);batch.draw(tex.soft,W/2-420,ay+DeathActor.FLOOR-60,840,120);
        batch.setColor(.08f,.08f,.1f,fade);batch.draw(tex.pixel,-400,-400,W+800,ay+DeathActor.FLOOR+400);
        batch.setColor(.6f,.62f,.7f,.08f*fade);batch.draw(tex.soft,W/2-700,ay+DeathActor.FLOOR-90,1400,180);
        if(r.screenTint!=0&&since>-1){float k=MathUtils.clamp(since+1,0,1)*MathUtils.clamp((3.2f-since)/1.2f,0,1);
            batch.setColor(((r.screenTint>>>24)&0xff)/255f,((r.screenTint>>>16)&0xff)/255f,((r.screenTint>>>8)&0xff)/255f,.6f*k*fade);batch.draw(tex.soft,W/2-1100,ay-300,2200,1500);}
        float fire=actor.fireLevel(since);
        if(fire>0){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);Color fc=new Color(r.fireColor);float fl=fire*(.8f+.2f*MathUtils.sin(post.time*23));
            batch.setColor(fc.r,fc.g,fc.b,.32f*fl*fade);batch.draw(tex.soft,W/2-700,ay-200,1400,1100);
            batch.setColor(fc.r,fc.g*.8f,fc.b*.6f,.4f*fl*fade);batch.draw(tex.soft,W/2-420,ay+DeathActor.FLOOR-80,840,160);
            batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        batch.setColor(Color.WHITE);batch.end();

        actor.draw(batch,tex.shader,tex,ax,ay,fade);

        batch.begin();
        if(since>=0&&since<.2f){float k=1-since/.2f;Color fc=new Color(r.flashColor);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
            batch.setColor(fc.r,fc.g,fc.b,r.flash*k*k*k*fade*.45f);batch.draw(tex.soft,hitX-700,hitY-700,1400,1400);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        batch.setColor(Color.WHITE);batch.end();

        // titles sit outside the camera move
        batch.setProjectionMatrix(fixed.combined);batch.begin();
        Death d=deaths.get(index);
        float na=MathUtils.clamp((t-.15f)/.5f,0,1)*fade;
        nameFont.setColor(.93f,.9f,.86f,na);nameFont.draw(batch,d.name(),0,H-70,W,Align.center,false);
        small.setColor(.6f,.58f,.55f,na*.8f);small.draw(batch,(ru?"ПОГИБ  ":"DIED  ")+(index+1)+" / "+deaths.size(),0,H-175,W,Align.center,false);
        if(since>=0){float k=MathUtils.clamp(since/.22f,0,1);float sc=1+.35f*(1-k)*(1-k)*(1-k);
            causeFont.getData().setScale(sc);
            Color cc=switch(d.cause()){case SHOT->new Color(.92f,.1f,.12f,1);case BURNED->new Color(1,.5f,.12f,1);case EXPLODED->new Color(1,.8f,.3f,1);case CURSED->new Color(.72f,.45f,1,1);};
            String word=ru?d.cause().ru:d.cause().en;float base=125+causeFont.getCapHeight()*sc*.5f;
            causeFont.setColor(0,0,0,.75f*fade*k);causeFont.draw(batch,word,7,base-7,W,Align.center,false);
            causeFont.setColor(cc.r,cc.g,cc.b,fade*k);causeFont.draw(batch,word,0,base,W,Align.center,false);
            causeFont.getData().setScale(1);}
        batch.setColor(Color.WHITE);batch.end();
        post.end();

        // post: shockwave, chromatic split, bloom, grain; the world drains of colour after the death
        post.cx=(hitX-(camera.position.x-W/2*zoom))/(W*zoom);post.cy=(hitY-(camera.position.y-H/2*zoom))/(H*zoom);
        boolean blast=r.cause==DeathCause.EXPLODED||r.shockwave;
        post.shock=since>=0&&since<.9f?since*(blast?1.3f:.9f):-1;post.shockStrength=since>=0?(1-since/.9f)*(blast?1.2f:.45f):0;
        post.aberration=since>=0?(float)Math.exp(-since*6)*(blast?1.0f:.6f):(since>-.5f?.25f*(since+.5f)/.5f:0);
        post.desat=since>0?.45f*MathUtils.clamp((since-.6f)/1.6f,0,1):0;
        view.apply();post.present(batch);
    }

    @Override public void hide(){Gdx.input.setInputProcessor(null);if(heart!=null&&heartId>=0){heart.stop(heartId);heartId=-1;}}
    @Override public void dispose(){
        if(actor!=null)actor.dispose();batch.dispose();tex.dispose();post.dispose();nameFont.dispose();causeFont.dispose();small.dispose();
        for(Sound s:hits.values())s.dispose();if(heart!=null)heart.dispose();if(ownsSource)source.dispose();
    }
}
