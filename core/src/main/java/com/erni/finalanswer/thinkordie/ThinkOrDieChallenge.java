package com.erni.finalanswer.thinkordie;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.math.Interpolation;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.scenes.scene2d.Actor;
import com.badlogic.gdx.scenes.scene2d.Touchable;
import com.badlogic.gdx.utils.Disposable;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import java.util.*;
import java.util.function.LongSupplier;

/**
 * THINK OR DIE as a challenge inside the main match. It draws over the current floor (the room's own background stays
 * visible): a neon wash with drifting particles, then logo, one-time rules, the category, a neon ring timer and the
 * grouped answer reveal. The characters stay where the classic quiz keeps them (top bar, {@code QuestionPlayers});
 * this actor never draws there. Reads server snapshots only; no network, no blocking work on the render thread.
 */
public final class ThinkOrDieChallenge extends Actor implements Disposable {
    // neon palette: red, violet, electric blue on black, metallic white text
    static final Color RED=new Color(1f,.16f,.30f,1),VIOLET=new Color(.62f,.24f,1f,1),BLUE=new Color(.16f,.62f,1f,1),
        BLACK=new Color(.02f,.01f,.05f,1),METAL=new Color(.90f,.93f,1f,1),DIM=new Color(.66f,.68f,.82f,1),
        GOLD=new Color(1f,.80f,.22f,1),CYAN=new Color(.30f,.88f,1f,1),ORANGE=new Color(1f,.56f,.16f,1),GREY=new Color(.55f,.56f,.64f,1),
        CARD=new Color(.05f,.03f,.10f,.92f);
    private final ThinkOrDieArt art=new ThinkOrDieArt();
    private final LongSupplier now;
    private JsonObject tod;private final Map<String,String> character=new HashMap<>(),names=new HashMap<>();
    private String session="",phase="",lang="en";
    private float mix,clock;private boolean active;
    private int lastSecond=-1;
    private final float[] px=new float[48],py=new float[48],ps=new float[48];
    private long blipAt;

    public ThinkOrDieChallenge(LongSupplier serverNow){
        now=serverNow;setTouchable(Touchable.disabled);setName("thinkOrDieChallenge");
        for(int i=0;i<px.length;i++){px[i]=MathUtils.random();py[i]=MathUtils.random();ps[i]=.3f+MathUtils.random();}
    }
    /** @param root the room snapshot (players + thinkOrDie); null ends the challenge (the neon fades away). */
    public void apply(JsonObject root){
        JsonObject t=root==null||!root.has("thinkOrDie")?null:root.getAsJsonObject("thinkOrDie");
        if(t==null||!t.has("integrated")||!t.get("integrated").getAsBoolean()){active=false;return;}
        if(root.has("players"))for(JsonElement e:root.getAsJsonArray("players")){JsonObject p=e.getAsJsonObject();String id=p.get("id").getAsString();
            if(p.has("characterId"))character.put(id,p.get("characterId").getAsString());if(p.has("name"))names.put(id,p.get("name").getAsString());}
        String s=t.get("sessionId").getAsString();
        if(!s.equals(session)){session=s;lastSecond=-1;}
        String ph=t.get("phase").getAsString();
        if(!ph.equals(phase)){onPhase(ph,t);phase=ph;}
        tod=t;active=true;lang=t.has("lang")?t.get("lang").getAsString():"en";
    }
    /** true while the challenge is running or its neon is still fading out. */
    public boolean visible(){return active||mix>0;}
    public boolean running(){return active;}
    public String phase(){return active?phase:"";}
    /** Answer-counter sound, throttled so eight fast typists never become noise. */
    public void blip(){long t=System.currentTimeMillis();if(t-blipAt<140)return;blipAt=t;art.play("sounds/impostor/vote_sent.wav",.22f);}

    private void onPhase(String ph,JsonObject t){
        switch(ph){
            case "INTRO"->art.play("sounds/cursed_boxes/appearance.wav",.7f);
            case "CATEGORY_REVEAL"->art.play("sounds/impostor/vote_started.wav",.6f);
            case "ANSWER_VALIDATION"->art.play("sounds/questions/door_lock(done).wav",.6f);
            case "ANSWER_REVEAL"->art.play("sounds/results/winner_impact.wav",.55f);
            case "ROUND_RESULTS"->art.play("sounds/results/count_tick.wav",.6f);
            default->{}
        }
    }
    private String tr(String ru,String en){return "ru".equals(lang)?ru:en;}
    private long ms(String k){return tod!=null&&tod.has(k)?tod.get(k).getAsLong():0;}
    private float since(){return Math.max(0,(now.getAsLong()-ms("phaseStartedAt"))/1000f);}
    private float left(){long e=ms("phaseEndsAt");return e<0?0:Math.max(0,(e-now.getAsLong())/1000f);}

    @Override public void act(float delta){
        super.act(delta);clock+=delta;
        mix=MathUtils.clamp(mix+(active?1:-1)*delta/(active?.9f:1.1f),0,1);
        for(int i=0;i<px.length;i++){py[i]+=delta*.025f*ps[i];if(py[i]>1.05f){py[i]=-.05f;px[i]=MathUtils.random();}}
        if(active&&"ANSWERING".equals(phase)){int s=(int)Math.ceil(left());if(s!=lastSecond){lastSecond=s;if(s>0&&s<=5)art.play("sounds/results/count_tick.wav",.35f+.08f*(5-s));}}
    }
    @Override public void draw(Batch batch,float parentAlpha){
        if(mix<=0||!(batch instanceof SpriteBatch sb))return;
        art.batch=sb;Color saved=new Color(batch.getColor());
        float w=getStage().getViewport().getWorldWidth(),h=getStage().getViewport().getWorldHeight(),a=mix*parentAlpha;
        try{
            atmosphere(w,h,a);
            if(tod==null)return;
            float content=active?a:a*.9f;
            switch(phase){
                case "INTRO"->intro(w,h,content);
                case "CATEGORY_REVEAL"->{logo(w,h,content);category(w,h,content,Interpolation.swingOut.apply(Math.min(1,since()/.55f)));}
                case "ANSWERING"->{logo(w,h,content);category(w,h,content,1);timer(w,h,content);hint(w,content);edgePulse(w,h,content);}
                case "ANSWER_VALIDATION","DISPUTE"->{logo(w,h,content);category(w,h,content*.85f,1);checking(w,h,content);}
                case "ANSWER_REVEAL","ROUND_RESULTS","FINAL_RESULTS","COMPLETED"->{logo(w,h,content);reveal(w,h,content);}
                default->{}
            }
        }finally{batch.setColor(saved);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
    }

    /** The floor turns neon: a dark wash keeps text readable, coloured light from the edges, slow particles. */
    private void atmosphere(float w,float h,float a){
        art.rect(0,0,w,h,BLACK,.52f*a);
        float pulse=.5f+.5f*MathUtils.sin(clock*.9f);
        art.glow(0,h*.45f,w*.55f,h*1.2f,VIOLET,(.20f+.06f*pulse)*a);
        art.glow(w,h*.45f,w*.55f,h*1.2f,BLUE,(.18f+.06f*(1-pulse))*a);
        art.glow(w/2,-40,w*1.2f,260,RED,.22f*a);
        art.rect(0,0,w,2,RED,.55f*a);
        batch().setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        for(int i=0;i<px.length;i++){Color c=i%3==0?RED:i%3==1?VIOLET:BLUE;float s=3+4*ps[i];
            art.batch.setColor(c.r,c.g,c.b,.35f*a*(.4f+.6f*MathUtils.sin(clock*2+i)));art.batch.draw(art.soft,px[i]*w-s*3,py[i]*h*.80f-s*3,s*6,s*6);}
        batch().setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
    }
    private SpriteBatch batch(){return art.batch;}
    /** Flat glass plate for the neon look: dark fill, thin neon rim, soft outer glow (no gloss band across text). */
    private void neonPlate(float x,float y,float w,float h,Color fill,Color rim,float a){
        if(a<=0||w<=1||h<=1)return;
        art.glow(x+w/2,y+h/2,w*1.12f,h*1.7f,rim,.16f*a);
        art.batch.setColor(0,0,0,.40f*a);art.np(art.plateFill,x+4,y-8,w,h);
        art.batch.setColor(fill.r,fill.g,fill.b,fill.a*a);art.np(art.plateFill,x,y,w,h);
        art.batch.setColor(rim.r,rim.g,rim.b,a);art.np(art.plateEdge,x,y,w,h);
    }

    /** "THINK OR DIE" in neon letters; small in the corner during the challenge. */
    private void wordmark(float cx,float y,float scale,float a){
        float w1=art.width(art.display,"THINK ",scale),w2=art.width(art.display,"OR ",scale),w3=art.width(art.display,"DIE",scale),x=cx-(w1+w2+w3)/2;
        float flick=.85f+.15f*MathUtils.sin(clock*13)*MathUtils.sin(clock*3.1f);
        art.glow(cx,y-art.display.getLineHeight()*scale*.35f,(w1+w2+w3)*1.25f,art.display.getLineHeight()*scale*1.6f,VIOLET,.35f*a);
        art.left(art.display,"THINK ",x,y,scale,METAL,a,0);
        art.left(art.display,"OR ",x+w1,y,scale,BLUE,a,0);
        art.left(art.display,"DIE",x+w1+w2,y,scale,RED,a*flick,0);
    }
    private void logo(float w,float h,float a){wordmark(170,h-200,.30f,a);}
    private void intro(float w,float h,float a){
        float t=since();boolean rules=tod.has("rules")&&tod.get("rules").getAsBoolean();
        float slam=Math.min(1,t/.45f),scale=Math.max(.05f,.95f*(1.6f-.6f*Interpolation.pow3Out.apply(slam)));
        if(!rules||t<2.2f){float k=rules&&t>1.8f?Math.max(0,1-(t-1.8f)/.4f):1;wordmark(w/2,h*.52f+60,scale,a*Math.min(1,t/.2f)*k);
            if(t<.6f)art.glow(w/2,h*.48f,w*(.5f+t),h*.6f,RED,.4f*(1-t/.6f)*a);}
        if(rules&&t>=2f){float k=Math.min(1,(t-2f)/.35f);
            logo(w,h,a*k);
            float cw=1100,ch=360,x=w/2-cw/2,y=h*.42f-ch/2+(1-k)*-30;
            neonPlate(x,y,cw,ch,CARD,VIOLET,a*k);
            art.text(art.big,tr("ПРАВИЛА","HOW IT WORKS"),w/2,y+ch-40,.7f,METAL,a*k,cw-60);
            String[][] lines={{tr("Пишите на телефоне как можно больше ответов по категории","Type as many answers as you can on your phone"),""},
                {tr("Уникальный ответ: +200 душ · у двоих: +100 · у троих: +25","Only you: +200 souls · two players: +100 · three: +25"),""},
                {tr("Четыре и больше совпадений, ошибка или повтор: 0","Four or more matches, wrong or repeated: 0"),""},
                {tr("Призрак с пятью уникальными ответами оживает","A ghost with five unique answers comes back to life"),""}};
            for(int i=0;i<lines.length;i++){float d=Math.min(1,Math.max(0,(t-2.2f-i*.25f)/.3f));
                art.text(art.small,lines[i][0],w/2,y+ch-120-i*58,.95f,i==3?CYAN:METAL,a*d,cw-80);}
        }
    }
    private String categoryText(){return tod.has("textRu")?("ru".equals(lang)?tod.get("textRu").getAsString():tod.get("textEn").getAsString()):"";}
    private void category(float w,float h,float a,float zoom){
        String text=categoryText();if(text.isEmpty())return;
        float cw=1000*Math.max(.05f,zoom),ch=230*Math.max(.05f,zoom),cx=w*.45f,cy=h*.45f;
        neonPlate(cx-cw/2,cy-ch/2,cw,ch,CARD,RED,a);
        art.text(art.tiny,tr("КАТЕГОРИЯ","CATEGORY"),cx,cy+ch/2-22,.95f*zoom,RED,a,0);
        if(zoom>.6f)art.paragraph(art.big,text,cx,cy+ch/2-58,cw-80,.78f,ch-90,METAL,a);
    }
    /** Neon ring: electric blue, red in the last five seconds with a growing pulse. */
    private void timer(float w,float h,float a){
        float total=Math.max(1,ms("answerMs")/1000f),rem=left(),frac=MathUtils.clamp(rem/total,0,1);
        boolean hot=rem<=5;float k=hot?(5-rem)/5:0,beat=hot?.5f+.5f*MathUtils.sin(clock*(8+6*k)):0;
        float cx=w*.885f,cy=h*.45f,r=104+(hot?6*beat*k:0);Color c=hot?RED:BLUE;
        art.glow(cx,cy,r*3.2f,r*3.2f,c,(.16f+.25f*k*beat)*a);
        art.batch.setColor(BLACK.r,BLACK.g,BLACK.b,.85f*a);art.batch.draw(art.soft,cx-r*1.15f,cy-r*1.15f,r*2.3f,r*2.3f);
        int seg=96;for(int i=0;i<seg;i++){float f=i/(float)seg;float a0=90-360*f,a1=90-360*(f+1f/seg);
            boolean on=f<frac;Color col=on?c:DIM;float al=on?a:a*.18f;
            art.line(cx+MathUtils.cosDeg(a0)*r,cy+MathUtils.sinDeg(a0)*r,cx+MathUtils.cosDeg(a1)*r,cy+MathUtils.sinDeg(a1)*r,on?9:5,col,al,on);}
        String s=Integer.toString((int)Math.ceil(rem));
        art.text(art.display,s,cx,cy+art.display.getLineHeight()*.62f*.36f+6,.62f*(hot?1+.08f*beat:1),hot?RED:METAL,a,0);
        art.text(art.tiny,tr("СЕКУНД","SECONDS"),cx,cy-46,.85f,DIM,a,0);
    }
    private void hint(float w,float a){
        float k=.75f+.25f*MathUtils.sin(clock*2.4f);
        art.text(art.small,tr("Отвечайте с телефона · чем больше, тем лучше","Answer on your phone · the more the better"),w*.45f,92,.9f,METAL,a*k,w*.8f);
    }
    /** Last five seconds: a soft red pulse grows from the screen edges. */
    private void edgePulse(float w,float h,float a){
        float rem=left();if(rem>5)return;float k=(5-rem)/5,beat=.5f+.5f*MathUtils.sin(clock*(7+7*k));float al=(.10f+.32f*k)*(.55f+.45f*beat)*a;
        art.glow(w/2,0,w*1.4f,220+120*k,RED,al);art.glow(w/2,h,w*1.4f,220+120*k,RED,al);
        art.glow(0,h/2,260+140*k,h*1.4f,RED,al);art.glow(w,h/2,260+140*k,h*1.4f,RED,al);
    }
    private void checking(float w,float h,float a){
        float cx=w*.885f,cy=h*.45f;
        for(int i=0;i<12;i++){float ang=-clock*240+i*30;float al=(i/12f)*a;
            art.line(cx+MathUtils.cosDeg(ang)*60,cy+MathUtils.sinDeg(ang)*60,cx+MathUtils.cosDeg(ang)*90,cy+MathUtils.sinDeg(ang)*90,7,VIOLET,al,true);}
        art.text(art.small,tr("ПРОВЕРКА","CHECKING"),cx,cy-120,.9f,METAL,a,0);
    }

    // ---------------------------------------------------------------- reveal
    private Color statusColor(String st){return switch(st){case "UNIQUE"->GOLD;case "SHARED"->CYAN;case "MANY"->ORANGE;case "CROWD","INVALID","REJECTED"->RED;default->GREY;};}
    private String statusName(String st){return switch(st){case "UNIQUE"->tr("УНИКАЛЬНО","UNIQUE");case "SHARED"->tr("У ДВОИХ","TWO PLAYERS");case "MANY"->tr("У ТРОИХ","THREE PLAYERS");
        case "CROWD"->tr("У ВСЕХ","EVERYONE");case "INVALID"->tr("НЕВЕРНО","WRONG");case "REJECTED"->tr("ОТКЛОНЕНО","REJECTED");default->tr("СПОРНО","UNDECIDED");};}

    private void reveal(float w,float h,float a){
        JsonArray rv=tod.has("reveal")?tod.getAsJsonArray("reveal"):new JsonArray();
        boolean results=!phase.equals("ANSWER_REVEAL");
        float t=phase.equals("ANSWER_REVEAL")?since():6+since();
        float top=h-205,bottom=results?250:118,left=60,right=w-60,gap=14;
        int n=rv.size();
        if(n==0){art.text(art.big,tr("НИКТО НЕ ОТВЕТИЛ","NO ANSWERS"),w/2,h*.5f,.8f,METAL,a,0);}
        else{
            int cols=n<=2?n:n<=6?3:n<=12?4:n<=20?5:6;int rowsFit=Math.max(1,(int)((top-bottom+gap)/(62+gap)));
            int perPage=cols*rowsFit,pages=(n+perPage-1)/perPage;float pageLen=6f/pages;
            int page=Math.min(pages-1,(int)(Math.min(t,5.99f)/pageLen));if(results)page=0;
            int from=page*perPage,count=Math.min(perPage,n-from);int rows=(count+cols-1)/cols;
            float cw=(right-left-(cols-1)*gap)/cols,ch=Math.min(104,(top-bottom-(rows-1)*gap)/rows);
            float blockH=rows*ch+(rows-1)*gap,y0=(top+bottom)/2+blockH/2;
            float pageT=results?9:t-page*pageLen;
            for(int i=0;i<count;i++){JsonObject c=rv.get(from+i).getAsJsonObject();
                int r=i/cols,col=i%cols;float d=MathUtils.clamp((pageT-i*.035f)/.28f,0,1);if(d<=0)continue;
                float e=Interpolation.swingOut.apply(d),x=left+col*(cw+gap),y=y0-(r+1)*ch-r*gap;
                float sw=cw*(.85f+.15f*e),sh=ch*(.85f+.15f*e);
                card(c,x+(cw-sw)/2,y+(ch-sh)/2,sw,sh,a*d*(results?.55f:1));}
            if(pages>1&&!results)art.text(art.tiny,(page+1)+" / "+pages,w/2,bottom-14,.9f,DIM,a,0);
        }
        if(results)soulsBanner(w,h,a);
    }
    private void card(JsonObject c,float x,float y,float w,float h,float a){
        String st=c.get("status").getAsString();Color col=statusColor(st);boolean wrong=st.equals("INVALID")||st.equals("REJECTED");
        neonPlate(x,y,w,h,CARD,col,a);
        art.rect(x+10,y+10,5,h-20,col,a);
        int pts=c.get("points").getAsInt();String souls=wrong||st.equals("UNCERTAIN")?"":(pts>0?"+"+pts:"0");
        float soulsW=souls.isEmpty()?0:art.width(art.mid,souls,.62f)+18;
        String label=c.get("label").getAsString();float textScale=Math.min(.62f,(h-30)/art.mid.getLineHeight()*1.1f);
        float lx=x+28,ly=y+h-16,maxW=w-56-soulsW;
        art.left(art.mid,label,lx,ly,textScale,wrong?DIM:METAL,a,maxW);
        if(wrong){float lw=Math.min(maxW,art.width(art.mid,label,textScale));art.rect(lx-4,ly-art.mid.getLineHeight()*textScale*.38f,lw+8,3,RED,a);}
        if(!souls.isEmpty())art.right(art.mid,souls,x+w-16,y+h/2+art.mid.getLineHeight()*.62f*.32f,.62f,pts>0?col:DIM,a);
        // the players who gave it: small overlapping faces, then the status word
        JsonArray who=c.has("players")?c.getAsJsonArray("players"):new JsonArray();float fr=Math.min(14,h*.16f),fx=lx+fr,fy=y+fr+10;
        if(h>=60){for(int i=0;i<who.size()&&i<8;i++){String id=who.get(i).getAsString();art.portrait(character.getOrDefault(id,""),fx+i*fr*1.45f,fy,fr,com.erni.finalanswer.ui.PlayerColors.light(character.getOrDefault(id,"")),false,a);}
            art.left(art.tiny,statusName(st),fx+Math.min(8,who.size())*fr*1.45f+6,fy+8,.72f,col,a,0);}
    }
    private void soulsBanner(float w,float h,float a){
        float t=since(),k=Math.min(1,t/.3f);
        boolean revived=false;if(tod.has("players"))for(JsonElement e:tod.getAsJsonArray("players")){var p=e.getAsJsonObject();if(p.has("roundResurrected")&&p.get("roundResurrected").getAsBoolean())revived=true;}
        float cy=150;neonPlate(w/2-360,cy-52,720,104,CARD,GOLD,a*k);
        art.text(art.big,tr("ДУШИ НАЧИСЛЕНЫ","SOULS AWARDED"),w/2,cy+24,.7f,GOLD,a*k,660);
        if(revived){float r=Math.min(1,Math.max(0,(t-.35f)/.3f));float beat=.5f+.5f*MathUtils.sin(clock*9);
            art.glow(w/2,h*.47f,1100,320,VIOLET,(.35f+.2f*beat)*a*r);
            art.text(art.display,"RESURRECTION",w/2,h*.47f+40,.62f,METAL,a*r,1200);}
    }
    @Override public void dispose(){art.dispose();}
}
