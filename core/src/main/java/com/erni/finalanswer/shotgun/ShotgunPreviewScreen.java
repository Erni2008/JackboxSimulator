package com.erni.finalanswer.shotgun;

import com.badlogic.gdx.*;
import com.badlogic.gdx.files.FileHandle;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.g3d.utils.CameraInputController;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.math.collision.BoundingBox;
import com.erni.finalanswer.ui.UiFonts;

/** Developer-only entry point is supplied by lwjgl3's dev source set; no public menu changes. */
public final class ShotgunPreviewScreen extends InputAdapter implements Screen {
    private final ShotgunAssets assets=new ShotgunAssets();
    private final ShotgunConfig config;
    private final FileHandle saveFile;
    private final ModularShotgun shotgun;
    private final PerspectiveCamera camera=new PerspectiveCamera(38,Gdx.graphics.getWidth(),Gdx.graphics.getHeight());
    private final CameraInputController orbit;
    private final ShotgunRenderer renderer;
    private final ShotgunAudio audio;
    private final SpriteBatch batch;
    private final BitmapFont font;
    private final ShapeRenderer lines;
    private final BoundingBox bounds=new BoundingBox(),partBounds=new BoundingBox();
    private final Vector3 center=new Vector3(),size=new Vector3();
    private final Matrix4 uiProjection=new Matrix4(),debugIdentity=new Matrix4();
    private final StringBuilder text=new StringBuilder(2048);
    private int selected,axis,mode;
    private boolean grid,axes,paused,inspect,solo,disposed,highlight,details;
    private boolean hud=true;
    private ShotgunAnimator.State shownState;
    private ShotgunAnimator.CyclePhase shownPhase;
    private ShotgunAnimator.Chamber shownChamber;
    private ShotgunAnimator.BoltState shownBolt;
    private ShotgunAnimator.ShellState shownShell;
    private float refresh;
    private int demo;
    private String message="Select a part and adjust local transforms; source geometry limitations are shown below.";
    public ShotgunPreviewScreen(FileHandle source,FileHandle saveFile){
        this.config=ShotgunConfig.load(source);this.saveFile=saveFile;
        batch=new SpriteBatch();font=UiFonts.body(17);lines=new ShapeRenderer();
        shotgun=new ModularShotgun(assets,config);
        camera.near=.001f;camera.far=1000;camera.position.set(.8f,.6f,2);camera.lookAt(0,0,0);camera.update();
        orbit=new CameraInputController(camera);orbit.rotateButton=Input.Buttons.LEFT;orbit.translateButton=Input.Buttons.RIGHT;orbit.autoUpdate=true;
        renderer=new ShotgunRenderer(camera);renderer.provider(shotgun);audio=new ShotgunAudio(config);fit();refreshText();
    }
    public boolean audioAvailable(){return audio.available();}
    public ModularShotgun shotgun(){return shotgun;}
    public ShotgunConfig config(){return config;}
    public void inspectPart(int part){selected=part;inspect=true;updateVisibility();fit();}
    private void updateVisibility(){shotgun.inspection(inspect?selected:-1);for(int i=0;i<4;i++)shotgun.visible(i,!inspect&&!solo||i==selected);if(inspect&&selected==3)shotgun.animator.showShell();}
    /** Fixed inspection angles share the current orbit target and zoom. */
    public void viewDirection(float x,float y,float z){
        float distance=camera.position.dst(orbit.target);
        camera.position.set(x,y,z).nor().scl(distance).add(orbit.target);
        camera.up.set(Math.abs(y)>.95f?Vector3.Z:Vector3.Y);
        camera.lookAt(orbit.target);camera.update();
    }
    private void fit(){
        bounds.inf();
        for(int i=0;i<4;i++){var model=shotgun.model(i);if(model==null||!shotgun.rendered(i))continue;
            model.calculateBoundingBox(partBounds);partBounds.mul(model.transform);bounds.ext(partBounds);}
        if(!bounds.isValid()){bounds.set(new Vector3(-.5f,-.5f,-.5f),new Vector3(.5f,.5f,.5f));}
        bounds.getCenter(center);bounds.getDimensions(size);float distance=Math.max(.15f,size.len()*1.25f);
        orbit.target.set(center);camera.position.set(center).add(distance*.18f,distance*.28f,distance);camera.up.set(Vector3.Y);camera.lookAt(center);camera.update();
        orbit.translateUnits=Math.max(.1f,size.len());orbit.scrollFactor=-.08f;
    }
    @Override public void show(){Gdx.input.setInputProcessor(new InputMultiplexer(this,orbit));}
    @Override public boolean keyDown(int key){
        if(key==Input.Keys.P||key==Input.Keys.O||key==Input.Keys.C||key==Input.Keys.L||key==Input.Keys.TAB||key==Input.Keys.I)demo=0;
        if(key>=Input.Keys.NUM_1&&key<=Input.Keys.NUM_4){selected=key-Input.Keys.NUM_1;updateVisibility();if(inspect)fit();}
        else switch(key){
            case Input.Keys.ENTER->{demo=0;if(!inspect&&canOperate()&&!shotgun.fire())message="Cannot fire: chamber must be LIVE, bolt closed, mechanism idle.";}
            case Input.Keys.F5->{
                if(!inspect&&!solo&&canOperate()){shotgun.animator.resetShotgun();shotgun.animator.chamber(ShotgunAnimator.Chamber.LIVE);shotgun.fire();demo=1;}
            }
            case Input.Keys.F4->{hud=true;details=!details;}
            case Input.Keys.F6->hud=!hud;
            case Input.Keys.F1->viewDirection(0,0,1);
            case Input.Keys.F2->viewDirection(0,0,-1);
            case Input.Keys.F3->viewDirection(0,1,0);
            case Input.Keys.X->axis=0;case Input.Keys.Y->axis=1;case Input.Keys.Z->axis=2;
            case Input.Keys.M->mode=(mode+1)%3;
            case Input.Keys.LEFT,Input.Keys.RIGHT->{float sign=key==Input.Keys.LEFT?-1:1;float fine=Gdx.input.isKeyPressed(Input.Keys.SHIFT_LEFT)?.1f:1;
                var part=config.part(selected);if(mode==0)part.position[axis]+=sign*.01f*fine;
                else if(mode==1)part.rotation[axis]+=sign*2*fine;
                else part.scale[axis]=Math.max(.0001f,part.scale[axis]*(1+sign*.05f*fine));}
            case Input.Keys.P->{if(!inspect&&canOperate())shotgun.cycle();}
            case Input.Keys.O->{if(!inspect&&canOperate())shotgun.animator.openBolt();}
            case Input.Keys.C->{if(!inspect&&canOperate())shotgun.animator.closeBolt();}
            case Input.Keys.L->{if(!inspect&&canOperate()&&!shotgun.reload())message="Reload requires an EMPTY chamber and idle mechanism. Cycle first to eject.";}
            case Input.Keys.R->{demo=0;shotgun.animator.resetShotgun();}
            case Input.Keys.T->shotgun.animator.showShell();
            case Input.Keys.K->config.calibrated=!config.calibrated;
            case Input.Keys.U->config.part(selected).reset();
            case Input.Keys.B->highlight=!highlight;
            case Input.Keys.H->{config.part(selected).visible=!config.part(selected).visible;}
            case Input.Keys.I->{solo=!solo;updateVisibility();}
            case Input.Keys.TAB->{inspect=!inspect;shotgun.animator.resetShotgun();updateVisibility();fit();}
            case Input.Keys.S->{if(Gdx.input.isKeyPressed(Input.Keys.CONTROL_LEFT)||Gdx.input.isKeyPressed(Input.Keys.SYM)){
                try{config.save(saveFile);message="Saved: "+saveFile.path();}catch(RuntimeException error){message="SAVE FAILED: "+error.getMessage();}}}
            case Input.Keys.V->audio.muted(!audio.muted());
            case Input.Keys.G->grid=!grid;case Input.Keys.A->axes=!axes;
            case Input.Keys.F->fit();case Input.Keys.SPACE->{paused=!paused;if(paused)audio.stop();}
            case Input.Keys.ESCAPE->Gdx.app.exit();
            default->{return false;}
        }
        shotgun.update(0);refreshText();return true;
    }
    private boolean canOperate(){
        if(!shotgun.complete()){message="Required GLB asset is missing; see load errors.";return false;}
        if(shotgun.mechanismReady()){message=shotgun.bodyPrepared()?"Runtime-prepared BODY: working receiver port and metal magazine guide.":"Isolated component diagnostic active.";return true;}
        message="BLOCKED: merged BODY has a fixed pump/closed port. Use I (solo) for isolated animation; clean BODY required.";
        return false;
    }
    public void highlight(boolean enabled){highlight=enabled;refreshText();}
    private void refreshText(){
        shownState=shotgun.animator.state();shownPhase=shotgun.animator.cyclePhase();shownChamber=shotgun.animator.chamber();shownBolt=shotgun.animator.boltState();shownShell=shotgun.animator.shellState();
        text.setLength(0);var part=config.part(selected);
        text.append("FINAL ANSWER / MODULAR SHOTGUN / DEV\n")
            .append(inspect?"INSPECT ONE SOURCE MODEL (animations disabled)":solo?"ISOLATED PART DIAGNOSTIC":!shotgun.rendered(0)?"ISOLATED MECHANISM (BODY HIDDEN)":"ASSEMBLY")
            .append(" | chamber ").append(shotgun.animator.chamber()).append(" | ").append(shotgun.animator.state()).append(" | cycle ").append(shotgun.animator.cyclePhase()).append(" | bolt ").append(shotgun.animator.boltState()).append(" | shell ").append(shotgun.animator.shellState())
            .append(paused?" | PAUSED":"").append(" | FPS ").append(Gdx.graphics.getFramesPerSecond()).append('\n');
        text.append("Selected: ").append(ModularShotgun.PART_NAMES[selected]).append(" | axis ").append("XYZ".charAt(axis))
            .append(" | mode ").append(new String[]{"POSITION","ROTATION (degrees)","SCALE"}[mode]).append('\n');
        text.append("Position ");append(part.position);text.append("   Rotation ");append(part.rotation);text.append("   Scale ");append(part.scale);text.append('\n');
        text.append("Visibility: configured ").append(part.visible).append(" | rendered ").append(shotgun.rendered(selected))
            .append(" | geometry blocked ").append(shotgun.blocked(selected)).append(" | highlight ").append(highlight).append('\n');
        text.append("Shell size multiplier: ").append(config.shellScale).append(" | effective XYZ: ");
        for(float scale:config.shell.scale)text.append(Math.round(scale*config.shellScale*100000)/100000f).append(' ');text.append('\n');
        text.append("Audio: ").append(audio.available()?(audio.muted()?"MUTED":"READY"):"UNAVAILABLE").append(" (V: mute)\n");
        if(shotgun.bodyPrepared()&&!inspect)text.append("BODY PREPARED: receiver port open / metal guide / original GLBs intact.\n");
        if(!shotgun.mechanismReady()&&!inspect&&!solo)text.append("MECHANISM BLOCKED: duplicates suppressed; original BODY pump/port cannot animate. Clean BODY required.\n");
        int vertices=0,triangles=0;for(int i=0;i<4;i++){var model=shotgun.model(i);if(model!=null)for(var mesh:model.model.meshes){vertices+=mesh.getNumVertices();triangles+=(mesh.getNumIndices()==0?mesh.getNumVertices():mesh.getNumIndices())/3;}}
        text.append("Loaded ").append(assets.loadedCount()).append("/4 | vertices ").append(vertices).append(" | triangles ").append(triangles).append('\n');
        if(!details){
            text.append("ENTER: fire | P: cycle/eject | L: reload | F5: complete demo | F6: clean view | F4: help | B: highlight\n");
            for(String failure:assets.failures())text.append(failure).append('\n');
            return;
        }
        text.append("LMB drag: orbit | RMB: pan | wheel: zoom | F: fit | F1/F2/F3: side/reverse/top\n")
            .append("1-4: part | X/Y/Z: axis | M: translate/rotate/scale | arrows: adjust | Shift: fine\n")
            .append("ENTER: fire | F5: complete demo | P: pump/eject | O/C: bolt | L: reload | R: reset | T: shell\n")
            .append("B: selected bounds highlight | H: visibility | I: solo | Tab: source inspection/assembly | U: reset selected transform\n")
            .append("Ctrl+S: save alignment | K: calibrated flag | G: grid | A: axes | Space: pause | Esc: exit\n")
            .append(message).append('\n');
        if(!config.calibrated&&!shotgun.bodyPrepared())text.append("INITIAL ALIGNMENT: source mechanism requires preparation or a clean BODY.\n");
        if(config.notes!=null&&!config.notes.isBlank())text.append(config.notes).append('\n');
        for(String failure:assets.failures())text.append(failure).append('\n');
    }
    private void append(float[] values){for(float v:values)text.append(Math.round(v*10000)/10000f).append(' ');}
    @Override public void render(float delta){
        float dt=Float.isFinite(delta)&&delta>0?delta:0;
        shotgun.update(paused||inspect?0:dt);
        if(!paused&&!inspect&&demo>0&&!shotgun.animator.isAnimating()){
            if(demo==1){if(shotgun.cycle())demo=2;else demo=0;}
            else if(demo==2){if(shotgun.reload())demo=3;else demo=0;}
            else demo=0;
        }
        if(!paused&&!inspect)audio.update(shotgun.animator);
        orbit.update();
        Gdx.gl.glViewport(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
        Gdx.gl.glClearColor(.025f,.022f,.028f,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT|GL20.GL_DEPTH_BUFFER_BIT);
        renderer.render(0);
        if(grid||axes){Gdx.gl.glEnable(GL20.GL_DEPTH_TEST);lines.setProjectionMatrix(camera.combined);lines.begin(ShapeRenderer.ShapeType.Line);
            float s=Math.max(.1f,size.len());if(grid){lines.setColor(.15f,.14f,.16f,1);for(int i=-10;i<=10;i++){float d=i*s/10;lines.line(-s,0,d,s,0,d);lines.line(d,0,-s,d,0,s);}}
            if(axes){lines.setColor(Color.RED);lines.line(0,0,0,s,0,0);lines.setColor(Color.GREEN);lines.line(0,0,0,0,s,0);lines.setColor(Color.BLUE);lines.line(0,0,0,0,0,s);}lines.end();}
        Gdx.gl.glDisable(GL20.GL_DEPTH_TEST);
        // Temporary x-ray bounds reveal the selected source even when BODY occludes it.
        // Original materials are never changed, so toggling this cannot leave a tint behind.
        if(highlight){var model=shotgun.model(selected);if(model!=null){
            model.calculateBoundingBox(partBounds);lines.setProjectionMatrix(camera.combined);lines.setTransformMatrix(model.transform);
            lines.begin(ShapeRenderer.ShapeType.Line);lines.setColor(1,.72f,.22f,1);
            lines.box(partBounds.min.x,partBounds.min.y,partBounds.max.z,partBounds.getWidth(),partBounds.getHeight(),partBounds.getDepth());
            lines.end();lines.setTransformMatrix(debugIdentity);
        }}
        refresh+=dt;if(refresh>.2f||shownState!=shotgun.animator.state()||shownPhase!=shotgun.animator.cyclePhase()||shownChamber!=shotgun.animator.chamber()||shownBolt!=shotgun.animator.boltState()||shownShell!=shotgun.animator.shellState()){refresh=0;refreshText();}
        batch.begin();font.setColor(.90f,.84f,.73f,1);if(hud)font.draw(batch,text,18,Gdx.graphics.getHeight()-18,Gdx.graphics.getWidth()-36,com.badlogic.gdx.utils.Align.left,true);else font.draw(batch,"F6: interface / F5: full demonstration",18,28);batch.end();
    }
    @Override public void resize(int width,int height){camera.viewportWidth=width;camera.viewportHeight=height;camera.update();uiProjection.setToOrtho2D(0,0,width,height);batch.setProjectionMatrix(uiProjection);}
    @Override public void pause(){paused=true;audio.stop();}
    @Override public void resume(){paused=false;}
    @Override public void hide(){Gdx.input.setInputProcessor(null);}
    @Override public void dispose(){if(disposed)return;disposed=true;hide();audio.dispose();renderer.dispose();lines.dispose();batch.dispose();font.dispose();assets.dispose();}
}
