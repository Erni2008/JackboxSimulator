package com.finalanswer.server.game;

import com.finalanswer.protocol.CursedBoxesProtocol;
import com.finalanswer.protocol.CursedSurvivorTimeline;
import com.finalanswer.server.rooms.RoomService.Failure;
import java.util.*;

/** RoomService's existing lock owns all mutations. Private assignments never enter a phone snapshot. */
public final class CursedBoxesSession {
    public record Player(String id,String nickname,String characterId) {}
    public static final class Shot {
        public final String id=UUID.randomUUID().toString(),requestId,playerId;
        public final int boxId,number,turn;
        public final long acceptedAt;
        public long startedAt,impactedAt,completedAt,waitSince;
        Shot(String requestId,String playerId,int boxId,int number,int turn,long now){this.requestId=requestId;this.playerId=playerId;this.boxId=boxId;this.number=number;this.turn=turn;acceptedAt=waitSince=now;}
    }
    public final String id=UUID.randomUUID().toString();
    private final List<Player> players;
    private final int shotLimit;
    private final Set<String> hidingPlayers;
    private final Map<String,Integer> hidingChoices=new HashMap<>();
    private boolean hidingLocked;
    private final Map<Integer,Player> contents=new HashMap<>();
    private final Map<String,Shot> accepted=new HashMap<>();
    private final int[] remaining,selections,personalHits;
    private final Map<String,Shot> lastResults=new HashMap<>();
    private int active,destroyed;
    private boolean ready,finished,revealCompleted;
    private final Set<String> eliminated=new HashSet<>();
    private final CursedSurvivorTimeline.Timings revealTimings=new CursedSurvivorTimeline.Timings();
    private long revealStartedAt,revealEndsAt;
    private int survivorMask,publicSurvivors;
    private String notice="";
    private Shot pending;
    /** Standalone practice: first joined player hides, the others shoot. No hidden location is generated. */
    public CursedBoxesSession(List<Player> roster,Random unused){this(roster,roster.isEmpty()?Set.of():Set.of(roster.getFirst().id()));}
    public CursedBoxesSession(List<Player> roster,Set<String> hidingIds){this(roster,hidingIds,2);}
    public CursedBoxesSession(List<Player> roster,Set<String> hidingIds,int shotLimit){
        if(shotLimit<1||shotLimit>2)throw new Failure(400,"INVALID_SHOT_LIMIT");
        this.shotLimit=shotLimit;
        if(roster.size()<2||roster.size()>8||roster.stream().map(Player::id).distinct().count()!=roster.size()
            ||hidingIds.isEmpty()||hidingIds.size()>=roster.size()||!roster.stream().map(Player::id).toList().containsAll(hidingIds))throw new Failure(400,"INVALID_CURSED_ROSTER");
        players=List.copyOf(roster);hidingPlayers=Set.copyOf(hidingIds);
        remaining=new int[players.size()];selections=new int[players.size()];personalHits=new int[players.size()];
        Arrays.fill(selections,-1);
        for(int i=0;i<players.size();i++)if(!hidingPlayers.contains(players.get(i).id()))remaining[i]=shotLimit;
        while(remaining[active]==0)active++;
    }
    /** Confirmation is final and idempotent. Only the owner and authenticated renderer see this mapping. */
    public void hide(String player,int box){
        int owner=index(player);
        if(!hidingPlayers.contains(player))throw new Failure(403,"NOT_HIDING_PLAYER");
        Integer prior=hidingChoices.get(player);
        if(prior!=null){if(prior==box)return;throw new Failure(409,"HIDING_ALREADY_CONFIRMED");}
        if(eliminated.contains(player))throw new Failure(403,"NOT_A_PLAYER");
        if(hidingLocked||finished)throw new Failure(409,"HIDING_LOCKED");
        if(!ready)throw new Failure(409,"CURSED_NOT_READY");
        intact(box);
        if(contents.containsKey(box))throw new Failure(409,"HIDING_BOX_UNAVAILABLE");
        hidingChoices.put(player,box);contents.put(box,players.get(owner));
        lockHidingIfComplete();
    }
    private void lockHidingIfComplete(){hidingLocked=hidingPlayers.stream().allMatch(p->hidingChoices.containsKey(p)||eliminated.contains(p));}
    public Set<String> eliminatedPlayers(){return Set.copyOf(eliminated);}
    public boolean finished(){return finished&&revealCompleted;}
    private void beginReveal(long now){
        if(!finished||revealStartedAt!=0)return;
        survivorMask=0;for(var entry:contents.entrySet())if(!eliminated.contains(entry.getValue().id()))survivorMask|=1<<entry.getKey();
        revealStartedAt=now;revealEndsAt=now+Math.round(Integer.bitCount(survivorMask)*revealTimings.period()*1000);
        revealCompleted=survivorMask==0;
    }
    public boolean ready(){return ready;}
    public Shot pending(){return pending;}
    public String activeId(){return finished||!hidingLocked?"":players.get(active).id();}
    public int destroyedMask(){return destroyed;}
    public void ready(boolean value,long now){if(value&&!ready&&pending!=null)pending.waitSince=now;ready=value;if(value)notice="";}
    private int index(String player){for(int i=0;i<players.size();i++)if(players.get(i).id().equals(player))return i;throw new Failure(403,"NOT_A_PLAYER");}
    private void eligible(String player,int turn){
        index(player);if(!hidingLocked)throw new Failure(409,"HIDING_NOT_LOCKED");
        if(hidingPlayers.contains(player))throw new Failure(403,"NOT_SHOOTING_PLAYER");
        if(finished)throw new Failure(409,"CURSED_FINISHED");
        if(!ready)throw new Failure(409,"CURSED_NOT_READY");
        if(!activeId().equals(player))throw new Failure(403,"NOT_YOUR_TURN");
        if(turn!=active+1)throw new Failure(409,"STALE_CURSED_TURN");
        if(pending!=null)throw new Failure(409,"SHOT_IN_PROGRESS");
        if(remaining[active]==0)throw new Failure(409,"NO_SHOTS_REMAINING");
    }
    private void intact(int box){if(box<0||box>=16)throw new Failure(400,"INVALID_BOX");if((destroyed&(1<<box))!=0)throw new Failure(409,"BOX_DESTROYED");}
    public void select(String player,int turn,int box){eligible(player,turn);intact(box);selections[active]=box;notice="";}
    public Shot fire(String player,String request,int turn,int box,int number,long now){
        String key=player+":"+request;Shot prior=accepted.get(key);
        if(prior!=null){if(prior.boxId!=box||prior.number!=number||prior.turn!=turn)throw new Failure(409,"REQUEST_ID_REUSED");return prior;}
        eligible(player,turn);intact(box);
        if((personalHits[active]&(1<<box))!=0)throw new Failure(409,"BOX_ALREADY_SHOT");
        if(number!=shotLimit+1-remaining[active])throw new Failure(409,"STALE_CURSED_SHOT");
        if(selections[active]!=box)throw new Failure(409,"BOX_NOT_SELECTED");
        Shot shot=new Shot(request,player,box,number,turn,now);pending=shot;accepted.put(key,shot);
        // One durable reservation per accepted request; retries never consume another cartridge.
        remaining[active]--;personalHits[active]|=1<<box;notice="";return shot;
    }
    private Shot shot(String shotId){
        // Stage acknowledgements are idempotent even after the following turn has begun.
        for(Shot shot:accepted.values())if(shot.id.equals(shotId))return shot;
        throw new Failure(409,"STALE_CURSED_SHOT");
    }
    public void started(String shotId,long now){
        Shot shot=shot(shotId);if(shot.startedAt>0)return;
        if(shot!=pending||!ready)throw new Failure(409,"STALE_CURSED_SHOT");
        shot.startedAt=shot.waitSince=now;
    }
    public void impact(String shotId,long now){
        Shot shot=shot(shotId);if(shot.impactedAt>0)return;
        if(shot!=pending||shot.startedAt==0||now<shot.startedAt+CursedBoxesProtocol.IMPACT_MILLIS)throw new Failure(409,"SHOT_NOT_READY");
        shot.impactedAt=shot.waitSince=now;destroyed|=1<<shot.boxId;
        Player victim=contents.get(shot.boxId);if(victim!=null)eliminated.add(victim.id());lastResults.put(shot.playerId,shot);
    }
    public void complete(String shotId,long now){
        Shot shot=shot(shotId);if(shot.completedAt>0)return;
        if(shot!=pending||shot.impactedAt==0||now<shot.startedAt+CursedBoxesProtocol.SHOT_MILLIS)throw new Failure(409,"SHOT_NOT_READY");
        shot.completedAt=now;pending=null;selections[active]=-1;notice="";
        if(remaining[active]==0)next();
        beginReveal(now);
    }
    private void next(){do{active++;}while(active<players.size()&&remaining[active]==0);if(active>=players.size())finished=true;}
    /** A disconnected player keeps their seat/ammo; an explicit leaver forfeits only unspent turns. */
    public boolean tick(long now,Set<String> left){
        boolean changed=false;
        if(!finished)eliminated.addAll(left);
        if(!hidingLocked){boolean before=hidingLocked;lockHidingIfComplete();changed=before!=hidingLocked;}
        if(finished&&!revealCompleted&&now>=revealEndsAt){revealCompleted=true;changed=true;}
        if(pending!=null&&ready&&now-pending.waitSince>=CursedBoxesProtocol.START_TIMEOUT_MILLIS){
            // Pause rather than discard an accepted shot when the host is unavailable.
            ready=false;notice="HOST_SCENE_PAUSED";changed=true;
        }
        while(hidingLocked&&!finished&&pending==null&&left.contains(activeId())){next();changed=true;}
        beginReveal(now);
        if(finished){int visible=(int)Math.max(0,Math.min(Integer.bitCount(survivorMask),Math.floor((now-revealStartedAt-(revealTimings.anticipation+revealTimings.smoke)*1000)/(revealTimings.period()*1000))+1));if(visible!=publicSurvivors){publicSurvivors=visible;changed=true;}}
        return changed;
    }
    private Map<String,Object> result(Shot shot){
        Map<String,Object> value=new LinkedHashMap<>();value.put("shotId",shot.id);value.put("boxId",shot.boxId);value.put("resolvedAt",shot.impactedAt);
        Player person=contents.get(shot.boxId);value.put("empty",person==null);
        if(person!=null){value.put("characterId",person.characterId());value.put("nickname",person.nickname());value.put("playerId",person.id());}
        return value;
    }
    public Map<String,Object> snapshot(String self,boolean host,boolean hostOnline,Set<String> online,long now){
        Map<String,Object> value=new LinkedHashMap<>();
        String phase=finished?(revealCompleted?"FINISHED":"REVEALING"):!ready?"PREPARING":!hidingLocked?"HIDING_SELECTION":pending!=null?"FIRING":"SELECTING";
        boolean activeOnline=finished||!hidingLocked||online.contains(activeId());
        value.put("sessionId",id);value.put("phase",phase);value.put("turnId",active+1);value.put("turnOrder",players.stream().map(Player::id).toList());
        value.put("activePlayerId",activeId());value.put("activePlayerName",finished||!hidingLocked?"":players.get(active).nickname());
        value.put("hostReady",ready&&hostOnline);value.put("activePlayerOnline",activeOnline);value.put("notice",notice);
        value.put("canAct",!host&&!finished&&self.equals(activeId())&&hostOnline&&activeOnline&&ready&&pending==null&&remaining[active]>0);
        int own=-1;for(int i=0;i<players.size();i++)if(players.get(i).id().equals(self))own=i;
        value.put("role",hidingPlayers.contains(self)?"HIDING":own>=0?"SHOOTING":"SPECTATOR");
        value.put("hidingLocked",hidingLocked);
        value.put("canHide",!host&&hidingPlayers.contains(self)&&!hidingLocked&&!hidingChoices.containsKey(self)&&!eliminated.contains(self)&&ready&&hostOnline);
        if(hidingPlayers.contains(self)){value.put("hidingConfirmed",hidingChoices.containsKey(self));value.put("hidingBoxId",hidingChoices.getOrDefault(self,-1));}
        value.put("shotsRemaining",own<0?0:remaining[own]);value.put("shotLimit",shotLimit);value.put("selectedCrateId",own<0?-1:selections[own]);
        value.put("destroyedCrateIds",destroyed);
        List<Map<String,Object>> boxes=new ArrayList<>();
        for(int box=0;box<16;box++){
            Map<String,Object> item=new LinkedHashMap<>();item.put("id",box);
            item.put("state",(destroyed&(1<<box))!=0?"DESTROYED":pending!=null&&pending.boxId==box?"LOCKED":"AVAILABLE");
            if((destroyed&(1<<box))!=0){Player person=contents.get(box);item.put("empty",person==null);if(person!=null){item.put("characterId",person.characterId());item.put("nickname",person.nickname());}}
            boxes.add(item);
        }
        if(finished){
            value.put("revealStartedAt",revealStartedAt);value.put("revealEndsAt",revealEndsAt);value.put("survivorCount",Integer.bitCount(survivorMask));
            value.put("revealTimings",Map.of("anticipation",revealTimings.anticipation,"smoke",revealTimings.smoke,"panel",revealTimings.panel,"character",revealTimings.character,"idle",revealTimings.idle,"gap",revealTimings.gap));
            var survivors=new ArrayList<Map<String,Object>>();int index=0;
            for(int box=0;box<16;box++)if((survivorMask&(1<<box))!=0){
                long visibleAt=revealStartedAt+Math.round((index++*revealTimings.period()+revealTimings.anticipation+revealTimings.smoke)*1000);
                if(host||now>=visibleAt){Player p=contents.get(box);survivors.add(Map.of("boxId",box,"playerId",p.id(),"nickname",p.nickname(),"characterId",p.characterId()));}
            }
            value.put("survivors",survivors);
            value.put("outcomes",players.stream().filter(p->hidingPlayers.contains(p.id())).map(p->Map.of("playerId",p.id(),"survived",!eliminated.contains(p.id()))).toList());
        }
        value.put("boxes",boxes);Shot last=lastResults.get(self);if(last!=null)value.put("lastResult",result(last));
        if(pending!=null){
            value.put("pendingShot",Map.of("id",pending.id,"playerId",pending.playerId,"boxId",pending.boxId,"number",pending.number,"requestId",pending.requestId,"startedAt",pending.startedAt,"impactedAt",pending.impactedAt));
        }
        if(host){
            value.put("hostContents",contents.entrySet().stream().sorted(Map.Entry.comparingByKey()).map(e->Map.of("boxId",e.getKey(),"playerId",e.getValue().id(),"nickname",e.getValue().nickname(),"characterId",e.getValue().characterId())).toList());
            value.put("selectedCrateId",finished?-1:selections[active]);value.put("shotsRemaining",finished?0:remaining[active]);
        }
        return value;
    }
}
