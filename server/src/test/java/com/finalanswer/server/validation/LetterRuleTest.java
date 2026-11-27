package com.finalanswer.server.validation;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class LetterRuleTest {
    static final CategoryPack PACK=CategoryPack.load();
    static final ValidationEngine E=ValidationEngine.deterministic(new WordDictionary());
    static ValidationStatus s(String cat,String text){return E.validate(PACK.get(cat),AnswerInput.of(text)).status();}
    @Test void newLetterRules(){
        assertEquals(ValidationStatus.VALID,s("rivers_six_letters_max_ru","Волга"));
        assertEquals(ValidationStatus.VALID,s("rivers_six_letters_max_ru","Енисей"));
        assertEquals(ValidationStatus.INVALID,s("rivers_six_letters_max_ru","Амазонка")); // 8 letters
        assertNotEquals(ValidationStatus.VALID,s("words_soft_sign_middle_ru","конь"));   // soft sign at the end
        assertNotEquals(ValidationStatus.VALID,s("words_three_consonants_ru","мама"));
        assertNotEquals(ValidationStatus.VALID,s("words_without_a_ru","мама"));
        assertNotEquals(ValidationStatus.VALID,s("words_zh_and_a_ru","жук"));      // no А
        assertNotEquals(ValidationStatus.VALID,s("words_note_start_ru","кот"));    // no note at the start
        assertEquals(ValidationStatus.INVALID,s("countries_two_n_ru","Россия"));   // no Н at all
        assertEquals(ValidationStatus.INVALID,s("cities_starting_s_ru","Москва"));
    }
}
