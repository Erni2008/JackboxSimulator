package com.erni.finalanswer.impostor;

import com.erni.finalanswer.audio.HostVoiceManager;
import com.erni.finalanswer.gameplay.impostor.*;
import java.util.ArrayDeque;

/** Optional recorded lines on the existing voice bus. Never advances an authoritative phase. */
final class VotingNarration {
    private final HostVoiceManager voice;
    private final ArrayDeque<String> queue=new ArrayDeque<>();
    private String session="",section="",warningKey="";
    private static final long EPILOGUE_AT=7600;
    private boolean active,closed;
    private long previous=-1,nextAt,expires=Long.MAX_VALUE,generation;
    VotingNarration(HostVoiceManager voice){this.voice=voice;}
    void update(FinalActSnapshot snapshot,long now){
        if(closed||snapshot==null||!voice.manifestReady())return;
        if(!session.equals(snapshot.sessionId())){reset();session=snapshot.sessionId();}
        long identityAge=now-snapshot.phaseStartedAt()+(snapshot.phase()==ImpostorPhase.RESULT?4000:0);
        boolean identity=snapshot.outcome().equals("NO_CONSENSUS")||identityAge>=EPILOGUE_AT;
        String next=switch(snapshot.phase()){
            case EVIDENCE_REVIEW -> "discussion";
            case FINAL_VOTING -> "ballot";
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
            long anchor=snapshot.phaseStartedAt()+(identity&&!snapshot.outcome().equals("NO_CONSENSUS")&&(snapshot.phase()==ImpostorPhase.IMPOSTOR_REVEAL||snapshot.phase()==ImpostorPhase.RESULT)?EPILOGUE_AT-(snapshot.phase()==ImpostorPhase.RESULT?4000:0):0);
            boolean fresh=now-anchor<750;
            if(fresh)switch(next){
                case "discussion" -> queue.add("impostor_discussion");
                case "ballot" -> queue.add("impostor_final_voting");
                case "intro" -> add("intro_1","intro_2");
                case "tie" -> add(snapshot.submitted()>0?"tie":"no_votes");
                case "accused" -> add("reveal_intro");
                case "caught" -> queue.add("impostor_outcome_caught");
                case "innocent","escaped" -> queue.add("impostor_outcome_escaped");
                // Epilogues start only after the supplied seven-second role-reveal score.
                default -> {}
            }

        }
        // Vote impacts are deliberately SFX-only; no spoken vote numbering.
        if(snapshot.deadline()>now)expires=snapshot.deadline();
        else if(snapshot.phase()==ImpostorPhase.RESULT||snapshot.phase()==ImpostorPhase.IMPOSTOR_REVEAL&&identityAge>=EPILOGUE_AT)expires=Long.MAX_VALUE;
        previous=now;
        drain(now);
    }
    /** Early-round guidance uses the same voice channel and completion queue as final voting. */
    void round(String id,ImpostorPhase phase,int round,long started,long deadline,long now){
        if(closed||!voice.manifestReady())return;
        if(!session.equals(id)){reset();session=id;}
        String key=phase.name()+":"+round+":"+deadline;
        if(!section.equals(key)){
            section=key;queue.clear();expires=deadline>0?deadline:now;
            if(now-started>=0&&now-started<750){
                if(phase==ImpostorPhase.ROUND_CLUE_INPUT)queue.add("impostor_round_"+Math.max(1,Math.min(3,round)));
                else if(phase==ImpostorPhase.PRELIMINARY_SUSPICION)queue.add("impostor_suspicion");
            }
        }
        previous=now;
        if(phase==ImpostorPhase.ROUND_CLUE_INPUT&&deadline>now&&deadline-now<=5000&&!warningKey.equals(key)&&!active&&!voice.busy()&&queue.isEmpty()){
            warningKey=key;queue.add("impostor_round_deadline");
        }
        drain(now);
    }
    private void drain(long now){
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
    void reset(){generation++;queue.clear();if(active)voice.stop();active=false;section="";session="";warningKey="";previous=-1;nextAt=0;}
    void close(){reset();closed=true;}
}
