package com.erni.finalanswer.gameplay.forgottenroom;

import com.google.gson.Gson;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

/** Shared scene manifest: image coordinates use top-left origin; world distances use metres, Y up. */
public record RoomSceneDefinition(int schemaVersion,String id,String nameRu,String background,boolean readyForRounds,
        int[] referenceSize,Camera camera,Lighting lighting,List<Surface> surfaces,List<Anchor> slots,List<Prop> objects){
    public record Camera(float fov,float[] position,float[] target,float near,float far){}
    public record Lighting(float[] moonColor,float[] moonDirection,float moonIntensity,float[] warmColor,float[] warmDirection,float warmIntensity,float ambient){}
    public record Surface(String id,String kind,float height,float[] position,float[] size,float yaw,float[][] supportPolygon,float maxObjectHeight){}
    public record Anchor(String id,float x,float y,String surface,String labelRu,String surfaceId){}
    public record Prop(String id,String model,boolean enabled,String surfaceId,List<String> slots,float heightMeters,float yaw,List<String> changes,List<String> variants){}

    public static RoomSceneDefinition load(String id){
        if(!id.matches("[a-z0-9_]+"))throw new IllegalArgumentException("Invalid scene id");
        String path="/forgotten_room/scenes/"+id+".json";
        try(InputStream in=RoomSceneDefinition.class.getResourceAsStream(path)){
            if(in==null)throw new IllegalStateException("Missing scene "+path);
            RoomSceneDefinition scene=new Gson().fromJson(new InputStreamReader(in,StandardCharsets.UTF_8),RoomSceneDefinition.class);
            scene.validate();return scene;
        }catch(IOException e){throw new UncheckedIOException(e);}
    }
    public void validate(){
        if(schemaVersion!=1||referenceSize.length!=2||referenceSize[0]!=1920||referenceSize[1]!=1080)throw new IllegalStateException("Unsupported scene format");
        if(camera.fov<=0||camera.fov>=120||camera.near<=0||camera.far<=camera.near)throw new IllegalStateException("Invalid camera");
        Set<String> surfaceIds=new HashSet<>(),anchorIds=new HashSet<>(),propIds=new HashSet<>();
        for(Surface s:surfaces){
            if(s.supportPolygon!=null)for(float[] point:s.supportPolygon)if(point.length!=2||!Float.isFinite(point[0])||!Float.isFinite(point[1])||point[0]<0||point[0]>1||point[1]<0||point[1]>1)throw new IllegalStateException("Invalid support polygon "+s.id);
            if(!surfaceIds.add(s.id)||s.size.length!=2||s.size[0]<=0||s.size[1]<=0)throw new IllegalStateException("Invalid surface "+s.id);}
        for(Anchor a:slots){if(!anchorIds.add(a.id)||!surfaceIds.contains(a.surfaceId)||a.x<0||a.x>1||a.y<0||a.y>1)throw new IllegalStateException("Invalid anchor "+a.id);}
        for(Prop p:objects){
            if(!propIds.add(p.id)||!surfaceIds.contains(p.surfaceId)||p.heightMeters<=0||!p.model.startsWith("forgotten_room/greenhouse/models/")||!p.model.endsWith(".glb")||p.model.contains(".."))throw new IllegalStateException("Invalid prop "+p.id);
            for(String slot:p.slots){Anchor a=slots.stream().filter(v->v.id.equals(slot)).findFirst().orElseThrow();if(!a.surfaceId.equals(p.surfaceId))throw new IllegalStateException("Wrong prop surface "+slot);}
        }
        if(readyForRounds)throw new IllegalStateException("Enable gameplay only after model/change and phone snapshot integration");
    }
    public RoomCatalog.Layout layout(){
        return new RoomCatalog.Layout(id,background,nameRu,slots.stream().map(a->new RoomCatalog.Slot(a.id,a.x,a.y,RoomCatalog.Surface.valueOf(a.surface),a.labelRu)).toList(),Map.of());
    }
}
