package com.erni.finalanswer.cursedboxes;

public final class CursedBoxesBackgroundCheck {
    private static void check(boolean value,String message){if(!value)throw new AssertionError(message);}
    private static void near(float expected,float actual){check(Math.abs(expected-actual)<.00001f,"Expected "+expected+", got "+actual);}
    public static void main(String[] args){
        var settings=new CursedBoxesBackground.Settings();var t=new CursedBoxesBackground.Timeline(settings);
        check(t.current()==0&&t.next()==1,"Start at source frame 1");near(0,t.alpha());
        t.update(1.5f);near(0,t.alpha());t.update(.25f);near(.5f,t.alpha());t.update(.25f);
        check(t.current()==1&&t.next()==2,"Smooth handoff to source frame 2");near(0,t.alpha());
        t.update(2);check(t.current()==2&&t.next()==1,"Ping-pong reverses at source frame 3");
        t.update(2);check(t.current()==1&&t.next()==0,"Reverse handoff to frame 1");
        t.update(2);check(t.current()==0,"Loop boundary");near(0,t.alpha());
        float previous=0;var fade=new CursedBoxesBackground.Timeline(settings);fade.update(1.5f);
        for(int i=0;i<49;i++){fade.update(.01f);float alpha=fade.alpha();check(alpha>=previous&&alpha-previous<.04f,"Monotone bounded alpha, no flashes");previous=alpha;}
        var a=new CursedBoxesBackground.Timeline(settings);var b=new CursedBoxesBackground.Timeline(settings);
        for(int i=0;i<300;i++)a.update(1f/30);for(int i=0;i<1200;i++)b.update(1f/120);
        check(a.current()==b.current(),"Frame-rate-independent sequence");near(a.alpha(),b.alpha());
        double before=a.elapsed();a.update(Float.NaN);a.update(-1);check(a.elapsed()==before,"Reject invalid deltas");
        settings.loop=false;var stopped=new CursedBoxesBackground.Timeline(settings);stopped.update(1000);check(stopped.current()==2&&stopped.next()==2,"Non-loop final frame");near(0,stopped.alpha());
        for(int[] size:new int[][]{{1920,1080},{2560,1440},{1920,1200},{1024,768},{900,1600}}){
            float scale=CursedBoxesBackground.coverScale(size[0],size[1],1672,941);
            check(1672*scale>=size[0]-.001f&&941*scale>=size[1]-.001f,"No empty borders");
            check(Math.min(Math.abs(1672*scale-size[0]),Math.abs(941*scale-size[1]))<.001f,"Cover, not stretch");
        }
        settings.crossfadeDuration=0;try{new CursedBoxesBackground.Timeline(settings);throw new AssertionError("Invalid config accepted");}catch(IllegalArgumentException expected){}
        System.out.println("PASS: source frames 1/2/3 in ping-pong order, eased crossfades, loop boundary, frame-rate independence, invalid deltas, stop mode and cover at five aspect ratios");
    }
}
