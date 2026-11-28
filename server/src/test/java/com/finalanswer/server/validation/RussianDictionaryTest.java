package com.finalanswer.server.validation;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

/** The bundled Russian word list (Hunspell ru_RU by A. Lebedev, BSD style licence): common words known, made up ones not. */
class RussianDictionaryTest {
    @Test void knowsRussianWords(){
        var d=new WordDictionary();
        for(String w:new String[]{"жираф","кошка","ножницы","ежик","ёжик","самолет"})assertTrue(d.knows("ru",AnswerInput.key(w)),w);
        for(String w:new String[]{"абвгд","жжжжж","москва"})assertFalse(d.knows("ru",AnswerInput.key(w)),w);
    }
}
