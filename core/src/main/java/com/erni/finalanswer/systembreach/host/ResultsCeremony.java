package com.erni.finalanswer.systembreach.host;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.MathUtils;
import java.util.ArrayList;
import java.util.List;
import static com.erni.finalanswer.systembreach.host.SystemBreachLayout.*;

/**
 * The end of a SYSTEM BREACH match on the host screen, played over the hall once the timer runs out:
 * <ol><li>OPERATION COMPLETE slams in;</li>
 * <li>the winners are introduced one by one — third, second, then first — each dropping onto a lit pedestal;</li>
 * <li>the hall turns red, the last living player is put on trial, struck by lightning and floats away as a ghost
 * (the room server really turns them into a ghost at the same moment).</li></ol>
 * It reads the final ranking once, so late snapshots cannot reshuffle the stage.
 */
final class ResultsCeremony {
    private static final float OPEN=1.7f,REVEAL=2.3f,HOLD=2.6f,TRIAL=3.4f;
    private static final Color GHOST=new Color(.55f,.85f,1f,1),BLOOD=new Color(.75f,.04f,.03f,1),tmp=new Color(),tmp2=new Color();
    private final List<SystemBreachHostViewModel.Slot> winners=new ArrayList<>();private SystemBreachHostViewModel.Slot loser;
    private float t=-1;private long boltSeed;

    boolean active(){return t>=0;}
    private final java.util.Set<String> fired=new java.util.HashSet<>();
    /** Fires each ceremony cue once as its moment passes. */
    void sounds(SbSounds s){
        if(t<0)return;
        for(int i=0;i<winners.size();i++){float at=revealAt(i);once(s,"roll"+i,at-1.9f,i==winners.size()-1?"drumroll":null);once(s,"rev"+i,at+.25f,"reveal");}
        if(!winners.isEmpty())once(s,"fanfare",revealAt(0)+.5f,"fanfare");
        if(loser!=null){float we=winnersEnd();once(s,"sentence",we+.2f,"sentence");once(s,"charge",we+TRIAL-1.3f,"charge");once(s,"strike",we+TRIAL-.02f,"strike");once(s,"shatter",we+TRIAL+1.05f,"shatter");once(s,"soul",we+TRIAL+1.2f,"soul");once(s,"ghost",we+TRIAL+1.0f,"ghost");}
    }
    private void once(SbSounds s,String key,float at,String cue){if(cue!=null&&t>=at&&t<at+1.5f&&fired.add(key))s.play(cue);}
    void reset(){t=-1;winners.clear();loser=null;fired.clear();}
    /** Starts once, from the final ranking. */
    void update(SystemBreachHostViewModel model,float dt){
        if(!model.results()){reset();return;}
        if(t<0){var r=model.ranking();if(r.isEmpty())return;t=0;if(Boolean.getBoolean("sb.execution"))t=-.001f;winners.clear();
            int n=r.size(),k=n>=2?Math.min(3,n-1):1;for(int i=0;i<k;i++)winners.add(r.get(i));loser=n>=2?r.get(n-1):null;if(t<0){t=winnersEnd()-.5f;for(int i=0;i<winners.size();i++){fired.add("roll"+i);fired.add("rev"+i);}fired.add("fanfare");}}
        else t+=dt;
    }
    private float winnersEnd(){return OPEN+winners.size()*REVEAL+HOLD;}
    private static float clamp(float v){return Math.max(0,Math.min(1,v));}
    private static float outBack(float x){x=clamp(x);float c=1.9f;return 1+(c+1)*(float)Math.pow(x-1,3)+c*(float)Math.pow(x-1,2);}
    private static float outCubic(float x){x=clamp(x);return 1-(1-x)*(1-x)*(1-x);}
    /** Podium order: 1st in the middle, 2nd left, 3rd right. */
    private static float podX(int rank){return rank==1?W/2f:rank==2?W/2f-430:W/2f+430;}
    private static float podH(int rank){return rank==1?210:rank==2?150:105;}
    private static Color medal(int rank){return rank==1?SbPaint.GOLD:rank==2?SbPaint.SILVER:SbPaint.BRONZE;}
    private static final float BASE=150;
    /** Reveal time of the i-th winner: last winner first, the champion last. */
    private float revealAt(int index){return OPEN+(winners.size()-1-index)*REVEAL;}

    void draw(ShapeRenderer shapes,SpriteBatch batch,SbPaint paint,SystemBreachHostAssets assets,PodiumCharacters characters,boolean ru,float time,com.badlogic.gdx.graphics.Camera cam){
        if(t<0)return;float we=winnersEnd(),trial=loser==null?0:clamp((t-we)/.6f),winFade=1-trial;
        float dim=Math.min(.95f,t/.7f*.95f),ghostK=loser==null?0:clamp((t-we-TRIAL-2.0f)/1.4f);
        Gdx.gl.glEnable(GL20.GL_BLEND);Gdx.gl.glBlendFunc(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        shapes.begin(ShapeRenderer.ShapeType.Filled);
        shapes.setColor(.006f,.006f,.01f,Math.min(1,dim*1.05f));shapes.rect(0,0,W,H);
        if(trial>0){shapes.setColor(BLOOD.r*.22f,0,0,.6f*trial*(1-ghostK));shapes.rect(0,0,W,H);shapes.setColor(.02f,.08f,.16f,.6f*ghostK);shapes.rect(0,0,W,H);}
        // pedestals
        if(winFade>0)for(int i=0;i<winners.size();i++){var s=winners.get(i);int rank=i+1;float k=outCubic((t-revealAt(i))/.45f);if(k<=0)continue;float x=podX(rank),h=podH(rank)*k,w=300,a=winFade;var c=medal(rank);
            paint.plate(x-w/2,BASE,w,h,18,tmp.set(c.r*.32f,c.g*.32f,c.b*.32f,.97f*a),tmp2.set(.03f,.03f,.035f,.98f*a));
            paint.outline(x-w/2+6,BASE+6,w-12,Math.max(0,h-12),14,2.5f,tmp.set(c.r,c.g,c.b,a));
            shapes.setColor(c.r,c.g,c.b,.9f*a);shapes.rect(x-w/2+20,BASE+h-5,w-40,3);
            if(rank==1&&k>=1)paint.crown(x,BASE+h+430,90,tmp.set(SbPaint.GOLD.r,SbPaint.GOLD.g,SbPaint.GOLD.b,a*outBack((t-revealAt(i)-.5f)/.5f)));}
        shapes.end();

        batch.begin();
        // light: gold beams over the winners, a red spotlight on the trial
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        if(winFade>0)for(int i=0;i<winners.size();i++){int rank=i+1;float k=clamp((t-revealAt(i))/.3f),flash=Math.max(0,1-(t-revealAt(i))/.6f);if(k<=0)continue;var c=medal(rank);float x=podX(rank);
            float pulse=.85f+.15f*MathUtils.sin(time*2.2f+i);batch.setColor(c.r,c.g,c.b,(.22f*pulse+.5f*flash)*winFade*k);batch.draw(assets.glow,x-260,BASE-60,520,podH(rank)+700);
            batch.setColor(1,1,1,.12f*winFade*k);batch.draw(assets.glow,x-90,BASE+podH(rank)-20,180,900);
            // sparks rising from the champion's pedestal
            if(rank==1)for(int p=0;p<26;p++){float life=((time*.6f+p*.137f)%1f),px=x+MathUtils.sin(p*12.9f)*150+MathUtils.sin(time+p)*10,py=BASE+podH(1)+life*620;batch.setColor(1,.8f,.35f,(1-life)*.8f*winFade*k);batch.draw(assets.glow,px-5,py-5,10,10);}}
        
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        // winners drop onto their pedestals
        if(winFade>0)for(int i=0;i<winners.size();i++){var s=winners.get(i);int rank=i+1;float local=t-revealAt(i)-.25f;if(local<0)continue;float k=outBack(local/.6f),x=podX(rank),top=BASE+podH(rank);
            float h=rank==1?470:390,w=h*1.05f,y=top-18+(1-k)*500,bob=rank==1?Math.abs(MathUtils.sin(time*3.2f))*10:0;
            characters.drawAt(batch,s,x,y+bob,w,h,1,1,1,winFade*clamp(local/.2f),0);
            var c=medal(rank);float ta=winFade*clamp((local-.35f)/.3f);
            paint.centered(batch,assets.heading,place(rank,ru),x,BASE+podH(rank)-28,c,ta);
            paint.centered(batch,assets.stageName,paint.fit(assets.stageName,s.name,290),x,BASE-28,SbPaint.IVORY,ta);
            paint.centered(batch,assets.boardAp,s.ap+" AP",x,BASE-92,c,ta);}
        // headline
        String head;Color hc;float ha;
        if(trial<=0){boolean champ=!winners.isEmpty()&&t>=revealAt(0);head=champ?(ru?"ПОБЕДИТЕЛЬ — "+winners.getFirst().name:"WINNER — "+winners.getFirst().name):t<OPEN?(ru?"ОПЕРАЦИЯ ЗАВЕРШЕНА":"OPERATION COMPLETE"):(ru?"ЛУЧШИЕ ХАКЕРЫ":"TOP HACKERS");
            hc=champ?SbPaint.GOLD:SbPaint.GREEN;ha=winFade*clamp(t/.25f);}
        else{float tt=t-we;boolean done=tt>TRIAL+2.4f;head=done?(ru?loser.name+" — ТЕПЕРЬ ПРИЗРАК":loser.name+" IS NOW A GHOST"):(ru?"ПОСЛЕДНЕЕ МЕСТО":"LAST PLACE");hc=done?GHOST:SbPaint.RED;ha=trial;}
        float slam=t<.5f?1+(1-outCubic(t/.5f))*.6f:1,jit=t<OPEN&&MathUtils.random()<.08f?MathUtils.random(-8,8):0;
        assets.stage.getData().setScale(slam);paint.centered(batch,assets.stage,paint.fit(assets.stage,head,W-200),W/2f+jit,H-120,hc,ha);assets.stage.getData().setScale(1);
        if(loser!=null&&trial>0)trial(batch,paint,assets,characters,ru,time,cam,trial,t-we);
        batch.setColor(1,1,1,1);batch.end();
        if(loser!=null&&trial>0)trialShapes(shapes,time,t-we);
    }

    // ---------- the execution ----------
    private static final float CW=520,CH=520;                       // drawn size of the condemned
    private float hash(int i){float v=MathUtils.sin(i*127.1f+311.7f)*43758.5453f;return v-(float)Math.floor(v);}
    private final com.badlogic.gdx.math.Rectangle area=new com.badlogic.gdx.math.Rectangle(),scissor=new com.badlogic.gdx.math.Rectangle();
    /** Camera shake right after the strike. */
    private float shake(float struck,float time){return struck<.1f||struck>.6f?0:MathUtils.sin(time*71)*9*(1-(struck-.1f)/.5f);}
    /** Heartbeat times (s) inside sentence.wav, which starts 0.2 s into the trial — the body pulses on the same beats. */
    private static final float[] BEATS={.25f,1.05f,1.7f,2.2f,2.6f,2.9f,3.15f};
    private float beat(float tt){float k=0;for(float b:BEATS){float d=(tt-(.2f+b))/.07f;k=Math.max(k,(float)Math.exp(-d*d));}return k;}
    private static final String[] PCT=new String[101];static{for(int i=0;i<=100;i++)PCT[i]=i+"%";}
    private static final int COLS=8,ROWS=10;
    private static final float SPOT=1.35f;
    private void blend(SpriteBatch b,boolean add){b.setBlendFunction(GL20.GL_SRC_ALPHA,add?GL20.GL_ONE:GL20.GL_ONE_MINUS_SRC_ALPHA);}
    /** Draws the condemned only above {@code fromY} (scissored), so the body can burn away from the feet up. */
    private void clipped(SpriteBatch batch,PodiumCharacters ch,com.badlogic.gdx.graphics.Camera cam,float x0,float y0,float w0,float h0,float cx,float bottom,float w,float h,float r,float g,float b,float al){
        batch.flush();area.set(x0,y0,w0,h0);com.badlogic.gdx.scenes.scene2d.utils.ScissorStack.calculateScissors(cam,batch.getTransformMatrix(),area,scissor);
        if(!com.badlogic.gdx.scenes.scene2d.utils.ScissorStack.pushScissors(scissor))return;
        ch.drawAt(batch,loser,cx,bottom,w,h,r,g,b,al,0);batch.flush();com.badlogic.gdx.scenes.scene2d.utils.ScissorStack.popScissors();
    }
    /**
     * The execution, staged like a film shot: one cold spotlight in the dark with dust in the beam; the light fails and
     * flickers while the heart races and a red rim light creeps over the body; a white-out and a frozen negative frame;
     * the charred body then burns away from the feet up behind a glowing ember edge, shedding ash into the air; the soul
     * rises and settles into the ghost.
     */
    private void trial(SpriteBatch batch,SbPaint paint,SystemBreachHostAssets a,PodiumCharacters characters,boolean ru,float time,com.badlogic.gdx.graphics.Camera cam,float trial,float tt){
        float struck=tt-TRIAL,pre=clamp(tt/TRIAL),sx=shake(struck,time),charge=clamp((struck+1.3f)/1.3f);
        float lift=struck<0?outCubic(charge)*26:struck<1.05f?26*(1-clamp((struck-.4f)/.6f)):0;
        float cx=W/2f+sx,bottom=BASE+30+lift,hb=struck<0?beat(tt):0;
        float push=1+.08f*outCubic(pre),w=CW*push*(1+.03f*hb),h=CH*push*(1+.03f*hb);
        // failing light: steady, then stutters harder as the charge builds; out at the strike, a dim red after
        float flick=struck<0?1-(charge>0&&hash((int)(time*22))<.25f+.35f*charge?.55f:0):struck<1.05f?.35f:.25f;
        float spot=trial*flick*(1-clamp((struck-2.2f)/1.2f));
        blend(batch,true);
        batch.setColor(.85f,.9f,1,.20f*spot);batch.draw(a.glow,cx-240,BASE-20,480,H+200);            // the beam
        batch.setColor(.9f,.95f,1,.13f*spot);batch.draw(a.glow,cx-110,BASE+40,220,H);                 // its hot core
        batch.setColor(.85f,.9f,1,.30f*spot);batch.draw(a.glow,cx-330,BASE-55,660,150);               // pool of light on the floor
        for(int i=0;i<46;i++){float ph=(time*.035f+hash(i))%1f,mx=cx+(hash(i+9)-.5f)*300+MathUtils.sin(time*.4f+i)*18,my=BASE+ph*(H-BASE);
            float tw=.5f+.5f*MathUtils.sin(time*1.7f+i*3);batch.setColor(1,.97f,.9f,.22f*spot*tw*(1-Math.abs(mx-cx)/170f));batch.draw(a.glow,mx-3,my-3,6,6);}   // dust in the beam
        float red=struck<0?outCubic(pre):struck<1.05f?1:0;
        if(red>0){batch.setColor(1,.08f,.04f,(.10f+.18f*hb)*red*trial);batch.draw(a.glow,cx-360,BASE-80,720,CH+260);}
        blend(batch,false);
        if(struck<.12f){// the condemned: trembling harder, a red rim light creeping over them
            float trem=MathUtils.sin(time*53)*(.5f+5*pre*pre),k=struck<0?1:0;
            characters.drawAt(batch,loser,cx+trem,bottom,w,h,1-.25f*pre,1-.55f*pre,1-.55f*pre,trial,0);
            blend(batch,true);for(int s2=-1;s2<=1;s2+=2)characters.drawAt(batch,loser,cx+trem+s2*(3+2*pre),bottom+1,w,h,1,.12f,.06f,(.10f+.32f*pre+.3f*hb)*trial*(1-k*0),0);blend(batch,false);
            if(struck>0){batch.setColor(1,1,1,trial*(1-struck/.12f));batch.draw(a.pixel,0,0,W,H);}            // white-out
        }else if(struck<.45f){// frozen negative frame: a cold x-ray of the body, still, as the sound hits
            batch.setColor(.85f,.92f,1,.9f*trial*(1-(struck-.12f)/.33f));batch.draw(a.pixel,0,0,W,H);
            characters.drawAt(batch,loser,cx,bottom,w,h,0,0,0,trial,0);
            blend(batch,true);characters.drawAt(batch,loser,cx+4,bottom,w,h,.2f,.5f,1,.5f*trial,0);blend(batch,false);
        }else if(struck<1.05f){// charred, embers breathing through it, sagging as the life goes
            float c=clamp((struck-.45f)/.4f),sag=outCubic(clamp((struck-.5f)/.55f));
            characters.drawAt(batch,loser,cx,bottom-6*sag,w*(1+.02f*sag),h*(1-.04f*sag),.06f+.1f*(1-c),.04f+.04f*(1-c),.035f,trial,0);
            blend(batch,true);characters.drawAt(batch,loser,cx,bottom-6*sag,w*(1+.02f*sag),h*(1-.04f*sag),1,.32f,.06f,(.18f+.14f*MathUtils.sin(time*9+hash((int)(time*6))*3))*trial,0);blend(batch,false);
        }
        // burn-away: the body above the line stays charred; the line rises from the feet with a glowing ember edge
        float burn=clamp((struck-1.05f)/1.45f),be=burn*burn*(3-2*burn),by=bottom-10+(h+20)*be;
        if(struck>=1.05f&&burn<1){float bh=Math.max(0,bottom+h-by);
            clipped(batch,characters,cam,0,by,W,bh+40,cx,bottom,w,h,.05f,.035f,.03f,trial);
            blend(batch,true);
            clipped(batch,characters,cam,0,by,W,26,cx,bottom,w,h,1,.42f,.08f,trial);                         // ember edge, shaped like the body
            clipped(batch,characters,cam,0,by,W,9,cx,bottom,w,h,1,.85f,.55f,trial);                          // white-hot rim
            clipped(batch,characters,cam,0,by+26,W,bh,cx,bottom,w,h,.9f,.25f,.05f,(.10f+.08f*MathUtils.sin(time*11))*trial);
            batch.setColor(1,.45f,.12f,.35f*trial);batch.draw(a.glow,cx-w*.45f,by-40,w*.9f,80);
            blend(batch,false);}
        // ash: flakes shed at the burn line, carried up and away on a slow turbulent draught
        if(struck>1.05f&&struck<5.2f){blend(batch,true);
            for(int i=0;i<420;i++){float u=hash(i*3+1),born=1.05f+1.45f*(u*u*(3-2*u))+hash(i)*.05f,life=struck-born;if(life<0||life>2.6f)continue;float k=life/2.6f;
                float wid=(1-Math.abs(u-.55f)*1.2f)*w*.32f,x0=cx+(hash(i*3+2)-.5f)*2*wid,y0=bottom-10+(h+20)*u;
                float px=x0+life*(40+70*hash(i*5))+MathUtils.sin(life*2.3f+i)*22*k+MathUtils.sin(time*.8f+i*.3f)*8,py=y0+life*(35+90*hash(i*7))+MathUtils.cos(life*1.7f+i)*10*k;
                float sz=1.6f+hash(i*11)*3.4f*(1-k*.5f),hot=clamp(1-life/.5f);
                batch.setColor(1,.35f+.4f*hot,.08f+.3f*hot,(.95f*hot+.0f)*(1-k));batch.draw(a.glow,px-sz*2,py-sz*2,sz*4,sz*4);
                batch.setColor(.55f,.5f,.48f,.5f*(1-hot)*(1-k)*(1-k));batch.draw(a.pixel,px-sz*.5f,py-sz*.5f,sz,sz);}
            blend(batch,false);}
        // the soul: a cold light gathers above the ashes and rises
        float form=clamp((struck-2.3f)/1.0f);
        if(struck>1.5f&&form<1){float k=clamp((struck-1.5f)/.9f),oy=bottom+h*.45f+outCubic(k)*120,fade=(1-form)*clamp((struck-1.5f)/.3f);blend(batch,true);
            batch.setColor(GHOST.r,GHOST.g,GHOST.b,.45f*fade);batch.draw(a.glow,cx-110,oy-110,220,220);batch.setColor(1,1,1,.85f*fade);batch.draw(a.glow,cx-22,oy-22,44,44);
            for(int i=0;i<18;i++){float ph=(time*.5f+hash(i))%1f,r=(1-ph)*160;float an=hash(i+3)*MathUtils.PI2+ph*2;batch.setColor(GHOST.r,GHOST.g,GHOST.b,.6f*ph*fade);batch.draw(a.glow,cx+MathUtils.cos(an)*r-4,oy+MathUtils.sin(an)*r*.6f-4,8,8);}
            blend(batch,false);}
        // the ghost: condenses from the soul and drifts in a slow figure-eight with a trailing veil
        if(form>0){float e=outCubic(form),drift=struck-2.3f,rise=outCubic(clamp(drift/5f))*130,sc=.65f+.35f*e+.02f*MathUtils.sin(time*1.7f);
            float gb=BASE+30,gx=cx+MathUtils.sin(time*.9f)*26*e,gy=gb+rise+MathUtils.sin(time*1.8f)*12*e+(1-e)*110,gw=CW*sc,gh=CH*sc;
            blend(batch,true);batch.setColor(GHOST.r,GHOST.g,GHOST.b,.22f*e*(.8f+.2f*MathUtils.sin(time*2.6f)));batch.draw(a.glow,gx-300,gy-80,600,gh+180);
            for(int k=4;k>=1;k--){float lag=k*.2f,tx=cx+MathUtils.sin((time-lag)*.9f)*26*e,ty=gb+rise+MathUtils.sin((time-lag)*1.8f)*12*e-k*20+(1-e)*110;
                characters.drawAt(batch,loser,tx,ty,gw*(1-k*.03f),gh*(1-k*.05f),GHOST.r,GHOST.g,GHOST.b,.06f*e*(5-k)/4f,0);}
            blend(batch,false);characters.drawAt(batch,loser,gx,gy,gw,gh,.12f,.3f,.55f,.35f*e,0);
            blend(batch,true);characters.drawAt(batch,loser,gx,gy,gw,gh,GHOST.r*.75f,GHOST.g*.95f,GHOST.b,.7f*e*(.88f+.12f*MathUtils.sin(time*3.1f)),0);blend(batch,false);}
        // letterbox
        {float lb=outCubic(trial)*64;batch.setColor(0,0,0,1);batch.draw(a.pixel,0,H-lb,W,lb);batch.draw(a.pixel,0,0,W,lb*.0f);}
        // captions: quiet, set in the dark under the stage
        float la=trial*clamp((tt-.4f)/.6f);boolean ghost=form>.3f;
        paint.centered(batch,a.stageName,loser.name,W/2f,BASE-6,ghost?GHOST:SbPaint.IVORY,la*(struck>0&&struck<.45f?.3f:1));
        String line=ghost?(ru?"ДОСТУП АННУЛИРОВАН · "+loser.ap+" AP":"ACCESS REVOKED · "+loser.ap+" AP"):struck>0?(ru?"ПРИГОВОР ПРИВЕДЁН В ИСПОЛНЕНИЕ":"SENTENCE CARRIED OUT"):(ru?"ПОСЛЕДНЕЕ МЕСТО · ПРИГОВОР":"LAST PLACE · SENTENCED");
        paint.centered(batch,a.label,line,W/2f,BASE-58,ghost?GHOST:tmp.set(.85f,.3f,.27f,1),la*.9f);
    }
    /** A soft vignette over the whole stage: corners fall into darkness. */
    private void trialShapes(ShapeRenderer shapes,float time,float tt){
        float k=clamp(tt/.8f)*.85f;Gdx.gl.glEnable(GL20.GL_BLEND);shapes.begin(ShapeRenderer.ShapeType.Filled);
        Color o=tmp.set(0,0,0,k),c=tmp2.set(0,0,0,0);float e=W*.3f,v=H*.32f;
        shapes.rect(0,0,e,H,o,c,c,o);shapes.rect(W-e,0,e,H,c,o,o,c);shapes.rect(0,0,W,v,o,o,c,c);shapes.rect(0,H-v,W,v,c,c,o,o);
        shapes.end();
    }
    private static void bolt(ShapeRenderer s,float x,float y,float nx,float ny,float a,float w){s.setColor(1,.35f,.3f,.35f*a);s.rectLine(x,y,nx,ny,w);s.setColor(1,.8f,.75f,.75f*a);s.rectLine(x,y,nx,ny,w*.45f);s.setColor(1,1,1,a);s.rectLine(x,y,nx,ny,Math.max(1.5f,w*.18f));}
    private static void ring(ShapeRenderer s,float cx,float cy,float rx,float ry,float w){int n=40;for(int i=0;i<n;i++){float a=i*MathUtils.PI2/n,b=(i+1)*MathUtils.PI2/n;s.rectLine(cx+MathUtils.cos(a)*rx,cy+MathUtils.sin(a)*ry,cx+MathUtils.cos(b)*rx,cy+MathUtils.sin(b)*ry,w);}}
    private static String place(int rank,boolean ru){return ru?rank+" МЕСТО":rank==1?"1ST PLACE":rank==2?"2ND PLACE":"3RD PLACE";}
}
