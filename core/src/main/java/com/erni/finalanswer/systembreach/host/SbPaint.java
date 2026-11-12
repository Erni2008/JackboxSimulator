package com.erni.finalanswer.systembreach.host;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.MathUtils;

/** Shared drawing vocabulary: chamfered iron plates with bronze trim, rivets, terminal icons and fitted text. */
final class SbPaint {
    static final Color GREEN=new Color(.30f,.95f,.55f,1),RED=new Color(1f,.22f,.18f,1),AMBER=new Color(1f,.70f,.18f,1),BLUE=new Color(.30f,.62f,1f,1),
        GRAY=new Color(.55f,.57f,.58f,1),GOLD=new Color(1f,.80f,.30f,1),SILVER=new Color(.80f,.84f,.88f,1),BRONZE=new Color(.86f,.52f,.28f,1),
        IVORY=new Color(.93f,.92f,.86f,1),TRIM=new Color(.55f,.38f,.20f,1),TRIM_LIGHT=new Color(.85f,.62f,.34f,1),TRIM_DARK=new Color(.16f,.10f,.06f,1),
        IRON_TOP=new Color(.075f,.085f,.085f,.96f),IRON_BOTTOM=new Color(.025f,.03f,.03f,.97f);
    private final ShapeRenderer s;private final GlyphLayout layout=new GlyphLayout();
    private final float[] px=new float[8],py=new float[8];
    private final Color tmp=new Color(),tmp2=new Color(),tmp3=new Color();
    SbPaint(ShapeRenderer s){this.s=s;}

    static Color tone(SystemBreachHostViewModel.Status st){
        return switch(st){case ONLINE->GREEN;case BEING_HACKED,COMPROMISED->RED;case RECOVERY->AMBER;case UPGRADING->BLUE;case DISCONNECTED->GRAY;};
    }
    static Color tone(SystemBreachHostViewModel.Tone t){
        return switch(t){case HACK->RED;case RECOVERY->AMBER;case FIREWALL->BLUE;case REWARD->GREEN;case MUTED->GRAY;};
    }

    private void octagon(float x,float y,float w,float h,float c){
        px[0]=x+c;py[0]=y;px[1]=x+w-c;py[1]=y;px[2]=x+w;py[2]=y+c;px[3]=x+w;py[3]=y+h-c;
        px[4]=x+w-c;py[4]=y+h;px[5]=x+c;py[5]=y+h;px[6]=x;py[6]=y+h-c;px[7]=x;py[7]=y+c;
    }
    /** Filled chamfered plate with a vertical gradient (filled mode). */
    void plate(float x,float y,float w,float h,float c,Color top,Color bottom){
        octagon(x,y,w,h,c);float cx=x+w/2,cy=y+h/2;Color mid=tmp3.set(top).lerp(bottom,.5f);
        for(int i=0;i<8;i++){int j=(i+1)%8;
            Color a=tmp.set(bottom).lerp(top,(py[i]-y)/h),b=tmp2.set(bottom).lerp(top,(py[j]-y)/h);
            s.triangle(cx,cy,px[i],py[i],px[j],py[j],mid,a,b);}
    }
    /** Chamfered outline (filled mode, rectLine). */
    void outline(float x,float y,float w,float h,float c,float width,Color color){
        octagon(x,y,w,h,c);s.setColor(color);for(int i=0;i<8;i++){int j=(i+1)%8;s.rectLine(px[i],py[i],px[j],py[j],width);}
    }
    /** The house frame: dark bronze rim, lit bevel, iron face, a thin inner line in the accent colour and four rivets. */
    void frame(float x,float y,float w,float h,float c,Color accent,float accentAlpha){
        plate(x,y,w,h,c,TRIM,TRIM_DARK);
        outline(x+1.5f,y+1.5f,w-3,h-3,c-1,1.6f,tmp.set(TRIM_LIGHT).mul(1,1,1,.85f));
        plate(x+7,y+7,w-14,h-14,Math.max(2,c-5),IRON_TOP,IRON_BOTTOM);
        outline(x+12,y+12,w-24,h-24,Math.max(2,c-8),2f,tmp.set(accent).mul(1,1,1,accentAlpha));
        rivet(x+c*.5f+6,y+h-c*.5f-6);rivet(x+w-c*.5f-6,y+h-c*.5f-6);rivet(x+c*.5f+6,y+c*.5f+6);rivet(x+w-c*.5f-6,y+c*.5f+6);
    }
    void rivet(float x,float y){s.setColor(TRIM_DARK);s.circle(x,y-.6f,3.4f,10);s.setColor(TRIM_LIGHT);s.circle(x,y+.4f,2.4f,10);s.setColor(1,.9f,.7f,.7f);s.circle(x-.6f,y+1f,.9f,6);}

    void bar(float x,float y,float w,float h,float fraction,Color color,int segments){
        s.setColor(.01f,.02f,.02f,.95f);s.rect(x,y,w,h);s.setColor(TRIM.r,TRIM.g,TRIM.b,.8f);s.rect(x,y+h-1.5f,w,1.5f);s.rect(x,y,w,1.5f);
        float gap=4,seg=(w-8-gap*(segments-1))/segments;int lit=Math.round(MathUtils.clamp(fraction,0,1)*segments);
        for(int i=0;i<segments;i++){float sx=x+4+i*(seg+gap);
            if(i<lit){s.setColor(color);s.rect(sx,y+4,seg,h-8);s.setColor(1,1,1,.22f);s.rect(sx,y+h-4-(h-8)*.3f,seg,(h-8)*.3f);}
            else{s.setColor(color.r*.16f,color.g*.16f,color.b*.16f,1);s.rect(sx,y+4,seg,h-8);}}
    }

    // ---- icons, all centred on (x,y), drawn in filled mode ----
    void coins(float x,float y,float r){
        for(int i=2;i>=0;i--){float cy=y-r*.55f+i*r*.42f;s.setColor(.45f,.29f,.05f,1);s.ellipse(x-r,cy-r*.42f-2,r*2,r*.84f,16);s.setColor(GOLD);s.ellipse(x-r,cy-r*.42f,r*2,r*.84f,16);s.setColor(1,.93f,.6f,1);s.ellipse(x-r*.6f,cy-r*.18f,r*1.2f,r*.36f,12);}
    }
    void monitor(float x,float y,float size,Color c){
        float w=size*1.25f,h=size*.82f;s.setColor(c);s.rectLine(x-w/2,y-h/2+size*.12f,x+w/2,y-h/2+size*.12f,3);s.rectLine(x-w/2,y+h/2,x+w/2,y+h/2,3);
        s.rectLine(x-w/2,y-h/2+size*.12f,x-w/2,y+h/2,3);s.rectLine(x+w/2,y-h/2+size*.12f,x+w/2,y+h/2,3);
        s.rect(x-size*.08f,y-h/2-size*.12f,size*.16f,size*.24f);s.rect(x-size*.36f,y-h/2-size*.16f,size*.72f,3);
        s.circle(x,y+size*.08f,size*.11f,12);s.arc(x,y-size*.2f,size*.2f,0,180,12);
    }
    void crosshair(float x,float y,float r,Color c){
        s.setColor(c);ring(x,y,r,3);ring(x,y,r*.45f,2.5f);s.rect(x-1.5f,y+r*.55f,3,r*.75f);s.rect(x-1.5f,y-r*1.3f,3,r*.75f);s.rect(x+r*.55f,y-1.5f,r*.75f,3);s.rect(x-r*1.3f,y-1.5f,r*.75f,3);
    }
    void gear(float x,float y,float r,Color c){
        s.setColor(c);for(int i=0;i<8;i++){float a=i*45*MathUtils.degRad;float tx=x+MathUtils.cos(a)*r*.85f,ty=y+MathUtils.sin(a)*r*.85f;
            float dx=MathUtils.cos(a+MathUtils.HALF_PI)*r*.18f,dy=MathUtils.sin(a+MathUtils.HALF_PI)*r*.18f,ox=MathUtils.cos(a)*r*.3f,oy=MathUtils.sin(a)*r*.3f;
            s.triangle(tx-dx-ox,ty-dy-oy,tx+dx-ox,ty+dy-oy,tx+dx+ox,ty+dy+oy);s.triangle(tx-dx-ox,ty-dy-oy,tx+dx+ox,ty+dy+oy,tx-dx+ox,ty-dy+oy);}
        s.circle(x,y,r*.78f,20);s.setColor(.02f,.02f,.02f,1);s.circle(x,y,r*.34f,14);
    }
    void shield(float x,float y,float r,Color c){
        s.setColor(c);s.rect(x-r*.8f,y-r*.1f,r*1.6f,r*.95f);s.triangle(x-r*.8f,y-r*.1f,x+r*.8f,y-r*.1f,x,y-r*1.05f);
        s.setColor(.02f,.04f,.08f,1);s.rect(x-r*.08f,y-r*.75f,r*.16f,r*1.45f);s.rect(x-r*.6f,y+r*.18f,r*1.2f,r*.14f);
    }
    void warning(float x,float y,float r,Color c){
        s.setColor(c);s.triangle(x-r,y-r*.8f,x+r,y-r*.8f,x,y+r*.95f);s.setColor(.04f,.0f,.0f,1);s.rect(x-r*.09f,y-r*.25f,r*.18f,r*.75f);s.circle(x,y-r*.5f,r*.11f,8);
    }
    void unplugged(float x,float y,float r,Color c){
        s.setColor(c);ring(x,y,r,3);s.rectLine(x-r*.7f,y-r*.7f,x+r*.7f,y+r*.7f,3.5f);s.rect(x-r*.3f,y-r*.25f,r*.6f,r*.5f);
    }
    void clock(float x,float y,float r,Color c){
        s.setColor(c);ring(x,y,r,4);s.rect(x-r*.22f,y+r+2,r*.44f,r*.22f);s.rectLine(x,y,x,y+r*.6f,3.5f);s.rectLine(x,y,x+r*.45f,y-r*.2f,3.5f);
        s.rectLine(x+r*.62f,y+r*.86f,x+r*.86f,y+r*1.1f,4);
    }
    void crown(float x,float y,float w,Color c){
        float h=w*.6f;s.setColor(c);s.rect(x-w/2,y,w,h*.32f);
        s.triangle(x-w/2,y+h*.3f,x-w/2+w*.26f,y+h*.3f,x-w/2,y+h);s.triangle(x-w*.2f,y+h*.3f,x+w*.2f,y+h*.3f,x,y+h*1.12f);s.triangle(x+w/2-w*.26f,y+h*.3f,x+w/2,y+h*.3f,x+w/2,y+h);
        s.setColor(1,.97f,.75f,1);s.circle(x,y+h*1.12f,w*.06f,8);s.circle(x-w/2,y+h,w*.05f,8);s.circle(x+w/2,y+h,w*.05f,8);
    }
    void skull(float x,float y,float r,Color c,Color hole){
        s.setColor(c);s.circle(x,y+r*.2f,r,24);s.rect(x-r*.55f,y-r*.75f,r*1.1f,r*.7f);
        s.setColor(hole);s.circle(x-r*.38f,y+r*.12f,r*.26f,12);s.circle(x+r*.38f,y+r*.12f,r*.26f,12);s.triangle(x-r*.1f,y-r*.3f,x+r*.1f,y-r*.3f,x,y-r*.05f);
        for(int i=-1;i<=1;i++)s.rect(x+i*r*.3f-r*.04f,y-r*.75f,r*.08f,r*.32f);
    }
    void ring(float x,float y,float r,float width){int n=28;for(int i=0;i<n;i++){float a=i*MathUtils.PI2/n,b=(i+1)*MathUtils.PI2/n;s.rectLine(x+MathUtils.cos(a)*r,y+MathUtils.sin(a)*r,x+MathUtils.cos(b)*r,y+MathUtils.sin(b)*r,width);}}

    // ---- text ----
    String fit(BitmapFont f,String v,float width){layout.setText(f,v);if(layout.width<=width)return v;
        while(v.length()>1){v=v.substring(0,v.offsetByCodePoints(v.length(),-1));layout.setText(f,v+"…");if(layout.width<=width)return v.stripTrailing()+"…";}return "…";}
    float width(BitmapFont f,String v){layout.setText(f,v);return layout.width;}
    void text(SpriteBatch b,BitmapFont f,String v,float x,float y,Color c,float a){f.setColor(c.r,c.g,c.b,c.a*a);f.draw(b,v,x,y);}
    void centered(SpriteBatch b,BitmapFont f,String v,float cx,float y,Color c,float a){layout.setText(f,v);text(b,f,v,cx-layout.width/2,y,c,a);}
    void right(SpriteBatch b,BitmapFont f,String v,float rx,float y,Color c,float a){layout.setText(f,v);text(b,f,v,rx-layout.width,y,c,a);}
}
