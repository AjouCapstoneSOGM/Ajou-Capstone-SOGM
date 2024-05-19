package com.example.eta.util;

/**
 * 여러 레이어에서 공통적으로 사용되는 메소드를 모아놓은 클래스입니다.
 */
public class Utility {
    /**
     * 한글을 자모 단위로 분해합니다.
     * <p> 출처: https://wordbe.tistory.com/291
     *
     * @param string 분해할 문자열
     * @return 분해된 문자열
     */
    public static String decompose(String string) {
        String[] arr_cho =
                {"ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"};
        String[] arr_jung =
                {"ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"};
        String[] arr_jong =
                {"", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"};

        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < string.length(); i++) {
            char uniVal = string.charAt(i);

            try {
                if (uniVal >= 0xAC00 && uniVal <= 0xD7A3) {
                    uniVal = (char) (uniVal - 0xAC00);
                    char cho = (char) (uniVal / 28 / 21);
                    char jung = (char) (uniVal / 28 % 21);
                    char jong = (char) (uniVal % 28);
                    stringBuilder.append(arr_cho[cho]);
                    stringBuilder.append(arr_jung[jung]);
                    stringBuilder.append(arr_jong[jong]);
                } else {
                    stringBuilder.append(uniVal);
                }
            } catch (RuntimeException e) {
                stringBuilder.append(uniVal);
            }
        }
        return stringBuilder.toString();
    }
}
