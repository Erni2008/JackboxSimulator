package com.erni.finalanswer.systembreach.host;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.erni.finalanswer.systembreach.host.SystemBreachHostViewModel.Slot;
import static com.erni.finalanswer.systembreach.host.SystemBreachLayout.BOARD;

/** Bottom: trophy plate on the left, the server's top three on the right; rows glide when places change. */
final class LeaderboardPanel {
    private static final float ROWS_X=BOARD.x+640,ROWS_W=BOARD.width-700,ROW_H=34,ROW_GAP=7,FIRST_Y=BOARD.y+BOARD.height-26-ROW_H;
    private static final Color[] PLACE={SbPaint.GOLD,SbPaint.SILVER,SbPaint.BRONZE};
    private float rowY(Slot s){return FIRST_Y-s.boardY*(ROW_H+ROW_GAP);}

    void shapes(SbPaint p,ShapeRenderer r,SystemBreachHostViewModel vm){
        p.frame(BOARD.x,BOARD.y,BOARD.width,BOARD.height,26,SbPaint.GREEN,.45f);
        // trophy flanked by laurels
        float tx=BOARD.x+110,ty=BOARD.y+BOARD.height/2;Color g=SbPaint.GREEN;
        // underline with hatch, as on the reference
        r.setColor(g.r,g.g,g.b,.6f);r.rect(BOARD.x+200,BOARD.y+48,300,3);for(int i=0;i<6;i++)r.triangle(BOARD.x+440+i*12,BOARD.y+42,BOARD.x+448+i*12,BOARD.y+42,BOARD.x+458+i*12,BOARD.y+56);
        r.setColor(SbPaint.TRIM.r,SbPaint.TRIM.g,SbPaint.TRIM.b,.8f);r.rect(ROWS_X-60,BOARD.y+30,2,BOARD.height-60);
        var top=vm.ranking();
        for(int i=0;i<Math.min(3,top.size());i++){
            Slot s=top.get(i);float y=rowY(s);Color c=PLACE[i];
            r.setColor(c.r*.12f,c.g*.12f,c.b*.12f,.92f);r.rect(ROWS_X,y,ROWS_W,ROW_H);
            p.outline(ROWS_X,y,ROWS_W,ROW_H,6,i==0?2.4f:1.6f,c);
            p.outline(ROWS_X+4,y+4,70,ROW_H-8,4,1.6f,c);
            p.crown(ROWS_X+24,y+10,18,c);
        }
    }
    /**
     * Additive light on the leader's row, driven by frame time: a slow gold breath, and every few seconds a soft
     * highlight that eases across the row and dissolves at its ends (no hard-edged rectangles).
     */
    private final com.badlogic.gdx.math.Rectangle area=new com.badlogic.gdx.math.Rectangle(),clip=new com.badlogic.gdx.math.Rectangle();
    void glow(SpriteBatch b,SystemBreachHostAssets as,SystemBreachHostViewModel vm,float time,com.badlogic.gdx.graphics.Camera cam){
        var top=vm.ranking();if(top.isEmpty())return;float y=rowY(top.getFirst());
        float breath=.07f+.05f*(float)Math.sin(time*1.6f);b.setColor(1,.78f,.32f,breath);b.draw(as.glow,ROWS_X-30,y-14,ROWS_W+60,ROW_H+28);
        float k=(time%6.5f)/1.6f;if(k>=1)return;
        float e=k*k*(3-2*k),x=ROWS_X-60+(ROWS_W+120)*e,edge=Math.max(0,Math.min(1,Math.min(x-ROWS_X,ROWS_X+ROWS_W-x)/110f)),a=(float)Math.sin(Math.PI*k)*edge;
        // clipped to the row, a tall glow reads as an even band of light across the row's full height
        b.flush();area.set(ROWS_X+3,y+3,ROWS_W-6,ROW_H-6);com.badlogic.gdx.scenes.scene2d.utils.ScissorStack.calculateScissors(cam,b.getTransformMatrix(),area,clip);
        if(!com.badlogic.gdx.scenes.scene2d.utils.ScissorStack.pushScissors(clip))return;
        b.setColor(1,.82f,.45f,.38f*a);b.draw(as.glow,x-150,y-ROW_H*1.6f,300,ROW_H*4.2f);
        b.setColor(1,.97f,.88f,.42f*a);b.draw(as.glow,x-30,y-ROW_H*1.6f,60,ROW_H*4.2f);
        b.flush();com.badlogic.gdx.scenes.scene2d.utils.ScissorStack.popScissors();
    }
    void text(SpriteBatch b,SbPaint p,SystemBreachHostAssets as,SystemBreachHostViewModel vm){
        p.text(b,as.heading,vm.results()?(vm.ru()?"ИТОГИ":"RESULTS"):(vm.ru()?"ЛИДЕРЫ":"LEADERBOARD"),BOARD.x+200,BOARD.y+BOARD.height/2+as.heading.getCapHeight()/2+6,SbPaint.GREEN,1);
        if(vm.finished())p.text(b,as.labelSmall,vm.ru()?"ENTER - В ЛОББИ":"ENTER - BACK TO LOBBY",BOARD.x+204,BOARD.y+38,SbPaint.IVORY,.75f);
        p.icon(b,as.iconBig,SbIcons.TROPHY,BOARD.x+110,BOARD.y+BOARD.height/2,SbPaint.GOLD,1,1.35f,0);
        var top=vm.ranking();
        for(int i=0;i<Math.min(3,top.size());i++){
            Slot s=top.get(i);float y=rowY(s)+ROW_H/2+as.board.getCapHeight()/2;Color c=PLACE[i];
            p.text(b,as.boardAp,String.valueOf(s.rank),ROWS_X+46,rowY(s)+ROW_H/2+as.boardAp.getCapHeight()/2,c,1);
            p.text(b,as.board,p.fit(as.board,s.name,ROWS_W-360),ROWS_X+100,y,i==0?SbPaint.GOLD:SbPaint.IVORY,1);
            p.right(b,as.boardAp,s.apText(),ROWS_X+ROWS_W-22,rowY(s)+ROW_H/2+as.boardAp.getCapHeight()/2,i==0?SbPaint.GOLD:SbPaint.IVORY,1);
        }
    }
}
