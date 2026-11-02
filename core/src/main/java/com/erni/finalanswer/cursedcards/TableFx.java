package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.utils.Disposable;

/**
 * Restrained screen-space atmosphere for THE CURSED CARDS: crimson embers for burning pairs and the DEATH reveal,
 * slow dust motes drifting in the moonlight. Fixed pools, no allocation per frame; embers are world-anchored and
 * projected through the table camera so they stay on the painted felt.
 */
public final class TableFx implements Disposable {
    private static final int EMBERS=220,DUST=46,SMOKE=48;
    // smoke (world space, normal blending): slow, expanding, fading wisps
    private final float[] mx=new float[SMOKE],my=new float[SMOKE],mz=new float[SMOKE],mvx=new float[SMOKE],mlife=new float[SMOKE],mmax=new float[SMOKE],msize=new float[SMOKE];private int smokeLive;
    private final Texture dot;
    // embers (world space)
    private final float[] ex=new float[EMBERS],ey=new float[EMBERS],ez=new float[EMBERS],evx=new float[EMBERS],evy=new float[EMBERS],evz=new float[EMBERS],elife=new float[EMBERS],emax=new float[EMBERS],esize=new float[EMBERS];
    private final Color[] ecolor=new Color[EMBERS];
    private int live;
    // dust (normalised screen space inside the backdrop)
    private final float[] dx=new float[DUST],dy=new float[DUST],dphase=new float[DUST],dsize=new float[DUST];
    private float time;
    private final Vector3 tmp=new Vector3();
    private final RandomXS128 random=new RandomXS128(7);

    public TableFx(){
        int n=64;Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float u=(x+.5f)/n*2-1,v=(y+.5f)/n*2-1,r=(float)Math.sqrt(u*u+v*v),a=MathUtils.clamp(1-r,0,1);p.drawPixel(x,y,Color.rgba8888(1,1,1,a*a*a));}
        dot=new Texture(p);dot.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();
        for(int i=0;i<EMBERS;i++)ecolor[i]=new Color();
        for(int i=0;i<DUST;i++){dx[i]=random.nextFloat();dy[i]=.25f+random.nextFloat()*.7f;dphase[i]=random.nextFloat()*MathUtils.PI2;dsize[i]=1.2f+random.nextFloat()*2.2f;}
    }
    /** Soft white dot shared with the HUD (glows, spotlight). */
    public Texture dot(){return dot;}
    public boolean active(){return live>0||smokeLive>0;}
    /** A few slow wisps of dark smoke rising from {@code at} (the dealer's slot after it destroys a pair). */
    public void smoke(Vector3 at,int count){for(int n=0;n<count;n++){int i=-1;for(int k=0;k<SMOKE;k++)if(mlife[k]<=0){i=k;break;}if(i<0)return;smokeLive++;
        mx[i]=at.x+(random.nextFloat()-.5f)*.5f;my[i]=at.y+random.nextFloat()*.2f;mz[i]=at.z+random.nextFloat()*.2f;mvx[i]=(random.nextFloat()-.5f)*.4f;mmax[i]=mlife[i]=1.2f+random.nextFloat()*1.2f;msize[i]=14+random.nextFloat()*14;}}

    /** A short burst of embers rising from {@code at}; {@code hot} 0..1 shifts crimson toward gold. */
    public void burst(Vector3 at,int count,float spread,float hot){
        for(int n=0;n<count;n++){int i=findSlot();if(i<0)return;
            float a=random.nextFloat()*MathUtils.PI2,r=random.nextFloat()*spread;
            ex[i]=at.x+MathUtils.cos(a)*r;ey[i]=at.y+random.nextFloat()*.2f;ez[i]=at.z+MathUtils.sin(a)*r*.6f;
            evx[i]=MathUtils.cos(a)*(.3f+random.nextFloat()*.9f);evz[i]=MathUtils.sin(a)*(.2f+random.nextFloat()*.5f);evy[i]=1.2f+random.nextFloat()*2.4f;
            emax[i]=elife[i]=.7f+random.nextFloat()*1.1f;esize[i]=3+random.nextFloat()*7;
            float g=MathUtils.clamp(hot+random.nextFloat()*.35f,0,1);ecolor[i].set(1,.16f+.55f*g,.06f+.2f*g,1);}
    }
    private int findSlot(){for(int i=0;i<EMBERS;i++)if(elife[i]<=0){live++;return i;}return -1;}

    public void update(float dt){
        time+=dt;
        for(int i=0;i<EMBERS;i++){if(elife[i]<=0)continue;elife[i]-=dt;if(elife[i]<=0){live--;continue;}
            ex[i]+=evx[i]*dt;ey[i]+=evy[i]*dt;ez[i]+=evz[i]*dt;evy[i]-=.6f*dt;evx[i]*=1-dt*.8f;evz[i]*=1-dt*.8f;
            ex[i]+=MathUtils.sin(time*3+i)*.15f*dt;}
        for(int i=0;i<SMOKE;i++){if(mlife[i]<=0)continue;mlife[i]-=dt;if(mlife[i]<=0){smokeLive--;continue;}my[i]+=dt*(.55f+.3f*(1-mlife[i]/mmax[i]));mx[i]+=mvx[i]*dt+MathUtils.sin(time*1.7f+i)*.12f*dt;}
        for(int i=0;i<DUST;i++){dy[i]+=dt*.006f*(.4f+dsize[i]*.2f);dx[i]+=MathUtils.sin(time*.21f+dphase[i])*dt*.004f;if(dy[i]>1.02f){dy[i]=.22f;dx[i]=random.nextFloat();}}
    }
    /** Additive pass inside the letterbox {@code view}. */
    public void draw(SpriteBatch batch,Camera camera,Rectangle view,float dustAmount){
        for(int i=0;i<SMOKE;i++){if(mlife[i]<=0)continue;tmp.set(mx[i],my[i],mz[i]);camera.project(tmp,view.x,view.y,view.width,view.height);if(tmp.z>=1)continue;
            float k=mlife[i]/mmax[i],a=(k>.8f?(1-k)/.2f:k)*.32f,s=msize[i]*view.height/1080f*(1.6f-k);
            batch.setColor(.16f,.1f,.1f,a);batch.draw(dot,tmp.x-s,tmp.y-s,s*2,s*2);}
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        for(int i=0;i<DUST;i++){float tw=.5f+.5f*MathUtils.sin(time*.7f+dphase[i]),a=dustAmount*(.05f+.08f*tw),s=dsize[i]*view.height/1080f*2.4f;
            batch.setColor(.78f,.82f,1,a);batch.draw(dot,view.x+dx[i]*view.width-s,view.y+dy[i]*view.height-s,s*2,s*2);}
        for(int i=0;i<EMBERS;i++){if(elife[i]<=0)continue;tmp.set(ex[i],ey[i],ez[i]);camera.project(tmp,view.x,view.y,view.width,view.height);if(tmp.z>=1)continue;
            float k=elife[i]/emax[i],flick=.75f+.25f*MathUtils.sin(time*30+i*1.7f),s=esize[i]*view.height/1080f*(.6f+.4f*k);
            batch.setColor(ecolor[i].r,ecolor[i].g,ecolor[i].b,k*flick);batch.draw(dot,tmp.x-s,tmp.y-s,s*2,s*2);
            batch.setColor(ecolor[i].r,ecolor[i].g*.6f,ecolor[i].b*.5f,k*.25f);batch.draw(dot,tmp.x-s*3,tmp.y-s*3,s*6,s*6);}
        batch.setColor(Color.WHITE);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
    }
    public void clear(){for(int i=0;i<EMBERS;i++)elife[i]=0;live=0;for(int i=0;i<SMOKE;i++)mlife[i]=0;smokeLive=0;}
    @Override public void dispose(){dot.dispose();}
}
