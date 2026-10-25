package com.finalanswer.server;

import com.finalanswer.protocol.Protocol;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import static com.finalanswer.server.RoomServiceTest.*;

class ImpostorHintTest {
    @Test void hintIsPrivateStableAndDoesNotReplaceTheInnocentsWord(){
        var room=new ImpostorSettingsTest.Room();room.start();int impostor=-1;
        for(int i=0;i<room.peers.size();i++){
            var state=room.peers.get(i).latest().getAsJsonObject("impostor");
            if(i>=3){assertFalse(state.has("wordHint"));assertFalse(state.has("secretWord"));continue;}
            if(s(state,"role").equals("IMPOSTOR")){
                impostor=i;assertEquals("Еда",s(state,"wordHint"));assertFalse(state.has("secretWord"));
            }else{assertEquals("ЯБЛОКО",s(state,"secretWord"));assertFalse(state.has("wordHint"));}
        }
        assertTrue(impostor>=0);assertFalse(room.mini().has("wordHint"));
        assertFalse(Protocol.JSON.toJson(room.rooms.view(room.code)).contains("wordHint"));
        var restored=new TestPeer();room.rooms.attach(room.code,s(room.players.get(impostor),"token"),restored,"hint-reconnect");
        assertEquals("Еда",s(restored.latest().getAsJsonObject("impostor"),"wordHint"));
        room.advance(com.finalanswer.server.game.ImpostorSession.ROLE_MILLIS);
        assertEquals("Еда",s(restored.latest().getAsJsonObject("impostor"),"wordHint"));
        assertFalse(restored.latest().getAsJsonObject("impostor").has("secretWord"));
    }
    @Test void everyBuiltInWordHasABroadHintAndUnknownWordsDoNotLeak(){
        for(String word:java.util.List.of("ЯБЛОКО","ОКЕАН","МУЗЫКА","КОСМОС","САМОЛЁТ","НЕИЗВЕСТНОЕ","ПРЕДМЕТ","АССОЦИАЦИЯ")){
            com.finalanswer.server.game.WordSource source=random->word;
            String hint=source.hint(word);assertNotNull(hint);assertTrue(hint.length()>=2&&hint.length()<=72);
            assertFalse(hint.toUpperCase(java.util.Locale.ROOT).contains(word));
        }
    }
}
