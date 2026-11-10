package com.finalanswer.server.rooms;

import com.erni.finalanswer.gameplay.forgottenroom.*;
import com.erni.finalanswer.gameplay.forgottenroom.RoomScoring.Guess;
import java.util.*;

/**
 * Server-authoritative THE FORGOTTEN ROOM. Phases run on the server clock:
 * INTRO → OBSERVATION (10 s) → BLACKOUT → CHANGED_ROOM → ANSWER_PHASE → REVEAL (one beat per change) → RESULTS.
 * The changed room leaves the server only after the blackout; the answer key only at REVEAL; a player's answers
 * are visible to that player alone until REVEAL. Score-only mode: nobody is eliminated.
 */
final class ForgottenRoomSession {
    enum Phase {INTRO,OBSERVATION,BLACKOUT,CHANGED_ROOM,ANSWER_PHASE,REVEAL,RESULTS}
    /** All pacing in one place. */
    record Timing(long introMs,long observationMs,long blackoutMs,long changedMs,long answerMs,long revealIntroMs,long revealStepMs,long earlyCloseMs){
        static final Timing DEFAULT=new Timing(4_500,RoomDifficulty.OBSERVATION_SECONDS*1000L,1_200,1_500,20_000,2_500,4_500,800);}
    static final int MIN_PLAYERS=2,MAX_PLAYERS=8;

    final String id=UUID.randomUUID().toString();
    final List<String> seats;
    private final Timing timing;private final RoomGenerator.Round round;private final RoomScoring.Rules rules=RoomScoring.Rules.DEFAULT;
    private Phase phase=Phase.INTRO;private long phaseStarted,phaseEnds;
    private final Map<String,List<Guess>> answers=new LinkedHashMap<>();private final Map<String,Long> submittedAt=new HashMap<>();
    private final Map<String,RoomScoring.Result> results=new LinkedHashMap<>();
    private final Set<String> handled=new HashSet<>();
    private boolean scored;

    ForgottenRoomSession(List<String> seats,RoomDifficulty difficulty,long seed,long now){this(seats,difficulty,seed,now,Timing.DEFAULT);}
    ForgottenRoomSession(List<String> seats,RoomDifficulty difficulty,long seed,long now,Timing timing){
        if(seats.size()<MIN_PLAYERS||seats.size()>MAX_PLAYERS)throw new RoomService.Failure(409,"ROOM_PLAYER_COUNT");
        if(new HashSet<>(seats).size()!=seats.size())throw new RoomService.Failure(400,"INVALID_ROOM_ROSTER");
        this.seats=List.copyOf(seats);this.timing=timing;round=RoomGenerator.generate(seed,difficulty);
        enter(Phase.INTRO,now,timing.introMs());
    }
    Phase phase(){return phase;}
    RoomGenerator.Round round(){return round;}
    Map<String,RoomScoring.Result> results(){return Collections.unmodifiableMap(results);}
    boolean scored(){return scored;}

    private void enter(Phase next,long now,long duration){phase=next;phaseStarted=now;phaseEnds=duration<0?Long.MAX_VALUE:now+duration;
        if(next==Phase.REVEAL)score();}
    private long revealMs(){return timing.revealIntroMs()+timing.revealStepMs()*round.changes().size();}

    /** Advances the clock-driven phases; true when the state changed and should be broadcast. */
    boolean tick(long now){
        boolean changed=false;
        while(now>=phaseEnds){changed=true;
            switch(phase){
                case INTRO->enter(Phase.OBSERVATION,phaseEnds,timing.observationMs());
                case OBSERVATION->enter(Phase.BLACKOUT,phaseEnds,timing.blackoutMs());
                case BLACKOUT->enter(Phase.CHANGED_ROOM,phaseEnds,timing.changedMs());
                case CHANGED_ROOM->enter(Phase.ANSWER_PHASE,phaseEnds,timing.answerMs());
                case ANSWER_PHASE->enter(Phase.REVEAL,phaseEnds,revealMs());
                case REVEAL->enter(Phase.RESULTS,phaseEnds,-1);
                default->{return changed;}
            }
        }
        return changed;
    }

    /**
     * A seated player's final answers. Idempotent per request id; one submission per player; only during ANSWER_PHASE;
     * at most one answer per place, at most as many answers as there are changes; places must exist.
     */
    boolean submit(String member,String requestId,List<Guess> guesses,long now){
        if(!handled.add(requestId))return false;
        tick(now);
        if(!seats.contains(member))throw new RoomService.Failure(403,"ROOM_NOT_A_PLAYER");
        if(phase!=Phase.ANSWER_PHASE)throw new RoomService.Failure(409,"ROOM_ANSWERS_CLOSED");
        if(answers.containsKey(member))throw new RoomService.Failure(409,"ROOM_ALREADY_SUBMITTED");
        if(guesses.size()>round.guessLimit())throw new RoomService.Failure(400,"ROOM_TOO_MANY_GUESSES");
        Set<String> places=new HashSet<>();
        for(Guess g:guesses){if(!round.layout().hasSlot(g.slotId()))throw new RoomService.Failure(400,"ROOM_INVALID_PLACE");
            if(!places.add(g.slotId()))throw new RoomService.Failure(400,"ROOM_DUPLICATE_PLACE");}
        answers.put(member,List.copyOf(guesses));submittedAt.put(member,now);
        if(answers.keySet().containsAll(seats))phaseEnds=Math.min(phaseEnds,now+timing.earlyCloseMs());
        return true;
    }
    /** Closes answering early once every player still connected has answered (absent players simply score what they sent). */
    boolean everyoneAnswered(Collection<String> connected,long now){
        if(phase!=Phase.ANSWER_PHASE)return false;
        for(String s:seats)if(connected.contains(s)&&!answers.containsKey(s))return false;
        if(answers.isEmpty())return false;
        long close=now+timing.earlyCloseMs();if(close<phaseEnds){phaseEnds=close;return true;}return false;
    }

    private void score(){
        if(scored)return;scored=true;
        for(String s:seats)results.put(s,RoomScoring.score(round.changes(),answers.getOrDefault(s,List.of()),rules));
    }
    /** Ranking: points, then earlier submission, then seat order. */
    List<String> ranking(){
        List<String> order=new ArrayList<>(seats);
        order.sort(Comparator.<String>comparingInt(s->-results.get(s).points()).thenComparingLong(s->submittedAt.getOrDefault(s,Long.MAX_VALUE)).thenComparingInt(seats::indexOf));
        return order;
    }

    // ---------- per-viewer snapshots ----------
    private List<Map<String,Object>> places(){
        List<Map<String,Object>> out=new ArrayList<>();
        for(var s:round.layout().slots())out.add(Map.of("id",s.id(),"x",s.x(),"y",s.y(),"surface",s.surface().name(),"label",s.labelRu()));
        return out;
    }
    private static List<Map<String,Object>> objects(RoomState state){
        List<Map<String,Object>> out=new ArrayList<>();
        for(var p:state.bySlot().values()){var def=RoomCatalog.object(p.objectId());
            Map<String,Object> o=new LinkedHashMap<>();o.put("id",p.objectId());o.put("name",def.nameRu());o.put("slot",p.slotId());
            o.put("size",def.size().name());o.put("rotated",p.rotated());o.put("variant",p.variant());o.put("lit",p.lit());o.put("light",def.light());o.put("rotatable",def.rotatable());o.put("variants",def.variants());
            out.add(o);}
        return out;
    }
    private static Map<String,Object> placed(RoomState.Placed p){
        if(p==null)return null;Map<String,Object> o=new LinkedHashMap<>();
        o.put("id",p.objectId());o.put("slot",p.slotId());o.put("rotated",p.rotated());o.put("variant",p.variant());o.put("lit",p.lit());return o;}
    private static List<Map<String,Object>> guesses(List<Guess> list){
        List<Map<String,Object>> out=new ArrayList<>();for(Guess g:list)out.add(Map.of("slot",g.slotId(),"type",g.type().name()));return out;}

    Map<String,Object> snapshot(String self,boolean host,long now){
        Map<String,Object> v=new LinkedHashMap<>();
        v.put("sessionId",id);v.put("phase",phase.name());v.put("serverTime",now);v.put("phaseStartedAt",phaseStarted);
        v.put("phaseEndsAt",phaseEnds==Long.MAX_VALUE?-1:phaseEnds);v.put("difficulty",round.difficulty().name());
        v.put("room",round.layout().id());v.put("background",round.layout().background());v.put("roomName",round.layout().nameRu());
        v.put("seats",seats);v.put("guessLimit",round.guessLimit());v.put("places",places());
        int me=seats.indexOf(self);v.put("role",host?"HOST":me>=0?"PLAYER":"SPECTATOR");
        v.put("submitted",seats.stream().filter(answers::containsKey).toList());
        // The room: original before the blackout, nothing during it, the changed room afterwards.
        switch(phase){
            case INTRO,OBSERVATION->v.put("objects",objects(round.original()));
            case BLACKOUT->v.put("objects",List.of());
            default->v.put("objects",objects(round.changed()));
        }
        if(me>=0&&answers.containsKey(self))v.put("myAnswers",guesses(answers.get(self)));
        if(phase==Phase.REVEAL||phase==Phase.RESULTS){
            v.put("original",objects(round.original()));
            List<Map<String,Object>> key=new ArrayList<>();
            for(int i=0;i<round.changes().size();i++){var c=round.changes().get(i);Map<String,Object> k=new LinkedHashMap<>();
                k.put("type",c.type().name());k.put("object",c.objectId());k.put("name",RoomCatalog.object(c.objectId()).nameRu());k.put("caption",c.captionRu());
                k.put("before",placed(c.before()));k.put("after",placed(c.after()));k.put("slots",List.copyOf(c.slots()));
                List<String> found=new ArrayList<>(),close=new ArrayList<>();
                for(String s:seats){var hit=results.get(s).perChange().get(i);if(hit==RoomScoring.Hit.EXACT)found.add(s);else if(hit==RoomScoring.Hit.PARTIAL)close.add(s);}
                k.put("foundBy",found);k.put("closeBy",close);key.add(k);}
            v.put("changes",key);v.put("revealStepMs",timing.revealStepMs());v.put("revealIntroMs",timing.revealIntroMs());
            List<Map<String,Object>> table=new ArrayList<>();int rank=0;
            for(String s:ranking()){var r=results.get(s);rank++;Map<String,Object> row=new LinkedHashMap<>();
                row.put("playerId",s);row.put("rank",rank);row.put("points",r.points());row.put("correct",r.correct());row.put("partial",r.partial());row.put("wrong",r.wrong());
                row.put("answers",guesses(answers.getOrDefault(s,List.of())));row.put("submitted",answers.containsKey(s));table.add(row);}
            v.put("results",table);
        }
        return v;
    }
}
