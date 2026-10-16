package com.erni.finalanswer.rooms;
import java.security.SecureRandom;
import com.erni.finalanswer.rooms.RoomCodeGenerator;
public class RoomCodeGenerator {

    
    private static final String ALPHABET =  "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    private static final int CODE_LENGTH = 4;

    private static final SecureRandom RANDOM = new SecureRandom();

    private RoomCodeGenerator() {
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


