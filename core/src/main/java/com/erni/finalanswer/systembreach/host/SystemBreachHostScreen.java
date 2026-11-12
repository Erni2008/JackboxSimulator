package com.erni.finalanswer.systembreach.host;

import com.badlogic.gdx.*;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.ui.lobby.cages.CageLobby;
import com.google.gson.JsonObject;
import java.util.List;
import java.util.function.Consumer;
import static com.erni.finalanswer.systembreach.host.SystemBreachLayout.*;

/**
 * SYSTEM BREACH host screen. Read-only: every value comes from the server snapshot through
 * {@link SystemBreachHostViewModel}; this class only orders the passes.
 * <p>Pass order: background → background light → characters → panels/icons (shapes) → additive glow → text.
 */
public final class SystemBreachHostScreen extends ScreenAdapter {
    private final FitViewport viewport=new FitViewport(W,H);
    private final SpriteBatch batch=new SpriteBatch();
    private final ShapeRenderer shapes=new ShapeRenderer();
    private final SystemBreachHostAssets assets;
    private final SbPaint paint=new SbPaint(shapes);
    private final SystemBreachHostViewModel model;
    private final PlayerPodium podium=new PlayerPodium();
    private final PodiumCharacters characters;
    private final TimerPanel timer=new TimerPanel();
    private final SystemBreachTitle title=new SystemBreachTitle();
    private final EventLogPanel log=new EventLogPanel();
    private final LeaderboardPanel board=new LeaderboardPanel();
    private final Consumer<String> end;
    private final HackerFx fx=new HackerFx();
    private float time;private static final com.badlogic.gdx.graphics.Color VIG=new com.badlogic.gdx.graphics.Color(0,0,0,.55f),CLEAR=new com.badlogic.gdx.graphics.Color(0,0,0,0);

    public SystemBreachHostScreen(JsonObject root,CageLobby roomCharacters,Consumer<String> end){this(root,roomCharacters,end,false);}
    /** @param russian host language from the game settings; labels and log lines follow it. */
    public SystemBreachHostScreen(JsonObject root,CageLobby roomCharacters,Consumer<String> end,boolean russian){
        assets=new SystemBreachHostAssets(russian);model=new SystemBreachHostViewModel(russian);this.end=end;characters=new PodiumCharacters(roomCharacters,assets);apply(root);
    }
    /** Called on the render thread with each room snapshot. */
    public void apply(JsonObject root){model.apply(root);}

    @Override public void show(){Gdx.input.setInputProcessor(new InputAdapter(){@Override public boolean keyDown(int key){
        if(key==Input.Keys.ENTER&&model.finished()){end.accept(model.sessionId());return true;}return false;}});}
    @Override public void resize(int width,int height){viewport.update(width,height,true);}

    @Override public void render(float delta){
        float dt=Float.isFinite(delta)?Math.min(delta,.1f):0;time+=dt;model.update(dt);
        ScreenUtils.clear(0,0,0,1,true);viewport.apply();
        batch.setProjectionMatrix(viewport.getCamera().combined);shapes.setProjectionMatrix(viewport.getCamera().combined);
        List<SystemBreachHostViewModel.Slot> slots=model.slots();int n=slots.size();
        String winner=model.results()?model.winnerId():"";

        batch.begin();batch.setColor(1,1,1,1);batch.draw(assets.background,0,0,W,H);
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);atmosphere();motes();batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        batch.setColor(0,0,0,.35f);batch.draw(assets.glow,W/2-1100,PANEL_Y-260,2200,700);batch.setColor(1,1,1,1);   // soft shade the line-up stands in
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        for(int i=0;i<n;i++){var s=slots.get(i);var c=podium.accent(s);float x=slotX(i,n),k=s.status==SystemBreachHostViewModel.Status.DISCONNECTED?.3f:1;
            batch.setColor(.9f*k,.85f*k,.8f*k,.10f);batch.draw(assets.glow,x-150,panelTop()-40,300,420);
            batch.setColor(c.r,c.g,c.b,.14f*k);batch.draw(assets.glow,x-120,panelTop()-30,240,200);
            if(s.leader||s.id.equals(winner)){float pl=.75f+.25f*MathUtils.sin(time*2.4f);batch.setColor(1,.75f,.25f,.30f*pl);batch.draw(assets.glow,x-170,panelTop()-40,340,380);}}
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        for(int i=0;i<n;i++)characters.draw(batch,slots.get(i),slotX(i,n),time+i*.37f,dt,slots.get(i).id.equals(winner));
        batch.setColor(1,1,1,1);batch.end();

        Gdx.gl.glEnable(GL20.GL_BLEND);Gdx.gl.glBlendFunc(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        shapes.begin(ShapeRenderer.ShapeType.Filled);
        {var dk=VIG;var cl=CLEAR;shapes.rect(0,H-260,W,260,cl,cl,dk,dk);shapes.rect(0,0,W,220,dk,dk,cl,cl);shapes.rect(0,0,220,H,dk,cl,cl,dk);shapes.rect(W-220,0,220,H,cl,dk,dk,cl);}
        for(int i=0;i<n;i++)podium.shapes(paint,shapes,slots.get(i),slotX(i,n),time);
                fx.scanlines(shapes,TIMER.x+20,TIMER.y+20,TIMER.width-40,TIMER.height-40,.12f,time);fx.scanlines(shapes,LOG.x+20,LOG.y+20,LOG.width-40,LOG.height-40,.12f,time+2);
        fx.attackLinks(shapes,model.attacks(),model,n,time);
        timer.shapes(paint,model,time);title.shapes(paint,shapes,time);log.shapes(paint,model);board.shapes(paint,shapes,model);toastShape();
        shapes.end();

        batch.begin();batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        for(int i=0;i<n;i++)podium.glow(batch,assets,slots.get(i),slotX(i,n),time);
        // a glint travels along the line-up's glass every few seconds
        {float t=(time%7f)/1.6f;if(t<1&&n>0){float x0=slotX(0,n)-PANEL_W/2,x1=slotX(n-1,n)+PANEL_W/2,gx=x0+(x1-x0)*t,a=MathUtils.sin(t*MathUtils.PI);
            batch.setColor(1,1,1,.18f*a);batch.draw(assets.glow,gx-40,PANEL_Y+10,80,PANEL_H-20);batch.setColor(.6f,1,.8f,.12f*a);batch.draw(assets.glow,gx-110,PANEL_Y-20,220,PANEL_H+40);}}
        fx.attackGlow(batch,assets,model.attacks(),model,n,time);timer.glow(batch,assets,model,time);title.glow(batch,assets,time);
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);batch.setColor(1,1,1,1);
        for(int i=0;i<n;i++)podium.text(batch,paint,assets,slots.get(i),slotX(i,n),time);
        timer.text(batch,paint,assets,model,time);title.text(batch,paint,assets,time);log.text(batch,paint,assets,model);board.text(batch,paint,assets,model);
        toastText();
        long left=model.remainingMs();if(model.phase().equals("ACTIVE")&&left>0&&left<=10_000){float a=(.18f+.12f*MathUtils.sin(time*6.3f))*(1-left/10_000f*.5f);
            batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(1,.08f,.05f,a);batch.draw(assets.glow,-500,-300,900,1680);batch.draw(assets.glow,W-400,-300,900,1680);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);batch.setColor(1,1,1,1);}
        batch.end();
        batch.begin();
        batch.end();
    }

    /** Data motes drifting up through the hall: cheap, deterministic, no allocation. */
    private void motes(){
        for(int i=0;i<46;i++){float sp=18+(i*37%23),x=(i*173.3f)%W+MathUtils.sin(time*.4f+i)*14,y=((time*sp+i*97)%(H+40))-20;
            float a=.10f+.10f*MathUtils.sin(time*2+i*1.7f),sz=i%5==0?4:2.5f;
            batch.setColor(i%7==0?1:.35f,i%7==0?.3f:.95f,i%7==0?.2f:.55f,a);batch.draw(assets.pixel,x,y,sz,sz);}
    }
    /** Light that lives in the photo: lantern flicker, window breathing and a slow drift of floor haze. */
    /** Two slow light shafts falling from the arched windows, breathing out of phase. */
    private void shafts(){
        for(int i=0;i<2;i++){float cx=i==0?520:1400,a=.07f+.04f*MathUtils.sin(time*.6f+i*2.1f),sway=MathUtils.sin(time*.23f+i)*30;
            for(int k=0;k<6;k++){float y=900-k*110,w=150+k*55;batch.setColor(1,.25f,.2f,a*(1-k/7f));batch.draw(assets.glow,cx+sway*(k/6f)+(i==0?k*28:-k*28)-w/2,y-80,w,200);}}
    }
    /** Embers rising through the hall from the floor. */
    private void embers(){
        for(int i=0;i<26;i++){float sp=26+(i*13%17),x=(i*211.7f)%W+MathUtils.sin(time*.8f+i*1.3f)*24,y=((time*sp+i*131)%(H*.75f));float life=y/(H*.75f),a=(1-life)*(.55f+.45f*MathUtils.sin(time*9+i));
            float s=i%4==0?6:3.5f;batch.setColor(1,.45f+.25f*(i%3)/2f,.15f,a*.8f);batch.draw(assets.glow,x-s*2,y-s*2,s*4,s*4);batch.setColor(1,.85f,.55f,a);batch.draw(assets.pixel,x-s/4,y-s/4,s/2,s/2);}
    }
    private void atmosphere(){
        shafts();embers();
        float f1=.8f+.12f*MathUtils.sin(time*9.1f)+.08f*MathUtils.sin(time*23.7f),f2=.8f+.12f*MathUtils.sin(time*8.3f+1.7f)+.08f*MathUtils.sin(time*19.1f);
        batch.setColor(1,.62f,.25f,.22f*f1);batch.draw(assets.glow,153-110,736-110,220,220);
        batch.setColor(1,.62f,.25f,.22f*f2);batch.draw(assets.glow,1768-110,736-110,220,220);
        float w=.10f+.04f*MathUtils.sin(time*.7f);batch.setColor(1,.1f,.08f,w);batch.draw(assets.glow,250,560,420,420);batch.draw(assets.glow,1250,560,420,420);
        for(int i=0;i<5;i++){float x=((time*14+i*430)%2400)-240;batch.setColor(.85f,.55f,.6f,.05f);batch.draw(assets.glow,x,260+(i%3)*30,520,150);}
    }

    /** Centre-stage banner: slides in with an overshoot, holds, slides out. */
    private float toastK(){float t=model.toastAge();if(t>3.6f||model.toast().isEmpty())return 0;
        float in=Math.min(1,t/.28f),out=t>3.2f?1-(t-3.2f)/.4f:1;float o=1+.12f*MathUtils.sin(in*MathUtils.PI);return Math.max(0,in*out)*o;}
    private final com.badlogic.gdx.graphics.Color toastTop=new com.badlogic.gdx.graphics.Color();private static final com.badlogic.gdx.graphics.Color TOAST_BOTTOM=new com.badlogic.gdx.graphics.Color(.02f,.02f,.02f,.97f);
    private static final float TOAST_Y=690,TOAST_H=64;
    /** Results: the winner's plate over the line-up. */
    private void winnerBanner(){
        var w=model.ranking().getFirst();float k=Math.min(1,time%1000>0?1:0),cx=W/2,y=TOAST_Y-6,bw=Math.max(620,paint.width(assets.board,w.name)+360);
        Gdx.gl.glEnable(GL20.GL_BLEND);shapes.begin(ShapeRenderer.ShapeType.Filled);
        paint.frame(cx-bw/2,y,bw,96,24,SbPaint.GOLD,.9f);paint.crown(cx,y+100,56,SbPaint.GOLD);shapes.end();
        batch.begin();paint.centered(batch,assets.label,model.ru()?"СИСТЕМА ЗАХВАЧЕНА":"SYSTEM OWNED BY",cx,y+84,SbPaint.GOLD,k);
        paint.centered(batch,assets.board,paint.fit(assets.board,w.name+"   "+w.ap+" AP",bw-60),cx,y+46,SbPaint.IVORY,k);batch.end();
    }
    private void toastShape(){float k=toastK();if(k<=0)return;float w=Math.min(1040,paint.width(assets.board,model.toast())+180)*Math.min(1,k);
        var c=SbPaint.tone(model.toastTone());float x=W/2-w/2;
        shapes.setColor(0,0,0,.55f*Math.min(1,k));shapes.rect(x-10,TOAST_Y-14,w+20,TOAST_H+20);
        paint.plate(x,TOAST_Y-4,w,TOAST_H+8,22,SbPaint.TRIM,SbPaint.TRIM_DARK);paint.plate(x+5,TOAST_Y+1,w-10,TOAST_H-2,18,toastTop.set(c.r*.25f,c.g*.25f,c.b*.25f,.97f),TOAST_BOTTOM);
        paint.outline(x+10,TOAST_Y+6,w-20,TOAST_H-12,14,2.2f,c);
        for(int s=-1;s<=1;s+=2){float ex=W/2+s*(w/2+26);shapes.setColor(c);shapes.triangle(ex,TOAST_Y+TOAST_H/2,ex-s*22,TOAST_Y+TOAST_H/2+16,ex-s*22,TOAST_Y+TOAST_H/2-16);}}
    private void toastText(){float k=toastK();if(k<.6f)return;var c=SbPaint.tone(model.toastTone());
        paint.centered(batch,assets.board,paint.fit(assets.board,model.toast(),980),W/2,TOAST_Y+TOAST_H/2+assets.board.getCapHeight()/2+2,c.r+c.g+c.b>2?SbPaint.IVORY:SbPaint.IVORY,Math.min(1,(k-.6f)/.3f));}

    @Override public void dispose(){batch.dispose();shapes.dispose();assets.dispose();}
}
