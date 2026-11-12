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
    private final SystemBreachHostAssets assets=new SystemBreachHostAssets();
    private final SbPaint paint=new SbPaint(shapes);
    private final SystemBreachHostViewModel model=new SystemBreachHostViewModel();
    private final PlayerPodium podium=new PlayerPodium();
    private final PodiumCharacters characters;
    private final TimerPanel timer=new TimerPanel();
    private final SystemBreachTitle title=new SystemBreachTitle();
    private final EventLogPanel log=new EventLogPanel();
    private final LeaderboardPanel board=new LeaderboardPanel();
    private final Consumer<String> end;
    private float time;

    public SystemBreachHostScreen(JsonObject root,CageLobby roomCharacters,Consumer<String> end){
        this.end=end;characters=new PodiumCharacters(roomCharacters,assets);apply(root);
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
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);atmosphere();batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        batch.setColor(0,0,0,.35f);batch.draw(assets.glow,W/2-1100,PANEL_Y-260,2200,700);batch.setColor(1,1,1,1);   // soft shade the line-up stands in
        for(int i=0;i<n;i++)characters.draw(batch,slots.get(i),slotX(i,n),time+i*.37f,dt,slots.get(i).id.equals(winner));
        batch.setColor(1,1,1,1);batch.end();

        Gdx.gl.glEnable(GL20.GL_BLEND);Gdx.gl.glBlendFunc(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        shapes.begin(ShapeRenderer.ShapeType.Filled);
        for(int i=0;i<n;i++)podium.shapes(paint,shapes,slots.get(i),slotX(i,n),time);
        timer.shapes(paint,model,time);title.shapes(paint,shapes,time);log.shapes(paint,model);board.shapes(paint,shapes,model);
        shapes.end();

        batch.begin();batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        for(int i=0;i<n;i++)podium.glow(batch,assets,slots.get(i),slotX(i,n),time);
        timer.glow(batch,assets,model,time);title.glow(batch,assets,time);
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);batch.setColor(1,1,1,1);
        for(int i=0;i<n;i++)podium.text(batch,paint,assets,slots.get(i),slotX(i,n),time);
        timer.text(batch,paint,assets,model,time);title.text(batch,paint,assets,time);log.text(batch,paint,assets,model);board.text(batch,paint,assets,model);
        batch.end();
    }

    /** Light that lives in the photo: lantern flicker, window breathing and a slow drift of floor haze. */
    private void atmosphere(){
        float f1=.8f+.12f*MathUtils.sin(time*9.1f)+.08f*MathUtils.sin(time*23.7f),f2=.8f+.12f*MathUtils.sin(time*8.3f+1.7f)+.08f*MathUtils.sin(time*19.1f);
        batch.setColor(1,.62f,.25f,.22f*f1);batch.draw(assets.glow,153-110,736-110,220,220);
        batch.setColor(1,.62f,.25f,.22f*f2);batch.draw(assets.glow,1768-110,736-110,220,220);
        float w=.10f+.04f*MathUtils.sin(time*.7f);batch.setColor(1,.1f,.08f,w);batch.draw(assets.glow,250,560,420,420);batch.draw(assets.glow,1250,560,420,420);
        for(int i=0;i<5;i++){float x=((time*14+i*430)%2400)-240;batch.setColor(.85f,.55f,.6f,.05f);batch.draw(assets.glow,x,260+(i%3)*30,520,150);}
    }

    @Override public void dispose(){batch.dispose();shapes.dispose();assets.dispose();}
}
