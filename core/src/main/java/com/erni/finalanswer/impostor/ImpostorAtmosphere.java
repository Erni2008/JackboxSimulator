package com.erni.finalanswer.impostor;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.scenes.scene2d.*;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.presentation.PhaseTransition;

/** Fixed dust pool at the room margins; one owned pixel per layer, allocated only once. */
public final class ImpostorAtmosphere extends Actor implements Disposable {
    private final Texture pixel;
    private final float[] x=new float[22],y=new float[22];
    private float time;
    private boolean reduced;
    private final PhaseTransition transition;
    private final boolean foreground;
    public ImpostorAtmosphere(PhaseTransition transition,boolean foreground){
        this.transition=transition;this.foreground=foreground;
        Pixmap map=new Pixmap(1,1,Pixmap.Format.RGBA8888);map.setColor(Color.WHITE);map.fill();pixel=new Texture(map);map.dispose();
        setBounds(0,0,1920,1080);setTouchable(Touchable.disabled);setName(foreground?"cinematicVeil":"ambientDust");
        for(int i=0;i<x.length;i++){x[i]=18+(i*71)%110;y[i]=(i*137)%1080;}
    }
    public void update(float delta,boolean reduced){this.reduced=reduced;if(!reduced&&Float.isFinite(delta))time=(time+Math.max(0,delta))%200;}
    @Override public void draw(Batch batch,float alpha){
        Color old=batch.getColor();float r=old.r,g=old.g,b=old.b,a=old.a;
        if(foreground){float opacity=transition.opacity();if(opacity>0){batch.setColor(.025f,.004f,.012f,opacity*alpha);batch.draw(pixel,0,0,1920,1080);}}
        else if(!reduced)for(int i=0;i<x.length;i++){
            batch.setColor(.77f,.64f,.48f,(.06f+.035f*(float)Math.sin(time*.5+i))*alpha);
            batch.draw(pixel,x[i]+(float)Math.sin(time*.12+i)*8,(y[i]+time*(2+i%3))%1080,1.5f+i%2,1.5f+i%2);
        }
        batch.setColor(r,g,b,a);
    }
    @Override public void dispose(){pixel.dispose();}
}
