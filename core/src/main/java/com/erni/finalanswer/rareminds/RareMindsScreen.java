package com.erni.finalanswer.rareminds;

import com.erni.finalanswer.localization.Localization;
import com.erni.finalanswer.rareminds.RareMindsSounds.Cue;
import com.badlogic.gdx.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.google.gson.*;
import java.util.*;
import java.util.function.*;

/**
 * RARE MINDS — DEADLY ANSWERS, the shared (public) host screen. It is driven only by public server snapshots: the
 * question, the timer, who has locked an answer, collisions, souls, ghosts and the reveal. What players are typing
 * reaches only the host's own client and is shown on the cards live (H hides it for a stream); M opens the private
 * monitor in a browser.
 */
public final class RareMindsScreen extends ScreenAdapter {
    private static final float W=1920,H=1080;
    private final OrthographicCamera cam=new OrthographicCamera();private final FitViewport vp=new FitViewport(W,H,cam);
    private SpriteBatch batch;private RareMindsArt art;private RareMindsSounds sfx;private boolean created;
    private JsonObject state,rm;private final LongSupplier serverNow;private final Consumer<String> onEnd;private final Runnable openMonitor;
    private float clock;
    /** live typing on the cards (H hides it, e.g. while streaming) */
    private boolean liveShown=true;

    /** per-card animation state */
    private static final class Fx{float pop,shake,flash,ghost,submit,crown;boolean submittedSeen;}
    private final Map<String,Fx> fx=new HashMap<>();
    /** each player's public numbers at the end of the answer window, shown until their reveal lands */
    private final Map<String,JsonObject> before=new HashMap<>();
    private String lastPhase="";private int lastQuestion=-1,lastTick=-1,revealedUpTo=-1;private long lockStart;private boolean jackpotPlayed,winnerPlayed;
    private float questionIn,lockIn,finalIn;private int tickerIndex;private float tickerT;

    public RareMindsScreen(JsonObject snapshot,LongSupplier serverNow,Consumer<String> onEnd,Runnable openMonitor){this.serverNow=serverNow;this.onEnd=onEnd;this.openMonitor=openMonitor;apply(snapshot);}
    public String session(){return rm.get("sessionId").getAsString();}
    public void apply(JsonObject snapshot){if(!snapshot.has("rareMinds"))return;state=snapshot;rm=snapshot.getAsJsonObject("rareMinds");}

    @Override public void show(){
        if(!created){created=true;batch=new SpriteBatch();art=new RareMindsArt();art.batch=batch;sfx=new RareMindsSounds();art.big.getData().markupEnabled=true;}
        Gdx.input.setInputProcessor(new InputAdapter(){@Override public boolean keyDown(int k){
            if(k==Input.Keys.M){openMonitor.run();return true;}
            if(k==Input.Keys.H){liveShown=!liveShown;return true;}
            if((k==Input.Keys.ENTER||k==Input.Keys.ESCAPE)&&(phase().equals("FINAL_RESULTS")||phase().equals("COMPLETED"))){onEnd.accept(session());return true;}
            return false;}});
    }
    @Override public void resize(int w,int h){vp.update(w,h,true);}

    // ---------------------------------------------------------------- snapshot helpers
    private String phase(){return rm.get("phase").getAsString();}
    private long now(){return serverNow.getAsLong();}
    private long l(JsonObject o,String k){return o.has(k)&&!o.get(k).isJsonNull()?o.get(k).getAsLong():0;}
    private int i(JsonObject o,String k){return o.has(k)?o.get(k).getAsInt():0;}
    private boolean b(JsonObject o,String k){return o.has(k)&&o.get(k).getAsBoolean();}
    private String s(JsonObject o,String k){return o.has(k)&&!o.get(k).isJsonNull()?o.get(k).getAsString():"";}
    private boolean ru(){return Localization.russian();}
    private List<JsonObject> players(){List<JsonObject> o=new ArrayList<>();for(var e:rm.getAsJsonArray("players"))o.add(e.getAsJsonObject());return o;}
    private JsonObject roster(String id){for(var e:state.getAsJsonArray("players")){var o=e.getAsJsonObject();if(s(o,"id").equals(id))return o;}return new JsonObject();}
    private String name(String id){String n=s(roster(id),"name");return n.isEmpty()?"?":n;}
    private List<JsonObject> rows(){List<JsonObject> o=new ArrayList<>();if(rm.has("reveal"))for(var e:rm.getAsJsonObject("reveal").getAsJsonArray("rows"))o.add(e.getAsJsonObject());return o;}
    private JsonObject row(String id){for(var r:rows())if(s(r,"playerId").equals(id))return r;return null;}
    private JsonObject live(String id){if(rm.has("live"))for(var e:rm.getAsJsonArray("live")){var o=e.getAsJsonObject();if(s(o,"id").equals(id))return o;}return null;}
    private Fx fx(String id){return fx.computeIfAbsent(id,k->new Fx());}
    private int tierIndex(String id){String[] t={"COMMON","UNCOMMON","RARE","EPIC","LEGENDARY","MYTHIC"};for(int k=0;k<t.length;k++)if(t[k].equals(id))return k;return 0;}
    private String tierName(String id){for(var e:rm.getAsJsonArray("tiers")){var t=e.getAsJsonObject();if(s(t,"id").equals(id))return ru()?s(t,"ru"):s(t,"en");}return id;}
    private String answerLabel(JsonObject r){return b(r,"valid")?(ru()?s(r,"labelRu"):s(r,"labelEn")):s(r,"text");}
    private boolean revealPhase(){String p=phase();return p.equals("ANSWERS_LOCKED")||p.equals("REVEALING_RESULTS");}
    private float revealAt(int index){return .55f+.34f*index;}
    private float sinceLock(){return (now()-lockStart)/1000f;}
    private boolean revealed(String id){if(!revealPhase())return phase().equals("FINAL_RESULTS")||phase().equals("COMPLETED");var ps=players();for(int k=0;k<ps.size();k++)if(s(ps.get(k),"id").equals(id))return sinceLock()>=revealAt(k);return false;}
    /** what a card shows: the live public values, or the values from before this question until its reveal lands */
    private JsonObject shown(JsonObject p){String id=s(p,"id");if(revealPhase()&&!revealed(id)&&before.containsKey(id))return before.get(id);return p;}

    // ---------------------------------------------------------------- events → sound and motion
    private void events(float dt){
        String ph=phase();int q=i(rm,"question");
        if(!ph.equals(lastPhase)||q!=lastQuestion){
            if(ph.equals("QUESTION_ACTIVE")){questionIn=0;revealedUpTo=-1;jackpotPlayed=false;sfx.play(b(rm,"finalQuestion")?Cue.FINAL:Cue.QUESTION);if(b(rm,"finalQuestion"))finalIn=0;for(Fx f:fx.values()){f.submittedSeen=false;f.submit=0;}}
            if(ph.equals("ANSWERS_LOCKED")){lockStart=l(rm,"phaseStartedAt");lockIn=0;sfx.play(Cue.LOCK);}
            if(ph.equals("REVEALING_RESULTS")&&!lastPhase.equals("ANSWERS_LOCKED"))lockStart=l(rm,"phaseStartedAt")-1200;
            if(ph.equals("FINAL_RESULTS")&&!winnerPlayed){winnerPlayed=true;sfx.play(Cue.WINNER);}
            lastPhase=ph;lastQuestion=q;tickerIndex=0;tickerT=0;
        }
        if(ph.equals("QUESTION_ACTIVE")){
            for(var p:players()){String id=s(p,"id");before.put(id,p);Fx f=fx(id);if(b(p,"submitted")&&!f.submittedSeen){f.submittedSeen=true;f.submit=0;sfx.play(Cue.SUBMIT);}}
            long left=l(rm,"phaseEndsAt")-now();int sec=(int)Math.ceil(left/1000.0);if(sec<=5&&sec>=1&&sec!=lastTick){lastTick=sec;sfx.play(Cue.TICK);}
        }
        if(revealPhase()){
            var ps=players();
            for(int k=revealedUpTo+1;k<ps.size()&&sinceLock()>=revealAt(k);k++){
                revealedUpTo=k;String id=s(ps.get(k),"id");JsonObject r=row(id);Fx f=fx(id);f.pop=0;sfx.play(Cue.REVEAL);if(r==null)continue;
                JsonObject old=before.get(id);
                if(b(r,"collided")){f.shake=1;f.flash=1;sfx.play(Cue.COLLISION);}
                if(b(r,"eliminated")){f.ghost=0;sfx.death(s(roster(id),"characterId"));}
                else if(b(r,"alive")&&i(r,"collisions")==2&&(old==null||i(old,"collisions")<2))sfx.play(Cue.DEATH_ZONE);
                if(b(r,"ghostSuccess"))sfx.play(Cue.GHOST_OK);
                if(b(r,"resurrectionLost"))sfx.play(Cue.GHOST_LOST);
                if(b(r,"resurrected")){f.flash=1;sfx.play(Cue.RESURRECT);}
            }
            if(!jackpotPlayed&&sinceLock()>=revealAt(ps.size())+.3f){jackpotPlayed=true;String w=s(rm.getAsJsonObject("reveal"),"jackpotWinner");if(!w.isEmpty()){fx(w).crown=0;sfx.play(Cue.JACKPOT);}}
        }
        for(Fx f:fx.values()){f.pop=Math.min(1,f.pop+dt*3);f.shake=Math.max(0,f.shake-dt*2.2f);f.flash=Math.max(0,f.flash-dt*1.4f);f.ghost=Math.min(1,f.ghost+dt*1.2f);f.submit=Math.min(1,f.submit+dt*3.5f);f.crown=Math.min(1,f.crown+dt*2);}
        questionIn=Math.min(1,questionIn+dt*2.4f);lockIn=Math.min(1,lockIn+dt*3);finalIn=Math.min(1,finalIn+dt*.8f);
    }

    // ---------------------------------------------------------------- frame
    @Override public void render(float dt){
        clock+=dt;sfx.update(dt);events(dt);
        ScreenUtils.clear(0,0,0,1);vp.apply();batch.setProjectionMatrix(cam.combined);batch.begin();
        batch.setColor(Color.WHITE);batch.draw(art.background,0,0,W,H);
        boolean fin=b(rm,"finalQuestion")&&!phase().equals("INITIALIZING");
        if(fin){float p=.5f+.5f*MathUtils.sin(clock*2.2f);art.glow(W/2,H*.55f,W*1.5f,H*1.3f,RareMindsArt.RED,.10f+.06f*p);}
        header(fin);
        rules();timer();rarity(fin);
        String ph=phase();
        if(ph.equals("FINAL_RESULTS")||ph.equals("COMPLETED"))standings();
        else{questionPanel(ph,fin);cards();}
        ticker();
        art.textRight(art.tiny,(liveShown?Localization.tr("H · скрыть ввод","H · hide typing"):Localization.tr("H · показать ввод","H · show typing"))+"    "+Localization.tr("M · монитор","M · monitor"),W-28,30,.8f,RareMindsArt.DIM,.45f);
        batch.end();
    }

    private void spaced(BitmapFont f,String s,float cx,float y,float scale,float gap,Color c,float a){
        float total=0;for(int k=0;k<s.length();k++)total+=art.width(f,String.valueOf(s.charAt(k)),scale)+(k<s.length()-1?gap:0);
        float x=cx-total/2;for(int k=0;k<s.length();k++){String ch=String.valueOf(s.charAt(k));art.textLeft(f,ch,x,y,scale,c,a);x+=art.width(f,ch,scale)+gap;}
    }
    private void header(boolean fin){
        spaced(art.tiny,"FINAL ANSWER",W/2,1056,1,9,RareMindsArt.IVORY,.75f);
        art.text(art.title,"RARE MINDS",W/2,1028,1,RareMindsArt.GOLD,1,0);
        spaced(art.small,"DEADLY ANSWERS",W/2,918,.8f,10,fin?RareMindsArt.RED_SOFT:RareMindsArt.RED,1);
    }
    private void rules(){
        float x=63,y=470,w=304,h=386;art.panel(x,y,w,h,1,null);
        art.text(art.mid,Localization.tr("ПРАВИЛА","RULES"),x+w/2,y+h-26,.92f,RareMindsArt.GOLD,1,0);art.ornament(x+w/2,y+h-72,200,RareMindsArt.GOLD,.7f);
        String[][] r={{"skull",Localization.tr("3 совпадения, и ты выбываешь","3 collisions and you are out")},{"gem",Localization.tr("Чем реже ответ, тем больше душ","The rarer the answer, the more souls")},
            {"crown",Localization.tr("Самый редкий ответ берёт джекпот","The rarest answer takes the jackpot")},{"ghost",Localization.tr("Призрак воскресает, если отвечает уникально","Ghosts return by staying unique")}};
        float ry=y+h-92;
        for(String[] e:r){
            float iy=ry-32;
            switch(e[0]){
                case "skull"->{batch.setColor(RareMindsArt.RED);batch.draw(art.skull,x+18,iy-20,42,42);}
                case "gem"->art.gem(x+39,iy+1,15,RareMindsArt.TIER[5],1);
                case "crown"->{batch.setColor(RareMindsArt.GOLD);batch.draw(art.crown,x+16,iy-22,46,46);}
                default->{batch.setColor(RareMindsArt.GHOST);batch.draw(art.skull,x+18,iy-20,42,42);}
            }
            art.tiny.getData().setScale(.92f);art.gl.setText(art.tiny,e[1],RareMindsArt.IVORY,w-90,com.badlogic.gdx.utils.Align.left,true);float th=art.gl.height;art.tiny.getData().setScale(1);
            art.tiny.getData().setScale(.92f);art.tiny.setColor(0,0,0,.7f);art.tiny.draw(batch,e[1],x+74,iy+th/2+1,w-90,com.badlogic.gdx.utils.Align.left,true);
            art.tiny.setColor(RareMindsArt.IVORY);art.tiny.draw(batch,e[1],x+72,iy+th/2+3,w-90,com.badlogic.gdx.utils.Align.left,true);art.tiny.getData().setScale(1);
            ry-=68;
        }
        art.text(art.tiny,Localization.tr("Победитель: +500 душ","Winner: +500 souls"),x+w/2,y+30,.9f,RareMindsArt.GOLD,1,w-30);
    }
    private void timer(){
        float cx=1722,cy=905,r=88;String ph=phase();
        art.plaque(cx,1030,300,42,1,null);art.text(art.small,Localization.tr("ВРЕМЯ НА ОТВЕТ","TIME TO ANSWER"),cx,1043,.72f,RareMindsArt.IVORY,1,270);
        long ends=l(rm,"phaseEndsAt"),left=Math.max(0,ends-now());
        boolean active=ph.equals("QUESTION_ACTIVE");float total=Math.max(1,l(rm,"answerMs"));
        float frac=active?MathUtils.clamp(left/total,0,1):ph.equals("INITIALIZING")?1:0;
        boolean hurry=active&&left<5000;float pulse=hurry?.5f+.5f*MathUtils.sin(clock*12):0;
        boolean ghostTint=false;
        art.timerRing(cx,cy,r,frac,ghostTint?RareMindsArt.GHOST:RareMindsArt.RED,1,pulse);
        String label=active||ph.equals("INITIALIZING")?String.format("%d:%02d",(left+999)/1000/60,(left+999)/1000%60):"0:00";
        art.text(art.big,label,cx,cy+26,hurry?1.02f+.06f*pulse:1f,active?RareMindsArt.RED_SOFT:RareMindsArt.DIM,1,0);
    }
    private void rarity(boolean fin){
        float x=1521,y=470,w=367,h=300;art.panel(x,y,w,h,1,null);
        art.text(art.small,Localization.tr("РЕДКОСТЬ ОТВЕТА","ANSWER RARITY"),x+w/2,y+h-20,.82f,RareMindsArt.IVORY,1,w-30);
        int mult=fin?2:1;float ry=y+h-58;
        var tiers=rm.getAsJsonArray("tiers");
        for(int k=0;k<tiers.size();k++){var t=tiers.get(k).getAsJsonObject();Color c=RareMindsArt.TIER[k];
            art.rect(x+14,ry-30,w-28,34,c,.10f);art.rect(x+14,ry-30,3,34,c,.9f);
            art.gem(x+36,ry-13,9,c,1);
            art.textLeft(art.tiny,ru()?s(t,"ru"):s(t,"en"),x+56,ry-2,.82f,c,1);
            art.textRight(art.tiny,"+"+(i(t,"souls")*mult)+Localization.tr(" душ"," souls"),x+w-24,ry-2,.82f,fin?RareMindsArt.GOLD:RareMindsArt.IVORY,1);
            ry-=34;
        }
        art.rect(x+14,y+8,w-28,30,RareMindsArt.GOLD,.14f);batch.setColor(RareMindsArt.GOLD);batch.draw(art.crown,x+22,y+8,30,30);
        art.textLeft(art.tiny,Localization.tr("ДЖЕКПОТ","JACKPOT"),x+60,y+32,.82f,RareMindsArt.GOLD,1);
        art.textRight(art.tiny,"+"+i(rm,"jackpot")+Localization.tr(" душ"," souls"),x+w-24,y+32,.82f,RareMindsArt.GOLD,1);
    }

    // ---------------------------------------------------------------- centre
    private void questionPanel(String ph,boolean fin){
        float x=430,y=470,w=1060,h=290,cx=x+w/2;
        art.panel(x,y,w,h,1,fin?RareMindsArt.RED:null);
        if(fin)art.glow(cx,y+h/2,w*1.1f,h*1.4f,RareMindsArt.RED,.12f+.06f*MathUtils.sin(clock*3));
        String tab=ph.equals("INITIALIZING")?Localization.tr("КАК ИГРАТЬ","HOW TO PLAY"):fin?Localization.tr("ПОСЛЕДНИЙ ОТВЕТ","THE LAST ANSWER"):Localization.tr("ВОПРОС ","QUESTION ")+i(rm,"question")+" / "+i(rm,"questions");
        art.plaque(cx,y+h,Math.max(330,art.width(art.mid,tab,.86f)+90),58,1,fin?RareMindsArt.RED:null);
        art.text(art.mid,tab,cx,y+h+15,.86f,fin?RareMindsArt.RED_SOFT:RareMindsArt.IVORY,1,0);
        if(ph.equals("INITIALIZING")){
            float t=Math.max(0,(l(rm,"phaseEndsAt")-now())/1000f);
            art.paragraph(art.big,Localization.tr("Назови верный ответ, который не придёт в голову никому другому","Give a valid answer nobody else will think of"),cx,y+h-50,w-120,.82f,RareMindsArt.IVORY,1);
            art.ornament(cx,y+106,520,RareMindsArt.GOLD,.7f);
            art.text(art.small,Localization.tr("Совпадения ставят черепа · Редкость приносит души · 8 вопросов","Collisions cost skulls · Rarity pays souls · 8 questions"),cx,y+84,.8f,RareMindsArt.GOLD,1,w-80);
            art.text(art.small,Localization.tr("Первый вопрос через ","First question in ")+(int)Math.ceil(t),cx,y+42,.74f,RareMindsArt.DIM,1,0);
            return;
        }
        String text=ru()?s(rm,"textRu"):s(rm,"textEn");
        boolean reveal=revealPhase();
        if(!reveal){
            float a=ease(questionIn),sc=.96f+.04f*a;
            String marked=markLast(text);float ph2=art.paragraphHeight(art.big,text,w-140,sc*1.05f);
            float top=y+h/2+ph2/2+38;
            art.paragraph(art.big,marked,cx,top,w-140,sc*1.05f,RareMindsArt.IVORY,a);
            art.ornament(cx,y+86,700,RareMindsArt.GOLD,.55f*a);
            int done=0,n=0;for(var p:players()){n++;if(b(p,"submitted"))done++;}
            String line=Localization.tr("Ответили ","Locked in ")+done+" / "+n+"   ·   "+Localization.tr("Джекпот ","Jackpot ")+i(rm,"jackpot")+Localization.tr(" душ"," souls")+(fin?Localization.tr("   ·   награды ×2","   ·   rewards ×2"):"");
            art.text(art.small,line,cx,y+62,.82f,fin?RareMindsArt.RED_SOFT:RareMindsArt.GOLD,a,w-80);
            return;
        }
        // reveal: the question shrinks to the top, the centre tells the story of this question
        art.text(art.mid,text,cx,y+h-34,.82f,RareMindsArt.DIM,1,w-120);
        art.ornament(cx,y+h-66,600,RareMindsArt.GOLD,.5f);
        int n=players().size();float t=sinceLock();
        if(t<revealAt(0)){art.text(art.big,Localization.tr("ОТВЕТЫ ЗАКРЫТЫ","ANSWERS LOCKED"),cx,y+150,1.0f+.08f*(1-ease(lockIn)),RareMindsArt.IVORY,ease(lockIn),0);return;}
        String winner=s(rm.getAsJsonObject("reveal"),"jackpotWinner");
        if(t<revealAt(n)+.3f){
            // tally of collided answers so far
            Map<String,List<String>> groups=new LinkedHashMap<>();var ps=players();
            for(int k=0;k<ps.size()&&t>=revealAt(k);k++){JsonObject r=row(s(ps.get(k),"id"));if(r!=null&&b(r,"collided"))groups.computeIfAbsent(s(r,"answerId"),z->new ArrayList<>()).add(answerLabel(r));}
            art.text(art.mid,Localization.tr("ВСКРЫВАЕМ ОТВЕТЫ…","REVEALING ANSWERS…"),cx,y+168,.95f,RareMindsArt.IVORY,1,0);
            if(!groups.isEmpty()){StringBuilder sb=new StringBuilder();for(var g:groups.values()){if(sb.length()>0)sb.append("   ·   ");sb.append(g.get(0)).append(" ×").append(g.size());}
                art.text(art.small,Localization.tr("Совпадения: ","Collisions: ")+sb,cx,y+110,.82f,RareMindsArt.RED_SOFT,1,w-80);}
            return;
        }
        if(winner.isEmpty()){art.text(art.big,Localization.tr("ДЖЕКПОТ НИКТО НЕ ЗАБРАЛ","NOBODY TAKES THE JACKPOT"),cx,y+150,.86f,RareMindsArt.DIM,1,w-100);return;}
        JsonObject r=row(winner);float a=ease(fx(winner).crown);
        art.glow(cx,y+120,820,240,RareMindsArt.GOLD,.22f*a);
        batch.setColor(RareMindsArt.GOLD.r,RareMindsArt.GOLD.g,RareMindsArt.GOLD.b,a);batch.draw(art.crown,cx-34,y+168,68,68);
        art.text(art.mid,Localization.tr("ДЖЕКПОТ","JACKPOT")+" · "+name(winner).toUpperCase(Locale.ROOT),cx,y+150,1.05f,RareMindsArt.GOLD,a,w-80);
        if(r!=null){int k=tierIndex(s(r,"tier"));
            art.text(art.small,answerLabel(r)+"  ·  "+tierName(s(r,"tier"))+"  ·  +"+i(r,"jackpotSouls")+Localization.tr(" душ"," souls")+(i(r,"jackpotStreak")>1?Localization.tr("  ·  серия ×","  ·  streak ×")+i(r,"jackpotStreak"):""),cx,y+92,.86f,RareMindsArt.TIER[k],a,w-80);}
    }
    /** Colour the last word red (font markup), like the reference's highlighted keyword. */
    private static String markLast(String t){String s=t.replace("[","[[");int k=s.trim().lastIndexOf(' ');if(k<0)return s;return s.substring(0,k+1)+"[#FF4A3A]"+s.substring(k+1)+"[]";}

    // ---------------------------------------------------------------- players
    private void cards(){
        var ps=players();int n=ps.size();float cw=170,ch=262,gap=n>6?14:22,total=n*cw+(n-1)*gap,x0=W/2-total/2,y=128;
        for(int k=0;k<n;k++){JsonObject live=ps.get(k);String id=s(live,"id");JsonObject p=shown(live);Fx f=fx(id);
            float x=x0+k*(cw+gap)+MathUtils.sin(clock*55)*f.shake*9;
            boolean ghost=!b(p,"alive"),zone=b(p,"deathZone"),active=phase().equals("QUESTION_ACTIVE");
            JsonObject r=revealPhase()&&revealed(id)?row(id):null;
            Color accent=ghost?RareMindsArt.GHOST:zone?RareMindsArt.RED:null;
            if(zone&&!ghost)art.glow(x+cw/2,y+ch/2,cw*2.2f,ch*1.6f,RareMindsArt.RED,.22f+.14f*MathUtils.sin(clock*4+k));
            if(ghost)art.glow(x+cw/2,y+ch/2,cw*2f,ch*1.4f,RareMindsArt.GHOST,.10f);
            if(f.flash>0)art.glow(x+cw/2,y+ch/2,cw*2.6f,ch*1.8f,r!=null&&b(r,"resurrected")?RareMindsArt.GOLD:RareMindsArt.RED,.45f*f.flash);
            art.panel(x,y,cw,ch,1,accent);
            // portrait
            Texture face=art.face(s(roster(id),"characterId"));float fs=96,fx0=x+cw/2-fs/2,fy=y+ch-fs-14;
            art.rect(fx0-3,fy-3,fs+6,fs+6,accent==null?RareMindsArt.GOLD_DEEP:accent,.8f);
            if(face!=null){if(ghost)batch.setColor(.55f,.75f,1f,.65f);else batch.setColor(Color.WHITE);batch.draw(face,fx0,fy,fs,fs);}
            if(active&&b(live,"submitted"))check(x+cw-26,y+ch-24,ease(f.submit));
            if(r!=null&&b(r,"jackpot")){float a=ease(f.crown);batch.setColor(RareMindsArt.GOLD.r,RareMindsArt.GOLD.g,RareMindsArt.GOLD.b,a);batch.draw(art.crown,x+cw/2-26,fy+fs-24,52,52);}
            art.text(art.small,name(id),x+cw/2,fy-4,.95f,ghost?RareMindsArt.GHOST:RareMindsArt.IVORY,1,cw-16);
            int col=i(p,"collisions");
            liveField(id,live,x+8,y+76,cw-16,40,active);
            art.textRight(art.num,col+"/3",x+cw-10,y+66,.5f,ghost?RareMindsArt.GHOST:zone?RareMindsArt.RED_SOFT:RareMindsArt.DIM,1);
            for(int s2=0;s2<3;s2++){boolean on=s2<col;float sz=26*(on&&r!=null&&b(r,"collided")&&s2==col-1?1+.35f*(1-ease(f.pop)):1);
                float sx=x+14+s2*32,sy=y+50-sz/2;
                if(on){Color c=ghost?RareMindsArt.GHOST:RareMindsArt.RED;batch.setColor(c);}else batch.setColor(.32f,.26f,.24f,1);
                batch.draw(art.skull,sx,sy,sz,sz);}
            art.text(art.tiny,String.format(Locale.ROOT,"%,d",l(p,"souls")).replace(',',' ')+Localization.tr(" душ"," souls"),x+cw/2,y+27,.74f,RareMindsArt.GOLD,1,cw-12);
            if(ghost&&r==null)ghostPips(p,x+cw/2,y+ch+12);
            if(r!=null)answerPlate(r,x+cw/2,y+ch+16,cw+gap-6,ease(f.pop));
            if(zone&&!ghost&&r==null)art.text(art.tiny,Localization.tr("ЗОНА СМЕРТИ","DEATH ZONE"),x+cw/2,y+ch+30,.8f,RareMindsArt.RED_SOFT,.75f+.25f*MathUtils.sin(clock*5),cw);
        }
    }
    /** What this player is typing right now (host client only), the locked answer, or a quiet "typing…" when hidden. */
    private void liveField(String id,JsonObject p,float x,float y,float w,float h,boolean active){
        if(!active)return;JsonObject l=live(id);String t=l==null?"":s(l,"text");boolean locked=b(p,"submitted")||l!=null&&b(l,"locked");
        boolean col=l!=null&&l.has("possibleCollision")&&l.getAsJsonArray("possibleCollision").size()>0;
        Color edge=col?new Color(1f,.69f,.18f,1):locked?RareMindsArt.GOLD:new Color(1,1,1,.18f);
        art.rect(x,y,w,h,new Color(0,0,0,.75f),1);art.rect(x,y,w,2,edge,col?.6f+.4f*MathUtils.sin(clock*8):1);
        String shown;Color c;
        if(!liveShown){shown=t.isEmpty()?"":locked?Localization.tr("ответ готов","locked in"):Localization.tr("печатает","typing")+".".repeat(1+(int)(clock*3)%3);c=RareMindsArt.DIM;}
        else if(t.isEmpty()){shown="";c=RareMindsArt.DIM;}
        else{shown=t+(locked||((int)(clock*2))%2==1?"":"|");c=locked?RareMindsArt.GOLD:Color.WHITE;}
        if(!shown.isEmpty())art.text(art.small,shown,x+w/2,y+h-8,.9f,c,1,w-10);
    }
    private void check(float cx,float cy,float a){
        art.glow(cx,cy,60,60,RareMindsArt.GOLD,.5f*a);float s=.6f+.4f*a;
        batch.setColor(RareMindsArt.GOLD.r,RareMindsArt.GOLD.g,RareMindsArt.GOLD.b,a);
        batch.draw(art.pixel,cx-9*s,cy-2*s,0,0,12*s,4*s,1,1,-45,0,0,1,1,false,false);
        batch.draw(art.pixel,cx-1*s,cy-8*s,0,0,22*s,4*s,1,1,50,0,0,1,1,false,false);
    }
    /** Ghost resurrection track above the card: one pip per remaining question. */
    private void ghostPips(JsonObject p,float cx,float y){
        if(!b(p,"resurrectionPossible"))return;int total=i(rm,"questions")-i(p,"eliminatedAt"),done=i(p,"ghostUnique");if(total<=0)return;
        float gap=18,x=cx-(total-1)*gap/2;for(int k=0;k<total;k++){Color c=k<done?RareMindsArt.GHOST:new Color(.2f,.3f,.4f,1);art.diamond(x+k*gap,y,6,c,1);}
    }
    /** The revealed answer, on a plate above the card, with its rarity colour and what it earned. */
    private void answerPlate(JsonObject r,float cx,float y,float w,float a){
        boolean valid=b(r,"valid"),col=b(r,"collided");String label=s(r,"text").isEmpty()?Localization.tr("нет ответа","no answer"):answerLabel(r);
        Color c=!valid?RareMindsArt.DIM:col?RareMindsArt.RED:RareMindsArt.TIER[tierIndex(s(r,"tier"))];
        float h=48,yy=y+(1-a)*-12;
        art.rect(cx-w/2,yy,w,h,RareMindsArt.PANEL,a);art.rect(cx-w/2,yy+h-2,w,2,c,a);art.rect(cx-w/2,yy,w,2,c,.6f*a);
        art.text(art.tiny,label,cx,yy+h-8,.82f,valid?RareMindsArt.IVORY:RareMindsArt.DIM,a,w-10);
        String sub=!valid?(s(r,"text").isEmpty()?"0":Localization.tr("неверно","invalid")):col?Localization.tr("СОВПАДЕНИЕ ","COLLISION ")+"+"+i(r,"earned"):tierName(s(r,"tier"))+" +"+i(r,"earned");
        if(b(r,"eliminated"))sub=Localization.tr("ВЫБЫЛ","OUT")+" −"+l(r,"deathPenalty");
        if(b(r,"resurrected"))sub=Localization.tr("ВОСКРЕС!","BACK TO LIFE!");
        art.text(art.tiny,sub,cx,yy+20,.66f,c,a,w-10);
    }

    // ---------------------------------------------------------------- final results
    private void standings(){
        float x=430,y=150,w=1060,h=630,cx=x+w/2;art.panel(x,y,w,h,1,null);
        art.plaque(cx,y+h,420,58,1,null);art.text(art.mid,Localization.tr("ИТОГИ","RESULTS"),cx,y+h+15,.9f,RareMindsArt.IVORY,1,0);
        List<JsonObject> st=new ArrayList<>();if(rm.has("standings"))for(var e:rm.getAsJsonArray("standings"))st.add(e.getAsJsonObject());
        JsonObject win=st.stream().filter(o->b(o,"winner")).findFirst().orElse(null);
        float t=(now()-l(rm,"phaseStartedAt"))/1000f;
        if(win!=null){float a=ease(t/.8f);art.glow(cx,y+h-80,900,200,RareMindsArt.GOLD,.25f*a);batch.setColor(RareMindsArt.GOLD.r,RareMindsArt.GOLD.g,RareMindsArt.GOLD.b,a);batch.draw(art.crown,cx-40,y+h-96,80,80);
            art.text(art.big,name(s(win,"playerId")).toUpperCase(Locale.ROOT),cx,y+h-110,.9f,RareMindsArt.GOLD,a,w-100);
            art.text(art.small,Localization.tr("ПОБЕДИТЕЛЬ · +500 душ","WINNER · +500 souls"),cx,y+h-170,.8f,RareMindsArt.IVORY,a,0);}
        else art.text(art.big,Localization.tr("ПОБЕДИТЕЛЯ НЕТ","NO WINNER"),cx,y+h-110,.9f,RareMindsArt.DIM,1,0);
        float rowH=Math.min(52,380f/Math.max(1,st.size())),top=y+h-200;
        for(int k=0;k<st.size();k++){var o=st.get(k);float a=ease((t-.6f-k*.12f)/.4f);if(a<=0)continue;float ry=top-(k+1)*rowH;String id=s(o,"playerId");boolean alive=b(o,"alive");
            if(k>0)art.rect(x+60,ry+rowH,w-120,1,RareMindsArt.GOLD,.18f*a);
            art.textLeft(art.mid,String.valueOf(i(o,"rank")),x+70,ry+rowH*.78f,.8f,k==0?RareMindsArt.GOLD:RareMindsArt.DIM,a);
            Texture face=art.face(s(roster(id),"characterId"));if(face!=null){batch.setColor(alive?1:.55f,alive?1:.75f,1,a);batch.draw(face,x+130,ry+4,rowH-8,rowH-8);}
            art.textLeft(art.small,name(id),x+140+rowH,ry+rowH*.72f,.9f,alive?RareMindsArt.IVORY:RareMindsArt.GHOST,a);
            if(!alive)art.textLeft(art.tiny,Localization.tr("призрак","ghost"),x+140+rowH+art.width(art.small,name(id),.9f)+16,ry+rowH*.66f,.76f,RareMindsArt.GHOST,a*.8f);
            art.textRight(art.small,String.format(Locale.ROOT,"%,d",l(o,"souls")).replace(',',' ')+Localization.tr(" душ"," souls"),x+w-70,ry+rowH*.72f,.9f,RareMindsArt.GOLD,a);
        }
        if(phase().equals("COMPLETED")||t>4)art.text(art.tiny,Localization.tr("ENTER: вернуться в лобби","ENTER: back to the lobby"),cx,y+28,.85f,RareMindsArt.DIM,.8f,0);
    }

    // ---------------------------------------------------------------- ticker
    private void ticker(){
        List<String[]> m=messages();if(m.isEmpty())return;
        tickerT+=Gdx.graphics.getDeltaTime();if(tickerT>2.4f){tickerT=0;tickerIndex++;}
        String[] cur=m.get(tickerIndex%m.size());float a=Math.min(1,Math.min(tickerT*4,(2.4f-tickerT)*4));
        Color c=switch(cur[0]){case "red"->RareMindsArt.RED_SOFT;case "ghost"->RareMindsArt.GHOST;case "gold"->RareMindsArt.GOLD;default->RareMindsArt.IVORY;};
        float w=Math.min(1300,art.width(art.small,cur[1],.8f)+160),cx=W/2,y=40,h=60;
        art.shade(cx,y+h/2,w+200,h+80,.6f);art.rect(cx-w/2,y,w,h,RareMindsArt.PANEL,1);art.rect(cx-w/2,y+h-2,w,2,c,.85f);art.rect(cx-w/2,y,w,2,c,.85f);

        art.text(art.small,cur[1],cx,y+h/2+15,.8f,c,a,w-60);
    }
    /** Bottom line messages: collisions, death zones, eliminations and ghost progress — never anyone's typing. */
    private List<String[]> messages(){
        List<String[]> out=new ArrayList<>();String ph=phase();var ps=players();
        if(ph.equals("QUESTION_ACTIVE")){
            int done=0;for(var p:ps)if(b(p,"submitted"))done++;
            out.add(new String[]{"gold",Localization.tr("Ответили "+done+" из "+ps.size(),"Locked in: "+done+" of "+ps.size())});
            for(var p:ps){String n=name(s(p,"id"));
                if(b(p,"deathZone"))out.add(new String[]{"red",Localization.tr("ЗОНА СМЕРТИ · "+n+" · 2/3 · можно рискнуть","DEATH ZONE · "+n+" · 2/3 · may RISK IT")});
                if(!b(p,"alive")&&b(p,"resurrectionPossible"))out.add(new String[]{"ghost",Localization.tr("Призрак "+n+": "+i(p,"ghostUnique")+" из "+(i(rm,"questions")-i(p,"eliminatedAt"))+" к воскрешению","Ghost "+n+": "+i(p,"ghostUnique")+" of "+(i(rm,"questions")-i(p,"eliminatedAt"))+" toward resurrection")});}
            if(b(rm,"finalQuestion"))out.add(new String[]{"red",Localization.tr("ПОСЛЕДНИЙ ОТВЕТ · все награды удваиваются · джекпот 500","THE LAST ANSWER · all rewards doubled · jackpot 500")});
            return out;
        }
        if(revealPhase()&&sinceLock()>=revealAt(ps.size())){
            Map<String,List<String>> groups=new LinkedHashMap<>();
            for(var r:rows()){String n=name(s(r,"playerId"));
                if(b(r,"collided"))groups.computeIfAbsent(answerLabel(r),z->new ArrayList<>()).add(n);
                if(b(r,"eliminated"))out.add(new String[]{"red",Localization.tr("ВЫБЫЛ · "+n+" · −"+l(r,"deathPenalty")+" душ · теперь призрак","ELIMINATED · "+n+" · −"+l(r,"deathPenalty")+" souls · now a ghost")});
                else if(b(r,"alive")&&i(r,"collisions")==2&&b(r,"collided"))out.add(new String[]{"red",Localization.tr("ЗОНА СМЕРТИ · "+n+" · 2/3","DEATH ZONE · "+n+" · 2/3")});
                if("SAVED".equals(s(r,"risk")))out.add(new String[]{"gold",Localization.tr("РИСК ОПРАВДАН · "+n+" снимает череп","RISK PAID OFF · "+n+" removes a skull")});
                if(b(r,"ghostSuccess"))out.add(new String[]{"ghost",Localization.tr("Призрак "+n+": уникально! Осталось "+i(r,"ghostRemaining"),"Ghost "+n+": unique! "+i(r,"ghostRemaining")+" to go")});
                if(b(r,"resurrectionLost"))out.add(new String[]{"red",Localization.tr("Воскрешение потеряно · "+n,"Resurrection lost · "+n)});
                if(b(r,"resurrected"))out.add(new String[]{"gold",Localization.tr("ВОСКРЕШЕНИЕ · "+n+" снова жив · 2/3 · +100","RESURRECTION · "+n+" lives again · 2/3 · +100")});
            }
            List<String[]> col=new ArrayList<>();for(var g:groups.entrySet())col.add(new String[]{"red",Localization.tr("СОВПАДЕНИЕ · ","COLLISION · ")+String.join(Localization.tr(" и "," and "),g.getValue())+" · "+g.getKey()});
            col.addAll(out);return col;
        }
        return out;
    }

    private static float ease(float t){t=MathUtils.clamp(t,0,1);return t*t*(3-2*t);}
    @Override public void dispose(){if(!created)return;batch.dispose();art.dispose();sfx.dispose();}
}
