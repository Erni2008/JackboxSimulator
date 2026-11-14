package com.erni.finalanswer.elevator;

import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.OrthographicCamera;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.math.Rectangle;
import com.badlogic.gdx.scenes.scene2d.utils.ScissorStack;
import com.erni.finalanswer.elevator.ElevatorController.State;

/**
 * Draws the elevator in strict layer order:
 * <ol><li>the current floor, visible only through the doorway (scissor mask);</li>
 * <li>both door leaves, clipped to the same doorway so they disappear <i>into</i> the walls instead of sliding over
 * them;</li>
 * <li>a contact shadow along the door seam and edges;</li>
 * <li>the cabin interior (its doorway is transparent);</li>
 * <li>the front frame overlay;</li>
 * <li>buttons, then the indicator housing and needle (rotating around its configured pivot);</li>
 * <li>lighting (lamp glows, motion flicker, emergency red) and a soft vignette.</li></ol>
 * Camera vibration and the exit push are applied to the camera, so every layer moves together. No allocation per frame.
 */
public final class ElevatorRenderer {
    private final ElevatorGeometry g;private final ElevatorAssets a;
    private final Rectangle area=new Rectangle(),scissor=new Rectangle();
    private float time,joltAge=99,joltStrength,exit=-1,lightLevel=1;
    public boolean debugOutlines,showTempLabels=true;

    public ElevatorRenderer(ElevatorGeometry g,ElevatorAssets a){this.g=g;this.a=a;}
    /** Wire to {@link ElevatorController#onCue}: jolts kick the camera. */
    public void cue(String c){
        switch(c){case ElevatorController.CUE_JOLT->{joltAge=0;joltStrength=1;}case ElevatorController.CUE_MOTOR_START->{joltAge=0;joltStrength=.45f;}case ElevatorController.CUE_EMERGENCY->{joltAge=0;joltStrength=1.6f;}default->{}}
    }
    /** Starts the cinematic push through the open doorway into the floor (1 = complete). */
    public void startExit(){exit=0;}
    public void resetExit(){exit=-1;}
    public float exitProgress(){return exit;}

    public void update(ElevatorController c,float dt){
        time+=dt;joltAge+=dt;if(exit>=0)exit=Math.min(1,exit+dt/g.cameraExitSeconds);
        float target=c.state()==State.EMERGENCY?.45f:1;
        if(c.isRiding()&&c.state()!=State.EMERGENCY){float n=noise(time*9);target-=n>.82f?g.flickerDepth*(n-.82f)/.18f*2.5f:0;}
        lightLevel+=(target-lightLevel)*Math.min(1,dt*(target<lightLevel?18:6));
    }

    public void draw(SpriteBatch b,OrthographicCamera cam,ElevatorController c,BitmapFont font){
        // ---- camera: hum while riding, damped jolts, and the exit push toward the doorway
        float speed=Math.abs(c.carVelocity())/Math.max(1e-4f,1f/g.secondsPerFloor);
        float hum=g.vibrationMoving*(c.isRiding()?Math.min(1,speed+.25f):0)*(c.state()==State.EMERGENCY?0:1);
        float jolt=joltAge<.9f?g.vibrationJolt*joltStrength*(float)Math.exp(-joltAge*6)*MathUtils.sin(joltAge*55):0;
        float sx=hum*(MathUtils.sin(time*37)*.6f+MathUtils.sin(time*23.3f)*.4f),sy=hum*MathUtils.sin(time*41.7f)*.8f+jolt;
        float e=exit<0?0:exit*exit*(3-2*exit),zoom=1-e*.62f;
        var d=g.doorway;float fx=MathUtils.lerp(g.worldW/2,d.cx(),e),fy=MathUtils.lerp(g.worldH/2,d.cy(),e);
        cam.zoom=zoom;cam.position.set(fx+sx,fy+sy,0);cam.update();b.setProjectionMatrix(cam.combined);

        b.begin();b.enableBlending();b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        int floorIdx=c.visibleFloor()-1;
        // 1) floor through the doorway
        clip(b,cam,d.x(),d.y(),d.w(),d.h());
        b.setColor(1,1,1,1);cover(b,a.floors[floorIdx],d.x(),d.y(),d.w(),d.h());
        float door=c.doorOpen();
        // 2) door leaves, inside the same mask: open = slid fully behind the walls
        var L=g.leftDoor;var R=g.rightDoor;
        float lx=MathUtils.lerp(L.closedX(),L.openX(),door),rx=MathUtils.lerp(R.closedX(),R.openX(),door);
        b.setColor(1,1,1,1);b.draw(a.doorLeft,lx,L.y(),L.w(),L.h());b.draw(a.doorRight,rx,R.y(),R.w(),R.h());
        // 3) contact shadows: a dark line on each moving edge and a soft shade where the leaves meet the jambs
        if(door>0&&door<1){float gap=Math.max(0,rx-(lx+L.w()));b.setColor(0,0,0,.55f*Math.min(1,gap/40f));b.draw(a.pixel,lx+L.w(),d.y(),3,d.h());b.draw(a.pixel,rx-3,d.y(),3,d.h());}
        b.setColor(0,0,0,.35f);b.draw(a.pixel,d.x(),d.y(),10,d.h());b.draw(a.pixel,d.x()+d.w()-10,d.y(),10,d.h());
        unclip(b);
        // 4) cabin, 5) frame overlay
        b.setColor(1,1,1,1);b.draw(a.base,0,0,g.worldW,g.worldH);b.draw(a.frameOverlay,0,0,g.worldW,g.worldH);
        // 6) buttons
        for(int i=0;i<g.buttons.size();i++){var bt=g.buttons.get(i);var st=c.button(bt.floor());TextureRegion r=a.buttons[i][st.ordinal()];float s=bt.radius()*2+8;
            b.setColor(1,1,1,1);b.draw(r,bt.x()-s/2,bt.y()-s/2,s,s);
            if(font!=null){font.setColor(st==ElevatorController.ButtonState.ACTIVE?1:.95f,st==ElevatorController.ButtonState.ACTIVE?.9f:.8f,.6f,1);font.draw(b,String.valueOf(bt.floor()),bt.x()-6,bt.y()+8);}}
        // indicator: housing, then the needle rotated about its pivot
        var ih=g.indicator;b.draw(a.indicatorHousing,ih.x(),ih.y(),ih.w(),ih.h());
        float ang=g.needleAngle(c.carPosition())+(c.isRiding()?MathUtils.sin(time*31)*.4f*Math.min(1,speed):0);
        b.draw(a.needle,g.needleX-g.needleWidth/2,g.needleY-g.needlePivotFromBottom,g.needleWidth/2,g.needlePivotFromBottom,g.needleWidth,g.needleLength,1,1,ang-90,0,0,a.needle.getWidth(),a.needle.getHeight(),false,false);
        // 7) lighting
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        for(var l:g.lights){b.setColor(l.r(),l.g(),l.b(),l.strength()*lightLevel*.5f);b.draw(a.glow,l.x()-l.radius(),l.y()-l.radius(),l.radius()*2,l.radius()*2);}
        for(int i=0;i<g.buttons.size();i++){var bt=g.buttons.get(i);if(c.button(bt.floor())==ElevatorController.ButtonState.ACTIVE){float p=.75f+.25f*MathUtils.sin(time*5);b.setColor(1,.15f,.08f,.55f*p);b.draw(a.glow,bt.x()-bt.radius()*2.6f,bt.y()-bt.radius()*2.6f,bt.radius()*5.2f,bt.radius()*5.2f);}}
        if(c.state()==State.EMERGENCY){float p=.5f+.5f*MathUtils.sin(c.stateTime()*4.2f);b.setColor(1,.05f,.02f,.30f*p);b.draw(a.glow,-200,-300,g.worldW+400,g.worldH+600);}
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        b.setColor(0,0,0,(1-lightLevel)*.75f);b.draw(a.pixel,-100,-100,g.worldW+200,g.worldH+200);                          // dimming
        // exit: the floor takes over the frame as the camera passes the threshold
        if(e>.55f){float k=(e-.55f)/.45f;b.setColor(1,1,1,k*k);cover(b,a.floors[floorIdx],cam.position.x-g.worldW*zoom/2,cam.position.y-g.worldH*zoom/2,g.worldW*zoom,g.worldH*zoom);}
        b.setColor(1,1,1,1);
        if(font!=null&&showTempLabels&&!a.temporary.isEmpty()){font.setColor(1,.85f,.2f,1);font.draw(b,"TEMPORARY PLACEHOLDER ART - logic test only ("+String.join(", ",a.temporary)+")",20,g.worldH-14);}
        if(font!=null&&showTempLabels&&a.isTemporary("floor"+(floorIdx+1))&&door>.05f){var f=g.floors.get(floorIdx);font.setColor(1,1,1,.85f*door);font.draw(b,"[TEMP] "+f.number()+" - "+f.name(),d.x()+20,d.y()+d.h()-20);}
        b.end();
        if(debugOutlines)outlines(b,c);
    }
    private void outlines(SpriteBatch b,ElevatorController c){
        b.begin();b.setColor(0,1,0,.8f);var d=g.doorway;line(b,d.x(),d.y(),d.w(),d.h());
        var L=g.leftDoor;var R=g.rightDoor;float door=c.doorOpen();b.setColor(1,1,0,.8f);
        line(b,MathUtils.lerp(L.closedX(),L.openX(),door),L.y(),L.w(),L.h());line(b,MathUtils.lerp(R.closedX(),R.openX(),door),R.y(),R.w(),R.h());
        b.setColor(0,.8f,1,.8f);for(var bt:g.buttons)line(b,bt.x()-bt.radius(),bt.y()-bt.radius(),bt.radius()*2,bt.radius()*2);
        b.setColor(1,0,1,1);b.draw(a.pixel,g.needleX-4,g.needleY-4,8,8);b.setColor(1,1,1,1);b.end();
    }
    private void line(SpriteBatch b,float x,float y,float w,float h){b.draw(a.pixel,x,y,w,2);b.draw(a.pixel,x,y+h-2,w,2);b.draw(a.pixel,x,y,2,h);b.draw(a.pixel,x+w-2,y,2,h);}
    /** Scales a texture to cover the rect (keeps aspect; the excess is cropped by the active mask). */
    private void cover(SpriteBatch b,Texture t,float x,float y,float w,float h){
        float s=Math.max(w/t.getWidth(),h/t.getHeight()),tw=t.getWidth()*s,th=t.getHeight()*s;b.draw(t,x+(w-tw)/2,y+(h-th)/2,tw,th);
    }
    private void clip(SpriteBatch b,OrthographicCamera cam,float x,float y,float w,float h){
        b.flush();area.set(x,y,w,h);ScissorStack.calculateScissors(cam,b.getTransformMatrix(),area,scissor);
        if(!ScissorStack.pushScissors(scissor))scissor.set(0,0,0,0);
    }
    private void unclip(SpriteBatch b){b.flush();if(scissor.width>0||scissor.height>0)ScissorStack.popScissors();}
    private static float noise(float x){int i=(int)Math.floor(x);float f=x-i,u=f*f*(3-2*f);return MathUtils.lerp(h(i),h(i+1),u);}
    private static float h(int i){float v=MathUtils.sin(i*127.1f+311.7f)*43758.5453f;return v-(float)Math.floor(v);}
    float lightLevel(){return lightLevel;}
}
