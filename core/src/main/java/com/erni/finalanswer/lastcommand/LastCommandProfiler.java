package com.erni.finalanswer.lastcommand;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.profiling.GLProfiler;
import java.util.*;

/** Measured GL counters and CPU wall times. GPU residency/model memory are explicitly estimates. */
public final class LastCommandProfiler implements com.badlogic.gdx.utils.Disposable {
    private final GLProfiler gl=new GLProfiler(Gdx.graphics);
    private final long[] intervals=new long[4096];
    private int count;
    private long start,lastFrame,updateEnd,submitStart;
    private double updateNanos,submitNanos,draws,triangles,bindings;
    public LastCommandProfiler(){gl.enable();}
    public void begin(){gl.reset();start=System.nanoTime();if(lastFrame!=0&&count<intervals.length)intervals[count++]=start-lastFrame;lastFrame=start;}
    public void updated(){updateEnd=System.nanoTime();updateNanos+=updateEnd-start;submitStart=updateEnd;}
    public void submitted(){submitNanos+=System.nanoTime()-submitStart;draws+=gl.getDrawCalls();triangles+=gl.getVertexCount().total/3.;bindings+=gl.getTextureBindings();}
    public void reset(){count=0;lastFrame=0;updateNanos=submitNanos=draws=triangles=bindings=0;}
    public Map<String,Object> report(TheLastCommandMachine machine,int samples){
        long[] sorted=Arrays.copyOf(intervals,count);Arrays.sort(sorted);double sum=0;for(long t:sorted)sum+=t;
        double avg=count==0?0:sum/count,slow=0;int lows=Math.max(1,(int)Math.ceil(count*.01));for(int i=Math.max(0,count-lows);i<count;i++)slow+=sorted[i];
        Set<Texture> textures=Collections.newSetFromMap(new IdentityHashMap<>());Set<Mesh> meshes=Collections.newSetFromMap(new IdentityHashMap<>());
        for(var source:machine.loadedSources())if(source!=null){if(source.textures!=null)for(Texture t:source.textures)textures.add(t);if(source.meshes!=null)for(Mesh m:source.meshes)meshes.add(m);if(source.scene!=null)for(Mesh m:source.scene.model.meshes)meshes.add(m);}
        long texBytes=0,meshBytes=0;for(Texture t:textures){int bpp=t.getTextureData().getFormat()==Pixmap.Format.RGB888?3:4;texBytes+=(long)(t.getWidth()*(double)t.getHeight()*bpp*(t.getTextureData().useMipMaps()?4./3:1));}
        for(Mesh m:meshes)meshBytes+=(long)m.getNumVertices()*m.getVertexSize()+(long)m.getNumIndices()*2;
        Map<String,Object> r=new LinkedHashMap<>();r.put("frames",samples);r.put("intervalSamples",count);r.put("averageFps",avg==0?0:1e9/avg);r.put("onePercentLowFps",slow==0?0:1e9/(slow/lows));r.put("averageFrameMs",avg/1e6);
        r.put("cpuUpdateMs",updateNanos/samples/1e6);r.put("renderSubmissionMs",submitNanos/samples/1e6);r.put("drawCalls",draws/samples);r.put("renderedTrianglesAllPasses",triangles/samples);r.put("textureBindings",bindings/samples);
        r.put("loadedSources",machine.loadedAssetCount());r.put("uniqueTextures",textures.size());r.put("textureMemoryEstimateBytes",texBytes);r.put("meshMemoryEstimateBytes",meshBytes);r.put("loadedModelMemoryEstimateBytes",texBytes+meshBytes);
        r.put("measuredJavaHeapUsedBytes",Runtime.getRuntime().totalMemory()-Runtime.getRuntime().freeMemory());r.put("gpuTimeMs",null);r.put("actualGpuMemoryBytes",null);
        r.put("notes","FPS/frame intervals and CPU submission wall time measured; submission is NOT GPU time. Texture/mesh memory estimates exclude driver/padding/IBL/shadow buffers/dynamic canvases/fonts/floor. GL triangle counter includes shadow and color passes.");return r;
    }
    @Override public void dispose(){gl.disable();}
}
