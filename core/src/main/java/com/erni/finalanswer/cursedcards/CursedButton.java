package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.utils.Disposable;

/**
 * Button following the project's three-PNG convention ({@code ui/buttons/<id>/<id>_up|_hover|_pressed.png}). When the art
 * is missing it draws only its label (gold, hover brightening, pressed nudge) — no placeholder rectangles — so final
 * artwork drops in without code changes.
 */
public final class CursedButton implements Disposable {
    public final String id,label;
    public final Rectangle bounds=new Rectangle();
    private final Texture up,hover,pressed;
    private float hot,press;public boolean enabled=true,on;
    private static final GlyphLayout layout=new GlyphLayout();

    public CursedButton(String id,String label){this.id=id;this.label=label;up=load(id,"up");hover=load(id,"hover");pressed=load(id,"pressed");}
    private static Texture load(String id,String state){var f=Gdx.files.internal("ui/buttons/"+id+"/"+id+"_"+state+".png");if(!f.exists())return null;var t=new Texture(f,true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);return t;}
    public boolean hasArt(){return up!=null;}
    public boolean contains(float x,float y){return enabled&&bounds.contains(x,y);}
    public void update(float dt,boolean over,boolean down){hot+=((over&&enabled?1:0)-hot)*Math.min(1,dt*12);press+=((down&&over&&enabled?1:0)-press)*Math.min(1,dt*20);}
    public void draw(SpriteBatch batch,BitmapFont font){
        float a=enabled?1:.35f;
        if(up!=null){Texture t=press>.5f&&pressed!=null?pressed:hot>.5f&&hover!=null?hover:up;batch.setColor(1,1,1,a);batch.draw(t,bounds.x,bounds.y+(press>.5f?-1:0),bounds.width,bounds.height);batch.setColor(Color.WHITE);return;}
        layout.setText(font,label);float lift=hot*1.5f-press*1.5f;
        float r=on?1:.86f+.14f*hot,g=on?.62f:.70f+.16f*hot,b=on?.36f:.46f+.12f*hot;
        font.setColor(0,0,0,.6f*a);font.draw(batch,label,bounds.x+(bounds.width-layout.width)*.5f+1.5f,bounds.y+(bounds.height+layout.height)*.5f+lift-1.5f);
        font.setColor(r,g,b,a);font.draw(batch,label,bounds.x+(bounds.width-layout.width)*.5f,bounds.y+(bounds.height+layout.height)*.5f+lift);
    }
    @Override public void dispose(){if(up!=null)up.dispose();if(hover!=null)hover.dispose();if(pressed!=null)pressed.dispose();}
}
