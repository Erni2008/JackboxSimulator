package com.erni.finalanswer.impostor;

import com.erni.finalanswer.audio.HostVoiceManager;
import com.erni.finalanswer.gameplay.impostor.*;
import java.util.ArrayDeque;

/** Optional recorded lines on the existing voice bus. Never advances an authoritative phase. */
final class VotingNarration {
    private final HostVoiceManager voice;
    private final ArrayDeque<String> queue=new ArrayDeque<>();
    private String session="",section="";
    private boolean active,closed;
    private long previous=-1,nextAt,expires=Long.MAX_VALUE,generation;
    VotingNarration(HostVoiceManager voice){this.voice=voice;}
    void update(FinalActSnapshot snapshot,long now){
        if(closed||snapshot==null||!voice.manifestReady())return;
        if(!session.equals(snapshot.sessionId())){reset();session=snapshot.sessionId();}
        boolean identity=snapshot.phase()==ImpostorPhase.RESULT||snapshot.phase()==ImpostorPhase.IMPOSTOR_REVEAL&&(snapshot.outcome().equals("NO_CONSENSUS")||now-snapshot.phaseStartedAt()>=FinalRevealTiming.IDENTITY_NAME_MILLIS);
        String next=switch(snapshot.phase()){
            case VOTING_LOCKED -> "intro";
            case FINAL_VOTE_REVEAL -> "count";
            case SUSPECT_ANNOUNCEMENT -> snapshot.leaders().size()==1?"accused":"tie";
            case IMPOSTOR_REVEAL,RESULT -> !identity?"identity_wait":switch(snapshot.outcome()){
                case "IMPOSTOR_CAUGHT" -> "caught";
                case "IMPOSTOR_ESCAPED" -> snapshot.leaders().size()==1&&!snapshot.leaders().getFirst().equals(snapshot.impostorId())?"innocent":"escaped";
                case "NO_CONSENSUS" -> "tie";
                default -> "";
            };
            default -> "";
        };
        if(!section.equals(next)){
            section=next;queue.clear();
            expires=snapshot.deadline()>now?snapshot.deadline():Long.MAX_VALUE;
            // Reconnection restores the scene silently rather than replaying an old monologue.
            long anchor=snapshot.phaseStartedAt()+(identity&&snapshot.phase()==ImpostorPhase.IMPOSTOR_REVEAL&&!snapshot.outcome().equals("NO_CONSENSUS")?FinalRevealTiming.IDENTITY_NAME_MILLIS:0);
            boolean fresh=now-anchor<750;
            if(fresh)switch(next){
                case "intro" -> add("intro_1","intro_2");
                case "tie" -> {if(snapshot.submitted()>0)add("tie_1","tie_2","tie_3");add("tie_spared");}
                case "accused" -> {
                    add("accused_1","accused_2");
                    String named="impostor_vote_name_"+snapshot.leaders().getFirst();
                    if(ready(voice.eventEntry(named)))queue.add(named);else add("accused_address");
                    add("accused_reveal");
                }
                case "caught" -> add("caught_1","caught_2","caught_3");
                case "innocent" -> add("innocent_1","innocent_2","innocent_3","innocent_4");
                default -> {}
            }

        }
        if(snapshot.phase()==ImpostorPhase.FINAL_VOTE_REVEAL&&previous>=0){
            for(int i=0;i<Math.min(2,snapshot.stampTargets().size());i++){
                long contact=snapshot.revealStartedAt()+FinalRevealTiming.LEAD+i*FinalRevealTiming.INTERVAL+FinalRevealTiming.IMPACT;
                if(previous<contact&&now>=contact&&now-contact<180&&!active&&!voice.busy()&&queue.isEmpty())add(i==0?"first":"second");
            }
        }
        if(snapshot.deadline()>now)expires=snapshot.deadline();
        else if(snapshot.phase()==ImpostorPhase.RESULT)expires=Long.MAX_VALUE;
        previous=now;
        if(!active&&!voice.busy()&&now>=nextAt){
            while(!queue.isEmpty()){
                String id=queue.removeFirst();var entry=voice.eventEntry(id);
                if(!ready(entry))continue;
                // Do not start a recording which cannot finish in its authoritative scene window.
                if(now+(long)(entry.duration*1000)+150>expires)continue;
                active=true;long token=generation;
                voice.playLine(id,null,result->{if(token==generation){active=false;nextAt=previous+180;}});
                break;
            }
        }
    }
    private static boolean ready(HostVoiceManager.Entry entry){return entry!=null&&"ready".equals(entry.status)&&Float.isFinite(entry.duration)&&entry.duration>0;}
    private void add(String... ids){for(String id:ids)queue.add("impostor_vote_"+id);}
    void reset(){generation++;queue.clear();if(active)voice.stop();active=false;section="";session="";previous=-1;nextAt=0;}
    void close(){reset();closed=true;}
}
