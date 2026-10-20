package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.Matrix4;
import com.badlogic.gdx.utils.Json;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.ui.UiFonts;
import com.erni.finalanswer.ui.lobby.cages.*;

/** Dev source set only. Same production rig, editable config and shared assets. */
public final class VoodooStudioLauncher {
    public static void main(String[] args) {
        if(StartupHelper.startNewJvmIfRequired())return;
        var window=new Lwjgl3ApplicationConfiguration();window.setTitle("Voodoo rig studio — I S V L D E / Space / Tab / arrows / +/- / Ctrl+S");
        window.setWindowedMode(1440,960);window.disableAudio(true);window.setForegroundFPS(60);
        new Lwjgl3Application(new ApplicationAdapter(){
            final FitViewport viewport=new FitViewport(1440,960);final Matrix4 transform=new Matrix4();
            SpriteBatch batch;BitmapFont font;ShapeRenderer shapes;VoodooConfig config;VoodooAssets assets;VoodooCharacter[] dolls;
            boolean pause,pivots,bounds;int selected,shot;float elapsed;
            final boolean check=Boolean.getBoolean("voodoo.studio.check");
            final float[] captures={.15f,.7f,1.25f,1.65f,2.65f,4,5.8f,7,8.6f,10.2f,11,12,13.5f,15.3f,16,17.5f,19.4f,22.5f};
            @Override public void create(){batch=new SpriteBatch();font=UiFonts.body(20);shapes=new ShapeRenderer();reload();if(check)verifyRig();}
            void reload(){if(assets!=null)assets.dispose();config=VoodooConfig.load();assets=new VoodooAssets(config);dolls=new VoodooCharacter[8];for(int i=0;i<8;i++)dolls[i]=new VoodooCharacter(assets,config,123+i);}
            void verifyRig(){
                var probe=new VoodooCharacter(assets,config,99);probe.advance(0,0,false);
                var head=java.util.Arrays.stream(probe.parts()).filter(p->p.config.name.equals("head")).findFirst().orElseThrow();
                var eye=java.util.Arrays.stream(probe.parts()).filter(p->p.config.name.equals("redButton")).findFirst().orElseThrow();
                float x=eye.world.val[Matrix4.M03],y=eye.world.val[Matrix4.M13],angle=head.config.rotation;
                head.config.rotation+=15;probe.advance(0,0,false);
                if(Math.hypot(eye.world.val[Matrix4.M03]-x,eye.world.val[Matrix4.M13]-y)<1)throw new AssertionError("Button must inherit head pivot rotation");
                head.config.rotation=angle;probe.advance(0,0,false);
                float distance=(float)Math.hypot(eye.world.val[Matrix4.M03]-head.world.val[Matrix4.M03],eye.world.val[Matrix4.M13]-head.world.val[Matrix4.M13]);
                float sx=head.config.scaleX,sy=head.config.scaleY;head.config.scaleX*=1.2f;head.config.scaleY*=1.2f;probe.advance(0,0,false);
                float scaled=(float)Math.hypot(eye.world.val[Matrix4.M03]-head.world.val[Matrix4.M03],eye.world.val[Matrix4.M13]-head.world.val[Matrix4.M13]);
                if(Math.abs(scaled-distance*1.2f)>.002f)throw new AssertionError("Children must inherit live head scale");
                head.config.scaleX=sx;head.config.scaleY=sy;
                System.out.println("PASS: live rig rotation/scaling, child attachment and zero-delta pause");
            }
            void state(VoodooAnimationController.State state){for(var doll:dolls)doll.play(state,1200+state.ordinal());}
            boolean key(int k){return Gdx.input.isKeyJustPressed(k);}
            @Override public void render(){
                float dt=check?1f/60:Math.min(.1f,Gdx.graphics.getDeltaTime()),before=elapsed;elapsed+=dt;
                if(key(Input.Keys.ESCAPE))Gdx.app.exit();if(!check&&key(Input.Keys.SPACE))pause=!pause;
                if(key(Input.Keys.P))pivots=!pivots;if(key(Input.Keys.B))bounds=!bounds;
                if(key(Input.Keys.TAB))selected=(selected+1)%dolls[0].parts().length;
                if(key(Input.Keys.R))reload();
                boolean ctrl=Gdx.input.isKeyPressed(Input.Keys.CONTROL_LEFT)||Gdx.input.isKeyPressed(Input.Keys.CONTROL_RIGHT);
                if(ctrl&&key(Input.Keys.S)){Json json=new Json();json.setOutputType(com.badlogic.gdx.utils.JsonWriter.OutputType.json);Gdx.files.absolute(System.getProperty("voodoo.config")).writeString(json.prettyPrint(config),false,"UTF-8");}
                if(key(Input.Keys.I))state(VoodooAnimationController.State.IDLE);
                if(!ctrl&&key(Input.Keys.S))state(VoodooAnimationController.State.SELECTED);
                if(key(Input.Keys.V)||check&&before<3&&elapsed>=3)state(VoodooAnimationController.State.VICTORY);
                if(key(Input.Keys.L)||check&&before<6.2f&&elapsed>=6.2f)state(VoodooAnimationController.State.DEFEAT);
                if(key(Input.Keys.D)||check&&before<10&&elapsed>=10)state(VoodooAnimationController.State.DEATH);
                if(check&&before<15.5f&&elapsed>=15.5f)state(VoodooAnimationController.State.IDLE);
                if(key(Input.Keys.E)||check&&before<16&&elapsed>=16)state(VoodooAnimationController.State.ELIMINATION);
                VoodooConfig.Part part=config.parts.get(selected);
                float step=Gdx.input.isKeyPressed(Input.Keys.SHIFT_LEFT)?2:.25f;
                if(key(Input.Keys.LEFT))part.x-=step;if(key(Input.Keys.RIGHT))part.x+=step;if(key(Input.Keys.UP))part.y+=step;if(key(Input.Keys.DOWN))part.y-=step;
                if(key(Input.Keys.EQUALS)||key(Input.Keys.PLUS)){part.scaleX*=1.025f;part.scaleY*=1.025f;}if(key(Input.Keys.MINUS)){part.scaleX/=1.025f;part.scaleY/=1.025f;}
                if(key(Input.Keys.LEFT_BRACKET))part.rotation-=1;if(key(Input.Keys.RIGHT_BRACKET))part.rotation+=1;
                if(check){pivots=elapsed>2.6f&&elapsed<2.9f;bounds=pivots;}
                ScreenUtils.clear(.055f,.06f,.07f,1);viewport.apply();batch.setProjectionMatrix(viewport.getCamera().combined);batch.begin();
                for(int i=0;i<8;i++){dolls[i].advance(pause?0:dt,i*.67f,false);dolls[i].drawAt(batch,i==0?365:850+(i%3)*190,i==0?150:100+(i/3)*235,i==0?4.3f:1.2f,1);}
                font.draw(batch,"VOODOO / "+dolls[0].controller().state()+"    I idle  S selected  V victory  L defeat  D death  E elimination",30,925);
                font.draw(batch,"Space pause | P pivots | B bounds | Tab part | arrows move | +/- size | [ ] rotate | Ctrl+S save | R reload",30,898);
                font.draw(batch,part.name+"  x="+part.x+" y="+part.y+" scale="+part.scaleX+" art="+part.artScale+(pause?"  PAUSED":""),30,58);batch.end();
                if(pivots||bounds){shapes.setProjectionMatrix(viewport.getCamera().combined);for(var p:dolls[0].parts()){
                    transform.idt().translate(365,150,0).scale(4.3f,4.3f,1).mul(p.world);shapes.setTransformMatrix(transform);shapes.begin(ShapeRenderer.ShapeType.Line);shapes.setColor(p.config==part?Color.YELLOW:Color.GREEN);
                    if(pivots){shapes.line(-1,0,1,0);shapes.line(0,-1,0,1);}
                    if(bounds){int ox=p.config.region==null?0:p.config.region[0],oy=p.config.region==null?0:p.config.region[1];float scale=p.config.artScale;shapes.rect(-(p.pivotX-ox)*scale,(p.pivotY-oy-p.region.getRegionHeight())*scale,p.region.getRegionWidth()*scale,p.region.getRegionHeight()*scale);}shapes.end();}}
                if(check&&shot<captures.length&&elapsed>=captures[shot]){
                    if(Gdx.gl.glGetError()!=0)throw new AssertionError("Voodoo studio OpenGL error");
                    var pixels=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
                    PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("voodoo.output")+"/studio-"+shot+".png"),pixels,-1,true);pixels.dispose();shot++;
                    if(shot==captures.length){System.out.println("PASS: Voodoo all six states, eight instances and GL rendering");Gdx.app.exit();}
                }
            }
            @Override public void resize(int w,int h){viewport.update(w,h,true);}
            @Override public void dispose(){batch.dispose();font.dispose();shapes.dispose();assets.dispose();}
        },window);
    }
}
