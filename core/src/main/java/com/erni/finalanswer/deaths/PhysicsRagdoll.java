package com.erni.finalanswer.deaths;

import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.math.Vector2;
import com.badlogic.gdx.physics.box2d.*;
import com.badlogic.gdx.physics.box2d.joints.RevoluteJoint;
import com.badlogic.gdx.physics.box2d.joints.RevoluteJointDef;
import com.badlogic.gdx.utils.Disposable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * Box2D ragdoll built from a {@link Ragdoll} layout: each free body part is a rigid body shaped like the part's own
 * silhouette (convex hull of its opaque pixels), parts are linked by revolute joints with anatomical angle limits, and
 * joint motors act as muscles — strong while the character is alive, limp once it dies. Fixed 1/120 s steps.
 */
final class PhysicsRagdoll implements Disposable {
    static final float PPM=350f;static final short GROUND=1,BODY=2;
    static{Box2D.init();}
    interface Hull{float[] of(Ragdoll.Piece p);}

    final World world=new World(new Vector2(0,-9.8f),true);
    final Ragdoll layout;
    private final Map<Ragdoll.Piece,Body> bodies=new HashMap<>();
    private final Map<Ragdoll.Piece,float[]> rest=new HashMap<>();
    private final List<RevoluteJoint> joints=new ArrayList<>();private final Map<RevoluteJoint,Ragdoll.Piece> jointChild=new HashMap<>();
    private final Body ground;private float acc;
    private float muscle=1;private boolean held=true;private float holdX,holdY,holdA;private float rootX0,rootY0,rootA0;

    PhysicsRagdoll(Ragdoll layout,Hull hull,float floor,float left,float right){
        this.layout=layout;
        ground=staticBox(floor,left,right);
        for(var p:layout.pieces){if(p.weldTo!=null)continue;
            float[] h=hull.of(p);float cx=(p.minX+p.maxX)/2,cy=(p.minY+p.maxY)/2;
            Body b=makeBody(world,h,cx,cy,p==layout.root?1.4f:1f);b.setUserData(p);bodies.put(p,b);rest.put(p,new float[]{cx,cy});}
        for(var j:layout.joints){Body a=bodies.get(j.a),c=bodies.get(j.b);if(a==null||c==null)continue;
            var d=new RevoluteJointDef();d.initialize(a,c,new Vector2(j.ax/PPM,j.ay/PPM));d.collideConnected=false;d.enableLimit=true;
            float lim=j.b.head?.45f:(j.b.area<j.a.area*.25f?1.5f:.9f);d.lowerAngle=-lim;d.upperAngle=lim;d.enableMotor=true;d.maxMotorTorque=0;
            RevoluteJoint rj=(RevoluteJoint)world.createJoint(d);joints.add(rj);jointChild.put(rj,j.b);}
        Body r=bodies.get(layout.root);if(r!=null){rootX0=r.getPosition().x;rootY0=r.getPosition().y;rootA0=r.getAngle();r.setType(BodyDef.BodyType.KinematicBody);}
        sync();
    }
    /** Ground and side walls of the stage. */
    private Body staticBox(float floor,float left,float right){
        BodyDef bd=new BodyDef();bd.type=BodyDef.BodyType.StaticBody;Body g=world.createBody(bd);
        EdgeShape e=new EdgeShape();FixtureDef fd=new FixtureDef();fd.shape=e;fd.friction=.9f;fd.restitution=.08f;fd.filter.categoryBits=GROUND;fd.filter.maskBits=BODY;
        e.set(-50,floor/PPM,50,floor/PPM);g.createFixture(fd);
        e.set(left/PPM,floor/PPM,left/PPM,50);g.createFixture(fd);e.set(right/PPM,floor/PPM,right/PPM,50);g.createFixture(fd);e.dispose();return g;
    }
    /** A dynamic body whose shape is the given hull (stage pixels), with its origin at (cx, cy). */
    static Body makeBody(World world,float[] hullPx,float cx,float cy,float density){
        BodyDef bd=new BodyDef();bd.type=BodyDef.BodyType.DynamicBody;bd.position.set(cx/PPM,cy/PPM);bd.angularDamping=.6f;bd.linearDamping=.05f;
        Body b=world.createBody(bd);PolygonShape ps=new PolygonShape();
        float[] v=new float[hullPx.length];for(int i=0;i<hullPx.length;i+=2){v[i]=(hullPx[i]-cx)/PPM;v[i+1]=(hullPx[i+1]-cy)/PPM;}
        try{ps.set(v);}catch(RuntimeException ex){ps.setAsBox(.05f,.05f);}
        FixtureDef fd=new FixtureDef();fd.shape=ps;fd.density=density;fd.friction=.85f;fd.restitution=.06f;fd.filter.categoryBits=BODY;fd.filter.maskBits=GROUND;fd.filter.groupIndex=-1;
        b.createFixture(fd);ps.dispose();return b;
    }
    static Body ground(World world,float floor,float left,float right){
        BodyDef bd=new BodyDef();bd.type=BodyDef.BodyType.StaticBody;Body g=world.createBody(bd);
        EdgeShape e=new EdgeShape();FixtureDef fd=new FixtureDef();fd.shape=e;fd.friction=.9f;fd.restitution=.08f;fd.filter.categoryBits=GROUND;fd.filter.maskBits=BODY;
        e.set(-50,floor/PPM,50,floor/PPM);g.createFixture(fd);e.set(left/PPM,floor/PPM,left/PPM,50);g.createFixture(fd);e.set(right/PPM,floor/PPM,right/PPM,50);g.createFixture(fd);e.dispose();return g;
    }

    // ---------------- control ----------------
    /** Muscles: 1 holds the pose, 0 is a dead body (a little joint friction remains). */
    void muscles(float m){muscle=m;}
    /** While held, the torso follows (offset in pixels, spin in degrees); released, it is a free body. */
    void hold(boolean h){Body r=bodies.get(layout.root);if(r==null||held==h)return;held=h;r.setType(h?BodyDef.BodyType.KinematicBody:BodyDef.BodyType.DynamicBody);r.setAwake(true);}
    void holdOffset(float px,float py,float deg){holdX=px/PPM;holdY=py/PPM;holdA=deg*MathUtils.degRad;}
    boolean held(){return held;}
    Body body(Ragdoll.Piece p){return bodies.get(p);}
    /** Velocity kick (pixels/second) delivered at a stage point — off-centre hits spin the part. */
    void hit(Ragdoll.Piece p,float atX,float atY,float vx,float vy){Body b=bodies.get(p);if(b==null)return;
        if(b.getType()!=BodyDef.BodyType.DynamicBody){for(var o:bodies.values())if(o.getType()==BodyDef.BodyType.DynamicBody){}return;}
        b.applyLinearImpulse(b.getMass()*vx/PPM,b.getMass()*vy/PPM,atX/PPM,atY/PPM,true);}
    void hitAll(float vx,float vy){for(Body b:bodies.values())if(b.getType()==BodyDef.BodyType.DynamicBody)b.applyLinearImpulse(b.getMass()*vx/PPM,b.getMass()*vy/PPM,b.getWorldCenter().x,b.getWorldCenter().y,true);}
    void blast(float bx,float by,float power,Random rng){
        for(var e:bodies.entrySet()){Body b=e.getValue();if(b.getType()!=BodyDef.BodyType.DynamicBody)continue;Vector2 c=b.getWorldCenter();
            float dx=c.x*PPM-bx,dy=c.y*PPM-by,d=(float)Math.sqrt(dx*dx+dy*dy)+40,f=power*Math.min(1.8f,220/d+.4f)*(.75f+rng.nextFloat()*.5f);
            float vx=dx/d*f,vy=dy/d*f+300;float ox=(rng.nextFloat()-.5f)*.06f,oy=(rng.nextFloat()-.5f)*.06f;
            b.applyLinearImpulse(b.getMass()*vx/PPM,b.getMass()*vy/PPM,c.x+ox,c.y+oy,true);}
    }
    void breakJoints(Ragdoll.Piece p){for(int i=joints.size()-1;i>=0;i--){var j=joints.get(i);if(j.getBodyA().getUserData()==p||j.getBodyB().getUserData()==p){world.destroyJoint(j);jointChild.remove(j);joints.remove(i);}}}
    void breakAll(){for(var j:joints)world.destroyJoint(j);joints.clear();jointChild.clear();}
    void remove(Ragdoll.Piece p){breakJoints(p);Body b=bodies.remove(p);if(b!=null)world.destroyBody(b);p.removed=true;for(var o:layout.pieces)if(o.weldTo==p)o.removed=true;}
    /** Let everything fall through the floor (dragged under). */
    void ghostFloor(){for(Body b:bodies.values())for(Fixture f:b.getFixtureList()){Filter fl=f.getFilterData();fl.maskBits=0;f.setFilterData(fl);}}

    void step(float dt){
        acc+=dt;int guard=0;
        while(acc>=1/120f&&guard++<12){acc-=1/120f;
            Body r=bodies.get(layout.root);
            if(held&&r!=null){float tx=rootX0+holdX,ty=rootY0+holdY,ta=rootA0+holdA;Vector2 p=r.getPosition();
                r.setLinearVelocity((tx-p.x)*120,(ty-p.y)*120);r.setAngularVelocity((ta-r.getAngle())*120);}
            for(var j:joints){Body c=j.getBodyB();float m=c.getMass();
                j.setMaxMotorTorque(m*(.0015f+muscle*1.2f));j.setMotorSpeed(-j.getJointAngle()*(2+12*muscle));}
            world.step(1/120f,8,4);
        }
        sync();
    }
    private void sync(){
        for(var e:bodies.entrySet()){var p=e.getKey();Body b=e.getValue();float[] c=rest.get(p);float a=b.getAngle(),cs=MathUtils.cos(a),sn=MathUtils.sin(a);
            Vector2 pos=b.getPosition();p.angle=a;p.tx=pos.x*PPM-(c[0]*cs-c[1]*sn);p.ty=pos.y*PPM-(c[0]*sn+c[1]*cs);}
        layout.refreshWelds();
    }
    float centerX(Ragdoll.Piece p){Body b=bodies.get(p);return b==null?0:b.getWorldCenter().x*PPM;}
    float centerY(Ragdoll.Piece p){Body b=bodies.get(p);return b==null?0:b.getWorldCenter().y*PPM;}

    /** Convex hull (≤ 8 vertices, counter-clockwise) of a point cloud given as x,y pairs. */
    static float[] hull(float[] pts,int count){
        if(count<3)return null;
        Integer[] idx=new Integer[count];for(int i=0;i<count;i++)idx[i]=i;
        java.util.Arrays.sort(idx,(a,b)->pts[a*2]!=pts[b*2]?Float.compare(pts[a*2],pts[b*2]):Float.compare(pts[a*2+1],pts[b*2+1]));
        int[] h=new int[count*2];int k=0;
        for(int t=0;t<count;t++){int i=idx[t];while(k>=2&&cross(pts,h[k-2],h[k-1],i)<=0)k--;h[k++]=i;}
        for(int t=count-2,lo=k+1;t>=0;t--){int i=idx[t];while(k>=lo&&cross(pts,h[k-2],h[k-1],i)<=0)k--;h[k++]=i;}
        k--;List<float[]> poly=new ArrayList<>();for(int i=0;i<k;i++)poly.add(new float[]{pts[h[i]*2],pts[h[i]*2+1]});
        while(poly.size()>8){int best=0;float ba=Float.MAX_VALUE;for(int i=0;i<poly.size();i++){float[] a=poly.get((i+poly.size()-1)%poly.size()),b=poly.get(i),c=poly.get((i+1)%poly.size());
            float ar=Math.abs((b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1]));if(ar<ba){ba=ar;best=i;}}poly.remove(best);}
        if(poly.size()<3)return null;
        float[] out=new float[poly.size()*2];for(int i=0;i<poly.size();i++){out[i*2]=poly.get(i)[0];out[i*2+1]=poly.get(i)[1];}return out;
    }
    private static float cross(float[] p,int o,int a,int b){return (p[a*2]-p[o*2])*(p[b*2+1]-p[o*2+1])-(p[a*2+1]-p[o*2+1])*(p[b*2]-p[o*2]);}

    @Override public void dispose(){world.dispose();}
}
