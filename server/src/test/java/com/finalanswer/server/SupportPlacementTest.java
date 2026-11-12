package com.finalanswer.server;
import com.erni.finalanswer.gameplay.forgottenroom.SupportPlacement;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
class SupportPlacementTest {
    final float[][] table={{0,0},{4,0},{4,2},{0,2}};
    @Test void supportedBaseKeepsItsRequestedPosition(){var f=SupportPlacement.fit(table,2,1,-.3f,.3f,-.2f,.2f);assertEquals(2,f.x(),.001);assertEquals(1,f.z(),.001);assertEquals(1,f.scale());}
    @Test void overhangingBaseMovesFullyOntoTable(){var f=SupportPlacement.fit(table,3.95f,.1f,-.4f,.4f,-.3f,.3f);assertTrue(f.x()+.4f<=4);assertTrue(f.z()-.3f>=0);assertEquals(1,f.scale());}
    @Test void oversizedBaseIsReducedUntilItFits(){var f=SupportPlacement.fit(table,2,1,-1,1,-1.5f,1.5f);assertTrue(f.scale()<1);assertTrue(f.z()-1.5f*f.scale()>=0);assertTrue(f.z()+1.5f*f.scale()<=2);}
    @Test void reversedPolygonWindingWorks(){float[][] reversed={{0,2},{4,2},{4,0},{0,0}};var f=SupportPlacement.fit(reversed,3.95f,.1f,-.4f,.4f,-.3f,.3f);assertTrue(f.x()+.4f<=4);assertTrue(f.z()-.3f>=0);}
}
