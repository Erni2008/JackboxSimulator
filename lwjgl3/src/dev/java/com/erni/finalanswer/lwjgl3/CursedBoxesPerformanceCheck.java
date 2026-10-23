package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.profiling.*;
import com.badlogic.gdx.utils.Json;
import com.erni.finalanswer.cursedboxes.*;
import java.lang.management.ManagementFactory;
import java.util.*;

/** Diagnostic only: glFinish separates CPU submission from completion wait; never used in gameplay. */
public final class CursedBoxesPerformanceCheck {
    private static Throwable failure;
    public static final class Sample {
        public int cycle,frame,shot,draws,compiles,uploads,buffers,staticBuffers,textures,models,debris,particles;
        public long allocated,heap;
        public double cpuMs,gpuWaitMs,totalMs,presentedMs;
    }
    public static final class Report {
        public String renderer,version,resolution,note="Serialized diagnostic frames with libGDX GL intercept counters; excludes loading and presentation/vsync.";
        public int cycles;public long gcCount,gcMs;public ArrayList<Sample> samples=new ArrayList<>();
    }
    static final class AuditGL extends GL20Interceptor {
        int compiles,uploads,buffers,staticBuffers;
        AuditGL(){super(new GLProfiler(Gdx.graphics),Gdx.gl20);}
        @Override public void glCompileShader(int shader){compiles++;super.glCompileShader(shader);}
        @Override public void glTexImage2D(int t,int l,int internal,int w,int h,int border,int fmt,int type,java.nio.Buffer p){uploads++;super.glTexImage2D(t,l,internal,w,h,border,fmt,type,p);}
        @Override public void glBufferData(int target,int size,java.nio.Buffer data,int usage){buffers++;if(usage==GL20.GL_STATIC_DRAW)staticBuffers++;super.glBufferData(target,size,data,usage);}
        void clear(){reset();compiles=uploads=buffers=staticBuffers=0;}
    }
    public static void main(String[] args){
        com.erni.finalanswer.lwjgl3.display.DesktopBorderless.install();
        boolean fullscreen=Boolean.getBoolean("cursed.fullscreenProfile"),paced=Boolean.getBoolean("cursed.paced");
        System.setProperty("cursed.windowed",Boolean.toString(!fullscreen));
        var cfg=new Lwjgl3ApplicationConfiguration();cfg.setTitle("CURSED BOXES frame profiler");
        cfg.setWindowedMode(1440,900);
        cfg.useVsync(paced);cfg.setForegroundFPS(paced?60:0);
        Report report=new Report();report.cycles=Integer.getInteger("cursed.cycles",20);
        new Lwjgl3Application(new ApplicationAdapter(){
            CursedBoxesScreen demo;AuditGL audit;int frame,cycle,shot,warm;
            final com.sun.management.ThreadMXBean threads=(com.sun.management.ThreadMXBean)ManagementFactory.getThreadMXBean();
            long initialGc,initialGcMs;int modelCount,textureCount;
            long gc(boolean time){long n=0;for(var b:ManagementFactory.getGarbageCollectorMXBeans())n+=time?b.getCollectionTime():b.getCollectionCount();return n;}
            @Override public void create(){try{
                audit=new AuditGL();Gdx.graphics.setGL20(audit);Gdx.gl=Gdx.gl20=audit;
                demo=new CursedBoxesScreen(()->Gdx.app.exit());demo.resize(1440,900);demo.show();
                report.renderer=Gdx.gl.glGetString(GL20.GL_RENDERER);report.version=Gdx.gl.glGetString(GL20.GL_VERSION);report.resolution=Gdx.graphics.getBackBufferWidth()+"x"+Gdx.graphics.getBackBufferHeight();
                modelCount=demo.loadedModels();textureCount=Texture.getNumManagedTextures();initialGc=gc(false);initialGcMs=gc(true);
            }catch(Throwable e){failure=e;Gdx.app.exit();}}
            @Override public void render(){if(failure!=null)return;try{
                if(warm<90){demo.render(1f/60);Gdx.gl.glFinish();warm++;return;}
                if(frame==0){Gdx.app.log("Profile", "cycle="+cycle+" frame="+frame+" warm="+warm);demo.select(5);if(!demo.fire())throw new AssertionError("First fire rejected cycle="+cycle+" selected="+demo.selected());shot=1;}
                if(shot==1&&demo.slots[5].state==CrateSlot.State.DESTROYED&&!demo.turn.active()){
                    demo.select(0);if(!demo.fire())throw new AssertionError("Second fire rejected");shot=2;
                }
                if(frame>2400)throw new AssertionError("Shot/loading/return timeline stalled in cycle "+cycle);
                audit.clear();long before=threads.getThreadAllocatedBytes(Thread.currentThread().threadId());long start=System.nanoTime();
                demo.render(1f/60);long submitted=System.nanoTime();Gdx.gl.glFinish();long done=System.nanoTime();
                Sample s=new Sample();s.presentedMs=Gdx.graphics.getRawDeltaTime()*1000;s.cycle=cycle;s.frame=frame;s.shot=shot;s.cpuMs=(submitted-start)/1e6;s.gpuWaitMs=(done-submitted)/1e6;s.totalMs=(done-start)/1e6;s.draws=audit.getDrawCalls();s.compiles=audit.compiles;s.uploads=audit.uploads;s.buffers=audit.buffers;s.staticBuffers=audit.staticBuffers;s.models=demo.loadedModels();s.debris=demo.activeDebris();s.particles=demo.activeParticles();s.textures=Texture.getNumManagedTextures();s.allocated=threads.getThreadAllocatedBytes(Thread.currentThread().threadId())-before;s.heap=Runtime.getRuntime().totalMemory()-Runtime.getRuntime().freeMemory();report.samples.add(s);
                if(s.compiles!=0||s.uploads!=0||s.staticBuffers!=0||s.models!=modelCount||s.textures!=textureCount)throw new AssertionError("Cold asset/shader or resource growth during gameplay");
                frame++;
                // Observe completion, including the five-shell opening load; never assume a fixed shot frame.
                if(shot==2&&demo.turn.ended()&&demo.weaponState()==ShotgunController.State.RESTING){
                    if(demo.slots[5].state!=CrateSlot.State.DESTROYED||demo.slots[0].state!=CrateSlot.State.DESTROYED||demo.turn.shotsRemaining()!=0||demo.fire())throw new AssertionError("Two-shot destruction/limit");frame=0;cycle++;demo.reset();if(cycle==report.cycles){report.gcCount=gc(false)-initialGc;report.gcMs=gc(true)-initialGcMs;Json json=new Json(com.badlogic.gdx.utils.JsonWriter.OutputType.json);json.setUsePrototypes(false);Gdx.files.absolute(System.getProperty("cursed.profile")).writeString(json.prettyPrint(report),false);Gdx.app.log("Cursed profile","Saved "+report.samples.size()+" measured frames to "+System.getProperty("cursed.profile"));Gdx.app.exit();}}
            }catch(Throwable e){failure=e;Gdx.app.exit();}}
            @Override public void resize(int w,int h){if(demo!=null)demo.resize(w,h);}
            @Override public void dispose(){if(cycle!=report.cycles&&failure==null)failure=new AssertionError("Profile interrupted after "+cycle+" of "+report.cycles+" cycles");if(demo!=null){demo.dispose();if(Texture.getNumManagedTextures()!=0)failure=new AssertionError("Texture leak");}}
        },cfg);
        if(failure!=null)throw new AssertionError("Performance check",failure);
    }
}
