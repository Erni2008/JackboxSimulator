package com.erni.finalanswer.impostor;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.GlyphLayout;
import com.badlogic.gdx.scenes.scene2d.Actor;
import com.badlogic.gdx.scenes.scene2d.Group;
import com.badlogic.gdx.scenes.scene2d.ui.Image;
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.utils.Align;
import com.badlogic.gdx.scenes.scene2d.Touchable;
import java.util.List;

/** Independent portrait and paper assembly. Text and images borrow screen-owned resources. */
public final class ImpostorParticipantView extends Group {
    public static final float WIDTH = 360, HEIGHT = 320;
    public static final float PAPER_WIDTH = 152, PAPER_HEIGHT = PAPER_WIDTH * 1404 / 1120;
    public static final ImpostorLayout.Bounds AVATAR_OPENING = new ImpostorLayout.Bounds(0, 40, 194, 275);
    public static final ImpostorLayout.Bounds NAMEPLATE = new ImpostorLayout.Bounds(0, 6, 194, 30);
    private double idleTime;
    private String playerId;
    public String playerId(){return playerId;}
    private ImpostorElimination elimination;
    private Label eliminationLabel;
    private float portraitY=Float.NaN;
    public void updatePortrait(float delta,boolean reduced){updatePortrait(delta,reduced,-1);}
    public void updatePortrait(float delta,boolean reduced,float eliminatedAge){
        Actor avatar=findActor("avatar");if(avatar==null)return;
        if(Float.isNaN(portraitY))portraitY=avatar.getY();
        if(Float.isFinite(delta))idleTime=(idleTime+Math.max(0,delta))%100;
        elimination.apply(eliminatedAge,reduced,reduced?0:(float)Math.sin(idleTime*.7)*.65f);
        eliminationLabel.setVisible(eliminatedAge>=.6f);
    }
    private final boolean hasPaper;
    private final Group paper = new Group();
    private final Image front;
    private final Image back;
    private PaperFlipState paperState = PaperFlipState.FACE_DOWN;
    public PaperFlipState paperState() { return paperState; }
    private final Label[] lines = new Label[3];
    private final GlyphLayout measurement = new GlyphLayout();
    private final BitmapFont font;

    public ImpostorParticipantView(ImpostorParticipant participant, Actor avatar,
                                   ImpostorAssets assets, BitmapFont font) {
        this(participant, avatar, assets, font, font);
    }

    public ImpostorParticipantView(ImpostorParticipant participant, Actor avatar,
                                   ImpostorAssets assets, BitmapFont font, BitmapFont nicknameFont) {
        this.font = font;
        playerId=participant.player().id();setName("participant:" + playerId);
        setSize(WIDTH, HEIGHT);
        setOrigin(0, 0);
        // Character and nickname occupy the left lane; clue parchment keeps its existing right lane.
        if (avatar != null) {
            Group portrait = new Group();
            portrait.setName("avatar");
            float scale = Math.min(AVATAR_OPENING.width()/avatar.getWidth(), AVATAR_OPENING.height()/avatar.getHeight());
            portrait.setBounds(AVATAR_OPENING.x()+(AVATAR_OPENING.width()-avatar.getWidth()*scale)/2,
                    AVATAR_OPENING.y()+(AVATAR_OPENING.height()-avatar.getHeight()*scale)/2,
                    avatar.getWidth(), avatar.getHeight());
            portrait.setScale(scale);
            avatar.setPosition(0, 0);
            portrait.addActor(avatar);
            addActor(portrait);elimination=new ImpostorElimination(portrait);
        }
        eliminationLabel=new Label("ELIMINATED",new Label.LabelStyle(font,Color.valueOf("D89A9F")));eliminationLabel.setName("eliminationStatus");eliminationLabel.setFontScale(.5f);eliminationLabel.setAlignment(Align.center);eliminationLabel.setBounds(0,-14,194,20);eliminationLabel.setVisible(false);addActor(eliminationLabel);
        Label nickname = new Label(participant.player().name(), new Label.LabelStyle(nicknameFont,
                com.erni.finalanswer.ui.PlayerColors.light(participant.player().characterId())));
        nickname.setName("nickname");
        nickname.setAlignment(Align.center);
        nickname.setBounds(NAMEPLATE.x(), NAMEPLATE.y(), NAMEPLATE.width(), NAMEPLATE.height());
        measurement.setText(nicknameFont, participant.player().name());
        float nameScale=Math.min(1,Math.min((NAMEPLATE.width()-8)/Math.max(1,measurement.width),
                (NAMEPLATE.height()-4)/Math.max(1,measurement.height)));
        nickname.setFontScale(nameScale);
        Label shadow = new Label(participant.player().name(), new Label.LabelStyle(nicknameFont, new Color(.015f,.008f,.008f,.9f)));
        shadow.setName("nicknameShadow");shadow.setAlignment(Align.center);shadow.setFontScale(nameScale);
        shadow.setBounds(NAMEPLATE.x()+1.2f,NAMEPLATE.y()-1.2f,NAMEPLATE.width(),NAMEPLATE.height());
        addActor(shadow);addActor(nickname);
        paper.setName("paper");
        paper.setBounds(208, 28, PAPER_WIDTH, PAPER_HEIGHT);
        paper.setOrigin(PAPER_WIDTH/2, PAPER_HEIGHT/2);
        addActor(paper);
        paper.setTouchable(Touchable.disabled);
        front = paperImage(assets, ImpostorAsset.PAPER_FRONT, "paperFront");
        back = paperImage(assets, ImpostorAsset.PAPER_BACK, "paperBack");
        if (front != null) front.setVisible(false);
        // Omit ink if the parchment failed; never substitute unrelated artwork.
        hasPaper = assets.isAvailable(ImpostorAsset.PAPER_FRONT);
        for (int i=0; i<3; i++) {
            lines[i] = label("", Color.valueOf("352116"));
            lines[i].setName("clue" + i);
            lines[i].setBounds(27, 115-i*33, 98, 32);
            lines[i].setVisible(false);
        }
        for (Label line : lines) paper.addActor(line);
        setClues(participant.clues());
    }

    private Label label(String text, Color color) {
        Label label = new Label(text, new Label.LabelStyle(font, color));
        label.setAlignment(Align.center);
        return label;
    }

    private Image paperImage(ImpostorAssets assets, ImpostorAsset asset, String name) {
        var texture = assets.texture(asset).orElse(null);
        if (texture == null) return null;
        Image image = new Image(texture);
        image.setScaling(com.badlogic.gdx.utils.Scaling.fit);
        image.setName(name);
        image.setSize(PAPER_WIDTH, PAPER_HEIGHT);
        paper.addActor(image);
        return image;
    }

    /** All views receive the same already-updated timeline, including their text surface. */
    public void presentPaper(PaperRevealController reveal) {
        paperState = reveal.state();
        float width = reveal.widthScale();
        paper.setScale(width, 1);
        boolean showFront = reveal.frontVisible();
        if (front != null) front.setVisible(showFront);
        if (back != null) back.setVisible(!showFront);
        for (int i=0; i<lines.length; i++)
            {lines[i].setVisible(hasPaper && showFront && width > 0 && i < reveal.round());
            lines[i].getColor().a=reveal.flipping()&&showFront?(float)Math.min(1,Math.max(0,(reveal.progress()-.5)*4)):1;}
    }

    /** Replaces one slot without erasing already revealed rounds. Blank/missing input is a dash. */
    public void setClue(int slot, String clue) {
        if (slot < 0 || slot >= lines.length) throw new IllegalArgumentException("Clue slot must be 0..2");
        String text = clue == null || clue.isBlank() ? "—" : clue.strip();
        fitClue(slot, text);
    }

    private void fitClue(int slot, String text) {
        Label line = lines[slot];
        line.setFontScale(1);
        measurement.setText(font, text);
        float scale = Math.min(22f/24, line.getWidth()/Math.max(1, measurement.width));
        line.setFontScale(scale);
        line.setText(text);
    }

    /** Updates only text/layout, retaining the original paper texture and actors. */
    public void setClues(List<String> clues) {
        if (clues.size() != 3) throw new IllegalArgumentException("Exactly three clue lines required");
        for (String clue : clues) java.util.Objects.requireNonNull(clue, "clue");
        for (int i=0; i<3; i++) fitClue(i, clues.get(i));
    }
}
