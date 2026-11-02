package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.math.*;
import com.badlogic.gdx.utils.Array;

/**
 * Symmetric seating around the oval (stadium) table for 2–8 players, derived only from {@link TableConfig}.
 * Seats are returned clockwise seen from above (player 1 first, at the near-side right), so rule turn order
 * maps directly to the table. The near side faces the main camera (+Z).
 */
public final class SeatLayout {
    public enum Side {NEAR,LEFT,FAR,RIGHT}
    public static final class Seat {
        public Side side;public float along;
        /** Outward unit normal of the table edge at this seat (toward the chair). */
        public final Vector3 normal=new Vector3();
        public final Vector3 chair=new Vector3(),character=new Vector3(),hand=new Vector3(),interaction=new Vector3(),focus=new Vector3();
        /** Future 2D character sprite: bottom-centre anchor just behind the table edge. Nameplate: on the felt edge in front of the player. */
        public final Vector3 characterAnchor=new Vector3(),plate=new Vector3();
        /** Chair and character face the table; hand yaw points the card bottoms at the player. */
        public float chairYaw,characterYaw,handYaw,handWidth;
        public float facingX(){return MathUtils.sinDeg(handYaw);} public float facingZ(){return MathUtils.cosDeg(handYaw);}
    }
    // Per player count: side and position along that side (-1..1 of the straight edge).
    private static final Object[][][] LAYOUTS={
        {},{},
        {{Side.NEAR,0f},{Side.FAR,0f}},
        {{Side.NEAR,.7f},{Side.NEAR,-.7f},{Side.FAR,0f}},
        {{Side.NEAR,.6f},{Side.NEAR,-.6f},{Side.FAR,-.6f},{Side.FAR,.6f}},
        {{Side.NEAR,0f},{Side.LEFT,0f},{Side.FAR,-.6f},{Side.FAR,.6f},{Side.RIGHT,0f}},
        {{Side.NEAR,1f},{Side.NEAR,0f},{Side.NEAR,-1f},{Side.FAR,-1f},{Side.FAR,0f},{Side.FAR,1f}},
        {{Side.NEAR,.8f},{Side.NEAR,-.8f},{Side.LEFT,0f},{Side.FAR,-1f},{Side.FAR,0f},{Side.FAR,1f},{Side.RIGHT,0f}},
        {{Side.NEAR,1f},{Side.NEAR,0f},{Side.NEAR,-1f},{Side.LEFT,0f},{Side.FAR,-1f},{Side.FAR,0f},{Side.FAR,1f},{Side.RIGHT,0f}},
    };

    /**
     * Painted table: everyone sits on the far half and the ends (angles on the ellipse; 90° = toward the camera), so all
     * seated characters stay visible behind the table and the near half is free for the dealer. Increasing angle =
     * left end → far side → right end, i.e. clockwise seen from above (rules turn order).
     */
    static final float[][] ARC={{},{},{},{},
        {200,252,288,340},{195,233,270,307,345},{192,222,253,287,318,348},{190,215,242,270,298,325,350},{188,211,235,258,282,305,329,352}};
    /** Oval table: sides map to angles on the ellipse (near = toward the camera); t spreads seats along the side. */
    private static void ellipseSeat(TableConfig c,Seat s,float seatOut,float seatY,float floor){
        var t=c.table;float deg=t.painted?s.along:switch(s.side){case NEAR->90-s.along*38;case FAR->270+s.along*38;case RIGHT->0;default->180;};
        float cos=MathUtils.cosDeg(deg),sin=MathUtils.sinDeg(deg);
        s.normal.set(cos/t.rimA(),0,sin/t.rimB()).nor();
        Vector3 seatPoint=new Vector3(t.x+t.rimA()*cos,seatY,t.z+t.rimB()*sin).mulAdd(s.normal,seatOut);
        s.handYaw=MathUtils.atan2Deg360(s.normal.x,s.normal.z);s.chairYaw=s.handYaw+180;s.characterYaw=s.chairYaw;
        s.chair.set(seatPoint).mulAdd(s.normal,c.chair.seatCenterZ*c.chair.scale);s.chair.y=floor;
        s.character.set(seatPoint).mulAdd(s.normal,-c.character.lean);
        s.hand.set(t.x+(t.playA()-c.handInset)*cos,0,t.z+(t.playB()-c.handInset)*sin);
        s.interaction.set(s.hand).add(0,.35f,0);s.focus.set(s.hand).lerp(s.character,.45f);s.focus.y=1.2f;
        s.characterAnchor.set(t.x+t.rimA()*cos,0,t.z+t.rimB()*sin).mulAdd(s.normal,.9f);
    }
    /** Keep the whole fan on the felt: narrow it, then move it toward the centre (the oval narrows at its ends). */
    private static void fitHand(TableConfig c,Seat s){
        var t=c.table;float margin=.35f;
        // Prefer sliding the fan toward the centre (keeps cards apart); narrow it only when that is not enough.
        float moved=0;for(int guard=0;guard<80&&!fits(c,s,margin);guard++){if(moved<1.6f){s.hand.mulAdd(s.normal,-.2f);moved+=.2f;}else if(s.handWidth>1.4f)s.handWidth*=.93f;else s.hand.mulAdd(s.normal,-.2f);}
        s.interaction.set(s.hand).add(0,.35f,0);
        // Near-side plates go on the inner side of the fan so they never sit on the painted rim ornament.
        if(s.normal.z>.5f)s.plate.set(s.hand).mulAdd(s.normal,-c.handPlate);else s.plate.set(s.hand).mulAdd(s.normal,c.handPlate);
    }
    /** The whole fan, including the card ends toward and away from the player, stays on the felt; extra margin on the near side. */
    private static boolean fits(TableConfig c,Seat s,float margin){var t=c.table;float tx=MathUtils.cosDeg(s.handYaw),tz=-MathUtils.sinDeg(s.handYaw),half=c.cardHalfHeight;
        for(float u:new float[]{-.5f,0,.5f})for(float v:new float[]{-1,1}){float x=s.hand.x+tx*u*s.handWidth+s.normal.x*v*half,z=s.hand.z+tz*u*s.handWidth+s.normal.z*v*half;
            float m=margin+(z>0?c.nearMargin*Math.min(1,z/t.playB()):0);if(!t.onFelt(x,z,m))return false;}return true;}
    public static Array<Seat> layout(TableConfig c,int players){
        if(players<2||players>8)throw new IllegalArgumentException("players 2–8: "+players);
        var t=c.table;float straight=t.rimA()-t.rimB(),playStraight=t.playA()-t.playB();
        float seatOut=c.chair.rimGap+c.chair.halfDepth*c.chair.scale,floor=-c.floorBelowFelt,seatY=floor+c.chair.seatHeight*c.chair.scale;
        Array<Seat> seats=new Array<>();
        for(Object[] spec:LAYOUTS[players]){
            Seat s=new Seat();s.side=(Side)spec[0];s.along=(Float)spec[1];
            float rimX,rimZ,handX,handZ;
            if(t.ellipse()){s.along=t.painted?ARC[players][seats.size]:s.along;ellipseSeat(c,s,seatOut,seatY,floor);seats.add(s);continue;}
            switch(s.side){
                case NEAR->{s.normal.set(0,0,1);rimX=s.along*straight;rimZ=t.rimB();handX=s.along*playStraight;handZ=t.playB()-c.handInset;}
                case FAR->{s.normal.set(0,0,-1);rimX=s.along*straight;rimZ=-t.rimB();handX=s.along*playStraight;handZ=-(t.playB()-c.handInset);}
                case RIGHT->{s.normal.set(1,0,0);rimX=t.rimA();rimZ=0;handX=t.playA()-c.handInset;handZ=0;}
                default->{s.normal.set(-1,0,0);rimX=-t.rimA();rimZ=0;handX=-(t.playA()-c.handInset);handZ=0;}
            }
            Vector3 seatPoint=new Vector3(t.x+rimX,seatY,t.z+rimZ).mulAdd(s.normal,seatOut);
            s.handYaw=MathUtils.atan2Deg360(s.normal.x,s.normal.z);s.chairYaw=s.handYaw+180;s.characterYaw=s.chairYaw;
            // Chair origin sits on the floor; its seat centre is chair.seatCenterZ forward of the origin (chair faces -normal).
            s.chair.set(seatPoint).mulAdd(s.normal,c.chair.seatCenterZ*c.chair.scale);s.chair.y=floor;
            s.character.set(seatPoint).mulAdd(s.normal,-c.character.lean);
            s.hand.set(t.x+handX,0,t.z+handZ);
            s.interaction.set(s.hand).add(0,.35f,0);
            s.focus.set(s.hand).lerp(s.character,.45f);s.focus.y=1.2f;
            s.characterAnchor.set(t.x+rimX,0,t.z+rimZ).mulAdd(s.normal,.9f);
            seats.add(s);
        }
        // Hand width: share of the gap to the nearest neighbouring hand.
        for(int i=0;i<seats.size;i++){Seat s=seats.get(i);float nearest=Float.MAX_VALUE;for(int j=0;j<seats.size;j++)if(j!=i)nearest=Math.min(nearest,seats.get(j).hand.dst(s.hand));s.handWidth=Math.min(c.handMaxWidth,nearest*.74f);fitHand(c,s);}
        return seats;
    }
}
