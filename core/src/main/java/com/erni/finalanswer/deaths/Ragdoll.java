package com.erni.finalanswer.deaths;

import com.badlogic.gdx.graphics.g2d.RecordingBatch;
import com.badlogic.gdx.math.MathUtils;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * The character's own body parts (as its rig drew them on the impact frame) turned into a 2D ragdoll: every part is a
 * rigid body made of three Verlet particles, parts are pinned to each other at the point where they overlap, and a
 * weak posture spring keeps a living body upright until the recipe lets it go limp. Small decorations (buttons, pins,
 * eyes) are welded to the part they sit on. Position-based dynamics, sub-stepped — stable at any frame rate.
 */
final class Ragdoll {
    static final class Piece{
        final List<RecordingBatch.Quad> quads=new ArrayList<>();
        float minX=1e9f,minY=1e9f,maxX=-1e9f,maxY=-1e9f,area,cx,cy;
        int p0=-1;Piece weldTo;boolean removed,head,root;
        // welded pieces keep their rest offset in the parent's frame
        float angle,tx,ty; // current rigid transform: world = R(angle)*rest + (tx,ty)
    }
    static final class Joint{Piece a,b;float ax,ay;float[] wa=new float[3],wb=new float[3];boolean broken;}

    final List<Piece> pieces=new ArrayList<>();
    final List<Joint> joints=new ArrayList<>();
    private float[] x,y,px,py,rx,ry,inv;private int n;
    private final float floor,left,right,top;
    float gravity=1700,posture=.18f,friction=.55f,rootOffX,rootOffY,rootSpin;boolean simulate,pinRoot=true,floorOn=true;
    Piece root,head;

    Ragdoll(List<RecordingBatch.Quad> quads,float floor,float left,float right,float top,float neckY,float midX){
        this.floor=floor;this.left=left;this.right=right;this.top=top;
        Piece cur=null;int g=-1;
        for(var q:quads){if(q.group!=g){g=q.group;cur=new Piece();pieces.add(cur);}cur.quads.add(q);
            for(int k=0;k<4;k++){float vx=q.v[k*5],vy=q.v[k*5+1];cur.minX=Math.min(cur.minX,vx);cur.maxX=Math.max(cur.maxX,vx);cur.minY=Math.min(cur.minY,vy);cur.maxY=Math.max(cur.maxY,vy);}}
        pieces.removeIf(p->p.maxX-p.minX<2||p.maxY-p.minY<2);
        float total=0;for(Piece p:pieces){p.area=(p.maxX-p.minX)*(p.maxY-p.minY);p.cx=(p.minX+p.maxX)/2;p.cy=(p.minY+p.maxY)/2;total+=p.area;}
        // the torso: the biggest part covering the middle of the body below the neck
        float tx=midX,ty=floor+(neckY-floor)*.55f;
        for(Piece p:pieces)if(p.minX<=tx&&p.maxX>=tx&&p.minY<=ty&&p.maxY>=ty&&(root==null||p.area>root.area))root=p;
        if(root==null)for(Piece p:pieces)if(root==null||p.area>root.area)root=p;
        if(root==null)return;
        root.root=true;
        // decorations sit on (and are mostly inside) a bigger part: weld them
        for(Piece p:pieces){if(p==root)continue;Piece best=null;float bestOverlap=0;
            for(Piece o:pieces){if(o==p||o.area<=p.area)continue;float ov=overlap(p,o);if(ov>bestOverlap){bestOverlap=ov;best=o;}}
            if(best!=null&&(p.area<total*.012f||bestOverlap>p.area*.8f))p.weldTo=best;}
        for(Piece p:pieces){Piece w=p.weldTo;int guard=0;while(w!=null&&w.weldTo!=null&&guard++<10)w=w.weldTo;p.weldTo=w;}
        // the head: the highest free part reaching above the neck
        for(Piece p:pieces)if(p.weldTo==null&&p!=root&&p.maxY>neckY&&p.area>total*.03f&&(head==null||p.cy>head.cy))head=p;
        if(head==null&&root.cy>neckY)head=null;
        if(head!=null)head.head=true;
        // particles: three per free part (bounding-box triangle)
        int free=0;for(Piece p:pieces)if(p.weldTo==null)free++;
        x=new float[free*3];y=new float[free*3];px=new float[free*3];py=new float[free*3];rx=new float[free*3];ry=new float[free*3];inv=new float[free*3];
        for(Piece p:pieces){if(p.weldTo!=null)continue;p.p0=n;
            float ix=(p.maxX-p.minX)*.12f,iy=(p.maxY-p.minY)*.12f;
            add(p.minX+ix,p.minY+iy,p.area);add(p.maxX-ix,p.minY+iy,p.area);add(p.cx,p.maxY-iy,p.area);}
        // joints: every free part hangs from the bigger part it overlaps most (or the nearest one)
        List<Piece> order=new ArrayList<>();for(Piece p:pieces)if(p.weldTo==null)order.add(p);
        order.sort((a,b)->Float.compare(b.area,a.area));
        for(int i=1;i<order.size();i++){Piece c=order.get(i);if(c==root)continue;Piece best=null;float score=-1e9f;
            for(int j=0;j<order.size();j++){Piece o=order.get(j);if(o==c||o.area<c.area&&o!=root)continue;
                float ov=overlap(c,o),s=ov>0?ov:-dist(c,o)*100;if(o==root)s+=1;if(s>score){score=s;best=o;}}
            if(best==null)continue;
            float ax,ay;
            if(overlap(c,best)>0){ax=(Math.max(c.minX,best.minX)+Math.min(c.maxX,best.maxX))/2;ay=(Math.max(c.minY,best.minY)+Math.min(c.maxY,best.maxY))/2;}
            else{ax=MathUtils.clamp(c.cx,best.minX,best.maxX);ay=MathUtils.clamp(c.cy,best.minY,best.maxY);ax=(ax+MathUtils.clamp(ax,c.minX,c.maxX))/2;ay=(ay+MathUtils.clamp(ay,c.minY,c.maxY))/2;}
            // a limb hangs from its end nearest the parent: pull the anchor toward the child's edge facing it
            Joint jn=new Joint();jn.a=best;jn.b=c;jn.ax=ax;jn.ay=ay;bary(best,ax,ay,jn.wa);bary(c,ax,ay,jn.wb);joints.add(jn);}
        for(Piece p:pieces)if(p.weldTo==null)pose(p);refreshWelds();
    }
    private void add(float ax,float ay,float area){x[n]=px[n]=rx[n]=ax;y[n]=py[n]=ry[n]=ay;inv[n]=1/Math.max(50,area/3);n++;}
    private static float overlap(Piece a,Piece b){float w=Math.min(a.maxX,b.maxX)-Math.max(a.minX,b.minX),h=Math.min(a.maxY,b.maxY)-Math.max(a.minY,b.minY);return w>0&&h>0?w*h:0;}
    private static float dist(Piece a,Piece b){float dx=Math.max(0,Math.max(a.minX-b.maxX,b.minX-a.maxX)),dy=Math.max(0,Math.max(a.minY-b.maxY,b.minY-a.maxY));return (float)Math.sqrt(dx*dx+dy*dy);}
    /** Barycentric weights of a rest-space point in a piece's particle triangle (may lie outside it). */
    private void bary(Piece p,float qx,float qy,float[] w){
        int i=p.p0;float ax=rx[i],ay=ry[i],bx=rx[i+1],by=ry[i+1],cx=rx[i+2],cy=ry[i+2];
        float d=(by-cy)*(ax-cx)+(cx-bx)*(ay-cy);if(Math.abs(d)<1e-3f){w[0]=1;w[1]=w[2]=0;return;}
        w[0]=((by-cy)*(qx-cx)+(cx-bx)*(qy-cy))/d;w[1]=((cy-ay)*(qx-cx)+(ax-cx)*(qy-cy))/d;w[2]=1-w[0]-w[1];
    }

    // ---------------- control ----------------
    Piece nearest(float qx,float qy){Piece best=null;float bd=1e9f;for(Piece p:pieces){if(p.weldTo!=null||p.removed)continue;
        float dx=MathUtils.clamp(qx,p.minX,p.maxX)-qx,dy=MathUtils.clamp(qy,p.minY,p.maxY)-qy,d=dx*dx+dy*dy-p.area*1e-4f;if(d<bd){bd=d;best=p;}}return best;}
    /** Instant velocity change (pixels/second) for a piece, plus spin (degrees/second) about its centre. */
    void push(Piece p,float vx,float vy,float spin,float dt){
        if(p==null||p.p0<0)return;float cx=0,cy=0;for(int k=0;k<3;k++){cx+=x[p.p0+k];cy+=y[p.p0+k];}cx/=3;cy/=3;
        float w=spin*MathUtils.degRad;
        for(int k=0;k<3;k++){int i=p.p0+k;float ox=x[i]-cx,oy=y[i]-cy;float ux=vx-w*oy,uy=vy+w*ox;px[i]-=ux*dt;py[i]-=uy*dt;}
    }
    void pushAll(float vx,float vy,float dt){for(int i=0;i<n;i++){px[i]-=vx*dt;py[i]-=vy*dt;}}
    /** Radial blast from a point: nearer parts fly harder. */
    void blast(float bx,float by,float power,Random rng,float dt){
        for(Piece p:pieces){if(p.weldTo!=null||p.removed)continue;float dx=p.cx-bx,dy=p.cy-by,d=(float)Math.sqrt(dx*dx+dy*dy)+40;
            float f=power*Math.min(1.8f,220/d+.4f)*(.7f+rng.nextFloat()*.6f);push(p,dx/d*f+(rng.nextFloat()-.5f)*150,dy/d*f+260+rng.nextFloat()*200,(rng.nextFloat()-.5f)*900,dt);}
    }
    void breakJoints(Piece p){for(Joint j:joints)if(j.a==p||j.b==p)j.broken=true;}
    void breakAll(){for(Joint j:joints)j.broken=true;}
    void remove(Piece p){p.removed=true;breakJoints(p);for(Piece o:pieces)if(o.weldTo==p)o.removed=true;}

    // ---------------- simulation ----------------
    void step(float dt){
        if(!simulate||n==0)return;
        int sub=Math.max(2,(int)Math.ceil(dt/(1/240f)));float h=dt/sub;
        for(int s=0;s<sub;s++){
            for(int i=0;i<n;i++){float vx=(x[i]-px[i])*.999f,vy=(y[i]-py[i])*.999f;px[i]=x[i];py[i]=y[i];x[i]+=vx;y[i]+=vy-gravity*h*h;}
            for(int it=0;it<6;it++){
                for(Piece p:pieces){if(p.p0<0||p.removed)continue;int i=p.p0;stick(i,i+1);stick(i+1,i+2);stick(i,i+2);}
                for(Joint j:joints){if(j.broken||j.a.removed||j.b.removed)continue;pin(j);}
                if(posture>0)for(Joint j:joints)if(!j.broken&&!j.a.removed&&!j.b.removed)hold(j);
                for(int i=0;i<n;i++)bounds(i);
                if(pinRoot&&root!=null&&root.p0>=0)pinRootNow();
            }
        }
        for(Piece p:pieces)if(p.weldTo==null)pose(p);refreshWelds();
    }
    private void pinRootNow(){
        int i=root.p0;float c=MathUtils.cosDeg(rootSpin),s=MathUtils.sinDeg(rootSpin),ox=root.cx,oy=root.minY;
        for(int k=0;k<3;k++){float dx=rx[i+k]-ox,dy=ry[i+k]-oy;x[i+k]=ox+dx*c-dy*s+rootOffX;y[i+k]=oy+dx*s+dy*c+rootOffY;px[i+k]=x[i+k];py[i+k]=y[i+k];}
    }
    private void stick(int a,int b){
        float dx=x[b]-x[a],dy=y[b]-y[a],d=(float)Math.sqrt(dx*dx+dy*dy);if(d<1e-4f)return;
        float rdx=rx[b]-rx[a],rdy=ry[b]-ry[a],rest=(float)Math.sqrt(rdx*rdx+rdy*rdy);float w=inv[a]+inv[b];if(w==0)return;
        float c=(d-rest)/(d*w);x[a]+=dx*c*inv[a];y[a]+=dy*c*inv[a];x[b]-=dx*c*inv[b];y[b]-=dy*c*inv[b];
    }
    private void pin(Joint j){
        int a=j.a.p0,b=j.b.p0;
        float ax=j.wa[0]*x[a]+j.wa[1]*x[a+1]+j.wa[2]*x[a+2],ay=j.wa[0]*y[a]+j.wa[1]*y[a+1]+j.wa[2]*y[a+2];
        float bx=j.wb[0]*x[b]+j.wb[1]*x[b+1]+j.wb[2]*x[b+2],by=j.wb[0]*y[b]+j.wb[1]*y[b+1]+j.wb[2]*y[b+2];
        float cx=bx-ax,cy=by-ay;
        float sum=0;for(int k=0;k<3;k++)sum+=j.wa[k]*j.wa[k]*inv[a+k]+j.wb[k]*j.wb[k]*inv[b+k];if(sum<1e-9f)return;
        for(int k=0;k<3;k++){float fa=j.wa[k]*inv[a+k]/sum,fb=j.wb[k]*inv[b+k]/sum;x[a+k]+=cx*fa;y[a+k]+=cy*fa;x[b+k]-=cx*fb;y[b+k]-=cy*fb;}
    }
    /** Posture: nudge the child's orientation back toward its rest angle relative to the parent. */
    private void hold(Joint j){
        int a=j.a.p0,b=j.b.p0;
        float pa=MathUtils.atan2(y[a+1]-y[a],x[a+1]-x[a])-MathUtils.atan2(ry[a+1]-ry[a],rx[a+1]-rx[a]);
        float pb=MathUtils.atan2(y[b+1]-y[b],x[b+1]-x[b])-MathUtils.atan2(ry[b+1]-ry[b],rx[b+1]-rx[b]);
        float d=pa-pb;while(d>MathUtils.PI)d-=MathUtils.PI2;while(d<-MathUtils.PI)d+=MathUtils.PI2;
        float turn=d*posture*.25f;float cx=(x[b]+x[b+1]+x[b+2])/3,cy=(y[b]+y[b+1]+y[b+2])/3;float c=MathUtils.cos(turn),s=MathUtils.sin(turn);
        for(int k=0;k<3;k++){int i=b+k;float ox=x[i]-cx,oy=y[i]-cy;x[i]=cx+ox*c-oy*s;y[i]=cy+ox*s+oy*c;}
    }
    private void bounds(int i){
        if(floorOn&&y[i]<floor){y[i]=floor;float vx=x[i]-px[i];px[i]=x[i]-vx*friction;float vy=y[i]-py[i];if(vy<0)py[i]=y[i]+vy*.25f;}
        if(x[i]<left){x[i]=left;px[i]=x[i]+(x[i]-px[i])*.4f;}
        if(x[i]>right){x[i]=right;px[i]=x[i]+(x[i]-px[i])*.4f;}
        if(y[i]>top){y[i]=top;py[i]=y[i];}
    }
    private void pose(Piece p){
        if(p.weldTo!=null){Piece w=p.weldTo;p.angle=w.angle;p.tx=w.tx;p.ty=w.ty;return;}
        int i=p.p0;float rcx=(rx[i]+rx[i+1]+rx[i+2])/3,rcy=(ry[i]+ry[i+1]+ry[i+2])/3,ccx=(x[i]+x[i+1]+x[i+2])/3,ccy=(y[i]+y[i+1]+y[i+2])/3;
        float a=MathUtils.atan2(y[i+1]-y[i],x[i+1]-x[i])-MathUtils.atan2(ry[i+1]-ry[i],rx[i+1]-rx[i]);
        float c=MathUtils.cos(a),s=MathUtils.sin(a);p.angle=a;p.tx=ccx-(rcx*c-rcy*s);p.ty=ccy-(rcx*s+rcy*c);
        // welded pieces were posed before their parent on the first pass; refresh them
    }
    void refreshWelds(){for(Piece p:pieces)if(p.weldTo!=null)pose(p);}
    /** Lowest and highest x of the body near the floor, for the contact shadow. */
    float lowestCenterX(){Piece b=root;return b==null?0:b.tx+(b.cx*MathUtils.cos(b.angle)-b.cy*MathUtils.sin(b.angle));}
    float centerY(Piece b){return b.ty+(b.cx*MathUtils.sin(b.angle)+b.cy*MathUtils.cos(b.angle));}
    float centerX(Piece b){return b.tx+(b.cx*MathUtils.cos(b.angle)-b.cy*MathUtils.sin(b.angle));}
}
