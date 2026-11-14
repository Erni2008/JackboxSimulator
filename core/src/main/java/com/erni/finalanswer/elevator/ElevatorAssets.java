package com.erni.finalanswer.elevator;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.files.FileHandle;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.utils.Disposable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Loads every elevator image once, up front (never during motion). Each slot comes from the path in
 * {@link ElevatorGeometry#images}; when that file does not exist yet, a <b>TEMPORARY</b> programmatic placeholder is
 * generated instead and the slot is flagged in {@link #temporary} so the renderer can label it on screen.
 * The placeholders exist only to exercise logic, masking and layering — they are not, and must never be shipped as,
 * final art. Replacing them is a matter of dropping the final PNGs at the configured paths.
 */
public final class ElevatorAssets implements Disposable {
    public final Texture base,doorLeft,doorRight,frameOverlay,indicatorHousing,needle,glow,pixel;
    public final TextureRegion[][] buttons;            // [floorIndex][state]
    public final Texture[] floors;
    public final java.util.Set<String> temporary=new java.util.TreeSet<>();
    private final List<Texture> owned=new ArrayList<>();

    public ElevatorAssets(ElevatorGeometry g){
        pixel=own(solid(1,1,Color.WHITE));glow=own(glowTexture(128));
        base=load(g,"base",()->tempBase(g));
        doorLeft=load(g,"doorLeft",()->tempDoor(g.leftDoor,true));
        doorRight=load(g,"doorRight",()->tempDoor(g.rightDoor,false));
        frameOverlay=load(g,"frameOverlay",()->tempFrame(g));
        indicatorHousing=load(g,"indicatorHousing",()->tempHousing(g));
        needle=load(g,"indicatorNeedle",()->tempNeedle(g));
        Texture sheet=load(g,"buttons",()->tempButtons(g));
        int cols=g.buttonSheetCols,rows=g.buttons.size(),cw=sheet.getWidth()/cols,ch=sheet.getHeight()/rows;
        buttons=new TextureRegion[rows][cols];
        for(int r=0;r<rows;r++)for(int c=0;c<cols;c++)buttons[r][c]=new TextureRegion(sheet,c*cw,r*ch,cw,ch);
        floors=new Texture[g.floors.size()];
        for(int i=0;i<floors.length;i++){var f=g.floors.get(i);final int idx=i;
            floors[i]=loadPath("floor"+f.number(),f.image(),()->tempFloor(g,g.floors.get(idx)));}
    }

    private interface Maker{Pixmap make();}
    private Texture load(ElevatorGeometry g,String key,Maker temp){return loadPath(key,g.images.getOrDefault(key,""),temp);}
    private Texture loadPath(String key,String path,Maker temp){
        FileHandle f=path.isEmpty()?null:Gdx.files.internal(path);
        if(f!=null&&f.exists()){Texture t=own(new Texture(f,true));t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);return t;}
        temporary.add(key);Pixmap p=temp.make();Texture t=own(new Texture(p));p.dispose();t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);return t;
    }
    private Texture own(Texture t){owned.add(t);return t;}
    public boolean isTemporary(String key){return temporary.contains(key);}

    // ================= TEMPORARY placeholder generators (logic testing only) =================
    private static Texture solid(int w,int h,Color c){Pixmap p=new Pixmap(w,h,Pixmap.Format.RGBA8888);p.setColor(c);p.fill();Texture t=new Texture(p);p.dispose();return t;}
    private static Texture glowTexture(int n){Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float dx=(x+.5f)/n*2-1,dy=(y+.5f)/n*2-1,d=(float)Math.sqrt(dx*dx+dy*dy),a=Math.max(0,1-d);a=a*a*(3-2*a);p.drawPixel(x,y,Color.rgba8888(1,1,1,a));}
        Texture t=new Texture(p);p.dispose();t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);return t;}
    /** Pixmap y runs downward; convert a world y (bottom-left origin) of a rect top edge. */
    private static int py(ElevatorGeometry g,float worldY,float h){return (int)(g.worldH-worldY-h);}
    private static void vGradient(Pixmap p,int x,int y,int w,int h,Color top,Color bottom){
        for(int i=0;i<h;i++){float k=h<=1?0:i/(float)(h-1);p.setColor(top.r+(bottom.r-top.r)*k,top.g+(bottom.g-top.g)*k,top.b+(bottom.b-top.b)*k,1);p.drawLine(x,y+i,x+w-1,y+i);}}
    private static Pixmap tempBase(ElevatorGeometry g){
        int W=(int)g.worldW,H=(int)g.worldH;Pixmap p=new Pixmap(W,H,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);
        vGradient(p,0,0,W,H,new Color(.16f,.10f,.07f,1),new Color(.06f,.04f,.03f,1));                       // dark metal walls
        int floorY=py(g,g.doorway.y(),0);vGradient(p,0,floorY,W,H-floorY,new Color(.12f,.08f,.05f,1),new Color(.03f,.02f,.015f,1));  // floor
        for(int side=0;side<2;side++){int x0=side==0?60:W-560;                                              // red padded panels + bronze rails
            p.setColor(.35f,.04f,.04f,1);p.fillRectangle(x0,H-560,500,300);p.setColor(.55f,.10f,.08f,1);
            for(int yy=H-540;yy<H-280;yy+=52)for(int xx=x0+30;xx<x0+480;xx+=60)p.fillCircle(xx,yy,4);
            p.setColor(.75f,.55f,.25f,1);p.fillRectangle(x0,H-575,500,10);p.fillRectangle(x0,H-255,500,8);}
        var d=g.doorway;int dx=(int)d.x(),dy=py(g,d.y(),d.h()),dw=(int)d.w(),dh=(int)d.h();
        p.setColor(.62f,.45f,.20f,1);p.fillRectangle(dx-36,dy-36,dw+72,dh+36);                              // bronze portal
        p.setColor(.30f,.20f,.09f,1);p.fillRectangle(dx-14,dy-14,dw+28,dh+14);
        p.setColor(0,0,0,0);p.fillRectangle(dx,dy,dw,dh);                                                   // transparent doorway
        p.setColor(.20f,.14f,.08f,1);p.fillRectangle(1440,H-800,160,460);                                   // control panel slab
        p.setColor(.62f,.45f,.20f,1);p.drawRectangle(1440,H-800,160,460);
        p.setColor(.85f,.65f,.30f,1);p.fillCircle(470,H-760,22);p.fillCircle(1450,H-760,22);p.fillCircle(960,H-1010,40); // lamp bodies
        return p;
    }
    private static Pixmap tempDoor(ElevatorGeometry.Door door,boolean left){
        int w=(int)door.w(),h=(int)door.h();Pixmap p=new Pixmap(w,h,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);
        vGradient(p,0,0,w,h,new Color(.30f,.21f,.11f,1),new Color(.17f,.11f,.06f,1));
        p.setColor(.70f,.52f,.24f,1);p.drawRectangle(18,18,w-36,h-36);p.drawRectangle(19,19,w-38,h-38);
        p.drawRectangle(40,60,w-80,h/2-90);p.drawRectangle(40,h/2+30,w-80,h/2-90);
        p.setColor(.85f,.66f,.32f,1);p.fillCircle(left?w-30:30,h/2,9);                                      // handle near the seam
        p.setColor(.08f,.05f,.03f,1);p.fillRectangle(left?w-3:0,0,3,h);                                     // seam shadow
        return p;
    }
    private static Pixmap tempFrame(ElevatorGeometry g){
        int W=(int)g.worldW,H=(int)g.worldH;Pixmap p=new Pixmap(W,H,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);p.setColor(0,0,0,0);p.fill();
        var d=g.doorway;int dx=(int)d.x(),dy=py(g,d.y(),d.h()),dw=(int)d.w(),dh=(int)d.h();
        p.setColor(.80f,.60f,.28f,1);p.fillRectangle(dx-6,dy-6,dw+12,6);p.fillRectangle(dx-6,dy,6,dh);p.fillRectangle(dx+dw,dy,6,dh);   // thin lip over the door edges
        return p;
    }
    private static Pixmap tempHousing(ElevatorGeometry g){
        var r=g.indicator;int w=(int)r.w(),h=(int)r.h();Pixmap p=new Pixmap(w,h,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);p.setColor(0,0,0,0);p.fill();
        int cx=(int)(g.needleX-r.x()),cy=(int)(h-(g.needleY-r.y()));
        p.setColor(.62f,.45f,.20f,1);p.fillCircle(cx,cy,w/2-4);p.setColor(.12f,.08f,.05f,1);p.fillCircle(cx,cy,w/2-16);
        p.setColor(0,0,0,0);p.fillRectangle(0,cy+2,w,h-cy);
        p.setColor(.95f,.80f,.50f,1);
        for(int f=1;f<=5;f++){double a=Math.toRadians(g.needleAngle(f));int tx=cx+(int)(Math.cos(a)*(w/2-30)),ty=cy-(int)(Math.sin(a)*(w/2-30));p.fillCircle(tx,ty,6);}
        return p;
    }
    private static Pixmap tempNeedle(ElevatorGeometry g){
        int w=(int)g.needleWidth,h=(int)g.needleLength;Pixmap p=new Pixmap(w,h,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);p.setColor(0,0,0,0);p.fill();
        p.setColor(.90f,.20f,.12f,1);p.fillTriangle(0,h-1,w-1,h-1,w/2,0);p.setColor(.85f,.66f,.32f,1);p.fillCircle(w/2,h-(int)g.needlePivotFromBottom,w/2);
        return p;
    }
    private static Pixmap tempButtons(ElevatorGeometry g){
        int cols=g.buttonSheetCols,rows=g.buttons.size(),cell=(int)(g.buttons.getFirst().radius()*2+8);
        Pixmap p=new Pixmap(cell*cols,cell*rows,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);p.setColor(0,0,0,0);p.fill();
        Color[] rim={new Color(.62f,.45f,.20f,1),new Color(.45f,.32f,.14f,1),new Color(1f,.25f,.15f,1)};
        Color[] face={new Color(.16f,.10f,.06f,1),new Color(.09f,.06f,.03f,1),new Color(.65f,.06f,.04f,1)};
        for(int r=0;r<rows;r++)for(int c=0;c<cols;c++){int cx=c*cell+cell/2,cy=r*cell+cell/2,rad=cell/2-4-(c==1?2:0);
            p.setColor(rim[c]);p.fillCircle(cx,cy,rad);p.setColor(face[c]);p.fillCircle(cx,cy,rad-5);}
        return p;
    }
    private static Pixmap tempFloor(ElevatorGeometry g,ElevatorGeometry.Floor f){
        var d=g.doorway;int w=(int)d.w(),h=(int)d.h();Pixmap p=new Pixmap(w,h,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);
        vGradient(p,0,0,w,h,new Color(f.r()*.5f,f.g()*.5f,f.b()*.5f,1),new Color(f.r(),f.g(),f.b(),1));
        p.setColor(f.r()*1.6f,f.g()*1.6f,f.b()*1.6f,1);                                                      // a corridor in perspective, so motion behind the doors reads
        p.drawLine(0,h-1,w/2-60,h/2);p.drawLine(w-1,h-1,w/2+60,h/2);p.drawLine(0,0,w/2-60,h/2-120);p.drawLine(w-1,0,w/2+60,h/2-120);
        p.drawRectangle(w/2-60,h/2-120,120,120);
        return p;
    }

    @Override public void dispose(){for(Texture t:owned)t.dispose();owned.clear();}
    static Map<String,String> realSounds(ElevatorGeometry g){Map<String,String> m=new HashMap<>();for(var e:g.sounds.entrySet())if(!e.getKey().startsWith("_"))m.put(e.getKey(),e.getValue());return m;}
}
