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
        if(loser!=null&&trial>0){float tt=t-we;batch.setColor(1,.1f,.06f,(.14f+.06f*MathUtils.sin(time*7))*trial*(1-ghostK));batch.draw(assets.glow,W/2f-380,BASE-80,760,900);}
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
        else{float tt=t-we;boolean done=tt>TRIAL+2.4f;head=done?(ru?loser.name+" — ТЕПЕРЬ ПРИЗРАК":loser.name+" IS NOW A GHOST"):(ru?"ПОСЛЕДНЕЕ МЕСТО":"LAST PLACE");hc=done?GHOST:SbPaint.RED;ha=trial*(done?1:(.65f+.35f*MathUtils.sin(time*9)));}
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
    private float shake(float struck,float time){float s2=struck-2.65f;float stamp=s2>0&&s2<.3f?MathUtils.sin(time*90)*10*(1-s2/.3f):0;return stamp+(struck<0||struck>.7f?0:MathUtils.sin(time*83)*24*(1-struck/.7f));}
    /** Heartbeat times (s) inside sentence.wav, which starts 0.2 s into the trial — the body pulses on the same beats. */
    private static final float[] BEATS={.25f,1.05f,1.7f,2.2f,2.6f,2.9f,3.15f};
    private float beat(float tt){float k=0;for(float b:BEATS){float d=(tt-(.2f+b))/.07f;k=Math.max(k,(float)Math.exp(-d*d));}return k;}
    private static final String[] PCT=new String[101];static{for(int i=0;i<=100;i++)PCT[i]=i+"%";}
    private static final int COLS=8,ROWS=10;
    private void trial(SpriteBatch batch,SbPaint paint,SystemBreachHostAssets a,PodiumCharacters characters,boolean ru,float time,com.badlogic.gdx.graphics.Camera cam,float trial,float tt){
        float struck=tt-TRIAL,pre=clamp(tt/TRIAL),sx=shake(struck,time),lift=struck<0?outCubic(clamp((struck+1.3f)/1.3f))*38:struck<1.05f?38:0;
        float cx=W/2f+sx,bottom=BASE+30+lift,hb=struck<0?beat(tt):0;
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        // sentence: a red shaft, a floor glow that thumps with the heart, sparks spiralling in during the charge
        if(struck<.7f){float k=trial*(struck<0?1:1-struck/.7f);
            batch.setColor(1,.12f,.08f,(.24f+.25f*hb)*k);batch.draw(a.glow,cx-170,bottom-40,340,H);batch.setColor(1,.15f,.1f,(.3f+.4f*hb)*k);batch.draw(a.glow,cx-300,BASE-60,600,180);
            float charge=clamp((struck+1.3f)/1.3f);if(struck<0&&charge>0)for(int i=0;i<48;i++){float ph=(charge*1.4f+hash(i)*.4f)%1f,r=(1-ph)*480,ang=hash(i+50)*MathUtils.PI2+ph*5;
                batch.setColor(1,.5f+.45f*ph,.35f+.5f*ph,ph*.9f*trial*charge);batch.draw(a.glow,cx+MathUtils.cos(ang)*r-7,bottom+260+MathUtils.sin(ang)*r*.7f-7,14,14);}}
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        float push=struck<0?1+.12f*outCubic(pre):1.12f,scale=push+.05f*hb,w=CW*scale,h=CH*scale;
        if(struck<1.05f){
            if(struck<0){float trem=MathUtils.sin(time*47)*(1.5f+8*pre*pre),red=.5f*pre;characters.drawAt(batch,loser,cx+trem,bottom,w,h,1,1-red,1-red,trial,0);}
            else if(struck<.7f){// electrocution: convulsing, flickering between a white-hot body and a dark x-ray negative
                float jit=MathUtils.sin(time*130)*12*(1-struck/.7f),jy=MathUtils.sin(time*97)*6;boolean flash=((int)(time*28))%2==0;
                if(struck<.16f){float o=22*(1-struck/.16f);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);characters.drawAt(batch,loser,cx-o,bottom,w,h,1,.1f,.1f,.8f*trial,0);characters.drawAt(batch,loser,cx+o,bottom,w,h,.1f,.9f,1,.8f*trial,0);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
                if(flash){characters.drawAt(batch,loser,cx+jit,bottom+jy,w,h,1,1,1,trial,0);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);for(int k=0;k<3;k++)characters.drawAt(batch,loser,cx+jit,bottom+jy,w,h,.8f,.9f,1,trial,0);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
                else characters.drawAt(batch,loser,cx+jit,bottom+jy,w,h,.08f,.1f,.16f,trial,0);}
            else{// charred: black body with embers breathing through it
                float c=clamp((struck-.7f)/.3f),sl=outCubic(c);h*=1-.06f*sl;w*=1+.03f*sl;characters.drawAt(batch,loser,cx,bottom-lift*sl*.5f,w,h,.14f-.06f*c,.09f-.05f*c,.08f-.05f*c,trial,0);
                batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);characters.drawAt(batch,loser,cx,bottom-lift*sl*.5f,w,h,1,.35f,.08f,(.25f+.2f*MathUtils.sin(time*18))*trial,0);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        }else if(struck<2.3f){// deletion: the charred body breaks into data blocks, swept top to bottom; each block glitches,
            // flashes cyan and is pulled into the rising soul
            float cw=CW/COLS,chh=CH/ROWS,left=cx-CW/2,bx0=bottom-lift*.5f,sx2=cx,sy2=BASE+330;
            for(int r=ROWS-1;r>=0;r--)for(int q=0;q<COLS;q++){int id=r*COLS+q;float st=1.05f+(ROWS-1-r)/(float)ROWS*.55f+hash(id)*.18f,e=(struck-st)/.62f;
                float px=left+q*cw,py=bx0+r*chh,ox=0,oy=0,shrink=1,cr=.1f,cg=.06f,cb=.05f,al=trial;
                if(e>=1)continue;
                if(e>0){float g=clamp(e/.3f);if(e<.3f){ox=(((int)(time*40+id))%3-1)*6*g;cr=.1f+.3f*g;cg=.06f+.8f*g;cb=.05f+.95f*g;}
                    else{float m=(e-.3f)/.7f,mm=m*m;ox=(sx2-(px+cw/2))*mm+MathUtils.sin(m*6+id)*30*m;oy=(sy2-(py+chh/2))*mm+m*40;shrink=1-m*.85f;cr=.5f;cg=.95f;cb=1;al=trial*(1-m*m);}}
                float sw=cw*shrink,sh=chh*shrink,ax=px+(cw-sw)/2+ox,ay=py+(chh-sh)/2+oy;
                batch.flush();area.set(ax,ay,sw,sh);com.badlogic.gdx.scenes.scene2d.utils.ScissorStack.calculateScissors(cam,batch.getTransformMatrix(),area,scissor);
                if(!com.badlogic.gdx.scenes.scene2d.utils.ScissorStack.pushScissors(scissor))continue;
                characters.drawAt(batch,loser,cx+ox+(cw-sw)/2*0,bx0+oy,CW,CH,cr,cg,cb,al,0);batch.flush();com.badlogic.gdx.scenes.scene2d.utils.ScissorStack.popScissors();
                if(e>.3f){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(.45f,.9f,1,.5f*al);batch.draw(a.glow,ax-sw*.6f,ay-sh*.6f,sw*2.2f,sh*2.2f);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}}
            // scan line sweeping down the body as it is deleted
            float sweep=clamp((struck-1.05f)/.75f);if(sweep<1){float ly=bx0+CH*(1-sweep);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(.5f,.95f,1,.8f*trial);batch.draw(a.pixel,cx-CW*.45f,ly-1.5f,CW*.9f,3);batch.setColor(.4f,.85f,1,.35f*trial);batch.draw(a.glow,cx-CW*.55f,ly-30,CW*1.1f,60);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        }
        // ash and embers
        if(struck>1.0f&&struck<4f){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
            for(int i=0;i<130;i++){float yf=hash(i*3+1),born=1.05f+yf*.5f+hash(i)*.2f,life=struck-born;if(life<0||life>2f)continue;float k=life/2f;
                float px=cx+(hash(i*3+2)-.5f)*300+(hash(i)-.5f)*260*k+MathUtils.sin(time*2+i)*14*k,py=bottom+yf*(CH-20)+life*(60+hash(i*7)*150)-k*k*40;
                float sz=2.5f+hash(i*5)*6;batch.setColor(1,.6f-.4f*k,.25f*(1-k)+.25f*k,(1-k)*.9f);batch.draw(a.glow,px-sz,py-sz,sz*2,sz*2);}
            batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        // strike flash and floor light
        if(struck>0&&struck<.25f){float k=1-struck/.25f;batch.setColor(1,.97f,.95f,.65f*k*k);batch.draw(a.pixel,0,0,W,H);}
        if(struck>0&&struck<1.2f){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);float k=1-struck/1.2f;batch.setColor(.7f,.85f,1,.6f*k);batch.draw(a.glow,cx-500,BASE-90,1000,240);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        // the soul leaves: a bright orb with a trail rises out of the ashes
        float form=clamp((struck-2.0f)/1.0f);
        if(struck>1.2f&&form<1){float k=clamp((struck-1.2f)/.9f),oy=BASE+170+outCubic(k)*190,ox=cx+MathUtils.sin(struck*5)*20*(1-k),fade=1-form;
            batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
            for(int i=6;i>=0;i--){float lag=i*.05f,ty=BASE+170+outCubic(clamp((struck-1.2f-lag)/.9f))*190,sz=(120-i*13)*(.9f+.1f*MathUtils.sin(time*12));batch.setColor(GHOST.r,GHOST.g,GHOST.b,(.55f-i*.07f)*fade*clamp((struck-1.2f)/.15f));batch.draw(a.glow,ox-sz/2,ty-sz/2,sz,sz);}
            batch.setColor(1,1,1,.8f*fade*clamp((struck-1.2f)/.15f));batch.draw(a.glow,ox-26,oy-26,52,52);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        // the ghost condenses from the soul and drifts in a slow figure-eight with a trailing veil
        if(struck>1.6f){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
            for(int i=0;i<6;i++){float mx=cx-420+((time*22+i*170)%840);batch.setColor(.45f,.75f,1,.10f*form);batch.draw(a.glow,mx-160,BASE-40,320,120);}
            batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        if(form>0){float e=outCubic(form),drift=struck-2.0f,rise=outCubic(clamp(drift/5f))*150,sc=.6f+.4f*e+.025f*MathUtils.sin(time*1.7f);
            float gb=BASE+30,gx=cx+MathUtils.sin(time*.9f)*30*e,gy=gb+rise+MathUtils.sin(time*1.8f)*14*e+(1-e)*120,gw=CW*sc,gh=CH*sc;
            batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
            batch.setColor(GHOST.r,GHOST.g,GHOST.b,.30f*e*(.8f+.2f*MathUtils.sin(time*2.6f)));batch.draw(a.glow,gx-280,gy-60,560,gh+160);
            for(int k=5;k>=1;k--){float lag=k*.18f,tx=cx+MathUtils.sin((time-lag)*.9f)*30*e,ty=gb+rise+MathUtils.sin((time-lag)*1.8f)*14*e-k*22+(1-e)*120;
                characters.drawAt(batch,loser,tx,ty,gw*(1-k*.04f),gh*(1-k*.06f),GHOST.r,GHOST.g,GHOST.b,.07f*e*(6-k)/5f,0);}
            batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
            characters.drawAt(batch,loser,gx,gy,gw,gh,.18f,.42f,.75f,.28f*e*(.85f+.15f*MathUtils.sin(time*3.3f)),0);
            batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);characters.drawAt(batch,loser,gx,gy,gw,gh,GHOST.r*.8f,GHOST.g,GHOST.b,.8f*e,0);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        // the strike column: a blinding beam from the sky that narrows away
        if(struck>-.05f&&struck<.5f){float k=1-clamp(struck/.5f),bw=40+220*k;batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
            batch.setColor(.75f,.88f,1,.55f*k);batch.draw(a.glow,cx-bw*2,BASE,bw*4,H);batch.setColor(1,1,1,.9f*k);batch.draw(a.pixel,cx-bw*.18f,BASE+20,bw*.36f,H);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        // verdict stamp: slams onto the screen as the body is gone
        float st=struck-2.65f;if(st>0&&st<3.2f){float sk=st<.18f?2.2f-1.2f*outCubic(st/.18f):1,fa=trial*clamp(st/.08f)*clamp((3.2f-st)/.5f),sw=560*sk,sh=110*sk,sy=BASE+CH+90;
            batch.setColor(.35f,0,0,.55f*fa);batch.draw(a.pixel,cx-sw/2,sy-sh/2,sw,sh);batch.setColor(1,.2f,.15f,fa);
            float bt=6*sk;batch.draw(a.pixel,cx-sw/2,sy-sh/2,sw,bt);batch.draw(a.pixel,cx-sw/2,sy+sh/2-bt,sw,bt);batch.draw(a.pixel,cx-sw/2,sy-sh/2,bt,sh);batch.draw(a.pixel,cx+sw/2-bt,sy-sh/2,bt,sh);
            a.stage.getData().setScale(sk*.8f);paint.centered(batch,a.stage,ru?"УДАЛЁН":"DELETED",cx,sy+30*sk,SbPaint.RED,fa);a.stage.getData().setScale(1);
            if(st<.35f){float k=1-st/.35f;batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(1,.25f,.2f,.5f*k);batch.draw(a.glow,cx-sw,sy-sh*2,sw*2,sh*4);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}}
        // captions
        float la=trial*clamp((tt-.3f)/.4f);boolean ghost=form>.3f;
        paint.centered(batch,a.stageName,loser.name,W/2f+sx,BASE-6,ghost?GHOST:struck>0?SbPaint.AMBER:SbPaint.IVORY,la);
        if(struck>1.0f&&struck<2.6f){float pr=clamp((struck-1.05f)/1.2f),bw=360,by=BASE+CH+70,fa=trial*clamp((struck-1f)/.15f)*clamp((2.6f-struck)/.3f);
            batch.setColor(.05f,.12f,.16f,.85f*fa);batch.draw(a.pixel,cx-bw/2,by,bw,10);batch.setColor(.45f,.92f,1,fa);batch.draw(a.pixel,cx-bw/2,by,bw*pr,10);
            paint.centered(batch,a.label,(ru?"УДАЛЕНИЕ ПОЛЬЗОВАТЕЛЯ… ":"DELETING USER… ")+PCT[(int)(pr*100)],cx,by+44,GHOST,fa);}
        {float lb=outCubic(trial)*58;batch.setColor(0,0,0,.92f);batch.draw(a.pixel,0,H-lb,W,lb);}
        String line=ghost?(ru?"ДОСТУП АННУЛИРОВАН · "+loser.ap+" AP":"ACCESS REVOKED · "+loser.ap+" AP"):struck>0?(ru?"ПРИГОВОР ПРИВЕДЁН В ИСПОЛНЕНИЕ":"SENTENCE CARRIED OUT"):(ru?"ВИРУС ВЫНОСИТ ПРИГОВОР…":"THE VIRUS PASSES SENTENCE…");
        paint.centered(batch,a.label,line,W/2f+sx,BASE-62,ghost?GHOST:SbPaint.RED,la);
    }
    /** Target reticle closing in, lightning (trunk + branches, several strikes) and the shockwave rings. */
    private void trialShapes(ShapeRenderer shapes,float time,float tt){
        float struck=tt-TRIAL,cx=W/2f+shake(struck,time),hit=BASE+330;
        Gdx.gl.glEnable(GL20.GL_BLEND);shapes.begin(ShapeRenderer.ShapeType.Filled);
        if(struck<0){float k=clamp(tt/TRIAL),r=420-250*outCubic(k),a=.25f+.35f*k+.3f*beat(tt),cy=BASE+300;shapes.setColor(1,.2f,.15f,a);
            for(int q=0;q<4;q++){float sxn=q%2==0?-1:1,syn=q<2?-1:1,x=cx+sxn*r,y=cy+syn*r*.75f;shapes.rectLine(x,y,x-sxn*44,y,3);shapes.rectLine(x,y,x,y-syn*44,3);}
            shapes.rectLine(cx-14,cy,cx+14,cy,2);shapes.rectLine(cx,cy-14,cx,cy+14,2);}
        if(struck<0){float k=clamp(tt/1.0f),tight=outCubic(clamp(tt/TRIAL));   // energy shackles tighten around the body
            for(int q=0;q<3;q++){float cy=BASE+90+q*150,rx=(260-120*tight)*(1-q*.12f),ph=time*(2+q)+q;shapes.setColor(1,.25f,.18f,(.35f+.35f*beat(tt))*k);ring(shapes,cx,cy,rx,rx*.18f,3);
                shapes.setColor(1,.85f,.75f,.9f*k);for(int d=0;d<3;d++){float a2=ph+d*MathUtils.PI2/3;shapes.circle(cx+MathUtils.cos(a2)*rx,cy+MathUtils.sin(a2)*rx*.18f,4,8);}}}
        if(struck>0&&struck<3.5f){float k=clamp(struck/.15f)*clamp((3.5f-struck)/1.2f);var rr=new java.util.Random(77);   // scorched ground cracks
            for(int c=0;c<9;c++){float ang=MathUtils.PI*(rr.nextFloat()),len=(140+rr.nextFloat()*260)*outCubic(clamp(struck/.25f)),x=cx,y=BASE+30;
                for(int sgm=0;sgm<4;sgm++){float nx=x+MathUtils.cos(ang)*len/4,ny=y-MathUtils.sin(ang)*len/4*.22f;ang+=(rr.nextFloat()-.5f)*.6f;
                    shapes.setColor(1,.45f,.15f,.75f*k*(1-sgm*.18f));shapes.rectLine(x,y,nx,ny,4-sgm*.7f);shapes.setColor(1,.9f,.6f,.6f*k*(1-sgm*.2f));shapes.rectLine(x,y,nx,ny,1.4f);x=nx;y=ny;}}}
        if(struck<0&&struck>-1.3f){float c=clamp((struck+1.3f)/1.3f);for(int k=0;k<3;k++){float ph=(c*1.6f+k/3f)%1f,r=(1-ph)*300+20;shapes.setColor(1,.3f,.2f,.35f*ph);ring(shapes,cx,hit-40,r,r*.55f,3);}}
        if(struck>-.1f&&struck<.7f&&(struck<.22f||((int)(time*14))%3!=0)){
            if(MathUtils.random()<.6f)boltSeed=MathUtils.random(1L<<30);var rnd=new java.util.Random(boltSeed);float fade=struck<0?.6f:1-Math.max(0,struck)/.8f;
            for(int bolt=0;bolt<(struck<.2f?2:1);bolt++){float x=cx+(rnd.nextFloat()-.5f)*260,y=H;
                for(int seg=0;seg<12;seg++){float k=(seg+1)/12f,nx=MathUtils.lerp(x,cx,k*.5f)+(seg<11?(rnd.nextFloat()-.5f)*90:0),ny=MathUtils.lerp(H,hit,k);if(seg==11)nx=cx+(rnd.nextFloat()-.5f)*30;
                    bolt(shapes,x,y,nx,ny,fade,bolt==0?14:8);
                    if(seg>1&&seg<10&&rnd.nextFloat()<.45f){float bx=nx,by=ny,dir=rnd.nextBoolean()?1:-1;for(int b=0;b<4;b++){float ex=bx+dir*(30+rnd.nextFloat()*60),ey=by-(30+rnd.nextFloat()*50);bolt(shapes,bx,by,ex,ey,fade*.8f,6);bx=ex;by=ey;}}
                    x=nx;y=ny;}}
            // arcs crawling over the body
            for(int k=0;k<4;k++){float ax=cx+(rnd.nextFloat()-.5f)*220,ay=BASE+80+rnd.nextFloat()*380;bolt(shapes,ax,ay,ax+(rnd.nextFloat()-.5f)*90,ay+(rnd.nextFloat()-.5f)*70,fade*.7f,4);}}
        if(struck>0&&struck<1.1f){float k=struck/1.1f;shapes.setColor(.85f,.92f,1,.7f*(1-k));ring(shapes,cx,BASE+30,60+k*720,(60+k*720)*.22f,6*(1-k)+1);shapes.setColor(1,.5f,.3f,.5f*(1-k));ring(shapes,cx,BASE+30,40+k*480,(40+k*480)*.22f,3);}
        shapes.end();
    }
    private static void bolt(ShapeRenderer s,float x,float y,float nx,float ny,float a,float w){s.setColor(1,.35f,.3f,.35f*a);s.rectLine(x,y,nx,ny,w);s.setColor(1,.8f,.75f,.75f*a);s.rectLine(x,y,nx,ny,w*.45f);s.setColor(1,1,1,a);s.rectLine(x,y,nx,ny,Math.max(1.5f,w*.18f));}
    private static void ring(ShapeRenderer s,float cx,float cy,float rx,float ry,float w){int n=40;for(int i=0;i<n;i++){float a=i*MathUtils.PI2/n,b=(i+1)*MathUtils.PI2/n;s.rectLine(cx+MathUtils.cos(a)*rx,cy+MathUtils.sin(a)*ry,cx+MathUtils.cos(b)*rx,cy+MathUtils.sin(b)*ry,w);}}
    private static String place(int rank,boolean ru){return ru?rank+" МЕСТО":rank==1?"1ST PLACE":rank==2?"2ND PLACE":"3RD PLACE";}
}
