package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.utils.Array;
import com.badlogic.gdx.utils.Json;
import java.util.HashSet;

/** Source-pixel pivots and contours; no separate hat bone, the supplied head already wears one. */
public final class PuppeteerConfig {
    public static final String PATH="lobby/characters/puppeteer/puppeteer_config.json";
    public float lobbyX=174,lobbyFloor=68,lobbyScale=1;
    public float idleBodyDegrees=2,idleHeadDegrees=8,behaviorMin=4,behaviorMax=9,blendSeconds=.22f,introSeconds=6.5f,laughSeconds=3.2f,scareSeconds=1.7f;
    public int quality=12;
    public float[] behaviorWeights={1,.8f,1,1,.7f,.8f,.6f};
    public Array<Part> parts=new Array<>(Part.class);
    public Array<Cord> strings=new Array<>(Cord.class);
    public static final class Part {
        public String name="",parent="";public int asset,order;
        public float x,y,pivotX,pivotY,artScale=1,rotation,scale=1,alpha=1;public boolean mirror,visible=true;
        public float[] matte=new float[0];
    }
    public static final class Cord {public String part="";public float x,y,anchorX,anchorY;}
    public static PuppeteerConfig load(){return parse(Gdx.files.internal(PATH).readString("UTF-8"));}
    public static PuppeteerConfig parse(String text){var c=new Json().fromJson(PuppeteerConfig.class,text);c.validate();return c;}
    public Part part(String name){for(int i=0;i<parts.size;i++){Part p=parts.get(i);if(p.name.equals(name))return p;}throw new IllegalArgumentException("Missing Puppeteer bone: "+name);}
    public void validate(){
        var names=new HashSet<String>();
        for(Part p:parts){
            if(p.name.isBlank()||!names.add(p.name)||p.asset<1||p.asset>15||p.asset==6||p.artScale<=0||p.scale<=0||p.alpha<0||p.alpha>1||p.name.equals("hat"))throw new IllegalArgumentException("Invalid Puppeteer bone: "+p.name);
            for(float v:new float[]{p.x,p.y,p.pivotX,p.pivotY,p.artScale,p.rotation,p.scale,p.alpha})if(!Float.isFinite(v))throw new IllegalArgumentException("Nonfinite Puppeteer geometry");
            if(p.matte.length%2!=0||p.matte.length>0&&p.matte.length<6)throw new IllegalArgumentException("Invalid contour: "+p.name);
            for(float v:p.matte)if(!Float.isFinite(v))throw new IllegalArgumentException("Nonfinite matte");
        }
        for(String name:new String[]{"body","head","leftEye","rightEye","mouth","nose","hair","leftArm","rightArm","leftHand","rightHand","leftLeg","rightLeg","suspension"})part(name);
        for(Part p:parts){var seen=new HashSet<String>();while(!p.parent.isEmpty()){if(!seen.add(p.name))throw new IllegalArgumentException("Puppeteer parent cycle");p=part(p.parent);}}
        for(Cord s:strings){part(s.part);for(float v:new float[]{s.x,s.y,s.anchorX,s.anchorY})if(!Float.isFinite(v))throw new IllegalArgumentException("Nonfinite cord");}
        for(float v:new float[]{lobbyScale,blendSeconds,introSeconds,laughSeconds,scareSeconds,behaviorMin,behaviorMax})if(!Float.isFinite(v)||v<=0)throw new IllegalArgumentException("Invalid Puppeteer timing/scale");
        if(!Float.isFinite(idleBodyDegrees)||!Float.isFinite(idleHeadDegrees)||idleBodyDegrees<0||idleHeadDegrees<0)throw new IllegalArgumentException("Invalid idle amplitude");
        if(behaviorMax<behaviorMin||quality<3||quality>24||behaviorWeights.length!=7)throw new IllegalArgumentException("Invalid Puppeteer quality/behavior weights");
        float sum=0;for(float w:behaviorWeights){if(!Float.isFinite(w)||w<0)throw new IllegalArgumentException("Invalid behavior weight");sum+=w;}if(sum<=0)throw new IllegalArgumentException("Empty behavior distribution");
    }
}
