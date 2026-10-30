package com.erni.finalanswer.lastcommand;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.math.Vector3;
import com.badlogic.gdx.scenes.scene2d.Actor;
import com.badlogic.gdx.utils.Disposable;
import java.util.function.IntSupplier;
/** Reused cosmetic sprites projected beside the CRT, never part of picking or validation. */
final class CommandMachineEffects extends Actor implements Disposable {
    private final Texture steam,pixel;private final PerspectiveCamera camera;private final IntSupplier score;private final Vector3 point=new Vector3();private float time;
    CommandMachineEffects(PerspectiveCamera camera,IntSupplier score){this.camera=camera;this.score=score;setTouchable(com.badlogic.gdx.scenes.scene2d.Touchable.disabled);Pixmap fog=new Pixmap(64,64,Pixmap.Format.RGBA8888);for(int y=0;y<64;y++)for(int x=0;x<64;x++){float distance=(float)Math.sqrt((x-32)*(x-32)+(y-32)*(y-32))/32;fog.setColor(.75f,.82f,.76f,Math.max(0,1-distance)*.45f);fog.drawPixel(x,y);}steam=new Texture(fog);fog.dispose();steam.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);Pixmap solid=new Pixmap(1,1,Pixmap.Format.RGBA8888);solid.setColor(Color.WHITE);solid.fill();pixel=new Texture(solid);solid.dispose();}
    @Override public void act(float delta){time+=Math.min(delta,.05f);}
    @Override public void draw(Batch batch,float parentAlpha){int stage=Math.min(3,score.getAsInt()/5);if(stage==0)return;for(int i=0;i<6;i++){float phase=(time/2.4f+i/3f)%1;point.set(i<3?-.31f:.31f,.66f+phase*.18f,-.04f);camera.project(point);float size=15+phase*50;batch.setColor(.76f,.82f,.75f,(1-phase)*.14f*Math.min(2,stage));batch.draw(steam,point.x-size/2,point.y-size/2,size,size);}if(stage>=2&&Math.sin(time*9)>.94)for(int i=0;i<16;i++){float phase=(time*5+i/16f)%1;point.set((i%2==0?-.26f:.26f)+(float)Math.sin(i*7.1)*phase*.04f,.67f-phase*phase*.09f,.03f);camera.project(point);batch.setColor(1,.7f,.3f,.8f);batch.draw(pixel,point.x,point.y,2,5);}if(stage>=3){point.set(.24f,.60f,.12f);camera.project(point);float alpha=.2f+.3f*(float)Math.max(0,Math.sin(time*4));batch.setColor(1,.15f,.08f,alpha);batch.draw(steam,point.x-12,point.y-12,24,24);}batch.setColor(Color.WHITE);}
    @Override public void dispose(){steam.dispose();pixel.dispose();}
}
