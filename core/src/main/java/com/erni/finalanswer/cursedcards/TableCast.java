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
        DRACULA("cursed_boxes/survivors/dracula.png",null,false),SKELETON("cursed_boxes/survivors/skeleton.png",null,false),
        GHOST("cursed_boxes/survivors/ghost.png",null,true),PUMPKIN("cursed_boxes/survivors/pumpkin.png",null,false),
        PLAGUE_DOCTOR("cursed_boxes/survivors/plague_doctor.png",null,false),ZOMBIE(null,"zombie",false),
        VOODOO(null,"voodoo",false),PUPPETEER(null,"puppeteer",false);
        public final String png,rig;public final boolean floats;
        Member(String png,String rig,boolean floats){this.png=png;this.rig=rig;this.floats=floats;}
    }
    public enum State {IDLE,NERVOUS,SCARED}

    private final TextureRegion[] sprites=new TextureRegion[Member.values().length];
    private final Array<Texture> owned=new Array<>();
    private final Texture dot;
    // per seat
    private final Member[] cast=new Member[8];
    private final State[] state=new State[8];private final float[] stateAge=new float[8],active=new float[8],relief=new float[8],phase=new float[8];
    private final float[] sx=new float[8],sy=new float[8],sh=new float[8];private final Integer[] order=new Integer[8];
    private int seats;private float time;
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
    public void seat(int count){seats=count;for(int i=0;i<8;i++){state[i]=State.IDLE;stateAge[i]=0;active[i]=0;relief[i]=0;}}
    public Member member(int seat){return cast[seat];}
    public State state(int seat){return state[seat];}
    public void setState(int seat,State s){if(state[seat]!=s){state[seat]=s;stateAge[seat]=0;}}

    /** Project each seat's anchor: sprite bottom sits at seat height behind the rim; height follows perspective. */
    public void layout(Array<SeatLayout.Seat> list,Camera camera,Rectangle view,int activeSeat,float dt){
        time+=dt;
        for(int i=0;i<seats;i++){var st=list.get(i);
            tmp.set(st.characterAnchor).add(0,-1.9f,0);top.set(tmp).add(0,height,0);
            camera.project(tmp,view.x,view.y,view.width,view.height);camera.project(top,view.x,view.y,view.width,view.height);
            sx[i]=tmp.x;sy[i]=tmp.y;sh[i]=top.y-tmp.y;
            active[i]=MathUtils.clamp(active[i]+(i==activeSeat?dt:-dt)*2.5f,0,1);stateAge[i]+=dt;relief[i]=Math.max(0,relief[i]-dt);
            if(state[i]==State.NERVOUS&&stateAge[i]>4.5f)setState(i,State.IDLE);}
        // farther (higher on screen) first
        java.util.Arrays.sort(order,0,8,(a,b)->a>=seats?1:b>=seats?-1:Float.compare(sy[b],sy[a]));
    }
    public void draw(SpriteBatch batch){
        for(int n=0;n<seats;n++){int i=order[n];TextureRegion r=sprites[cast[i].ordinal()];if(r==null)continue;
            float h=sh[i],w=h*r.getRegionWidth()/(float)r.getRegionHeight(),t=time+phase[i],age=stateAge[i];
            float breathe=1+.012f*MathUtils.sin(t*1.9f),sway=MathUtils.sin(t*.7f)*1.1f,dx=0,dy=cast[i].floats?MathUtils.sin(t*1.3f)*h*.018f:0,rot=sway;
            switch(state[i]){
                case NERVOUS->{float k=Math.min(1,age*3);dx=MathUtils.sin(t*31)*h*.004f*k;rot+=MathUtils.sin(t*2.3f)*2.4f*k+MathUtils.sin(t*17)*.6f*k;}
                case SCARED->{float jolt=age<.35f?MathUtils.sin(age/.35f*MathUtils.PI):0;dy+=jolt*h*.06f;breathe*=1+jolt*.04f;
                    dx=MathUtils.sin(t*42)*h*.007f;rot+=MathUtils.sin(t*29)*1.6f-3*Math.min(1,age*2);}
                default->{}}
            if(relief[i]>0)dy+=MathUtils.sin((1-relief[i])*MathUtils.PI)*h*.035f;
            float x=sx[i]-w*.5f+dx,y=sy[i]+dy,ow=w*.5f;
            // active player: a warm golden halo behind and a faint gilded rim on the sprite
            if(active[i]>0){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(gold.r,gold.g*.85f,gold.b*.6f,.22f*active[i]);
                batch.draw(dot,sx[i]-w*.75f,sy[i]+h*.05f,w*1.5f,h*1.05f);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            float shade=state[i]==State.SCARED?.82f:1;batch.setColor(shade,shade,shade,1);
            batch.draw(r,x,y,ow,0,w,h*breathe,1,1,rot);
            if(active[i]>0){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(gold.r,gold.g,gold.b,.10f*active[i]);batch.draw(r,x,y,ow,0,w,h*breathe,1,1,rot);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            batch.setColor(Color.WHITE);}
    }
    /** Screen rectangles (bottom-left x,y,w,h) of seated sprites, for overlap checks. */
    public Rectangle bounds(int seat,Rectangle out){TextureRegion r=sprites[cast[seat].ordinal()];float h=sh[seat],w=r==null?0:h*r.getRegionWidth()/(float)r.getRegionHeight();return out.set(sx[seat]-w*.5f,sy[seat],w,h);}
    public boolean hasArt(int seat){return sprites[cast[seat].ordinal()]!=null;}

    // ---- CharacterActions ----
    @Override public void idle(int s){setState(s,State.IDLE);}
    @Override public void lookAtCards(int s){if(state[s]==State.IDLE)stateAge[s]=0;}
    @Override public void drawCard(int s){}
    @Override public void receiveCard(int s){}
    @Override public void discardPair(int s){relief[s]=.6f;}
    @Override public void nervous(int s){if(state[s]!=State.SCARED)setState(s,State.NERVOUS);}
    @Override public void survive(int s){setState(s,State.IDLE);relief[s]=.8f;}
    @Override public void eliminate(int s){setState(s,State.SCARED);}
    @Override public void dispose(){for(Texture t:owned)t.dispose();owned.clear();}
}
