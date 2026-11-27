package com.finalanswer.server.validation;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class DiminutiveTest {
    @Test void findsTheStemOfDiminutivesAndSlang(){
        assertTrue(Diminutive.candidates("щучка").contains(Diminutive.stem("щука")));
        assertTrue(Diminutive.candidates("пультик").contains(Diminutive.stem("пульт")));
        assertTrue(Diminutive.candidates("грибочки").contains(Diminutive.stem("грибы")));
        assertTrue(Diminutive.candidates("зомбаки").contains(Diminutive.stem("зомби")));
        assertTrue(Diminutive.candidates("зелененький").contains(Diminutive.stem("зеленый")));
    }
    @Test void onlyRussianWordsOfFourLettersOrMore(){
        assertTrue(Diminutive.candidates("cat").isEmpty());
        assertTrue(Diminutive.candidates("кот").isEmpty());
        assertNull(Diminutive.stem("pult"));
    }
    @Test void aCandidateIsNeverAcceptedWithoutTheAi(){
        // "футболка" looks like футбол + ка: the engine only asks the AI, it never decides alone
        var engine=ValidationEngine.deterministic(new WordDictionary());
        var c=CategoryPack.load().get("ball_sports");
        assertNotEquals(ValidationStatus.VALID,engine.validate(c,AnswerInput.of("футболка")).status());
    }
}
