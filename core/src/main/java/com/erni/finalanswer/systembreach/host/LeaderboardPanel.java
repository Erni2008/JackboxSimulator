package com.erni.finalanswer.systembreach.host;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.erni.finalanswer.systembreach.host.SystemBreachHostViewModel.Slot;
import static com.erni.finalanswer.systembreach.host.SystemBreachLayout.BOARD;

/** Bottom: trophy plate on the left, the server's top three on the right; rows glide when places change. */
final class LeaderboardPanel {
    private static final float ROWS_X=BOARD.x+640,ROWS_W=BOARD.width-700,ROW_H=40,ROW_GAP=8,FIRST_Y=BOARD.y+BOARD.height-38-ROW_H;
    private static final Color[] PLACE={SbPaint.GOLD,SbPaint.SILVER,SbPaint.BRONZE};
    private float rowY(Slot s){return FIRST_Y-s.boardY*(ROW_H+ROW_GAP);}

    void shapes(SbPaint p,ShapeRenderer r,SystemBreachHostViewModel vm){
        p.frame(BOARD.x,BOARD.y,BOARD.width,BOARD.height,26,SbPaint.GREEN,.45f);
        // trophy flanked by laurels
        float tx=BOARD.x+130,ty=BOARD.y+BOARD.height/2;Color g=SbPaint.GREEN;
        r.setColor(g);r.rect(tx-20,ty+4,40,30);r.arc(tx,ty+4,20,180,180,16);r.rect(tx-4,ty-28,8,16);r.rect(tx-18,ty-34,36,7);
        p.ring(tx-24,ty+20,9,3);p.ring(tx+24,ty+20,9,3);
        for(int side=-1;side<=1;side+=2)for(int i=0;i<5;i++){float a=(float)Math.toRadians(-60+i*28);float lx=tx+side*(46*(float)Math.cos(a)),ly=ty+46*(float)Math.sin(a);
            r.ellipse(lx-5,ly-9,10,18,side*(30+i*28),10);}
        // underline with hatch, as on the reference
        r.setColor(g.r,g.g,g.b,.6f);r.rect(BOARD.x+230,BOARD.y+64,300,3);for(int i=0;i<6;i++)r.triangle(BOARD.x+470+i*12,BOARD.y+58,BOARD.x+478+i*12,BOARD.y+58,BOARD.x+488+i*12,BOARD.y+72);
        r.setColor(SbPaint.TRIM.r,SbPaint.TRIM.g,SbPaint.TRIM.b,.8f);r.rect(ROWS_X-60,BOARD.y+30,2,BOARD.height-60);
        var top=vm.ranking();
        for(int i=0;i<Math.min(3,top.size());i++){
            Slot s=top.get(i);float y=rowY(s);Color c=PLACE[i];
            r.setColor(c.r*.12f,c.g*.12f,c.b*.12f,.92f);r.rect(ROWS_X,y,ROWS_W,ROW_H);
            p.outline(ROWS_X,y,ROWS_W,ROW_H,6,i==0?2.4f:1.6f,c);
            p.outline(ROWS_X+4,y+4,78,ROW_H-8,4,1.6f,c);
            p.crown(ROWS_X+28,y+12,20,c);
            if(i==0){float sx=ROWS_X+((System.nanoTime()/1e9f*260)%(ROWS_W+600))-300;float l=Math.max(ROWS_X+4,sx),rr=Math.min(ROWS_X+ROWS_W-4,sx+70);if(rr>l){r.setColor(1,.95f,.7f,.16f);r.rect(l,y+3,rr-l,ROW_H-6);}}
        }
    }
    void text(SpriteBatch b,SbPaint p,SystemBreachHostAssets as,SystemBreachHostViewModel vm){
        as.title.getData().setScale(.62f);p.text(b,as.title,vm.results()?"RESULTS":"LEADERBOARD",BOARD.x+232,BOARD.y+BOARD.height/2+as.title.getCapHeight()/2+6,SbPaint.GREEN,1);as.title.getData().setScale(1);
        if(vm.finished())p.text(b,as.labelSmall,"ENTER - BACK TO LOBBY",BOARD.x+236,BOARD.y+50,SbPaint.IVORY,.75f);
        var top=vm.ranking();
        for(int i=0;i<Math.min(3,top.size());i++){
            Slot s=top.get(i);float y=rowY(s)+ROW_H/2+as.board.getCapHeight()/2;Color c=PLACE[i];
            p.text(b,as.boardAp,String.valueOf(s.rank),ROWS_X+52,rowY(s)+ROW_H/2+as.boardAp.getCapHeight()/2,c,1);
            p.text(b,as.board,p.fit(as.board,s.name,ROWS_W-360),ROWS_X+120,y,i==0?SbPaint.GOLD:SbPaint.IVORY,1);
            p.right(b,as.boardAp,Math.round(s.shownAp)+" AP",ROWS_X+ROWS_W-22,rowY(s)+ROW_H/2+as.boardAp.getCapHeight()/2,i==0?SbPaint.GOLD:SbPaint.IVORY,1);
        }
    }
}
