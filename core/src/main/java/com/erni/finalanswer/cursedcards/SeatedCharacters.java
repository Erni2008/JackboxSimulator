package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.g3d.*;
import com.badlogic.gdx.graphics.g3d.attributes.*;
import com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;
import com.badlogic.gdx.graphics.glutils.FrameBuffer;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.utils.*;
import com.erni.finalanswer.ui.lobby.cages.*;
import net.mgsx.gltf.scene3d.attributes.PBRTextureAttribute;

/**
 * The real FINAL ANSWER lobby characters at the table. The project's characters are 2D bone rigs (no 3D meshes), so
 * each seated player is that unchanged rig, animated live into a shared atlas and shown as a camera-facing standee
 * in the chair with the legs cropped below the seat: an isolated stand-in until seated 3D characters exist.
 * Reactions are transform-only (lean, hop, shake, slump); the rig geometry is never deformed.
 */
public final class SeatedCharacters implements CharacterActions,Disposable {
    /** Lobby ids in seat order; the same rigs and presentation profiles as the cage lobby. */
    public static final String[] IDS={"dracula","skeleton","pumpkin","plague_doctor","ghost","zombie","voodoo","puppeteer"};
    // Cage front opening in lobby design units (as tools/unity/baker/CageCharacterBaker).
    private static final float CLIP_X=108,CLIP_Y=62,CLIP_W=140,CLIP_H=163;
    private static final int COLUMNS=4,ROWS=2;

    private final CageLobby lobby=new CageLobby();
    private final CageCharacter[] rigs=new CageCharacter[IDS.length];
    private final CageCharacterPresentation.Profile[] profiles=new CageCharacterPresentation.Profile[IDS.length];
    private final CageCharacterPresentation presentation=new CageCharacterPresentation();
    private final FrameBuffer atlas;private final SpriteBatch batch=new SpriteBatch();
    private final int tileW,tileH;
    private final Model quad;private final ModelInstance[] standees=new ModelInstance[IDS.length];
    private final Vector3[] base=new Vector3[IDS.length];private final float[] yaw=new float[IDS.length];
    private final float height,crop,width;
    private int count;private float time=3f,sinceDraw=1;private final float interval;
    // reaction envelopes per seat
    private final float[] lean=new float[IDS.length],hop=new float[IDS.length],shake=new float[IDS.length],dread=new float[IDS.length];
    private final boolean[] eliminated=new boolean[IDS.length],survived=new boolean[IDS.length];
    private final Vector3 tmp=new Vector3();

    public SeatedCharacters(TableConfig.Character config,float scale,float fps){
        tileW=Math.round(CLIP_W*scale);tileH=Math.round(CLIP_H*scale);interval=1/fps;
        atlas=new FrameBuffer(Pixmap.Format.RGBA8888,tileW*COLUMNS,tileH*ROWS,false);
        atlas.getColorBufferTexture().setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);
        height=config.height;crop=config.crop;width=height*(CLIP_W/CLIP_H)/(1-crop);
        var mb=new ModelBuilder();long attrs=VertexAttributes.Usage.Position|VertexAttributes.Usage.Normal|VertexAttributes.Usage.TextureCoordinates;
        mb.begin();var part=mb.part("standee",GL20.GL_TRIANGLES,attrs,new Material());
        part.rect(-.5f,0,0, .5f,0,0, .5f,1,0, -.5f,1,0, 0,0,1);quad=mb.end();
        for(int i=0;i<IDS.length;i++){rigs[i]=lobby.createCharacter(IDS[i]);profiles[i]=lobby.presentation(IDS[i]);base[i]=new Vector3();
            var s=new ModelInstance(quad);Material m=s.materials.first();
            var region=new PBRTextureAttribute(PBRTextureAttribute.BaseColorTexture,atlas.getColorBufferTexture());
            float u0=(i%COLUMNS)/(float)COLUMNS,v0=(i/COLUMNS)/(float)ROWS,du=1f/COLUMNS,dv=1f/ROWS;
            region.offsetU=u0;region.scaleU=du;region.offsetV=v0+dv*crop;region.scaleV=dv*(1-crop);
            var glow=new PBRTextureAttribute(PBRTextureAttribute.EmissiveTexture,atlas.getColorBufferTexture());glow.offsetU=region.offsetU;glow.scaleU=region.scaleU;glow.offsetV=region.offsetV;glow.scaleV=region.scaleV;
            m.set(region,glow,ColorAttribute.createEmissive(.42f,.38f,.36f,1),new BlendingAttribute(GL20.GL_ONE,GL20.GL_ONE_MINUS_SRC_ALPHA,1),IntAttribute.createCullFace(GL20.GL_NONE),new DepthTestAttribute(GL20.GL_LEQUAL,true));
            standees[i]=s;}
    }
    /** Seat the first {@code n} characters; positions come from {@link SeatLayout}. */
    public void seat(Array<SeatLayout.Seat> seats){
        count=seats.size;for(int i=0;i<count;i++){var s=seats.get(i);base[i].set(s.character);yaw[i]=s.characterYaw;}
        java.util.Arrays.fill(eliminated,false);java.util.Arrays.fill(survived,false);java.util.Arrays.fill(lean,0);java.util.Arrays.fill(hop,0);java.util.Arrays.fill(shake,0);java.util.Arrays.fill(dread,0);
    }
    public String id(int seat){return IDS[seat];}
    /** Development: dump the character atlas. */
    public void debugSave(com.badlogic.gdx.files.FileHandle file){atlas.begin();Pixmap p=Pixmap.createFromFrameBuffer(0,0,atlas.getWidth(),atlas.getHeight());atlas.end();com.badlogic.gdx.graphics.PixmapIO.writePNG(file,p,-1,true);p.dispose();}
    public int count(){return count;}
    /** Animates rigs into the atlas (throttled to the configured fps) and places the standees facing the camera. */
    public boolean update(float dt,Camera camera,boolean animate){
        time+=dt;sinceDraw+=dt;boolean moving=false;
        for(int i=0;i<count;i++){lean[i]=Math.max(0,lean[i]-dt*1.6f);hop[i]=Math.max(0,hop[i]-dt*1.4f);shake[i]=Math.max(0,shake[i]-dt*.9f);moving|=lean[i]>0||hop[i]>0||shake[i]>0;}
        if(animate&&sinceDraw>=interval){drawAtlas(sinceDraw);sinceDraw=0;}
        for(int i=0;i<count;i++)place(i,camera);
        return moving;
    }
    /** Draw once without advancing animation (first frame / render-on-demand). */
    public void refresh(){drawAtlas(0);}
    private void drawAtlas(float delta){
        atlas.begin();Gdx.gl.glClearColor(0,0,0,0);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
        batch.setBlendFunctionSeparate(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA,GL20.GL_ONE,GL20.GL_ONE_MINUS_SRC_ALPHA);
        for(int i=0;i<count;i++){
            rigs[i].update(delta,time+i*.37f,0,false);
            Gdx.gl.glViewport((i%COLUMNS)*tileW,(i/COLUMNS)*tileH,tileW,tileH);
            batch.getProjectionMatrix().setToOrtho2D(CLIP_X,CLIP_Y,CLIP_W,CLIP_H);batch.begin();
            float alpha=eliminated[i]?1:1;batch.setColor(1,1,1,1);presentation.draw(batch,rigs[i],profiles[i],alpha,time);batch.end();}
        atlas.end();
    }
    private void place(int i,Camera camera){
        Vector3 b=base[i];float toCam=MathUtils.atan2Deg360(camera.position.x-b.x,camera.position.z-b.z);
        float horizontal=(float)Math.hypot(camera.position.x-b.x,camera.position.z-b.z),tilt=MathUtils.atan2Deg360(camera.position.y-b.y-height*.5f,horizontal);if(tilt>180)tilt-=360;
        float sway=shake[i]>0?MathUtils.sin(time*38)*.18f*shake[i]:0,up=hop[i]>0?MathUtils.sin(hop[i]*MathUtils.PI)*.9f:0,slump=eliminated[i]?1:0;
        tmp.set(b).add(MathUtils.sinDeg(yaw[i])*lean[i]*.7f,up-slump*.8f,MathUtils.cosDeg(yaw[i])*lean[i]*.7f);
        float shade=eliminated[i]?.35f:1;
        ((ColorAttribute)standees[i].materials.first().get(ColorAttribute.Emissive)).color.set(.42f*shade,.38f*shade,.36f*shade,1);
        standees[i].transform.setToTranslation(tmp).rotate(Vector3.Y,toCam).rotate(Vector3.X,-tilt*.55f).rotate(Vector3.Z,sway*20+slump*-14).scale(width,height,1);
    }
    public void render(ModelBatch modelBatch,com.badlogic.gdx.graphics.g3d.Environment environment){for(int i=0;i<count;i++)modelBatch.render(standees[i],environment);}
    /** World point above a character's head (labels, camera focus). */
    public Vector3 head(int seat,Vector3 out){return out.set(base[seat]).add(0,height+.4f,0);}

    // ---- CharacterActions: transform-only reactions available with the 2D rigs ----
    @Override public void idle(int seat){lean[seat]=0;}
    @Override public void lookAtCards(int seat){lean[seat]=Math.max(lean[seat],.5f);}
    @Override public void drawCard(int seat){lean[seat]=1;}
    @Override public void receiveCard(int seat){lean[seat]=Math.max(lean[seat],.6f);}
    @Override public void discardPair(int seat){hop[seat]=.6f;}
    @Override public void nervous(int seat){shake[seat]=1;}
    @Override public void survive(int seat){survived[seat]=true;hop[seat]=1;}
    @Override public void eliminate(int seat){eliminated[seat]=true;shake[seat]=1;}
    @Override public void dispose(){quad.dispose();atlas.dispose();batch.dispose();lobby.dispose();}
}
