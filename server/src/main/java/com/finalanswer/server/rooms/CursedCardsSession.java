package com.finalanswer.server.rooms;

import com.erni.finalanswer.gameplay.cursedcards.*;
import java.util.*;

/**
 * Server-authoritative THE CURSED CARDS match: 4–6 seated players, everyone else spectates. Phases:
 * CURSE_VOTE (spectators may curse one player; skipped without spectators) → DEALING (presentation time on the
 * shared screen) → PLAYING (turn timer; timeout takes a random hidden card) → FINISHED. The rules live in
 * {@link CursedCardsGame}; this class adds timing, idempotent commands and per-viewer snapshots. Hidden values
 * leave the server only for their owner; card ids are shuffled so an id never betrays the DEATH card.
 */
final class CursedCardsSession {
    enum Phase {CURSE_VOTE,DEALING,PLAYING,FINISHED}
    /** All match pacing in one place; the defaults target a 1.5–2.5 minute match for 4–6 players. */
    record Timing(long voteMs,long turnMs,long dealStepMs,long dealBaseMs,long pairMs,long afterDrawMs){
        static final Timing DEFAULT=new Timing(10_000,5_000,260,2_000,900,1_400);}
    /** Shuffle pacing: per-player minimum gap, a longer gap while the hand is being drawn from, and how long a superseded order stays selectable. */
    static final long SHUFFLE_GAP_MS=180,SOURCE_SHUFFLE_GAP_MS=450,STALE_GRACE_MS=900;
    static final long VOTE_MS=Timing.DEFAULT.voteMs(),TURN_MS=Timing.DEFAULT.turnMs();
    private final Timing timing;
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
    /** Hand revision per seat (bumps on every shuffle and every change of contents) and recently superseded orders. */
    private int[] revision,shuffledCount;private long[] lastShuffle;private final ArrayDeque<Past> past=new ArrayDeque<>();private int shuffles,drawSlot=-1;
    private record Past(int seat,int revision,int[] ids,long supersededAt){}

    CursedCardsSession(List<String> seats,Collection<String> spectators,Random random,long now){this(seats,spectators,random,now,Timing.DEFAULT);}
    CursedCardsSession(List<String> seats,Collection<String> spectators,Random random,long now,Timing timing){this.timing=timing;
        if(seats.size()<CursedDeck.MIN_PLAYERS||seats.size()>CursedDeck.MAX_PLAYERS)throw new RoomService.Failure(409,"CARDS_PLAYER_COUNT");
        if(new HashSet<>(seats).size()!=seats.size())throw new RoomService.Failure(400,"INVALID_CARDS_ROSTER");
        this.seats=List.copyOf(seats);this.spectators=new LinkedHashSet<>(spectators);this.spectators.removeAll(seats);this.random=random;revision=new int[seats.size()];shuffledCount=new int[seats.size()];lastShuffle=new long[seats.size()];Arrays.fill(lastShuffle,Long.MIN_VALUE/2);
        if(this.spectators.isEmpty())deal(now);else{phase=Phase.CURSE_VOTE;phaseEnds=now+timing.voteMs();}
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
    boolean draw(String member,String requestId,int turn,int slot,long now){return draw(member,requestId,turn,slot,null,now);}
    /**
     * {@code seenRevision} is the source-hand revision the drawer's phone showed; null means "the current order". A
     * selection made against an order the owner replaced less than {@link #STALE_GRACE_MS} ago still takes the card that
     * was at that position (an atomic snapshot: shuffling cannot dodge a tap already in flight, nor starve the drawer);
     * anything older is refused so the phone asks again. Past the five-second deadline the timeout wins.
     */
    boolean draw(String member,String requestId,int turn,int slot,Integer seenRevision,long now){
        if(!handled.add(requestId))return false;
        if(phase!=Phase.PLAYING)throw new RoomService.Failure(409,"CARDS_NOT_PLAYING");
        if(now<turnReadyAt)throw new RoomService.Failure(409,"CARDS_TURN_NOT_READY");
        if(turn!=turnSeq)throw new RoomService.Failure(409,"CARDS_STALE_TURN");
        int s=seat(member);if(s<0||s!=game.current())throw new RoomService.Failure(403,"CARDS_NOT_YOUR_TURN");
        if(now>=turnDeadline)throw new RoomService.Failure(409,"CARDS_TURN_EXPIRED"); // the room tick commits the timeout draw
        int src=game.source();int current;
        if(seenRevision==null||seenRevision==revision[src]){
            if(slot<0||slot>=game.handSize(src))throw new RoomService.Failure(400,"CARDS_INVALID_SLOT");current=slot;}
        else{Past seen=null;for(Past p:past)if(p.seat()==src&&p.revision()==seenRevision)seen=p;
            if(seen==null||now-seen.supersededAt()>STALE_GRACE_MS)throw new RoomService.Failure(409,"CARDS_STALE_HAND");
            if(slot<0||slot>=seen.ids().length)throw new RoomService.Failure(400,"CARDS_INVALID_SLOT");
            current=indexOf(src,seen.ids()[slot]);if(current<0)throw new RoomService.Failure(409,"CARDS_STALE_HAND");}
        drawSlot=slot;apply(new CursedCardsGame.Draw(s,src,current),now,false);return true;
    }
    /** The seated owner reorders their own hand; unlimited, but paced so it cannot flood the room. */
    boolean shuffle(String member,String requestId,long now){
        if(!handled.add(requestId))return false;
        if(phase!=Phase.PLAYING&&phase!=Phase.DEALING)throw new RoomService.Failure(409,"CARDS_NOT_PLAYING");
        int s=seat(member);if(s<0)throw new RoomService.Failure(403,"CARDS_NOT_PLAYER");
        if(game.handSize(s)<2)throw new RoomService.Failure(409,"CARDS_NOTHING_TO_SHUFFLE");
        boolean beingDrawn=phase==Phase.PLAYING&&s==game.source();
        if(now-lastShuffle[s]<(beingDrawn?SOURCE_SHUFFLE_GAP_MS:SHUFFLE_GAP_MS))return false; // coalesced: the latest order already stands
        int[] ids=new int[game.handSize(s)];for(int i=0;i<ids.length;i++)ids[i]=game.hand(s).get(i).id();
        past.addLast(new Past(s,revision[s],ids,now));while(past.size()>24)past.removeFirst();
        game.shuffle(s,random);revision[s]++;shuffledCount[s]++;lastShuffle[s]=now;shuffles++;return true;
    }
    int shuffles(){return shuffles;}
    int revision(int seat){return revision[seat];}
    private int indexOf(int seat,int id){var h=game.hand(seat);for(int i=0;i<h.size();i++)if(h.get(i).id()==id)return i;return -1;}
    /** Advances timed phases; returns true when the snapshot changed. */
    boolean tick(long now){
        switch(phase){
            case CURSE_VOTE->{if(now>=phaseEnds){deal(now);return true;}}
            case DEALING->{if(now>=phaseEnds){phase=game.phase()==CursedCardsGame.Phase.FINISHED?Phase.FINISHED:Phase.PLAYING;openTurn(now);return true;}}
            case PLAYING->{if(now>=turnDeadline){timeouts++;var d=game.randomDraw();drawSlot=d.slot();apply(d,now,true);return true;}
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
        turnSeq++;readyAnnounced=false;drawSlot=-1;
        // contents changed: every hand's revision moves on and no earlier order can be selected any more
        for(int p=0;p<revision.length;p++)revision[p]++;past.clear();
        if(game.phase()==CursedCardsGame.Phase.FINISHED){phase=Phase.FINISHED;return;}
        turnReadyAt=now+timing.afterDrawMs()+pairs*timing.pairMs();turnDeadline=turnReadyAt+timing.turnMs();
    }
    private void openTurn(long now){turnReadyAt=now;turnDeadline=now+timing.turnMs();readyAnnounced=true;}

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
            public void transferred(CursedCard c,int from,int to){event("transfer","card",c.id(),"from",from,"to",to,"slot",drawSlot);}
            public void playerSafe(int p){event("safe","seat",p);}
            public void finished(int loser,List<Integer> survivors){event("finished","loser",loser,"survivors",List.copyOf(survivors),"death",deathId());}
        });
        game.start();
        long pairCount=events.stream().filter(e->e.get("type").equals("pair")).count();
        phase=Phase.DEALING;phaseEnds=now+timing.dealBaseMs()+deck.size()*timing.dealStepMs()+pairCount*timing.pairMs();
    }
    private String topVote(){Map<String,Integer> tally=tally();int best=Collections.max(tally.values());
        List<String> top=tally.entrySet().stream().filter(e->e.getValue()==best).map(Map.Entry::getKey).sorted().toList();return top.get(random.nextInt(top.size()));}
    private Map<String,Integer> tally(){Map<String,Integer> t=new LinkedHashMap<>();for(String s:seats)t.put(s,0);for(String v:votes.values())t.merge(v,1,Integer::sum);return t;}
    private int deathId(){for(int p=0;p<seats.size();p++)for(CursedCard c:game.hand(p))if(c.death())return c.id();return -1;}
    /**
     * Phones get the log without card ids: an id would let a player follow one face-down card from hand to hand
     * (and through any shuffle). Only the shared screen, which must animate the right card, receives them.
     */
    private List<Map<String,Object>> publicEvents(){List<Map<String,Object>> out=new ArrayList<>(events.size());
        for(var e:events){Map<String,Object> p=new LinkedHashMap<>(e);p.remove("card");p.remove("death");
            if(p.get("a") instanceof Map<?,?> a)p.put("a",Map.of("value",a.get("value")));if(p.get("b") instanceof Map<?,?> b)p.put("b",Map.of("value",b.get("value")));out.add(p);}
        return out;}
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
        v.put("deckSize",game.deck().size());v.put("events",host?events:publicEvents());
        List<Integer> sizes=new ArrayList<>();for(int p=0;p<seats.size();p++)sizes.add(game.handSize(p));v.put("handSizes",sizes);
        List<Integer> revs=new ArrayList<>();for(int r:revision)revs.add(r);v.put("handRevisions",revs);
        List<Integer> sh=new ArrayList<>();for(int c:shuffledCount)sh.add(c);v.put("shuffled",sh);
        List<Boolean> safe=new ArrayList<>();for(int p=0;p<seats.size();p++)safe.add(game.safe(p));v.put("safe",safe);
        if(me>=0){int[] own=game.handFor(me,me);List<Integer> hand=new ArrayList<>();for(int value:own)hand.add(value);v.put("hand",hand);}
        if(phase==Phase.DEALING)v.put("dealEndsAt",phaseEnds);
        if(phase==Phase.PLAYING){v.put("turn",turnSeq);v.put("drawer",seats.get(game.current()));v.put("source",seats.get(game.source()));v.put("sourceCards",game.handSize(game.source()));v.put("sourceRevision",revision[game.source()]);
            v.put("turnReadyAt",turnReadyAt);v.put("turnDeadline",turnDeadline);v.put("canDraw",me>=0&&me==game.current()&&now>=turnReadyAt);}
        if(phase==Phase.FINISHED){v.put("loser",seats.get(game.loser()));List<String> alive=new ArrayList<>();for(int p=0;p<seats.size();p++)if(p!=game.loser())alive.add(seats.get(p));v.put("survivors",alive);}
        return v;
    }
}
