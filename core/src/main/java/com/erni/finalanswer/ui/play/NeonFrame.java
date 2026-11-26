package com.erni.finalanswer.ui.play;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.g2d.NinePatch;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.utils.Disposable;

/**
 * Ornate cut-corner frame used by THINK OR DIE (player cards, category plate, rule cards, badges): a steel bevel with a
 * light top and dark bottom edge, an inner neon line with a soft outer glow, corner diamonds and short light accents.
 * All procedural (no image assets); one instance per screen, textures generated once.
 */
public final class NeonFrame implements Disposable {
    private static final int N=96;private static final float CUT=24;
    private final Texture fillTex,edgeTex,softTex,gradTex,pixelTex;private final com.badlogic.gdx.graphics.g2d.TextureRegion px;
    private final NinePatch fill,edge,soft;
    private final Color tmp=new Color();

    public NeonFrame(){
        fillTex=octagon(0);edgeTex=octagon(1);softTex=octagon(2);
        fill=new NinePatch(fillTex,30,30,30,30);edge=new NinePatch(edgeTex,30,30,30,30);soft=new NinePatch(softTex,30,30,30,30);
        Pixmap g=new Pixmap(1,64,Pixmap.Format.RGBA8888);for(int y=0;y<64;y++){float f=y/63f;g.drawPixel(0,y,Color.rgba8888(1,1,1,(1-f)*(1-f)));}
        gradTex=new Texture(g);gradTex.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);g.dispose();
        Pixmap p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();pixelTex=new Texture(p);p.dispose();px=new com.badlogic.gdx.graphics.g2d.TextureRegion(pixelTex);
    }
    /** mode 0 filled, 1 thin edge, 2 blurred edge (glow) */
    private static Texture octagon(int mode){Pixmap p=new Pixmap(N,N,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);float r=(float)Math.sqrt(.5);
        for(int y=0;y<N;y++)for(int x=0;x<N;x++){float fx=x+.5f,fy=y+.5f;
            float d=Math.min(Math.min(Math.min(fx,fy),Math.min(N-fx,N-fy)),Math.min(Math.min((fx+fy-CUT)*r,(N-fx+fy-CUT)*r),Math.min((fx+N-fy-CUT)*r,(N-fx+N-fy-CUT)*r)));
            float a=mode==0?MathUtils.clamp(d+.5f,0,1):mode==1?MathUtils.clamp(1-Math.abs(d-2.2f)/1.4f,0,1):MathUtils.clamp(1-Math.abs(d-8f)/8f,0,1)*MathUtils.clamp(d+.5f,0,1);
            p.drawPixel(x,y,Color.rgba8888(1,1,1,a));}
        Texture t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;}

    private void nine(Batch b,NinePatch n,float x,float y,float w,float h,float k){if(w<=1||h<=1)return;if(k<1){n.scale(k,k);n.draw(b,x,y,w,h);n.scale(1/k,1/k);}else n.draw(b,x,y,w,h);}

    /**
     * @param bevel steel border width in world units (6 for big plates, 4 for small ones)
     * @param inner fill colour inside the frame (alpha respected)
     */
    public void draw(Batch b,float x,float y,float w,float h,Color rim,Color inner,float bevel,float a){
        if(a<=0||w<8||h<8)return;
        Color keep=tmp.set(b.getColor());float k=Math.min(1,Math.min(w,h)/70f);
        // drop shadow and outer neon glow
        b.setColor(0,0,0,.50f*a);nine(b,fill,x+3,y-8,w,h,k);
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        b.setColor(rim.r,rim.g,rim.b,.55f*a);nine(b,soft,x-8,y-8,w+16,h+16,k);
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        // steel bevel: dark body, light top half, bright outer line
        b.setColor(.13f,.12f,.13f,a);nine(b,fill,x,y,w,h,k);
        b.setColor(.42f,.40f,.42f,.55f*a);nine(b,fill,x,y+h*.50f,w,h*.50f,k);
        b.setColor(.80f,.78f,.80f,.85f*a);nine(b,edge,x,y,w,h,k);
        // inner panel with a soft top light
        float i=bevel;b.setColor(inner.r,inner.g,inner.b,inner.a*a);nine(b,fill,x+i,y+i,w-2*i,h-2*i,k);
        b.setColor(rim.r,rim.g,rim.b,.10f*a);b.draw(gradTex,x+i+CUT*k*.6f,y+h*.45f,w-2*i-CUT*k*1.2f,h*.55f-i);
        // neon line just inside the bevel, plus an additive pass for the glow
        b.setColor(rim.r,rim.g,rim.b,a);nine(b,edge,x+i-1.5f,y+i-1.5f,w-2*i+3,h-2*i+3,k);
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        b.setColor(rim.r,rim.g,rim.b,.35f*a);nine(b,soft,x+i-6,y+i-6,w-2*i+12,h-2*i+12,k);
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        // corner diamonds on the bevels and short light accents along the edges
        float c=CUT*k,d=Math.max(3.5f,5*k);
        float[][] corners={{x+c*.48f,y+c*.48f},{x+w-c*.48f,y+c*.48f},{x+c*.48f,y+h-c*.48f},{x+w-c*.48f,y+h-c*.48f}};
        for(float[] p:corners)diamond(b,p[0],p[1],d,rim,a);
        float acc=Math.min(46,w*.12f);
        b.setColor(1,1,1,.55f*a);
        b.draw(pixelTex,x+c+6,y+h-1.5f,acc,1.5f);b.draw(pixelTex,x+w-c-6-acc,y+h-1.5f,acc,1.5f);
        b.setColor(rim.r,rim.g,rim.b,.9f*a);
        b.draw(pixelTex,x+c+6,y,acc,2);b.draw(pixelTex,x+w-c-6-acc,y,acc,2);
        b.setColor(keep);
    }
    private void diamond(Batch b,float cx,float cy,float s,Color rim,float a){
        b.setColor(.85f,.83f,.85f,a);b.draw(px,cx-s,cy-s,s,s,s*2,s*2,1,1,45);
        b.setColor(rim.r,rim.g,rim.b,a);b.draw(px,cx-s*.55f,cy-s*.55f,s*.55f,s*.55f,s*1.1f,s*1.1f,1,1,45);
    }
    /** A glowing ring (behind a character portrait). */
    public void halo(Batch b,float cx,float cy,float r,Color rim,float a){
        Color keep=tmp.set(b.getColor());
        b.setColor(.02f,.0f,.01f,.85f*a);b.draw(softTexOrNull(),cx-r*1.05f,cy-r*1.05f,r*2.1f,r*2.1f);
        b.setColor(rim.r*.25f,rim.g*.12f,rim.b*.15f,.75f*a);b.draw(softTexOrNull(),cx-r,cy-r,r*2,r*2);
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        int n=48;for(int i=0;i<n;i++){float u=360f*i/n;float qx=cx+MathUtils.cosDeg(u)*r,qy=cy+MathUtils.sinDeg(u)*r;
            b.setColor(rim.r,rim.g,rim.b,.85f*a);b.draw(px,qx-1.6f,qy-1.6f,1.6f,1.6f,3.2f,2*MathUtils.PI*r/n+1,1,1,u);}
        b.setColor(rim.r,rim.g,rim.b,.16f*a);b.draw(softTexOrNull(),cx-r*1.3f,cy-r*1.3f,r*2.6f,r*2.6f);
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        b.setColor(keep);
    }
    private Texture radial;
    private Texture softTexOrNull(){
        if(radial==null){int n=64;Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);for(int y=0;y<n;y++)for(int x=0;x<n;x++){float dx=(x+.5f)/n-.5f,dy=(y+.5f)/n-.5f,d=(float)Math.sqrt(dx*dx+dy*dy)*2;p.drawPixel(x,y,Color.rgba8888(1,1,1,MathUtils.clamp(1-d,0,1)*MathUtils.clamp(1-d,0,1)));}
            radial=new Texture(p);radial.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();}
        return radial;
    }
    private Texture roundTex;private NinePatch round;
    /** Clean rounded panel (game-show style): soft drop shadow, a thin solid outline in the accent colour, flat fill. */
    public void clean(Batch b,float x,float y,float w,float h,Color fill,Color rim,float a){
        if(a<=0||w<8||h<8)return;
        if(round==null){int n=64;float R=22;Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);
            for(int yy=0;yy<n;yy++)for(int xx=0;xx<n;xx++){float fx=xx+.5f,fy=yy+.5f,dx=Math.max(Math.max(R-fx,fx-(n-R)),0),dy=Math.max(Math.max(R-fy,fy-(n-R)),0);
                float d=R-(float)Math.sqrt(dx*dx+dy*dy);if(dx==0&&dy==0)d=R;p.drawPixel(xx,yy,Color.rgba8888(1,1,1,MathUtils.clamp(d+.5f,0,1)));}
            roundTex=new Texture(p);roundTex.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();round=new NinePatch(roundTex,24,24,24,24);}
        Color keep=tmp.set(b.getColor());float k=Math.min(1,Math.min(w,h)/56f);
        b.setColor(0,0,0,.40f*a);nine(b,round,x+2,y-6,w,h,k);
        b.setColor(rim.r,rim.g,rim.b,a);nine(b,round,x,y,w,h,k);
        b.setColor(fill.r,fill.g,fill.b,fill.a*a);nine(b,round,x+3,y+3,w-6,h-6,k);
        b.setColor(1,1,1,.05f*a);nine(b,round,x+3,y+h*.5f,w-6,h*.5f-3,k);
        b.setColor(keep);
    }
    private static final Color BRONZE=new Color(.62f,.40f,.20f,1),BRONZE_HI=new Color(.95f,.74f,.44f,1),BRONZE_LO=new Color(.26f,.14f,.07f,1);
    private void seg(Batch b,float x1,float y1,float x2,float y2,float wd){float dx=x2-x1,dy=y2-y1,len=(float)Math.sqrt(dx*dx+dy*dy);
        b.draw(px,x1,y1-wd/2,0,wd/2,len,wd,1,1,MathUtils.atan2(dy,dx)*MathUtils.radiansToDegrees);}
    /** Ornate bronze ring (lit from above) with a thin accent ring inside; draw over the portrait. */
    public void medallionRing(Batch b,float cx,float cy,float r,Color accent,float a){
        Color keep=tmp.set(b.getColor());int n=72;
        for(int i=0;i<n;i++){float u=360f*i/n,v=360f*(i+1)/n,lit=.5f+.5f*MathUtils.sinDeg((u+v)/2);
            float rr=BRONZE_LO.r+(BRONZE_HI.r-BRONZE_LO.r)*lit,gg=BRONZE_LO.g+(BRONZE_HI.g-BRONZE_LO.g)*lit,bb=BRONZE_LO.b+(BRONZE_HI.b-BRONZE_LO.b)*lit;
            b.setColor(.05f,.03f,.02f,a);seg(b,cx+MathUtils.cosDeg(u)*(r+5),cy+MathUtils.sinDeg(u)*(r+5),cx+MathUtils.cosDeg(v)*(r+5),cy+MathUtils.sinDeg(v)*(r+5),3);
            b.setColor(rr,gg,bb,a);seg(b,cx+MathUtils.cosDeg(u)*(r+1),cy+MathUtils.sinDeg(u)*(r+1),cx+MathUtils.cosDeg(v)*(r+1),cy+MathUtils.sinDeg(v)*(r+1),7);
            b.setColor(accent.r,accent.g,accent.b,.85f*a);seg(b,cx+MathUtils.cosDeg(u)*(r-4),cy+MathUtils.sinDeg(u)*(r-4),cx+MathUtils.cosDeg(v)*(r-4),cy+MathUtils.sinDeg(v)*(r-4),1.6f);}
        // small studs at the four diagonals
        for(int k=0;k<4;k++){float u=45+90*k;float sx=cx+MathUtils.cosDeg(u)*(r+1),sy=cy+MathUtils.sinDeg(u)*(r+1);
            b.setColor(BRONZE_LO.r,BRONZE_LO.g,BRONZE_LO.b,a);b.draw(softTexOrNull(),sx-6,sy-6,12,12);b.setColor(BRONZE_HI.r,BRONZE_HI.g,BRONZE_HI.b,a);b.draw(softTexOrNull(),sx-3.5f,sy-3.5f,7,7);}
        b.setColor(keep);
    }
    /** Dark disc with a soft accent tint behind a portrait. */
    public void medallionBack(Batch b,float cx,float cy,float r,Color accent,float a){
        Color keep=tmp.set(b.getColor());
        b.setColor(.03f,.015f,.015f,a);b.draw(softTexOrNull(),cx-r*1.45f,cy-r*1.45f,r*2.9f,r*2.9f);
        b.setColor(accent.r*.35f,accent.g*.20f,accent.b*.25f,.9f*a);b.draw(softTexOrNull(),cx-r*1.2f,cy-r*1.2f,r*2.4f,r*2.4f);
        b.setColor(keep);
    }
    /** A hanging chain of alternating links between two points. */
    public void chain(Batch b,float x1,float y1,float x2,float y2,float a){
        Color keep=tmp.set(b.getColor());float dx=x2-x1,dy=y2-y1,len=(float)Math.sqrt(dx*dx+dy*dy),ang=MathUtils.atan2(dy,dx)*MathUtils.radiansToDegrees;int n=Math.max(2,(int)(len/9));
        for(int i=0;i<n;i++){float f=(i+.5f)/n,cx=x1+dx*f,cy=y1+dy*f;boolean side=i%2==0;float w=side?11:9,h=side?6:2.5f;
            b.setColor(.10f,.06f,.03f,a);b.draw(px,cx-w/2-1,cy-h/2-1,w/2+1,h/2+1,w+2,h+2,1,1,ang);
            b.setColor(side?BRONZE.r:BRONZE_HI.r,side?BRONZE.g:BRONZE_HI.g,side?BRONZE.b:BRONZE_HI.b,a);b.draw(px,cx-w/2,cy-h/2,w/2,h/2,w,h,1,1,ang);}
        b.setColor(keep);
    }
    /** Bronze-edged dark plate with an inner accent line (name plaques, category, rules bar). */
    public void bronze(Batch b,float x,float y,float w,float h,Color fill,Color accent,float a){
        if(a<=0||w<8||h<8)return;clean(b,x,y,w,h,new Color(0,0,0,0),BRONZE,a);
        Color keep=tmp.set(b.getColor());float k=Math.min(1,Math.min(w,h)/56f);
        b.setColor(BRONZE_HI.r,BRONZE_HI.g,BRONZE_HI.b,.9f*a);nine(b,round,x,y+h*.5f,w,h*.5f,k);
        b.setColor(BRONZE.r,BRONZE.g,BRONZE.b,a);nine(b,round,x+1.5f,y+1.5f,w-3,h-3,k);
        b.setColor(accent.r,accent.g,accent.b,a);nine(b,round,x+4,y+4,w-8,h-8,k);
        b.setColor(fill.r,fill.g,fill.b,fill.a*a);nine(b,round,x+5.5f,y+5.5f,w-11,h-11,k);
        b.setColor(1,1,1,.05f*a);nine(b,round,x+5.5f,y+h*.55f,w-11,h*.45f-5.5f,k);
        b.setColor(keep);
    }
    /** Laurel branch (badge decoration): leaves along an arc, mirrored by side (-1 left, 1 right). */
    public void laurel(Batch b,float cx,float cy,float r,int side,Color c,float a){
        Color keep=tmp.set(b.getColor());
        for(int i=0;i<7;i++){float u=-60+i*20;float ang=side<0?180-u:u;float lx=cx+MathUtils.cosDeg(ang)*r,ly=cy+MathUtils.sinDeg(ang)*r;
            float rot=ang+(side<0?-90-35:90+35)+180*0;b.setColor(c.r*.5f,c.g*.5f,c.b*.5f,a);b.draw(px,lx-5,ly-2.5f,5,2.5f,11,5,1,1,rot);
            b.setColor(c.r,c.g,c.b,a);b.draw(px,lx-4,ly-1.6f,4,1.6f,9,3.2f,1,1,rot);}
        b.setColor(keep);
    }
    @Override public void dispose(){if(roundTex!=null)roundTex.dispose();fillTex.dispose();edgeTex.dispose();softTex.dispose();gradTex.dispose();pixelTex.dispose();if(radial!=null)radial.dispose();}
}
