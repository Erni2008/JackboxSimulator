package com.erni.finalanswer.ui.play;

import com.google.gson.*;
import java.util.*;

/** Server-authoritative submission flags; playback is local and never sends answer content. */
public final class QuestionPlayerStates {
    public static final class Player {
        public final String id,characterId;
        public String nickname;
        public boolean submitted,online,playing,thinking,correct,ghost,eligible;
        public long resultAt;
        Player(String id,String characterId,String nickname){this.id=id;this.characterId=characterId;this.nickname=nickname;}
    }
    private final ArrayList<Player> players=new ArrayList<>(8);
    private final List<Player> view=Collections.unmodifiableList(players);
    private String question="";
    private long revision=-1,deadline;
    private boolean active,answering,ended;
    public List<Player> players(){return view;}
    public void synchronize(JsonObject state,long now){
        if(state==null||!state.has("question")){active=false;update(now);return;}
        long nextRevision=state.get("revision").getAsLong();if(nextRevision<revision)return;
        revision=nextRevision;
        String key=state.get("gameId").getAsString()+":"+(state.has("questionNumber")?state.get("questionNumber").getAsInt():0)+":"+state.getAsJsonObject("question").get("id").getAsString();
        boolean next=!key.equals(question);question=key;if(next)ended=false;
        String phase=state.get("phase").getAsString();answering=phase.equals("ANSWERING");
        active=answering||phase.equals("QUESTION_PRESENTATION");if(!active)ended=true;deadline=state.get("deadline").getAsLong();
        Set<String> participants=new HashSet<>();
        if(state.has("participantIds"))for(JsonElement id:state.getAsJsonArray("participantIds"))participants.add(id.getAsString());
        Set<String> present=new HashSet<>();
        for(JsonElement value:state.getAsJsonArray("players")){
            JsonObject p=value.getAsJsonObject();String id=p.get("id").getAsString();
            boolean ghost=p.has("lifeState")&&p.get("lifeState").getAsString().equals("GHOST")
                ||p.has("isGhost")&&p.get("isGhost").getAsBoolean();
            if(p.has("host")&&p.get("host").getAsBoolean()||!ghost&&state.has("participantIds")&&!participants.contains(id))continue;
            present.add(id);Player found=null;for(Player player:players)if(player.id.equals(id)){found=player;break;}
            String character=p.get("characterId").getAsString();
            if(found==null){if(players.size()>=8)throw new IllegalArgumentException("At most eight round players");found=new Player(id,character,p.get("name").getAsString());players.add(found);}
            if(next){found.submitted=false;found.correct=false;found.resultAt=0;}
            found.ghost=ghost;found.eligible=(!state.has("participantIds")||participants.contains(id));
            found.nickname=p.get("name").getAsString();found.online=p.get("connectionStatus").getAsString().equals("ONLINE");
            found.submitted|=found.eligible&&p.get("hasSubmittedAnswer").getAsBoolean();
        }
        players.removeIf(p->!present.contains(p.id));
        if((phase.equals("RESULTS")||phase.equals("GAME_FINISHED"))&&state.has("results")){
            for(JsonElement result:state.getAsJsonArray("results")){
                JsonObject row=result.getAsJsonObject();
                for(Player player:players)if(player.eligible&&player.id.equals(row.get("playerId").getAsString())){
                    player.correct=row.get("isCorrect").getAsBoolean()&&row.get("answeredInTime").getAsBoolean();
                    player.resultAt=state.has("phaseStartedAt")?state.get("phaseStartedAt").getAsLong():now;
                }
            }
        }
        update(now);
    }
    /** Enforce the known server deadline even if its next broadcast is delayed. */
    public boolean activeRound(){return active&&!ended;}
    public void update(long now){if(answering&&now>=deadline)ended=true;for(Player player:players){player.playing=active&&!ended&&player.eligible&&player.online&&player.submitted;player.thinking=active&&!ended&&player.eligible&&player.online&&!player.submitted;}}
}
