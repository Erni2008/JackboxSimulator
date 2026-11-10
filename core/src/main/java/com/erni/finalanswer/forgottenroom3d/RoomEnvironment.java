package com.erni.finalanswer.forgottenroom3d;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g3d.*;
import com.badlogic.gdx.graphics.g3d.attributes.BlendingAttribute;
import com.badlogic.gdx.graphics.g3d.utils.MeshPartBuilder;
import com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;
import com.badlogic.gdx.math.Vector3;
import com.badlogic.gdx.math.collision.BoundingBox;
import com.badlogic.gdx.utils.Array;
import com.badlogic.gdx.utils.Disposable;
import net.mgsx.gltf.loaders.gltf.GLTFLoader;
import net.mgsx.gltf.scene3d.attributes.PBRColorAttribute;
import net.mgsx.gltf.scene3d.attributes.PBRFloatAttribute;
import net.mgsx.gltf.scene3d.attributes.PBRTextureAttribute;
import net.mgsx.gltf.scene3d.scene.Scene;
import net.mgsx.gltf.scene3d.scene.SceneAsset;

/**
 * The Victorian study as real geometry (metres, +Y up, back wall at z=0, room opens toward +z):
 * plank floor, papered walls over dark wainscoting, mouldings, a deep-set window in the left wall with glazing bars,
 * a panelled door in the back wall, and two CC0 Poly Haven models — a vintage cabinet and a writing table.
 * Everything is a separate instance so later milestones can place props on its surfaces.
 */
public final class RoomEnvironment implements Disposable {
    public static final float W=6.4f,D=5.2f,H=3.1f;          // room size
    public static final float WIN_Z0=1.15f,WIN_Z1=2.85f,WIN_Y0=.95f,WIN_Y1=2.55f;  // window opening in the left wall (x=-W/2)
    public static final float DOOR_X0=1.35f,DOOR_X1=2.35f,DOOR_H=2.2f;              // door in the back wall
    private static final String TEX="forgotten_room/3d/textures/";
    private final Array<Texture> textures=new Array<>();private final Array<Model> models=new Array<>();private final Array<SceneAsset> assets=new Array<>();
    public final Array<ModelInstance> instances=new Array<>();public final Array<Scene> scenes=new Array<>();
    /** Bright sky behind the window (unlit), drawn so daylight reads as daylight. */
    public ModelInstance sky;
    public Scene cabinet,desk;
    public final BoundingBox cabinetBounds=new BoundingBox(),deskBounds=new BoundingBox();

    public RoomEnvironment(){
        Material floor=pbr("old_wood_floor",.85f),paper=pbr("decrepit_wallpaper",.9f),panel=pbr("dark_wooden_planks",.8f),trim=pbr("dark_wooden_planks",.62f);
        trim.set(PBRColorAttribute.createBaseColorFactor(new Color(.62f,.48f,.38f,1)));
        Material door=pbr("dark_wooden_planks",.6f);door.set(PBRColorAttribute.createBaseColorFactor(new Color(.80f,.62f,.48f,1)));
        Material brass=new Material(PBRColorAttribute.createBaseColorFactor(new Color(.78f,.58f,.30f,1)),PBRFloatAttribute.createMetallic(1),PBRFloatAttribute.createRoughness(.32f));
        Material ceiling=new Material(PBRColorAttribute.createBaseColorFactor(new Color(.62f,.56f,.48f,1)),PBRFloatAttribute.createRoughness(.95f),PBRFloatAttribute.createMetallic(0));
        Material glass=new Material(PBRColorAttribute.createBaseColorFactor(new Color(.85f,.92f,1f,.10f)),PBRFloatAttribute.createRoughness(.05f),PBRFloatAttribute.createMetallic(0),new BlendingAttribute(true,.10f));

        ModelBuilder mb=new ModelBuilder();float x0=-W/2,x1=W/2,wain=.95f;
        // floor and ceiling
        plane(mb,floor,new Vector3(x0,0,D),new Vector3(x1,0,D),new Vector3(x1,0,0),new Vector3(x0,0,0),W/1.6f,D/1.6f);
        plane(mb,ceiling,new Vector3(x0,H,0),new Vector3(x1,H,0),new Vector3(x1,H,D),new Vector3(x0,H,D),1,1);
        // back wall (with door hole), right wall, left wall (with window hole): paper above the wainscot, planks below
        backWall(mb,paper,panel,wain);
        wallX(mb,x1,true,paper,panel,wain,0,D,0,H,false);
        leftWall(mb,paper,panel,wain);
        // mouldings: skirting, chair rail, crown on the three walls
        moulding(mb,trim,wain);
        // window: deep reveal, sill, frame, glazing bars, glass, bright sky beyond
        window(mb,trim,glass);
        // door: frame, panelled leaf, brass knob
        door(mb,trim,door,brass);
        // furniture (CC0 Poly Haven)
        cabinet=load("vintage_cabinet_01");desk=load("wooden_table_02");
        place(cabinet,cabinetBounds,-.55f,0,0,1.0f);           // against the back wall, between window and door
        place(desk,deskBounds,-1.6f,0,3.05f,90f);              // writing table by the window, turned toward the room
    }

    // ---------- materials ----------
    private Material pbr(String id,float rough){
        Material m=new Material();
        Texture d=tex(TEX+id+"_diff_1k.jpg",true),n=tex(TEX+id+"_nor_gl_1k.jpg",false),orm=tex(TEX+id+"_arm_1k.jpg",false);
        if(d!=null)m.set(PBRTextureAttribute.createBaseColorTexture(d));
        if(n!=null)m.set(PBRTextureAttribute.createNormalTexture(n));
        if(orm!=null){m.set(PBRTextureAttribute.createMetallicRoughnessTexture(orm));m.set(PBRTextureAttribute.createOcclusionTexture(orm));}
        m.set(PBRFloatAttribute.createMetallic(orm!=null?1:0),PBRFloatAttribute.createRoughness(orm!=null?1:rough));
        return m;
    }
    private Texture tex(String path,boolean srgb){
        var f=Gdx.files.internal(path);if(!f.exists()){Gdx.app.error("Room3D","missing "+path);return null;}
        Texture t=new Texture(f,true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);t.setWrap(Texture.TextureWrap.Repeat,Texture.TextureWrap.Repeat);
        t.setAnisotropicFilter(8);textures.add(t);return t;
    }
    private static final long ATTR=VertexAttributes.Usage.Position|VertexAttributes.Usage.Normal|VertexAttributes.Usage.TextureCoordinates|VertexAttributes.Usage.Tangent;

    // ---------- geometry helpers ----------
    /** A textured quad (corners counter-clockwise seen from the front), UVs tiled {@code ru × rv} times. */
    private void plane(ModelBuilder mb,Material m,Vector3 a,Vector3 b,Vector3 c,Vector3 d,float ru,float rv){
        mb.begin();MeshPartBuilder p=mb.part("p",GL20.GL_TRIANGLES,ATTR,m);p.setUVRange(0,0,ru,rv);
        Vector3 n=new Vector3(b).sub(a).crs(new Vector3(d).sub(a)).nor();
        p.rect(a,b,c,d,n);add(mb.end());
    }
    private void box(ModelBuilder mb,Material m,float cx,float cy,float cz,float w,float h,float d){
        mb.begin();MeshPartBuilder p=mb.part("b",GL20.GL_TRIANGLES,ATTR,m);p.setUVRange(0,0,Math.max(.2f,Math.max(w,d)/1.2f),Math.max(.2f,h/1.2f));
        com.badlogic.gdx.graphics.g3d.utils.shapebuilders.BoxShapeBuilder.build(p,cx,cy,cz,w,h,d);add(mb.end());
    }
    private void add(Model model){models.add(model);instances.add(new ModelInstance(model));}

    /** A wall rectangle on the back wall plane z=0 from (xa,ya) to (xb,yb), facing +z. */
    private void back(ModelBuilder mb,Material m,float xa,float xb,float ya,float yb){
        if(xb-xa<.001f||yb-ya<.001f)return;
        mb.begin();MeshPartBuilder p=mb.part("w",GL20.GL_TRIANGLES,ATTR,m);p.setUVRange(xa/1.4f,1-yb/1.4f,xb/1.4f,1-ya/1.4f);
        p.rect(xa,ya,0, xb,ya,0, xb,yb,0, xa,yb,0, 0,0,1);add(mb.end());
    }
    private void backWall(ModelBuilder mb,Material paper,Material panel,float wain){
        float x0=-W/2,x1=W/2;
        for(Material m:new Material[]{panel,paper}){float ya=m==panel?0:wain,yb=m==panel?wain:H;
            back(mb,m,x0,DOOR_X0,ya,yb);back(mb,m,DOOR_X1,x1,ya,yb);
            back(mb,m,DOOR_X0,DOOR_X1,Math.max(ya,DOOR_H),yb);}
    }
    /** Wall on x = const, spanning z∈[za,zb], y∈[ya,yb]; {@code facingNegX} for the right wall. Splits paper/panel at the wainscot. */
    private void wallX(ModelBuilder mb,float x,boolean facingNegX,Material paper,Material panel,float wain,float za,float zb,float ya,float yb,boolean onlyOne){
        for(Material m:new Material[]{panel,paper}){float a=Math.max(ya,m==panel?0:wain),b=Math.min(yb,m==panel?wain:H);if(b-a<.001f||zb-za<.001f)continue;
            mb.begin();MeshPartBuilder p=mb.part("w",GL20.GL_TRIANGLES,ATTR,m);p.setUVRange(za/1.4f,1-b/1.4f,zb/1.4f,1-a/1.4f);
            if(facingNegX)p.rect(x,a,za, x,a,zb, x,b,zb, x,b,za, -1,0,0);else p.rect(x,a,zb, x,a,za, x,b,za, x,b,zb, 1,0,0);
            add(mb.end());}
    }
    private void leftWall(ModelBuilder mb,Material paper,Material panel,float wain){
        float x=-W/2;
        wallX(mb,x,false,paper,panel,wain,0,WIN_Z0,0,H,false);
        wallX(mb,x,false,paper,panel,wain,WIN_Z1,D,0,H,false);
        wallX(mb,x,false,paper,panel,wain,WIN_Z0,WIN_Z1,0,WIN_Y0,false);
        wallX(mb,x,false,paper,panel,wain,WIN_Z0,WIN_Z1,WIN_Y1,H,false);
    }
    private void moulding(ModelBuilder mb,Material trim,float wain){
        float x0=-W/2,x1=W/2;
        // skirting (0.16 high) and chair rail (0.05) and crown (0.12) along back, right, left walls
        for(float[] r:new float[][]{{.08f,.16f,.03f},{wain,.05f,.035f},{H-.06f,.12f,.06f}}){
            float y=r[0],h=r[1],t=r[2];
            box(mb,trim,(x0+DOOR_X0)/2,y,t/2,DOOR_X0-x0,h,t);
            box(mb,trim,(DOOR_X1+x1)/2,y,t/2,x1-DOOR_X1,h,t);
            if(y>DOOR_H)box(mb,trim,(DOOR_X0+DOOR_X1)/2,y,t/2,DOOR_X1-DOOR_X0,h,t);
            box(mb,trim,x1-t/2,y,D/2,t,h,D);
            if(y<WIN_Y0||y>WIN_Y1)box(mb,trim,x0+t/2,y,D/2,t,h,D);
            else{box(mb,trim,x0+t/2,y,WIN_Z0/2,t,h,WIN_Z0);box(mb,trim,x0+t/2,y,(WIN_Z1+D)/2,t,h,D-WIN_Z1);}
        }
    }
    private void window(ModelBuilder mb,Material trim,Material glass){
        float x=-W/2,depth=.32f,zc=(WIN_Z0+WIN_Z1)/2,yc=(WIN_Y0+WIN_Y1)/2,wz=WIN_Z1-WIN_Z0,hy=WIN_Y1-WIN_Y0;
        // reveal (the wall's thickness) and a projecting sill
        box(mb,trim,x-depth/2,WIN_Y0-.02f,zc,depth,.04f,wz);box(mb,trim,x-depth/2,WIN_Y1+.02f,zc,depth,.04f,wz);
        box(mb,trim,x-depth/2,yc,WIN_Z0-.02f,depth,hy,.04f);box(mb,trim,x-depth/2,yc,WIN_Z1+.02f,depth,hy,.04f);
        box(mb,trim,x+.06f,WIN_Y0-.035f,zc,.2f,.05f,wz+.24f);
        // casing around the opening
        float c=.09f;box(mb,trim,x+.012f,WIN_Y1+c/2,zc,.025f,c,wz+2*c);box(mb,trim,x+.012f,yc,WIN_Z0-c/2,.025f,hy,c);box(mb,trim,x+.012f,yc,WIN_Z1+c/2,.025f,hy,c);
        // sashes: outer frame, meeting rail, glazing bars (3 × 4 panes per sash)
        float fx=x-depth*.55f,bar=.035f;
        box(mb,trim,fx,yc,zc,.05f,.06f,wz);                                  // meeting rail
        for(int i=1;i<3;i++)box(mb,trim,fx,yc,WIN_Z0+wz*i/3f,.04f,hy,bar);    // vertical bars
        for(int j=1;j<4;j++){float y=WIN_Y0+hy*j/4f;if(Math.abs(y-yc)>.05f)box(mb,trim,fx,y,zc,.04f,bar,wz);}
        // glass
        mb.begin();MeshPartBuilder p=mb.part("g",GL20.GL_TRIANGLES,VertexAttributes.Usage.Position|VertexAttributes.Usage.Normal,glass);
        p.rect(fx+.01f,WIN_Y0,WIN_Z0, fx+.01f,WIN_Y0,WIN_Z1, fx+.01f,WIN_Y1,WIN_Z1, fx+.01f,WIN_Y1,WIN_Z0, 1,0,0);add(mb.end());
        // daylight sky behind the window
        // soft daylight outside: warm sky above, hazy foliage green lower down (out of focus, so it reads as distance)
        Pixmap px=new Pixmap(4,64,Pixmap.Format.RGBA8888);
        for(int y=0;y<64;y++){float t=y/63f;Color sc=new Color(1f,.97f,.88f,1).lerp(new Color(.78f,.82f,.58f,1),Math.max(0,(t-.45f)/.55f));px.setColor(sc);px.drawLine(0,y,3,y);}
        Texture skyT=new Texture(px);px.dispose();skyT.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);textures.add(skyT);
        Material skyM=new Material(com.badlogic.gdx.graphics.g3d.attributes.TextureAttribute.createDiffuse(skyT),com.badlogic.gdx.graphics.g3d.attributes.IntAttribute.createCullFace(0));
        mb.begin();p=mb.part("s",GL20.GL_TRIANGLES,VertexAttributes.Usage.Position|VertexAttributes.Usage.Normal|VertexAttributes.Usage.TextureCoordinates,skyM);
        float sx=x-1.2f;p.rect(sx,WIN_Y0-1,WIN_Z0-1.5f, sx,WIN_Y0-1,WIN_Z1+1.5f, sx,WIN_Y1+1,WIN_Z1+1.5f, sx,WIN_Y1+1,WIN_Z0-1.5f, 1,0,0);
        Model m=mb.end();models.add(m);sky=new ModelInstance(m);
    }
    private void door(ModelBuilder mb,Material trim,Material leaf,Material brass){
        float cx=(DOOR_X0+DOOR_X1)/2,w=DOOR_X1-DOOR_X0,c=.11f;
        // architrave
        box(mb,trim,cx,DOOR_H+c/2,.03f,w+2*c,c,.06f);box(mb,trim,DOOR_X0-c/2,DOOR_H/2,.03f,c,DOOR_H,.06f);box(mb,trim,DOOR_X1+c/2,DOOR_H/2,.03f,c,DOOR_H,.06f);
        box(mb,trim,cx,DOOR_H+c+.03f,.05f,w+2*c+.08f,.06f,.1f);      // cornice
        // leaf set slightly back, with four raised panels
        box(mb,leaf,cx,DOOR_H/2,-.02f,w,DOOR_H,.05f);
        float pw=w*.36f,ph1=DOOR_H*.34f,ph2=DOOR_H*.30f;
        for(int i=-1;i<=1;i+=2){float px=cx+i*w*.22f;box(mb,trim,px,DOOR_H*.73f,.012f,pw,ph1,.02f);box(mb,trim,px,DOOR_H*.27f,.012f,pw,ph2,.02f);}
        box(mb,trim,cx,DOOR_H*.5f,.012f,w*.86f,.06f,.02f);
        // brass knob and escutcheon
        mb.begin();MeshPartBuilder p=mb.part("k",GL20.GL_TRIANGLES,VertexAttributes.Usage.Position|VertexAttributes.Usage.Normal,brass);
        com.badlogic.gdx.graphics.g3d.utils.shapebuilders.SphereShapeBuilder.build(p,new com.badlogic.gdx.math.Matrix4().setToTranslation(DOOR_X0+.12f,1.0f,.07f),.065f,.065f,.065f,16,12);
        com.badlogic.gdx.graphics.g3d.utils.shapebuilders.BoxShapeBuilder.build(p,DOOR_X0+.12f,1.0f,.025f,.06f,.18f,.012f);add(mb.end());
    }

    // ---------- CC0 models ----------
    private Scene load(String id){
        var f=Gdx.files.internal("forgotten_room/3d/models/"+id+"/"+id+".gltf");if(!f.exists()){Gdx.app.error("Room3D","missing model "+id);return null;}
        SceneAsset a=new GLTFLoader().load(f);assets.add(a);Scene s=new Scene(a.scene);scenes.add(s);return s;
    }
    /** Stand a model on the floor at (x,z): its base at y and its back flush with the wall when z≈0. */
    private void place(Scene s,BoundingBox out,float x,float y,float z,float yawDeg){
        if(s==null)return;
        s.modelInstance.transform.idt().rotate(Vector3.Y,yawDeg);
        BoundingBox b=new BoundingBox();s.modelInstance.calculateBoundingBox(b);b.mul(s.modelInstance.transform);
        float dz=z<.01f?-b.min.z+.02f:z-b.getCenterZ();
        s.modelInstance.transform.idt().translate(x-b.getCenterX(),y-b.min.y,dz).rotate(Vector3.Y,yawDeg);
        s.modelInstance.calculateBoundingBox(out);out.mul(s.modelInstance.transform);
        Gdx.app.log("Room3D","placed "+out.getWidth()+"×"+out.getHeight()+"×"+out.getDepth()+" at "+out.getCenter(new Vector3()));
    }

    @Override public void dispose(){for(Model m:models)m.dispose();for(Texture t:textures)t.dispose();for(SceneAsset a:assets)a.dispose();}
}
