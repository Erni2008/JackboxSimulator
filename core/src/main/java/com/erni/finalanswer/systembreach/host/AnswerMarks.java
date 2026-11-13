package com.erni.finalanswer.systembreach.host;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.MathUtils;
import com.erni.finalanswer.systembreach.host.SystemBreachHostViewModel.Slot;
import static com.erni.finalanswer.systembreach.host.SystemBreachLayout.*;

/** A round ✓ (right) / ✗ (wrong) badge that pops above a player's head when they answer, holds, then fades. */
final class AnswerMarks {
    private static final float SHOW=1.5f,R=27;
    private static final Color OK=new Color(.30f,.95f,.50f,1),BAD=new Color(1f,.26f,.22f,1),DARK=new Color(.03f,.05f,.04f,1),tmp=new Color();
    private static float y0(){return panelTop()+CHARACTER_H-CHARACTER_SINK+6;}
    private static float clamp(float v){return Math.max(0,Math.min(1,v));}
    /** scale (pop with overshoot) and alpha for an age. */
    private static float scale(float t){float k=clamp(t/.28f);return 1+(2.2f)*(float)Math.pow(k-1,3)+1.2f*(float)Math.pow(k-1,2);}
    private static float alpha(float t){return t<1.1f?1:clamp(1-(t-1.1f)/(SHOW-1.1f));}
    void shapes(ShapeRenderer r,Slot s,float x){
        if(s.mark==0||s.markAge>SHOW)return;float t=s.markAge,k=scale(t)*R,a=alpha(t),y=y0()+Math.min(1,t/.3f)*6;Color c=s.mark>0?OK:BAD;
        r.setColor(0,0,0,.45f*a);r.circle(x+2,y-3,k+3,28);
        r.setColor(c.r,c.g,c.b,a);r.circle(x,y,k+3,28);r.setColor(DARK.r,DARK.g,DARK.b,a);r.circle(x,y,k-1,28);
        r.setColor(c.r,c.g,c.b,a);float w=Math.max(3,k*.2f);
        if(s.mark>0){r.rectLine(x-k*.45f,y+k*.02f,x-k*.12f,y-k*.32f,w);r.rectLine(x-k*.12f,y-k*.32f,x+k*.5f,y+k*.36f,w);r.circle(x-k*.12f,y-k*.32f,w/2,10);}
        else{r.rectLine(x-k*.36f,y-k*.36f,x+k*.36f,y+k*.36f,w);r.rectLine(x-k*.36f,y+k*.36f,x+k*.36f,y-k*.36f,w);}
    }
    void glow(SpriteBatch b,SystemBreachHostAssets as,Slot s,float x){
        if(s.mark==0||s.markAge>SHOW)return;float t=s.markAge,a=alpha(t),flash=Math.max(0,1-t/.4f);Color c=s.mark>0?OK:BAD;
        b.setColor(c.r,c.g,c.b,(.28f+.5f*flash)*a);b.draw(as.glow,x-70,y0()-70,140,140);
    }
}
