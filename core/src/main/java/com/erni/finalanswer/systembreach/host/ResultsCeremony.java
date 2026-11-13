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
    void reset(){t=-1;winners.clear();loser=null;}
    /** Starts once, from the final ranking. */
    void update(SystemBreachHostViewModel model,float dt){
        if(!model.results()){reset();return;}
        if(t<0){var r=model.ranking();if(r.isEmpty())return;t=0;winners.clear();
            int n=r.size(),k=n>=2?Math.min(3,n-1):1;for(int i=0;i<k;i++)winners.add(r.get(i));loser=n>=2?r.get(n-1):null;}
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
        float dim=Math.min(.95f,t/.7f*.95f),ghostK=loser==null?0:clamp((t-we-TRIAL-.9f)/1.4f);
        Gdx.gl.glEnable(GL20.GL_BLEND);Gdx.gl.glBlendFunc(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        shapes.begin(ShapeRenderer.ShapeType.Filled);
        shapes.setColor(.01f,.01f,.015f,dim);shapes.rect(0,0,W,H);
        if(trial>0){shapes.setColor(BLOOD.r*.35f,0,0,.55f*trial*(1-ghostK));shapes.rect(0,0,W,H);shapes.setColor(.02f,.08f,.16f,.6f*ghostK);shapes.rect(0,0,W,H);}
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
        if(loser!=null&&trial>0){float tt=t-we;batch.setColor(1,.1f,.06f,(.35f+.15f*MathUtils.sin(time*7))*trial*(1-ghostK));batch.draw(assets.glow,W/2f-380,BASE-80,760,900);}
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
        else{float tt=t-we;boolean done=tt>TRIAL+1.3f;head=done?(ru?loser.name+" — ТЕПЕРЬ ПРИЗРАК":loser.name+" IS NOW A GHOST"):(ru?"ПОСЛЕДНЕЕ МЕСТО":"LAST PLACE");hc=done?GHOST:SbPaint.RED;ha=trial*(done?1:(.65f+.35f*MathUtils.sin(time*9)));}
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
    private float shake(float struck,float time){return struck<0||struck>.7f?0:MathUtils.sin(time*83)*24*(1-struck/.7f);}
    private void trial(SpriteBatch batch,SbPaint paint,SystemBreachHostAssets a,PodiumCharacters characters,boolean ru,float time,com.badlogic.gdx.graphics.Camera cam,float trial,float tt){
        float struck=tt-TRIAL,pre=clamp(tt/TRIAL),sx=shake(struck,time),cx=W/2f+sx,bottom=BASE+30;
        // 1. sentence: a red shaft of light from above, the condemned reddens and trembles
        if(struck<.6f){float k=trial*(struck<0?1:1-struck/.6f);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
            batch.setColor(1,.12f,.08f,(.28f+.10f*MathUtils.sin(time*5))*k);batch.draw(a.glow,cx-170,bottom-40,340,H);batch.setColor(1,.2f,.15f,.35f*k);batch.draw(a.glow,cx-260,bottom-90,520,200);
            // 2. charge: sparks spiral in, the light tightens
            float charge=clamp((struck+1.1f)/1.1f);if(struck<0&&charge>0)for(int i=0;i<40;i++){float ph=(charge+hash(i)*.35f)%1f,r=(1-ph)*460,ang=hash(i+50)*MathUtils.PI2+ph*4;
                float px=cx+MathUtils.cos(ang)*r,py=bottom+260+MathUtils.sin(ang)*r*.7f;batch.setColor(1,.55f+.4f*ph,.4f,ph*.9f*trial);batch.draw(a.glow,px-7,py-7,14,14);}
            batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        // the body: trembling before, a white silhouette at the strike, then burning away from the feet up
        float burn=clamp((struck-.12f)/1.1f),cut=bottom+burn*(CH-20);
        if(burn<1){float trem=struck<0?MathUtils.sin(time*47)*(2+9*pre*pre):0,red=struck<0?.45f*pre:0;
            boolean clip=burn>0;if(clip){batch.flush();area.set(0,cut,W,H);com.badlogic.gdx.scenes.scene2d.utils.ScissorStack.calculateScissors(cam,batch.getTransformMatrix(),area,scissor);com.badlogic.gdx.scenes.scene2d.utils.ScissorStack.pushScissors(scissor);}
            float hot=struck>0?clamp(struck/.5f):0;   // charred colour as it burns
            characters.drawAt(batch,loser,cx+trem,bottom,CW,CH,1-.55f*hot,1-red-.75f*hot,1-red-.8f*hot,trial,0);
            if(struck>-.05f&&struck<.45f){float w=1-Math.max(0,struck)/.45f;batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
                for(int k=0;k<3;k++)characters.drawAt(batch,loser,cx,bottom,CW,CH,1,1,1,w,0);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            if(clip){batch.flush();com.badlogic.gdx.scenes.scene2d.utils.ScissorStack.popScissors();}
            // the burning edge: a white-hot line with embers peeling off it
            if(burn>0){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);float e=1-burn*.4f;
                batch.setColor(1,.45f,.12f,.75f*e);batch.draw(a.glow,cx-200,cut-26,400,52);batch.setColor(1,.9f,.6f,.9f*e);batch.draw(a.glow,cx-150,cut-8,300,16);
                batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}}
        // ash and embers rising from where the body was
        if(struck>.1f&&struck<3.2f){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
            for(int i=0;i<110;i++){float yf=hash(i*3+1),born=.12f+yf*1.1f,life=struck-born;if(life<0||life>1.8f)continue;float k=life/1.8f;
                float px=cx+(hash(i*3+2)-.5f)*300+MathUtils.sin(time*2+i)*18*k+(hash(i)-.5f)*120*k,py=bottom+yf*(CH-20)+life*(70+hash(i*7)*130);
                float sz=3+hash(i*5)*6;batch.setColor(1,.55f-.35f*k,.2f*(1-k)+.2f*k,(1-k)*.9f);batch.draw(a.glow,px-sz,py-sz,sz*2,sz*2);}
            batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        // the strike: a short white-out and a flash on the floor
        if(struck>0&&struck<.3f){float k=1-struck/.3f;batch.setColor(1,.97f,.95f,.6f*k*k*k);batch.draw(a.pixel,0,0,W,H);}
        if(struck>0&&struck<1.2f){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);float k=1-struck/1.2f;batch.setColor(.7f,.85f,1,.6f*k);batch.draw(a.glow,cx-500,bottom-120,1000,240);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        // 5. the ghost gathers from cold wisps, then floats in a slow figure-eight with a trailing veil
        float form=clamp((struck-.9f)/1.4f);
        if(struck>.6f){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
            if(form<1)for(int i=0;i<46;i++){float ph=clamp((struck-.6f-hash(i)*.6f)/1.1f);if(ph<=0||ph>=1)continue;float r=(1-outCubic(ph))*380,ang=hash(i+9)*MathUtils.PI2-ph*3;
                batch.setColor(GHOST.r,GHOST.g,GHOST.b,MathUtils.sin(ph*MathUtils.PI)*.8f);batch.draw(a.glow,cx+MathUtils.cos(ang)*r-8,bottom+250+MathUtils.sin(ang)*r*.6f-8,16,16);}
            // cold mist on the floor
            for(int i=0;i<6;i++){float mx=cx-420+((time*22+i*170)%840);batch.setColor(.45f,.75f,1,.10f*form);batch.draw(a.glow,mx-160,bottom-60,320,120);}
            batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        if(form>0){float e=outCubic(form),drift=struck-.9f,rise=outCubic(clamp(drift/5f))*150,scale=.86f+.14f*e+.025f*MathUtils.sin(time*1.7f);
            float gx=cx+MathUtils.sin(time*.9f)*30*e,gy=bottom+rise+MathUtils.sin(time*1.8f)*14*e,gw=CW*scale,gh=CH*scale;
            batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
            batch.setColor(GHOST.r,GHOST.g,GHOST.b,.30f*e*(.8f+.2f*MathUtils.sin(time*2.6f)));batch.draw(a.glow,gx-280,gy-60,560,gh+160);
            for(int k=5;k>=1;k--){float lag=k*.18f,tx=cx+MathUtils.sin((time-lag)*.9f)*30*e,ty=bottom+rise+MathUtils.sin((time-lag)*1.8f)*14*e-k*22;   // trailing veil
                characters.drawAt(batch,loser,tx,ty,gw*(1-k*.04f),gh*(1-k*.06f),GHOST.r,GHOST.g,GHOST.b,.07f*e*(6-k)/5f,0);}
            batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
            characters.drawAt(batch,loser,gx,gy,gw,gh,.18f,.42f,.75f,.28f*e*(.85f+.15f*MathUtils.sin(time*3.3f)),0);
            batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);characters.drawAt(batch,loser,gx,gy,gw,gh,GHOST.r*.8f,GHOST.g,GHOST.b,.8f*e,0);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        // captions
        float la=trial*clamp((tt-.3f)/.4f);boolean ghost=form>.3f;
        paint.centered(batch,a.stageName,loser.name,W/2f+sx,BASE-6,ghost?GHOST:struck>0?SbPaint.AMBER:SbPaint.IVORY,la);
        String line=ghost?(ru?"ДОСТУП АННУЛИРОВАН · "+loser.ap+" AP":"ACCESS REVOKED · "+loser.ap+" AP"):struck>0?(ru?"ПРИГОВОР ПРИВЕДЁН В ИСПОЛНЕНИЕ":"SENTENCE CARRIED OUT"):(ru?"ВИРУС ВЫНОСИТ ПРИГОВОР…":"THE VIRUS PASSES SENTENCE…");
        paint.centered(batch,a.label,line,W/2f+sx,BASE-62,ghost?GHOST:SbPaint.RED,la);
        if(struck<0){batch.setColor(1,.1f,.05f,.22f*trial);for(int i=0;i<6;i++){float y=bottom+((time*260+i*95)%(CH-40));batch.draw(a.pixel,W/2f-200,y,400,2);}}
    }
    /** Lightning (a trunk with branches) and the shockwave rings. */
    private void trialShapes(ShapeRenderer shapes,float time,float tt){
        float struck=tt-TRIAL,cx=W/2f+shake(struck,time),hit=BASE+330;
        Gdx.gl.glEnable(GL20.GL_BLEND);shapes.begin(ShapeRenderer.ShapeType.Filled);
        // tightening rings while the charge builds
        if(struck<0&&struck>-1.1f){float c=clamp((struck+1.1f)/1.1f);for(int k=0;k<3;k++){float r=(1-((c+k/3f)%1f))*300+20;shapes.setColor(1,.3f,.2f,.35f*((c+k/3f)%1f));ring(shapes,cx,hit-40,r,r*.55f,3);}}
        if(struck>-.12f&&struck<.5f){
            if(MathUtils.random()<.55f)boltSeed=MathUtils.random(1L<<30);var rnd=new java.util.Random(boltSeed);float fade=struck<0?.6f:1-Math.max(0,struck)/.5f;
            float x=cx+(rnd.nextFloat()-.5f)*120,y=H;
            for(int seg=0;seg<12;seg++){float k=(seg+1)/12f,nx=MathUtils.lerp(x,cx,k*.5f)+(seg<11?(rnd.nextFloat()-.5f)*90:0),ny=MathUtils.lerp(H,hit,k);if(seg==11)nx=cx;
                bolt(shapes,x,y,nx,ny,fade,14);
                if(seg>1&&seg<10&&rnd.nextFloat()<.45f){float bx=nx,by=ny,dir=rnd.nextBoolean()?1:-1;for(int b=0;b<4;b++){float ex=bx+dir*(30+rnd.nextFloat()*60),ey=by-(30+rnd.nextFloat()*50);bolt(shapes,bx,by,ex,ey,fade*.8f,6);bx=ex;by=ey;}}
                x=nx;y=ny;}}
        // shockwave across the floor
        if(struck>0&&struck<1.1f){float k=struck/1.1f;shapes.setColor(.85f,.92f,1,.7f*(1-k));ring(shapes,cx,BASE+30,60+k*720,(60+k*720)*.22f,6*(1-k)+1);shapes.setColor(1,.5f,.3f,.5f*(1-k));ring(shapes,cx,BASE+30,40+k*480,(40+k*480)*.22f,3);}
        shapes.end();
    }
    private static void bolt(ShapeRenderer s,float x,float y,float nx,float ny,float a,float w){s.setColor(1,.35f,.3f,.35f*a);s.rectLine(x,y,nx,ny,w);s.setColor(1,.8f,.75f,.75f*a);s.rectLine(x,y,nx,ny,w*.45f);s.setColor(1,1,1,a);s.rectLine(x,y,nx,ny,Math.max(1.5f,w*.18f));}
    private static void ring(ShapeRenderer s,float cx,float cy,float rx,float ry,float w){int n=40;for(int i=0;i<n;i++){float a=i*MathUtils.PI2/n,b=(i+1)*MathUtils.PI2/n;s.rectLine(cx+MathUtils.cos(a)*rx,cy+MathUtils.sin(a)*ry,cx+MathUtils.cos(b)*rx,cy+MathUtils.sin(b)*ry,w);}}
    private static String place(int rank,boolean ru){return ru?rank+" МЕСТО":rank==1?"1ST PLACE":rank==2?"2ND PLACE":"3RD PLACE";}
}
