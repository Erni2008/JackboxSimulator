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
    /** Survivors evaporate: <0 waiting, 0..1 dissolving bottom-up into rising light, ≥1 gone. NaN = not evaporating. */
    private final float[] evap=new float[8];private static final float EVAP_SECONDS=2.8f;
    private static final int WISPS=260;private final float[] wx=new float[WISPS],wy=new float[WISPS],wvx=new float[WISPS],wvy=new float[WISPS],wl=new float[WISPS],wm=new float[WISPS],ws=new float[WISPS];
    private final RandomXS128 rnd=new RandomXS128(17);private final Color base=new Color();
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
        for(int i=0;i<8;i++){evap[i]=death[i]=Float.NaN;cast[i]=Member.values()[i];state[i]=State.IDLE;phase[i]=i*1.37f;order[i]=i;}
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
    public void seat(int count){seats=count;for(int i=0;i<8;i++){state[i]=State.IDLE;stateAge[i]=0;active[i]=0;relief[i]=0;doom[i]=0;hop[i]=flinch[i]=lean[i]=0;curse[i]=0;evap[i]=Float.NaN;death[i]=Float.NaN;}for(int k=0;k<WISPS;k++)wl[k]=0;}
    public Member member(int seat){return cast[seat];}
    public State state(int seat){return state[seat];}
    /** The audience's curse: a faint red shiver that lingers on this character through the deal. */
    public void curse(int seat){curse[seat]=1;flinch[seat]=1;}
    /** Eliminated presentation for this match only: red halo, then the figure dims (cleared by {@link #seat}). */
    public void doom(int seat){doom[seat]=Math.max(doom[seat],.001f);}
    public void setState(int seat,State s){if(state[seat]!=s){state[seat]=s;stateAge[seat]=0;}}

    /** Project each seat's anchor: sprite bottom sits at seat height behind the rim; height follows perspective. */
    public void layout(Array<SeatLayout.Seat> list,Camera camera,Rectangle view,int activeSeat,float dt){
        time+=dt;lastDt=dt;this.activeSeat=activeSeat;centerX=view.x+view.width*.5f;for(int i=0;i<8;i++)look[i]=MathUtils.clamp(look[i]+(activeSeat>=0?dt:-dt)*1.2f,0,1);
        for(int i=0;i<seats;i++){var st=list.get(i);
            tmp.set(st.characterAnchor).add(0,-1.9f,0);top.set(tmp).add(0,height,0);
            camera.project(tmp,view.x,view.y,view.width,view.height);camera.project(top,view.x,view.y,view.width,view.height);
            sx[i]=tmp.x;sy[i]=tmp.y;sh[i]=top.y-tmp.y;
            active[i]=MathUtils.clamp(active[i]+(i==activeSeat?dt:-dt)*2.5f,0,1);stateAge[i]+=dt;relief[i]=Math.max(0,relief[i]-dt);
            hop[i]=Math.max(0,hop[i]-dt*2.6f);curse[i]=Math.max(0,curse[i]-dt*.06f);flinch[i]=Math.max(0,flinch[i]-dt*2.2f);lean[i]=Math.max(0,lean[i]-dt*1.6f);
            if(state[i]==State.NERVOUS&&stateAge[i]>4.5f)setState(i,State.IDLE);if(doom[i]>0)doom[i]=Math.min(1,doom[i]+dt*.6f);
            if(!Float.isNaN(death[i])&&death[i]<1)death[i]+=dt/DEATH_SECONDS;
            if(!Float.isNaN(evap[i])&&evap[i]<1){evap[i]+=dt/EVAP_SECONDS;if(evap[i]>0&&evap[i]<1)emit(i,dt);}}
        for(int k=0;k<WISPS;k++){if(wl[k]<=0)continue;wl[k]-=dt;wx[k]+=wvx[k]*dt+MathUtils.sin(time*2.1f+k)*dt*6;wy[k]+=wvy[k]*dt;wvy[k]*=1-dt*.4f;wvx[k]*=1-dt*.9f;}
        // farther (higher on screen) first
        java.util.Arrays.sort(order,0,8,byDepth);
    }
    /** Rising motes along a dissolve front at height fraction {@code front}, tinted (additive). */
    private void emit(int i,float dt,float front,float r,float g,float b,float rate){TextureRegion reg=sprites[cast[i].ordinal()];if(reg==null)return;float h=sh[i],w=h*reg.getRegionWidth()/(float)reg.getRegionHeight();
        int count=Math.max(1,Math.round(dt*rate));for(int n=0;n<count;n++){int k=-1;for(int q=0;q<WISPS;q++)if(wl[q]<=0){k=q;break;}if(k<0)return;
            wx[k]=sx[i]+(rnd.nextFloat()-.5f)*w*.7f;wy[k]=sy[i]+h*MathUtils.clamp(front+rnd.nextFloat()*.08f,0,1);wvx[k]=(rnd.nextFloat()-.5f)*h*.08f;wvy[k]=h*(.12f+rnd.nextFloat()*.22f);
            wm[k]=wl[k]=.9f+rnd.nextFloat()*1.1f;ws[k]=h*(.006f+rnd.nextFloat()*.014f);wr[k]=r;wg[k]=g;wb[k]=b;}}
    private void emit(int i,float dt){emit(i,dt,front(evap[i]),.85f,.9f,1,90);}
    private final float[] wr=new float[WISPS],wg=new float[WISPS],wb=new float[WISPS];
    private static float front(float e){return e*1.3f-.15f;}
    /** Start the survivor's evaporation (once per match). */
    public void evaporate(int seat){if(Float.isNaN(evap[seat]))evap[seat]=-.6f;}
    public boolean evaporating(){for(int i=0;i<seats;i++)if(!Float.isNaN(evap[i])&&evap[i]<1||!Float.isNaN(death[i])&&death[i]<1)return true;for(int k=0;k<WISPS;k++)if(wl[k]>0)return true;return false;}
    /** 0..1 within a recurring beat of {@code len} seconds every {@code period} seconds (personal gestures). */
    private static float beat(float t,float period,float len){float ph=t%period;return ph<len?MathUtils.sin(ph/len*MathUtils.PI):0;}
    public void draw(SpriteBatch batch){
        for(int n=0;n<seats;n++){int i=order[n];TextureRegion r=sprites[cast[i].ordinal()];if(r==null)continue;
            float ev=Float.isNaN(evap[i])?-1:evap[i];if(ev>=1)continue;dissolve=ev>0?ev:-1;dTop=false;dR=.5f;dG=.55f;dB=.7f;
            float D=Float.isNaN(death[i])?-1:Math.min(1,death[i]);if(D>=1)continue;
            float h=sh[i],w=h*r.getRegionWidth()/(float)r.getRegionHeight(),t=time+phase[i],age=stateAge[i];
            Member m=cast[i];float tp=t*m.pace;
            float breathe=1+.014f*MathUtils.sin(tp*1.9f),sway=(MathUtils.sin(tp*.7f)*.8f+MathUtils.sin(tp*.31f+1.7f)*.4f)*m.sway,dx=0,dy=m.floats?MathUtils.sin(tp*1.3f)*h*.022f:0,rot=sway*.35f;
            // upper body bends (bottom stays seated): idle drift, a glance toward the player whose turn it is
            float bend=(MathUtils.sin(tp*.53f+.8f)*.5f+MathUtils.sin(tp*1.21f)*.18f)*m.bend*.012f;
            if(activeSeat>=0&&activeSeat!=i)bend+=MathUtils.clamp((sx[activeSeat]-sx[i])/(h*6),-1,1)*.022f*look[i];
            if(m.jitter>0)rot+=MathUtils.sin(tp*23)*MathUtils.sin(tp*3.1f)*m.jitter;
            float glowA=0;
            // Each character moves in its own way.
            if(D<0)switch(m){
                case DRACULA->{float lp=beat(t,7.3f,1.8f);bend+=lp*.07f*Math.signum(centerX-sx[i]);breathe*=1+lp*.025f;rot+=MathUtils.sin(tp*.4f)*.8f;}
                case SKELETON->{float b=beat(t,5.3f,.55f);dx+=MathUtils.sin(t*61)*h*.005f*b;rot+=MathUtils.sin(t*47)*2.2f*b;dy+=Math.abs(MathUtils.sin(t*30))*h*.006f*b;}
                case GHOST->{wave=h*.014f;dx+=MathUtils.sin(t*.42f)*h*.025f;dy+=MathUtils.sin(t*.9f+1)*h*.01f;}
                case PUMPKIN->{rot+=MathUtils.sin(tp*1.1f)*2.4f;glowA=.12f+.08f*MathUtils.sin(t*5.3f)+.05f*MathUtils.sin(t*13.1f);}
                case PLAGUE_DOCTOR->{float tl=beat(t,6.1f,1.5f),s2=MathUtils.sin(t*.37f)>0?1:-1;rot+=tl*7*s2;bend+=tl*.035f*s2;}
                case ZOMBIE->{rot+=MathUtils.sin(tp*.9f)*3;float tw=beat(t,3.7f,.2f);dx+=tw*h*.02f;rot-=tw*6;bend+=MathUtils.sin(tp*.45f)*.03f;}
                case VOODOO->{float b=Math.abs(MathUtils.sin(tp*2.2f));breathe*=1+b*.03f;dy+=b*h*.01f;rot+=beat(t,4.4f,.28f)*12;}
                case PUPPETEER->{float tq=MathUtils.floor(t*4)/4f;rot+=MathUtils.sin(tq*1.7f)*4.5f;dy+=Math.abs(MathUtils.sin(tq*2.3f))*h*.022f;bend+=MathUtils.sin(tq*1.1f)*.03f;}
            }
            if(D<0)switch(state[i]){
                case NERVOUS->{float k=Math.min(1,age*3);dx+=MathUtils.sin(t*31)*h*.004f*k;rot+=MathUtils.sin(t*2.3f)*2.4f*k+MathUtils.sin(t*17)*.6f*k;}
                case SCARED->{float jolt=age<.35f?MathUtils.sin(age/.35f*MathUtils.PI):0;dy+=jolt*h*.06f;breathe*=1+jolt*.04f;
                    dx+=MathUtils.sin(t*42)*h*.007f;rot+=MathUtils.sin(t*29)*1.6f-3*Math.min(1,age*2);}
                default->{}}
            if(relief[i]>0)dy+=MathUtils.sin((1-relief[i])*MathUtils.PI)*h*.035f;
            if(hop[i]>0)dy+=MathUtils.sin((1-hop[i])*MathUtils.PI)*h*.022f;
            if(flinch[i]>0){float f=flinch[i]*flinch[i];dx+=MathUtils.sin(t*38)*h*.006f*f;rot+=-4*f;breathe*=1-.02f*f;}
            if(lean[i]>0)bend+=MathUtils.sin((1-lean[i])*MathUtils.PI)*.05f*Math.signum(centerX-sx[i]);
            // Each character dies in its own way.
            float alpha=1,tr=1,tg=1,tb=1,scaleW=1,scaleH=1;
            if(D>=0){float q;switch(m){
                case DRACULA->{q=MathUtils.clamp(D/.3f,0,1);dy+=q*h*.05f;breathe*=1+q*.05f;rot+=MathUtils.sin(t*20)*q*1.5f;
                    if(D>.25f){dissolve=(D-.25f)/.75f;dTop=true;dR=.9f;dG=.05f;dB=.05f;emit(i,lastDt,1-front(dissolve),1,.15f,.1f,120);}}
                case SKELETON->{dx+=D<.2f?MathUtils.sin(t*70)*h*.008f:0;collapse=MathUtils.clamp((D-.15f)/.85f,0,1);alpha=1-MathUtils.clamp((D-.8f)/.2f,0,1);}
                case GHOST->{q=D*D;scaleW=1-q*.95f;scaleH=1+q*.4f-q*q*1.3f;dx+=(centerX-sx[i])*q;dy+=-h*.25f*q;rot+=q*720;alpha=1-MathUtils.clamp((D-.75f)/.25f,0,1);tr=tg=1;tb=1;
                    if(D<.9f)emit(i,lastDt,.6f,.8f,.9f,1,60);}
                case PUMPKIN->{q=MathUtils.clamp(D/.4f,0,1);glowA=(1-q)*(.6f+.4f*MathUtils.sin(t*40));float dark=MathUtils.clamp((D-.3f)/.3f,0,1);tr=tg=tb=1-dark*.85f;
                    float s2=MathUtils.clamp((D-.55f)/.45f,0,1);dy-=s2*s2*h*.95f;rot+=s2*8;}
                case PLAGUE_DOCTOR->{dissolve=D;dR=1;dG=.45f;dB=.05f;emit(i,lastDt,front(D),1,.55f,.15f,140);rot+=MathUtils.sin(t*9)*D*2;}
                case ZOMBIE->{q=MathUtils.clamp((D-.1f)/.75f,0,1);q=q*q;rot+=q*-82*Math.signum(centerX-sx[i]+.01f);dy-=q*h*.35f;tr=1-D*.3f;tb=1-D*.4f;alpha=1-MathUtils.clamp((D-.85f)/.15f,0,1);
                    dx+=D<.12f?MathUtils.sin(t*50)*h*.006f:0;}
                case VOODOO->{q=MathUtils.clamp(D/.3f,0,1);dx+=MathUtils.sin(t*80)*h*.012f*(1-q*.5f);tr=1;tg=tb=1-q*.5f;shear=MathUtils.clamp((D-.3f)/.7f,0,1);alpha=1-MathUtils.clamp((D-.8f)/.2f,0,1);}
                case PUPPETEER->{if(D<.12f){dy+=MathUtils.sin(D/.12f*MathUtils.PI)*h*.05f;}else{q=(D-.12f)/.88f;float fall=q<.55f?(q/.55f)*(q/.55f):1-MathUtils.sin((q-.55f)/.45f*MathUtils.PI)*.12f;
                    dy-=fall*h*.8f;rot+=q*28;bend+=q*.12f;}alpha=1-MathUtils.clamp((D-.85f)/.15f,0,1);}
            }}
            float ww=w*scaleW,hh=h*scaleH;
            float x=sx[i]-ww*.5f+dx,y=sy[i]+dy;
            // active player: a warm golden halo behind and a faint gilded rim on the sprite
            if(active[i]>0){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(gold.r,gold.g*.85f,gold.b*.6f,.22f*active[i]);
                batch.draw(dot,sx[i]-w*.75f,sy[i]+h*.05f,w*1.5f,h*1.05f);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            if(curse[i]>0&&doom[i]==0){float pulse=.6f+.4f*MathUtils.sin(time*2.2f+i);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(.9f,.08f,.06f,.18f*curse[i]*pulse);
                batch.draw(dot,sx[i]-w*.7f,sy[i]-h*.02f,w*1.4f,h*1.05f);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            if(doom[i]>0){float d=doom[i],pulse=.75f+.25f*MathUtils.sin(time*9);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(1,.1f,.06f,.35f*pulse*(1-d*.5f)*alpha);
                batch.draw(dot,sx[i]-w*.85f,sy[i]-h*.05f,w*1.7f,h*1.2f);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            if(dissolve>0){float g=MathUtils.sin(dissolve*MathUtils.PI),fy=dTop?1-front(dissolve):front(dissolve);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(Math.min(1,.25f+dR),Math.min(1,.3f+dG),Math.min(1,.3f+dB),.28f*g);
                batch.draw(dot,sx[i]-w*.8f,sy[i]+h*fy-h*.35f,w*1.6f,h*.8f);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            if(dissolve>0&&D<0)y+=dissolve*dissolve*h*.06f;
            if(glowA>0){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(1,.55f,.12f,glowA*alpha);batch.draw(dot,sx[i]+dx-w*.55f,sy[i]+dy+h*.45f,w*1.1f,h*.6f);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            float shade=state[i]==State.SCARED&&D<0?.82f:1,fade=1-doom[i]*.35f;batch.setColor(shade*fade*tr,shade*fade*tg*(1-doom[i]*.25f),shade*fade*tb*(1-doom[i]*.25f),alpha);
            float tint=batch.getPackedColor();bent(batch,r,x,y,ww,hh*breathe,bend*h,rot,tint);
            // cool moonlight catching the upper edge (window side)
            batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(.55f,.65f,1,.07f*(1-doom[i])*alpha);bent(batch,r,x+h*.004f,y+h*.006f,ww,hh*breathe,bend*h,rot,batch.getPackedColor());
            batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
            if(active[i]>0){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(gold.r,gold.g,gold.b,.10f*active[i]);bent(batch,r,x,y,ww,hh*breathe,bend*h,rot,batch.getPackedColor());batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            batch.setColor(Color.WHITE);wave=0;collapse=0;shear=0;}
        dissolve=-1;
        // the light (or ash, or embers) the characters turn into
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        for(int k=0;k<WISPS;k++){if(wl[k]<=0)continue;float a=wl[k]/wm[k],life=a>.85f?(1-a)/.15f:a,s=ws[k]*(1.4f-a*.4f);
            batch.setColor(wr[k],wg[k],wb[k],.75f*life);batch.draw(dot,wx[k]-s,wy[k]-s,s*2,s*2);
            batch.setColor(Math.min(1,wr[k]+.15f),wg[k]*.8f,wb[k]*.5f,.18f*life);batch.draw(dot,wx[k]-s*4,wy[k]-s*4,s*8,s*8);}
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);batch.setColor(Color.WHITE);
    }
    private float dissolve=-1,dR,dG,dB,wave,collapse,shear,lastDt;private boolean dTop;
    /** The loser's personal death animation, 0..1 (NaN = alive). */
    private final float[] death=new float[8];private static final float DEATH_SECONDS=3.2f;
    private final float[] quad=new float[20*STRIPS*3];private static final int STRIPS=10;
    /**
     * The sprite as a strip mesh: the base stays put, each strip is shifted by bend·f² (f = height fraction), so the
     * figure leans and flexes like a body instead of rotating as a rigid card; {@code rot} tilts the whole figure.
     * Strips also carry the dissolves, the ghost's ripple, the skeleton's collapse and the doll's unravelling.
     */
    private void bent(SpriteBatch batch,TextureRegion r,float x,float y,float w,float h,float bend,float rot,float color){
        float u=r.getU(),u2=r.getU2(),v=r.getV(),v2=r.getV2(),cx=x+w*.5f,cos=MathUtils.cosDeg(rot),sin=MathUtils.sinDeg(rot);int k=0;
        boolean fine=dissolve>0||collapse>0||shear>0||wave!=0;int strips=fine?STRIPS*3:STRIPS;Color.abgr8888ToColor(base,color);float fr=front(dissolve);
        for(int s=0;s<strips;s++){float f0=s/(float)strips,f1=(s+1f)/strips,o0=bend*f0*f0,o1=bend*f1*f1,y0=h*f0,y1=h*f1,tv0=MathUtils.lerp(v2,v,f0),tv1=MathUtils.lerp(v2,v,f1);
            float c0=color,c1=color;
            if(wave!=0){o0+=MathUtils.sin(f0*9-time*2.6f)*wave*f0;o1+=MathUtils.sin(f1*9-time*2.6f)*wave*f1;}
            if(collapse>0){float fc=(f0+f1)*.5f,delay=fc*.45f,c=MathUtils.clamp((collapse-delay)/(1-delay),0,1),drop=c*c*h*(.6f+fc*.8f),side=MathUtils.sin(s*12.9898f)*w*.35f*c;
                y0-=drop;y1-=drop;o0+=side;o1+=side;}
            if(shear>0){float dir=(s&1)==0?1:-1,sh2=dir*shear*shear*w*(.4f+((s*7)%5)*.15f);o0+=sh2;o1+=sh2;y0+=shear*h*.1f*f0;y1+=shear*h*.1f*f1;}
            if(dissolve>0){float g0=dTop?1-f0:f0,g1=dTop?1-f1:f1,a0=MathUtils.clamp((g0-fr)/.22f,0,1),a1=MathUtils.clamp((g1-fr)/.22f,0,1);if(a0<=0&&a1<=0)continue;
                // the edge shimmers sideways and glows as it comes apart
                o0+=MathUtils.sin(f0*19+time*7)*w*.04f*(1-a0);o1+=MathUtils.sin(f1*19+time*7)*w*.04f*(1-a1);
                c0=Color.toFloatBits(Math.min(1,base.r+(1-a0)*dR),Math.min(1,base.g+(1-a0)*dG),Math.min(1,base.b+(1-a0)*dB),base.a*a0);
                c1=Color.toFloatBits(Math.min(1,base.r+(1-a1)*dR),Math.min(1,base.g+(1-a1)*dG),Math.min(1,base.b+(1-a1)*dB),base.a*a1);}
            k=vertex(k,-w*.5f+o0,y0,cx,y,cos,sin,c0,u,tv0);k=vertex(k,-w*.5f+o1,y1,cx,y,cos,sin,c1,u,tv1);
            k=vertex(k,w*.5f+o1,y1,cx,y,cos,sin,c1,u2,tv1);k=vertex(k,w*.5f+o0,y0,cx,y,cos,sin,c0,u2,tv0);}
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
    @Override public void survive(int s){setState(s,State.IDLE);relief[s]=.8f;evaporate(s);}
    @Override public void eliminate(int s){setState(s,State.SCARED);if(Float.isNaN(death[s]))death[s]=-.2f;}
    @Override public void dispose(){for(Texture t:owned)t.dispose();owned.clear();}
}
