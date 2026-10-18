package com.erni.finalanswer.rooms;
import java.security.SecureRandom;

public class RoomCodeGenerator {

    
    private static final String ALPHABET =  "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    public static final int CODE_LENGTH = 6;

    private static final SecureRandom RANDOM = new SecureRandom();

    private RoomCodeGenerator() {
    }

    public static boolean isValid(String code) {
        return code != null && code.length() == CODE_LENGTH
                && code.chars().allMatch(symbol -> ALPHABET.indexOf(symbol) >= 0);
    }

    public static String generate() {
        StringBuilder code = new StringBuilder(CODE_LENGTH);

        for (int i = 0; i < CODE_LENGTH; i++) {
            int index = RANDOM.nextInt(ALPHABET.length());
            char symbol = ALPHABET.charAt(index);

            code.append(symbol);
        }

        return code.toString();
    }
}


