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
    private TextButton button(String value,String name,Runnable run){var style=new TextButton.TextButtonStyle();style.font=font;style.fontColor=Color.valueOf("F0E4D1");style.disabledFontColor=Color.GRAY;
        style.up=solid.tint(Color.valueOf("492029"));style.over=solid.tint(Color.valueOf("78312E"));style.down=solid.tint(Color.valueOf("A13D32"));style.disabled=solid.tint(Color.valueOf("302529"));
        TextButton button=new TextButton(value,style);button.setName(name);button.addListener(new ClickListener(){@Override public void clicked(InputEvent e,float x,float y){if(!button.isDisabled())run.run();}});return button;}
    public void result(ImpostorMatchResult result,java.util.List<ImpostorParticipant> roster,boolean host){
        setVisible(true);waiting=false;choices.clear();waitingKey="";start.setVisible(false);replay.setVisible(host);lobby.setVisible(host);
        if(match.equals(result.matchId()))return;match=result.matchId();fade=0;results.clearChildren();
        Image shade=new Image(solid.tint(new Color(.035f,.018f,.025f,.94f)));shade.setSize(1420,990);results.addActor(shade);
        String title=switch(result.outcome()){case "IMPOSTOR_ESCAPED"->"ИМПОСТОР СКРЫЛСЯ";case "NO_CONSENSUS"->"НЕТ ЕДИНОГО РЕШЕНИЯ";default->"ИМПОСТОР РАСКРЫТ";};
        Label heading=text(title,Color.valueOf("ECD6B2"),1.7f,50,900,1320,70);heading.setName("impostorResultTitle");results.addActor(heading);
        Map<String,RoomSession.Player> players=new LinkedHashMap<>();for(var p:roster)players.put(p.player().id(),p.player());
        results.addActor(text("ИМПОСТОР: "+name(players,result.impostorId())+"  ·  ПОБЕДИЛИ: "+(result.winningSide().name().equals("IMPOSTOR")?"ИМПОСТОР":"МИРНЫЕ"),Color.valueOf("DD9D81"),1,70,840,1280,58));
        float width=250,height=250f*1353/1162;float gap=32;float left=(1420-roster.size()*width-(roster.size()-1)*gap)/2;
        for(int i=0;i<roster.size();i++){
            var player=roster.get(i).player();var status=result.participant(player.id());if(status==null)continue;
            Group card=new Group();card.setName("resultParticipant:"+player.id());card.setBounds(left+i*(width+gap),470,width,height);card.setOrigin(width/2,height/2);
            boolean impostor=player.id().equals(result.impostorId());if(impostor){
                card.setScale(1.04f);
                for(float[] edge:new float[][]{{-3,-3,width+6,3},{-3,height,width+6,3},{-3,0,3,height},{width,0,3,height}}){
                    Image outline=new Image(solid.tint(Color.valueOf("B94B42")));outline.setBounds(edge[0],edge[1],edge[2],edge[3]);card.addActor(outline);
                }
            }
            assets.texture(ImpostorAsset.SUSPECT_PAPER).ifPresent(t->{Image paper=new Image(t);paper.setSize(width,height);paper.setColor(impostor?Color.valueOf("FFD1AB"):Color.WHITE);card.addActor(paper);});
            Actor avatar=avatars.apply(player);if(avatar!=null && avatar.getWidth()>0 && avatar.getHeight()>0){Group fit=new Group();float scale=Math.min(90/avatar.getWidth(),55/avatar.getHeight());fit.setPosition(125-avatar.getWidth()*scale/2,175);fit.setScale(scale);avatar.setPosition(0,0);fit.addActor(avatar);card.addActor(fit);}
            Label nickname=text(player.name(),Color.valueOf("352116"),.9f,25,240,200,40);nickname.setWrap(false);nickname.setEllipsis("...");card.addActor(nickname);
            card.addActor(text(status.role().equals("IMPOSTOR")?"ИМПОСТОР":"МИРНЫЙ",Color.valueOf(impostor?"851B29":"352116"),.75f,25,145,200,35));
            card.addActor(text(status.winner()?"ПОБЕДА":"ПОРАЖЕНИЕ",Color.valueOf("352116"),.85f,25,112,200,35));
            card.addActor(text("ГОЛОСОВ: "+status.votesReceived(),Color.valueOf("352116"),.7f,25,82,200,30));
            for(int n=0;n<status.votesReceived();n++){final int slot=n;assets.texture(ImpostorAsset.STAMP_MARK).ifPresent(t->{Image mark=new Image(t);mark.setName("resultStamp:"+player.id()+":"+slot);mark.setBounds(40+slot*57,25,43,43f*t.getHeight()/t.getWidth());mark.setColor(.58f,.16f,.18f,.95f);card.addActor(mark);});}
            results.addActor(card);
        }
        var st=result.statistics();
        Label stats=text("ИТОГИ ИГРЫ\nУЧАСТНИКИ: "+st.activeParticipants()+"\nРАУНДЫ: "+st.completedRounds()+"\nСЛОВА: "+st.submittedClues()+"\nПРИНЯТО ГОЛОСОВ: "+st.validVotes()+"\nВОЗДЕРЖАЛИСЬ: "+st.abstentions()+"\nБОЛЬШЕ ВСЕГО ГОЛОСОВ: "+names(players,result.mostVoted()),Color.valueOf("E0D2BF"),.78f,25,155,400,265);stats.setAlignment(Align.topLeft);stats.setName("impostorStatistics");results.addActor(stats);
        StringBuilder history=new StringBuilder("КТО ЗА КОГО ГОЛОСОВАЛ\n");for(var entry:result.ballots().entrySet())history.append(name(players,entry.getKey())).append(" -> ").append(name(players,entry.getValue())).append('\n');
        history.append("\nВОЗДЕРЖАЛИСЬ\n").append(result.abstentions().isEmpty()?"НЕТ":names(players,result.abstentions()));
        Label votes=text(history.toString(),Color.valueOf("E0D2BF"),.75f,435,155,425,265);votes.setAlignment(Align.topLeft);votes.setName("impostorVotingHistory");scroll(votes);
        StringBuilder rounds=new StringBuilder();for(int r=0;r<result.clueRounds().size();r++){rounds.append("РАУНД ").append(r+1).append('\n');for(var player:roster)rounds.append(shortName(player.player().name())).append(": ").append(result.clueRounds().get(r).getOrDefault(player.player().id(),"—")).append('\n');}
        Label clues=text(rounds.toString(),Color.valueOf("E0D2BF"),.64f,890,135,500,305);clues.setAlignment(Align.topLeft);clues.setName("impostorRoundSummary");scroll(clues);
        defaultStatus=host?"Игра завершена. Можно сыграть ещё раз или вернуться в комнату.":"Ожидаем ведущего…";message.setText(defaultStatus);
    }
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
    @Override public void dispose(){pixel.dispose();}
}
