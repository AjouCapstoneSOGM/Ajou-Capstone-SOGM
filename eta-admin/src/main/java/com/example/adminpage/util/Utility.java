package com.example.adminpage.util;

public class Utility {
    private static final int STRING_LENGTH = 10;

    public static String generateRandomString() {
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < STRING_LENGTH ; i++) {
            int random = (int) (Math.random() * 3);
            switch (random) {
                case 0:
                    stringBuilder.append((char) ((int) (Math.random() * 26) + 65));
                    break;
                case 1:
                    stringBuilder.append((char) ((int) (Math.random() * 26) + 97));
                    break;
                case 2:
                    stringBuilder.append((int) (Math.random() * 10));
                    break;
            }
        }
        return stringBuilder.toString();
    }
}
