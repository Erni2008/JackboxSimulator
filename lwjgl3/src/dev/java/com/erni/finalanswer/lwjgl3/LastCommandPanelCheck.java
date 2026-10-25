package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g3d.attributes.TextureAttribute;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.math.collision.Ray;
import com.erni.finalanswer.lastcommand.*;
import java.util.*;

/** Real GLB/GL/input checks. Fixtures are instances of the user's meshes, never replacement models. */
public final class LastCommandPanelCheck extends ApplicationAdapter {
    private TheLastCommandMachine machine;
    private FrontPanel panel;
    private PerspectiveCamera camera;
    private OrbitCameraController orbit;
    private TheLastCommandRenderer renderer;
    private int frames;
    private static void check(boolean ok,String message){if(!ok)throw new AssertionError(message);}
    private static void near(float expected,float actual){check(Math.abs(expected-actual)<.00015f,expected+" != "+actual);}
    private Vector3 target(PanelControl control){
        Vector3 point=control instanceof SmallButton?new Vector3(0,.70f,0):control instanceof RotaryAdjuster?new Vector3(-.019f,.89f,.002f):new Vector3(.400f,.562f,-.005f);
        return point.mul(control.scene().modelInstance.transform);
    }
    private void down(PanelControl control){
        Vector3 world=target(control);PanelElementId picked=machine.pick(new Ray(camera.position,new Vector3(world).sub(camera.position).nor()));
        check(picked==control.id(),"Wrong ray target for "+control.id()+": "+picked+" at "+world);
        Vector3 pixel=camera.project(new Vector3(world));orbit.touchDown(Math.round(pixel.x),Math.round(Gdx.graphics.getHeight()-pixel.y),0,Input.Buttons.LEFT);
    }
    private void up(){orbit.touchUp(0,0,0,Input.Buttons.LEFT);}
    @Override public void create(){
        machine=new TheLastCommandMachine();panel=machine.panel();check(machine.loadedAssetCount()==5&&panel!=null,"All five original models must load: "+machine.status);
        camera=new PerspectiveCamera(45,1200,800);orbit=new OrbitCameraController(camera,machine);
        renderer=new TheLastCommandRenderer(camera,machine);
        check(panel.controls().size()==6,"Four buttons, one adjuster, one indicator");
        check(panel.light().color()==LightModule.State.OFF,"Indicator must start OFF");near(0,panel.light().intensity());
        var central=machine.scenes[2].modelInstance;
        Texture sourceTexture=central.materials.first().get(TextureAttribute.class,TextureAttribute.Diffuse).textureDescription.texture;
        int count=0;
        for(PanelControl control:panel.controls())if(control instanceof SmallButton button){
            count++;check(button.scene().modelInstance.model==central.model,"Small button must share central cap geometry");
            check(button.scene().modelInstance.materials.first()!=central.materials.first(),"Material instance must be independent");
            check(button.scene().modelInstance.materials.first().get(TextureAttribute.class,TextureAttribute.Diffuse).textureDescription.texture==sourceTexture,"Texture must be shared");
            for(PanelControl other:panel.controls())if(other instanceof SmallButton&&other!=button)check(button.scene().modelInstance.materials.first()!=other.scene().modelInstance.materials.first(),"Small materials cannot alias");
            check(button.scene().modelInstance.materials.first().has(PanelSurfaceAttribute.TYPE),"Masked enamel shader attribute");
        }
        check(count==4,"Exactly four small buttons");check(!central.materials.first().has(PanelSurfaceAttribute.TYPE),"Central button color remains original");
        java.util.List<PanelElementId> presses=new ArrayList<>();panel.onSmallButtonPressed(presses::add);
        Matrix4 body=machine.scenes[0].modelInstance.transform.cpy(),base=machine.scenes[1].modelInstance.transform.cpy(),big=central.transform.cpy();
        for(PanelControl control:panel.controls())if(control instanceof SmallButton button){
            down(button);machine.update(.05f);near(.5f,button.depression());
            machine.update(.05f);near(1,button.depression());
            orbit.touchDragged(500,500,0);machine.update(2);near(1,button.depression());
            check(!button.press(),"Holding cannot produce a second press");
            up();machine.update(.075f);near(.5f,button.depression());machine.update(.075f);near(0,button.depression());
            for(PanelControl other:panel.controls())if(other instanceof SmallButton b&&other!=button)near(0,b.depression());
            check(Arrays.equals(body.val,machine.scenes[0].modelInstance.transform.val)&&Arrays.equals(base.val,machine.scenes[1].modelInstance.transform.val)&&Arrays.equals(big.val,central.transform.val),"Fixed body/base and central cap cannot move with small button");
        }
        check(presses.equals(List.of(PanelElementId.SMALL_BUTTON_1,PanelElementId.SMALL_BUTTON_2,PanelElementId.SMALL_BUTTON_3,PanelElementId.SMALL_BUTTON_4)),"One callback per actual small-button press");
        var red=panel.button(PanelElementId.SMALL_BUTTON_1);var green=panel.button(PanelElementId.SMALL_BUTTON_2);
        Color greenBefore=green.color();panel.setButtonColor(red.id(),Color.BLUE);check(green.color().equals(greenBefore),"Changing red cannot tint green");
        panel.reset();panel.setLocked(red.id(),true);int events=panel.playerActions().size();down(red);machine.update(1);near(0,red.depression());up();check(panel.playerActions().size()==events,"Locked press cannot emit player action");
        panel.setLocked(red.id(),false);panel.press(red.id());panel.press(green.id());machine.update(.1f);near(1,red.depression());near(1,green.depression());
        panel.release(red.id());machine.update(.15f);near(0,red.depression());near(1,green.depression());panel.setLocked(green.id(),true);machine.update(.15f);near(0,green.depression());
        panel.reset();orbit.reset();
        for(float expected:new float[]{45,90,135,0}){
            Vector3 pivotBefore=new Vector3(-.019f,.46f,.002f).mul(panel.adjuster().scene().modelInstance.transform);
            down(panel.adjuster());machine.update(.09f);check(panel.adjuster().turning(),"Regulator must interpolate");machine.update(.09f);near(expected,panel.adjuster().angle());up();
            Vector3 pivotAfter=new Vector3(-.019f,.46f,.002f).mul(panel.adjuster().scene().modelInstance.transform);
            check(pivotBefore.epsilonEquals(pivotAfter,.00001f),"Regulator rotates around its shaft, not model origin");
        }
        check(panel.playerActions().stream().filter(a->a.kind()==PanelAction.Kind.ADJUSTER_CHANGED).count()==4,"One detent event per settled turn");
        panel.setLocked(PanelElementId.ADJUSTER,true);down(panel.adjuster());up();machine.update(1);near(0,panel.adjuster().angle());
        panel.setLocked(PanelElementId.ADJUSTER,false);panel.adjuster().setAllowedAngles(0,30,60);panel.setAdjusterAngle(60);machine.update(.18f);near(60,panel.adjuster().angle());
        panel.setLocked(PanelElementId.ADJUSTER,true);panel.adjuster().setAllowedAngles(0,45,90,135);check(panel.adjuster().locked(),"Changing allowed detents cannot unlock a control");panel.setLocked(PanelElementId.ADJUSTER,false);
        panel.reset();down(panel.light());up();machine.update(.075f);check(panel.light().intensity()>0&&panel.light().intensity()<1,"Lamp has smooth fade");machine.update(.075f);check(panel.light().color()==LightModule.State.RED,"Lens click cycles indicator color");near(1,panel.light().intensity());
        for(LightModule.State state:LightModule.State.values()){panel.setLightColor(state);machine.update(.15f);check(panel.light().color()==state,"Independent lamp state");near(state==LightModule.State.OFF?0:1,panel.light().intensity());}
        panel.setLightColor(LightModule.State.GREEN);machine.update(.15f);panel.light().setBrightness(.35f);machine.update(.15f);near(.35f,panel.light().intensity());
        panel.light().setBlinking(true,1,.5f);machine.update(.55f);near(0,panel.light().intensity());machine.update(.5f);near(.35f,panel.light().intensity());
        panel.setLocked(PanelElementId.LIGHT_MODULE,true);down(panel.light());up();check(panel.light().color()==LightModule.State.GREEN,"Locked lamp rejects player input");
        panel.reset();orbit.reset();
        // A drag beginning on empty scene must remain an orbit, including when crossing a control.
        orbit.touchDown(0,0,0,Input.Buttons.LEFT);Vector3 pixel=camera.project(target(red));orbit.touchDragged(Math.round(pixel.x),Math.round(Gdx.graphics.getHeight()-pixel.y),0);machine.update(1);near(0,red.depression());up();orbit.reset();
        Vector3 redTarget=target(red),rear=new Vector3(redTarget.x,redTarget.y,-2);
        check(machine.pick(new Ray(rear,new Vector3(redTarget).sub(rear).nor()))!=red.id(),"Cannot press through rear of computer");
        Vector3 bigTarget=new Vector3(0,.7f,0).mul(central.transform);check(machine.hitCap(new Ray(camera.position,new Vector3(bigTarget).sub(camera.position).nor())),"Central button still picks");
        machine.beginInteraction(PanelElementId.BIG_BUTTON);machine.update(.1f);near(1,machine.button.depression());machine.endInteraction(PanelElementId.BIG_BUTTON);machine.update(.15f);near(0,machine.button.depression());
        machine.beginInteraction(PanelElementId.BIG_BUTTON);panel.press(red.id());machine.update(.1f);panel.reset();near(0,machine.button.depression());near(0,red.depression());check(panel.history().isEmpty(),"Reset clears action history");check(panel.controls().stream().noneMatch(PanelControl::locked),"Reset unlocks all panel controls");
        // Pairwise visible control centers are separated; the closest pair is the two lower buttons.
        for(PanelControl a:panel.controls())for(PanelControl b:panel.controls())if(a!=b)check(target(a).dst(target(b))>.032f,"Controls overlap each other");
        System.out.println("PANEL LOGIC OK: four shared caps, masks/material independence, ray targets, held gestures, locks, pivot/detents/events, light fades/blink, sequence/reset, central button");
        closeCamera();
    }
    private void closeCamera(){Vector3 focus=new Vector3(0,.277f,.282f);camera.position.set(focus).add(.06f,.28f,.58f);camera.up.set(Vector3.Y);camera.lookAt(focus);camera.update();}
    private void capture(String filename){Pixmap p=Pixmap.createFromFrameBuffer(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());PixmapIO.writePNG(Gdx.files.absolute(filename),p,-1,true);p.dispose();}
    @Override public void render(){
        frames++;machine.update(1/60f);
        Gdx.gl.glViewport(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());Gdx.gl.glClearColor(.018f,.021f,.024f,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT|GL20.GL_DEPTH_BUFFER_BIT);renderer.render(0);
        if(frames==10)capture("/tmp/last-command-panel-off.png");
        if(frames==12)panel.setLightColor(LightModule.State.RED);
        if(frames==24)capture("/tmp/last-command-panel-red.png");
        if(frames==26){panel.press(PanelElementId.SMALL_BUTTON_1);panel.press(PanelElementId.SMALL_BUTTON_3);panel.setAdjusterAngle(90);panel.setLightColor(LightModule.State.GREEN);}
        if(frames==40)capture("/tmp/last-command-panel-pressed.png");
        if(frames==42){panel.release(PanelElementId.SMALL_BUTTON_1);panel.release(PanelElementId.SMALL_BUTTON_3);panel.setLightColor(LightModule.State.YELLOW);}
        if(frames==54)capture("/tmp/last-command-panel-yellow.png");
        if(frames==56)panel.setLightColor(LightModule.State.BLUE);
        if(frames==68)capture("/tmp/last-command-panel-blue.png");
        if(frames==70){check(Gdx.gl.glGetError()==GL20.GL_NO_ERROR,"OpenGL error");System.out.println("LastCommandPanelCheck OK: five unmodified GLBs, no duplicate mesh/maps, native PBR/glass emission, all panel interactions and central button");Gdx.app.exit();}
    }
    @Override public void dispose(){if(renderer!=null)renderer.dispose();if(machine!=null)machine.dispose();}
    public static void main(String[] args){var config=new Lwjgl3ApplicationConfiguration();config.setTitle("THE LAST COMMAND / front panel checks");config.setWindowedMode(1200,800);config.disableAudio(true);new Lwjgl3Application(new LastCommandPanelCheck(),config);}
}
