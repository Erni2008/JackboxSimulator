package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.glutils.FrameBuffer;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.utils.*;
import com.erni.finalanswer.ui.lobby.cages.*;

/**
 * The FINAL ANSWER characters seated at the painted table (layer 2: behind the table, drawn before the table foreground).
 * Identity ({@link Member}), sprite, animation state, screen anchor, scale and layer order are kept apart: identity →
 * sprite once at load; seat anchor → screen position and perspective scale every frame; state → restrained procedural
 * motion (the art is single images, so there are no blink frames — only breathing, sway, trembling and startles).
 * Implements {@link CharacterActions} so the table drives it from rule events.
 */
public final class TableCast implements CharacterActions,Disposable {
    /** Characters and their existing art. Full-figure PNGs where they exist; otherwise one frame of the lobby rig's own idle. */
    public enum Member {
        //            art                                              rig          floats  pace  sway  bend  jitter
        DRACULA("cursed_boxes/survivors/dracula.png",null,false,           .8f,  .8f,  .6f,  0),
        SKELETON("cursed_boxes/survivors/skeleton.png",null,false,         1.3f, .9f,  .8f,  .35f),
        GHOST("cursed_boxes/survivors/ghost.png",null,true,                .55f, 1.6f, 2.2f, 0),
        PUMPKIN("cursed_boxes/survivors/pumpkin.png",null,false,           .65f, .7f,  .5f,  0),
        PLAGUE_DOCTOR("cursed_boxes/survivors/plague_doctor.png",null,false,.75f, .9f, 1.1f, 0),
        ZOMBIE(null,"zombie",false,                                        .5f,  1.3f, 1.4f, .15f),
        VOODOO(null,"voodoo",false,                                        1.1f, 1.0f, .9f,  .1f),
        PUPPETEER(null,"puppeteer",false,                                  .9f,  1.4f, 1.8f, 0);
        public final String png,rig;public final boolean floats;
        /** Idle personality: tempo, sway amount, upper-body bend, nervous micro-jitter. */
        public final float pace,sway,bend,jitter;
        Member(String png,String rig,boolean floats,float pace,float sway,float bend,float jitter){this.png=png;this.rig=rig;this.floats=floats;this.pace=pace;this.sway=sway;this.bend=bend;this.jitter=jitter;}
    }
    public enum State {IDLE,NERVOUS,SCARED}

    private final TextureRegion[] sprites=new TextureRegion[Member.values().length];
    private final Array<Texture> owned=new Array<>();
    private final Texture dot;
    // per seat
    private final Member[] cast=new Member[8];
    private final State[] state=new State[8];private final float[] stateAge=new float[8],active=new float[8],relief=new float[8],phase=new float[8];
    private int activeSeat=-1;private float centerX;private final float[] look=new float[8],curse=new float[8],hop=new float[8],flinch=new float[8],lean=new float[8],doom=new float[8],sx=new float[8],sy=new float[8],sh=new float[8];private final Integer[] order=new Integer[8];
    private int seats;private float time;
    /** Farther (higher on screen) first; empty seats last. Allocated once. */
    private final java.util.Comparator<Integer> byDepth=(a,b)->a>=seats?(b>=seats?0:1):b>=seats?-1:Float.compare(sy[b],sy[a]);
    /** Visible character height in world units (seated, from the seat up). */
    private final float height;
    private final Vector3 tmp=new Vector3(),top=new Vector3();
    private final Color gold=new Color(1,.78f,.42f,1);

    public TableCast(float height,Texture dot){
        this.height=height;this.dot=dot;
        CageLobby lobby=null;
        for(Member m:Member.values()){
            if(m.png!=null&&Gdx.files.internal(m.png).exists()){var t=new Texture(Gdx.files.internal(m.png),true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);owned.add(t);sprites[m.ordinal()]=new TextureRegion(t);}
            else if(m.rig!=null){if(lobby==null)lobby=new CageLobby();sprites[m.ordinal()]=snapshot(lobby,m.rig);}
            if(sprites[m.ordinal()]==null)Gdx.app.error("CursedCards","missing character art for "+m);}
        if(lobby!=null)lobby.dispose();
        for(int i=0;i<8;i++){cast[i]=Member.values()[i];state[i]=State.IDLE;phase[i]=i*1.37f;order[i]=i;}
    }
    /** One frame of a lobby rig's idle, rendered once and cropped (the rig's own art and pose; nothing is redrawn). */
    private TextureRegion snapshot(CageLobby lobby,String id){
        float clipX=108,clipY=62,clipW=140,clipH=163,scale=5;int w=Math.round(clipW*scale),h=Math.round(clipH*scale);
        var fbo=new FrameBuffer(Pixmap.Format.RGBA8888,w,h,false);var batch=new SpriteBatch();
        try{var rig=lobby.createCharacter(id);var profile=lobby.presentation(id);var presentation=new CageCharacterPresentation();
            for(int i=0;i<=80;i++)rig.update(i==0?0:1/20f,i/20f+3f,0,false);
            fbo.begin();Gdx.gl.glClearColor(0,0,0,0);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
            batch.setBlendFunctionSeparate(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA,GL20.GL_ONE,GL20.GL_ONE_MINUS_SRC_ALPHA);
            batch.getProjectionMatrix().setToOrtho2D(clipX,clipY,clipW,clipH);batch.begin();presentation.draw(batch,rig,profile,1,7f);batch.end();
            Pixmap read=Pixmap.createFromFrameBuffer(0,0,w,h);fbo.end();
            // Un-premultiply and crop to the opaque bounds; the framebuffer image is bottom-up, so the region is flipped.
            int minX=w,minY=h,maxX=-1,maxY=-1;var px=read.getPixels();
            for(int y=0;y<h;y++)for(int x=0;x<w;x++){int i=(y*w+x)*4,a=px.get(i+3)&255;if(a>8){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
                if(a>0&&a<255){for(int c=0;c<3;c++)px.put(i+c,(byte)Math.min(255,(px.get(i+c)&255)*255/a));}}
            if(maxX<0){read.dispose();return null;}
            Pixmap crop=new Pixmap(maxX-minX+1,maxY-minY+1,Pixmap.Format.RGBA8888);crop.setBlending(Pixmap.Blending.None);crop.drawPixmap(read,minX,minY,crop.getWidth(),crop.getHeight(),0,0,crop.getWidth(),crop.getHeight());read.dispose();
            var t=new Texture(crop,true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);crop.dispose();owned.add(t);
            var region=new TextureRegion(t);region.flip(false,true);return region;
        }finally{fbo.dispose();batch.dispose();}
    }
    /** Stable seat → character identity (by player id order); reset all states for a new layout. */
    public void seat(int count){seats=count;for(int i=0;i<8;i++){state[i]=State.IDLE;stateAge[i]=0;active[i]=0;relief[i]=0;doom[i]=0;hop[i]=flinch[i]=lean[i]=0;curse[i]=0;}}
    public Member member(int seat){return cast[seat];}
    public State state(int seat){return state[seat];}
    /** The audience's curse: a faint red shiver that lingers on this character through the deal. */
    public void curse(int seat){curse[seat]=1;flinch[seat]=1;}
    /** Eliminated presentation for this match only: red halo, then the figure dims (cleared by {@link #seat}). */
    public void doom(int seat){doom[seat]=Math.max(doom[seat],.001f);}
    public void setState(int seat,State s){if(state[seat]!=s){state[seat]=s;stateAge[seat]=0;}}

    /** Project each seat's anchor: sprite bottom sits at seat height behind the rim; height follows perspective. */
    public void layout(Array<SeatLayout.Seat> list,Camera camera,Rectangle view,int activeSeat,float dt){
        time+=dt;this.activeSeat=activeSeat;centerX=view.x+view.width*.5f;for(int i=0;i<8;i++)look[i]=MathUtils.clamp(look[i]+(activeSeat>=0?dt:-dt)*1.2f,0,1);
        for(int i=0;i<seats;i++){var st=list.get(i);
            tmp.set(st.characterAnchor).add(0,-1.9f,0);top.set(tmp).add(0,height,0);
            camera.project(tmp,view.x,view.y,view.width,view.height);camera.project(top,view.x,view.y,view.width,view.height);
            sx[i]=tmp.x;sy[i]=tmp.y;sh[i]=top.y-tmp.y;
            active[i]=MathUtils.clamp(active[i]+(i==activeSeat?dt:-dt)*2.5f,0,1);stateAge[i]+=dt;relief[i]=Math.max(0,relief[i]-dt);
            hop[i]=Math.max(0,hop[i]-dt*2.6f);curse[i]=Math.max(0,curse[i]-dt*.06f);flinch[i]=Math.max(0,flinch[i]-dt*2.2f);lean[i]=Math.max(0,lean[i]-dt*1.6f);
            if(state[i]==State.NERVOUS&&stateAge[i]>4.5f)setState(i,State.IDLE);if(doom[i]>0)doom[i]=Math.min(1,doom[i]+dt*.6f);}
        // farther (higher on screen) first
        java.util.Arrays.sort(order,0,8,byDepth);
    }
    public void draw(SpriteBatch batch){
        for(int n=0;n<seats;n++){int i=order[n];TextureRegion r=sprites[cast[i].ordinal()];if(r==null)continue;
            float h=sh[i],w=h*r.getRegionWidth()/(float)r.getRegionHeight(),t=time+phase[i],age=stateAge[i];
            Member m=cast[i];float tp=t*m.pace;
            float breathe=1+.014f*MathUtils.sin(tp*1.9f),sway=(MathUtils.sin(tp*.7f)*.8f+MathUtils.sin(tp*.31f+1.7f)*.4f)*m.sway,dx=0,dy=m.floats?MathUtils.sin(tp*1.3f)*h*.022f:0,rot=sway*.35f;
            // upper body bends (bottom stays seated): idle drift, a glance toward the player whose turn it is
            float bend=(MathUtils.sin(tp*.53f+.8f)*.5f+MathUtils.sin(tp*1.21f)*.18f)*m.bend*.012f;
            if(activeSeat>=0&&activeSeat!=i)bend+=MathUtils.clamp((sx[activeSeat]-sx[i])/(h*6),-1,1)*.022f*look[i];
            if(m.jitter>0)rot+=MathUtils.sin(tp*23)*MathUtils.sin(tp*3.1f)*m.jitter;
            switch(state[i]){
                case NERVOUS->{float k=Math.min(1,age*3);dx=MathUtils.sin(t*31)*h*.004f*k;rot+=MathUtils.sin(t*2.3f)*2.4f*k+MathUtils.sin(t*17)*.6f*k;}
                case SCARED->{float jolt=age<.35f?MathUtils.sin(age/.35f*MathUtils.PI):0;dy+=jolt*h*.06f;breathe*=1+jolt*.04f;
                    dx=MathUtils.sin(t*42)*h*.007f;rot+=MathUtils.sin(t*29)*1.6f-3*Math.min(1,age*2);}
                default->{}}
            if(relief[i]>0)dy+=MathUtils.sin((1-relief[i])*MathUtils.PI)*h*.035f;
            if(hop[i]>0)dy+=MathUtils.sin((1-hop[i])*MathUtils.PI)*h*.022f;
            if(flinch[i]>0){float f=flinch[i]*flinch[i];dx+=MathUtils.sin(t*38)*h*.006f*f;rot+=-4*f;breathe*=1-.02f*f;}
            if(lean[i]>0)bend+=MathUtils.sin((1-lean[i])*MathUtils.PI)*.05f*Math.signum(centerX-sx[i]);
            float x=sx[i]-w*.5f+dx,y=sy[i]+dy,ow=w*.5f;
            // active player: a warm golden halo behind and a faint gilded rim on the sprite
            if(active[i]>0){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(gold.r,gold.g*.85f,gold.b*.6f,.22f*active[i]);
                batch.draw(dot,sx[i]-w*.75f,sy[i]+h*.05f,w*1.5f,h*1.05f);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            if(curse[i]>0&&doom[i]==0){float pulse=.6f+.4f*MathUtils.sin(time*2.2f+i);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(.9f,.08f,.06f,.18f*curse[i]*pulse);
                batch.draw(dot,sx[i]-w*.7f,sy[i]-h*.02f,w*1.4f,h*1.05f);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            if(doom[i]>0){float d=doom[i],pulse=.75f+.25f*MathUtils.sin(time*9);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(1,.1f,.06f,.35f*pulse*(1-d*.5f));
                batch.draw(dot,sx[i]-w*.85f,sy[i]-h*.05f,w*1.7f,h*1.2f);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            float shade=state[i]==State.SCARED?.82f:1,fade=1-doom[i]*.6f;batch.setColor(shade*fade,shade*fade*(1-doom[i]*.35f),shade*fade*(1-doom[i]*.35f),1-doom[i]*.45f);
            float tint=batch.getPackedColor();bent(batch,r,x,y,w,h*breathe,bend*h,rot,tint);
            // cool moonlight catching the upper edge (window side)
            batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(.55f,.65f,1,.07f*(1-doom[i]));bent(batch,r,x+h*.004f,y+h*.006f,w,h*breathe,bend*h,rot,batch.getPackedColor());
            batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
            if(active[i]>0){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(gold.r,gold.g,gold.b,.10f*active[i]);bent(batch,r,x,y,w,h*breathe,bend*h,rot,batch.getPackedColor());batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            batch.setColor(Color.WHITE);}
    }
    private final float[] quad=new float[20*STRIPS];private static final int STRIPS=10;
    /**
     * The sprite as a strip mesh: the base stays put, each strip is shifted by bend·f² (f = height fraction), so the
     * figure leans and flexes like a body instead of rotating as a rigid card; {@code rot} tilts the whole figure.
     */
    private void bent(SpriteBatch batch,TextureRegion r,float x,float y,float w,float h,float bend,float rot,float color){
        float u=r.getU(),u2=r.getU2(),v=r.getV(),v2=r.getV2(),cx=x+w*.5f,cos=MathUtils.cosDeg(rot),sin=MathUtils.sinDeg(rot);int k=0;
        for(int s=0;s<STRIPS;s++){float f0=s/(float)STRIPS,f1=(s+1f)/STRIPS,o0=bend*f0*f0,o1=bend*f1*f1,y0=h*f0,y1=h*f1,tv0=MathUtils.lerp(v2,v,f0),tv1=MathUtils.lerp(v2,v,f1);
            k=vertex(k,-w*.5f+o0,y0,cx,y,cos,sin,color,u,tv0);k=vertex(k,-w*.5f+o1,y1,cx,y,cos,sin,color,u,tv1);
            k=vertex(k,w*.5f+o1,y1,cx,y,cos,sin,color,u2,tv1);k=vertex(k,w*.5f+o0,y0,cx,y,cos,sin,color,u2,tv0);}
        batch.draw(r.getTexture(),quad,0,k);
    }
    private int vertex(int k,float lx,float ly,float cx,float by,float cos,float sin,float color,float u,float v){
        quad[k++]=cx+lx*cos-ly*sin;quad[k++]=by+lx*sin+ly*cos;quad[k++]=color;quad[k++]=u;quad[k++]=v;return k;}
    /** Screen rectangles (bottom-left x,y,w,h) of seated sprites, for overlap checks. */
    public Rectangle bounds(int seat,Rectangle out){TextureRegion r=sprites[cast[seat].ordinal()];float h=sh[seat],w=r==null?0:h*r.getRegionWidth()/(float)r.getRegionHeight();return out.set(sx[seat]-w*.5f,sy[seat],w,h);}
    public boolean hasArt(int seat){return sprites[cast[seat].ordinal()]!=null;}

    // ---- CharacterActions ----
    @Override public void idle(int s){setState(s,State.IDLE);}
    @Override public void lookAtCards(int s){if(state[s]==State.IDLE)stateAge[s]=0;}
    @Override public void drawCard(int s){lean[s]=1;}
    @Override public void receiveCard(int s){hop[s]=Math.max(hop[s],.55f);}
    @Override public void loseCard(int s){flinch[s]=1;}
    @Override public void becomeActive(int s){hop[s]=1;if(state[s]==State.IDLE)stateAge[s]=0;}
    @Override public void discardPair(int s){relief[s]=.6f;}
    @Override public void nervous(int s){if(state[s]!=State.SCARED)setState(s,State.NERVOUS);}
    @Override public void survive(int s){setState(s,State.IDLE);relief[s]=.8f;}
    @Override public void eliminate(int s){setState(s,State.SCARED);}
    @Override public void dispose(){for(Texture t:owned)t.dispose();owned.clear();}
}
