package com.erni.finalanswer.cursedboxes;

/** One original, already damaged PNG per identity. Coordinates use the original image, top-down. */
public enum CursedCharacterType {
    GHOST("Ghost","cursed_boxes/ghost_damaged.png",.38f,.37f,.64f,.65f),
    DRACULA("Dracula","cursed_boxes/characters/drakula-shot.png",.38f,.51f,.65f,.75f),
    PLAGUE_DOCTOR("Plague Doctor","cursed_boxes/characters/doktor_shot.png",.39f,.53f,.66f,.77f),
    PUPPETEER("Puppeteer","cursed_boxes/characters/pupeetee_shot.png",.39f,.53f,.67f,.77f),
    SKELETON("Skeleton","cursed_boxes/characters/skeleton_shot.png",.39f,.52f,.68f,.78f),
    ZOMBIE("Zombie","cursed_boxes/characters/zombie_shot.png",.39f,.51f,.67f,.75f),
    PUMPKIN("Pumpkin","cursed_boxes/characters/pumpkin_dead.png",.40f,.47f,.68f,.70f),
    VOODOO("Voodoo","cursed_boxes/characters/voddoo_shoot.png",.43f,.20f,.73f,.47f);

    public final String label,path;
    public final float holeLeft,holeTop,holeRight,holeBottom;
    public final float scale,verticalOffset;
    CursedCharacterType(String label,String path,float left,float top,float right,float bottom){
        this(label,path,left,top,right,bottom,1,0);
    }
    CursedCharacterType(String label,String path,float left,float top,float right,float bottom,float scale,float verticalOffset){
        this.label=label;this.path=path;holeLeft=left;holeTop=top;holeRight=right;holeBottom=bottom;
        this.scale=scale;this.verticalOffset=verticalOffset;
    }
    public String diagnostic(String issue){return name()+" PNG '"+path+"': "+issue;}
    public void requireAsset(boolean exists){if(!exists)throw new IllegalStateException(diagnostic("missing required asset"));}
}
