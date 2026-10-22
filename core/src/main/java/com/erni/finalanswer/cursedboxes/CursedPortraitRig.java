package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.math.*;

/** Continuous weighted sprite skin. Never cuts/repaints the source or opens gaps between limbs. */
final class CursedPortraitRig {
    static final int TORSO=0,HEAD=1,LEFT_ARM=2,LEFT_FOREARM=3,RIGHT_ARM=4,RIGHT_FOREARM=5,LEFT_LEG=6,RIGHT_LEG=7;
    private static final int COLS=22,ROWS=26;
    private final CursedSurvivorAssets.Profile profile;
    private final Texture texture;
    private final float[] rest=new float[(COLS+1)*(ROWS+1)*2],weights=new float[(COLS+1)*(ROWS+1)*8];
    private final float[] deformed=new float[rest.length],vertices=new float[COLS*ROWS*20],angles=new float[8];
    private final CursedSpriteSkeleton skeleton;
    private final int[] cellOrder=new int[COLS*ROWS];
    private final float width,height=1.02f;
    private final CursedCharacterType type;
    CursedPortraitRig(CursedSurvivorAssets assets,CursedCharacterType type){
        this.type=type;profile=assets.profile(type);texture=assets.portraits[type.ordinal()];
        int[] bounds=profile.bounds;width=Math.min(1.42f,height*(bounds[2]-bounds[0])/(bounds[3]-bounds[1]));
        skeleton=new CursedSpriteSkeleton(profile,width,height);
        for(int y=0;y<=ROWS;y++)for(int x=0;x<=COLS;x++){
            int n=y*(COLS+1)+x;float u=x/(float)COLS,v=y/(float)ROWS;
            rest[n*2]=u*width;rest[n*2+1]=v*height;
            float neck=profile.pivots[3],head=smooth((v-neck+.025f)/.10f);
            float lower=profile.legs?1-smooth((v-.22f)/.13f):0;
            float l=(1-smooth((u-.25f)/.16f))*(1-head)*(1-lower);
            float r=smooth((u-.64f)/.14f)*(1-head)*(1-lower);
            float lf=1-smooth((v-profile.pivots[7])/.13f),rf=1-smooth((v-profile.pivots[11])/.13f);
            weights[n*8+HEAD]=head;
            weights[n*8+LEFT_ARM]=l*(1-lf);weights[n*8+LEFT_FOREARM]=l*lf;
            weights[n*8+RIGHT_ARM]=r*(1-rf);weights[n*8+RIGHT_FOREARM]=r*rf;
            weights[n*8+LEFT_LEG]=lower*(1-smooth((u-.45f)/.10f));weights[n*8+RIGHT_LEG]=lower*smooth((u-.45f)/.10f);
            float total=0;for(int b=1;b<8;b++)total+=weights[n*8+b];weights[n*8]=Math.max(0,1-total);
            total=Math.max(1,total);for(int b=0;b<8;b++)weights[n*8+b]/=total;
        }
        Integer[] order=new Integer[cellOrder.length];for(int i=0;i<order.length;i++)order[i]=i;
        java.util.Arrays.sort(order,java.util.Comparator.comparingInt(this::cellDepth));
        for(int i=0;i<order.length;i++)cellOrder[i]=order[i];
    }
    private int cellDepth(int cell){int n=(cell/COLS)*(COLS+1)+cell%COLS,best=0;for(int b=1;b<8;b++)if(weights[n*8+b]>weights[n*8+best])best=b;return skeleton.bones[best].order;}
    private static float smooth(float t){t=MathUtils.clamp(t,0,1);return t*t*(3-2*t);}
    void draw(SpriteBatch batch,float time,float entrance,float duration,float opacity){
        float p=MathUtils.clamp(entrance/duration,0,1),reveal=(1-smooth(p))*(float)Math.sin(p*Math.PI);
        float t=time+type.ordinal()*1.37f;
        angles[TORSO]=MathUtils.sin(t*.8f)*.7f;
        angles[HEAD]=MathUtils.sin(t*.63f)*1.4f;
        angles[LEFT_ARM]=MathUtils.sin(t*1.1f)*1.4f;
        angles[RIGHT_ARM]=MathUtils.sin(t*.91f+1)*1.6f;
        angles[LEFT_FOREARM]=MathUtils.sin(t*.9f+.7f)*1.1f;angles[RIGHT_FOREARM]=MathUtils.sin(t*1.07f)*1.1f;
        angles[LEFT_LEG]=profile.legs?MathUtils.sin(t*.43f)*.3f:0;angles[RIGHT_LEG]=profile.legs?MathUtils.sin(t*.47f+1)*.3f:0;
        switch(type){
            case GHOST:angles[TORSO]+=reveal*2;angles[LEFT_ARM]-=reveal*4;angles[RIGHT_ARM]+=reveal*4;break;
            case DRACULA:angles[HEAD]-=reveal*5;angles[RIGHT_ARM]+=reveal*4;angles[TORSO]-=reveal;break;
            case PLAGUE_DOCTOR:angles[HEAD]+=reveal*5;angles[LEFT_ARM]-=reveal*2;break;
            case SKELETON:angles[HEAD]-=reveal*4;angles[TORSO]+=MathUtils.sin(entrance*32)*reveal;angles[LEFT_ARM]-=reveal*3;angles[RIGHT_ARM]+=reveal*3;break;
            case PUMPKIN:angles[HEAD]+=reveal*4;angles[LEFT_ARM]-=reveal*3;angles[RIGHT_ARM]+=reveal*3;break;
            default:break;
        }
        for(int b=0;b<8;b++)skeleton.bones[b].rotation=angles[b];
        skeleton.bones[HEAD].y=reveal*.012f;
        skeleton.bones[TORSO].scaleY=1+MathUtils.sin(t*1.2f)*.002f;
        skeleton.update();
        float floatY=type==CursedCharacterType.GHOST?.018f*MathUtils.sin(t*1.1f)+.035f*smooth(p):0;
        for(int n=0;n<rest.length/2;n++){
            float x=rest[n*2],y=rest[n*2+1],sx=0,sy=0;
            for(int b=0;b<8;b++){
                float w=weights[n*8+b];if(w==0)continue;
                var bone=skeleton.bones[b];float dx=x-bone.pivotX,dy=y-bone.pivotY;Affine2 m=bone.world;
                sx+=(m.m00*dx+m.m01*dy+m.m02)*w;sy+=(m.m10*dx+m.m11*dy+m.m12)*w;
            }
            deformed[n*2]=sx-width*.5f;deformed[n*2+1]=sy-.51f+floatY;
        }
        float color=Color.toFloatBits(.94f,.91f,.86f,opacity);int k=0;
        for(int cell:cellOrder)for(int c=0;c<4;c++){
            int y=cell/COLS,x=cell%COLS;
            int vx=x+(c>=2?1:0),vy=y+(c==1||c==2?1:0),n=vy*(COLS+1)+vx;
            float alpha=0;for(int bone=0;bone<8;bone++)alpha+=weights[n*8+bone]*skeleton.bones[bone].worldOpacity;
            vertices[k++]=deformed[n*2];vertices[k++]=deformed[n*2+1];vertices[k++]=alpha==1?color:Color.toFloatBits(.94f,.91f,.86f,opacity*alpha);
            vertices[k++]=(profile.bounds[0]+(profile.bounds[2]-profile.bounds[0])*vx/(float)COLS)/texture.getWidth();
            vertices[k++]=(profile.bounds[3]-(profile.bounds[3]-profile.bounds[1])*vy/(float)ROWS)/texture.getHeight();
        }
        batch.draw(texture,vertices,0,vertices.length);
    }
}
