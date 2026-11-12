package com.finalanswer.server;

import com.erni.finalanswer.gameplay.forgottenroom.*;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class GreenhouseSceneTest {
    @Test void greenhouseReplacesLibraryWithoutUnfinishedRounds(){
        var scene=RoomCatalog.GREENHOUSE_SCENE;
        assertEquals("greenhouse",RoomCatalog.LAYOUTS.get(1).id());
        assertEquals("forgotten_room/rooms/room_02.jpg",scene.background());
        assertFalse(scene.readyForRounds());
        assertEquals(24,scene.objects().size());
        assertTrue(scene.objects().stream().allMatch(RoomSceneDefinition.Prop::enabled));
        assertTrue(RoomCatalog.GREENHOUSE.staging().isEmpty());
        assertThrows(IllegalArgumentException.class,()->RoomGenerator.generate(1,RoomDifficulty.EASY,RoomCatalog.GREENHOUSE));
        for(var d:RoomDifficulty.values())for(int i=0;i<50;i++)assertEquals("study",RoomGenerator.generate(i,d).layout().id());
    }
    @Test void everyPreparedAnchorNamesTheCorrectSupport(){
        var scene=RoomCatalog.GREENHOUSE_SCENE;scene.validate();
        for(var anchor:scene.slots()){
            var surface=scene.surfaces().stream().filter(s->s.id().equals(anchor.surfaceId())).findFirst().orElseThrow();
            assertEquals(surface.kind(),anchor.surface());
        }
    }
}
