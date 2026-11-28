package com.finalanswer.server.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import java.nio.file.Path;
import static org.junit.jupiter.api.Assertions.*;

class LearnedAnswersTest {
    static final CategoryPack PACK=CategoryPack.load();
    @Test void aVoteIsRememberedAcrossRestarts(@TempDir Path dir) throws Exception{
        Path f=dir.resolve("learned.json");var cat=PACK.get("music_bands");
        var learned=new LearnedAnswers(f);var e=new ValidationEngine(new WordDictionary(),ValidationCache.NONE,null,learned);
        String key=AnswerInput.of("Синие Помидоры Шесть").key();
        assertNotEquals(ValidationStatus.VALID,e.validate(cat,AnswerInput.of("Синие Помидоры Шесть")).status());
        e.learn(cat,key,"Синие Помидоры Шесть",3,1,"game1");
        assertNotEquals(ValidationStatus.VALID,e.validate(cat,AnswerInput.of("Синие Помидоры Шесть")).status(),"one game is not enough to teach an answer");
        e.learn(cat,key,"Синие Помидоры Шесть",3,1,"game1");
        assertNotEquals(ValidationStatus.VALID,e.validate(cat,AnswerInput.of("Синие Помидоры Шесть")).status(),"the same game twice still counts once");
        e.learn(cat,key,"Синие Помидоры Шесть",4,0,"game2");
        assertEquals(ValidationStatus.VALID,e.validate(cat,AnswerInput.of("Синие Помидоры Шесть")).status());
        e.learn(cat,AnswerInput.of("Абырвалг").key(),"Абырвалг",0,3);
        assertEquals(ValidationStatus.INVALID,e.validate(cat,AnswerInput.of("Абырвалг")).status());
        e.learn(cat,AnswerInput.of("Тихо").key(),"Тихо",1,1);   // split room: not learned
        e.learn(cat,AnswerInput.of("Один").key(),"Один",2,0);   // two voters: not learned
        e.learn(cat,AnswerInput.of("Почти").key(),"Почти",3,2,"g"); // no two thirds majority: not learned
        assertNull(learned.pending(cat.id(),AnswerInput.of("Почти").key()));
        assertNull(learned.get(cat.id(),AnswerInput.of("Тихо").key()));assertNull(learned.get(cat.id(),AnswerInput.of("Один").key()));
        for(int i=0;i<50&&!java.nio.file.Files.exists(f);i++)Thread.sleep(20);
        var reloaded=new LearnedAnswers(f);
        assertTrue(reloaded.get(cat.id(),key).accepted());
        assertEquals(ValidationStatus.VALID,new ValidationEngine(new WordDictionary(),ValidationCache.NONE,null,reloaded).validate(cat,AnswerInput.of("синие помидоры шесть")).status());
    }
}
