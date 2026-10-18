package com.erni.finalanswer.ui.lobby;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.scenes.scene2d.*;
import com.badlogic.gdx.scenes.scene2d.ui.*;
import com.badlogic.gdx.scenes.scene2d.utils.*;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.network.HostingAccess;
import com.google.zxing.*;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import java.util.*;

/** Compact lobby addition. QR is generated locally and contains no identity/password/token. */
public final class ConnectionPanel extends Table implements Disposable {
    private final HostingAccess hosting;
    private final Image qr=new Image();
    private final Label address,details;
    private final TextButton choose;
    private Texture texture;
    private String room="",url="";
    private int selected;
    private float elapsed;
    private java.util.List<HostingAccess.Address> choices=java.util.List.of();
    public ConnectionPanel(HostingAccess hosting,BitmapFont font,TextButton.TextButtonStyle style){
        this.hosting=hosting;setName("connectionPanel");
        address=new Label("",new Label.LabelStyle(font,Color.valueOf("F0DCC2")));address.setFontScale(.58f);address.setWrap(true);address.setName("phoneConnectionUrl");
        details=new Label("",new Label.LabelStyle(font,Color.valueOf("BFA9A4")));details.setFontScale(.48f);details.setWrap(true);
        choose=new TextButton("NETWORK / REFRESH",style);choose.getLabel().setFontScale(.55f);choose.setName("chooseNetwork");
        choose.addListener(new ClickListener(){public void clicked(InputEvent e,float x,float y){hosting.refresh();if(!choices.isEmpty())selected=(selected+1)%choices.size();refresh();}});
        add(qr).size(126).padRight(14);
        Table text=new Table();text.add(address).growX().height(34).row();text.add(details).growX().height(62).row();text.add(choose).left().width(270).height(34);add(text).growX();
    }
    public void room(String code){if(!room.equals(code)){room=code;refresh();}}
    @Override public void act(float delta){super.act(delta);elapsed+=Math.max(0,delta);if(elapsed>=1){elapsed=0;refresh();}}
    private void refresh(){
        choices=hosting.addresses();if(selected>=choices.size())selected=0;
        String base=choices.isEmpty()?"":choices.get(selected).url();
        if(!base.isEmpty())hosting.select(base);
        String next=base.isEmpty()?"":base.replaceAll("/+$","")+"/?room="+room;
        address.setText(next.isEmpty()?"PHONE CONNECTION NOT AVAILABLE":next);
        details.setText((choices.isEmpty()?"":choices.get(selected).label()+" ["+(selected+1)+"/"+choices.size()+"]\n")+hosting.diagnostics());
        if(next.equals(url))return;url=next;qr.setDrawable(null);if(texture!=null){texture.dispose();texture=null;}
        if(next.isEmpty())return;
        try{
            var matrix=com.erni.finalanswer.network.ConnectionQr.encode(next,252);
            Pixmap pixels=new Pixmap(252,252,Pixmap.Format.RGBA8888);
            try{for(int y=0;y<252;y++)for(int x=0;x<252;x++)pixels.drawPixel(x,y,matrix.get(x,y)?0x000000ff:0xffffffff);texture=new Texture(pixels);}finally{pixels.dispose();}
            texture.setFilter(Texture.TextureFilter.Nearest,Texture.TextureFilter.Nearest);qr.setDrawable(new TextureRegionDrawable(texture));
        }catch(Exception invalid){details.setText("QR unavailable. Enter the displayed URL and room code manually.");}
    }
    public String connectionUrl(){return url;}
    @Override public void dispose(){if(texture!=null){texture.dispose();texture=null;}}
}
