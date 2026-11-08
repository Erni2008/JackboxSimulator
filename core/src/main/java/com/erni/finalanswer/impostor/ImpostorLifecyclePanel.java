package com.erni.finalanswer.impostor;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.scenes.scene2d.*;
import com.badlogic.gdx.scenes.scene2d.ui.*;
import com.badlogic.gdx.scenes.scene2d.utils.*;
import com.badlogic.gdx.utils.*;
import com.erni.finalanswer.gameplay.impostor.ImpostorMatchResult;
import com.erni.finalanswer.rooms.RoomSession;
import java.util.*;
import java.util.function.*;

/** Screen-owned results and host actions. Reuses assets/fonts; owns only one programmatic UI pixel. */
public final class ImpostorLifecyclePanel extends Group implements Disposable {
    private final Texture pixel;
    private final TextureRegionDrawable solid;
    private final BitmapFont font;
    private final BitmapFont headingFont=com.erni.finalanswer.ui.UiFonts.question(84),bodyFont=markup(com.erni.finalanswer.ui.UiFonts.body(28));
    private static BitmapFont markup(BitmapFont f){f.getData().markupEnabled=true;return f;}
    private final Texture frame;
    private final ImpostorAssets assets;
    private final Function<RoomSession.Player,Actor> avatars;
    private final Group results=new Group(),controls=new Group();
    private final Label message;
    private final Map<String,CheckBox> choices=new LinkedHashMap<>();
    private final TextButton replay,lobby,start;
    private String match="",waitingKey="";
    private final Consumer<String> action;
    private float fade;
    private boolean busy,waiting,replayReady;
    private String defaultStatus="";
    public ImpostorLifecyclePanel(ImpostorAssets assets,BitmapFont font,Function<RoomSession.Player,Actor> avatars,Consumer<String> action){
        this.assets=assets;this.font=font;this.avatars=avatars;this.action=action;
        Pixmap p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();pixel=new Texture(p);p.dispose();solid=new TextureRegionDrawable(pixel);
        Pixmap f=new Pixmap(8,8,Pixmap.Format.RGBA8888);f.setColor(Color.WHITE);f.fill();f.setBlending(Pixmap.Blending.None);f.setColor(new Color(1,1,1,0));f.fillRectangle(2,2,4,4);frame=new Texture(f);f.dispose();
        setName("impostorLifecycle");setBounds(80,45,1420,990);setVisible(false);
        addActor(results);controls.setName("impostorHostControls");addActor(controls);
        replay=button("ЕЩЁ РАЗ","impostorReplay",()->action.accept("REPLAY_IMPOSTOR"));replay.setBounds(300,12,300,58);controls.addActor(replay);
        lobby=button("В КОМНАТУ","impostorReturnLobby",()->action.accept("IMPOSTOR_RETURN_TO_LOBBY"));lobby.setBounds(640,12,400,58);controls.addActor(lobby);
        start=button("НАЧАТЬ ИГРУ","impostorStart",()->action.accept("START_IMPOSTOR"));start.setBounds(920,80,350,64);controls.addActor(start);
        message=text("",Color.valueOf("D7B88D"),.8f,100,76,1200,55);message.setName("impostorActionStatus");addActor(message);
    }
    private Label text(String value,Color color,float scale,float x,float y,float w,float h){Label label=new Label(value,new Label.LabelStyle(font,color));label.setFontScale(scale);label.setBounds(x,y,w,h);label.setAlignment(Align.center);label.setWrap(true);label.setTouchable(Touchable.disabled);return label;}
    private void scroll(Label label){
        float x=label.getX(),y=label.getY(),w=label.getWidth(),h=label.getHeight();
        Table content=new Table();content.top().left();content.add(label).width(w-18).growX();
        ScrollPane pane=new ScrollPane(content);pane.setName(label.getName()+"Scroll");pane.setBounds(x,y,w,h);
        pane.setScrollingDisabled(true,false);pane.setFadeScrollBars(false);pane.setOverscroll(false,false);results.addActor(pane);
    }
    private com.badlogic.gdx.scenes.scene2d.utils.Drawable framed(String fillHex,String lineHex){
        var patch=new NinePatchDrawable(new com.badlogic.gdx.graphics.g2d.NinePatch(frame,2,2,2,2));patch.getPatch().setColor(Color.valueOf(lineHex));
        var base=solid.tint(Color.valueOf(fillHex));
        return new BaseDrawable(){@Override public void draw(com.badlogic.gdx.graphics.g2d.Batch b,float x,float y,float w,float h){base.draw(b,x,y,w,h);patch.draw(b,x,y,w,h);}};
    }
    private TextButton button(String value,String name,Runnable run){var style=new TextButton.TextButtonStyle();style.font=font;style.fontColor=Color.valueOf("F0E4D1");style.disabledFontColor=Color.GRAY;
        style.up=framed("3A1A20","B8955F");style.over=framed("5E2428","E2BE82");style.down=framed("8E3330","F1D29C");style.disabled=framed("241B1E","5A4A3C");style.overFontColor=Color.valueOf("FFF3DC");
        TextButton button=new TextButton(value,style);button.setName(name);button.addListener(new ClickListener(){@Override public void clicked(InputEvent e,float x,float y){if(!button.isDisabled())run.run();}});return button;}
    public void result(ImpostorMatchResult result,java.util.List<ImpostorParticipant> roster,boolean host){
        setVisible(true);waiting=false;choices.clear();waitingKey="";start.setVisible(false);replay.setVisible(host);lobby.setVisible(host);
        if(match.equals(result.matchId()))return;match=result.matchId();fade=0;results.clearChildren();
        String outcome=result.outcome();boolean escaped=outcome.equals("IMPOSTOR_ESCAPED"),split=outcome.equals("NO_CONSENSUS");
        Color accent=Color.valueOf(escaped?"C23A44":split?"B89A6E":"D9B377");
        // stage: deep shade, a warm band behind the verdict, hairlines top and bottom
        results.addActor(fill(new Color(.03f,.016f,.022f,.988f),0,0,1420,990));
        results.addActor(fill(new Color(accent.r,accent.g,accent.b,.07f),0,790,1420,200));
        results.addActor(fill(new Color(accent.r,accent.g,accent.b,.035f),0,850,1420,140));
        results.addActor(fill(accent.cpy().mul(1,1,1,.8f),0,987,1420,3));results.addActor(fill(accent.cpy().mul(1,1,1,.35f),0,0,1420,2));
        results.addActor(text("И Т О Г   И Г Р Ы",Color.valueOf("A8957C"),.72f,50,935,1320,36));
        String title=switch(outcome){case "IMPOSTOR_ESCAPED"->"ИМПОСТОР СКРЫЛСЯ";case "NO_CONSENSUS"->"НЕТ ЕДИНОГО РЕШЕНИЯ";default->"ИМПОСТОР РАСКРЫТ";};
        Label shadow=new Label(title,new Label.LabelStyle(headingFont,new Color(0,0,0,.75f)));shadow.setAlignment(Align.center);shadow.setBounds(54,836,1320,100);shadow.setTouchable(Touchable.disabled);results.addActor(shadow);
        Label heading=new Label(title,new Label.LabelStyle(headingFont,escaped?Color.valueOf("D8434C"):Color.valueOf("EEDCB8")));heading.setAlignment(Align.center);heading.setBounds(50,840,1320,100);heading.setTouchable(Touchable.disabled);heading.setName("impostorResultTitle");results.addActor(heading);
        float fit=Math.min(1,1260/Math.max(1,heading.getPrefWidth()));heading.setFontScale(fit);shadow.setFontScale(fit);
        Map<String,RoomSession.Player> players=new LinkedHashMap<>();for(var p:roster)players.put(p.player().id(),p.player());
        boolean impostorWon=result.winningSide().name().equals("IMPOSTOR");
        results.addActor(rich("Импостор — "+esc(name(players,result.impostorId()))+"   ·   "+(impostorWon?"Победил импостор":"Победили мирные"),impostorWon?"E58E86":"D9B98C",1f,70,790,1280,46));
        // ornament: two rules and a diamond
        results.addActor(fill(accent.cpy().mul(1,1,1,.5f),410,768,260,1));results.addActor(fill(accent.cpy().mul(1,1,1,.5f),750,768,260,1));
        Image gem=fill(accent,0,0,10,10);gem.setOrigin(5,5);gem.setRotation(45);gem.setPosition(705,763);results.addActor(gem);
        // suspects
        float width=222,height=222f*1353/1162,gap=36,left=(1420-roster.size()*width-(roster.size()-1)*gap)/2;
        for(int i=0;i<roster.size();i++){
            var player=roster.get(i).player();var status=result.participant(player.id());if(status==null)continue;
            Group card=new Group();card.setName("resultParticipant:"+player.id());card.setBounds(left+i*(width+gap),452,width,height);card.setOrigin(width/2,height/2);
            boolean impostor=player.id().equals(result.impostorId());
            card.addActor(fill(new Color(0,0,0,.55f),8,-10,width,height));
            if(impostor){card.setScale(1.06f);card.setRotation(-1.5f);
                card.addActor(fill(new Color(.8f,.2f,.22f,.28f),-10,-10,width+20,height+20));
                for(float[] edge:new float[][]{{-4,-4,width+8,4},{-4,height,width+8,4},{-4,0,4,height},{width,0,4,height}})card.addActor(fill(Color.valueOf("C7434A"),edge[0],edge[1],edge[2],edge[3]));}
            assets.texture(ImpostorAsset.SUSPECT_PAPER).ifPresent(t->{Image paper=new Image(t);paper.setSize(width,height);paper.setColor(impostor?Color.valueOf("FFD9BC"):Color.WHITE);card.addActor(paper);});
            Actor avatar=avatars.apply(player);if(avatar!=null && avatar.getWidth()>0 && avatar.getHeight()>0){Group box=new Group();float scale=Math.min(96/avatar.getWidth(),70/avatar.getHeight());box.setPosition(width/2-avatar.getWidth()*scale/2,148);box.setScale(scale);avatar.setPosition(0,0);box.addActor(avatar);card.addActor(box);}
            Label nickname=new Label(esc(player.name()),new Label.LabelStyle(bodyFont,Color.valueOf("2E1B12")));nickname.setAlignment(Align.center);nickname.setFontScale(.95f);nickname.setBounds(26,196,width-52,40);nickname.setEllipsis("...");nickname.setTouchable(Touchable.disabled);card.addActor(nickname);
            Label role=new Label(status.role().equals("IMPOSTOR")?"ИМПОСТОР":"МИРНЫЙ",new Label.LabelStyle(bodyFont,Color.valueOf(impostor?"8E1B28":"4A3020")));role.setAlignment(Align.center);role.setFontScale(.82f);role.setBounds(22,112,width-44,34);role.setTouchable(Touchable.disabled);card.addActor(role);
            Label win=new Label(status.winner()?"ПОБЕДА":"ПОРАЖЕНИЕ",new Label.LabelStyle(bodyFont,Color.valueOf(status.winner()?"3D5A2A":"7A2A24")));win.setAlignment(Align.center);win.setFontScale(.66f);win.setBounds(22,84,width-44,28);win.setTouchable(Touchable.disabled);card.addActor(win);
            for(int n=0;n<status.votesReceived();n++){final int slot=n,count=status.votesReceived();assets.texture(ImpostorAsset.STAMP_MARK).ifPresent(t->{Image mark=new Image(t);mark.setName("resultStamp:"+player.id()+":"+slot);float size=Math.min(40,(width-60)/Math.max(1,count)-6);mark.setBounds(width/2-(count*(size+6)-6)/2+slot*(size+6),30,size,size*t.getHeight()/t.getWidth());mark.setColor(.62f,.14f,.17f,.95f);card.addActor(mark);});}
            results.addActor(card);
        }
        // three dossier columns
        var st=result.statistics();
        column("СТАТИСТИКА",40);column("КТО ЗА КОГО ГОЛОСОВАЛ",495);column("ПОДСКАЗКИ ПО РАУНДАМ",950);
        Label keys=body("Участники\nРаунды\nСлова\nГолосов принято\nВоздержались\nБольше всего голосов","A8957C",.76f,62,160,250,205);keys.setAlignment(Align.topLeft);keys.setName("impostorStatistics");results.addActor(keys);
        Label values=body(st.activeParticipants()+"\n"+st.completedRounds()+"\n"+st.submittedClues()+"\n"+st.validVotes()+"\n"+st.abstentions()+"\n"+esc(names(players,result.mostVoted())),"F0E2C8",.76f,250,160,198,205);values.setAlignment(Align.topRight);values.setWrap(false);values.setEllipsis(true);results.addActor(values);
        StringBuilder history=new StringBuilder();for(var entry:result.ballots().entrySet())history.append(shortName(name(players,entry.getKey())).replace("[","[[")).append("  [#B8955F]—[]  ").append(shortName(name(players,entry.getValue())).replace("[","[[")).append('\n');
        history.append("\nВоздержались: ").append(result.abstentions().isEmpty()?"нет":esc(names(players,result.abstentions())));
        Label votes=body(history.toString(),"F0E2C8",.76f,517,160,388,205);votes.setAlignment(Align.topLeft);votes.setName("impostorVotingHistory");scroll(votes);
        StringBuilder rounds=new StringBuilder();for(var player:roster){rounds.append("[#C9A86E]").append(shortName(player.player().name()).replace("[","[[")).append("[]   ");for(int r=0;r<result.clueRounds().size();r++){if(r>0)rounds.append("  ·  ");rounds.append(result.clueRounds().get(r).getOrDefault(player.player().id(),"—"));}rounds.append('\n');}
        Label clues=body(rounds.toString(),"F0E2C8",.66f,972,160,398,205);clues.setAlignment(Align.topLeft);clues.setName("impostorRoundSummary");scroll(clues);
        defaultStatus=host?"Игра завершена. Можно сыграть ещё раз или вернуться в комнату.":"Ожидаем ведущего…";message.setText(defaultStatus);
    }
    private Image fill(Color color,float x,float y,float w,float h){Image image=new Image(solid.tint(color));image.setBounds(x,y,w,h);image.setTouchable(Touchable.disabled);return image;}
    private Label rich(String value,String color,float scale,float x,float y,float w,float h){Label label=new Label(value,new Label.LabelStyle(bodyFont,Color.valueOf(color)));label.setFontScale(scale);label.setBounds(x,y,w,h);label.setAlignment(Align.center);label.setTouchable(Touchable.disabled);return label;}
    private Label body(String value,String color,float scale,float x,float y,float w,float h){Label label=rich(value,color,scale,x,y,w,h);label.setWrap(true);return label;}
    private void column(String title,float x){
        results.addActor(fill(new Color(1,.92f,.8f,.035f),x,150,430,270));results.addActor(fill(Color.valueOf("B8955F"),x,418,430,2));
        Label head=rich(title,"C9A86E",.66f,x+22,376,386,34);head.setAlignment(Align.left);results.addActor(head);
        results.addActor(fill(new Color(.85f,.7f,.45f,.18f),x+22,372,386,1));
    }
    private static String esc(String v){return v.replace("[","[[");}
    private static String shortName(String name){return name.codePointCount(0,name.length())>13?name.substring(0,name.offsetByCodePoints(0,10))+"...":name;}
    private static String name(Map<String,RoomSession.Player> players,String id){var p=players.get(id);return p==null?"—":p.name();}
    private static String names(Map<String,RoomSession.Player> players,java.util.List<String> ids){return String.join(", ",ids.stream().map(id->shortName(name(players,id))).toList());}
    public void waiting(String key,java.util.List<RoomSession.Player> players,java.util.List<String> active,boolean host,boolean replayReady){
        setVisible(true);waiting=true;this.replayReady=replayReady;match="";results.clearChildren();replay.setVisible(false);lobby.setVisible(false);start.setVisible(host);
        if(!key.equals(waitingKey)){
            waitingKey=key;choices.clear();// choices are rebuilt on authoritative player changes
        }
        for(Actor actor:controls.getChildren().toArray(Actor.class))if(actor instanceof CheckBox)actor.remove();
        var previous=new LinkedHashMap<>(choices);choices.clear();
        for(int i=0;i<players.size();i++){
            var player=players.get(i);var style=new CheckBox.CheckBoxStyle();style.font=font;style.fontColor=Color.valueOf("E0D2BF");style.checkboxOff=solid.tint(Color.valueOf("55434A"));style.checkboxOn=solid.tint(Color.valueOf("B54743"));style.checkboxOff.setMinSize(24,24);style.checkboxOn.setMinSize(24,24);
            CheckBox box=new CheckBox(shortName(player.name())+"  "+(player.connectionStatus().equals("ONLINE")?"в сети":"нет связи"),style);box.setName("impostorSelect:"+player.id());box.setBounds(920,650-i*55,450,48);
            box.setChecked(previous.containsKey(player.id())?previous.get(player.id()).isChecked():active.contains(player.id()));box.setDisabled(replayReady||!host);choices.put(player.id(),box);box.addListener(new ChangeListener(){public void changed(ChangeEvent e,Actor a){refreshSelection();}});controls.addActor(box);
        }
        defaultStatus=replayReady?"Реванш готов. Ожидаем ведущего…":"Выберите 3 или 4 игроков. Остальные станут зрителями.";
        refreshSelection();
    }
    public java.util.List<String> selected(){return choices.entrySet().stream().filter(e->e.getValue().isChecked()).map(Map.Entry::getKey).toList();}
    private void refreshSelection(){
        int count=selected().size();start.setText("НАЧАТЬ ИГРУ · "+count+"/4");
        start.setDisabled(busy||waiting&&!replayReady&&(count<3||count>4));
        if(!busy&&waiting)message.setText(replayReady?defaultStatus:"Выбрано: "+count+". Для игры нужны 3 или 4 участника.");
    }
    public void status(String status,boolean busy){this.busy=busy;replay.setDisabled(busy);lobby.setDisabled(busy);refreshSelection();if(!status.isEmpty())message.setText(status);else if(!waiting)message.setText(defaultStatus);}
    public void hidePanel(){setVisible(false);match="";waitingKey="";results.clearChildren();choices.clear();for(Actor actor:controls.getChildren().toArray(Actor.class))if(actor instanceof CheckBox)actor.remove();}
    public void update(float delta,boolean reducedMotion){if(!isVisible())return;fade=reducedMotion?1:Math.min(1,fade+Math.max(0,delta)/.5f);results.getColor().a=fade;results.setOrigin(710,495);results.setScale(reducedMotion?1:.995f+.005f*fade);
        Label title=results.findActor("impostorResultTitle");if(title!=null){title.setOrigin(title.getWidth()/2,title.getHeight()/2);title.setScale(reducedMotion?1:.985f+.015f*fade);}
    }
    @Override public void dispose(){pixel.dispose();frame.dispose();headingFont.dispose();bodyFont.dispose();}
}
