package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.profiling.GLProfiler;

/** No per-frame sampling allocations. GL interception is enabled only while F3 is visible. */
public final class CursedBoxesPerformance {
    private final GLProfiler profiler=new GLProfiler(Gdx.graphics);
    public boolean visible;
    public float frameMs,cpuMs;
    public int draws;
    private long start;
    public void toggle(){visible=!visible;if(visible)profiler.enable();else profiler.disable();}
    public void begin(float delta){start=System.nanoTime();frameMs=delta*1000;if(visible)profiler.reset();}
    public void end(){cpuMs=(System.nanoTime()-start)/1_000_000f;if(visible)draws=profiler.getDrawCalls();}
    public void dispose(){if(profiler.isEnabled())profiler.disable();}
}
