package com.erni.finalanswer.cursedboxes;

/** Loading/test-only alpha analysis. Flood fill distinguishes enclosed holes from exterior alpha. */
public final class CursedCharacterImage {
    @FunctionalInterface public interface Alpha { int at(int x,int y); }
    public record Info(int width,int height,int holePixels,float holeX,float holeY) {}
    private CursedCharacterImage(){}
    public static Info inspect(CursedCharacterType type,int width,int height,Alpha alpha){
        if(width<=0||height<=0)throw new IllegalArgumentException(type.diagnostic("invalid dimensions"));
        int size=Math.multiplyExact(width,height),best=0;float bestX=0,bestY=0;
        byte[] pixels=new byte[size];int[] queue=new int[size];
        for(int y=0;y<height;y++)for(int x=0;x<width;x++)pixels[y*width+x]=(byte)(alpha.at(x,y)<=4?1:0);
        for(int start=0;start<size;start++)if(pixels[start]==1){
            int read=0,write=1;queue[0]=start;pixels[start]=2;boolean exterior=false;long sx=0,sy=0;
            while(read<write){
                int p=queue[read++],x=p%width,y=p/width;sx+=x;sy+=y;
                if(x==0||y==0||x==width-1||y==height-1)exterior=true;
                if(x>0&&pixels[p-1]==1){pixels[p-1]=2;queue[write++]=p-1;}
                if(x+1<width&&pixels[p+1]==1){pixels[p+1]=2;queue[write++]=p+1;}
                if(y>0&&pixels[p-width]==1){pixels[p-width]=2;queue[write++]=p-width;}
                if(y+1<height&&pixels[p+width]==1){pixels[p+width]=2;queue[write++]=p+width;}
            }
            float x=sx/(float)write/width,y=sy/(float)write/height;
            if(!exterior&&write>best&&x>=type.holeLeft&&x<=type.holeRight&&y>=type.holeTop&&y<=type.holeBottom){best=write;bestX=x;bestY=y;}
        }
        if(best<size*.005f)throw new IllegalArgumentException(type.diagnostic("no enclosed transparent "+(type==CursedCharacterType.VOODOO?"head":"torso")+" opening; expected >=0.5% image area"));
        return new Info(width,height,best,bestX,bestY);
    }
}
