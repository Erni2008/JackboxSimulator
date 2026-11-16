package com.erni.finalanswer.deaths;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.PolygonSpriteBatch;
import com.badlogic.gdx.graphics.glutils.FrameBuffer;
import com.badlogic.gdx.graphics.glutils.ShaderProgram;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.math.Matrix4;
import com.badlogic.gdx.utils.Disposable;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.deaths.DeathRecipe.Body;
import com.erni.finalanswer.deaths.DeathRecipe.Head;
import com.erni.finalanswer.deaths.DeathRecipe.P;
import com.erni.finalanswer.ui.lobby.cages.CageCharacter;
import com.erni.finalanswer.ui.lobby.cages.CageCharacterPresentation;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * One character's death. The live, animated character is rendered into an offscreen texture until the impact; at the
 * impact the frame is frozen and cut into triangle shards, which the recipe then burns, melts, blows apart or drags
 * away, with particles sampled from the character's own colours. Everything is in "stage" pixels: the character stands
 * with its feet on {@link #FLOOR} inside a {@link #W}×{@link #H} canvas, drawn at (x, y) in world units, scale 1.
 */
public final class DeathActor implements Disposable {
    public static final int W=512,H=768;public static final float FLOOR=40,CHAR_H=600;
    public static final float IMPACT=1.5f; // seconds of anticipation before the impact

    private final CageCharacter character;private final CageCharacterPresentation.Profile profile;
    private final CageCharacterPresentation presentation=new CageCharacterPresentation();
    private final String id;private final DeathRecipe r;private final float charScale,charFloor,phase;
    private final FrameBuffer fbo;private final Matrix4 fboProj=new Matrix4(),fboTransform=new Matrix4(),saved=new Matrix4();
    private final Random rng;
    private Pixmap frozen;private float time,charTime=8;private boolean impacted;

    // shards
    private static final class Shard{float[] v=new float[6];float cx,cy;int group;boolean free,solid;float px,py,rot,vx,vy,va,detachAt=Float.NaN;}
    private static final class Group{float pivotX,pivotY,ox,oy,ang,sy=1,vx,vy,va;boolean moving;}
    private final List<Shard> shards=new ArrayList<>();private final Group[] groups={new Group(),new Group()};
    private float[] verts=new float[0];private short[] tris=new short[0];

    // particles
    private static final class Part{P type;float x,y,vx,vy,rot,va,age,life,size,g;float r,gc,b,a;boolean add;float seed;}
    private final List<Part> parts=new ArrayList<>();private final boolean[] fired;private final float[] emitted;

    public DeathActor(CageCharacter character,CageCharacterPresentation.Profile profile,String characterId,DeathCause cause,long seed){
        this.character=character;this.profile=profile;id=characterId;r=DeathRecipes.of(characterId,cause);rng=new Random(seed);
        float height=switch(characterId){case "skeleton"->120;case "ghost"->152;case "plague_doctor"->194;case "voodoo"->153;default->160;};
        charFloor=switch(characterId){case "skeleton","ghost"->69;case "puppeteer"->68;case "pumpkin"->67;default->63;};
        charScale=CHAR_H/height;phase=(seed&0xffff)*.001f;
        fbo=new FrameBuffer(Pixmap.Format.RGBA8888,W,H,false);fbo.getColorBufferTexture().setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);
        fboProj.setToOrtho2D(0,0,W,H);
        fired=new boolean[r.emits.size()];emitted=new float[r.emits.size()];
        for(int i=1;i<=240;i++)character.update(1f/30,i/30f,phase,false);
    }
    public DeathRecipe recipe(){return r;}
    public float time(){return time;}
    /** Seconds after the impact at which nothing visible is left moving. */
    public static float duration(){return IMPACT+3.4f;}
    public boolean impacted(){return impacted;}

    // ---------------- update ----------------
    public void update(float dt,PolygonSpriteBatch batch){
        time+=dt;float t=time-IMPACT;
        if(!impacted){
            charTime+=dt*(t>-.6f?1.8f:1);character.update(dt*(t>-.6f?1.8f:1),charTime,phase,false);renderCharacter(batch);
            if(t>=0)impact();
        }
        for(int i=0;i<r.emits.size();i++){var e=r.emits.get(i);
            if(t<e.at)continue;
            if(e.over<=0){if(!fired[i]){fired[i]=true;spawn(e,e.count);}}
            else{float want=Math.min(1,(t-e.at)/e.over)*e.count;int n=(int)want-(int)emitted[i];if(n>0){spawn(e,n);emitted[i]+=n;}}
        }
        if(impacted)physics(dt,t);
        for(int i=parts.size()-1;i>=0;i--){Part p=parts.get(i);p.age+=dt;if(p.age>=p.life){parts.remove(i);continue;}stepPart(p,dt);}
    }
    private void renderCharacter(PolygonSpriteBatch batch){
        fbo.begin();
        Gdx.gl.glClearColor(0,0,0,0);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
        var oldProj=batch.getProjectionMatrix().cpy();saved.set(batch.getTransformMatrix());
        batch.setProjectionMatrix(fboProj);
        float shake=0,t=time-IMPACT;
        if(t>-.5f&&t<0)shake=MathUtils.sin(time*70)*4*(1+t*2);
        fboTransform.idt().translate(W/2f+shake,FLOOR,0).scale(charScale,charScale,1).translate(-174,-charFloor,0);
        batch.setTransformMatrix(fboTransform);
        batch.setBlendFunctionSeparate(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA,GL20.GL_ONE,GL20.GL_ONE_MINUS_SRC_ALPHA);
        batch.setColor(Color.WHITE);batch.begin();presentation.draw(batch,character,profile,1,charTime);batch.end();
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        batch.setTransformMatrix(saved);batch.setProjectionMatrix(oldProj);
        if(time-IMPACT>=0&&frozen==null)frozen=ScreenUtils.getFrameBufferPixmap(0,0,W,H);
        fbo.end();
    }
    private float alphaAt(float x,float y){
        if(frozen==null)return 1;int px=MathUtils.clamp((int)x,0,W-1),py=MathUtils.clamp(H-1-(int)y,0,H-1);
        return (frozen.getPixel(px,py)&0xff)/255f;
    }
    private int colorNear(float x,float y){
        if(frozen==null)return 0xffffffff;
        for(int k=0;k<24;k++){float ax=x+(rng.nextFloat()-.5f)*120,ay=y+(rng.nextFloat()-.5f)*120;int px=MathUtils.clamp((int)ax,0,W-1),py=MathUtils.clamp(H-1-(int)ay,0,H-1);
            int c=frozen.getPixel(px,py);if((c&0xff)>200)return c|0xff;}
        return 0xbbbbbbff;
    }

    private void impact(){
        impacted=true;
        float neckY=FLOOR+DeathRecipes.neck(id)*CHAR_H;
        if(r.body==Body.SHATTER){r.cols=Math.max(r.cols,13);r.rows=Math.max(r.rows,19);}
        float cw=(float)W/r.cols,ch=(float)H/r.rows;float[][] gx=new float[r.cols+1][r.rows+1],gy=new float[r.cols+1][r.rows+1];
        for(int i=0;i<=r.cols;i++)for(int j=0;j<=r.rows;j++){
            float jx=(i==0||i==r.cols)?0:(rng.nextFloat()-.5f)*.7f*cw,jy=(j==0||j==r.rows)?0:(rng.nextFloat()-.5f)*.7f*ch;
            gx[i][j]=i*cw+jx;gy[i][j]=j*ch+jy;}
        for(int i=0;i<r.cols;i++)for(int j=0;j<r.rows;j++){
            boolean flip=rng.nextBoolean();
            float[][] a=flip?new float[][]{{gx[i][j],gy[i][j]},{gx[i+1][j],gy[i+1][j]},{gx[i+1][j+1],gy[i+1][j+1]}}:new float[][]{{gx[i][j],gy[i][j]},{gx[i+1][j],gy[i+1][j]},{gx[i][j+1],gy[i][j+1]}};
            float[][] b=flip?new float[][]{{gx[i][j],gy[i][j]},{gx[i+1][j+1],gy[i+1][j+1]},{gx[i][j+1],gy[i][j+1]}}:new float[][]{{gx[i+1][j],gy[i+1][j]},{gx[i+1][j+1],gy[i+1][j+1]},{gx[i][j+1],gy[i][j+1]}};
            addShard(a,neckY);addShard(b,neckY);}
        groups[0].pivotX=W/2f;groups[0].pivotY=FLOOR;
        float hx=0,hy=0;int hn=0;for(Shard s:shards)if(s.group==1){hx+=s.cx;hy+=s.cy;hn++;}
        groups[1].pivotX=hn>0?hx/hn:W/2f;groups[1].pivotY=hn>0?hy/hn:neckY;
        verts=new float[shards.size()*15];tris=new short[shards.size()*3];for(int i=0;i<tris.length;i++)tris[i]=(short)i;
        float hitX=W/2f+r.hitX*CHAR_H,hitY=FLOOR+r.hitY*CHAR_H;
        // schedule body / head behaviour
        if(r.head==Head.FLY){var g=groups[1];g.vx=r.headVx;g.vy=r.headVy;g.va=r.headSpin;g.moving=true;}
        for(Shard s:shards){
            if(s.group==1&&r.head==Head.SHATTER){s.detachAt=0;kick(s,hitX,hitY,r.shatterPower);}
            if(s.group==0||r.head==Head.NONE){
                if(r.body==Body.SHATTER){s.detachAt=r.bodyAt;kick(s,hitX,hitY,r.shatterPower);}
                if(r.body==Body.COLLAPSE){float k=1-(s.cy-FLOOR)/CHAR_H;s.detachAt=r.bodyAt+(1-k)*.35f+rng.nextFloat()*.12f;s.vx=(rng.nextFloat()-.5f)*140+(s.cx-W/2f)*.6f;s.vy=rng.nextFloat()*60;s.va=(rng.nextFloat()-.5f)*400;}
            }
        }
    }
    private void addShard(float[][] p,float neckY){
        float cx=(p[0][0]+p[1][0]+p[2][0])/3,cy=(p[0][1]+p[1][1]+p[2][1])/3;
        float a=Math.max(Math.max(alphaAt(cx,cy),alphaAt(p[0][0]*.7f+cx*.3f,p[0][1]*.7f+cy*.3f)),Math.max(alphaAt(p[1][0]*.7f+cx*.3f,p[1][1]*.7f+cy*.3f),alphaAt(p[2][0]*.7f+cx*.3f,p[2][1]*.7f+cy*.3f)));
        if(a<.04f){ // a cheap second chance for thin parts (strings, pins): scan a few more points
            boolean any=false;for(int k=0;k<6&&!any;k++){float u=rng.nextFloat(),v=rng.nextFloat()*(1-u);float x=p[0][0]+(p[1][0]-p[0][0])*u+(p[2][0]-p[0][0])*v,y=p[0][1]+(p[1][1]-p[0][1])*u+(p[2][1]-p[0][1])*v;any=alphaAt(x,y)>.1f;}
            if(!any)return;}
        Shard s=new Shard();s.solid=a>.5f;for(int k=0;k<3;k++){s.v[k*2]=p[k][0];s.v[k*2+1]=p[k][1];}s.cx=cx;s.cy=cy;s.group=(r.head!=Head.NONE&&cy>neckY)?1:0;shards.add(s);
    }
    private void kick(Shard s,float hx,float hy,float power){
        float dx=s.cx-hx,dy=s.cy-hy,d=(float)Math.sqrt(dx*dx+dy*dy)+30;float f=power*(.45f+rng.nextFloat()*.9f)*Math.min(1.6f,180/d+.35f);
        s.vx=dx/d*f+(rng.nextFloat()-.5f)*120;s.vy=dy/d*f+220+rng.nextFloat()*160;s.va=(rng.nextFloat()-.5f)*900;
    }

    private void physics(float dt,float t){
        Group b=groups[0];float since=t-r.bodyAt;
        if(since>=0)switch(r.body){
            case TOPPLE->{float target=82*r.bodyDir;if(Math.abs(b.ang)<Math.abs(target)){b.va+=r.bodyDir*520*dt;b.ang+=b.va*dt;if(Math.abs(b.ang)>=Math.abs(target)){b.ang=target;b.va=-b.va*.18f;}}else{b.va*=.8f;b.ang+=b.va*dt;}}
            case FLY_BACK->{if(!b.moving){b.moving=true;b.vx=360*r.bodyDir;b.vy=340;b.va=-220*r.bodyDir;}}
            case SLUMP->{float k=MathUtils.clamp(since/.5f,0,1);b.sy=1-r.squash*(1-(1-k)*(1-k));b.ang=MathUtils.sin(k*MathUtils.PI*.5f)*6*r.bodyDir;}
            case SINK->{float k=MathUtils.clamp(since/1.8f,0,1);b.oy=-CHAR_H*1.05f*k*k;b.ox=MathUtils.sin(since*40)*3*(1-k);}
            case LIFT->{float k=MathUtils.clamp(since/1.6f,0,1);b.oy=CHAR_H*.35f*k+MathUtils.sin(since*22)*10*(1-k);b.ang=MathUtils.sin(since*9)*8;b.sy=1+.06f*k;}
            default->{}
        }
        if(r.squash>0&&r.body!=Body.SLUMP&&since>=0)b.sy=1-r.squash*MathUtils.clamp(since/1.2f,0,1);
        for(Group g:groups)if(g.moving){g.vy-=1500*dt;g.ox+=g.vx*dt;g.oy+=g.vy*dt;g.ang+=g.va*dt;
            float low=Float.MAX_VALUE;for(Shard s:shards)if(!s.free&&s.solid&&groups[s.group]==g)for(int k=0;k<3;k++)low=Math.min(low,ty(g,s.cx+(s.v[k*2]-s.cx)*.5f,s.cy+(s.v[k*2+1]-s.cy)*.5f));
            if(low<FLOOR&&low!=Float.MAX_VALUE){g.oy+=FLOOR-low;if(g.vy<0)g.vy=-g.vy*.28f;g.vx*=.55f;g.va*=.5f;if(Math.abs(g.vy)<60){g.vy=0;g.vx*=.85f;g.va*=.8f;}}}
        for(Shard s:shards){
            if(!s.free&&!Float.isNaN(s.detachAt)&&t>=s.detachAt){Group g=groups[s.group];s.free=true;
                float wx=tx(g,s.cx,s.cy),wy=ty(g,s.cx,s.cy);s.px=wx-s.cx;s.py=wy-s.cy;s.rot=g.ang;s.vx+=g.vx;s.vy+=g.vy;}
            if(s.free){s.vy-=1500*dt;s.px+=s.vx*dt;s.py+=s.vy*dt;s.rot+=s.va*dt;
                float y=s.cy+s.py;if(y<FLOOR+5){s.py=FLOOR+5-s.cy;if(s.vy<0)s.vy=-s.vy*.25f;s.vx*=.6f;s.va*=.5f;if(Math.abs(s.vy)<40){s.vy=0;s.vx*=.82f;s.va*=.75f;}}}
        }
    }
    private float tx(Group g,float x,float y){float c=MathUtils.cosDeg(g.ang),s=MathUtils.sinDeg(g.ang);float dx=x-g.pivotX,dy=(y-g.pivotY)*g.sy;return g.pivotX+dx*c-dy*s+g.ox;}
    private float ty(Group g,float x,float y){float c=MathUtils.cosDeg(g.ang),s=MathUtils.sinDeg(g.ang);float dx=x-g.pivotX,dy=(y-g.pivotY)*g.sy;return g.pivotY+dx*s+dy*c+g.oy;}

    // ---------------- particles ----------------
    private void spawn(DeathRecipe.Emit e,int n){
        float cx=W/2f+e.x*CHAR_H,cy=FLOOR+e.y*CHAR_H;
        if(impacted&&r.body==Body.SINK){cy+=groups[0].oy;}
        if(r.body==Body.LIFT&&impacted)cy+=groups[0].oy;
        for(int i=0;i<n;i++){Part p=new Part();p.type=e.type;p.seed=rng.nextFloat();
            p.x=cx+(rng.nextFloat()*2-1)*e.spreadX*CHAR_H;p.y=cy+(rng.nextFloat()*2-1)*e.spreadY*CHAR_H;
            float ang=e.angle+(rng.nextFloat()-.5f)*e.angleSpread,sp=Math.abs(e.speed)*(.35f+rng.nextFloat()*.9f);
            p.vx=MathUtils.cosDeg(ang)*sp;p.vy=MathUtils.sinDeg(ang)*sp;
            p.life=e.life*(.6f+rng.nextFloat()*.6f);p.size=e.size*(.6f+rng.nextFloat()*.8f);
            if(e.speed<0){p.x=cx+MathUtils.cosDeg(ang)*CHAR_H*.55f;p.y=cy+MathUtils.sinDeg(ang)*CHAR_H*.55f;p.vx=-p.vx;p.vy=-p.vy;p.rot=ang+180;}
            int c=e.color!=0?e.color:colorNear(cx-W/2f+W/2f,cy);
            p.r=((c>>>24)&0xff)/255f;p.gc=((c>>>16)&0xff)/255f;p.b=((c>>>8)&0xff)/255f;p.a=(c&0xff)/255f;
            p.g=!Float.isNaN(e.gravity)?e.gravity:switch(e.type){case CHUNK,DROP,SEED,PIN,SPLINTER->1500;case FEATHER,ASH->60;case STRING->500;case EMBER,WISP,SMOKE->-40;default->0;};
            p.add=switch(e.type){case SPARK,EMBER,GLOW,WISP,RING->true;default->false;};
            if(p.type==P.CHUNK||p.type==P.SPLINTER||p.type==P.SEED||p.type==P.FEATHER||p.type==P.STRING||p.type==P.PIN&&e.speed>=0)p.va=(rng.nextFloat()-.5f)*900;
            if(p.type==P.PIN&&e.speed>=0)p.rot=rng.nextFloat()*360;
            parts.add(p);}
    }
    private void stepPart(Part p,float dt){
        p.vy-=p.g*dt;
        switch(p.type){
            case SMOKE->{p.vx*=1-1.6f*dt;p.vy*=1-1.2f*dt;}
            case FEATHER->{p.vx=p.vx*(1-2*dt)+MathUtils.sin(p.age*4+p.seed*9)*90*dt*4;p.vy=Math.max(p.vy*(1-2*dt),-70);}
            case ASH->{p.vx=p.vx*(1-1.5f*dt)+MathUtils.sin(p.age*3+p.seed*7)*40*dt;p.vy=Math.max(p.vy*(1-1.5f*dt),-50);}
            case EMBER,WISP->{p.vx=p.vx*(1-dt)+MathUtils.sin(p.age*5+p.seed*11)*120*dt;}
            case BAT->{p.vx+=MathUtils.sin(p.age*6+p.seed*20)*400*dt;p.vy+=MathUtils.cos(p.age*5+p.seed*13)*300*dt+60*dt;}
            case FLY->{p.vx=MathUtils.sin(p.age*9+p.seed*30)*160;p.vy=MathUtils.cos(p.age*11+p.seed*17)*120;}
            default->{}
        }
        p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=p.va*dt;
        if(p.g>500&&p.y<FLOOR+3){p.y=FLOOR+3;p.vy=-p.vy*.3f;p.vx*=.6f;p.va*=.5f;if(Math.abs(p.vy)<50)p.vy=0;}
    }

    // ---------------- render ----------------
    /** Draws the dying character with its stage origin at (x, y). The batch must not be drawing. */
    public void draw(PolygonSpriteBatch batch,ShaderProgram shader,DeathTextures tex,float x,float y,float alpha){
        float t=time-IMPACT;
        batch.begin();
        // anticipation behind the character
        drawAnticipation(batch,tex,x,y,t,alpha,false);
        batch.end();
        batch.setShader(shader);batch.setBlendFunction(GL20.GL_ONE,GL20.GL_ONE_MINUS_SRC_ALPHA);batch.begin();
        shader.setUniformf("u_time",time);
        float burn=Float.isNaN(r.burnAt)?0:MathUtils.clamp((t-r.burnAt)/r.burnDur,0,1);
        shader.setUniformf("u_burn",burn*1.08f);shader.setUniformf("u_dir",r.burnDir);
        shader.setUniformf("u_edge",((r.edge>>>24)&0xff)/255f,((r.edge>>>16)&0xff)/255f,((r.edge>>>8)&0xff)/255f,r.edgeWidth);
        shader.setUniformf("u_char",Float.isNaN(r.charAt)?0:r.charAmount*smooth((t-r.charAt)/r.charDur));
        shader.setUniformf("u_gray",Float.isNaN(r.grayAt)?0:smooth((t-r.grayAt)/r.grayDur));
        float tk=Float.isNaN(r.tintAt)?0:smooth((t-r.tintAt)/r.tintDur);
        shader.setUniformf("u_tint",MathUtils.lerp(1,((r.tint>>>24)&0xff)/255f,tk),MathUtils.lerp(1,((r.tint>>>16)&0xff)/255f,tk),MathUtils.lerp(1,((r.tint>>>8)&0xff)/255f,tk));
        shader.setUniformf("u_melt",Float.isNaN(r.meltAt)?0:r.meltAmount*smooth((t-r.meltAt)/r.meltDur));
        float wave=Float.isNaN(r.waveAt)?0:r.waveAmount*MathUtils.sin(MathUtils.clamp((t-r.waveAt)/r.waveDur,0,1)*MathUtils.PI);
        shader.setUniformf("u_wave",wave);
        shader.setUniformf("u_flash",t>=0&&t<.12f?(r.cause==DeathCause.EXPLODED?1:.6f)*(1-t/.12f):0);
        float glow=0;if(t>-.9f&&t<0&&r.cause==DeathCause.EXPLODED)glow=.5f+.5f*MathUtils.sin(time*(20+30*(t+.9f)));
        shader.setUniformf("u_glow",glow*.35f);
        shader.setUniformf("u_clip",r.body==Body.SINK&&impacted?y+FLOOR-2:-1e5f);
        float fade=Float.isNaN(r.fadeAt)?1:1-smooth((t-r.fadeAt)/r.fadeDur);
        int vc=0;float packed=Color.toFloatBits(1f,1f,1f,alpha*fade);
        if(!impacted){
            // live character: one quad (two triangles)
            float[] q={0,0,W,0,W,H,0,0,W,H,0,H};
            if(verts.length<30)verts=new float[30];if(tris.length<6){tris=new short[6];}
            for(int k=0;k<6;k++){int o=k*5;verts[o]=x+q[k*2];verts[o+1]=y+q[k*2+1];verts[o+2]=packed;verts[o+3]=q[k*2]/W;verts[o+4]=q[k*2+1]/H;}
            short[] idx={0,1,2,3,4,5};batch.draw(fbo.getColorBufferTexture(),verts,0,30,idx,0,6);
        }else{
            for(Shard s:shards){
                Group g=groups[s.group];float c=MathUtils.cosDeg(s.rot),sn=MathUtils.sinDeg(s.rot);
                float sp=packed;if(s.free&&(r.body==Body.SHATTER||s.group==1&&r.head==Head.SHATTER)){float fa=1-smooth((t-s.detachAt-1.4f)/1.1f);if(fa<=0){vc+=0;continue;}sp=Color.toFloatBits(1f,1f,1f,alpha*fade*fa);}
                for(int k=0;k<3;k++){float lx=s.v[k*2],ly=s.v[k*2+1],wx,wy;
                    if(s.free){float dx=lx-s.cx,dy=ly-s.cy;wx=s.cx+s.px+dx*c-dy*sn;wy=s.cy+s.py+dx*sn+dy*c;}
                    else{wx=tx(g,lx,ly);wy=ty(g,lx,ly);}
                    int o=vc*5;verts[o]=x+wx;verts[o+1]=y+wy;verts[o+2]=sp;verts[o+3]=lx/W;verts[o+4]=ly/H;vc++;}
            }
            if(vc>0)batch.draw(fbo.getColorBufferTexture(),verts,0,vc*5,tris,0,vc);
        }
        batch.end();
        // the soul leaves the body
        if(!Float.isNaN(r.soulAt)&&t>r.soulAt){float k=MathUtils.clamp((t-r.soulAt)/1.6f,0,1);
            batch.begin();
            shader.setUniformf("u_burn",0f);shader.setUniformf("u_melt",0f);shader.setUniformf("u_char",0f);shader.setUniformf("u_gray",1f);shader.setUniformf("u_flash",0f);shader.setUniformf("u_clip",-1e5f);
            shader.setUniformf("u_wave",1.4f);shader.setUniformf("u_glow",.0f);
            shader.setUniformf("u_tint",((r.soulColor>>>24)&0xff)/255f*1.6f,((r.soulColor>>>16)&0xff)/255f*1.6f,((r.soulColor>>>8)&0xff)/255f*1.6f);
            batch.setBlendFunction(GL20.GL_ONE,GL20.GL_ONE);
            float a=alpha*.55f*MathUtils.sin(k*MathUtils.PI)*fade;float lift=CHAR_H*.55f*smooth(k),sx=1+.15f*k;
            float p=Color.toFloatBits(a,a,a,a);float[] q={0,0,W,0,W,H,0,0,W,H,0,H};
            float[] sv=new float[30];for(int i=0;i<6;i++){int o=i*5;sv[o]=x+W/2f+(q[i*2]-W/2f)*sx;sv[o+1]=y+lift+q[i*2+1];sv[o+2]=p;sv[o+3]=q[i*2]/W;sv[o+4]=q[i*2+1]/H;}
            batch.draw(fbo.getColorBufferTexture(),sv,0,30,new short[]{0,1,2,3,4,5},0,6);
            batch.end();
        }
        batch.setShader(null);
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        batch.begin();drawParticles(batch,tex,x,y,alpha,false);drawAnticipation(batch,tex,x,y,t,alpha,true);batch.end();
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        batch.begin();drawParticles(batch,tex,x,y,alpha,true);if(r.shockwave&&t>=0&&t<.7f){float k=t/.7f;float s=80+900*k;batch.setColor(1,.75f,.4f,(1-k)*.8f*alpha);batch.draw(tex.ring,x+W/2f-s/2,y+FLOOR+.5f*CHAR_H-s/2,s,s);}batch.end();
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);batch.setColor(Color.WHITE);
    }
    private void drawAnticipation(PolygonSpriteBatch b,DeathTextures tex,float x,float y,float t,float alpha,boolean front){
        if(t>.15f)return;float k=MathUtils.clamp((t+IMPACT)/IMPACT,0,1),fadeOut=t>0?1-t/.15f:1;
        float hx=x+W/2f+r.hitX*CHAR_H,hy=y+FLOOR+r.hitY*CHAR_H;
        switch(r.cause){
            case SHOT->{if(!front)return;float s=10+18*(1-k)+3*MathUtils.sin(time*30);b.setColor(1,0,0,.9f*alpha*fadeOut*smooth(k*3));
                b.draw(tex.soft,hx-s*2,hy-s*2,s*4,s*4);b.setColor(1,.2f,.2f,alpha*fadeOut*smooth(k*3));b.draw(tex.soft,hx-5,hy-5,10,10);
                b.setColor(1,0,0,.22f*alpha*fadeOut*smooth(k*3));b.draw(tex.pixel,x-700,hy-1,hx-(x-700),2);
                if(t>-.05f&&t<.12f){b.setColor(1,.95f,.7f,alpha);b.draw(tex.pixel,x-700,hy-3,hx-(x-700),6);}}
            case BURNED->{if(front)return;b.setColor(1,.4f,.08f,.55f*alpha*smooth(k)*fadeOut+.0f);b.draw(tex.soft,x+W/2f-420,y+FLOOR-170,840,340);}
            case EXPLODED->{if(!front)return;float beat=.5f+.5f*MathUtils.sin(time*(8+40*k*k));b.setColor(1,.1f,.05f,(.25f+.6f*beat)*alpha*smooth(k*2)*fadeOut);
                b.draw(tex.soft,hx-60,hy-60,120,120);b.setColor(1,1,.8f,beat*alpha*fadeOut*smooth(k*2));b.draw(tex.soft,hx-8,hy-8,16,16);}
            case CURSED->{if(front)return;float rot=time*40;b.setColor(.7f,.4f,1,.55f*alpha*smooth(k)*fadeOut);
                float rs=520*(.8f+.2f*k);b.draw(tex.ring,x+W/2f-rs/2,y+FLOOR-rs*.18f,rs/2,rs*.18f,rs,rs*.36f,1,1,0);
                for(int i=0;i<10;i++){float a=rot+i*36;float px=x+W/2f+MathUtils.cosDeg(a)*230,py=y+FLOOR+MathUtils.sinDeg(a)*60+40*k;
                    b.setColor(.75f,.5f,1,.7f*alpha*smooth(k)*fadeOut);b.draw(tex.soft,px-14,py-14,28,28);}}
        }
        b.setColor(Color.WHITE);
    }
    private void drawParticles(PolygonSpriteBatch b,DeathTextures tex,float x,float y,float alpha,boolean additive){
        for(Part p:parts){if(p.add!=additive)continue;float k=p.age/p.life,a=p.a*alpha;
            float px=x+p.x,py=y+p.y;
            switch(p.type){
                case SPARK->{float len=Math.max(6,(float)Math.hypot(p.vx,p.vy)*.035f)*p.size;b.setColor(p.r,p.gc,p.b,a*(1-k));b.draw(tex.pixel,px-len/2,py-1.5f,len/2,1.5f,len,3,1,1,MathUtils.atan2(p.vy,p.vx)*MathUtils.radDeg);}
                case EMBER->{float s=(5+5*p.seed)*p.size*(1-k*.5f);float fl=.6f+.4f*MathUtils.sin(p.age*25+p.seed*40);b.setColor(p.r,p.gc,p.b,a*(1-k)*fl);b.draw(tex.soft,px-s*2,py-s*2,s*4,s*4);}
                case SMOKE->{float s=(60+120*k)*p.size;b.setColor(p.r,p.gc,p.b,a*.55f*MathUtils.sin(k*MathUtils.PI));b.draw(tex.soft,px-s/2,py-s/2,s/2,s/2,s,s,1,1,p.seed*360+p.age*20);}
                case GLOW->{float s=120*p.size*(1+k*.3f);b.setColor(p.r,p.gc,p.b,a*.8f*(1-k)*(.8f+.2f*MathUtils.sin(p.age*30)));b.draw(tex.soft,px-s/2,py-s/2,s,s);}
                case WISP->{float s=(26+30*p.seed)*p.size;b.setColor(p.r,p.gc,p.b,a*.8f*MathUtils.sin(k*MathUtils.PI));b.draw(tex.soft,px-s/2,py-s/2,s,s);}
                case RING->{float s=CHAR_H*p.size*(.3f+k);b.setColor(p.r,p.gc,p.b,a*(1-k));b.draw(tex.ring,px-s/2,py-s/2,s,s);}
                case CHUNK,SPLINTER->{float w=(p.type==P.SPLINTER?22:10+8*p.seed)*p.size,h=(p.type==P.SPLINTER?4:8+6*p.seed)*p.size;b.setColor(p.r,p.gc,p.b,a*fadeTail(k));b.draw(tex.pixel,px-w/2,py-h/2,w/2,h/2,w,h,1,1,p.rot);}
                case DROP->{float s=(7+7*p.seed)*p.size;b.setColor(p.r,p.gc,p.b,a*fadeTail(k));b.draw(tex.dot,px-s/2,py-s/2,s,s);}
                case SEED->{float s=(6+3*p.seed)*p.size;b.setColor(p.r,p.gc,p.b,a*fadeTail(k));b.draw(tex.dot,px-s*.8f,py-s*.45f,s*.8f,s*.45f,s*1.6f,s*.9f,1,1,p.rot);}
                case ASH->{float s=3+4*p.seed;b.setColor(p.r,p.gc,p.b,a*(1-k));b.draw(tex.pixel,px,py,s/2,s/2,s,s,1,1,p.rot+p.age*90);}
                case FEATHER->{float w=34*p.size,h=7*p.size;b.setColor(p.r,p.gc,p.b,a*fadeTail(k));b.draw(tex.dot,px-w/2,py-h/2,w/2,h/2,w,h,1,1,p.rot+MathUtils.sin(p.age*3)*30);}
                case STRING->{float w=2,h=180*p.size;b.setColor(p.r,p.gc,p.b,a*.85f*fadeTail(k));b.draw(tex.pixel,px-w/2,py-h/2,w/2,h/2,w,h,1,1,p.rot*.15f);}
                case PIN->{float len=70;float ang=p.g==0?p.rot:p.rot;b.setColor(.7f,.7f,.72f,a*fadeTail(k));b.draw(tex.pixel,px-len/2,py-1.5f,len/2,1.5f,len,3,1,1,ang);
                    float hx=px+MathUtils.cosDeg(ang)*len/2,hy=py+MathUtils.sinDeg(ang)*len/2;b.setColor(.85f,.05f,.08f,a*fadeTail(k));b.draw(tex.dot,hx-8,hy-8,16,16);}
                case BAT->{float flap=MathUtils.sin(p.age*28+p.seed*20)*35,s=(20+14*p.seed)*p.size;b.setColor(p.r,p.gc,p.b,a*fadeTail(k));
                    b.draw(tex.pixel,px,py,0,2,s,5,1,1,180-20-flap);b.draw(tex.pixel,px,py,0,2,s,5,1,1,20+flap);b.draw(tex.dot,px-5,py-5,10,10);}
                case FLY->{b.setColor(p.r,p.gc,p.b,a*MathUtils.sin(k*MathUtils.PI));b.draw(tex.dot,px-3,py-3,6,6);}
            }
        }
        b.setColor(Color.WHITE);
    }
    private static float fadeTail(float k){return k<.75f?1:1-(k-.75f)/.25f;}
    private static float smooth(float t){t=MathUtils.clamp(t,0,1);return t*t*(3-2*t);}

    @Override public void dispose(){fbo.dispose();if(frozen!=null)frozen.dispose();}
}
