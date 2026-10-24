package com.erni.finalanswer.impostor;

import com.badlogic.gdx.scenes.scene2d.*;
import com.badlogic.gdx.scenes.scene2d.ui.Image;
import java.util.*;

/** Four borrowed card backs, reused across matches; no role or word is ever drawn. */
final class RoleDeal extends Group {
    private final Image[] cards=new Image[8];
    private List<ImpostorParticipantView> destinations=List.of();
    private float age;
    RoleDeal(ImpostorAssets assets){
        setName("impostorRoleDeal");setTouchable(Touchable.disabled);setVisible(false);
        assets.texture(ImpostorAsset.PAPER_BACK).ifPresent(texture->{for(int i=0;i<cards.length;i++){cards[i]=new Image(texture);cards[i].setSize(120,150);cards[i].setOrigin(60,75);addActor(cards[i]);}});
    }
    void start(List<ImpostorParticipantView> views){
        cancel();destinations=List.copyOf(views);age=0;setVisible(!views.isEmpty());
        for(int i=0;i<cards.length;i++){if(cards[i]!=null)cards[i].setVisible(i<views.size());if(i<views.size())views.get(i).findActor("paper").setVisible(false);}
    }
    void update(float delta,boolean reduced){
        if(!isVisible())return;if(Float.isFinite(delta))age+=Math.max(0,delta);
        if(reduced||age>=Math.max(1.25f,.8f+.14f*(destinations.size()-1))){cancel();return;}
        for(int i=0;i<destinations.size();i++){
            var view=destinations.get(i);float t=Math.max(0,Math.min(1,(age-i*.14f)/.8f)),ease=1-(float)Math.pow(1-t,3);
            Image card=cards[i];view.findActor("paper").setVisible(t>=1);
            if(card==null)continue;card.setVisible(t<1);
            float x=view.getX()+view.getScaleX()*225,y=view.getY()+view.getScaleY()*50;
            card.setPosition(900+(x-900)*ease,160+(y-160)*ease+(float)Math.sin(t*Math.PI)*95);
            card.setRotation((i-1.5f)*9*(1-ease));card.setScale(.8f+.2f*ease);card.getColor().a=Math.min(1,t*8);
        }
    }
    void cancel(){for(var view:destinations){Actor paper=view.findActor("paper");if(paper!=null)paper.setVisible(true);}destinations=List.of();setVisible(false);}
}
