package com.erni.finalanswer.systembreach.host;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.ui.UiFonts;
import java.util.HashMap;
import java.util.Map;

/** Loaded once per screen: the supplied background, a soft glow sprite and the cached fonts. */
final class SystemBreachHostAssets implements Disposable {
    final Texture background,glow,pixel;
    /** Latin terminal faces (Rajdhani) for labels/digits; Noto SemiCondensed for anything containing a nickname. */
    final BitmapFont title,digits,label,labelSmall,status,ap,name,log,board,boardAp,crest;
    private final Map<String,Texture> portraits=new HashMap<>();

    SystemBreachHostAssets(){
        background=new Texture(Gdx.files.internal("system_breach/background.png"),true);
        background.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);
        Pixmap g=new Pixmap(128,128,Pixmap.Format.RGBA8888);
        for(int y=0;y<128;y++)for(int x=0;x<128;x++){float dx=(x-63.5f)/63.5f,dy=(y-63.5f)/63.5f;float d=Math.min(1,(float)Math.sqrt(dx*dx+dy*dy));float a=(1-d)*(1-d);g.drawPixel(x,y,Color.rgba8888(1,1,1,a));}
        glow=new Texture(g);glow.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);g.dispose();
        Pixmap p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();pixel=new Texture(p);p.dispose();
        title=font("Rajdhani-Bold.ttf",92,false);digits=font("Rajdhani-Bold.ttf",104,false);
        label=font("Rajdhani-SemiBold.ttf",32,false);labelSmall=font("Rajdhani-SemiBold.ttf",21,false);
        status=font("Rajdhani-Bold.ttf",27,false);ap=font("Rajdhani-Bold.ttf",33,false);
        name=font("NotoSans-SemiCondensedSemiBold.ttf",25,true);log=font("NotoSans-SemiCondensedSemiBold.ttf",21,true);
        board=font("NotoSans-SemiCondensedSemiBold.ttf",30,true);boardAp=font("Rajdhani-Bold.ttf",34,false);
        crest=UiFonts.gothic(46);
    }

    /** Portrait fallback when the room's animated characters are unavailable (never in a real room). */
    Texture portrait(String characterId){
        return portraits.computeIfAbsent(characterId,id->{var f=Gdx.files.internal("forgotten_room/portraits/"+id+".png");
            if(!f.exists())return null;Texture t=new Texture(f,true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);return t;});
    }

    private static BitmapFont font(String file,int size,boolean cyrillic){
        var generator=new FreeTypeFontGenerator(Gdx.files.internal("ui/fonts/"+file));
        try{
            var p=new FreeTypeFontGenerator.FreeTypeFontParameter();p.size=size;p.kerning=true;
            StringBuilder chars=new StringBuilder(FreeTypeFontGenerator.DEFAULT_CHARS);
            if(cyrillic)for(char c='Ѐ';c<='ӿ';c++)chars.append(c);
            p.characters=chars.append("–—…·").toString();
            p.minFilter=Texture.TextureFilter.Linear;p.magFilter=Texture.TextureFilter.Linear;
            return generator.generateFont(p);
        }finally{generator.dispose();}
    }

    @Override public void dispose(){
        background.dispose();glow.dispose();pixel.dispose();
        for(var f:new BitmapFont[]{title,digits,label,labelSmall,status,ap,name,log,board,boardAp,crest})f.dispose();
        for(var t:portraits.values())if(t!=null)t.dispose();
    }
}
