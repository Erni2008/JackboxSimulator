package com.erni.finalanswer.lwjgl3;
import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.math.collision.*;
import com.erni.finalanswer.lastcommand.*;
import java.util.*;
/** Native GLB/PBR/hinge/region-picking regression and reproducible assembly screenshots. */
public final class LastCommandMechanismCheck extends ApplicationAdapter {
    TheLastCommandMachine machine;TheLastCommandRenderer renderer;PerspectiveCamera camera;int frame;
    static void check(boolean ok,String message){if(!ok)throw new AssertionError(message);}
    @Override public void create(){
        machine=new TheLastCommandMachine();check(machine.loadedAssetCount()==10&&machine.mechanisms()!=null,"All ten GLBs: "+machine.status);
        camera=new PerspectiveCamera(40,1100,850);new OrbitCameraController(camera,machine);renderer=new TheLastCommandRenderer(camera,machine);
        var modules=machine.mechanisms();var lever=modules.lever();Vector3 pivot=MechanismConfiguration.load().leverHandle.pivot.cpy(),before=pivot.cpy().mul(lever.scene().modelInstance.transform);
        Matrix4 base=machine.panel().control(PanelElementId.LEVER_BASE).scene().modelInstance.transform.cpy();
        for(int state=1;state<3;state++){lever.setPosition(state);machine.update(.14f);check(lever.animating(),"Lever interpolates");machine.update(.14f);check(!lever.animating(),"Lever settles");check(before.epsilonEquals(pivot.cpy().mul(lever.scene().modelInstance.transform),.00001f),"Lever axle fixed");}
        check(Arrays.equals(base.val,machine.panel().control(PanelElementId.LEVER_BASE).scene().modelInstance.transform.val),"Lever base fixed");
        var hatch=modules.hatch();Vector3 hinge=MechanismConfiguration.load().doorPivot.cpy(),closed=hinge.cpy().mul(hatch.scene().modelInstance.transform);
        hatch.setOpen(true);machine.update(.25f);check(hatch.animating(),"Door interpolates");machine.update(.25f);check(Math.abs(hatch.angle()+115)<.001,"Door angle");check(closed.epsilonEquals(hinge.cpy().mul(hatch.scene().modelInstance.transform),.00001f),"Door hinge fixed");
        machine.panel().setLocked(PanelElementId.HIDDEN_HATCH,true);machine.beginInteraction(PanelElementId.HIDDEN_HATCH);check(hatch.open(),"Locked hatch cannot toggle");machine.panel().setLocked(PanelElementId.HIDDEN_HATCH,false);
        var code=modules.code();code.setCode("9999");code.change(0,1,PanelAction.Cause.PLAYER);check(code.code().equals("0999"),"9 wraps to 0");code.change(0,-1,PanelAction.Cause.PLAYER);check(code.matches("9999"),"0 wraps to 9");code.setLocked(true);check(!code.change(1,1,PanelAction.Cause.PLAYER)&&code.matches("9999"),"Code lock");code.setLocked(false);code.setCode("3719");machine.update(.16f);check(!code.animating(),"Digit animation settles");
        var screenConfig=MechanismConfiguration.load();
        check(!code.interactionBounds(new BoundingBox()).intersects(new BoundingBox(screenConfig.questionScreenMin,screenConfig.questionScreenMax)),"Question display stays unobstructed");
        check(machine.pick(new Ray(new Vector3(0,.49f,1),new Vector3(0,0,-1)))==null,"Question display cannot activate a code arrow");
        // Select each arrow from its own local front, including a rotated machine root.
        for(int turn=0;turn<2;turn++){
            machine.transform.idt().rotate(Vector3.Y,turn*37);
            for(int i=0;i<4;i++)for(int direction:new int[]{1,-1}){
                Vector3 target=new Vector3(-.335f+i*.2233f,direction>0?.447f:.066f,.264f).mul(code.scene().modelInstance.transform).mul(machine.transform);
                Vector3 normal=new Vector3(0,0,1).rot(code.scene().modelInstance.transform).rot(machine.transform).nor();
                var id=machine.pick(new Ray(target.cpy().mulAdd(normal,.5f),normal.scl(-1)));
                var expected=PanelElementId.values()[(direction>0?PanelElementId.CODE_UP_1:PanelElementId.CODE_DOWN_1).ordinal()+i];check(id==expected,"Code arrow "+expected+" selected "+id);
            }
        }
        machine.transform.idt();lever.setPosition(1);hatch.setOpen(false);machine.update(1);
        for(var control:List.of(lever,hatch)){
            Vector3 source=control==lever?new Vector3(0,.97f,0):new Vector3(.1f,.23f,.078f);
            Vector3 target=source.mul(control.scene().modelInstance.transform);
            Vector3 normal=control==lever?new Vector3(-1,0,0):new Vector3(0,0,1).rot(control.scene().modelInstance.transform).nor();
            var selected=machine.pick(new Ray(target.cpy().mulAdd(normal,.5f),normal.scl(-1)));check(selected==control.id(),"Direct ray selects "+control.id()+" instead of "+selected);
        }
        machine.transform.idt();hatch.setHint("3719");hatch.setOpen(false);machine.update(1);lever.setPosition(1);machine.update(1);
        var config=MechanismConfiguration.load();check(config.select(new Random(991)).id.equals(config.select(new Random(991)).id),"Deterministic mount selection");Set<String> selected=new HashSet<>();Random root=new Random(2026);for(int i=0;i<30;i++)selected.add(config.select(root).id);check(selected.size()>=2,"Multiple seed placements");
        System.out.println("MECHANISM_ASSERTIONS_OK mount="+hatch.placementId());
    }
    @Override public void render(){
        int view=frame/15;Vector3 center=new Vector3(0,.39f,0);
        Vector3 direction=switch(view%4){case 0->new Vector3(.35f,.18f,1);case 1->new Vector3(-1,.12f,.2f);case 2->new Vector3(1,.12f,.1f);default->new Vector3(0,.1f,-1);};
        if(view>=4)machine.mechanisms().hatch().setOpen(true);
        float distance=.92f;
        if(view>=8&&view<=10){machine.mechanisms().lever().setPosition(view-8);center.set(-.28f,.34f,-.04f);direction.set(-1,.15f,.25f);distance=.5f;}
        if(view==11){center.set(0,.69f,.2f);direction.set(.2f,.15f,1);distance=.35f;}
        machine.update(1/30f);camera.position.set(center).mulAdd(direction,distance);camera.up.set(Vector3.Y);camera.lookAt(center);camera.near=.005f;camera.far=30;camera.update();
        Gdx.gl.glViewport(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());Gdx.gl.glClearColor(.018f,.021f,.024f,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT|GL20.GL_DEPTH_BUFFER_BIT);renderer.render(1/30f);
        if(frame%15==14){var pixmap=Pixmap.createFromFrameBuffer(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());var file=Gdx.files.absolute(System.getProperty("lc.shots","/tmp/lc-assembly")+"/"+machine.mechanisms().hatch().placementId()+"-"+GraphicsProfile.current()+"-"+view+".png");file.parent().mkdirs();PixmapIO.writePNG(file,pixmap,-1,true);pixmap.dispose();}
        if(++frame>=180)Gdx.app.exit();
    }
    @Override public void dispose(){renderer.dispose();machine.dispose();System.out.println("MECHANISM_CHECK_OK");}
    public static void main(String[] args){var c=new Lwjgl3ApplicationConfiguration();c.setWindowedMode(1100,850);c.disableAudio(true);c.setForegroundFPS(60);new Lwjgl3Application(new LastCommandMechanismCheck(),c);}
}
