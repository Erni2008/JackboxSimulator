package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.scenes.scene2d.*;
import com.erni.finalanswer.impostor.*;
import java.util.List;

/** Deterministic empty-paper fixtures and development controls. Never packaged in production. */
public final class ImpostorPreviewData {
    private ImpostorPreviewData() {}

    public static List<ImpostorParticipant> participants(int count) {
        return participants(count, false);
    }

    public static List<ImpostorParticipant> participants(int count, boolean secondGroup) {
        if(count<2||count>8)throw new IllegalArgumentException("Presentation preview supports 2–8 participants");
        String[] names = {"Luna", "Shadow", "Mira", "Nyx", "Vesper", "Kronos", "Morrow", "Raven"};
        var result = new java.util.ArrayList<ImpostorParticipant>();
        for (int i=0; i<count; i++) result.add(new ImpostorParticipant(
            new com.erni.finalanswer.rooms.RoomSession.Player("preview-"+i, names[i], false, (secondGroup ? new String[]{"skeleton","zombie","pumpkin","voodoo","ghost","dracula","plague_doctor","puppeteer"} : new String[]{"ghost","dracula","plague_doctor","puppeteer","skeleton","zombie","pumpkin","voodoo"})[i], "ONLINE", false, 0),
            List.of("", "", "")));
        return List.copyOf(result);
    }

    /** Deterministic fixture values keyed by identity, never by nickname or row position. */
    public static java.util.Map<String, String> clues(int round, List<ImpostorParticipant> participants) {
        if (round < 1 || round > 3) return java.util.Map.of();
        String[][] words = {{"ТЕПЛО", "СОЛНЦЕ", "ЛЕТО"}, {"ДВИЖЕНИЕ", "ДОРОГА", "СКОРОСТЬ"},
                {"СВЕТ", "ЯРКОСТЬ", "ЛАМПА"}, {"СВОБОДА", "НЕБО", "ПОЛЁТ"}};
        var result = new java.util.LinkedHashMap<String,String>();
        for (var participant : participants) {
            for (int i=0; i<words.length; i++)
                if (participant.player().id().equals("preview-"+i)) result.put(participant.player().id(), words[i][round-1]);
        }
        return result;
    }

    /** Install only in the dev/test classpath; no production screen handles F3/F4. */
    public static ImpostorSuspicionPreview installControls(ImpostorScreen screen) {
        var suspicion=new ImpostorSuspicionPreview(screen);
        // The screen's active input processor is its Stage after show().
        screen.addPreviewListener(new InputListener() {
            private boolean secondGroup;
            @Override public boolean keyDown(InputEvent event, int key) {
                switch (key) {
                    case com.badlogic.gdx.Input.Keys.F3 -> { suspicion.cancel();screen.setParticipants(participants(3, secondGroup)); }
                    case com.badlogic.gdx.Input.Keys.F4 -> { suspicion.cancel();screen.setParticipants(participants(4, secondGroup)); }
                    case com.badlogic.gdx.Input.Keys.F6 -> {suspicion.cancel();screen.setParticipants(participants(screen.participants().size()==8?2:screen.participants().size()+1,secondGroup));}
                    case com.badlogic.gdx.Input.Keys.F5 -> { suspicion.cancel();secondGroup=!secondGroup;screen.setParticipants(participants(4,secondGroup)); }
                    case com.badlogic.gdx.Input.Keys.R -> screen.revealClues(clues(screen.revealedRoundCount()+1, screen.participants()));
                    case com.badlogic.gdx.Input.Keys.B -> screen.flipPapersBack();
                    case com.badlogic.gdx.Input.Keys.N -> { suspicion.cancel();screen.resetPapers(); }
                    case com.badlogic.gdx.Input.Keys.V -> suspicion.start();
                    case com.badlogic.gdx.Input.Keys.F,com.badlogic.gdx.Input.Keys.D -> {suspicion.cancel();return false;}
                    default -> { return false; }
                }
                return true;
            }
        });
        return suspicion;
    }

}
