package com.finalanswer.server.game;

import com.finalanswer.server.rooms.RoomService.Failure;
import java.util.*;
import java.security.SecureRandom;
import java.text.Normalizer;
import com.erni.finalanswer.gameplay.impostor.*;

/** Server-only Impostor rounds and private ballots. RoomService's lock serializes every access. */
public final class ImpostorSession {
    public static final long SUSPICION_MILLIS = 5_000;
    public final String id = UUID.randomUUID().toString();
    private final String roomId;
    private int roundCount=3;
    private long clueMillis=CLUE_MILLIS;
    private final Set<String> participants;
    private final List<SuspicionRound> rounds = new ArrayList<>();
    private boolean closed;
    private final Map<String,Long> typing=new HashMap<>();
    public boolean typing(String player,int round,long now){
        if(closed||phase!=ImpostorPhase.ROUND_CLUE_INPUT||round!=clueRound||now>=deadline)throw new Failure(409,"CLUE_ROUND_CLOSED");
        if(!participants.contains(player))throw new Failure(403,"NOT_ELIGIBLE");
        if(clues.containsKey(player))throw new Failure(409,"CLUE_ALREADY_SUBMITTED");
        long until=typing.getOrDefault(player,0L);
        if(until-now>240)return false;
        typing.put(player,now+450);return true;
    }
    public long writingUntil(long now){
        if(phase!=ImpostorPhase.ROUND_CLUE_INPUT||now>=deadline)return 0;
        long until=0;for(var entry:typing.entrySet())if(!clues.containsKey(entry.getKey()))until=Math.max(until,entry.getValue());
        return Math.min(deadline,until>now?until:0);
    }
    private final FinalVoting.Timing finalTiming;
    private FinalVoting finalVoting;
    private final ImpostorResultPolicy resultPolicy=ImpostorResultPolicy.configured();
    private ImpostorMatchResult result;
    public ImpostorMatchResult result(){return phase==ImpostorPhase.RESULT?result:null;}
    public void prepareReplay(){if(closed||phase!=null)throw new Failure(409,"INVALID_PHASE");phase=ImpostorPhase.REPLAY_PREPARATION;}
    private void complete(long now){
        var votes=finalVoting.snapshot();var side=resultPolicy.winner(votes.outcome());
        var players=new ArrayList<ImpostorMatchResult.Participant>();var abstentions=new ArrayList<String>();
        for(String id:participants){boolean impostor=id.equals(impostorId);
            players.add(new ImpostorMatchResult.Participant(id,impostor?"IMPOSTOR":"INNOCENT",impostor==(side==ImpostorMatchResult.Side.IMPOSTOR),votes.counts().get(id)));
            if(!votes.ballots().containsKey(id))abstentions.add(id);
        }
        int submitted=revealed.stream().flatMap(r->r.values().stream()).mapToInt(word->word.equals("—")?0:1).sum();
        result=new ImpostorMatchResult(id,now,votes.outcome().name(),impostorId,side,players,votes.ballots(),abstentions,revealed,votes.leaders(),
            new ImpostorMatchResult.Statistics(participants.size(),revealed.size(),submitted,votes.ballots().size(),abstentions.size()));
        enterFinalPhase(ImpostorPhase.RESULT,now,0);
    }
    private long finalPhaseStartedAt, finalRevealStartedAt, identityRevealStartedAt;
    public long identityRevealStartedAt(){return identityRevealStartedAt;}
    public boolean finalStage(){return finalPhaseStartedAt>0;}
    public long finalPhaseStartedAt(){return finalPhaseStartedAt;}
    public long finalRevealStartedAt(){return finalRevealStartedAt;}
    public FinalVoting finalVoting(){return finalVoting;}
    public boolean votesPublic(){return phase==ImpostorPhase.FINAL_VOTE_REVEAL || phase==ImpostorPhase.SUSPECT_ANNOUNCEMENT || identityPublic();}
    public boolean identityPublic(){return phase==ImpostorPhase.IMPOSTOR_REVEAL || phase==ImpostorPhase.RESULT;}
    public String revealedImpostor(){return identityPublic()?impostorId:null;}
    private void enterFinalPhase(ImpostorPhase next,long now,long duration){if(next==ImpostorPhase.IMPOSTOR_REVEAL)identityRevealStartedAt=now;phase=next;finalPhaseStartedAt=now;deadline=duration==0?0:now+duration;}
    public void submitFinalVote(String voter,String target,long now){
        if(closed || phase!=ImpostorPhase.FINAL_VOTING || now>=deadline)throw new Failure(409,"FINAL_VOTING_CLOSED");
        finalVoting.submit(voter,target,now);
        if(finalVoting.allSubmitted())lockFinalVotes(now);
    }
    private void lockFinalVotes(long now){
        finalVoting.close(impostorId);enterFinalPhase(ImpostorPhase.VOTING_LOCKED,now,FinalVoting.LOCK_MILLIS);
    }
    private ImpostorPhase phase;
    private String secretWord, impostorId, wordHint;
    private int clueRound;
    private long deadline, sequence, finalizedAt;
    private final List<Map<String,String>> revealed = new ArrayList<>();
    private final Map<String,String> clues = new LinkedHashMap<>();
    // A bounded semantic attempt budget prevents a rapid secret-word validation oracle.
    private final Map<String,Integer> attempts = new HashMap<>();
    public static final long CLUE_MILLIS=10_000, REVEAL_MILLIS=500, ROLE_MILLIS=12_000, SEAL_MILLIS=1_850;

    /** Trusted start only. Hidden information never leaves personalized serialization. */
    public void begin(WordSource words, SecureRandom random, long now) {
        if(closed || phase!=null && phase!=ImpostorPhase.REPLAY_PREPARATION || !rounds.isEmpty())throw new Failure(409,"INVALID_PHASE");
        secretWord=normalize(words.choose(random));
        wordHint=WordHints.safe(secretWord,words.hint(secretWord));
        impostorId=new ArrayList<>(participants).get(random.nextInt(participants.size()));
        phase=ImpostorPhase.ROLE_REVEAL;deadline=now+ROLE_MILLIS;
    }
    public boolean gameplay(){return phase!=null;}
    public ImpostorPhase phase(){return phase;}
    public int clueRound(){return clueRound;}
    public long deadline(){return deadline;}
    public long revealSequence(){return sequence;}
    public List<Map<String,String>> revealedClues(){return List.copyOf(revealed);}
    public boolean clueSubmitted(String player){return clues.containsKey(player);}
    public String ownClue(String player){return clues.get(player);}
    public int clueCount(){return clues.size();}
    public Map<String,String> privateRole(String player) {
        if(closed || !gameplay() || secretWord==null || impostorId==null || !participants.contains(player))return Map.of();
        return player.equals(impostorId)?Map.of("role","IMPOSTOR","wordHint",wordHint):Map.of("role","ORDINARY","secretWord",secretWord);
    }
    private void beginRound(long now){
        clueRound++;clues.clear();attempts.clear();typing.clear();phase=ImpostorPhase.ROUND_CLUE_INPUT;deadline=now+clueMillis;
    }
    public void submitClue(String player,int round,String text,long now) {
        if(closed || phase!=ImpostorPhase.ROUND_CLUE_INPUT || round!=clueRound || now>=deadline)
            throw new Failure(409,"CLUE_ROUND_CLOSED");
        if(!participants.contains(player))throw new Failure(403,"NOT_ELIGIBLE");
        if(clues.containsKey(player))throw new Failure(409,"CLUE_ALREADY_SUBMITTED");
        // Three semantic attempts per round, including invalid guesses. No secret-specific error.
        if(attempts.merge(player,1,Integer::sum)>3)throw new Failure(400,"INVALID_CLUE");
        String normalized=normalize(text);
        if(normalized.equals(secretWord) || revealed.stream().anyMatch(r->normalized.equals(r.get(player))))
            throw new Failure(400,"INVALID_CLUE");
        clues.put(player,normalized);typing.remove(player);
        if(clues.size()==participants.size())finalizeClues(now);
    }
    public static String normalize(String raw) {
        if(raw==null || raw.length()>96)throw new Failure(400,"INVALID_CLUE");
        String value=Normalizer.normalize(raw,Normalizer.Form.NFC).toUpperCase(Locale.ROOT);
        if(value.isEmpty() || value.codePointCount(0,value.length())>24 || !value.codePoints().allMatch(Character::isLetter))
            throw new Failure(400,"INVALID_CLUE");
        return value;
    }
    private void finalizeClues(long now) {
        if(phase!=ImpostorPhase.ROUND_CLUE_INPUT)return;
        Map<String,String> result=new LinkedHashMap<>();
        for(String player:participants)result.put(player,clues.getOrDefault(player,"—"));
        revealed.add(Collections.unmodifiableMap(result));sequence++;
        phase=ImpostorPhase.ROUND_CLUE_REVEAL;deadline=now+REVEAL_MILLIS;
    }
    /** Called under the room lock. At most one phase edge per tick; never skips a reveal. */
    public boolean advance(long now,Set<String> connected) {
        if(closed || !gameplay())return false;
        switch(phase) {
            case ROLE_REVEAL -> {if(now>=deadline){beginRound(now);return true;}}
            case ROUND_CLUE_INPUT -> {if(now>=deadline){finalizeClues(now);return true;}}
            case ROUND_CLUE_REVEAL -> {if(now>=deadline){
                startSuspicion(clueRound,connected,now);phase=ImpostorPhase.PRELIMINARY_SUSPICION;
                deadline=current().deadline;finalizedAt=0;return true;
            }}
            case PRELIMINARY_SUSPICION -> {
                boolean changed=tick(now);
                if(current().finalized()) {
                    if(finalizedAt==0){finalizedAt=now;return true;}
                    if(now-finalizedAt>=SEAL_MILLIS){
                        if(clueRound==roundCount){enterFinalPhase(ImpostorPhase.EVIDENCE_REVIEW,now,finalTiming.discussionMillis());}
                        else beginRound(now);
                        return true;
                    }
                }
                return changed;
            }
            case EVIDENCE_REVIEW -> {if(now>=deadline){
                enterFinalPhase(ImpostorPhase.FINAL_VOTING,now,finalTiming.votingMillis());
                finalVoting=new FinalVoting(participants,deadline);return true;
            }}
            case FINAL_VOTING -> {if(now>=deadline){lockFinalVotes(now);return true;}}
            case VOTING_LOCKED -> {if(now>=deadline){
                finalRevealStartedAt=now;enterFinalPhase(ImpostorPhase.FINAL_VOTE_REVEAL,now,
                    FinalVoting.LEAD_MILLIS+finalVoting.snapshot().stampTargets().size()*FinalVoting.STAMP_MILLIS+FinalVoting.HOLD_MILLIS);return true;
            }}
            case FINAL_VOTE_REVEAL -> {if(now>=deadline){enterFinalPhase(ImpostorPhase.SUSPECT_ANNOUNCEMENT,now,FinalVoting.ANNOUNCEMENT_MILLIS);return true;}}
            case SUSPECT_ANNOUNCEMENT -> {if(now>=deadline){enterFinalPhase(ImpostorPhase.IMPOSTOR_REVEAL,now,FinalVoting.IDENTITY_MILLIS);return true;}}
            case IMPOSTOR_REVEAL -> {if(now>=deadline){complete(now);return true;}}
            default -> {}
        }
        return false;
    }


    public ImpostorSession(String roomId, List<String> activeIds) {this(roomId,activeIds,FinalVoting.Timing.configured());}
    public ImpostorSession(String roomId,List<String> activeIds,FinalVoting.Timing finalTiming) {
        this.finalTiming=Objects.requireNonNull(finalTiming);
        this.roomId = Objects.requireNonNull(roomId);
        participants = Collections.unmodifiableSet(new LinkedHashSet<>(activeIds));
        if ((activeIds.size()!=3 && activeIds.size()!=4) || participants.size()!=activeIds.size()
                || participants.stream().anyMatch(id -> id==null || id.isBlank()))
            throw new Failure(400,"INVALID_IMPOSTOR_PARTICIPANTS");
    }
    public ImpostorSession(String roomId,List<String> activeIds,ImpostorSettings settings){
        this(roomId,activeIds,new FinalVoting.Timing(settings.discussionSeconds()*1000L,settings.votingSeconds()*1000L));
        roundCount=settings.roundCount();clueMillis=settings.clueSeconds()*1000L;
    }
    public Set<String> participants() { return participants; }
    public SuspicionRound current() { return rounds.isEmpty()?null:rounds.getLast(); }
    public List<SuspicionRound> rounds() { return List.copyOf(rounds); }

    /** Trusted orchestration hook: caller must already have completed this round's clue reveal. */
    public void startSuspicion(int round, Set<String> connectedVoters, long now) {
        if (closed || gameplay() && phase!=ImpostorPhase.ROUND_CLUE_REVEAL || round!=rounds.size()+1 || round>3 || current()!=null && !current().finalized)
            throw new Failure(409,"INVALID_SUSPICION_ROUND");
        rounds.add(new SuspicionRound(roomId,id,round,connectedVoters,now+SUSPICION_MILLIS));
    }
    public void submit(String voter, String suspect, int round, long now) {
        SuspicionRound current=current();
        if (closed || current==null || current.round!=round) throw new Failure(409,"STALE_SUSPICION");
        if (now>=current.deadline) { current.finalized=true; throw new Failure(409,"SUSPICION_TOO_LATE"); }
        if (current.finalized) throw new Failure(409,"SUSPICION_CLOSED");
        if (!current.eligible.contains(voter)) throw new Failure(403,"NOT_ELIGIBLE");
        if (!participants.contains(suspect)) throw new Failure(400,"INVALID_SUSPECT");
        if (voter.equals(suspect)) throw new Failure(400,"SELF_SUSPICION");
        current.selections.put(voter,suspect);
        if (!current.eligible.isEmpty() && current.selections.size()==current.eligible.size()) current.finalized=true;
    }
    public boolean tick(long now) {
        var current=current();
        if(current==null || current.finalized || now<current.deadline)return false;
        current.finalized=true;return true;
    }
    public void close() {closed=true;typing.clear();secretWord=null;impostorId=null;wordHint=null;clues.clear();attempts.clear();result=null;revealed.clear();finalVoting=null;if(current()!=null)current().finalized=true;}

    public static final class SuspicionRound {
        public final String roomId, sessionId;
        public final int round;
        public final long deadline;
        private final Set<String> eligible;
        private final Map<String,String> selections=new LinkedHashMap<>();
        private boolean finalized;
        private SuspicionRound(String room,String session,int round,Set<String> eligible,long deadline) {
            roomId=room;sessionId=session;this.round=round;this.deadline=deadline;this.eligible=Set.copyOf(eligible);
        }
        public int eligibleCount(){return eligible.size();}
        public int submittedCount(){return selections.size();}
        public boolean eligible(String id){return eligible.contains(id);}
        public String ownSelection(String id){return selections.get(id);}
        public boolean finalized(){return finalized;}
        /** Server-side audit only. Never serialize this map in room snapshots. */
        public Map<String,String> selectionsForAudit(){return Map.copyOf(selections);}
    }
}
