package com.finalanswer.server.rooms;

import com.erni.finalanswer.gameplay.cursedcards.*;
import java.util.*;

/**
 * Server-authoritative THE CURSED CARDS match: 4–8 seated players, everyone else spectates. Phases:
 * CURSE_VOTE (spectators may curse one player; skipped without spectators) → DEALING (presentation time on the
 * shared screen) → PLAYING (turn timer; timeout takes a random hidden card) → FINISHED. The rules live in
 * {@link CursedCardsGame}; this class adds timing, idempotent commands and per-viewer snapshots. Hidden values
 * leave the server only for their owner; card ids are shuffled so an id never betrays the DEATH card.
 */
final class CursedCardsSession {
    enum Phase {CURSE_VOTE,DEALING,PLAYING,FINISHED}
    static final long VOTE_MS=12_000,TURN_MS=12_000,DEAL_STEP_MS=420,DEAL_BASE_MS=2_600,PAIR_MS=900,AFTER_DRAW_MS=1_400;
    /** Probability that the audience's curse puts DEATH into the cursed player's initial hand. */
    static final double CURSE_WEIGHT=.5;

    final String id=UUID.randomUUID().toString();
    final List<String> seats;final Set<String> spectators;
    private final Random random;private final CursedDeck deckRules=new CursedDeck();
    private CursedCardsGame game;private Phase phase;
    private long phaseEnds,turnReadyAt,turnDeadline;private int turnSeq;
    private final Map<String,String> votes=new LinkedHashMap<>();private String cursed;
    private final List<Map<String,Object>> events=new ArrayList<>();
    private final Set<String> handled=new HashSet<>();
    private int timeouts;private boolean readyAnnounced;

    CursedCardsSession(List<String> seats,Collection<String> spectators,Random random,long now){
        if(seats.size()<CursedDeck.MIN_PLAYERS||seats.size()>CursedDeck.MAX_PLAYERS)throw new RoomService.Failure(409,"CARDS_PLAYER_COUNT");
        if(new HashSet<>(seats).size()!=seats.size())throw new RoomService.Failure(400,"INVALID_CARDS_ROSTER");
        this.seats=List.copyOf(seats);this.spectators=new LinkedHashSet<>(spectators);this.spectators.removeAll(seats);this.random=random;
        if(this.spectators.isEmpty())deal(now);else{phase=Phase.CURSE_VOTE;phaseEnds=now+VOTE_MS;}
    }
    Phase phase(){return phase;}
    int seat(String member){return seats.indexOf(member);}
    String cursedPlayer(){return cursed;}
    CursedCardsGame game(){return game;}
    int timeouts(){return timeouts;}

    /** Spectators only, during CURSE_VOTE; a later vote replaces the earlier one. Returns true when state changed. */
    boolean vote(String member,String requestId,String target,long now){
        if(!handled.add(requestId))return false;
        if(phase!=Phase.CURSE_VOTE)throw new RoomService.Failure(409,"CARDS_VOTE_CLOSED");
        if(!spectators.contains(member))throw new RoomService.Failure(403,"CARDS_NOT_SPECTATOR");
        if(!seats.contains(target))throw new RoomService.Failure(400,"CARDS_INVALID_TARGET");
        if(target.equals(votes.get(member)))return false;
        votes.put(member,target);if(votes.size()==spectators.size())phaseEnds=Math.min(phaseEnds,now+1_200);return true;
    }
    /** The current drawer takes the hidden card at {@code slot} of the source's hand. Duplicates and stale turns are ignored or refused. */
    boolean draw(String member,String requestId,int turn,int slot,long now){
        if(!handled.add(requestId))return false;
        if(phase!=Phase.PLAYING)throw new RoomService.Failure(409,"CARDS_NOT_PLAYING");
        if(now<turnReadyAt)throw new RoomService.Failure(409,"CARDS_TURN_NOT_READY");
        if(turn!=turnSeq)throw new RoomService.Failure(409,"CARDS_STALE_TURN");
        int s=seat(member);if(s<0||s!=game.current())throw new RoomService.Failure(403,"CARDS_NOT_YOUR_TURN");
        if(slot<0||slot>=game.handSize(game.source()))throw new RoomService.Failure(400,"CARDS_INVALID_SLOT");
        apply(new CursedCardsGame.Draw(s,game.source(),slot),now,false);return true;
    }
    /** Advances timed phases; returns true when the snapshot changed. */
    boolean tick(long now){
        switch(phase){
            case CURSE_VOTE->{if(now>=phaseEnds){deal(now);return true;}}
            case DEALING->{if(now>=phaseEnds){phase=game.phase()==CursedCardsGame.Phase.FINISHED?Phase.FINISHED:Phase.PLAYING;openTurn(now);return true;}}
            case PLAYING->{if(now>=turnDeadline){timeouts++;apply(game.randomDraw(),now,true);return true;}
                // announce the moment the drawer may act, so phones enable their cards without waiting for a ping
                if(!readyAnnounced&&now>=turnReadyAt){readyAnnounced=true;return true;}}
            default->{}
        }
        return false;
    }
    private void apply(CursedCardsGame.Draw draw,long now,boolean timeout){
        int before=events.size();
        if(timeout)event("timeout","seat",draw.player());
        if(!game.draw(draw))throw new IllegalStateException("rules refused a validated draw");
        long pairs=events.subList(before,events.size()).stream().filter(e->e.get("type").equals("pair")).count();
        turnSeq++;readyAnnounced=false;
        if(game.phase()==CursedCardsGame.Phase.FINISHED){phase=Phase.FINISHED;return;}
        turnReadyAt=now+AFTER_DRAW_MS+pairs*PAIR_MS;turnDeadline=turnReadyAt+TURN_MS;
    }
    private void openTurn(long now){turnReadyAt=now;turnDeadline=now+TURN_MS;readyAnnounced=true;}

    /** Build the deck (ids shuffled), apply the audience curse to the initial distribution only, deal. */
    private void deal(long now){
        int n=seats.size();
        cursed=votes.isEmpty()?null:topVote();
        List<CursedCard> built=deckRules.build(n,random);
        List<Integer> ids=new ArrayList<>();for(int i=0;i<built.size();i++)ids.add(i);Collections.shuffle(ids,random);
        List<CursedCard> deck=new ArrayList<>();for(int i=0;i<built.size();i++)deck.add(new CursedCard(ids.get(i),built.get(i).value()));
        if(cursed!=null&&random.nextDouble()<CURSE_WEIGHT){int target=seats.indexOf(cursed),death=-1;
            for(int i=0;i<deck.size();i++)if(deck.get(i).death())death=i;
            if(death%n!=target){List<Integer> slots=new ArrayList<>();for(int i=target;i<deck.size();i+=n)slots.add(i);Collections.swap(deck,death,slots.get(random.nextInt(slots.size())));}}
        game=new CursedCardsGame(n,deck,random);
        game.addListener(new CursedCardsListener(){
            public void dealt(CursedCard c,int p){event("dealt","card",c.id(),"seat",p);}
            public void pairRemoved(int p,CursedCard a,CursedCard b){event("pair","seat",p,"a",c(a),"b",c(b));}
            public void turnChanged(int d,int s){event("turn","drawer",d,"source",s);}
            public void transferred(CursedCard c,int from,int to){event("transfer","card",c.id(),"from",from,"to",to);}
            public void playerSafe(int p){event("safe","seat",p);}
            public void finished(int loser,List<Integer> survivors){event("finished","loser",loser,"survivors",List.copyOf(survivors),"death",deathId());}
        });
        game.start();
        long pairCount=events.stream().filter(e->e.get("type").equals("pair")).count();
        phase=Phase.DEALING;phaseEnds=now+DEAL_BASE_MS+deck.size()*DEAL_STEP_MS+pairCount*PAIR_MS;
    }
    private String topVote(){Map<String,Integer> tally=tally();int best=Collections.max(tally.values());
        List<String> top=tally.entrySet().stream().filter(e->e.getValue()==best).map(Map.Entry::getKey).sorted().toList();return top.get(random.nextInt(top.size()));}
    private Map<String,Integer> tally(){Map<String,Integer> t=new LinkedHashMap<>();for(String s:seats)t.put(s,0);for(String v:votes.values())t.merge(v,1,Integer::sum);return t;}
    private int deathId(){for(int p=0;p<seats.size();p++)for(CursedCard c:game.hand(p))if(c.death())return c.id();return -1;}
    private static Map<String,Object> c(CursedCard c){return Map.of("id",c.id(),"value",c.value());}
    private void event(String type,Object... kv){Map<String,Object> e=new LinkedHashMap<>();e.put("seq",events.size());e.put("type",type);for(int i=0;i<kv.length;i+=2)e.put((String)kv[i],kv[i+1]);events.add(e);}

    /** Viewer-specific state: own values only for the owner; others see counts. Events carry no hidden values. */
    Map<String,Object> snapshot(String self,boolean host,long now){
        Map<String,Object> v=new LinkedHashMap<>();
        v.put("sessionId",id);v.put("phase",phase.name());v.put("seats",seats);v.put("serverTime",now);
        int me=seat(self);v.put("role",host?"HOST":me>=0?"PLAYER":"SPECTATOR");
        if(phase==Phase.CURSE_VOTE){v.put("voteEndsAt",phaseEnds);v.put("tally",tally());v.put("votes",votes.size());v.put("voters",spectators.size());if(votes.containsKey(self))v.put("myVote",votes.get(self));}
        else if(cursed!=null)v.put("cursedPlayer",cursed);
        if(game==null)return v;
        v.put("deckSize",game.deck().size());v.put("events",events);
        List<Integer> sizes=new ArrayList<>();for(int p=0;p<seats.size();p++)sizes.add(game.handSize(p));v.put("handSizes",sizes);
        List<Boolean> safe=new ArrayList<>();for(int p=0;p<seats.size();p++)safe.add(game.safe(p));v.put("safe",safe);
        if(me>=0){int[] own=game.handFor(me,me);List<Integer> hand=new ArrayList<>();for(int value:own)hand.add(value);v.put("hand",hand);}
        if(phase==Phase.DEALING)v.put("dealEndsAt",phaseEnds);
        if(phase==Phase.PLAYING){v.put("turn",turnSeq);v.put("drawer",seats.get(game.current()));v.put("source",seats.get(game.source()));v.put("sourceCards",game.handSize(game.source()));
            v.put("turnReadyAt",turnReadyAt);v.put("turnDeadline",turnDeadline);v.put("canDraw",me>=0&&me==game.current()&&now>=turnReadyAt);}
        if(phase==Phase.FINISHED){v.put("loser",seats.get(game.loser()));List<String> alive=new ArrayList<>();for(int p=0;p<seats.size();p++)if(p!=game.loser())alive.add(seats.get(p));v.put("survivors",alive);}
        return v;
    }
}
