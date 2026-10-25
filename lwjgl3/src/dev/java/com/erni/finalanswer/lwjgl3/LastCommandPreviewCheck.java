package com.erni.finalanswer.lwjgl3;
import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.math.collision.Ray;
import com.erni.finalanswer.lastcommand.*;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.lastcommand.TheLastCommandScreen;
/** Native GL smoke test: renders two independent visits and exercises disposal. */
public final class LastCommandPreviewCheck extends ApplicationAdapter {
    private TheLastCommandScreen screen;
    private int frames;
    private void cameraCheck(){
        var machine = new com.erni.finalanswer.lastcommand.TheLastCommandMachine();
        var camera = new com.badlogic.gdx.graphics.PerspectiveCamera(45,1000,700);
        var controller = new com.erni.finalanswer.lastcommand.OrbitCameraController(camera,machine);
        var initial = camera.position.cpy();
        controller.touchDown(0,0,0,Input.Buttons.LEFT);controller.touchDragged(150,100,0);controller.touchUp(150,100,0,Input.Buttons.LEFT);
        if(camera.position.epsilonEquals(initial,.001f))throw new AssertionError("Orbit did not move camera");
        controller.reset();if(!camera.position.epsilonEquals(initial,.001f))throw new AssertionError("Reset failed");
        controller.scrolled(0,-1000);
        float radius=machine.bounds.getDimensions(new com.badlogic.gdx.math.Vector3()).len()*.5f;
        if(camera.position.dst(machine.bounds.getCenter(new com.badlogic.gdx.math.Vector3())) < radius)throw new AssertionError("Camera entered machine");
        controller.touchDown(0,0,0,Input.Buttons.RIGHT);controller.touchDragged(60,30,0);controller.touchUp(60,30,0,Input.Buttons.RIGHT);
        controller.reset();controller.cancel();
        if(!machine.complete())throw new AssertionError("Original GLBs did not load: "+machine.status);
        Matrix4 bodyRest=machine.scenes[0].modelInstance.transform.cpy(),baseRest=machine.scenes[1].modelInstance.transform.cpy();
        Matrix4 capRest=machine.scenes[2].modelInstance.transform.cpy();
        Vector3 capTop=new Vector3(0,.7f,0).mul(capRest);
        if(!machine.hitCap(new Ray(camera.position,new Vector3(capTop).sub(camera.position).nor())))throw new AssertionError("Red cap picking failed");
        Vector3 metal=new Vector3(.48f,.27f,0).mul(baseRest);
        if(machine.hitCap(new Ray(camera.position,new Vector3(metal).sub(camera.position).nor())))throw new AssertionError("Metal base triggered press");
        Vector3 rear=new Vector3(capTop.x,capTop.y,-2);
        if(machine.hitCap(new Ray(rear,new Vector3(capTop).sub(rear).nor())))throw new AssertionError("Picking through body");
        Vector3 screenPoint=camera.project(new Vector3(capTop));
        int x=Math.round(screenPoint.x), y=Math.round(Gdx.graphics.getHeight()-screenPoint.y);
        controller.touchDown(x,y,0,Input.Buttons.LEFT);machine.update(.05f);near(.5f,machine.button.depression());
        machine.update(.05f);near(1,machine.button.depression());
        controller.touchDragged(x+40,y+40,0);machine.update(2);near(1,machine.button.depression());
        if(!camera.position.epsilonEquals(initial,.001f))throw new AssertionError("Button gesture rotated camera");
        if(!java.util.Arrays.equals(bodyRest.val,machine.scenes[0].modelInstance.transform.val)||!java.util.Arrays.equals(baseRest.val,machine.scenes[1].modelInstance.transform.val))throw new AssertionError("Fixed pieces moved");
        Vector3 travel=machine.scenes[2].modelInstance.transform.getTranslation(new Vector3()).sub(capRest.getTranslation(new Vector3()));
        near(.00972f,travel.len());if(travel.y>=0||travel.z>=0)throw new AssertionError("Cap did not travel into the sloped panel");
        controller.touchUp(x+40,y+40,0,Input.Buttons.LEFT);machine.update(.075f);near(.5f,machine.button.depression());machine.update(.075f);near(0,machine.button.depression());
        // Start outside the button, then cross it: that gesture must remain an orbit.
        controller.touchDown(0,0,0,Input.Buttons.LEFT);controller.touchDragged(x,y,0);machine.update(1);near(0,machine.button.depression());controller.cancel();
        captureMechanism(machine,camera);
        machine.dispose();
    }
    private static void near(float expected,float actual){if(Math.abs(expected-actual)>.0001f)throw new AssertionError(expected+" != "+actual);}
    private static void capture(String path){
        var p=com.badlogic.gdx.graphics.Pixmap.createFromFrameBuffer(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
        com.badlogic.gdx.graphics.PixmapIO.writePNG(Gdx.files.absolute(path),p,-1,true);p.dispose();
    }
    private static void captureMechanism(TheLastCommandMachine machine,com.badlogic.gdx.graphics.PerspectiveCamera camera){
        var renderer=new TheLastCommandRenderer(camera,machine);
        Vector3 target=new Vector3(0,.4f,0).mul(machine.scenes[2].modelInstance.transform);
        for(int view=0;view<4;view++){
            camera.position.set(target).add(view>=2?.28f:.04f,.16f,.28f);camera.up.set(Vector3.Y);camera.lookAt(target);camera.update();
            machine.button.held(view%2==1);machine.update(1);
            Gdx.gl.glViewport(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
            Gdx.gl.glClearColor(.018f,.021f,.024f,1);Gdx.gl.glClear(com.badlogic.gdx.graphics.GL20.GL_COLOR_BUFFER_BIT|com.badlogic.gdx.graphics.GL20.GL_DEPTH_BUFFER_BIT);
            renderer.render(0);capture("/tmp/last-command-button-"+view+".png");
        }
        machine.button.held(false);machine.update(1);renderer.dispose();
    }
    @Override public void create(){cameraCheck();screen=new TheLastCommandScreen(new FinalAnswerGame());screen.show();screen.resize(1000,700);}
    @Override public void render(){
        screen.render(Gdx.graphics.getDeltaTime());frames++;
        if(frames==10){
            var image=com.badlogic.gdx.graphics.Pixmap.createFromFrameBuffer(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
            int titlePixels=0;
            for(int py=image.getHeight()-150;py<image.getHeight()-10;py++)for(int px=20;px<image.getWidth()-20;px++)
                if(((image.getPixel(px,py)>>>24)&255)>90)titlePixels++;
            if(titlePixels<50)throw new AssertionError("3D depth state hid the UI overlay");
            com.badlogic.gdx.graphics.PixmapIO.writePNG(Gdx.files.absolute("/tmp/last-command-preview.png"),image,-1,true);image.dispose();
        }
        if(frames==30){screen.pause();screen.hide();screen.dispose();screen=new TheLastCommandScreen(new FinalAnswerGame());screen.show();screen.resize(1000,700);}
        if(frames==60){System.out.println("LastCommandPreviewCheck OK: native rendering, orbit/pan/reset, collision limit, three real GLBs, red-only picking/occlusion, press/hold/release, fixed body/base, reopen/dispose");Gdx.app.exit();}
    }
    @Override public void dispose(){if(screen!=null){screen.hide();screen.dispose();}}
    public static void main(String[] args){var c=new Lwjgl3ApplicationConfiguration();c.setTitle("THE LAST COMMAND / smoke check");c.setWindowedMode(1000,700);c.disableAudio(true);new Lwjgl3Application(new LastCommandPreviewCheck(),c);}
}
