package com.erni.finalanswer.deaths;

import com.erni.finalanswer.deaths.DeathRecipe.Body;
import com.erni.finalanswer.deaths.DeathRecipe.Head;
import com.erni.finalanswer.deaths.DeathRecipe.P;

/** The 32 deaths: every character dies its own way from every cause. */
public final class DeathRecipes {
    private DeathRecipes(){}
    public static final String[] CHARACTERS={"skeleton","pumpkin","plague_doctor","dracula","ghost","voodoo","zombie","puppeteer"};

    /** Fraction of the character's height where the head separates from the body. */
    public static float neck(String c){
        return switch(c){case "skeleton"->.70f;case "pumpkin"->.56f;case "plague_doctor"->.76f;case "dracula"->.78f;case "ghost"->.62f;
            case "voodoo"->.50f;case "zombie"->.76f;case "puppeteer"->.78f;default->.72f;};
    }
    public static float headY(String c){float n=neck(c);return n+(1-n)*.45f;}

    // palette
    static final int FIRE=0xff8a1eff,HOT=0xffd36aff,SMOKE=0x1c1714ff,ASH=0x8a8580ff,GREEN=0x6dff7aff,PURPLE=0xb46bffff,RED=0xc4141cff,
        DARKRED=0x5a0508ff,BONE=0xe8dcc0ff,CYAN=0x8ff0ffff,STUFF=0xf2e6cfff,SEEDC=0xf3e2b0ff,GORE=0x4f6b1cff,WOOD=0x7a4a26ff,BLUEFIRE=0x5fa8ffff;

    public static DeathRecipe of(String character,DeathCause cause){
        DeathRecipe r=new DeathRecipe();r.cause=cause;float n=neck(character),h=headY(character);
        switch(cause){
            case SHOT->{r.hitY=h;r.flash=.35f;r.shake=14;r.emit(P.SPARK,0,14,-.02f,h).dir(170,50).speed(700).life(.35f).color(HOT);}
            case BURNED->{r.fireAt=-.6f;r.fireDur=2.6f;r.flash=.25f;r.flashColor=0xffb060ff;r.shake=6;r.shakeDur=1.2f;r.screenTint=0x6a1a00ff;
                r.emit(P.EMBER,-.9f,30,0,.05f).spread(.25f,.02f).dir(90,30).speed(160).life(1.4f).color(FIRE).over(.9f);}
            case EXPLODED->{r.hitY=.5f;r.flash=1;r.shake=30;r.shakeDur=.7f;r.shockwave=true;
                r.emit(P.SPARK,0,60,0,.5f).speed(1100).life(.55f).color(HOT);
                r.emit(P.SMOKE,.05f,18,0,.45f).spread(.12f,.12f).speed(140).life(2.4f).size(2.2f).color(SMOKE);
                r.emit(P.GLOW,0,2,0,.5f).speed(0).life(.22f).size(1.6f).color(FIRE);}
            case CURSED->{r.flash=.45f;r.flashColor=0x9a5bffff;r.shake=8;r.screenTint=0x1a0630ff;
                r.emit(P.WISP,-1.1f,26,0,.1f).spread(.3f,.02f).dir(90,25).speed(120).life(1.8f).color(PURPLE).over(1.4f);}
        }
        switch(character){
            case "skeleton"->skeleton(r,cause,n,h);
            case "pumpkin"->pumpkin(r,cause,n,h);
            case "plague_doctor"->doctor(r,cause,n,h);
            case "dracula"->dracula(r,cause,n,h);
            case "ghost"->ghost(r,cause,n,h);
            case "voodoo"->voodoo(r,cause,n,h);
            case "zombie"->zombie(r,cause,n,h);
            default->puppeteer(r,cause,n,h);
        }
        return r;
    }

    // ---------- SKELETON: bones, dust, a skull that rolls ----------
    private static void skeleton(DeathRecipe r,DeathCause c,float n,float h){
        switch(c){
            case SHOT->{r.head=Head.FLY;r.headVx=520;r.headVy=420;r.headSpin=-540;r.body=Body.COLLAPSE;r.bodyAt=.25f;r.cols=8;r.rows=16;
                r.emit(P.CHUNK,0,22,0,h).speed(520).dir(25,60).color(BONE).size(.8f);
                r.emit(P.SMOKE,.35f,10,0,.08f).spread(.15f,.02f).speed(90).dir(90,80).life(1.6f).size(1.4f).color(0x8f8572aa);}
            case BURNED->{r.charAt=-.2f;r.charDur=1.2f;r.burnAt=.6f;r.burnDur=1.8f;r.burnDir=1;r.body=Body.COLLAPSE;r.bodyAt=1.5f;r.rows=16;
                r.emit(P.SMOKE,0,26,0,.4f).spread(.15f,.3f).dir(90,25).speed(120).life(2.6f).size(1.8f).color(SMOKE).over(2);
                r.emit(P.EMBER,0,60,0,.4f).spread(.15f,.35f).dir(90,40).speed(220).life(1.5f).color(FIRE).over(2.2f);
                r.emit(P.ASH,1.6f,50,0,.3f).spread(.2f,.2f).speed(60).life(2.2f).color(ASH).over(.8f);}
            case EXPLODED->{r.body=Body.SHATTER;r.cols=10;r.rows=16;r.shatterPower=900;
                r.emit(P.CHUNK,0,40,0,.5f).speed(1000).color(BONE).size(1.1f);}
            case CURSED->{r.tintAt=-.6f;r.tint=0x9dff9dff;r.tintDur=.8f;r.body=Body.COLLAPSE;r.bodyAt=.3f;r.rows=18;r.cols=7;r.soulAt=.5f;r.soulColor=0x8dff9aff;
                r.edge=0x6dff7aff;r.burnAt=1.4f;r.burnDur=1.3f;r.burnDir=0;
                r.emit(P.WISP,0,30,0,.5f).spread(.2f,.3f).dir(90,40).speed(140).life(1.8f).color(GREEN).over(1.2f);
                r.emit(P.GLOW,0,2,0,.5f).speed(0).life(1.2f).size(5).color(0x2a8a3aff);}
        }
    }
    // ---------- PUMPKIN: shell, guts, seeds, candle light inside ----------
    private static void pumpkin(DeathRecipe r,DeathCause c,float n,float h){
        switch(c){
            case SHOT->{r.head=Head.SHATTER;r.shatterPower=640;r.body=Body.TOPPLE;r.bodyAt=.35f;r.bodyDir=-1;r.rows=15;
                r.emit(P.CHUNK,0,30,0,h).speed(620).dir(20,90).color(0xe0741cff).size(1.2f);
                r.emit(P.SEED,0,40,0,h).speed(520).dir(30,100).color(SEEDC);
                r.emit(P.DROP,0,26,0,h).speed(420).dir(30,90).color(0xd9a13aff);}
            case BURNED->{r.charAt=-.3f;r.charDur=1.6f;r.meltAt=.4f;r.meltDur=2f;r.meltAmount=.42f;r.body=Body.SINK;r.bodyAt=1.6f;
                r.emit(P.GLOW,-.4f,3,0,h).speed(0).life(2.2f).size(3.5f).color(0xff9a2aff);
                r.emit(P.SMOKE,0,30,0,h).spread(.12f,.12f).dir(90,25).speed(130).life(2.8f).size(2).color(SMOKE).over(2.5f);
                r.emit(P.EMBER,0,50,0,.5f).spread(.2f,.25f).dir(90,35).speed(230).life(1.4f).color(FIRE).over(2.2f);}
            case EXPLODED->{r.body=Body.SHATTER;r.cols=8;r.rows=11;r.shatterPower=1000;
                r.emit(P.CHUNK,0,46,0,.6f).speed(1100).color(0xe0741cff).size(1.5f);
                r.emit(P.SEED,0,70,0,.6f).speed(900).color(SEEDC);
                r.emit(P.DROP,0,40,0,.6f).speed(800).color(0xd9a13aff).size(1.3f);}
            case CURSED->{r.grayAt=-.2f;r.grayDur=1.4f;r.tintAt=0;r.tint=0x9fb070ff;r.tintDur=1.4f;r.meltAt=.3f;r.meltAmount=.5f;r.meltDur=2.2f;r.squash=.3f;r.body=Body.SLUMP;
                r.soulAt=1.1f;r.soulColor=0xc68bffff;
                r.emit(P.FLY,.3f,14,0,h).spread(.2f,.15f).speed(90).life(2.6f).color(0x111111ff);
                r.emit(P.DROP,.4f,30,0,h).spread(.2f,.1f).dir(270,40).speed(60).life(1.6f).color(0x5d6b2aff).over(1.6f);}
        }
    }
    // ---------- PLAGUE DOCTOR: mask, crows, alchemical glass ----------
    private static void doctor(DeathRecipe r,DeathCause c,float n,float h){
        switch(c){
            case SHOT->{r.head=Head.FLY;r.headVx=380;r.headVy=520;r.headSpin=420;r.headAt=.05f;r.body=Body.FLY_BACK;r.bodyDir=1;r.bodyAt=0;
                r.emit(P.FEATHER,0,30,0,h).speed(380).dir(40,120).life(3).color(0x5b4f60ff);
                r.emit(P.BAT,.2f,7,0,.5f).speed(420).dir(70,70).life(2.4f).color(0x4a3d5cff);
                r.emit(P.DROP,0,20,0,h).speed(420).dir(20,60).color(DARKRED);}
            case BURNED->{r.burnAt=.2f;r.burnDur=2f;r.burnDir=1;r.edge=0x8dff4aff;r.fireColor=0x7dff3aff;r.charAt=-.3f;r.charDur=1.4f;r.screenTint=0x0c2a06ff;
                r.emit(P.EMBER,0,60,0,.45f).spread(.18f,.3f).dir(90,35).speed(220).life(1.5f).color(0x9dff4aff).over(2.2f);
                r.emit(P.FEATHER,.4f,18,0,.6f).spread(.12f,.2f).speed(120).dir(90,90).life(2.6f).color(0x2a2a2aff);
                r.emit(P.SMOKE,0,24,0,.5f).spread(.15f,.2f).dir(90,25).speed(110).life(2.6f).size(2).color(0x1b2614ff).over(2);}
            case EXPLODED->{r.body=Body.SHATTER;r.shatterPower=950;r.flashColor=0xd8ffd0ff;
                r.emit(P.SPARK,0,40,0,.5f).speed(900).life(.6f).color(CYAN);
                r.emit(P.SMOKE,.1f,20,0,.5f).spread(.14f,.14f).speed(160).life(3).size(2.6f).color(0x3c6b2aff);
                r.emit(P.FEATHER,0,40,0,.6f).speed(700).life(3).color(0x5b4f60ff);}
            case CURSED->{r.burnAt=.2f;r.burnDur=1.8f;r.burnDir=0;r.edge=0x2a1f33ff;r.edgeWidth=.04f;
                r.emit(P.BAT,-.4f,40,0,.55f).spread(.15f,.3f).speed(380).dir(90,140).life(2.6f).color(0x4a3d5cff).over(2);
                r.emit(P.FEATHER,0,40,0,.5f).spread(.18f,.3f).speed(200).life(3).color(0x5b4f60ff).over(1.8f);}
        }
    }
    // ---------- DRACULA: ash, sunlight, bats, blood mist ----------
    private static void dracula(DeathRecipe r,DeathCause c,float n,float h){
        switch(c){
            case SHOT->{r.hitY=.6f;r.grayAt=.15f;r.grayDur=.7f;r.tintAt=.15f;r.tint=0xb8b0a8ff;r.tintDur=.7f;r.body=Body.COLLAPSE;r.bodyAt=1.1f;r.cols=11;r.rows=18;
                r.emit(P.DROP,0,26,0,.6f).speed(460).dir(170,60).color(RED);
                r.emit(P.ASH,1.1f,90,0,.5f).spread(.18f,.35f).speed(80).life(2.6f).color(ASH).over(.9f);
                r.emit(P.SMOKE,1.1f,14,0,.2f).spread(.18f,.05f).speed(80).dir(90,80).life(2.2f).size(1.6f).color(0x6e6862aa);}
            case BURNED->{r.flash=1;r.flashColor=0xfff6d0ff;r.screenTint=0x6a5a20ff;r.burnAt=0;r.burnDur=1.9f;r.burnDir=-1;r.edge=0xfff3b0ff;r.edgeWidth=.09f;r.fireColor=0xffe9a0ff;
                r.emit(P.GLOW,-.5f,3,0,.6f).speed(0).life(2.4f).size(7).color(0xfff0b0ff);
                r.emit(P.ASH,0,120,0,.5f).spread(.2f,.4f).dir(90,60).speed(130).life(2.4f).color(0x9a948eff).over(1.9f);
                r.emit(P.SMOKE,0,22,0,.5f).spread(.18f,.3f).dir(90,25).speed(140).life(2.4f).size(1.8f).color(0x8a847cff).over(1.8f);}
            case EXPLODED->{r.burnAt=0;r.burnDur=.55f;r.burnDir=0;r.edge=0xff2030ff;r.flashColor=0xff5060ff;
                r.emit(P.BAT,0,60,0,.55f).spread(.15f,.3f).speed(700).life(2.4f).color(0x4a3d5cff);
                r.emit(P.SMOKE,0,24,0,.5f).spread(.15f,.25f).speed(200).life(2.4f).size(2.4f).color(0x5a0510cc);}
            case CURSED->{r.grayAt=0;r.grayDur=1.2f;r.squash=.25f;r.body=Body.SINK;r.bodyAt=.9f;r.screenTint=0x3a0008ff;
                r.emit(P.SMOKE,-.6f,40,0,.05f).spread(.3f,.02f).dir(90,30).speed(90).life(2.6f).size(2.2f).color(0x6a0010bb).over(2.6f);
                r.emit(P.WISP,0,40,0,.4f).spread(.2f,.3f).dir(90,30).speed(150).life(1.6f).color(0xff3040ff).over(1.8f);
                r.emit(P.DROP,.2f,30,0,.2f).spread(.25f,.02f).dir(90,20).speed(260).life(1.2f).color(RED).over(1.5f);}
        }
    }
    // ---------- GHOST: ectoplasm, ripples, wisps ----------
    private static void ghost(DeathRecipe r,DeathCause c,float n,float h){
        switch(c){
            case SHOT->{r.hitY=.6f;r.waveAt=0;r.waveDur=1.3f;r.waveAmount=1.6f;r.burnAt=.6f;r.burnDur=1.4f;r.burnDir=0;r.edge=0x9ff4ffff;r.edgeWidth=.1f;
                r.emit(P.WISP,.6f,50,0,.55f).spread(.2f,.3f).speed(200).life(1.8f).color(CYAN).over(1.2f);
                r.emit(P.RING,0,1,0,.6f).speed(0).life(.6f).size(1.2f).color(0x9ff4ffaa);}
            case BURNED->{r.burnAt=0;r.burnDur=1.7f;r.burnDir=1;r.edge=0x5fa8ffff;r.edgeWidth=.1f;r.fireColor=0x4f9dffff;r.flashColor=0x9ac8ffff;r.screenTint=0x061a40ff;r.waveAt=-.4f;r.waveAmount=.6f;r.waveDur=2.2f;
                r.emit(P.EMBER,-.6f,80,0,.4f).spread(.2f,.35f).dir(90,30).speed(240).life(1.4f).color(BLUEFIRE).over(2.4f);
                r.emit(P.WISP,.4f,30,0,.6f).spread(.2f,.2f).dir(90,40).speed(160).life(1.6f).color(CYAN).over(1.5f);}
            case EXPLODED->{r.body=Body.SHATTER;r.shatterPower=1100;r.edge=0x9ff4ffff;r.burnAt=.2f;r.burnDur=1;r.burnDir=0;
                r.emit(P.WISP,0,60,0,.5f).speed(800).life(1.4f).color(CYAN).size(1.3f);}
            case CURSED->{r.waveAt=-.4f;r.waveAmount=2.2f;r.waveDur=2.2f;r.body=Body.SINK;r.bodyAt=.2f;r.tintAt=-.4f;r.tint=0xb08affff;
                r.emit(P.RING,-.4f,4,0,.02f).speed(0).life(1.6f).size(1.6f).color(0xb46bffaa).over(2);
                r.emit(P.WISP,0,50,0,.3f).spread(.25f,.2f).dir(270,40).speed(160).life(1.4f).color(PURPLE).over(1.8f);}
        }
    }
    // ---------- VOODOO: burlap, stuffing, pins, buttons ----------
    private static void voodoo(DeathRecipe r,DeathCause c,float n,float h){
        switch(c){
            case SHOT->{r.head=Head.FLY;r.headVx=460;r.headVy=560;r.headSpin=-700;r.body=Body.SLUMP;r.squash=.35f;
                r.emit(P.CHUNK,0,40,0,n).speed(560).dir(60,120).color(STUFF).size(1.2f);
                r.emit(P.PIN,0,6,0,h).speed(620).dir(60,140).life(2.6f);
                r.emit(P.STRING,0,10,0,n).speed(300).life(2.4f).color(0xc9a47aff);}
            case BURNED->{r.burnAt=.1f;r.burnDur=2f;r.burnDir=1;r.charAt=-.4f;r.charDur=1.4f;
                r.emit(P.EMBER,0,70,0,.4f).spread(.2f,.3f).dir(90,35).speed(230).life(1.5f).color(FIRE).over(2.2f);
                r.emit(P.SMOKE,0,26,0,.4f).spread(.16f,.25f).dir(90,25).speed(120).life(2.6f).size(1.9f).color(SMOKE).over(2.2f);
                r.emit(P.PIN,1.7f,4,0,.6f).speed(160).dir(90,120).life(2.2f);}
            case EXPLODED->{r.body=Body.SHATTER;r.shatterPower=980;
                r.emit(P.CHUNK,0,90,0,.5f).speed(950).color(STUFF).size(1.4f);
                r.emit(P.PIN,0,10,0,.6f).speed(900).life(2.4f);
                r.emit(P.SEED,0,4,0,h).speed(700).color(RED).size(3.5f);}
            case CURSED->{r.tintAt=-.2f;r.tint=0xffb0b0ff;r.body=Body.COLLAPSE;r.bodyAt=1.1f;r.cols=8;r.rows=12;r.soulAt=1.2f;r.soulColor=0xff7a8aff;
                r.emit(P.PIN,-.6f,8,0,.55f).spread(.25f,.3f).speed(-420).dir(0,360).life(1.1f).gravity(0).over(.6f);
                r.emit(P.GLOW,0,3,.04f,.3f).speed(0).life(1.4f).size(2.4f).color(0xff1a2aff);
                r.emit(P.CHUNK,1.1f,40,0,.4f).spread(.15f,.2f).speed(220).color(STUFF);}
        }
    }
    // ---------- ZOMBIE: rotten flesh, green gore, flies ----------
    private static void zombie(DeathRecipe r,DeathCause c,float n,float h){
        switch(c){
            case SHOT->{r.head=Head.SHATTER;r.shatterPower=600;r.body=Body.TOPPLE;r.bodyAt=.6f;r.bodyDir=1;r.cols=7;r.rows=11;
                r.emit(P.DROP,0,40,0,h).speed(560).dir(25,90).color(GORE).size(1.2f);
                r.emit(P.CHUNK,0,24,0,h).speed(600).dir(25,90).size(1.2f);}
            case BURNED->{r.charAt=-.2f;r.charDur=1.3f;r.meltAt=.3f;r.meltDur=2.2f;r.meltAmount=.45f;r.body=Body.SINK;r.bodyAt=1.4f;
                r.emit(P.SMOKE,0,34,0,.5f).spread(.15f,.3f).dir(90,25).speed(130).life(2.8f).size(2).color(0x2a2a14ff).over(2.4f);
                r.emit(P.EMBER,0,60,0,.4f).spread(.18f,.3f).dir(90,35).speed(220).life(1.4f).color(FIRE).over(2.2f);
                r.emit(P.DROP,.4f,30,0,.4f).spread(.2f,.2f).dir(270,30).speed(80).life(1.2f).color(GORE).over(1.6f);}
            case EXPLODED->{r.body=Body.SHATTER;r.cols=5;r.rows=8;r.shatterPower=850;
                r.emit(P.DROP,0,70,0,.5f).speed(950).color(GORE).size(1.3f);
                r.emit(P.CHUNK,0,40,0,.5f).speed(900).size(1.4f);}
            case CURSED->{r.grayAt=0;r.grayDur=1.6f;r.tintAt=0;r.tint=0x8aa070ff;r.tintDur=1.6f;r.squash=.2f;r.body=Body.SINK;r.bodyAt=1;r.soulAt=1.3f;r.soulColor=0x9dff7aff;
                r.emit(P.FLY,-.8f,18,0,.6f).spread(.2f,.2f).speed(90).life(3).color(0x101010ff);
                r.emit(P.SMOKE,0,26,0,.05f).spread(.3f,.02f).dir(90,30).speed(60).life(2.6f).size(2).color(0x3a4a20aa).over(2.4f);}
        }
    }
    // ---------- PUPPETEER: strings, wood, the hand from above ----------
    private static void puppeteer(DeathRecipe r,DeathCause c,float n,float h){
        switch(c){
            case SHOT->{r.body=Body.COLLAPSE;r.bodyAt=.15f;r.cols=6;r.rows=9;r.hitY=.62f;
                r.emit(P.STRING,0,14,0,1.05f).spread(.25f,.05f).speed(80).dir(270,30).life(2.6f).color(0xe6dcc8ff);
                r.emit(P.SPLINTER,0,26,0,.62f).speed(560).dir(170,70).color(WOOD);}
            case BURNED->{r.burnAt=0;r.burnDur=2f;r.burnDir=-1;r.charAt=-.2f;r.charDur=1.5f;
                r.emit(P.EMBER,-.3f,30,0,1.05f).spread(.25f,.05f).dir(270,40).speed(120).life(1.3f).color(FIRE).over(.6f);
                r.emit(P.EMBER,0,60,0,.6f).spread(.2f,.3f).dir(90,35).speed(220).life(1.4f).color(FIRE).over(2.2f);
                r.emit(P.SMOKE,0,24,0,.6f).spread(.16f,.25f).dir(90,25).speed(120).life(2.6f).size(1.9f).color(SMOKE).over(2.2f);}
            case EXPLODED->{r.body=Body.SHATTER;r.cols=7;r.rows=12;r.shatterPower=950;
                r.emit(P.SPLINTER,0,70,0,.5f).speed(1000).color(WOOD).size(1.3f);
                r.emit(P.STRING,0,10,0,.9f).speed(500).life(2.4f).color(0xe6dcc8ff);}
            case CURSED->{r.body=Body.LIFT;r.bodyAt=-.4f;r.burnAt=.9f;r.burnDur=1.2f;r.burnDir=-1;r.edge=0xb46bffff;r.soulAt=1.4f;r.soulColor=0xc68bffff;
                r.emit(P.STRING,-.6f,6,0,1.4f).spread(.15f,.02f).speed(0).life(2.4f).gravity(0).color(0xd8c8ffff);
                r.emit(P.WISP,.9f,40,0,.7f).spread(.2f,.3f).dir(90,40).speed(200).life(1.4f).color(PURPLE).over(1.2f);}
        }
    }
}
