package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.utils.Align;

/** Quiet, resolution-aware stage furniture; no turn state or input ownership. */
final class CursedCeremonyHud implements AutoCloseable {
    private final Texture pixel;
    private final GlyphLayout layout=new GlyphLayout();
    private final Color saved=new Color(),fontColor=new Color(),titleColor=new Color();
    CursedCeremonyHud(){var p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();pixel=new Texture(p);p.dispose();}
    void draw(Batch batch,BitmapFont font,BitmapFont title,float w,float h,String player,String message,int box,int remaining,int limit,boolean finale){
        float s=Math.min(w/1600f,h/900f),margin=48*s;
        saved.set(batch.getColor());fontColor.set(font.getColor());float sx=font.getData().scaleX,sy=font.getData().scaleY,tx=title.getData().scaleX,ty=title.getData().scaleY;titleColor.set(title.getColor());
        try{
            title.getData().setScale(s*.82f);title.setColor(.87f,.76f,.56f,1);
            line(batch,margin,h-62*s,w-2*margin,1*s,.34f);
            centered(batch,title,"CURSED BOXES",w*.25f,h-18*s,w*.5f);
            font.getData().setScale(s*.8f);font.setColor(.64f,.56f,.46f,1);
            centered(batch,font,"FINAL ANSWER",margin,h-29*s,w*.20f);
            centered(batch,font,player==null?"THE GALLERY":"PLAY ON YOUR PHONE",w*.76f,h-29*s,w*.21f-margin);
            if(player!=null&&!finale){
                font.getData().setScale(s*1.12f);font.setColor(.94f,.86f,.71f,1);centered(batch,font,player,w*.22f,h-78*s,w*.56f);
                font.getData().setScale(s*.84f);font.setColor(.71f,.62f,.52f,1);centered(batch,font,message==null?"":message,w*.20f,h-108*s,w*.60f);
            }
            if(!finale){
                float width=620*s,x=(w-width)/2,y=24*s;
                batch.setColor(.025f,.014f,.018f,.9f);batch.draw(pixel,x,y,width,58*s);
                line(batch,x,y+58*s,width,1*s,.6f);line(batch,x+width*.5f,y+12*s,1*s,34*s,.35f);
                font.getData().setScale(s*.95f);font.setColor(.85f,.74f,.58f,1);
                centered(batch,font,box<0?"CHOOSE A BOX":String.format(java.util.Locale.ROOT,"BOX %02d",box+1),x+12*s,y+36*s,width*.46f);
                centered(batch,font,"SHOTS  "+Math.max(0,remaining)+" / "+limit,x+width*.52f,y+36*s,width*.46f);
            }
        }finally{batch.setColor(saved);font.getData().setScale(sx,sy);font.setColor(fontColor);title.getData().setScale(tx,ty);title.getColor().set(titleColor);}
    }
    private void line(Batch batch,float x,float y,float w,float h,float alpha){batch.setColor(.58f,.43f,.27f,alpha);batch.draw(pixel,x,y,w,h);}
    private void centered(Batch batch,BitmapFont font,String text,float x,float y,float width){layout.setText(font,text,0,text.length(),font.getColor(),Math.max(1,width),Align.center,false,"…");font.draw(batch,layout,x,y);}
    @Override public void close(){pixel.dispose();}
}
