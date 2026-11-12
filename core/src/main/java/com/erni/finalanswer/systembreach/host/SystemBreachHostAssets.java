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
    final BitmapFont heading,icon,iconSmall,iconTiny,iconBig,title,digits,hex,label,labelSmall,status,ap,name,log,board,boardAp,crest;
    private final Map<String,Texture> portraits=new HashMap<>();

    SystemBreachHostAssets(boolean ru){
        background=new Texture(Gdx.files.internal("system_breach/background.png"),true);
        background.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);
        Pixmap g=new Pixmap(128,128,Pixmap.Format.RGBA8888);
        for(int y=0;y<128;y++)for(int x=0;x<128;x++){float dx=(x-63.5f)/63.5f,dy=(y-63.5f)/63.5f;float d=Math.min(1,(float)Math.sqrt(dx*dx+dy*dy));float a=(1-d)*(1-d);g.drawPixel(x,y,Color.rgba8888(1,1,1,a));}
        glow=new Texture(g);glow.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);g.dispose();
        Pixmap p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();pixel=new Texture(p);p.dispose();
        title=font("Rajdhani-Bold.ttf",92,false);digits=font("Rajdhani-Bold.ttf",88,false);hex=font("Rajdhani-Medium.ttf",17,false);
        String ui=ru?"RussoOne-Regular.ttf":"Rajdhani-SemiBold.ttf",uiBold=ru?"RussoOne-Regular.ttf":"Rajdhani-Bold.ttf";
        label=font(ui,ru?23:28,ru);labelSmall=font(ui,ru?15:21,ru);heading=font(uiBold,ru?40:47,ru);
        status=font(uiBold,ru?19:25,ru);ap=font("Rajdhani-Bold.ttf",30,false);
        name=font("NotoSans-SemiCondensedSemiBold.ttf",23,true);log=font("NotoSans-SemiCondensedSemiBold.ttf",19,true);
        board=font("NotoSans-SemiCondensedSemiBold.ttf",26,true);boardAp=font("Rajdhani-Bold.ttf",30,false);
        crest=UiFonts.gothic(46);
        icon=icons(44);iconSmall=icons(26);iconTiny=icons(18);iconBig=icons(54);
    }

    /** Portrait fallback when the room's animated characters are unavailable (never in a real room). */
    Texture portrait(String characterId){
        return portraits.computeIfAbsent(characterId,id->{var f=Gdx.files.internal("forgotten_room/portraits/"+id+".png");
            if(!f.exists())return null;Texture t=new Texture(f,true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);return t;});
    }

    /** Material Icons glyphs only (Apache 2.0). */
    private static BitmapFont icons(int size){
        var generator=new FreeTypeFontGenerator(Gdx.files.internal("ui/fonts/MaterialIcons-Regular.ttf"));
        try{var p=new FreeTypeFontGenerator.FreeTypeFontParameter();p.size=size;p.characters=SbIcons.ALL;
            p.minFilter=Texture.TextureFilter.Linear;p.magFilter=Texture.TextureFilter.Linear;var data=new FreeTypeFontGenerator.FreeTypeBitmapFontData();data.xChars=new char[]{SbIcons.ONLINE};data.capChars=new char[]{SbIcons.ONLINE};return generator.generateFont(p,data);}
        finally{generator.dispose();}
    }
    private static BitmapFont font(String file,int size,boolean cyrillic){
        var generator=new FreeTypeFontGenerator(Gdx.files.internal("ui/fonts/"+file));
        try{
            var p=new FreeTypeFontGenerator.FreeTypeFontParameter();p.size=size;p.kerning=true;
            StringBuilder chars=new StringBuilder(FreeTypeFontGenerator.DEFAULT_CHARS);
            if(cyrillic)for(char c='Ѐ';c<='ӿ';c++)chars.append(c);
            p.characters=chars.append("–—…·×№").toString();
            p.minFilter=Texture.TextureFilter.Linear;p.magFilter=Texture.TextureFilter.Linear;
            return generator.generateFont(p);
        }finally{generator.dispose();}
    }

    @Override public void dispose(){
        background.dispose();glow.dispose();pixel.dispose();
        for(var f:new BitmapFont[]{heading,icon,iconSmall,iconTiny,iconBig,title,digits,hex,label,labelSmall,status,ap,name,log,board,boardAp,crest})f.dispose();
        for(var t:portraits.values())if(t!=null)t.dispose();
    }
}
