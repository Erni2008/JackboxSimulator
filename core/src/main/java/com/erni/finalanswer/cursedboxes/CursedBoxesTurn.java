package com.erni.finalanswer.cursedboxes;

/** Local rules only. A future network snapshot can provide the same player/selection/shot fields. */
public final class CursedBoxesTurn {
    public final String currentPlayerId;
    private int shotsRemaining=2,selectedCrateId=-1,destroyedCrateIds;
    private boolean active;
    public CursedBoxesTurn(String playerId){currentPlayerId=playerId;}
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
    public void reset(){shotsRemaining=2;selectedCrateId=-1;destroyedCrateIds=0;active=false;}
}
