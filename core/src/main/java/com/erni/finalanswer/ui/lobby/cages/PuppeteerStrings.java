package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.math.Matrix4;

/** Quadratic cords: stationary crossbar endpoints, transformed bone endpoints and damped slack. */
public final class PuppeteerStrings {
    private final PuppeteerConfig config;private final PuppeteerSkeleton skeleton;
    private final float[] slack,restY,vertices,endpoints;private boolean initialized;
    public PuppeteerStrings(PuppeteerConfig config,PuppeteerSkeleton skeleton){this.config=config;this.skeleton=skeleton;slack=new float[config.strings.size];restY=new float[slack.length];endpoints=new float[slack.length*2];vertices=new float[slack.length*config.quality*20];}
    public void update(float delta,float time){
        for(int i=0;i<slack.length;i++){var c=config.strings.get(i);float[] m=skeleton.bone(c.part).world.val;
            float x=m[Matrix4.M03]+m[Matrix4.M00]*c.x+m[Matrix4.M01]*c.y,y=m[Matrix4.M13]+m[Matrix4.M10]*c.x+m[Matrix4.M11]*c.y;
            endpoints[i*2]=x;endpoints[i*2+1]=y;
            if(!initialized)restY[i]=y;
            // The mechanism reels in an elevated wrist: less slack while pulling upward.
            float desired=MathUtils.clamp(.85f-(y-restY[i])*.12f,.08f,1.8f);
            slack[i]=initialized?MathUtils.lerp(slack[i],desired,1-(float)Math.exp(-delta*6)):desired;
        }initialized=true;
    }
    public float endX(int i){return endpoints[i*2];}public float endY(int i){return endpoints[i*2+1];}
    public void draw(Batch batch,PuppeteerAssets assets,float time){
        int index=0;Color color=batch.getColor();float packed=Color.toFloatBits(color.r*.56f,color.g*.44f,color.b*.29f,color.a*.9f);
        for(int i=0;i<slack.length;i++){var c=config.strings.get(i);float x=endX(i),y=endY(i),bend=MathUtils.sin(time*.71f+i*1.3f)*slack[i];
            float mx=(c.anchorX+x)*.5f+bend,my=(c.anchorY+y)*.5f-slack[i];float oldX=c.anchorX,oldY=c.anchorY;
            for(int s=1;s<=config.quality;s++){float t=s/(float)config.quality,inv=1-t;
                float nx=inv*inv*c.anchorX+2*inv*t*mx+t*t*x,ny=inv*inv*c.anchorY+2*inv*t*my+t*t*y;
                float dx=nx-oldX,dy=ny-oldY,length=(float)Math.hypot(dx,dy),ox=-dy/Math.max(.001f,length)*.13f,oy=dx/Math.max(.001f,length)*.13f;
                for(int k=0;k<4;k++){boolean end=k>=2;float sign=k==0||k==3?-1:1;vertices[index++]=(end?nx:oldX)+ox*sign;vertices[index++]=(end?ny:oldY)+oy*sign;vertices[index++]=packed;vertices[index++]=end?1:0;vertices[index++]=k==0||k==3?1:0;}
                oldX=nx;oldY=ny;
            }
        }batch.draw(assets.cord.getTexture(),vertices,0,index);
    }
}
