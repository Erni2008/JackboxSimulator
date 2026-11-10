package com.erni.finalanswer.forgottenroom;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.math.MathUtils;
import java.util.*;

/**
 * Draws the room in 1920×1080 world units: painted background, objects on their places (real art or placeholder
 * plaques), contact shadows, candle and moonlight, drifting dust, vignette and the blackout. The camera never moves;
 * ambient motion stays away from the objects so memorising stays fair. No allocation per frame.
 */
final class ForgottenRoomRenderer {
    static final float W=1920,H=1080;
    private final ForgottenRoomArt art;private final BitmapFont label;private final GlyphLayout layout=new GlyphLayout();
    private static final int MOTES=46;
    private final float[] mx=new float[MOTES],my=new float[MOTES],ms=new float[MOTES],mp=new float[MOTES];
    private float time;

    ForgottenRoomRenderer(ForgottenRoomArt art,BitmapFont label){
        this.art=art;this.label=label;Random r=new Random(7);
        for(int i=0;i<MOTES;i++){mx[i]=r.nextFloat();my[i]=r.nextFloat();ms[i]=.4f+r.nextFloat()*.9f;mp[i]=r.nextFloat()*6.28f;}
    }
    void update(float dt){time+=dt;}
    float flicker(float seed){return .86f+.08f*MathUtils.sin(time*7.3f+seed)+.05f*MathUtils.sin(time*13.1f+seed*2)+.03f*MathUtils.sin(time*23f+seed*3);}

    /** Background, moon haze, objects and ambient light. {@code objects} is null in darkness. */
    void drawRoom(SpriteBatch b,ForgottenRoomModel m,List<ForgottenRoomModel.Obj> objects,float roomAlpha){
        Texture bg=art.background(m.background);
        b.setColor(1,1,1,1);if(bg!=null)b.draw(bg,0,0,W,H);else{b.setColor(.06f,.04f,.05f,1);b.draw(art.pixel,0,0,W,H);}
        // cold moonlight through the window and the warm sconce on the right wall
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        b.setColor(.45f,.58f,.9f,.10f);b.draw(art.soft,120,330,620,620);
        float f=flicker(1.7f);b.setColor(1f,.62f,.28f,.16f*f);b.draw(art.soft,1590,610,420,420);
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        if(objects!=null)for(var o:objects)drawObject(b,m,o,1,false);
        drawMotes(b);
        b.setColor(1,1,1,1);b.draw(art.vignette,0,0,W,H);
    }

    /** One object at its place. {@code ghost} draws a cold translucent echo (reveal of what used to be there). */
    void drawObject(SpriteBatch b,ForgottenRoomModel m,ForgottenRoomModel.Obj o,float alpha,boolean ghost){
        drawObject(b,m,o,alpha,ghost,o.rotated()?1:0);
    }
    /** {@code turned} 0..1: how far the object is turned — FLIP faces the other way, TOPPLE lies on its side (never upside down). */
    void drawObject(SpriteBatch b,ForgottenRoomModel m,ForgottenRoomModel.Obj o,float alpha,boolean ghost,float turned){
        var place=m.places.get(o.slot());if(place==null||alpha<=0)return;
        float x=place.x()*W,base=(1-place.y())*H;boolean frame=place.surface().equals("FRAME"),hang=place.surface().equals("HANG");
        Texture tex=art.object(m,o,frame);boolean placeholder=tex==null;
        float h,w;
        if(frame){w=284;h=277;}
        else{h=height(o.size(),place.surface(),place.y());
            if(placeholder){tex=o.size().equals("SMALL")?art.plaqueSmall:art.plaque;}
            w=h*tex.getWidth()/(float)tex.getHeight();}
        if(frame&&placeholder)tex=art.frameCanvas;
        float y=frame?base-h/2:hang?base-h:base;
        if(!frame&&!hang&&!ghost){ // soft contact shadow
            b.setColor(0,0,0,.55f*alpha);b.draw(art.soft,x-w*.62f,y-h*.05f,w*1.24f,h*.16f);}
        boolean glow=o.light()&&o.lit();
        if(glow&&!ghost){b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);float f=flicker(o.id().hashCode()%7);
            b.setColor(1f,.66f,.3f,.42f*f*alpha);b.draw(art.soft,x-h*.95f,y+h*.15f,h*1.9f,h*1.9f);
            b.setColor(1f,.82f,.5f,.30f*f*alpha);b.draw(art.soft,x-h*.3f,y+h*.62f,h*.6f,h*.6f);
            b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        if(ghost)b.setColor(.62f,.82f,1f,.55f*alpha);
        else if(placeholder&&o.light()&&!o.lit())b.setColor(.62f,.58f,.56f,alpha);
        else if(glow)b.setColor(1,.97f,.92f,alpha);
        else{ // settle the art into the room's light: cold by the moonlit window, warm by the sconce, dim in between
            float mx=place.x(),cold=MathUtils.clamp(1-mx/.4f,0,1),warm=MathUtils.clamp((mx-.62f)/.38f,0,1),depth=.08f*(1-place.y());
            b.setColor(.74f-depth+.10f*warm-.05f*cold,.68f-depth+.03f*warm-.01f*cold,.64f-depth-.04f*warm+.10f*cold,alpha);}
        float sx=1,rot=0,cy=y+h/2;
        if(o.turn().equals("FLIP"))sx=MathUtils.cos(MathUtils.PI*turned);
        else if(o.turn().equals("TOPPLE")){rot=90*turned;cy=MathUtils.lerp(y+h/2,y+w/2,turned);}
        if(Math.abs(sx)<.06f)sx=sx<0?-.06f:.06f;
        b.draw(tex,x-w/2,cy-h/2,w/2,h/2,w,h,sx,1,rot,0,0,tex.getWidth(),tex.getHeight(),false,false);
        if(placeholder){ // the object's name on the plaque (upside down plaques show the crest at the bottom)
            label.getData().setScale(frame?.7f:o.size().equals("SMALL")?.42f:.48f);
            label.setColor(ghost?.8f:.96f,ghost?.92f:.88f,ghost?1f:.72f,alpha);
            layout.setText(label,o.name(),label.getColor(),w*.92f,com.badlogic.gdx.utils.Align.center,true);
            float ly=y+h*.42f;label.draw(b,layout,x-w*.46f,ly);label.getData().setScale(1);
        }
        b.setColor(1,1,1,1);
    }
    /** Drawn height in world units: object class, what it stands on (shelves are low compartments) and depth. */
    static float height(String size,String surface,float y){
        float base=switch(size){case "TALL"->540;case "LARGE"->150;case "SMALL"->72;default->108;};
        float cap=switch(surface){case "SHELF"->86;case "DESK"->128;case "WINDOWSILL"->112;case "WALL"->118;case "SEAT"->116;case "TABLE"->172;case "FLOOR"->size.equals("TALL")?580:205;case "HANG"->230;default->150;};
        return Math.min(base*(.78f+.42f*y),cap);
    }
    private void drawMotes(SpriteBatch b){
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        for(int i=0;i<MOTES;i++){
            // dust lives in the moonbeam (window → floor), clear of the object rows
            float u=(mx[i]+time*.004f*ms[i])%1f,v=(my[i]+time*.011f*ms[i])%1f;
            float x=210+u*520+v*260+MathUtils.sin(time*.6f+mp[i])*14,y=H-(250+v*560);
            float a=.20f*(.5f+.5f*MathUtils.sin(time*1.3f+mp[i]))*(1-Math.abs(u-.5f)*1.6f);
            if(a<=0)continue;b.setColor(.82f,.88f,1f,a);float s=3+ms[i]*3;b.draw(art.soft,x-s,y-s,s*2,s*2);}
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
    }
    /** Full-screen darkness with alpha {@code a} (blackout, reveal dimming). */
    void darkness(SpriteBatch b,float a){if(a<=0)return;b.setColor(0,0,0,Math.min(1,a));b.draw(art.pixel,0,0,W,H);b.setColor(1,1,1,1);}
    /** Additive warm pool of light around a place, for the reveal spotlight. */
    void spotlight(SpriteBatch b,ForgottenRoomModel m,String slot,float strength){
        var p=m.places.get(slot);if(p==null||strength<=0)return;float x=p.x()*W,y=(1-p.y())*H+70;
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);b.setColor(1f,.78f,.48f,.55f*strength);b.draw(art.soft,x-230,y-230,460,460);
        b.setColor(1f,.9f,.7f,.35f*strength);b.draw(art.soft,x-110,y-110,220,220);b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);b.setColor(1,1,1,1);
    }
}
