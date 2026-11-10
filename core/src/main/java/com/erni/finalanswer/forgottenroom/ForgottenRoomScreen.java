package com.erni.finalanswer.forgottenroom;

import com.badlogic.gdx.*;
import com.badlogic.gdx.audio.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.audio.AudioMix;
import com.google.gson.JsonObject;
import java.util.*;
import java.util.function.*;

/**
 * THE FORGOTTEN ROOM on the host's shared screen. The room server owns every phase and timer; this screen only
 * renders the latest snapshot against the server clock: title card → 10 s observation → blackout → lights return →
 * answers (who has answered, never what) → reveal, change by change → results. ENTER/ESC on the results returns
 * the room to the lobby.
 */
public final class ForgottenRoomScreen extends ScreenAdapter {
    private final OrthographicCamera camera=new OrthographicCamera();private final FitViewport viewport=new FitViewport(ForgottenRoomRenderer.W,ForgottenRoomRenderer.H,camera);
    private SpriteBatch batch;private ForgottenRoomArt art;private ForgottenRoomRenderer room;private ForgottenRoomHud hud;private BitmapFont title,body,label;
    private ForgottenRoomModel model;private final LongSupplier serverNow;private final Consumer<ForgottenRoomModel> onEnd;
    private String lastPhase="";private float phaseClock;private final Map<String,Sound> sounds=new HashMap<>();private Music ambience;
    private com.erni.finalanswer.ui.effects.CinematicPost post;private boolean created;private int lastSecond=-1,lastRevealStep=-1;
    private final List<ForgottenRoomModel.Obj> empty=List.of();

    /** @param serverNow the room server's clock (ms); @param onEnd called when the host leaves the results. */
    public ForgottenRoomScreen(JsonObject snapshot,LongSupplier serverNow,Consumer<ForgottenRoomModel> onEnd){
        this.serverNow=serverNow;this.onEnd=onEnd;model=new ForgottenRoomModel(snapshot);
    }
    public String session(){return model.session;}
    public String phase(){return model.phase;}
    /** New server state; safe to call from the render thread only. */
    public void apply(JsonObject snapshot){if(!snapshot.has("forgottenRoom"))return;model=new ForgottenRoomModel(snapshot);if(art!=null)art.preload(model);}

    @Override public void show(){
        if(!created){created=true;batch=new SpriteBatch();art=new ForgottenRoomArt();
            title=com.erni.finalanswer.ui.UiFonts.gothic(72);body=com.erni.finalanswer.ui.UiFonts.gothic(38);label=com.erni.finalanswer.ui.UiFonts.nameplate(26);
            room=new ForgottenRoomRenderer(art,label);post=new com.erni.finalanswer.ui.effects.CinematicPost();hud=new ForgottenRoomHud(art,title,body);art.preload(model);loadAudio();}
        Gdx.input.setInputProcessor(new InputAdapter(){@Override public boolean keyDown(int k){
            if((k==Input.Keys.ENTER||k==Input.Keys.ESCAPE)&&model.phase.equals("RESULTS")){onEnd.accept(model);return true;}return false;}});
        if(ambience!=null){ambience.setLooping(true);ambience.setVolume(.55f*AudioMix.GLOBAL.gain(AudioMix.Category.ENVIRONMENT));ambience.play();}
    }
    @Override public void hide(){if(ambience!=null)ambience.pause();}
    @Override public void resize(int w,int h){viewport.update(w,h,true);}

    /** Seconds since the current phase began, on the server clock. */
    private float elapsed(){return Math.max(0,(serverNow.getAsLong()-model.phaseStartedAt)/1000f);}
    private float remaining(){return model.phaseEndsAt<=0?0:Math.max(0,(model.phaseEndsAt-serverNow.getAsLong())/1000f);}
    private float fraction(){float total=(model.phaseEndsAt-model.phaseStartedAt)/1000f;return total<=0?0:MathUtils.clamp(remaining()/total,0,1);}

    @Override public void render(float delta){
        if(!model.phase.equals(lastPhase)){onPhase(model.phase);lastPhase=model.phase;}
        phaseClock+=delta;room.update(delta);post.update(delta);AudioMix.GLOBAL.update(delta);
        ScreenUtils.clear(0,0,0,1);viewport.apply();post.begin(viewport.getScreenWidth(),viewport.getScreenHeight());batch.setProjectionMatrix(camera.combined);batch.begin();
        float t=elapsed();
        switch(model.phase){
            case "INTRO"->{room.drawRoom(batch,model,model.objects,1);room.darkness(batch,1-ForgottenRoomHud.ease(t/2.2f)*.85f);hud.intro(batch,t,model.roomName);}
            case "OBSERVATION"->{room.drawRoom(batch,model,model.objects,1);int s=(int)Math.ceil(remaining());tick(s);hud.observation(batch,fraction(),s,1);}
            case "BLACKOUT"->{room.drawRoom(batch,model,empty,1);room.darkness(batch,blackout(t));}
            case "CHANGED_ROOM"->{room.drawRoom(batch,model,model.objects,1);room.darkness(batch,lightsReturn(t));hud.changedRoom(batch,t);}
            case "ANSWER_PHASE"->{room.drawRoom(batch,model,model.objects,1);int s=(int)Math.ceil(remaining());tick(s);hud.answering(batch,model,fraction(),s);}
            case "REVEAL"->reveal(t);
            case "RESULTS"->{room.drawRoom(batch,model,model.objects,1);hud.results(batch,model,t);}
            default->room.drawRoom(batch,model,model.objects,1);
        }
        batch.end();
        post.end(viewport.getScreenX(),viewport.getScreenY(),viewport.getScreenWidth(),viewport.getScreenHeight());
    }
    /** Lights die with two short stutters, then total darkness. */
    private static float blackout(float t){if(t<.08f)return .85f;if(t<.14f)return .2f;if(t<.22f)return 1;if(t<.27f)return .55f;return 1;}
    /** Lights return the same way: a flicker, then the room. */
    private static float lightsReturn(float t){if(t<.06f)return .4f;if(t<.12f)return 1;if(t<.18f)return .25f;if(t<.26f)return .8f;return Math.max(0,.3f*(1-(t-.26f)/.5f));}

    private void reveal(float t){
        float intro=model.revealIntroMs/1000f,step=Math.max(.5f,model.revealStepMs/1000f);
        if(t<intro){room.drawRoom(batch,model,model.objects,1);room.darkness(batch,.55f*ForgottenRoomHud.ease(t/.6f));hud.revealTitle(batch,t);return;}
        int index=Math.min(model.changes.size()-1,(int)((t-intro)/step));if(index<0){room.drawRoom(batch,model,model.objects,1);return;}
        float u=MathUtils.clamp((t-intro-index*step)/step,0,1);var c=model.changes.get(index);
        if(index!=lastRevealStep){lastRevealStep=index;play(c.foundBy().isEmpty()?"reveal_missed":"reveal_found");}
        // the changed room, dimmed, with this change lit and acted out
        List<ForgottenRoomModel.Obj> others=new ArrayList<>(model.objects);others.removeIf(o->o.id().equals(c.objectId()));
        room.drawRoom(batch,model,others,1);room.darkness(batch,.5f);
        for(String slot:c.slots())room.spotlight(batch,model,slot,ForgottenRoomHud.ease(u/.25f));
        actOut(c,u);
        hud.revealCaption(batch,model,c,index,u);
    }
    /** Shows what happened: the original state as a cold ghost, then the change itself. */
    private void actOut(ForgottenRoomModel.Change c,float u){
        float before=ForgottenRoomHud.ease((u-.08f)/.18f)*(1-ForgottenRoomHud.ease((u-.72f)/.18f));
        switch(c.type()){
            case "DISAPPEARED"->{room.drawObject(batch,model,c.before(),before,true);}
            case "APPEARED"->{float pulse=.75f+.25f*MathUtils.sin(phaseClock*6);room.drawObject(batch,model,c.after(),ForgottenRoomHud.ease((u-.2f)/.3f)*pulse+.25f,false);}
            case "MOVED"->{room.drawObject(batch,model,c.before(),before,true);trail(c,ForgottenRoomHud.ease((u-.3f)/.35f));room.drawObject(batch,model,c.after(),1,false);}
            case "ROTATED"->{float k=ForgottenRoomHud.ease((u-.2f)/.45f);float from=c.before().rotated()?1:0,to=c.after().rotated()?1:0;
                // play the original pose first, then turn into the new one
                room.drawObject(batch,model,c.after(),1,false,MathUtils.lerp(from,to,k));}
            case "CHANGED"->{float k=ForgottenRoomHud.ease((u-.25f)/.4f);room.drawObject(batch,model,c.before(),1-k,false);room.drawObject(batch,model,c.after(),k,false);}
            case "TOGGLED"->{boolean show=u<.25f||u>.62f||((int)(u*28))%2==0;room.drawObject(batch,model,show&&u>.25f?c.after():c.before(),1,false);}
            default->{if(c.after()!=null)room.drawObject(batch,model,c.after(),1,false);}
        }
    }
    /** A path of small gilt diamonds from the old place to the new one. */
    private void trail(ForgottenRoomModel.Change c,float k){
        var a=model.places.get(c.before().slot());var b=model.places.get(c.after().slot());if(a==null||b==null||k<=0)return;
        float ax=a.x()*1920,ay=(1-a.y())*1080+50,bx=b.x()*1920,by=(1-b.y())*1080+50;int n=18;
        for(int i=0;i<=n*k;i++){float s=i/(float)n;float x=MathUtils.lerp(ax,bx,s),y=MathUtils.lerp(ay,by,s)+MathUtils.sin(s*MathUtils.PI)*90;hud.diamond(batch,x,y,5,ForgottenRoomHud.GOLD,.85f);}
    }
    private void tick(int second){if(second!=lastSecond){lastSecond=second;if(second<=5&&second>0)play(model.phase.equals("OBSERVATION")?"clock_tick":"timer_warning");}}
    private void onPhase(String phase){
        phaseClock=0;lastSecond=-1;lastRevealStep=-1;
        switch(phase){case "BLACKOUT"->play("blackout");case "CHANGED_ROOM"->play("lights_return");case "RESULTS"->play("results");default->{}}
    }
    // ---------- optional audio: missing files are skipped silently (see docs/forgotten-room/ASSETS.md) ----------
    private void loadAudio(){
        for(String n:new String[]{"blackout","lights_return","timer_warning","clock_tick","submit","reveal_found","reveal_missed","results"}){
            var f=Gdx.files.internal("forgotten_room/audio/"+n+".ogg");if(f.exists())try{sounds.put(n,Gdx.audio.newSound(f));}catch(RuntimeException e){Gdx.app.error("ForgottenRoom","sound "+n+": "+e.getMessage());}}
        var amb=Gdx.files.internal("forgotten_room/audio/ambience_loop.ogg");if(amb.exists())try{ambience=Gdx.audio.newMusic(amb);}catch(RuntimeException e){ambience=null;}
    }
    private void play(String name){var s=sounds.get(name);if(s!=null)s.play(.8f*AudioMix.GLOBAL.gain(AudioMix.Category.SFX));}

    @Override public void dispose(){
        if(!created)return;batch.dispose();post.dispose();art.close();title.dispose();body.dispose();label.dispose();
        for(Sound s:sounds.values())s.dispose();sounds.clear();if(ambience!=null)ambience.dispose();
    }
}
