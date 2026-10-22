package com.erni.finalanswer.cursedboxes;

/** Scene turn rules; the multiplayer adapter mirrors authenticated server state between shots. */
public final class CursedBoxesTurn {
    public String currentPlayerId;
    private int shotLimit;
    private int shotsRemaining,selectedCrateId=-1,destroyedCrateIds;
    private boolean active;
    public CursedBoxesTurn(String playerId){this(playerId,2);}
    /** Explicit developer budget; production callers retain the two-shot constructor. */
    public CursedBoxesTurn(String playerId,int shotLimit){
        if(shotLimit<1||shotLimit>16)throw new IllegalArgumentException("Shot budget must fit sixteen unique boxes");
        currentPlayerId=playerId;this.shotLimit=shotLimit;shotsRemaining=shotLimit;
    }
    public void multiplayerLimit(int limit){if(active||limit<1||limit>2)throw new IllegalArgumentException("Invalid multiplayer budget");shotLimit=shotsRemaining=limit;}
    public int shotLimit(){return shotLimit;}
    public int shotsRemaining(){return shotsRemaining;}
    public int selectedCrateId(){return selectedCrateId;}
    /** Sixteen-bit ID set. Reserved as soon as a valid shot starts. */
    public int destroyedCrateIds(){return destroyedCrateIds;}
    public boolean destroyed(int id){return id>=0&&id<16&&(destroyedCrateIds&(1<<id))!=0;}
    public boolean active(){return active;}
    public boolean ended(){return shotsRemaining==0&&!active;}
    public boolean select(int id){if(id<0||id>=16||destroyed(id)||active||shotsRemaining==0)return false;selectedCrateId=id;return true;}
    public boolean begin(){if(active||shotsRemaining==0||selectedCrateId<0||destroyed(selectedCrateId))return false;shotsRemaining--;destroyedCrateIds|=1<<selectedCrateId;active=true;return true;}
    public void complete(){active=false;selectedCrateId=-1;}
    public void reset(){shotsRemaining=shotLimit;selectedCrateId=-1;destroyedCrateIds=0;active=false;}
    /** Trusted desktop adapter mirrors the authenticated server snapshot only between animations. */
    public void synchronize(String playerId,int remaining,int destroyed){
        if(active)throw new IllegalStateException("Cannot replace an active shot");
        if(shotLimit>2||remaining<0||remaining>shotLimit||(destroyed&~0xffff)!=0)throw new IllegalArgumentException("Invalid multiplayer turn");
        currentPlayerId=playerId;shotsRemaining=remaining;destroyedCrateIds=destroyed;selectedCrateId=-1;
    }
}
