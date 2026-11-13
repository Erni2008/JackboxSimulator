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
    private static final float OPEN=1.7f,REVEAL=2.3f,HOLD=2.6f,TRIAL=3.0f;
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

    void draw(ShapeRenderer shapes,SpriteBatch batch,SbPaint paint,SystemBreachHostAssets assets,PodiumCharacters characters,boolean ru,float time){
        if(t<0)return;float we=winnersEnd(),trial=loser==null?0:clamp((t-we)/.6f),winFade=1-trial;
        float dim=Math.min(.95f,t/.7f*.95f),ghostK=loser==null?0:clamp((t-we-TRIAL)/1.2f);
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
        else{float tt=t-we;boolean done=tt>TRIAL;head=done?(ru?loser.name+" — ТЕПЕРЬ ПРИЗРАК":loser.name+" IS NOW A GHOST"):(ru?"ПОСЛЕДНЕЕ МЕСТО":"LAST PLACE");hc=done?GHOST:SbPaint.RED;ha=trial*(done?1:(.65f+.35f*MathUtils.sin(time*9)));}
        float slam=t<.5f?1+(1-outCubic(t/.5f))*.6f:1,jit=t<OPEN&&MathUtils.random()<.08f?MathUtils.random(-8,8):0;
        assets.stage.getData().setScale(slam);paint.centered(batch,assets.stage,paint.fit(assets.stage,head,W-200),W/2f+jit,H-120,hc,ha);assets.stage.getData().setScale(1);
        // the trial: shaking, struck, turned into a ghost floating away
        if(loser!=null&&trial>0){float tt=t-we,struck=tt-TRIAL;float shake=struck<0?clamp(tt/TRIAL)*12:0;
            float g=clamp(struck/1.2f),rise=struck>0?outCubic(struck/3.5f)*160:0,sway=struck>0?MathUtils.sin(time*1.8f)*18*g:0;
            float r=1-(1-GHOST.r*.5f)*g,gg=1-(1-GHOST.g)*g-(struck<0?.35f*clamp(tt/TRIAL):0),b=1-(1-GHOST.b)*g-(struck<0?.35f*clamp(tt/TRIAL):0),a=trial*(1-.45f*g);
            float cx=W/2f+MathUtils.random(-shake,shake)+sway,bottom=BASE+40+rise;
            if(g>0){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(GHOST.r,GHOST.g,GHOST.b,.35f*g*(.8f+.2f*MathUtils.sin(time*3)));batch.draw(assets.glow,cx-260,bottom-80,520,720);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            characters.drawAt(batch,loser,cx,bottom,520,520,r,Math.max(0,gg),Math.max(0,b),a,0);
            if(g>0){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);   // cold glow of the spirit plus a drifting after-image
                characters.drawAt(batch,loser,cx,bottom,520,520,GHOST.r,GHOST.g,GHOST.b,.55f*g,0);characters.drawAt(batch,loser,cx+MathUtils.sin(time*2.3f)*18,bottom+26,520,520,GHOST.r,GHOST.g,GHOST.b,.2f*g,0);
                batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            float la=trial*clamp((tt-.3f)/.4f);
            paint.centered(batch,assets.stageName,loser.name,W/2f,BASE-6,struck>0?GHOST:SbPaint.IVORY,la);
            paint.centered(batch,assets.label,struck>0?(ru?"ДОСТУП АННУЛИРОВАН · "+loser.ap+" AP":"ACCESS REVOKED · "+loser.ap+" AP"):(ru?"ВИРУС ВЫНОСИТ ПРИГОВОР…":"THE VIRUS PASSES SENTENCE…"),W/2f,BASE-62,struck>0?GHOST:SbPaint.RED,la);
            // red scan bars across the condemned
            if(struck<0){batch.setColor(1,.1f,.05f,.25f*trial);for(int i=0;i<6;i++){float y=BASE+((time*260+i*95)%560);batch.draw(assets.pixel,W/2f-220,y,440,3);}}
            // the strike: white-out that fades
            if(struck>0&&struck<.7f){batch.setColor(1,1,1,(1-struck/.7f)*.9f);batch.draw(assets.pixel,0,0,W,H);}
        }
        batch.setColor(1,1,1,1);batch.end();
        // lightning bolts at the moment of execution
        if(loser!=null&&trial>0){float struck=t-we-TRIAL;if(struck>-.15f&&struck<.9f){
            if(MathUtils.random()<.5f)boltSeed=MathUtils.random(1L<<30);var rnd=new java.util.Random(boltSeed);
            shapes.begin(ShapeRenderer.ShapeType.Filled);for(int bolt=0;bolt<3;bolt++){float x=W/2f+(rnd.nextFloat()-.5f)*500,y=H,tx=W/2f+(rnd.nextFloat()-.5f)*80,ty=BASE+300;
                for(int seg=0;seg<9;seg++){float k=(seg+1)/9f,nx=MathUtils.lerp(x,tx,k)+(seg<8?(rnd.nextFloat()-.5f)*110:0),ny=MathUtils.lerp(H,ty,k);
                    shapes.setColor(1,.35f,.3f,.55f);shapes.rectLine(x,y,nx,ny,9);shapes.setColor(1,.95f,.95f,1);shapes.rectLine(x,y,nx,ny,3);x=nx;y=ny;}}
            shapes.end();}}
    }
    private static String place(int rank,boolean ru){return ru?rank+" МЕСТО":rank==1?"1ST PLACE":rank==2?"2ND PLACE":"3RD PLACE";}
}
