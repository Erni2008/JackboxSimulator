package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.profiling.GLProfiler;
import com.erni.finalanswer.cursedcards.*;
import java.util.*;

/**
 * Uncapped frame-time benchmark of an 8-player auto-played match. -Dcursedcards.quality=high|medium|low,
 * -Dbench.source=true loads the 500k-triangle source model with 4K maps (the pre-optimisation baseline).
 */
public final class CursedCardsBenchmark extends CursedCardsPrototype {
    private GLProfiler profiler;private final List<Float> frames=new ArrayList<>();private long calls,verts,samples;private float t;private boolean started;private long loadMs;private final long t0=System.nanoTime();
    @Override public void create(){
        if(Boolean.getBoolean("bench.source"))modelOverride="../source_assets/models/cursed_cards/shufle.glb";
        super.create();loadMs=(System.nanoTime()-t0)/1_000_000;Gdx.graphics.setContinuousRendering(true);timeScale=1.5f;profiler=new GLProfiler(Gdx.graphics);profiler.enable();}
    @Override public void render(){
        profiler.reset();long s=System.nanoTime();super.render();Gdx.gl.glFinish();float ms=(System.nanoTime()-s)/1e6f;
        t+=Gdx.graphics.getDeltaTime();
        if(!started&&t>1){setPlayers(8);startMatch();autoPlay=true;started=true;t=0;}
        if(started){frames.add(ms);if(ms>14)System.out.printf(Locale.ROOT,"HITCH %.1f ms at t=%.2f status=%s presenting=%s%n",ms,t,status,presenting());calls+=profiler.getDrawCalls();verts+=(long)profiler.getVertexCount().total;samples++;}
        if(started&&(t>28||(game!=null&&game.phase()==com.erni.finalanswer.gameplay.cursedcards.CursedCardsGame.Phase.FINISHED&&!presenting()&&t>6))){
            Collections.sort(frames);float avg=0;for(float f:frames)avg+=f;avg/=frames.size();
            System.out.printf(Locale.ROOT,"BENCH %s%s: load %d ms, frames %d, avg %.2f ms, p95 %.2f ms, worst %.1f ms, draw calls %d, vertices/frame %d%n",quality,modelOverride!=null?" (SOURCE MODEL)":"",loadMs,frames.size(),avg,frames.get((int)(frames.size()*.95f)),frames.get(frames.size()-1),calls/samples,verts/samples);
            Gdx.app.exit();}
    }
    public static void main(String[] a){var c=new Lwjgl3ApplicationConfiguration();c.setWindowedMode(1440,900);c.setBackBufferConfig(8,8,8,8,24,0,4);c.useVsync(false);c.setForegroundFPS(0);c.disableAudio(true);new Lwjgl3Application(new CursedCardsBenchmark(),c);}
}
