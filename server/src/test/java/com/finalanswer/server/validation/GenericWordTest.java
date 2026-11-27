package com.finalanswer.server.validation;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class GenericWordTest {
    static final CategoryPack PACK=CategoryPack.load();
    static final ValidationEngine E=ValidationEngine.deterministic(new WordDictionary());
    static Verdict v(String cat,String text){return E.validate(PACK.get(cat),AnswerInput.of(text));}
    @Test void genericWordAroundAnAnswer(){
        assertEquals(ValidationStatus.VALID,v("seas","морее черное").status());
        assertEquals(ValidationStatus.VALID,v("seas","море чёрное").status());
        assertEquals(ValidationStatus.VALID,v("cheese_types","syr chedder").status());
        assertEquals(ValidationStatus.VALID,v("japanese_dishes","роллы калифорния").status());
        assertNotEquals(ValidationStatus.VALID,v("seas","озеро байкал").status());
        assertNotEquals(ValidationStatus.VALID,v("programming_languages","Java coffee").status()); // coffee is not a programming language
        assertNotEquals(ValidationStatus.VALID,v("ocean_things","Eel river").status());
    }
}
