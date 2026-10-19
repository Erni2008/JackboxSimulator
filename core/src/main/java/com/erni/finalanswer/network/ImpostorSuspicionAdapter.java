package com.erni.finalanswer.network;

import com.erni.finalanswer.impostor.*;
import com.erni.finalanswer.rooms.RoomSession;
import com.erni.finalanswer.gameplay.impostor.ImpostorPhase;
import com.google.gson.*;
import java.util.*;

/** Render-thread bridge for explicit Impostor sessions. Public history is replay-safe across reconnects. */
public final class ImpostorSuspicionAdapter {
    private final RealtimeClient connection;
    private final ImpostorScreen screen;
    private JsonObject previous;
    private String session="",lastPhase="";
    private long revealSequence;
    public ImpostorSuspicionAdapter(RealtimeClient connection,ImpostorScreen screen){this.connection=connection;this.screen=screen;}
    public void update(){
        JsonObject state=connection.snapshot();
        if(state==null || state==previous)return;
        previous=state;
        if(!state.has("impostor")){screen.clearSuspicion();screen.clearFinal();return;}
        apply(state.getAsJsonObject("impostor"),connection.serverNow());
    }
    /** Also usable by deterministic development fixtures; never assigns roles or selects a roster. */
    public void apply(JsonObject mini,long serverNow){
        String phase=mini.get("phase").getAsString(),id=mini.get("sessionId").getAsString();
        // Completion holds the existing identity scene. Never enter the obsolete results presentation.
        boolean completed=phase.equals("RESULT");
        if(completed)phase="IMPOSTOR_REVEAL";
        boolean fresh=!id.equals(session);
        if(!mini.has("finalPhaseStartedAt"))screen.clearFinal();
        if(mini.has("revealedClues")) {
            if(fresh){
                var roster=new ArrayList<ImpostorParticipant>();
                for(JsonElement e:mini.getAsJsonArray("participants")){
                    var p=e.getAsJsonObject();
                    roster.add(new ImpostorParticipant(new RoomSession.Player(p.get("id").getAsString(),p.get("name").getAsString(),false,
                        p.get("characterId").getAsString(),"ONLINE",false,0),List.of("","","")));
                }
                screen.setParticipants(roster);session=id;revealSequence=0;lastPhase="";
            }
            long sequence=mini.get("revealSequence").getAsLong();
            if(fresh || sequence>revealSequence) {
                List<Map<String,String>> history=new ArrayList<>();
                for(JsonElement e:mini.getAsJsonArray("revealedClues")){
                    Map<String,String> clues=new LinkedHashMap<>();
                    e.getAsJsonObject().entrySet().forEach(v->clues.put(v.getKey(),v.getValue().getAsString()));history.add(clues);
                }
                if(phase.equals("ROUND_CLUE_REVEAL") && !history.isEmpty()){
                    screen.restoreClues(history.subList(0,history.size()-1),false);
                    screen.revealClues(history.getLast());
                }else screen.restoreClues(history,!phase.equals("ROUND_CLUE_INPUT") || mini.get("round").getAsInt()==3 && history.size()==3);
                revealSequence=sequence;
            }
            if(!phase.equals(lastPhase)) {
                if(phase.equals("ROUND_CLUE_INPUT"))screen.flipPapersBack();
                if(!phase.equals("PRELIMINARY_SUSPICION"))screen.clearSuspicion();
                lastPhase=phase;
            }
            if(!completed)screen.presentPhase(ImpostorPhase.valueOf(phase),mini.get("deadline").getAsLong(),serverNow);
            if(mini.has("finalPhaseStartedAt")) {
                var targets=new ArrayList<String>();var counts=new LinkedHashMap<String,Integer>();String finalSequence="";
                if(mini.has("finalVoteSnapshot")){
                    var result=mini.getAsJsonObject("finalVoteSnapshot");finalSequence=result.get("sequenceId").getAsString();
                    for(var target:result.getAsJsonArray("stampTargets"))targets.add(target.getAsString());
                    result.getAsJsonObject("counts").entrySet().forEach(e->counts.put(e.getKey(),e.getValue().getAsInt()));
                }
                var leaders=new ArrayList<String>();if(mini.has("leadingSuspects"))for(var leader:mini.getAsJsonArray("leadingSuspects"))leaders.add(leader.getAsString());
                screen.presentFinal(new FinalActSnapshot(id,ImpostorPhase.valueOf(phase),(completed&&mini.has("identityRevealStartedAt")?mini.get("identityRevealStartedAt").getAsLong():mini.get("finalPhaseStartedAt").getAsLong()-(completed?4000:0)),
                    mini.get("deadline").getAsLong(),mini.get("finalRevealStartedAt").getAsLong(),mini.get("finalSubmittedCount").getAsInt(),
                    mini.get("finalEligibleCount").getAsInt(),finalSequence,targets,counts,leaders,
                    mini.has("revealedImpostorId")?mini.get("revealedImpostorId").getAsString():"",mini.has("outcome")?mini.get("outcome").getAsString():""),serverNow);
            }

        }
        if(phase.equals("PRELIMINARY_SUSPICION") || phase.equals("SUSPICION_FINALIZED")){
            boolean finalized=phase.equals("SUSPICION_FINALIZED") || mini.has("suspicionFinalized") && mini.get("suspicionFinalized").getAsBoolean();
            screen.presentSuspicion(new SuspicionSnapshot(id,mini.get("round").getAsInt(),
                mini.get("submittedCount").getAsInt(),mini.get("eligibleCount").getAsInt(),mini.get("deadline").getAsLong(),finalized),serverNow);
        }else if(!mini.has("revealedClues"))screen.clearSuspicion();
    }
}
