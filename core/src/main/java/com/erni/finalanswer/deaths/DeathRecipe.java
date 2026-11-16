package com.erni.finalanswer.deaths;

import java.util.ArrayList;
import java.util.List;

/**
 * One scripted death. Times are seconds after the impact (negative = anticipation). Positions are fractions of the
 * character's height measured from the feet (y) and from its centre line (x, in character heights too).
 */
public final class DeathRecipe {
    public enum Head{NONE,FLY,SHATTER}
    public enum Body{STAY,SLUMP,TOPPLE,FLY_BACK,COLLAPSE,SHATTER,SINK,LIFT,VANISH}
    public enum P{SPARK,EMBER,SMOKE,CHUNK,DROP,ASH,GLOW,WISP,FEATHER,BAT,PIN,STRING,SEED,SPLINTER,RING,FLY,STAIN}

    public static final class Emit{
        public final P type;public float at,x,y,spreadX=.05f,spreadY=.05f,speed=300,angle=90,angleSpread=360,life=1.2f,size=1,gravity=Float.NaN,over;
        public int count;public int color;// 0 = sample the character's own pixels
        Emit(P type,float at,int count,float x,float y){this.type=type;this.at=at;this.count=count;this.x=x;this.y=y;}
        public Emit color(int rgba){color=rgba;return this;}
        public Emit speed(float s){speed=s;return this;}
        public Emit dir(float angle,float spread){this.angle=angle;angleSpread=spread;return this;}
        public Emit life(float l){life=l;return this;}
        public Emit size(float s){size=s;return this;}
        public Emit gravity(float g){gravity=g;return this;}
        public Emit spread(float x,float y){spreadX=x;spreadY=y;return this;}
        /** emit over this many seconds instead of all at once */
        public Emit over(float s){over=s;return this;}
    }

    public Head head=Head.NONE;public float headVx,headVy,headSpin,headAt;
    public Body body=Body.STAY;public float bodyAt,bodyDir=1,bodyPower=1;
    public float hitX=0,hitY=.55f;
    public int cols=9,rows=13;
    public float shatterPower=520;
    // shader timelines (start, duration); NaN start = never
    public float burnAt=Float.NaN,burnDur=1.6f,burnDir=1;public int edge=0xff7a1aff;public float edgeWidth=.07f;
    public float charAt=Float.NaN,charDur=1.2f,charAmount=.85f;
    public float grayAt=Float.NaN,grayDur=1f;
    public float tintAt=Float.NaN,tintDur=1f;public int tint=0xffffffff;
    public float meltAt=Float.NaN,meltDur=1.6f,meltAmount=.35f;
    public float waveAt=Float.NaN,waveDur=1.2f,waveAmount=1;
    /** real flames licking up the silhouette */
    public float fireAt=Float.NaN,fireDur=2.4f,fireAmount=1;public int fireColor=0xff7a20ff;
    public float soulAt=Float.NaN;public int soulColor=0x9fe4ffff;
    public float fadeAt=Float.NaN,fadeDur=.8f;
    // screen
    public float shake=10,shakeDur=.45f,flash=.6f;public int flashColor=0xffffffff;public boolean shockwave;
    public int screenTint=0;public float squash=0;
    public final List<Emit> emits=new ArrayList<>();
    /** anticipation flavour per cause */
    public DeathCause cause;

    public Emit emit(P type,float at,int count,float x,float y){Emit e=new Emit(type,at,count,x,y);emits.add(e);return e;}
}
