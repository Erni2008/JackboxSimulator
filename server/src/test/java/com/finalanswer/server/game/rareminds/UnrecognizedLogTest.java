package com.finalanswer.server.game.rareminds;

import org.junit.jupiter.api.Test;
import java.nio.file.*;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;

class UnrecognizedLogTest {
    @Test void unrecognisedAnswersAreCountedOnDisk() throws Exception{
        Path dir=Files.createTempDirectory("rm");var store=new RarityStats.FileStore(dir.resolve("stats.json"));
        store.recordUnknown("medicine",List.of("Nurofen Plus","nurofen plus","Магний B6"));
        store.recordUnknown("medicine",List.of("nurofen plus"));
        String json=Files.readString(dir.resolve("rare_minds_unrecognized.json"));
        assertTrue(json.contains("\"nurofen plus\":3"),json);assertTrue(json.contains("магний b6"),json);
    }
}
