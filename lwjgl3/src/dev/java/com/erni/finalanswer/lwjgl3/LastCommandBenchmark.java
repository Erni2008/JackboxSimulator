package com.erni.finalanswer.lwjgl3;
import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.utils.Json;
import com.erni.finalanswer.lastcommand.*;
import java.util.*;
public final class LastCommandBenchmark extends ApplicationAdapter {
    private TheLastCommandMachine machine;private TheLastCommandRenderer renderer;private PerspectiveCamera camera;private LastCommandProfiler profiler;
    private final Vector3 center=new Vector3();private float radius;
    private int frame;private final int warmup=Integer.getInteger("lc.warmup",90),samples=Integer.getInteger("lc.samples",240);
    @Override public void create(){machine=new TheLastCommandMachine();camera=new PerspectiveCamera(45,Gdx.graphics.getWidth(),Gdx.graphics.getHeight());new OrbitCameraController(camera,machine);renderer=new TheLastCommandRenderer(camera,machine);machine.bounds.getCenter(center);radius=machine.bounds.getDimensions(new Vector3()).len()*.5f;profiler=new LastCommandProfiler();System.out.println("BENCH_PID="+ProcessHandle.current().pid());}
    @Override public void render(){
        if(frame==warmup)profiler.reset();profiler.begin();
        // Deterministic orbit, same frame path for every run, no random animation/load in sample window.
        float phase=(frame%240)/240f*MathUtils.PI2;
        camera.position.set(center).add(MathUtils.sin(phase)*radius*2.8f,radius*.65f,MathUtils.cos(phase)*radius*2.8f);camera.up.set(Vector3.Y);camera.lookAt(center);camera.update();machine.update(1/60f);profiler.updated();
        Gdx.gl.glViewport(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());Gdx.gl.glClearColor(.018f,.021f,.024f,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT|GL20.GL_DEPTH_BUFFER_BIT);renderer.render(0);profiler.submitted();Gdx.gl.glFinish();
        if(++frame==warmup+samples){Map<String,Object> r=profiler.report(machine,samples);r.put("label",System.getProperty("lc.label","benchmark"));r.put("backBuffer",List.of(Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight()));r.put("gl",Gdx.graphics.getGLVersion().getDebugVersionString());r.put("java",System.getProperty("java.version"));r.put("vsync",false);r.put("fpsLimit",0);r.put("gpuCompletionBarrier",true);r.put("warmupFrames",warmup);r.put("quality",GraphicsProfile.current().name());r.put("originalAssets",Boolean.getBoolean("lc.originalAssets"));r.put("legacyRendering",Boolean.getBoolean("lc.legacyRendering"));r.put("seed",Long.toString(Long.getLong("lc.seed",20261025L)));r.put("hatchPlacement",machine.mechanisms()==null?"none":machine.mechanisms().hatch().placementId());r.put("cameraPath","period=240 frames; radius=2.8*bodyRadius; elevation=0.65*bodyRadius");r.put("measuredAt",java.time.Instant.now().toString());
            var file=Gdx.files.absolute(System.getProperty("lc.output","/tmp/lc-benchmark.json"));file.parent().mkdirs();file.writeString(new com.google.gson.GsonBuilder().serializeNulls().setPrettyPrinting().create().toJson(r),false);System.out.println("BENCH_RESULT="+file.path());Gdx.app.exit();}
    }
    @Override public void dispose(){if(profiler!=null)profiler.dispose();if(renderer!=null)renderer.dispose();if(machine!=null)machine.dispose();}
    public static void main(String[]args){var c=new Lwjgl3ApplicationConfiguration();c.setTitle("Last Command / measured diagnostic");c.setWindowedMode(800,450);c.useVsync(false);c.setForegroundFPS(0);c.disableAudio(true);new Lwjgl3Application(new LastCommandBenchmark(),c);}
}
