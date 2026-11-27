package com.finalanswer.server.validation;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class NumericRuleTest {
    static final CategoryPack PACK=CategoryPack.load();
    static final ValidationEngine E=ValidationEngine.deterministic(new WordDictionary());
    static boolean ok(String cat,String text){return E.validate(PACK.get(cat),AnswerInput.of(text)).status()==ValidationStatus.VALID;}
    @Test void newNumberConditions(){
        assertTrue(ok("palindrome_100_999","121"));assertTrue(ok("palindrome_100_999","999"));
        assertFalse(ok("palindrome_100_999","123"));assertFalse(ok("palindrome_100_999","1221"));assertFalse(ok("palindrome_100_999","77"));
        assertTrue(ok("has_seven_1_100","7"));assertTrue(ok("has_seven_1_100","70"));assertTrue(ok("has_seven_1_100","97"));
        assertFalse(ok("has_seven_1_100","107"));assertFalse(ok("has_seven_1_100","12"));
        assertTrue(ok("digit_sum_10","109"));assertTrue(ok("digit_sum_10","550"));
        assertFalse(ok("digit_sum_10","19"));assertFalse(ok("digit_sum_10","111"));
        assertTrue(ok("first_digit_bigger","21"));assertTrue(ok("first_digit_bigger","90"));
        assertFalse(ok("first_digit_bigger","12"));assertFalse(ok("first_digit_bigger","33"));assertFalse(ok("first_digit_bigger","210"));
        assertTrue(ok("div4_not8","4"));assertTrue(ok("div4_not8","12"));assertTrue(ok("div4_not8","100"));
        assertFalse(ok("div4_not8","8"));assertFalse(ok("div4_not8","16"));assertFalse(ok("div4_not8","6"));assertFalse(ok("div4_not8","108"));
        assertFalse(ok("has_seven_1_100","007")); // no leading zeros
    }
}
