package com.erni.finalanswer.shotgun;

import com.badlogic.gdx.files.FileHandle;
import com.badlogic.gdx.math.Matrix4;
import com.badlogic.gdx.utils.Json;

/** Alignment is expressed in the assembly's local units. Identity defaults are NOT calibrated. */
public final class ShotgunConfig {
    public static final String PATH="models/shotgun/shotgun_config.json";
    public static final class Part {
        public String asset="";
        public float[] position={0,0,0}, rotation={0,0,0}, scale={1,1,1}, anchor={0,0,0};
        public boolean visible=true;
        public void transform(Matrix4 out){transform(out,1);}
        public void transform(Matrix4 out,float multiplier){out.idt().translate(position[0],position[1],position[2])
                .rotate(0,0,1,rotation[2]).rotate(0,1,0,rotation[1]).rotate(1,0,0,rotation[0])
                .scale(scale[0]*multiplier,scale[1]*multiplier,scale[2]*multiplier).translate(-anchor[0],-anchor[1],-anchor[2]);}
        public void reset(){for(int i=0;i<3;i++){position[i]=rotation[i]=0;scale[i]=1;}}
    }
    public Part body=new Part(),pump=new Part(),bolt=new Part(),shell=new Part();
    public float[] pumpDirection={-1,0,0},boltDirection={-1,0,0};
    public float pumpTravel=.12f,boltTravel=.08f,pumpDuration=.75f,boltDuration=.3f,reloadDuration=1.8f;
    public float[] shellStart={0,-.3f,.15f},shellEnd={0,0,0};
    public String easing="smooth";
    public float shellScale=1.5f;
    public boolean bodyHasFixedPump,bodyHasClosedPort;
    public boolean calibrated=false;
    public String notes="";
    public Part part(int index){return switch(index){case 0->body;case 1->pump;case 2->bolt;case 3->shell;default->throw new IllegalArgumentException("Part 0..3");};}
    public static ShotgunConfig load(FileHandle file){return parse(file.readString("UTF-8"));}
    public static ShotgunConfig parse(String text){ShotgunConfig config=new Json().fromJson(ShotgunConfig.class,text);config.validate();return config;}
    public void save(FileHandle file){validate();file.parent().mkdirs();file.writeString(new Json().prettyPrint(this),false,"UTF-8");}
    public void validate(){
        for(int i=0;i<4;i++){Part p=part(i);if(p==null||p.asset==null)throw new IllegalArgumentException("Missing part configuration");
            vector(p.position);vector(p.rotation);vector(p.scale);vector(p.anchor);for(float s:p.scale)if(s<=0)throw new IllegalArgumentException("Scale must be positive");}
        if(!Float.isFinite(shellScale)||shellScale<=0)throw new IllegalArgumentException("Invalid shellScale");
        vector(pumpDirection);vector(boltDirection);vector(shellStart);vector(shellEnd);
        for(float[] direction:new float[][]{pumpDirection,boltDirection})if(direction[0]*direction[0]+direction[1]*direction[1]+direction[2]*direction[2]<.000001f)throw new IllegalArgumentException("Zero travel direction");
        for(float value:new float[]{pumpTravel,boltTravel,pumpDuration,boltDuration,reloadDuration})if(!Float.isFinite(value)||value<=0)throw new IllegalArgumentException("Invalid animation parameter");
        if(!"smooth".equals(easing)&&!"smoother".equals(easing)&&!"linear".equals(easing))throw new IllegalArgumentException("Easing: smooth, smoother, linear");
    }
    private static void vector(float[] values){if(values==null||values.length!=3)throw new IllegalArgumentException("Expected xyz vector");for(float v:values)if(!Float.isFinite(v))throw new IllegalArgumentException("Nonfinite transform");}
}
