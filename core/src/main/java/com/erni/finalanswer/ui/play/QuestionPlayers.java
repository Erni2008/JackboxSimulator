package com.erni.finalanswer.ui.play;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.math.Matrix4;
import com.badlogic.gdx.scenes.scene2d.Actor;
import com.badlogic.gdx.scenes.scene2d.Touchable;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.ui.UiFonts;
import com.erni.finalanswer.ui.lobby.cages.*;
import com.google.gson.JsonObject;
import java.util.*;

/** Cage-free production rigs. Textures/profiles remain owned by the existing room asset owner. */
public final class QuestionPlayers extends Actor implements Disposable {
    /** Question-screen-only rate: lobby timings and held poses remain unchanged. */
    public static float answeringAnimationSpeed=1.5f;
    public static final float THINKING_SCALE=1f/1.35f, GROW_SECONDS=.30f;
    private static final class Entry {
        final QuestionPlayerStates.Player player;final CageCharacter character;final CageCharacterPresentation.Profile profile;
        final float phase,height,floor;final GlyphLayout name=new GlyphLayout();
        String nickname="";int counter=-1;float counterPop=9,gainAge=9,gainShown,flashAge=9;int gain;float time=8,nameScale=1,nameWidth,size=THINKING_SCALE,sizeFrom=THINKING_SCALE,sizeTarget=THINKING_SCALE,sizeAge=GROW_SECONDS,shakeTime,shakeEnvelope;boolean showingCorrect;
        Entry(QuestionPlayerStates.Player player,CageLobby source){
            this.player=player;character=source.createCharacter(player.characterId);profile=source.presentation(player.characterId);
            phase=(player.id.hashCode()&0xffff)*.001f;
            height=switch(player.characterId){case "skeleton"->120;case "ghost"->152;case "plague_doctor"->194;case "voodoo"->153;default->160;};
            floor=switch(player.characterId){case "skeleton","ghost"->69;case "puppeteer"->68;case "pumpkin"->67;default->63;};
            // Evaluate the existing entrance once offscreen; round playback starts in its existing idle.
            for(int i=1;i<=240;i++)character.update(1f/30,i/30f,phase,false);
        }
    }
    private final CageLobby source;
    private final QuestionPlayerStates states=new QuestionPlayerStates();
    private final ArrayList<Entry> entries=new ArrayList<>(8);
    private final BitmapFont font=UiFonts.question(26);
    private final Matrix4 saved=new Matrix4(),local=new Matrix4();
    private final Color color=new Color(),fontSaved=new Color();
    private final CageCharacterPresentation presentation=new CageCharacterPresentation();
    private JsonObject previous;
    private final TextureRegion uiPixel;
    private boolean reduced,choicesVisible;
    private boolean counting;private final Color neon=new Color(.95f,.18f,.32f,1);private final GlyphLayout counterText=new GlyphLayout();
    private Runnable counterSound;
    private BitmapFont counterFont;private com.badlogic.gdx.graphics.Texture pillTexture;private NinePatch pill;
    /** Clean display digits and a rounded pill for the counters, created on first use (classic questions never pay for them). */
    private void counterAssets(){
        if(counterFont!=null)return;
        var fh=com.badlogic.gdx.Gdx.files.internal("ui/fonts/RussoOne-Regular.ttf");
        if(fh.exists()){var g=new com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator(fh);
            try{var p=new com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator.FreeTypeFontParameter();p.size=34;p.characters="0123456789+";
                p.minFilter=com.badlogic.gdx.graphics.Texture.TextureFilter.Linear;p.magFilter=com.badlogic.gdx.graphics.Texture.TextureFilter.Linear;counterFont=g.generateFont(p);}finally{g.dispose();}}
        else counterFont=UiFonts.body(30);
        int n=64,r=18;var pm=new com.badlogic.gdx.graphics.Pixmap(n,n,com.badlogic.gdx.graphics.Pixmap.Format.RGBA8888);pm.setBlending(com.badlogic.gdx.graphics.Pixmap.Blending.None);
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float dx=Math.max(0,Math.max(r-x-.5f,x+.5f-(n-r))),dy=Math.max(0,Math.max(r-y-.5f,y+.5f-(n-r)));float d=(float)Math.hypot(dx,dy)-(r-1);
            pm.drawPixel(x,y,Color.rgba8888(1,1,1,MathUtils.clamp(.5f-d,0,1)));}
        pillTexture=new com.badlogic.gdx.graphics.Texture(pm);pillTexture.setFilter(com.badlogic.gdx.graphics.Texture.TextureFilter.Linear,com.badlogic.gdx.graphics.Texture.TextureFilter.Linear);pm.dispose();
        pill=new NinePatch(pillTexture,r,r,r,r);
    }
    /**
     * THINK OR DIE inside the match: each character shows how many answers it sent where the classic checkmark sits.
     * {@code null} turns the counters off (classic questions). Only the changed digit animates; nothing is rebuilt.
     */
    public void counters(Map<String,Integer> values){
        counting=values!=null;if(values==null){for(Entry e:entries){e.counter=-1;}return;}
        boolean bumped=false;
        for(Entry e:entries){Integer v=values.get(e.player.id);int n=v==null?0:v;
            if(e.counter>=0&&n>e.counter){e.counterPop=0;bumped=true;}e.counter=n;}
        if(bumped&&counterSound!=null)counterSound.run();
    }
    /** A short confirmation sound for counter bumps (throttled by the caller). */
    public void counterSound(Runnable sound){counterSound=sound;}
    /** Souls earned: a "+N" rolls up next to the character. */
    public void gain(String id,int amount){for(Entry e:entries)if(e.player.id.equals(id)){e.gain=amount;e.gainAge=0;e.gainShown=0;}}
    /** A neon burst around the character (resurrection). */
    public void flash(String id){for(Entry e:entries)if(e.player.id.equals(id))e.flashAge=0;}
    /** Driven by the real first answer reveal, not by question typing or timer initialization. */
    public void answersVisible(boolean visible){choicesVisible=visible;}
    public boolean shaking(String id){for(Entry e:entries)if(e.player.id.equals(id))return choicesVisible&&e.player.thinking&&!reduced;return false;}
    public QuestionPlayers(CageLobby source,Texture pixel){uiPixel=new TextureRegion(Objects.requireNonNull(pixel));this.source=Objects.requireNonNull(source);setTouchable(Touchable.disabled);setName("questionPlayers");}
    public QuestionPlayerStates states(){return states;}
    public float animationTime(String id){for(Entry e:entries)if(e.player.id.equals(id))return e.time;return -1;}
    public float presentationScale(String id){for(Entry e:entries)if(e.player.id.equals(id))return e.size;return -1;}
    public CageCharacter character(String id){for(Entry e:entries)if(e.player.id.equals(id))return e.character;return null;}
    public void synchronize(JsonObject snapshot,long serverNow){
        if(snapshot!=previous){previous=snapshot;states.synchronize(snapshot,serverNow);
            entries.removeIf(e->!states.players().contains(e.player));
            for(var player:states.players()){boolean exists=false;for(Entry e:entries)if(e.player==player){exists=true;break;}if(!exists)entries.add(new Entry(player,source));}
        }else states.update(serverNow);
        for(Entry e:entries){
            e.showingCorrect=e.player.correct;
            float target=e.player.submitted?1:THINKING_SCALE;
            if(target!=e.sizeTarget){e.sizeFrom=e.size;e.sizeTarget=target;e.sizeAge=0;}
        }
    }
    public void advance(float delta,boolean reduced){
        this.reduced=reduced;
        if(!Float.isFinite(delta)||delta<=0)return;
        for(Entry e:entries){
            e.sizeAge+=delta;e.counterPop+=delta;e.gainAge+=delta;e.flashAge+=delta;
            if(e.gain>0)e.gainShown=Math.min(e.gain,e.gain*Math.min(1,e.gainAge/.9f));
            float growth=reduced?1:com.badlogic.gdx.math.Interpolation.smooth.apply(Math.min(1,e.sizeAge/GROW_SECONDS));
            e.size=e.sizeFrom+(e.sizeTarget-e.sizeFrom)*growth;
            boolean nervous=choicesVisible&&e.player.thinking&&!reduced;
            if(nervous)e.shakeTime+=delta;
            e.shakeEnvelope=states.activeRound()?MathUtils.clamp(e.shakeEnvelope+(nervous?1:-1)*delta/.14f,0,1):0;
            if(e.player.playing||e.player.ghost){float step=delta*answeringAnimationSpeed;e.time+=step;e.character.update(step,e.time,e.phase,reduced);}
        }
    }
    @Override public void draw(Batch batch,float alpha){
        if(entries.isEmpty())return;
        saved.set(batch.getTransformMatrix());color.set(batch.getColor());
        float cell=Math.min(240,(getWidth()-120)/entries.size()),left=getX()+(getWidth()-cell*entries.size())/2;
        float oldScaleX=font.getData().scaleX,oldScaleY=font.getData().scaleY;fontSaved.set(font.getColor());
        int lead=0;if(counting)for(Entry e:entries)lead=Math.max(lead,e.counter);int leaders=0;for(Entry e:entries)if(lead>0&&e.counter==lead)leaders++;
        try{for(int i=0;i<entries.size();i++){
            Entry e=entries.get(i);float center=left+(i+.5f)*cell;
            boolean card=counting&&e.counter>=0;float cardW=Math.min(178,cell-16);
            if(card){drawHanging(batch,e,center,cell,leaders==1&&e.counter==lead,alpha,i);}else{
            float scale=Math.min(135/e.height,(cell-24)/150)*e.size;
            float shakeX=!reduced?MathUtils.sin(e.shakeTime*31+e.phase)*.65f*e.shakeEnvelope:0;
            float shakeY=!reduced?MathUtils.sin(e.shakeTime*27+e.phase*1.7f)*.28f*e.shakeEnvelope:0;
            local.set(saved).translate(center+shakeX,getY()+52+shakeY,0).scale(scale,scale,1).translate(-174,-e.floor,0);
            batch.setTransformMatrix(local);
            if(e.player.ghost)batch.setColor(.63f,.78f,.88f,color.a);
            presentation.draw(batch,e.character,e.profile,alpha*(e.player.ghost?(card?.38f:.52f):1),e.time);
            batch.setColor(color);
            batch.setTransformMatrix(saved);
            if(!e.nickname.equals(e.player.nickname)){
                e.nickname=e.player.nickname;font.getData().setScale(1);e.name.setText(font,e.nickname);
                e.nameWidth=e.name.width;
            }
            e.nameScale=Math.min(1,(cell-16)/Math.max(1,e.nameWidth));
            font.getData().setScale(e.nameScale);e.name.setText(font,e.nickname);
            float x=center-e.name.width/2,y=getY()+43;
            float na=alpha*(card&&e.player.ghost?.45f:1);font.setColor(.015f,.008f,.008f,na*.9f);font.draw(batch,e.nickname,x+1.4f,y-1.4f);
            font.setColor(com.erni.finalanswer.ui.PlayerColors.light(e.player.characterId));font.getColor().a=na;
            font.draw(batch,e.nickname,x,y);
            {font.getData().setScale(Math.min(.48f,(cell-16)/105f));
            String status=e.player.ghost?"GHOST":!e.player.online?"OFFLINE":"ALIVE";
            font.setColor(e.player.ghost?.60f:.77f,e.player.ghost?.80f:.86f,e.player.ghost?.93f:.66f,alpha);
            e.name.setText(font,status);font.draw(batch,status,center-e.name.width/2,getY()+18);}}
            if(!card&&e.showingCorrect){drawCorrect(batch,center+cell*.30f,getY()+142,alpha);batch.setColor(color);}
            if(e.flashAge<1.4f){float k=1-e.flashAge/1.4f;batch.setColor(.75f,.35f,1f,.55f*k*alpha);
                float r=60+90*e.flashAge;batch.draw(uiPixel,center-r,getY()+80-1.5f,r*2,3);batch.draw(uiPixel,center-1.5f,getY()+80-r*.7f,3,r*1.4f);batch.setColor(color);}
            if(e.gain>0&&e.gainAge<4.5f){float k=e.gainAge<.25f?e.gainAge/.25f:e.gainAge>3.6f?Math.max(0,(4.5f-e.gainAge)/.9f):1;
                String t="+"+Math.round(e.gainShown);font.getData().setScale(Math.min(.95f,(cell-16)/110f));counterText.setText(font,t);
                float gy=getY()+170+Math.min(1,e.gainAge/.4f)*14;
                if(counting){counterAssets();batch.setColor(.05f,.02f,.02f,.88f*k*alpha);pillAt(batch,center-counterText.width/2-14,gy-counterText.height-10,counterText.width+28,counterText.height+20);batch.setColor(color);}
                font.setColor(0,0,0,.8f*k*alpha);font.draw(batch,t,center-counterText.width/2+2,gy-2);
                font.setColor(1f,.86f,.30f,k*alpha);font.draw(batch,t,center-counterText.width/2,gy);}
        }}finally{batch.setTransformMatrix(saved);batch.setColor(color);font.getData().setScale(oldScaleX,oldScaleY);font.setColor(fontSaved);}
    }
    private static final Color RED=new Color(1f,.20f,.24f,1),GOLD=new Color(1f,.76f,.22f,1),PURPLE=new Color(.70f,.32f,1f,1),GREEN=new Color(.22f,.78f,.30f,1);
    /** THINK OR DIE card behind a character: dark plate, glowing rim (gold for the leader, violet for ghosts), name bar. */
    private void pillAt(Batch b,float x,float y,float w,float h){float k=Math.min(1,Math.min(w,h)/36f);if(k<1){pill.scale(k,k);pill.draw(b,x,y,w,h);pill.scale(1/k,1/k);}else pill.draw(b,x,y,w,h);}
    private NeonFrame frame;
    /** THINK OR DIE card behind a character: steel and neon frame (gold leader, violet ghost), halo, name plaque. */
    private void drawCard(Batch batch,Entry e,float cx,float w,boolean leader,float alpha){
        counterAssets();if(frame==null)frame=new NeonFrame();
        Color rim=e.player.ghost?PURPLE:leader?GOLD:RED;float y=getY()+4,h=172,x=cx-w/2;
        float pop=reduced?0:Math.max(0,1-e.counterPop/.45f);
        frame.draw(batch,x,y,w,h,rim,CARD_FILL,5,alpha*(1+.0f*pop));
        frame.halo(batch,cx,y+134,40,rim,(.55f+.45f*pop)*alpha);
        frame.draw(batch,x+12,y+64,w-24,38,new Color(.75f,.72f,.70f,1),PLAQUE,3,alpha);
        batch.setColor(color);
    }
    private static final Color CARD_FILL=new Color(.08f,.03f,.035f,.95f),PLAQUE=new Color(.05f,.02f,.02f,.97f);
    private void drawCardCounter(Batch batch,Entry e,float cx,float cy,float alpha){
        float pop=reduced?0:Math.max(0,1-e.counterPop/.35f),ease=com.badlogic.gdx.math.Interpolation.pow2Out.apply(pop);
        String t=Integer.toString(e.counter);counterFont.getData().setScale(1.05f*(1+.35f*ease));counterText.setText(counterFont,t);
        float x=cx-counterText.width/2,y=cy+counterText.height/2;
        counterFont.setColor(0,0,0,.8f*alpha);counterFont.draw(batch,t,x+2,y-2);
        counterFont.setColor(1f,.82f-.3f*pop,.55f-.3f*pop,alpha);counterFont.draw(batch,t,x,y);
        counterFont.getData().setScale(1);
    }
    private final com.badlogic.gdx.math.Rectangle clipArea=new com.badlogic.gdx.math.Rectangle(),clip=new com.badlogic.gdx.math.Rectangle();
    private static final Color PLATE_FILL=new Color(.06f,.03f,.03f,.97f);
    /** Artwork frames (chains, ring, name plate, counter plate). Geometry per frame, fractions of the image, y from the top:
     *  hole centre y, hole radius (of width), name plate top/bottom, counter plate top/bottom. */
    private static final String[] FRAMES={"tophat","ghost","copper","iron","gold"};
    private static final float[][] GEO={{.432f,.200f,.668f,.755f,.778f,.878f},{.445f,.179f,.640f,.722f,.750f,.834f},{.430f,.198f,.640f,.744f,.756f,.836f},
        {.427f,.189f,.626f,.722f,.748f,.844f},{.431f,.194f,.632f,.730f,.752f,.838f}};
    private final Texture[] frameTex=new Texture[FRAMES.length];private boolean framesLoaded;
    private Texture frameTex(int k){
        if(!framesLoaded){framesLoaded=true;for(int i=0;i<FRAMES.length;i++){var f=com.badlogic.gdx.Gdx.files.internal("think_or_die/frame_"+FRAMES[i]+".png");
            if(f.exists()){frameTex[i]=new Texture(f,true);frameTex[i].setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);}}}
        return frameTex[k];
    }
    /** THINK OR DIE: the player's portrait inside a hanging artwork frame, nickname and answer count in its plates.
     *  Ghosts get the violet frame, the leader the gold one, everyone else one of three frames by seat. */
    private void drawHanging(Batch batch,Entry e,float cx,float cell,boolean leader,float alpha,int seat){
        counterAssets();
        int k=e.player.ghost?1:leader?4:new int[]{0,2,3}[seat%3];Texture ft=frameTex(k);if(ft==null)return;float[] g=GEO[k];
        float a=alpha*(e.player.ghost?.75f:1);
        float W=Math.min(196,cell-14),H=W*ft.getHeight()/ft.getWidth(),top=getY()+178,x0=cx-W/2;
        float hy=top-H*g[0],hr=W*g[1],cr=hr*1.02f;
        float pop=reduced?0:Math.max(0,1-e.counterPop/.45f);
        // portrait clipped to the hole, behind the frame
        batch.setColor(.05f,.02f,.03f,a);batch.draw(uiPixel,cx-cr,hy-cr,cr*2,cr*2);batch.setColor(color);
        float scale=(hr*2.6f)/e.height*e.size;
        batch.flush();clipArea.set(cx-cr,hy-cr,2*cr,2*cr);
        boolean pushed=false;if(getStage()!=null){com.badlogic.gdx.scenes.scene2d.utils.ScissorStack.calculateScissors(getStage().getCamera(),batch.getTransformMatrix(),clipArea,clip);pushed=com.badlogic.gdx.scenes.scene2d.utils.ScissorStack.pushScissors(clip);}
        local.set(saved).translate(cx,hy-hr*1.55f,0).scale(scale,scale,1).translate(-174,-e.floor,0);batch.setTransformMatrix(local);
        if(e.player.ghost)batch.setColor(.78f,.66f,1f,color.a);
        presentation.draw(batch,e.character,e.profile,a*(e.player.ghost?.55f:1),e.time);batch.setColor(color);batch.setTransformMatrix(saved);
        batch.flush();if(pushed)com.badlogic.gdx.scenes.scene2d.utils.ScissorStack.popScissors();
        batch.setColor(1,1,1,a);batch.draw(ft,x0,top-H,W,H);
        if(pop>0){batch.setBlendFunction(com.badlogic.gdx.graphics.GL20.GL_SRC_ALPHA,com.badlogic.gdx.graphics.GL20.GL_ONE);batch.setColor(1,1,1,.35f*pop*a);batch.draw(ft,x0,top-H,W,H);
            batch.setBlendFunction(com.badlogic.gdx.graphics.GL20.GL_SRC_ALPHA,com.badlogic.gdx.graphics.GL20.GL_ONE_MINUS_SRC_ALPHA);}
        batch.setColor(color);
        Color acc=new Color(com.erni.finalanswer.ui.PlayerColors.light(e.player.characterId));if(e.player.ghost)acc.set(.85f,.62f,1f,1);else if(leader)acc.set(GOLD);
        // nickname in the name plate
        if(!e.nickname.equals(e.player.nickname)){e.nickname=e.player.nickname;font.getData().setScale(1);e.name.setText(font,e.nickname);e.nameWidth=e.name.width;}
        float nTop=top-H*g[2],nBot=top-H*g[3],pw=W*.56f;
        e.nameScale=Math.min(.66f,Math.min(pw/Math.max(1,e.nameWidth),(nTop-nBot)*.62f/Math.max(1,font.getCapHeight()*1f)));font.getData().setScale(e.nameScale);e.name.setText(font,e.nickname);
        float ny=(nTop+nBot)/2+e.name.height/2;
        font.setColor(0,0,0,.9f*a);font.draw(batch,e.nickname,cx-e.name.width/2+1.2f,ny-1.2f);
        font.setColor(acc.r,acc.g,acc.b,a);font.draw(batch,e.nickname,cx-e.name.width/2,ny);
        // answer count in the lower plate
        float cTop=top-H*g[4],cBot=top-H*g[5];
        float ease=com.badlogic.gdx.math.Interpolation.pow2Out.apply(reduced?0:Math.max(0,1-e.counterPop/.35f));
        String t=Integer.toString(e.counter);counterFont.getData().setScale(1);float base=(cTop-cBot)*.58f/Math.max(1,counterFont.getCapHeight());
        counterFont.getData().setScale(base*(1+.25f*ease));counterText.setText(counterFont,t);
        float ty=(cTop+cBot)/2+counterText.height/2;
        counterFont.setColor(0,0,0,.8f*a);counterFont.draw(batch,t,cx-counterText.width/2+1.5f,ty-1.5f);
        counterFont.setColor(acc.r,acc.g,acc.b,a);counterFont.draw(batch,t,cx-counterText.width/2,ty);
        counterFont.getData().setScale(1);batch.setColor(color);
    }
    /** THINK OR DIE answer count: a solid round badge by the character's shoulder (gold for the leader), pops on every answer. */
    private void drawBadge(Batch batch,Entry e,float cx,float cy,boolean leader,float alpha){
        counterAssets();float pop=reduced?0:Math.max(0,1-e.counterPop/.35f),ease=com.badlogic.gdx.math.Interpolation.pow2Out.apply(pop);
        String t=Integer.toString(e.counter);counterFont.getData().setScale(.78f*(1+.25f*ease));counterText.setText(counterFont,t);
        float h=48*(1+.12f*ease),w=Math.max(h,counterText.width+26);Color c=e.player.ghost?PURPLE:leader?GOLD:RED;
        batch.setColor(0,0,0,.45f*alpha);pillAt(batch,cx-w/2+2,cy-h/2-4,w,h);
        batch.setColor(1,1,1,alpha);pillAt(batch,cx-w/2-3,cy-h/2-3,w+6,h+6);
        batch.setColor(c.r,c.g,c.b,alpha);pillAt(batch,cx-w/2,cy-h/2,w,h);
        counterFont.setColor(leader&&!e.player.ghost?.18f:1f,leader&&!e.player.ghost?.10f:1f,leader&&!e.player.ghost?.02f:1f,alpha);
        counterFont.draw(batch,t,cx-counterText.width/2,cy+counterText.height/2);counterFont.getData().setScale(1);
    }
    private void drawStatusPill(Batch batch,Entry e,float cx,float cy,float alpha){
        String st=e.player.ghost?"GHOST":!e.player.online?"OFFLINE":"ALIVE";Color c=e.player.ghost?PURPLE:!e.player.online?new Color(.45f,.45f,.5f,1):GREEN;
        font.getData().setScale(.42f);counterText.setText(font,st);float w=counterText.width+30,h=24;
        batch.setColor(c.r,c.g,c.b,alpha);pillAt(batch,cx-w/2,cy-h/2,w,h);
        batch.setColor(c.r*.35f,c.g*.35f,c.b*.35f,alpha);pillAt(batch,cx-w/2+2,cy-h/2+2,w-4,h-4);
        font.setColor(.95f,1f,.95f,alpha);font.draw(batch,st,cx-counterText.width/2,cy+counterText.height/2);
    }
    /** The neon answer counter: a dark pill, the digit pops up briefly with a soft glow on every new answer. */
    private void drawCounter(Batch batch,Entry e,float x,float y,float alpha){
        counterAssets();
        float pop=reduced?0:Math.max(0,1-e.counterPop/.35f),ease=com.badlogic.gdx.math.Interpolation.pow2Out.apply(pop),scale=.82f*(1+.35f*ease);
        String t=Integer.toString(e.counter);counterFont.getData().setScale(scale);counterText.setText(counterFont,t);
        float h=40,w=Math.max(46,counterText.width+28);
        if(pop>0){batch.setColor(neon.r,neon.g,neon.b,.35f*pop*alpha);float g=12*ease;pill.draw(batch,x-w/2-g,y-h/2-g,w+2*g,h+2*g);}
        batch.setColor(neon.r,neon.g,neon.b,(.75f+.25f*pop)*alpha);pill.draw(batch,x-w/2,y-h/2,w,h);
        batch.setColor(.035f,.015f,.07f,.94f*alpha);pill.draw(batch,x-w/2+2.5f,y-h/2+2.5f,w-5,h-5);
        counterFont.setColor(1,.55f+.45f*(1-pop),.62f+.38f*(1-pop),alpha);counterFont.draw(batch,t,x-counterText.width/2,y+counterText.height/2);
        counterFont.getData().setScale(1);
    }
    private void drawCorrect(Batch batch,float x,float y,float alpha){
        float size=1,first=1,second=1;
        // Ink-dark outline plus two mint strokes, shown immediately. No added image or glow.
        for(int pass=0;pass<2;pass++){
            if(pass==0)batch.setColor(.015f,.04f,.025f,alpha);
            else batch.setColor(.65f,.96f,.70f,alpha);
            float width=(pass==0?7:4.2f)*size;
            line(batch,x-13*size,y+7*size,x+(-13+9*first)*size,y+(7-10*first)*size,width);
            if(second>0)line(batch,x-4*size,y-3*size,x+(-4+21*second)*size,y+(-3+25*second)*size,width);
        }
    }
    private void line(Batch batch,float ax,float ay,float bx,float by,float width){
        float dx=bx-ax,dy=by-ay,length=(float)Math.sqrt(dx*dx+dy*dy);if(length<=0)return;
        batch.draw(uiPixel,ax+dy/length*width/2,ay-dx/length*width/2,0,0,length,width,1,1,MathUtils.atan2(dy,dx)*MathUtils.radiansToDegrees);
    }
    @Override public void dispose(){entries.clear();font.dispose();if(counterFont!=null)counterFont.dispose();if(pillTexture!=null)pillTexture.dispose();if(frame!=null)frame.dispose();for(Texture t:frameTex)if(t!=null)t.dispose();}
}
