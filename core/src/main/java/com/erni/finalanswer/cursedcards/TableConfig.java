package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.utils.Json;

/**
 * Single source of truth for the CURSED CARDS table scene ({@code models/cursed_cards/table.json}): table transform and
 * playing area, chair and character placement, machine/discard positions and camera shots. Everything else
 * (seats, hands, camera targets) is derived from it.
 */
public final class TableConfig {
    public static final String FILE="models/cursed_cards/table.json";
    public String comment;
    public Table table=new Table();public Chair chair=new Chair();public Character character=new Character();
    public Point machine=new Point(0,-.2f);public float machineYaw;public Point discard=new Point(3,.2f);
    public float handInset=1.35f,handMaxWidth=2.8f,floorBelowFelt=5.37f;
    /** Nameplate distance from the hand centre toward the player (world units on the felt). */
    public float handPlate=1.45f;
    /** Extra felt margin toward the near rim (+Z), whose painted skull ornament rises above the felt edge on screen. */
    public float nearMargin=1.1f;
    /** Half the table-size card height; set from the dealer config so the fan fit includes the card ends. */
    public float cardHalfHeight=.9f;
    public Camera camera=new Camera();
    /** Backdrop animation: moon position in the painting (u from left, v from top), from tools/assets/cursed_cards_backdrop.py. */
    public Backdrop backdrop=new Backdrop();
    /** DEATH reveal timeline and its sounds. */
    public DeathCinematic.Config death=new DeathCinematic.Config();
    /** Table sound events and the ambient room bed. */
    public TableAudio.Config audio=new TableAudio.Config();
    /** Seconds a drawer has to pick (0 = no limit). On expiry a random hidden card is taken for them, keeping matches moving. */
    public Turn turn=new Turn();
    public static final class Turn{public float seconds=5,warning=1;}
    public static final class Backdrop{public float moonU=.617f,moonV=.118f;}

    public static final class Table{
        /** true: the table is painted in the backdrop (no 3D table/floor; the camera matches the painting). */
        public boolean painted;
        /** "stadium" (straight sides, round ends) or "ellipse". */
        public String shape="stadium";
        public boolean ellipse(){return "ellipse".equals(shape);}
        /** Is (x, z) inside the felt shrunk by {@code margin}? */
        public boolean onFelt(float x,float z,float margin){float a=playA()-margin,b=playB()-margin;x-=this.x;z-=this.z;
            if(ellipse())return (x*x)/(a*a)+(z*z)/(b*b)<=1;float straight=a-b,ax=Math.abs(x);if(ax<=straight)return Math.abs(z)<=b;float dx=ax-straight;return dx*dx+z*z<=b*b;}
        public float scale=20.5f,yaw,x,z,feltHeight=.262f,playHalfLength=.44f,playHalfWidth=.20f,rimHalfLength=.52f,rimHalfWidth=.28f;
        /** World half extents of the felt / rim (stadium: straight sides, round ends). */
        public float playA(){return playHalfLength*scale;} public float playB(){return playHalfWidth*scale;}
        public float rimA(){return rimHalfLength*scale;} public float rimB(){return rimHalfWidth*scale;}
    }
    public static final class Chair{public float scale=7,seatHeight=.457f,seatCenterZ=.04f,halfDepth=.19f,rimGap=.55f;}
    public static final class Character{public float height=6.4f,crop=.3f,lean=.25f;}
    public static final class Point{public float x,z,yaw;public Point(){}Point(float x,float z){this.x=x;this.z=z;}}
    public static final class Shot{public float distance=20,pitch=50,targetY,targetZ,minDistance=12;}
    /** {@code fixed}: one locked main shot, so the 3D table never shifts against the 2D hall backdrop. */
    public static final class Camera{public boolean fixed=true;
        /** Locked presentation aspect (the backdrop's); the 3D view is letterboxed to it so painting and scene stay aligned. 0 = free. */
        public float aspect;
        public float fov=38,minHeight=9.5f,smoothing=2.6f;public Shot main=new Shot(),dealing=new Shot(),turn=new Shot(),elimination=new Shot();}

    public static TableConfig load(){var f=Gdx.files.internal(FILE);if(!f.exists())return new TableConfig();var json=new Json();json.setIgnoreUnknownFields(true);
        TableConfig c=json.fromJson(TableConfig.class,f);c.machineYaw=c.machine.yaw;return c;}
}
