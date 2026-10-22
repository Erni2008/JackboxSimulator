package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.Input;

/** All eight simulated players coexist; only the developer scene receives nine distinct shots. */
public final class CursedCharacterTestMode {
    private static final CursedCharacterType[] TYPES=CursedCharacterType.values();
    private static final String[] NICKS={"Ghost_Player","Dracula_Player","Doctor_Player","Puppet_Player","Skeleton_Player","Zombie_Player","Pumpkin_Player","Voodoo_Player"};
    private final CursedCharacterTestLayout distribution;
    private final CursedBoxesScreen scene;
    private int index;
    private float age;
    private boolean automatic,fired,completed,started;
    public CursedCharacterTestMode(CursedBoxesScreen scene,long seed){this.scene=scene;distribution=new CursedCharacterTestLayout(seed);}
    public int characterSlot(int index){return distribution.slot(index);}
    public int emptySlot(){return distribution.slot(8);}
    public boolean accepts(int slot){for(int i=0;i<9;i++)if(distribution.slot(i)==slot)return true;return false;}
    public void selectedSlot(int slot){for(int i=0;i<9;i++)if(distribution.slot(i)==slot){index=i;break;}}
    public int targetIndex(){return index;}
    public int slot(){return distribution.slot(index);}
    public String targetName(){return index==8?"EMPTY BOX":TYPES[index].label;}
    public String targetNickname(){return index==8?"NO PLAYER":NICKS[index];}
    public boolean automatic(){return automatic;}
    public boolean completed(){return completed;}
    public boolean preview(){return scene.slots[slot()].previewHidden;}
    public void start(){if(!started){started=true;reset();}}
    /** Called only after a full scene reset; assignment never changes normal scenarios. */
    public void assign(){
        distribution.next();
        for(CrateSlot box:scene.slots){box.character=null;box.occupantNickname=null;box.previewHidden=false;}
        for(int i=0;i<8;i++){
            CrateSlot box=scene.slots[distribution.slot(i)];box.character=TYPES[i];box.occupantNickname=NICKS[i];box.previewHidden=false;
        }
    }
    public void choose(int index){
        if(index<0||index>8)throw new IllegalArgumentException("Character target: "+index);
        int target=distribution.slot(index);
        if(scene.turn.active()||scene.turn.destroyed(target))return;
        automatic=false;scene.select(target);
    }
    public void reset(){automatic=false;completed=false;index=0;age=0;fired=false;scene.reset();}
    public void runAll(){reset();automatic=true;scene.select(slot());}
    public boolean shoot(){if(scene.turn.selectedCrateId()<0)scene.select(slot());return scene.fire();}
    public void update(float dt){
        if(!automatic)return;age+=dt;
        if(!fired&&age>=1.5f){if(!shoot())throw new IllegalStateException("Character test shot rejected: "+targetName());fired=true;}
        if(fired&&age>=3.5f&&!scene.networkBusy()){
            if(index<8){index++;age=0;fired=false;scene.select(slot());}
            else{automatic=false;completed=true;com.badlogic.gdx.Gdx.app.log("Cursed character test","TEST COMPLETED: 9/9 shots, 8/8 persistent characters, one empty box destroyed");}
        }
    }
    public boolean keyDown(int key){
        if(key>=Input.Keys.NUM_1&&key<=Input.Keys.NUM_9){choose(key-Input.Keys.NUM_1);return true;}
        if(key>=Input.Keys.NUMPAD_1&&key<=Input.Keys.NUMPAD_9){choose(key-Input.Keys.NUMPAD_1);return true;}
        switch(key){
            case Input.Keys.R:reset();return true;
            case Input.Keys.T:runAll();return true;
            case Input.Keys.P:
                if(automatic)return true;
                boolean hide=!preview();
                for(CrateSlot box:scene.slots)if(box.character!=null&&box.state==CrateSlot.State.INTACT)box.previewHidden=hide;
                return true;
            case Input.Keys.SPACE:automatic=false;shoot();return true;
            default:return false;
        }
    }
}
