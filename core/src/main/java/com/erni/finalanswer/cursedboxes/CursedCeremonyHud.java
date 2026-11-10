package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.utils.Align;

/** Quiet, resolution-aware stage furniture; no turn state or input ownership. */
final class CursedCeremonyHud implements AutoCloseable {
    private final Texture pixel;
    private TextureRegion region;
    private final GlyphLayout layout=new GlyphLayout();
    private final Color saved=new Color(),fontColor=new Color(),titleColor=new Color();
    CursedCeremonyHud(){var p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();pixel=new Texture(p);p.dispose();region=new TextureRegion(pixel);}
    void draw(Batch batch,BitmapFont font,BitmapFont title,float w,float h,String player,String message,int box,int remaining,int limit,boolean finale){
        float s=Math.min(w/1600f,h/900f),margin=48*s;
        saved.set(batch.getColor());fontColor.set(font.getColor());float sx=font.getData().scaleX,sy=font.getData().scaleY,tx=title.getData().scaleX,ty=title.getData().scaleY;titleColor.set(title.getColor());
        try{
            title.getData().setScale(s*.82f);title.setColor(.87f,.76f,.56f,1);
            line(batch,margin,h-62*s,w-2*margin,1*s,.34f);diamond(batch,w/2,h-61.5f*s,6*s,.9f);
            centered(batch,title,"CURSED BOXES",w*.25f,h-18*s,w*.5f);
            font.getData().setScale(s*.8f);font.setColor(.64f,.56f,.46f,1);
            centered(batch,font,"FINAL ANSWER",margin,h-29*s,w*.20f);
            centered(batch,font,player==null?"THE GALLERY":"PLAY ON YOUR PHONE",w*.76f,h-29*s,w*.21f-margin);
            if(player!=null&&!finale){
                font.getData().setScale(s*1.12f);font.setColor(.94f,.86f,.71f,1);centered(batch,font,player,w*.22f,h-78*s,w*.56f);
                font.getData().setScale(s*.84f);font.setColor(.71f,.62f,.52f,1);centered(batch,font,message==null?"":message,w*.20f,h-108*s,w*.60f);
            }
            if(!finale){
                // two gilt plaques: the chosen box and the shells left
                float pw=290*s,ph=58*s,gap=34*s,y=20*s,x1=w/2-gap/2-pw,x2=w/2+gap/2;
                plaque(batch,x1,y,pw,ph,s,box>=0);plaque(batch,x2,y,pw,ph,s,false);
                diamond(batch,w/2,y+ph/2,9*s,.85f);
                font.getData().setScale(s*.62f);font.setColor(.70f,.58f,.40f,1);
                centered(batch,font,"TARGET",x1,y+ph-8*s,pw);centered(batch,font,"SHELLS",x2,y+ph-8*s,pw);
                font.getData().setScale(s*1.05f);
                if(box>=0)font.setColor(1f,.92f,.74f,1);else font.setColor(.86f,.76f,.60f,1);
                centered(batch,font,box<0?"CHOOSE A BOX":String.format(java.util.Locale.ROOT,"BOX  %02d",box+1),x1,y+27*s,pw);
                int n=Math.max(1,limit),left=Math.max(0,remaining);float sw=12*s,sh=26*s,sg=12*s,sx0=x2+(pw-(n*sw+(n-1)*sg))/2;
                for(int i=0;i<n;i++){float px=sx0+i*(sw+sg),py=y+8*s;boolean live=i<left;
                    batch.setColor(0,0,0,.6f);batch.draw(pixel,px+2*s,py-2*s,sw,sh);
                    if(live){batch.setColor(.62f,.08f,.10f,1);batch.draw(pixel,px,py+sh*.32f,sw,sh*.68f);batch.setColor(.86f,.20f,.20f,1);batch.draw(pixel,px+sw*.18f,py+sh*.36f,sw*.22f,sh*.6f);
                        batch.setColor(.85f,.66f,.36f,1);batch.draw(pixel,px,py,sw,sh*.32f);batch.setColor(1f,.86f,.55f,1);batch.draw(pixel,px+sw*.18f,py+sh*.04f,sw*.22f,sh*.24f);}
                    else{batch.setColor(.16f,.12f,.11f,1);batch.draw(pixel,px,py,sw,sh);batch.setColor(.36f,.28f,.20f,.6f);batch.draw(pixel,px,py+sh-1*s,sw,1*s);}}
            }
        }finally{batch.setColor(saved);font.getData().setScale(sx,sy);font.setColor(fontColor);title.getData().setScale(tx,ty);title.getColor().set(titleColor);}
    }
    private void plaque(Batch batch,float x,float y,float w,float h,float s,boolean lit){
        batch.setColor(0,0,0,.55f);batch.draw(pixel,x+4*s,y-6*s,w,h);
        batch.setColor(.05f,.03f,.03f,.94f);batch.draw(pixel,x,y,w,h);
        for(int k=0;k<6;k++){float t=k/6f;batch.setColor(lit?.30f:.16f,lit?.07f:.10f,lit?.08f:.08f,.10f+.06f*k);batch.draw(pixel,x,y+h*(.4f+t*.6f),w,h*.1f+1);}
        batch.setColor(1,.85f,.55f,.10f);batch.draw(pixel,x,y+h-3*s,w,2*s);
        float b=2*s;batch.setColor(.80f,.62f,.32f,1);batch.draw(pixel,x,y,w,b);batch.draw(pixel,x,y+h-b,w,b);batch.draw(pixel,x,y,b,h);batch.draw(pixel,x+w-b,y,b,h);
        float i=6*s;batch.setColor(.80f,.62f,.32f,.35f);batch.draw(pixel,x+i,y+i,w-2*i,1*s);batch.draw(pixel,x+i,y+h-i,w-2*i,1*s);batch.draw(pixel,x+i,y+i,1*s,h-2*i);batch.draw(pixel,x+w-i,y+i,1*s,h-2*i);
        diamond(batch,x,y,6*s,1);diamond(batch,x+w,y,6*s,1);diamond(batch,x,y+h,6*s,1);diamond(batch,x+w,y+h,6*s,1);
    }
    private void diamond(Batch batch,float cx,float cy,float r,float a){batch.setColor(.95f,.80f,.48f,a);batch.draw(region,cx-r/1.414f,cy-r/1.414f,r/1.414f,r/1.414f,r*1.414f,r*1.414f,1,1,45);}
    private void line(Batch batch,float x,float y,float w,float h,float alpha){batch.setColor(.58f,.43f,.27f,alpha);batch.draw(pixel,x,y,w,h);}
    private void centered(Batch batch,BitmapFont font,String text,float x,float y,float width){layout.setText(font,text,0,text.length(),font.getColor(),Math.max(1,width),Align.center,false,"…");font.draw(batch,layout,x,y);}
    @Override public void close(){pixel.dispose();}
}
