package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.graphics.Pixmap;
import java.util.Arrays;

/** Load-time scanline alpha masks. Matches Intersector's strict crossing rule without per-pixel polygon tests. */
public final class CharacterTextureMasks {
    private CharacterTextureMasks() {}
    public static boolean validAlpha(Pixmap pixels){
        if(pixels.getFormat()!=Pixmap.Format.RGBA8888)return false;
        var bytes=pixels.getPixels();boolean clear=false,visible=false;
        for(int i=3,n=pixels.getWidth()*pixels.getHeight()*4;i<n;i+=4){int a=bytes.get(i)&255;clear|=a==0;visible|=a>100;if(clear&&visible)return true;}
        return false;
    }
    public static void polygon(Pixmap pixels,float[] polygon){
        if(polygon.length==0)return;
        int w=pixels.getWidth(),h=pixels.getHeight();var bytes=pixels.getPixels();float[] crossings=new float[polygon.length/2];
        for(int y=0;y<h;y++){
            float scan=y+.5f;int count=0;
            for(int current=0,previous=polygon.length-2;current<polygon.length;previous=current,current+=2){
                float y1=polygon[previous+1],y2=polygon[current+1];
                if((y2<scan&&y1>=scan)||(y1<scan&&y2>=scan)){
                    float x2=polygon[current];crossings[count++]=x2+(scan-y2)/(y1-y2)*(polygon[previous]-x2);
                }
            }
            Arrays.sort(crossings,0,count);int edge=0;boolean inside=false;
            for(int x=0;x<w;x++){
                while(edge<count&&crossings[edge]<x+.5f){inside=!inside;edge++;}
                if(!inside)bytes.put((y*w+x)*4+3,(byte)0);
            }
        }
    }
    public static void ellipse(Pixmap pixels,float cx,float cy,float rx,float ry){
        int w=pixels.getWidth(),h=pixels.getHeight();var bytes=pixels.getPixels();
        for(int y=0;y<h;y++)for(int x=0;x<w;x++){
            float dx=(x-cx)/rx,dy=(y-cy)/ry,keep=Math.max(0,Math.min(1,(1-dx*dx-dy*dy)*45));
            int i=(y*w+x)*4+3;bytes.put(i,(byte)(int)((bytes.get(i)&255)*keep));
        }
    }
}
