package com.erni.finalanswer.systembreach.host;

import com.google.gson.*;
import java.util.*;

/**
 * Presentation-state adapter: turns the server's public SYSTEM BREACH snapshot (players, bounded event list, phase
 * deadline) into what the host draws. It holds no rules and never changes a value the server owns; the only local
 * state is display easing (AP counters, entry animations) and a clock that interpolates between snapshots.
 */
public final class SystemBreachHostViewModel {
    public enum Status {
        ONLINE("ONLINE","В СЕТИ"),BEING_HACKED("BEING HACKED","ИДЁТ ВЗЛОМ"),RECOVERY("RECOVERY","ВОССТАНОВКА"),UPGRADING("UPGRADING","УЛУЧШЕНИЕ"),COMPROMISED("COMPROMISED","ВЗЛОМАН"),DISCONNECTED("DISCONNECTED","НЕ В СЕТИ");
        private final String en,ru;Status(String en,String ru){this.en=en;this.ru=ru;}
        public String label(boolean russian){return russian?ru:en;}
    }
    public enum Reaction {NONE,HIT,TRIUMPH,RECOVERED,UPGRADE}
    public enum Tone {HACK,RECOVERY,FIREWALL,REWARD,MUTED}

    public static final class Slot {
        public final String id;public String name="",characterId="";
        public int ap,firewall=1,rank;public double multiplier=1;public float shownAp;public boolean leader;
        public Status status=Status.ONLINE;public float statusAge;
        public int delta;public float deltaAge=99;              // floating "+15 AP"
        public Reaction reaction=Reaction.NONE;public float reactionAge=99;
        public float boardY=-1,multAge=99,rankAge=99;public int shownRank;
        /** Live sabotage virus on this player (server type name, empty when clean) and how long it has been there. */
        public String virus="";public float virusAge=99;
        private int rankKey=-1;private double multKey=-1;private String rankText="",multText="";
        public String rankText(){if(rankKey!=rank){rankKey=rank;rankText=String.valueOf(rank);}return rankText;}
        public String multText(){if(multKey!=multiplier){multKey=multiplier;multText="×"+fmt(multiplier);}return multText;}                                  // eased leaderboard row position
        boolean russianText;
        Slot(String id){this.id=id;}
        // cached strings: rebuilt only when the shown value changes, never per frame
        private int apKey=Integer.MIN_VALUE,fwKey,deltaKey;private String apText="",fwText="",deltaText="";
        public String apText(){int v=Math.round(shownAp);if(v!=apKey){apKey=v;apText=v+" AP";}return apText;}
        private String fwShort="";private int fwShortKey;
        public String firewallShort(){if(fwShortKey!=firewall||fwShort.isEmpty()){fwShortKey=firewall;fwShort=(russianText?"УР":"LV")+firewall;}return fwShort;}
        public String firewallText(){if(fwKey!=firewall||fwText.isEmpty()){fwKey=firewall;fwText=(russianText?"ФАЕРВОЛ УР.":"FIREWALL LV.")+firewall;}return fwText;}
        public String deltaText(){if(deltaKey!=delta||deltaText.isEmpty()){deltaKey=delta;deltaText=(delta>0?"+":"-")+Math.abs(delta)+" AP";}return deltaText;}
    }
    public record LogLine(long sequence,String text,Tone tone,long at,String stamp){
        public LogLine(long sequence,String text,Tone tone,long at){this(sequence,text,tone,at,String.format(java.util.Locale.ROOT,"%02d:%02d",at/60000,at/1000%60));}
    }
    public record Attack(String attackerId,String targetId,long startedAt){}
    private final List<Attack> attacks=new ArrayList<>();
    private final boolean ru;
    public SystemBreachHostViewModel(boolean russian){ru=russian;}
    public boolean ru(){return ru;}
    private String L(String en,String ru){return this.ru?ru:en;}
    /** "1.3", "2" — one decimal, no trailing zero. */
    public static String fmt(double v){long t=Math.round(v*10);return t%10==0?String.valueOf(t/10):(t/10)+"."+(t%10);}
    private double roundMult=1;private String roundText="×1";public double roundMult(){return roundMult;}public String roundText(){return roundText;}
    /** Centre-stage banner in parts: a small kicker above, then "actor verb » target  detail". */
    public record Toast(String kicker,String actor,String verb,String target,String detail){
        public String line(){return (actor.isEmpty()?"":actor+"  ")+verb+(target.isEmpty()?"":"  »  "+target)+(detail.isEmpty()?"":"   "+detail);}
    }
    private Toast toastParts=new Toast("","","","","");public Toast toastParts(){return toastParts;}
    private String toast="";private Tone toastTone=Tone.MUTED;private float toastAge=99;

    private static final int LOG_SIZE=4;private static final long UPGRADE_SHOW_MS=2600,ATTACK_STALE_MS=30_000;
    private final List<Slot> slots=new ArrayList<>();private final Map<String,Slot> byId=new HashMap<>();
    private final ArrayDeque<LogLine> log=new ArrayDeque<>(LOG_SIZE+1);
    private final float[] logAge=new float[LOG_SIZE];
    private final List<Slot> ranking=new ArrayList<>();
    private String sessionId="",phase="INITIALIZATION",winnerId="";
    private long serverTime,phaseStartedAt,deadline=-1,receivedAt,lastSequence=-1;

    public void apply(JsonObject root){
        JsonObject sb=root.getAsJsonObject("systemBreach");if(sb==null)return;
        String session=str(sb,"sessionId");
        if(!session.equals(sessionId)){sessionId=session;slots.clear();byId.clear();log.clear();lastSequence=-1;Arrays.fill(logAge,99);}
        phase=str(sb,"phase");winnerId=str(sb,"winnerId");
        serverTime=lng(sb,"serverTime",System.currentTimeMillis());{long local=System.nanoTime()/1_000_000L,off=serverTime-local;if(offset==Long.MIN_VALUE||Math.abs(off-offset)>2000)offset=off;else offset+=(off-offset)/10;}phaseStartedAt=lng(sb,"phaseStartedAt",serverTime);deadline=lng(sb,"deadline",-1);receivedAt=System.nanoTime();

        Map<String,String> characters=new HashMap<>();List<String> seatOrder=new ArrayList<>();
        if(root.has("players"))for(var e:root.getAsJsonArray("players")){var p=e.getAsJsonObject();String id=str(p,"id");characters.put(id,str(p,"characterId"));seatOrder.add(id);}
        JsonArray rows=sb.getAsJsonArray("players");Set<String> present=new HashSet<>();
        for(var e:rows)present.add(str(e.getAsJsonObject(),"playerId"));
        if(slots.isEmpty()){                                     // fixed seats: lobby order, never re-sorted by score
            for(String id:seatOrder)if(present.contains(id))add(id);
            for(String id:present)if(!byId.containsKey(id))add(id);
        }
        ranking.clear();
        for(var e:rows){
            var p=e.getAsJsonObject();Slot s=byId.get(str(p,"playerId"));if(s==null)continue;
            s.name=str(p,"nickname");s.characterId=characters.getOrDefault(s.id,s.characterId);
            int ap=num(p,"accessPoints");if(s.shownAp<0){s.shownAp=ap;}else if(ap!=s.ap&&s.rank>0){s.delta=ap-s.ap;s.deltaAge=0;}
            s.ap=ap;s.firewall=num(p,"firewallLevel");s.rank=num(p,"rank");ranking.add(s);
        }
        {double rm=sb.has("roundMultiplier")?sb.get("roundMultiplier").getAsDouble():1;if(rm!=roundMult){if(rm>roundMult&&roundMult>=1&&lastSequence>=0&&rm>1){toastParts=new Toast(L("ROUND BONUS","БОНУС РАУНДА"),"",L("every answer is worth more","все ответы ценятся дороже"),"","×"+fmt(rm));toast=toastParts.line();toastAge=0;toastTone=Tone.REWARD;}roundMult=rm;roundText="×"+fmt(rm);}}
        if(sb.has("multipliers"))for(var e:sb.getAsJsonObject("multipliers").entrySet()){Slot s=byId.get(e.getKey());if(s!=null){double m=e.getValue().getAsDouble();if(s.multiplier!=m)s.multAge=0;s.multiplier=m;}}
        for(int i=0;i<ranking.size();i++)ranking.get(i).leader=i==0&&ranking.get(i).ap>0;
        {JsonObject inf=sb.has("sabotage")&&sb.get("sabotage").isJsonObject()?sb.getAsJsonObject("sabotage"):new JsonObject();
         for(Slot s:slots){String v=inf.has(s.id)?inf.get(s.id).getAsString():"";if(!v.equals(s.virus)){s.virus=v;s.virusAge=0;}}}

        JsonArray events=sb.has("events")?sb.getAsJsonArray("events"):new JsonArray();
        Map<String,Long> underAttack=new HashMap<>();Map<String,Long> upgradedAt=new HashMap<>();
        for(var e:events){
            var ev=e.getAsJsonObject();String type=str(ev,"type"),a=str(ev,"attackerId"),t=str(ev,"targetId");long at=lng(ev,"at",0),seq=lng(ev,"sequence",0);
            switch(type){
                case "ATTACK_STARTED"->underAttack.put(a+">"+t,at);
                case "ATTACK_SUCCEEDED","ATTACK_FAILED","ATTACK_EXPIRED","ATTACK_INTERRUPTED"->underAttack.remove(a+">"+t);
                case "FIREWALL_UPGRADED"->upgradedAt.put(t,at);
                default->{}
            }
            if(seq>lastSequence){
                if(lastSequence>=0){react(type,a,t);{String c=SbSounds.cue(type);if(c!=null&&cues.size()<8)cues.add(c);}Toast big=headline(type,a,t,num(ev,"amount"));if(big!=null){toastParts=big;toast=big.line();toastAge=0;toastTone=type.equals("MULTIPLIER_UPGRADED")?Tone.REWARD:type.equals("ATTACK_FAILED")||type.equals("ATTACK_EXPIRED")?Tone.RECOVERY:type.equals("FIREWALL_UPGRADED")?Tone.FIREWALL:type.equals("SABOTAGE_BLOCKED")?Tone.FIREWALL:type.equals("SABOTAGE_CLEARED")||type.equals("KEY_BOUGHT")?Tone.REWARD:type.startsWith("RECOVERY")||type.equals("EMERGENCY_RESTORED")?Tone.REWARD:Tone.HACK;}}
                LogLine line=line(type,a,t,num(ev,"amount"),seq);if(line!=null)line=new LogLine(line.sequence(),line.text(),line.tone(),Math.max(0,at-phaseStartedAt));
                if(line!=null){log.addLast(line);if(log.size()>LOG_SIZE)log.removeFirst();System.arraycopy(logAge,0,logAge,1,LOG_SIZE-1);logAge[0]=lastSequence<0?99:0;}
            }
        }
        lastSequence=Math.max(lastSequence,lng(sb,"lastEventSequence",lastSequence));if(lastSequence<0)lastSequence=0;

        Set<String> attacked=new HashSet<>();attacks.clear();
        for(var en:underAttack.entrySet())if(serverTime-en.getValue()<ATTACK_STALE_MS){String k=en.getKey();int i=k.indexOf('>');attacked.add(k.substring(i+1));attacks.add(new Attack(k.substring(0,i),k.substring(i+1),en.getValue()));}
        for(var e:rows){
            var p=e.getAsJsonObject();Slot s=byId.get(str(p,"playerId"));if(s==null)continue;
            Status next=flag(p,"disconnected")?Status.DISCONNECTED:flag(p,"recovering")?Status.RECOVERY:flag(p,"compromised")?Status.COMPROMISED
                :attacked.contains(s.id)?Status.BEING_HACKED:serverTime-upgradedAt.getOrDefault(s.id,Long.MIN_VALUE/2)<UPGRADE_SHOW_MS?Status.UPGRADING:Status.ONLINE;
            if(next!=s.status){s.status=next;s.statusAge=0;}
        }
    }

    private void add(String id){Slot s=new Slot(id);s.russianText=ru;s.shownAp=-1;slots.add(s);byId.put(id,s);}
    private void react(String type,String attacker,String target){
        switch(type){
            case "ATTACK_SUCCEEDED"->{set(attacker,Reaction.TRIUMPH);set(target,Reaction.HIT);}
            case "ATTACK_FAILED"->set(attacker,Reaction.HIT);
            case "RECOVERY_SUCCEEDED","EMERGENCY_RESTORED"->set(target,Reaction.RECOVERED);
            case "FIREWALL_UPGRADED","MULTIPLIER_UPGRADED"->set(target,Reaction.UPGRADE);
            case "TROJAN","DATA_LEAK","SYSTEM_OVERLOAD","FIREWALL_BREAKER","TRACE_ATTACK","SABOTAGE_STARTED"->{set(attacker,Reaction.TRIUMPH);set(target,Reaction.HIT);}
            case "SABOTAGE_BLOCKED"->set(target,Reaction.UPGRADE);
            case "SABOTAGE_CLEARED"->set(target,Reaction.RECOVERED);
            default->{}
        }
    }
    private void set(String id,Reaction r){Slot s=byId.get(id);if(s!=null){s.reaction=r;s.reactionAge=0;}}
    private String who(String id){Slot s=byId.get(id);return s==null||s.name.isEmpty()?L("Unknown","Неизвестный"):s.name;}

    /** Public facts only: who acted on whom and the public amount. Passwords, clues and answers never reach here. */
    private LogLine line(String type,String a,String t,int amount,long seq){
        return switch(type){
            case "ATTACK_STARTED"->new LogLine(seq,L(who(t)+" is being hacked!","Взлом: "+who(t)+"!"),Tone.HACK,0);
            case "ATTACK_SUCCEEDED"->new LogLine(seq,who(a)+" » "+who(t)+L(": hacked",": взлом")+(amount>0?"  +"+amount+" AP":""),Tone.HACK,0);
            case "ATTACK_FAILED"->new LogLine(seq,who(t)+L(": attack repelled",": атака отражена")+" « "+who(a),Tone.FIREWALL,0);
            case "ATTACK_EXPIRED","ATTACK_INTERRUPTED"->new LogLine(seq,L(who(a)+" lost the link to "+who(t),who(a)+" потерял связь с "+who(t)),Tone.MUTED,0);
            case "RECOVERY_START"->new LogLine(seq,L(who(t)+" started recovery",who(t)+" начал восстановление"),Tone.RECOVERY,0);
            case "RECOVERY_RETRY"->new LogLine(seq,L(who(t)+" recovery failed, retrying",who(t)+": сбой, повтор"),Tone.RECOVERY,0);
            case "RECOVERY_SUCCEEDED"->new LogLine(seq,L(who(t)+" is back online",who(t)+" снова в сети"),Tone.REWARD,0);
            case "EMERGENCY_RESTORED"->new LogLine(seq,L(who(t)+" emergency restore",who(t)+": аварийный откат"),Tone.RECOVERY,0);
            case "MULTIPLIER_UPGRADED"->new LogLine(seq,L(who(t)+" multiplier ×"+fmt(amount/10.0),who(t)+": множитель ×"+fmt(amount/10.0)),Tone.REWARD,0);
            case "FIREWALL_UPGRADED"->new LogLine(seq,L(who(t)+" upgraded firewall to Lv."+amount,who(t)+": фаервол ур."+amount),Tone.FIREWALL,0);
            case "CHALLENGE_SOLVED"->new LogLine(seq,L(who(t)+" earned +"+amount+" AP",who(t)+" получил +"+amount+" AP"),Tone.REWARD,0);
            case "TROJAN"->new LogLine(seq,L(who(a)+" planted a Trojan in "+who(t),who(a)+" внедрил троян в "+who(t)),Tone.HACK,0);
            case "DATA_LEAK"->new LogLine(seq,L(who(a)+" leaked data from "+who(t),who(a)+" слил данные "+who(t))+(amount>0?"  +"+amount+" AP":""),Tone.HACK,0);
            case "SYSTEM_OVERLOAD"->new LogLine(seq,L(who(a)+" overloaded "+who(t),who(a)+" перегрузил "+who(t)),Tone.HACK,0);
            case "FIREWALL_BREAKER"->new LogLine(seq,L(who(a)+" broke "+who(t)+"'s firewall",who(a)+" пробил фаервол "+who(t)),Tone.HACK,0);
            case "TRACE_ATTACK"->new LogLine(seq,L(who(a)+" is tracing "+who(t),who(a)+" отслеживает "+who(t)),Tone.HACK,0);
            case "SABOTAGE_STARTED"->new LogLine(seq,who(a)+" » "+who(t)+L(": sabotage, ",": саботаж, ")+virus(amount,ru).toLowerCase(),Tone.HACK,0);
            case "SABOTAGE_BLOCKED"->new LogLine(seq,who(t)+L(": firewall stopped the virus",": фаервол отбил вирус")+" « "+who(a),Tone.FIREWALL,0);
            case "SABOTAGE_CLEARED"->new LogLine(seq,who(t)+L(": virus removed",": вирус удалён"),Tone.REWARD,0);
            case "SABOTAGE_EXPIRED"->new LogLine(seq,L(who(t)+"'s virus burned out",who(t)+": вирус выдохся"),Tone.MUTED,0);
            case "KEY_BOUGHT"->new LogLine(seq,who(t)+L(": key bought with SOULS",": ключ куплен за SOULS"),Tone.REWARD,0);
            case "RESULTS"->new LogLine(seq,L("Operation complete","Операция завершена"),Tone.MUTED,0);
            default->null;
        };
    }

    /** The big centre-stage banner: only the moments worth a cheer. */
    private Toast headline(String type,String a,String t,int amount){
        String plus=amount>0?"+"+amount+" AP":"";
        return switch(type){
            case "ATTACK_SUCCEEDED"->new Toast(L("HACK SUCCESSFUL","ВЗЛОМ УДАЛСЯ"),who(a),L("breaks into the system","взламывает систему"),who(t),plus);
            case "ATTACK_FAILED"->new Toast(L("HACK FAILED","ПРОВАЛ ВЗЛОМА"),who(t),L("repels the attack","отражает атаку"),who(a),"");
            case "ATTACK_EXPIRED"->new Toast(L("HACK TIMED OUT","ВРЕМЯ ВЗЛОМА ВЫШЛО"),who(a),L("loses the connection","теряет соединение"),who(t),"");
            case "MULTIPLIER_UPGRADED"->new Toast(L("UPGRADE","УЛУЧШЕНИЕ"),who(t),L("raises the points multiplier","повышает множитель очков"),"","×"+fmt(amount/10.0));
            case "FIREWALL_UPGRADED"->new Toast(L("DEFENCE","ЗАЩИТА"),who(t),L("reinforces the firewall","укрепляет фаервол"),"",L("LV.","УР. ")+amount);
            case "RECOVERY_SUCCEEDED"->new Toast(L("SYSTEM RESTORED","СИСТЕМА ВОССТАНОВЛЕНА"),who(t),L("is back online","снова в сети"),"","");
            case "SABOTAGE_STARTED"->new Toast(L("SABOTAGE","САБОТАЖ")+"  ·  "+virus(amount,ru),who(a),L("launches a sabotage","устраивает саботаж"),who(t),"");
            case "SABOTAGE_BLOCKED"->new Toast(L("VIRUS BLOCKED","ВИРУС ОТБИТ"),who(t),L("firewall stops the virus from","фаервол останавливает вирус от"),who(a),"");
            case "KEY_BOUGHT"->new Toast(L("SOULS SPENT","ТРАТА SOULS"),who(t),L("buys an access key","покупает ключ доступа"),"","−2 000 SOULS");
            case "SABOTAGE_CLEARED"->new Toast(L("SYSTEM CLEAN","СИСТЕМА ОЧИЩЕНА"),who(t),L("removes the virus","удаляет вирус"),"","");
            case "TROJAN","DATA_LEAK","SYSTEM_OVERLOAD","FIREWALL_BREAKER","TRACE_ATTACK"->new Toast(L(type.replace('_',' '),switch(type){case "TROJAN"->"ТРОЯН";case "DATA_LEAK"->"УТЕЧКА ДАННЫХ";case "SYSTEM_OVERLOAD"->"ПЕРЕГРУЗКА";case "FIREWALL_BREAKER"->"ПРОБОЙ ФАЕРВОЛА";default->"СЛЕЖКА";}),who(a),L("strikes","наносит удар"),who(t),plus);
            default->null;
        };
    }
    /** Sound cues from new events, drained by the screen each frame. */
    private final java.util.ArrayList<String> cues=new java.util.ArrayList<>();
    public java.util.List<String> cues(){return cues;}
    public String toast(){return toast;}
    public Tone toastTone(){return toastTone;}
    public float toastAge(){return toastAge;}
    /** Display easing only. */
    public void update(float dt){
        for(Slot s:slots){
            s.statusAge+=dt;s.deltaAge+=dt;s.virusAge+=dt;s.reactionAge+=dt;s.multAge+=dt;s.rankAge+=dt;if(s.shownRank!=s.rank){if(s.shownRank!=0)s.rankAge=0;s.shownRank=s.rank;}
            float k=1-(float)Math.exp(-dt*6);s.shownAp+=(s.ap-s.shownAp)*k;if(Math.abs(s.ap-s.shownAp)<.5f)s.shownAp=s.ap;
        }
        for(int i=0;i<LOG_SIZE;i++)logAge[i]+=dt;toastAge+=dt;
        for(int i=0;i<ranking.size();i++){Slot s=ranking.get(i);if(s.boardY<0)s.boardY=i;else s.boardY+=(i-s.boardY)*(1-(float)Math.exp(-dt*7));}
    }

    public List<Slot> slots(){return slots;}
    public List<Slot> ranking(){return ranking;}
    /** Attacks in flight (public: who is attacking whom). */
    public List<Attack> attacks(){return attacks;}
    public int seat(String id){Slot s=byId.get(id);return s==null?-1:slots.indexOf(s);}
    /** Oldest first, at most four. */
    public Iterable<LogLine> log(){return log;}
    public int logSize(){return log.size();}
    /** Seconds since the line {@code fromNewest} (0 = newest) entered the log. */
    public float logAge(int fromNewest){return logAge[fromNewest];}
    public String phase(){return phase;}
    public String sessionId(){return sessionId;}
    public String winnerId(){return winnerId;}
    public boolean finished(){return phase.equals("FINISHED");}
    public boolean results(){return phase.equals("RESULTS")||phase.equals("FINISHED");}
    /** Server time now, interpolated from the last snapshot; never runs its own countdown. */
    /** Server time on a smoothed, monotonic local clock: snapshot jitter never makes the timer jump. */
    public long now(){long t=System.nanoTime()/1_000_000L+offset;if(t<lastNow)t=lastNow;lastNow=t;return t;}
    private long offset=Long.MIN_VALUE,lastNow;
    public long remainingMs(){return deadline<0?0:Math.max(0,deadline-now());}
    public float remainingFraction(){long span=deadline-phaseStartedAt;return deadline<0||span<=0?0:Math.min(1,remainingMs()/(float)span);}

    private static String str(JsonObject o,String k){return o.has(k)&&!o.get(k).isJsonNull()?o.get(k).getAsString():"";}
    private static int num(JsonObject o,String k){return o.has(k)&&!o.get(k).isJsonNull()?o.get(k).getAsInt():0;}
    private static long lng(JsonObject o,String k,long d){return o.has(k)&&!o.get(k).isJsonNull()?o.get(k).getAsLong():d;}
    private static boolean flag(JsonObject o,String k){return o.has(k)&&!o.get(k).isJsonNull()&&o.get(k).getAsBoolean();}
    /** Virus names in {@code Sabotage.Type} order on the server. */
    private static final String[][] VIRUSES={{"SHUFFLE ATTACK","ПЕРЕМЕШКА"},{"NUMBER HUNT","ОХОТА НА ЦИФРЫ"},{"POP-UP STORM","ШТОРМ ОКОН"},{"GHOST BUTTONS","КНОПКИ-ПРИЗРАКИ"},{"SCREEN GLITCH","ГЛИТЧ ЭКРАНА"},{"LOCKED ANSWERS","ЗАМОК"},{"MAGNETIC BUTTONS","МАГНИТНЫЕ КНОПКИ"}};
    /** Short virus name for a server type name. */
    public String virusName(String type){String[] names={"SHUFFLE_ATTACK","NUMBER_HUNT","POPUP_STORM","GHOST_BUTTONS","SCREEN_GLITCH","LOCKED_ANSWERS","MAGNETIC_BUTTONS"};for(int i=0;i<names.length;i++)if(names[i].equals(type))return virus(i,ru);return "";}
    private static String virus(int index,boolean ru){return index>=0&&index<VIRUSES.length?VIRUSES[index][ru?1:0]:"";}
}
