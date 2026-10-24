package com.erni.finalanswer.impostor;

/** Safe design-space geometry, scaled uniformly by the screen's FitViewport. No game rules. */
public final class VotingLayout {
    public static final float WIDTH=1920,HEIGHT=1080;
    public static final float PLAYERS_LEFT=150,PLAYERS_RIGHT=1570,PLAYER_BASELINE=790;
    public static final float TABLE_LEFT=205,TABLE_RIGHT=1715;
    public record Placement(float x,float y,float width,float height,float rotation) {}
    private VotingLayout() {}
    public static Placement card(int count,int index){
        if(count<2||count>8||index<0||index>=count)throw new IllegalArgumentException("Presentation supports 2–8 unique players");
        if(count>=7){
            int far=(count+1)/2,row=index<far?0:1,column=row==0?index:index-far,columns=row==0?far:count-far;
            float width=220,height=width*1353/1162,gap=32,left=960-(columns*width+(columns-1)*gap)/2,offset=column-(columns-1)/2f;
            return new Placement(left+column*(width+gap),row==0?321:48,width,height,offset/Math.max(1,(columns-1)/2f)*-1.1f);
        }
        float gap=count<=4?34:18,width=Math.min(300,(TABLE_RIGHT-TABLE_LEFT-gap*(count-1))/count),height=width*1353/1162;
        float left=960-(count*width+(count-1)*gap)/2;
        float offset=index-(count-1)/2f,distance=Math.abs(offset)/Math.max(1,(count-1)/2f);
        return new Placement(left+index*(width+gap),105+18*(1-distance),width,height,offset/Math.max(1,(count-1)/2f)*-1.35f);
    }
    public static float playerCenter(int count,int index){return PLAYERS_LEFT+(index+.5f)*(PLAYERS_RIGHT-PLAYERS_LEFT)/count;}
    public static float playerScale(int count){return Math.min(.82f,(PLAYERS_RIGHT-PLAYERS_LEFT)/count/208);}
    public static boolean ceremony(com.erni.finalanswer.gameplay.impostor.ImpostorPhase phase){
        return switch(phase){case VOTING_LOCKED,FINAL_VOTE_REVEAL,SUSPECT_ANNOUNCEMENT,IMPOSTOR_REVEAL,RESULT->true;default->false;};
    }
}
